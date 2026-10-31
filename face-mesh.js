// =============================================================================
//  face-mesh.js — the homepage hero: Gourav's portrait as a live 3D point mesh
//
//  · assets/face/color.webp  — background-removed portrait (RGBA)
//  · assets/face/depth.png   — monocular depth (L) + matte (A), same size
//  The two are sampled on a grid into ~20–40k points (plus a wireframe that
//  links each point to its right / lower neighbour), displaced in z by depth.
//
//  Interaction: points assemble from a scattered cloud on load, the head turns
//  toward the cursor, points near the cursor lift and glow, a scan line sweeps
//  the face, and scrolling past the hero dissolves the face into a drifting
//  field that stays behind the rest of the page.
//
//  Mount: <canvas data-face-mesh></canvas> (fixed, full-viewport).
// =============================================================================
import * as THREE from 'three';

const canvas = document.querySelector('[data-face-mesh]');
if (canvas) init(canvas);

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
function pixels(img) {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  return g.getImageData(0, 0, c.width, c.height);
}

async function init(canvas) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = Math.min(innerWidth, innerHeight) < 700;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { document.documentElement.classList.add('no-webgl'); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const [cImg, dImg] = await Promise.all([
    loadImage('assets/face/color.webp'),
    loadImage('assets/face/depth.png'),
  ]).catch(() => [null, null]);
  if (!cImg || !dImg) return;
  const C = pixels(cImg), D = pixels(dImg);
  const W = C.width, H = C.height;

  // ---- sample the grid ----
  const step = small ? 3 : 2;
  const cols = Math.floor(W / step), rows = Math.floor(H / step);
  const idx = new Int32Array(cols * rows).fill(-1);
  const pos = [], col = [], rnd = [], seed = [];
  const scale = 2.3 / W;                     // face ≈ 2.3 units wide
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * step, y = r * step, i = (y * W + x) * 4;
      const a = D.data[i + 3];
      if (a < 140) continue;
      const z = D.data[i] / 255;
      idx[r * cols + c] = pos.length / 3;
      // tiny jitter so the grid never reads as pixels
      pos.push((x - W / 2) * scale + (Math.random() - 0.5) * scale * step * 0.5,
               -(y - H / 2) * scale + (Math.random() - 0.5) * scale * step * 0.5,
               z * 0.95);
      col.push(C.data[i] / 255, C.data[i + 1] / 255, C.data[i + 2] / 255);
      // scatter direction: mostly outward + random
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      rnd.push(Math.sin(ph) * Math.cos(th), Math.sin(ph) * Math.sin(th), Math.cos(ph));
      seed.push(Math.random());
    }
  }
  const lines = [];
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const a = idx[r * cols + c]; if (a < 0) continue;
      const right = idx[r * cols + c + 1], down = idx[(r + 1) * cols + c];
      // sparser wireframe: every other cell, skip big depth jumps
      if ((r + c) % 2) continue;
      if (right >= 0 && Math.abs(pos[a * 3 + 2] - pos[right * 3 + 2]) < 0.06) lines.push(a, right);
      if (down >= 0 && Math.abs(pos[a * 3 + 2] - pos[down * 3 + 2]) < 0.06) lines.push(a, down);
    }
  }

  const attrs = {
    position: new THREE.Float32BufferAttribute(pos, 3),
    aColor: new THREE.Float32BufferAttribute(col, 3),
    aRnd: new THREE.Float32BufferAttribute(rnd, 3),
    aSeed: new THREE.Float32BufferAttribute(seed, 1),
  };
  const gPts = new THREE.BufferGeometry();
  const gLin = new THREE.BufferGeometry();
  for (const k in attrs) { gPts.setAttribute(k, attrs[k]); gLin.setAttribute(k, attrs[k]); }
  gLin.setIndex(lines);

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(9, 9, 0) },
    uMouseStr: { value: 0 },
    uAssemble: { value: reduce ? 1 : 0 },
    uExplode: { value: 0 },
    uScan: { value: -2 },
    uSize: { value: small ? 3.4 : 2.6 },
    uPR: { value: renderer.getPixelRatio() },
    uAccent: { value: new THREE.Color('#ff5b2e') },
  };

  const shared = /* glsl */`
    uniform float uTime, uMouseStr, uAssemble, uExplode, uScan;
    uniform vec3 uMouse, uAccent;
    attribute vec3 aColor, aRnd;
    attribute float aSeed;
    varying vec3 vColor;
    varying float vGlow, vFade;
    vec3 displace(vec3 p0) {
      vec3 p = p0;
      // assemble from a scattered cloud
      float t = clamp(uAssemble * 1.5 - aSeed * 0.5, 0.0, 1.0);
      t = t * t * (3.0 - 2.0 * t);
      p = mix(aRnd * (3.5 + aSeed * 3.0), p, t);
      // breathing
      p.z += sin(uTime * 1.3 + p0.y * 7.0 + aSeed * 6.2831) * 0.01;
      // cursor: lift + push
      vec2 dv = p.xy - uMouse.xy;
      float inf = smoothstep(0.34, 0.0, length(dv)) * uMouseStr;
      p.z += inf * 0.32;
      p.xy += normalize(dv + 1e-4) * inf * 0.05;
      // scan line
      float scan = smoothstep(0.045, 0.0, abs(p0.y - uScan));
      // dissolve into a drifting field
      float e = uExplode;
      vec3 drift = vec3(sin(uTime * 0.15 + aSeed * 40.0), cos(uTime * 0.12 + aSeed * 30.0), sin(uTime * 0.1 + aSeed * 20.0)) * 0.6;
      p += (aRnd * (4.0 + aSeed * 7.0) + drift) * e;
      // colour: muted portrait, cursor + scan glow in accent
      float lum = dot(aColor, vec3(0.299, 0.587, 0.114));
      vec3 base = mix(vec3(lum) * vec3(0.92, 0.95, 1.05), aColor, 0.4) * 1.45 + 0.08;
      vGlow = max(inf, scan * 0.9);
      vColor = mix(base, uAccent * 1.2, vGlow * 0.85);
      vColor = mix(vColor, vec3(0.85), e * 0.6);
      vFade = t;
      return p;
    }
  `;

  const matPts = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: shared + /* glsl */`
      uniform float uSize, uPR;
      varying float vA;
      void main() {
        vec3 p = displace(position);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPR * (1.0 + vGlow * 1.6) * (6.0 / -mv.z) * (1.0 - uExplode * 0.35);
        vA = (0.55 + vGlow * 0.45) * vFade * (1.0 - uExplode * 0.55);
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vColor; varying float vA, vGlow;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.1, d) * vA;
        gl_FragColor = vec4(vColor, a);
      }`,
  });
  const matLin = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: shared + /* glsl */`
      varying float vA;
      void main() {
        vec3 p = displace(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        vA = (0.07 + vGlow * 0.5) * vFade * vFade * clamp(1.0 - uExplode * 3.0, 0.0, 1.0);
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vColor; varying float vA, vGlow;
      void main() { gl_FragColor = vec4(vColor, vA); }`,
  });

  const face = new THREE.Group();
  face.add(new THREE.LineSegments(gLin, matLin));
  face.add(new THREE.Points(gPts, matPts));
  scene.add(face);

  // ---- layout ----
  let vw = 1, vh = 1, baseX = 0, baseY = 0;
  function resize() {
    vw = innerWidth; vh = innerHeight;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    const wide = vw / vh > 1.05 && vw > 860;
    // visible half-width at z=0
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const halfW = halfH * camera.aspect;
    baseX = wide ? Math.min(halfW * 0.48, halfW - 1.3) : 0;
    baseY = wide ? -0.1 : halfH * 0.32;
    const s = wide ? Math.min(1, (halfH * 1.75) / 2.9) : Math.min(0.95, (halfW * 1.5) / 2.3, (halfH * 1.1) / 2.9);
    face.scale.setScalar(s);
    uniforms.uPR.value = renderer.getPixelRatio();
  }
  resize();
  addEventListener('resize', resize);

  // ---- input ----
  const ndc = new THREE.Vector2(0, 0);
  let hasMouse = false, lastMove = 0;
  addEventListener('pointermove', (e) => {
    ndc.set((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1);
    hasMouse = true; lastMove = performance.now();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { hasMouse = false; });

  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.5);
  const hit = new THREE.Vector3();

  let scrollP = 0;
  function onScroll() {
    const hero = document.querySelector('.xhero');
    const h = hero ? hero.offsetHeight : vh;
    scrollP = Math.min(1, Math.max(0, scrollY / (h * 0.85)));
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- loop ----
  const clock = new THREE.Clock();
  let rotX = 0, rotY = 0, explode = 0, mouseStr = 0, running = true, scanT = 1.2;
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) { clock.getDelta(); requestAnimationFrame(tick); }
  });

  function tick() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    uniforms.uTime.value = t;
    if (uniforms.uAssemble.value < 1) uniforms.uAssemble.value = Math.min(1, t / 2.6);

    // idle sway when no pointer (touch / first paint)
    const idle = !hasMouse || performance.now() - lastMove > 4000;
    const tx = idle ? Math.sin(t * 0.35) * 0.25 : ndc.x * 0.42;
    const ty = idle ? Math.sin(t * 0.27) * 0.08 : ndc.y * 0.22;
    rotY += (tx - rotY) * 0.06;
    rotX += (-ty - rotX) * 0.06;
    face.rotation.set(rotX, rotY + (baseX ? -0.18 : 0), 0);

    explode += ((reduce ? Math.min(scrollP, 0.9) : scrollP) - explode) * 0.08;
    uniforms.uExplode.value = explode;
    face.position.set(baseX * (1 - explode * 0.6), baseY + explode * 0.4, 0);

    // cursor in face-local space
    let target = 0;
    if (hasMouse && !idle && explode < 0.3) {
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) { face.worldToLocal(uniforms.uMouse.value.copy(hit)); target = 1; }
    }
    mouseStr += (target - mouseStr) * 0.08;
    uniforms.uMouseStr.value = mouseStr;

    // scan line: one sweep every ~5s, top → bottom
    scanT += dt;
    if (scanT > 5.2) scanT = 0;
    uniforms.uScan.value = reduce ? -9 : 1.5 - scanT * 1.2;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  canvas.classList.add('is-ready');
  requestAnimationFrame(tick);
}

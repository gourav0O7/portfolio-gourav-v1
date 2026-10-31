// =============================================================================
//  cinema.js — the homepage as one scroll-driven WebGL scene
//
//  Scroll through .journey flies a camera down a single corridor:
//    1. Gourav's face as a live point mesh (portrait + monocular depth map)
//    2. the camera dives through the face; it bursts into the dust around you
//    3. five featured case studies hang in the dark as screens; the camera
//       stops in front of each while its panel (in .stage) fades in
//    4. at the end of the corridor the face re-forms, and stays behind the
//       rest of the page (index, references, contact) — growing as you reach
//       the contact section
//
//  Text lives in the DOM (.stage [data-panel]); this file only fades it.
//  Without WebGL, or with reduced motion, html.no-cine stacks the panels.
// =============================================================================
import * as THREE from 'three';

const canvas = document.querySelector('[data-cinema]');
const journey = document.querySelector('.journey');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (canvas && journey) {
  if (reduce) document.documentElement.classList.add('no-cine');
  else init().catch((e) => { console.warn(e); document.documentElement.classList.add('no-cine'); });
}

/* ---------- helpers ---------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
function keyframes(frames, p) {             // piecewise-linear [p, value]
  if (p <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    if (p <= frames[i][0]) {
      const [p0, v0] = frames[i - 1], [p1, v1] = frames[i];
      const t = (p - p0) / (p1 - p0);
      return lerp(v0, v1, t * t * (3 - 2 * t));
    }
  }
  return frames[frames.length - 1][1];
}
function loadImage(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}
function pixels(img) {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  return g.getImageData(0, 0, c.width, c.height);
}

/* ---------- the face: points + wireframe from colour + depth ---------- */
const FACE_GLSL = /* glsl */`
  uniform float uTime, uMouseStr, uAssemble, uExplode, uScan, uDim;
  uniform vec3 uMouse;
  attribute vec3 aColor, aRnd;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vGlow, vFade;
  vec3 displace(vec3 p0) {
    vec3 p = p0;
    float t = clamp(uAssemble * 1.5 - aSeed * 0.5, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    p = mix(aRnd * (4.0 + aSeed * 5.0), p, t);
    p.z += sin(uTime * 1.3 + p0.y * 7.0 + aSeed * 6.2831) * 0.01;
    vec2 dv = p.xy - uMouse.xy;
    float inf = smoothstep(0.32, 0.0, length(dv)) * uMouseStr;
    p.z += inf * 0.3;
    p.xy += normalize(dv + 1e-4) * inf * 0.05;
    float scan = smoothstep(0.035, 0.0, abs(p0.y - uScan));
    float e = uExplode;
    vec3 drift = vec3(sin(uTime * 0.2 + aSeed * 40.0), cos(uTime * 0.17 + aSeed * 30.0), sin(uTime * 0.13 + aSeed * 20.0));
    p += (aRnd * (3.0 + aSeed * 9.0) + drift * 0.5) * e * e;
    float lum = dot(aColor, vec3(0.299, 0.587, 0.114));
    // monochrome silver, slightly cool in the shadows
    vec3 base = mix(vec3(0.55, 0.6, 0.7), vec3(1.0, 0.98, 0.95), smoothstep(0.08, 0.75, lum)) * (0.45 + lum * 1.4);
    vGlow = max(inf, scan * 0.45);
    vColor = mix(base, vec3(1.0), vGlow * 0.55) * uDim;
    vFade = t;
    return p;
  }
`;
function buildFace(C, D, small, uniforms) {
  const W = C.width, H = C.height, step = small ? 3 : 2;
  const cols = Math.floor(W / step), rows = Math.floor(H / step);
  const idx = new Int32Array(cols * rows).fill(-1);
  const pos = [], col = [], rnd = [], seed = [];
  const scale = 2.3 / W;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = c * step, y = r * step, i = (y * W + x) * 4;
    if (D.data[i + 3] < 140) continue;
    idx[r * cols + c] = pos.length / 3;
    pos.push((x - W / 2) * scale + (Math.random() - 0.5) * scale * step * 0.5,
             -(y - H / 2) * scale + (Math.random() - 0.5) * scale * step * 0.5,
             (D.data[i] / 255) * 0.95);
    col.push(C.data[i] / 255, C.data[i + 1] / 255, C.data[i + 2] / 255);
    const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    rnd.push(Math.sin(ph) * Math.cos(th), Math.sin(ph) * Math.sin(th), Math.cos(ph));
    seed.push(Math.random());
  }
  const lines = [];
  for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols - 1; c++) {
    const a = idx[r * cols + c]; if (a < 0 || (r + c) % 2) continue;
    const right = idx[r * cols + c + 1], down = idx[(r + 1) * cols + c];
    if (right >= 0 && Math.abs(pos[a * 3 + 2] - pos[right * 3 + 2]) < 0.06) lines.push(a, right);
    if (down >= 0 && Math.abs(pos[a * 3 + 2] - pos[down * 3 + 2]) < 0.06) lines.push(a, down);
  }
  const attrs = {
    position: new THREE.Float32BufferAttribute(pos, 3),
    aColor: new THREE.Float32BufferAttribute(col, 3),
    aRnd: new THREE.Float32BufferAttribute(rnd, 3),
    aSeed: new THREE.Float32BufferAttribute(seed, 1),
  };
  const gP = new THREE.BufferGeometry(), gL = new THREE.BufferGeometry();
  for (const k in attrs) { gP.setAttribute(k, attrs[k]); gL.setAttribute(k, attrs[k]); }
  gL.setIndex(lines);
  const pts = new THREE.Points(gP, new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: FACE_GLSL + /* glsl */`
      uniform float uSize, uPR; varying float vA;
      void main() {
        vec3 p = displace(position);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPR * (1.0 + vGlow * 0.7) * (6.0 / max(-mv.z, 0.4));
        vA = (0.6 + vGlow * 0.4) * vFade * (1.0 - uExplode * 0.6);
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vColor; varying float vA, vGlow;
      void main() {
        float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
        gl_FragColor = vec4(vColor, smoothstep(0.5, 0.1, d) * vA);
      }`,
  }));
  const lin = new THREE.LineSegments(gL, new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: FACE_GLSL + /* glsl */`
      varying float vA;
      void main() {
        vec3 p = displace(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        vA = (0.06 + vGlow * 0.45) * vFade * vFade * clamp(1.0 - uExplode * 4.0, 0.0, 1.0);
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vColor; varying float vA;
      void main() { gl_FragColor = vec4(vColor, vA); }`,
  }));
  const g = new THREE.Group();
  g.add(lin, pts);
  return g;
}
function faceUniforms(pr, small) {
  return {
    uTime: { value: 0 }, uMouse: { value: new THREE.Vector3(9, 9, 0) }, uMouseStr: { value: 0 },
    uAssemble: { value: 0 }, uExplode: { value: 0 }, uScan: { value: -9 }, uDim: { value: 1 },
    uSize: { value: small ? 3.2 : 2.5 }, uPR: { value: pr },
  };
}

/* ---------- a project screen hanging in the dark ---------- */
function buildScreen(tex, w, h) {
  const uniforms = {
    uTex: { value: tex }, uTime: { value: 0 }, uVel: { value: 0 }, uHover: { value: 0 },
    uOpacity: { value: 0 }, uSize: { value: new THREE.Vector2(w, h) },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false,
    vertexShader: /* glsl */`
      uniform float uVel, uTime, uHover;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        // the sheet bends with scroll speed, and breathes slightly
        p.z += sin(uv.x * 3.14159) * uVel * 0.9 + sin(uv.y * 3.0 + uTime * 0.8) * 0.015;
        p.z += uHover * 0.06 * sin(uv.x * 3.14159) * sin(uv.y * 3.14159);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */`
      uniform sampler2D uTex; uniform float uVel, uOpacity, uHover, uTime; uniform vec2 uSize;
      varying vec2 vUv;
      float rbox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
      void main() {
        vec2 uv = vUv;
        float shift = uVel * 0.007 + 0.0006;
        vec3 c;
        c.r = texture2D(uTex, uv + vec2(shift, 0.0)).r;
        c.g = texture2D(uTex, uv).g;
        c.b = texture2D(uTex, uv - vec2(shift, 0.0)).b;
        // fine scanlines + slight desaturate until hovered
        float sl = 0.985 + 0.015 * sin(uv.y * uSize.y * 160.0);
        float l = dot(c, vec3(0.299, 0.587, 0.114));
        c = mix(vec3(l), c, 0.7 + uHover * 0.3) * sl;
        c *= 0.82 + uHover * 0.18;
        vec2 p = (uv - 0.5) * uSize;
        float d = rbox(p, uSize * 0.5, 0.03);
        float a = 1.0 - smoothstep(-0.004, 0.0, d);
        float edge = smoothstep(-0.012, -0.002, d) * a;      // thin light edge
        c += edge * 0.35;
        gl_FragColor = vec4(c, a * uOpacity);
      }`,
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 32, 32), mat);
  m.userData.u = uniforms;
  return m;
}

/* ---------- dust corridor ---------- */
function buildDust(n) {
  const pos = new Float32Array(n * 3), seed = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, r = 1.8 + Math.pow(Math.random(), 0.7) * 11;
    pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = Math.sin(a) * r * 0.7;
    pos[i * 3 + 2] = 14 - Math.random() * 145;
    seed[i] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const uniforms = { uTime: { value: 0 }, uPR: { value: 1 }, uVel: { value: 0 } };
  const pts = new THREE.Points(g, new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      uniform float uTime, uPR, uVel; attribute float aSeed; varying float vA;
      void main() {
        vec3 p = position;
        p.x += sin(uTime * 0.1 + aSeed * 50.0) * 0.2;
        p.y += cos(uTime * 0.08 + aSeed * 40.0) * 0.2;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float dist = -mv.z;
        gl_PointSize = uPR * (1.0 + aSeed * 2.2) * (5.0 / max(dist, 0.5)) * (1.0 + abs(uVel) * 3.0);
        float tw = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 2.0) + aSeed * 30.0);
        vA = tw * smoothstep(40.0, 6.0, dist) * smoothstep(0.3, 2.5, dist) * (0.35 + aSeed * 0.5);
      }`,
    fragmentShader: /* glsl */`
      varying float vA;
      void main() { float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(vec3(0.9, 0.93, 1.0), smoothstep(0.5, 0.0, d) * vA); }`,
  }));
  pts.userData.u = uniforms;
  return pts;
}

/* ============================================================================ */
async function init() {
  const small = Math.min(innerWidth, innerHeight) < 700;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' }); }
  catch (e) { document.documentElement.classList.add('no-cine'); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.75 : 2));
  renderer.setClearColor(0x050507, 1);
  const pr = renderer.getPixelRatio();

  const scene = new THREE.Scene();
  scene.fog = null;
  const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 200);

  const [cImg, dImg] = await Promise.all([loadImage('assets/face/color.webp'), loadImage('assets/face/depth.png')]);
  const C = pixels(cImg), D = pixels(dImg);

  // intro face at the mouth of the corridor
  const uIn = faceUniforms(pr, small);
  const faceIn = buildFace(C, D, small, uIn);
  scene.add(faceIn);
  // outro face at the far end; shares geometry building but its own uniforms
  const uOut = faceUniforms(pr, small);
  const faceOut = buildFace(C, D, small, uOut);
  const Z_OUT = -112;
  faceOut.position.z = Z_OUT;
  scene.add(faceOut);

  const dust = buildDust(small ? 2200 : 5200);
  dust.userData.u.uPR.value = pr;
  scene.add(dust);

  // the five screens, in panel order
  const panels = [...document.querySelectorAll('.stage [data-panel^="p"]')];
  const SHOTS = [
    { src: 'assets/cinema/demand.webp', wide: true },
    { src: 'assets/cinema/payment.webp' },
    { src: 'assets/cinema/otp.webp' },
    { src: 'assets/cinema/bisleri.webp' },
    { src: 'assets/cinema/ds.webp', wide: true },
  ];
  const loader = new THREE.TextureLoader();
  const screens = await Promise.all(SHOTS.map((s, i) => new Promise((res) => {
    loader.load(s.src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      const ar = tex.image.width / tex.image.height;
      const h = s.wide ? 2.7 / ar : 2.15, w = s.wide ? 2.7 : 2.15 * ar;
      const m = buildScreen(tex, w, h);
      m.userData.wide = !!s.wide;
      m.userData.href = panels[i] && panels[i].querySelector('a') ? panels[i].querySelector('a').getAttribute('href') : null;
      m.userData.side = panels[i] && panels[i].classList.contains('shot--r') ? -1 : 1;  // text right → screen left
      m.userData.z = -20 - i * 17;
      res(m);
    }, undefined, () => res(null));
  })));
  screens.forEach((m) => m && scene.add(m));

  /* ---- timeline (journey progress p ∈ [0,1]) ---- */
  const C0 = 0.27, CS = 0.135;              // project centres
  const centres = SHOTS.map((_, i) => C0 + i * CS);
  const camFrames = [[0, 6.6], [0.07, 5.6], [0.19, -9]];
  centres.forEach((c, i) => { const z = -20 - i * 17; camFrames.push([c - 0.04, z + 5.1], [c + 0.04, z + 4.1]); });
  camFrames.push([0.95, Z_OUT + 8.5], [1, Z_OUT + 7.6]);
  const panelWin = { hero: [-1, -1, 0.045, 0.085], dive: [0.1, 0.13, 0.17, 0.2], end: [0.9, 0.94, 2, 2] };
  centres.forEach((c, i) => { panelWin['p' + i] = [c - 0.06, c - 0.03, c + 0.035, c + 0.06]; });
  const panelEls = {};
  document.querySelectorAll('.stage [data-panel]').forEach((el) => { panelEls[el.dataset.panel] = el; });
  const bar = document.querySelector('.cine-progress i');
  const chapters = [...document.querySelectorAll('.cine-chapters li')];
  const chapterAt = (p) => (p < 0.2 ? 0 : p > 0.89 ? 6 : 1 + Math.round(clamp((p - C0) / CS, 0, 4)));

  /* ---- layout ---- */
  let vw = 1, vh = 1, wide = true;
  function resize() {
    vw = innerWidth; vh = innerHeight;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh; camera.updateProjectionMatrix();
    wide = vw / vh > 1.1 && vw > 860;
    const fitIn = wide ? 1 : Math.min(1, (camera.aspect * 2.0) / 1.35);
    faceIn.scale.setScalar(fitIn);
    faceOut.scale.setScalar(fitIn);
    screens.forEach((m) => {
      if (!m) return;
      const s = wide ? 1 : Math.min(0.92, camera.aspect * (m.userData.wide ? 0.85 : 1.25));
      m.scale.setScalar(s);
      m.position.set(wide ? m.userData.side * (m.userData.wide ? 1.3 : 1.0) : 0, wide ? 0 : 0.42, m.userData.z);
      m.rotation.y = wide ? -m.userData.side * 0.12 : 0;
    });
  }
  resize();
  addEventListener('resize', resize);

  /* ---- input ---- */
  const ndc = new THREE.Vector2(), ray = new THREE.Raycaster();
  let hasMouse = false, lastMove = 0, hovered = null;
  addEventListener('pointermove', (e) => {
    ndc.set((e.clientX / vw) * 2 - 1, -(e.clientY / vh) * 2 + 1);
    hasMouse = e.pointerType === 'mouse'; lastMove = performance.now();
  }, { passive: true });
  document.addEventListener('click', (e) => {
    if (!hovered || !hovered.userData.href) return;
    if (e.target.closest('a, button, input, .nav')) return;
    location.href = hovered.userData.href;
  });

  let pTarget = 0, after = 0;
  function readScroll() {
    const top = journey.offsetTop, h = journey.offsetHeight - vh;
    pTarget = clamp((scrollY - top) / h);
    const rest = document.documentElement.scrollHeight - vh - (top + h);
    after = rest > 0 ? clamp((scrollY - top - h) / rest) : 0;
  }
  addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  /* ---- loop ---- */
  const clock = new THREE.Clock();
  let p = pTarget, pPrev = p, vel = 0, af = after, running = true, rotX = 0, rotY = 0, mStr = 0;
  const hit = new THREE.Vector3(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.5);
  const look = new THREE.Vector3();
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) { clock.getDelta(); requestAnimationFrame(tick); } });

  function tick() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 5.5);
    p += (pTarget - p) * k;
    af += (after - af) * k;
    vel += (((p - pPrev) / Math.max(dt, 1e-3)) * 0.6 - vel) * 0.15;
    pPrev = p;
    const v = clamp(vel, -1.2, 1.2);

    // camera along the corridor
    const camZ = keyframes(camFrames, p) - af * 2.6;
    let tx = 0, ty = 0;
    let near = null, nearD = 1e9;
    screens.forEach((m) => { if (m) { const d = Math.abs(camZ - (m.position.z + 4.5)); if (d < nearD) { nearD = d; near = m; } } });
    const nearW = near ? smooth(9, 1.5, nearD) : 0;
    if (near && wide) tx = near.position.x * 0.32 * nearW;
    const idle = !hasMouse || performance.now() - lastMove > 4000;
    const mx = idle ? Math.sin(t * 0.3) * 0.3 : ndc.x, my = idle ? Math.sin(t * 0.23) * 0.2 : ndc.y;
    camera.position.set(tx + mx * 0.18, ty + my * 0.12, camZ);
    look.set((near && wide ? near.position.x * 0.55 * nearW : 0) + mx * 0.05, my * 0.03, camZ - 8);
    camera.lookAt(look);
    camera.rotation.z = -v * 0.05;

    // intro face: assemble on load, turn to the cursor, burst as we pass through
    uIn.uTime.value = t;
    uIn.uAssemble.value = Math.min(1, t / 2.4);
    uIn.uExplode.value = smooth(3.8, -2.5, camZ);
    rotY += ((idle ? Math.sin(t * 0.35) * 0.22 : ndc.x * 0.4) - rotY) * 0.06;
    rotX += ((idle ? Math.sin(t * 0.27) * -0.06 : -ndc.y * 0.2) - rotX) * 0.06;
    faceIn.rotation.set(rotX, rotY, 0);
    faceIn.position.y = wide ? -0.08 : 0.35;
    let target = 0;
    if (hasMouse && !idle && camZ > 3) {
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hit)) { faceIn.worldToLocal(uIn.uMouse.value.copy(hit)); target = 1; }
    }
    mStr += (target - mStr) * 0.08;
    uIn.uMouseStr.value = mStr;
    uIn.uScan.value = 1.5 - ((t % 5.5) * 1.15);

    // outro face: re-forms as the camera reaches the end of the corridor
    uOut.uTime.value = t;
    uOut.uAssemble.value = smooth(Z_OUT + 40, Z_OUT + 10, camZ);
    uOut.uDim.value = 0.75 + af * 0.25;
    faceOut.rotation.set(rotX * 0.6, rotY * 0.8, 0);
    faceOut.position.y = wide ? -0.05 : 0.2;
    uOut.uScan.value = 1.5 - (((t + 2.7) % 5.5) * 1.15);

    // screens: fade by distance, bend with speed, react to hover
    hovered = null;
    if (hasMouse) {
      ray.setFromCamera(ndc, camera);
      const hits = ray.intersectObjects(screens.filter((m) => m && m.userData.u.uOpacity.value > 0.5));
      if (hits.length) hovered = hits[0].object;
    }
    canvas.classList.toggle('is-link', !!hovered);
    document.documentElement.classList.toggle('cine-hover', !!hovered);
    screens.forEach((m) => {
      if (!m) return;
      const u = m.userData.u, d = camZ - m.position.z;
      u.uTime.value = t; u.uVel.value = v;
      u.uOpacity.value = smooth(26, 10, d) * smooth(-0.5, 1.6, d);
      u.uHover.value += ((m === hovered ? 1 : 0) - u.uHover.value) * 0.1;
    });
    dust.userData.u.uTime.value = t;
    dust.userData.u.uVel.value = v;

    // DOM panels
    for (const id in panelWin) {
      const el = panelEls[id]; if (!el) continue;
      const [a, b, c, d] = panelWin[id];
      const o = (a < 0 ? 1 : smooth(a, b, p)) * (1 - smooth(c, d, p));
      el.style.opacity = o.toFixed(3);
      el.style.transform = 'translate3d(0,' + ((1 - o) * (p < (b + c) / 2 ? 28 : -28)).toFixed(1) + 'px,0)';
      el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      el.classList.toggle('is-on', o > 0.6);
    }
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    const ch = chapterAt(p);
    chapters.forEach((li, i) => li.classList.toggle('is-on', i === ch));
    document.documentElement.style.setProperty('--after', af.toFixed(3));

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  document.documentElement.classList.add('cine-on');
  requestAnimationFrame(tick);
}

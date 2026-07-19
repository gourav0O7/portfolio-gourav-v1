// =============================================================================
//  c64-hero.js — Commodore-64 scroll-zoom hero
//  Hero: name/desc LEFT, 3D Commodore RIGHT. The CRT shows your career stats.
//  Scrolling flies the camera head-on into the screen until it fills the
//  viewport, then hands off to the matching #screenstats section (no break).
//  Loaded as type="module"; THREE comes from the page importmap.
// =============================================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ACCENT = 0xff5b2e;
const GOLD_ACCENT = 0xffc23a;
function isGold(){ return document.documentElement.classList.contains('gold'); }
const SCREEN_CENTER = new THREE.Vector3(0, 2.264, -0.346);
const SCREEN_W = 3.058, SCREEN_H = 2.211;
const SCREEN_TILT = -0.02;

const POSE_A = { pos: new THREE.Vector3(4.0, 3.5, 11.2), target: new THREE.Vector3(-5.4, 1.95, -0.3), fov: 40 };
const POSE_B_FOV = 34;

// ---- asset-load bridge: loader.js reads this to know when the hero's
// big assets (GLB model + video reel) are actually ready, instead of
// guessing with a fixed timer. ----
const AL = window.__assetLoad = window.__assetLoad || { c64: 0, video: 0, c64Done: false, videoDone: false };
function reportProgress(){ window.dispatchEvent(new Event('assetload:progress')); }

const canvas = document.getElementById('c64Canvas');
const stage  = document.getElementById('introStage');
if (canvas && stage) boot();
else { AL.c64Done = true; AL.videoDone = true; reportProgress(); }

function easeInOut(t){ return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2; }
function lerp(a,b,t){ return a + (b-a)*t; }

function boot(){
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, preserveDrawingBuffer:true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(POSE_A.fov, 1, 0.01, 200);
  camera.position.copy(POSE_A.pos);

  scene.add(new THREE.AmbientLight(0x8a93a6, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 7, 6); scene.add(key);
  const fill = new THREE.DirectionalLight(0xbcd2ff, 0.7); fill.position.set(-6, 2, 3); scene.add(fill);
  const rim = new THREE.DirectionalLight(ACCENT, 2.6); rim.position.set(-3, 3, -6); scene.add(rim);
  const under = new THREE.PointLight(ACCENT, 6, 14, 2); under.position.set(0, 2.4, 1.6); scene.add(under);

  const term = makeTerminal();
  const screenMat = new THREE.MeshBasicMaterial({ map: term.texture, toneMapped:false });
  const screenPlane = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W*0.93, SCREEN_H*0.93), screenMat);
  screenPlane.position.copy(SCREEN_CENTER).add(new THREE.Vector3(0,0,0.06));
  screenPlane.rotation.x = SCREEN_TILT;
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(SCREEN_W*1.5, SCREEN_H*1.5),
    new THREE.MeshBasicMaterial({ map: radialGlow(isGold()), transparent:true, opacity:0.15, blending:THREE.AdditiveBlending, depthWrite:false, toneMapped:false })
  );
  glow.position.copy(SCREEN_CENTER).add(new THREE.Vector3(0,0,0.04));

  let model = null, ready = false;
  new GLTFLoader().load('assets/commodore64.glb', (gltf)=>{
    model = gltf.scene;
    model.traverse(o=>{
      if (o.isMesh && o.material){
        const n = o.material.name || '';
        if (n === 'cable' || n === 'connector') o.visible = false;
        if (n === 'monitor_screen') o.visible = false;
      }
      if (o.name === 'Object_8') o.visible = false;
    });
    scene.add(model);
    model.add(screenPlane);
    model.add(glow);
    ready = true;
    document.documentElement.classList.add('c64-ready');
    setLoader(1);
    AL.c64 = 1; AL.c64Done = true; reportProgress();
    onScroll();
  }, (e)=>{ const p = e.total ? e.loaded/e.total : 0; setLoader(p); AL.c64 = p; reportProgress(); },
     (err)=>{ console.warn('C64 load failed', err); document.documentElement.classList.add('c64-failed'); AL.c64Done = true; reportProgress(); });

  function resize(){
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setPixelRatio(DPR);
    renderer.setSize(w, h, false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize); resize();

  function coverDistance(){
    const a = camera.aspect;
    const tanV = Math.tan(THREE.MathUtils.degToRad(POSE_B_FOV)/2);
    const dV = (SCREEN_H*0.93/2) / tanV;
    const dW = (SCREEN_W*0.93/2) / (a * tanV);
    return Math.min(dV, dW) * 0.99;
  }

  let progress = 0, targetProgress = 0;
  function computeProgress(){
    const rect = stage.getBoundingClientRect();
    const total = stage.offsetHeight;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    return total > 0 ? scrolled/total : 0;
  }
  function onScroll(){ targetProgress = computeProgress(); }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  const _tA = POSE_A.target.clone();
  const tmpTarget = new THREE.Vector3();
  let t = 0;
  function frame(){
    requestAnimationFrame(frame);
    t += 0.016;
    progress += (targetProgress - progress) * 0.24;
    const e = easeInOut(THREE.MathUtils.clamp(progress, 0, 1));
    const active = progress < 0.999 || targetProgress < 0.999;

    if (ready && active){
      tmpTarget.copy(_tA).lerp(SCREEN_CENTER, e);
      const dCover = coverDistance();
      const cx = lerp(POSE_A.pos.x, SCREEN_CENTER.x, e);
      const cy = lerp(POSE_A.pos.y, SCREEN_CENTER.y, e);
      const cz = lerp(POSE_A.pos.z, SCREEN_CENTER.z + dCover, e);
      camera.position.set(cx, cy, cz);
      camera.fov = lerp(POSE_A.fov, POSE_B_FOV, e);
      camera.updateProjectionMatrix();
      camera.lookAt(tmpTarget);
      if (model) model.rotation.y = 0;

      term.setProgress(progress, t);
      glow.material.opacity = 0.15 + 0.55 * e;
      under.intensity = 4 + 8*e;
      renderer.render(scene, camera);
    }

    document.documentElement.style.setProperty('--c64-p', progress.toFixed(4));
    const fade = THREE.MathUtils.clamp((progress - 0.9) / 0.085, 0, 1);
    document.documentElement.style.setProperty('--c64-fade', String(1 - fade));
    document.documentElement.classList.toggle('c64-booted', fade > 0.92);

    // reel audio: on past 65% zoom, off once it fades toward the handoff
    term.updateAudio(ready && progress >= 0.65 && fade < 0.92);
  }
  frame();

  // recolour the screen halo + rim/under lights to match the active theme,
  // and re-apply live whenever the gold toggle flips
  function applyC64Theme(){
    const g = isGold();
    rim.color.setHex(g ? GOLD_ACCENT : ACCENT);
    under.color.setHex(g ? GOLD_ACCENT : ACCENT);
    glow.material.map = radialGlow(g);
    glow.material.needsUpdate = true;
  }
  applyC64Theme();
  new MutationObserver(applyC64Theme).observe(document.documentElement, { attributes:true, attributeFilter:['class'] });
}

function setLoader(p){
  document.documentElement.style.setProperty('--c64-load', String(Math.round(p*100)));
  const el = document.getElementById('c64Load'); if (el) el.style.width = (p*100)+'%';
}

// ---- CRT texture: portrait with amber-glitch treatment ----
function makeTerminal(){
  const cw = 1024, ch = Math.round(1024 * (SCREEN_H/SCREEN_W));
  const c = document.createElement('canvas'); c.width = cw; c.height = ch;
  const x = c.getContext('2d');
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = true;

  // CRT source — a looping video reel if present, else the portrait still.
  // Every frame is cover-fit then given the amber-duotone CRT treatment;
  // red/cyan tinted copies are rebuilt for the chromatic-split glitch.
  //  amber — warm amber duotone (the normal CRT look)
  //  redCv / cyanCv — tinted copies for the chromatic-split glitch
  function mkCanvas(){ const e = document.createElement('canvas'); e.width = cw; e.height = ch; return e; }
  const amber = mkCanvas(), redCv = mkCanvas(), cyanCv = mkCanvas();
  const frame = mkCanvas(), fctx = frame.getContext('2d');
  const actx = amber.getContext('2d');

  let media = null, mediaReady = false, isVideo = false, needFrame = true, needSplit = true;

  // try the video reel first; fall back to the still portrait
  let fellBack = false;
  function useStill(){
    if (fellBack) return; fellBack = true; isVideo = false;
    // Fallback (slow link / no video): DON'T load the portrait photo — leave
    // the CRT on its themed "LOADING" screen instead. mediaReady stays false,
    // so draw() keeps rendering the loading card every frame.
    AL.video = 1; AL.videoDone = true; reportProgress();
  }
  const vid = document.createElement('video');
  vid.muted = true; vid.loop = true; vid.playsInline = true; vid.preload = 'auto';
  vid.setAttribute('muted', ''); vid.setAttribute('playsinline', '');
  vid.addEventListener('error', useStill);
  vid.addEventListener('progress', () => {
    if (vid.duration && vid.buffered.length){ AL.video = Math.min(1, vid.buffered.end(vid.buffered.length - 1) / vid.duration); reportProgress(); }
  });
  vid.addEventListener('loadeddata', () => {
    if (vid.videoWidth > 0){ media = vid; isVideo = true; mediaReady = true; needFrame = true; vid.play().catch(()=>{}); }
    AL.video = 1; AL.videoDone = true; reportProgress();
  });

  // Connection-aware reel: skip the ~MB video on saveData / slower links and
  // use the still portrait straight away. On a fast link, race a short timeout
  // so a stalled download can't leave the CRT blank for long.
  const _conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const _slowish = window.__lite || (_conn && (_conn.saveData ||
      /^(slow-2g|2g|3g)$/.test(_conn.effectiveType || '') ||
      (typeof _conn.downlink === 'number' && _conn.downlink > 0 && _conn.downlink < 2)));
  if (_slowish) {
    useStill();
  } else {
    vid.src = 'assets/hero-reel.mp4';
    setTimeout(() => { if (!mediaReady) useStill(); }, 2000);
  }

  // ---- audio: play the reel's own sound once the zoom passes 65%, fade out
  //      when the screen hands off / leaves the viewport. Stays muted until
  //      the user has made ANY gesture (browser autoplay rule), so the CRT
  //      never freezes from an unmute being refused. ----
  let audioUnlocked = false;
  function unlockAudio(){ audioUnlocked = true; }
  ['pointerdown','mousedown','touchstart','keydown','wheel','click'].forEach(ev =>
    window.addEventListener(ev, unlockAudio, { passive: true }));
  let curVol = 0;
  const MAX_VOL = 0.3;                              // cap reel at 30% of system volume
  function updateAudio(shouldPlay){
    if (!isVideo || !mediaReady) return;
    if (window.__soundMuted){                     // site-wide mute wins
      curVol = 0;
      if (!vid.muted) vid.muted = true;
      return;
    }
    const target = (shouldPlay && audioUnlocked) ? MAX_VOL : 0;
    curVol += (target - curVol) * 0.08;          // smooth fade in/out
    if (curVol <= 0.002 && target === 0){
      curVol = 0;
      if (!vid.muted) vid.muted = true;
      return;
    }
    if (vid.muted){ vid.muted = false; vid.removeAttribute('muted'); }
    vid.volume = Math.min(MAX_VOL, Math.max(0, curVol));
    if (vid.paused) vid.play().catch(()=>{});
  }

  // rotate the video reel 90° (it's shot portrait but the CRT is landscape)
  const ROTATE_VIDEO = -90; // degrees; -90 = counter-clockwise
  function coverFitInto(o, image){
    let iw = image.videoWidth || image.width, ih = image.videoHeight || image.height;
    const rotate = isVideo && ROTATE_VIDEO !== 0;
    if (rotate){ const t = iw; iw = ih; ih = t; } // swap dims for the rotated frame
    const s = Math.max(cw / iw, ch / ih);
    const dw = iw * s, dh = ih * s;
    o.clearRect(0, 0, cw, ch);
    if (rotate){
      o.save();
      o.translate(cw / 2, ch * 0.5);
      o.rotate(ROTATE_VIDEO * Math.PI / 180);
      // after rotation, draw centered using the un-swapped source dims
      o.drawImage(image, -dh / 2, -dw / 2, dh, dw);
      o.restore();
    } else {
      // bias the crop toward the top so the face/subject stays in frame
      o.drawImage(image, (cw - dw) / 2, (ch - dh) * 0.32, dw, dh);
    }
  }
  // theme-aware CRT colour palette (orange duotone vs gold duotone)
  function pal(){
    if (isGold()) return {
      mid:'#f4b528', lift:'#2a1d05',
      split1:'#ffd45e', split2:'#9c6a12',
      recBox:'rgba(244,181,40,0.95)',
      rec:'rgba(255,205,90,0.92)',
      ch:'rgba(255,228,165,0.6)',
      roll0:'rgba(255,205,110,0)',
      roll1:'rgba(255,212,120,'
    };
    return {
      mid:'#ff7a38', lift:'#241006',
      split1:'#16f0ff', split2:'#ff2a2a',
      recBox:'rgba(255,91,46,0.95)',
      rec:'rgba(255,150,90,0.85)',
      ch:'rgba(255,210,180,0.55)',
      roll0:'rgba(255,150,80,0)',
      roll1:'rgba(255,165,95,'
    };
  }

  function amberize(ctx, p){
    ctx.globalCompositeOperation = 'saturation';
    ctx.fillStyle = 'hsl(0,0%,50%)'; ctx.fillRect(0, 0, cw, ch);   // → grayscale
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = p.mid; ctx.fillRect(0, 0, cw, ch);             // themed midtones
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = p.lift; ctx.fillRect(0, 0, cw, ch);            // warm lifted blacks
    ctx.globalCompositeOperation = 'source-over';
  }
  function tintInto(canvas, color){
    const tc = canvas.getContext('2d');
    tc.clearRect(0, 0, cw, ch);
    tc.drawImage(frame, 0, 0);
    tc.globalCompositeOperation = 'saturation';
    tc.fillStyle = 'hsl(0,0%,50%)'; tc.fillRect(0, 0, cw, ch);
    tc.globalCompositeOperation = 'multiply';
    tc.fillStyle = color; tc.fillRect(0, 0, cw, ch);
    tc.globalCompositeOperation = 'source-over';
  }
  // Rebuild the treated frames. For video this runs every draw; for the
  // still it runs once (and red/cyan only the first time a glitch fires).
  function refreshSource(burst, p){
    if (!mediaReady) return;
    if (isVideo || needFrame){
      coverFitInto(fctx, media);
      actx.clearRect(0, 0, cw, ch); actx.drawImage(frame, 0, 0); amberize(actx, p);
      needFrame = false; needSplit = true;
    }
    if (burst && (isVideo || needSplit)){
      tintInto(redCv, p.split2);
      tintInto(cyanCv, p.split1);
      needSplit = false;
    }
  }

  // deterministic pseudo-random so glitch flickers but doesn't strobe wildly
  function rnd(seed){ const s = Math.sin(seed * 127.1) * 43758.5453; return s - Math.floor(s); }

  function roundRect(ctx, rx, ry, rw, rh, r){
    ctx.beginPath();
    if (ctx.roundRect) { ctx.roundRect(rx, ry, rw, rh, r); return; }
    ctx.moveTo(rx + r, ry);
    ctx.arcTo(rx + rw, ry, rx + rw, ry + rh, r);
    ctx.arcTo(rx + rw, ry + rh, rx, ry + rh, r);
    ctx.arcTo(rx, ry + rh, rx, ry, r);
    ctx.arcTo(rx, ry, rx + rw, ry, r);
    ctx.closePath();
  }

  function draw(progress, time){
    const p = pal();
    // the tube is black glass; the picture is overscanned inside it
    x.fillStyle = '#060403';
    x.fillRect(0, 0, cw, ch);

    if (!mediaReady){
      // --- themed CRT "LOADING" screen (the fallback when there's no reel) ---
      const pL = pal();
      const ins = 30, pw0 = cw - ins*2, ph0 = ch - ins*2, corner0 = 64;
      x.fillStyle = '#060403'; x.fillRect(0, 0, cw, ch);

      x.save();
      roundRect(x, ins, ins, pw0, ph0, corner0);
      x.clip();

      // faint themed wash over the tube
      x.globalAlpha = 0.5; x.fillStyle = pL.lift; x.fillRect(0, 0, cw, ch); x.globalAlpha = 1;

      // big centered LOADING with an animated ellipsis
      const dots = '.'.repeat(1 + (Math.floor(time * 2) % 3));
      x.textAlign = 'center';
      x.fillStyle = pL.mid;
      x.font = '700 72px "Space Mono", ui-monospace, monospace';
      x.fillText('LOADING' + dots, cw / 2, ch / 2);
      x.font = '500 22px "Space Mono", ui-monospace, monospace';
      x.fillStyle = pL.ch;
      x.fillText('// INCOMING SIGNAL · STAND BY', cw / 2, ch / 2 + 56);
      x.textAlign = 'start';

      // indeterminate sweep bar under the text
      const bw = pw0 * 0.5, bx = cw / 2 - bw / 2, by = ch / 2 + 96, seg = bw * 0.32;
      x.fillStyle = 'rgba(255,255,255,0.08)'; x.fillRect(bx, by, bw, 6);
      const sx = bx + (bw + seg) * ((time * 0.5) % 1) - seg;
      const cx0 = Math.max(bx, sx), cx1 = Math.min(bx + bw, sx + seg);
      if (cx1 > cx0){ x.fillStyle = pL.mid; x.fillRect(cx0, by, cx1 - cx0, 6); }

      // rolling refresh band
      const rollY0 = (1 - (time * 0.08 % 1)) * ch;
      const rg0 = x.createLinearGradient(0, rollY0 - 70, 0, rollY0 + 70);
      rg0.addColorStop(0, pL.roll0); rg0.addColorStop(0.5, pL.roll1 + '0.10)'); rg0.addColorStop(1, pL.roll0);
      x.fillStyle = rg0; x.fillRect(0, rollY0 - 70, cw, 140);

      // scanlines
      x.globalAlpha = 0.16; x.fillStyle = '#000';
      for (let yy = ins; yy < ch - ins; yy += 3) x.fillRect(ins, yy, pw0, 1.4);
      x.globalAlpha = 1;

      // tube vignette
      const vg0 = x.createRadialGradient(cw/2, ch*0.46, ch*0.16, cw/2, ch/2, ch*0.78);
      vg0.addColorStop(0, 'rgba(0,0,0,0)'); vg0.addColorStop(0.7, 'rgba(0,0,0,0.18)'); vg0.addColorStop(1, 'rgba(0,0,0,0.72)');
      x.fillStyle = vg0; x.fillRect(0, 0, cw, ch);
      x.restore();

      // glass glare on top
      const gl0 = x.createLinearGradient(ins, ins, cw*0.72, ch*0.62);
      gl0.addColorStop(0, 'rgba(255,255,255,0.16)'); gl0.addColorStop(0.18, 'rgba(255,255,255,0.05)'); gl0.addColorStop(0.32, 'rgba(255,255,255,0)');
      x.save(); roundRect(x, ins, ins, pw0, ph0, corner0); x.clip();
      x.fillStyle = gl0; x.fillRect(0, 0, cw, ch); x.restore();

      texture.needsUpdate = true; return;
    }

    // ---- picture region: overscan inset + rounded tube corners ----
    const inset = 30;            // overscan border so it sits inside the glass
    const pw = cw - inset * 2, ph = ch - inset * 2;
    const corner = 64;
    const drawPic = (src, dx, dy, alpha, blur) => {
      x.save();
      x.globalAlpha = alpha;
      x.filter = blur ? `blur(${blur}px)` : 'none';
      x.drawImage(src, inset, inset, pw, ph, inset + dx, inset + dy, pw, ph);
      x.restore();
    };

    x.save();
    roundRect(x, inset, inset, pw, ph, corner);
    x.clip();

    // glitch burst: a short signal tear every few seconds
    const cyc = time % 4.0;
    const burst = cyc < 0.5;
    const k = burst ? (1 - cyc / 0.5) : 0;

    refreshSource(burst, p);  // pull the current video/still frame + treatments

    // base picture — softened, the way a CRT renders an image
    if (burst){
      const dx = 8 + 22 * k * (0.5 + 0.5 * Math.sin(time * 50));
      x.globalCompositeOperation = 'lighter';
      drawPic(cyanCv, -dx, 1, 0.5, 1.1);
      drawPic(redCv,   dx, -1, 0.5, 1.1);
      x.globalCompositeOperation = 'source-over';
      drawPic(amber, 0, 0, 0.6, 1.1);
    } else {
      drawPic(amber, 0, 0, 1, 1.0);
    }

    // phosphor bloom: blurred bright pass screened back over the picture
    x.globalCompositeOperation = 'lighter';
    drawPic(amber, 0, 0, 0.22, 9);
    x.globalCompositeOperation = 'source-over';

    // horizontal slice tearing
    const slices = burst ? 7 : (Math.floor(time * 1.3) % 5 === 0 ? 2 : 0);
    for (let i = 0; i < slices; i++){
      const seed = i + Math.floor(time * (burst ? 24 : 6));
      const sy = inset + Math.floor(rnd(seed) * ph);
      const sh = 6 + Math.floor(rnd(seed + 0.3) * (burst ? 46 : 22));
      const off = Math.round((rnd(seed + 0.7) - 0.5) * (burst ? 80 : 30));
      x.fillStyle = '#060403'; x.fillRect(inset, sy, pw, sh);
      x.drawImage(amber, inset, sy - inset, pw, sh, inset + off, sy, pw, sh);
    }

    // rolling refresh band
    const rollY = (1 - (time * 0.08 % 1)) * ch;
    const rg = x.createLinearGradient(0, rollY - 70, 0, rollY + 70);
    rg.addColorStop(0, p.roll0);
    rg.addColorStop(0.5, p.roll1 + (0.08 + 0.05 * Math.sin(time)) + ')');
    rg.addColorStop(1, p.roll0);
    x.fillStyle = rg; x.fillRect(0, rollY - 70, cw, 140);

    // fine RGB scanlines (denser, softer — phosphor lines)
    x.globalAlpha = 0.16; x.fillStyle = '#000';
    for (let yy = inset; yy < ch - inset; yy += 3) x.fillRect(inset, yy, pw, 1.4);
    x.globalAlpha = 1;

    // HUD as on-screen content
    x.textBaseline = 'alphabetic';
    const blink = Math.floor(time * 1.6) % 2 === 0;
    if (blink){ x.fillStyle = p.recBox; x.fillRect(inset + 26, inset + 22, 14, 14); }
    x.font = '700 22px "Space Mono", ui-monospace, monospace';
    x.fillStyle = p.rec;
    x.fillText('REC · LIVE SIGNAL', inset + 52, inset + 36);
    x.font = '500 19px "Space Mono", ui-monospace, monospace';
    x.fillStyle = p.ch;
    x.fillText('CH-04 // NOT YOUR AVERAGE DESIGNER', inset + 26, ch - inset - 22);

    // tube vignette — darkens toward the curved edges
    const vg = x.createRadialGradient(cw/2, ch*0.46, ch*0.16, cw/2, ch/2, ch*0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(0.7, 'rgba(0,0,0,0.18)');
    vg.addColorStop(1, 'rgba(0,0,0,0.72)');
    x.fillStyle = vg; x.fillRect(0, 0, cw, ch);

    x.restore(); // end picture clip

    // ---- glass on top of the tube ----
    // inner shadow lip so the picture sits recessed behind glass
    x.save();
    roundRect(x, inset, inset, pw, ph, corner);
    x.lineWidth = 16;
    x.strokeStyle = 'rgba(0,0,0,0.55)';
    x.filter = 'blur(8px)';
    x.stroke();
    x.restore();

    // diagonal glass glare across the upper-left
    const gl = x.createLinearGradient(inset, inset, cw * 0.72, ch * 0.62);
    gl.addColorStop(0, 'rgba(255,255,255,0.16)');
    gl.addColorStop(0.18, 'rgba(255,255,255,0.05)');
    gl.addColorStop(0.32, 'rgba(255,255,255,0)');
    x.save();
    roundRect(x, inset, inset, pw, ph, corner);
    x.clip();
    x.fillStyle = gl; x.fillRect(0, 0, cw, ch);
    // soft convex highlight bloom near top
    const hl = x.createRadialGradient(cw*0.34, ch*0.2, 0, cw*0.34, ch*0.2, ch*0.5);
    hl.addColorStop(0, 'rgba(255,255,255,0.10)');
    hl.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = hl; x.fillRect(0, 0, cw, ch);
    x.restore();

    texture.needsUpdate = true;
  }
  draw(0, 0);
  return { texture, setProgress: draw, updateAudio };
}

function radialGlow(gold){
  const s=256, c=document.createElement('canvas'); c.width=c.height=s;
  const x=c.getContext('2d');
  const g=x.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
  if (gold){
    g.addColorStop(0,'rgba(255,206,92,0.9)');
    g.addColorStop(0.4,'rgba(242,168,30,0.38)');
    g.addColorStop(1,'rgba(242,168,30,0)');
  } else {
    g.addColorStop(0,'rgba(255,120,70,0.9)');
    g.addColorStop(0.4,'rgba(255,91,46,0.35)');
    g.addColorStop(1,'rgba(255,91,46,0)');
  }
  x.fillStyle=g; x.fillRect(0,0,s,s);
  const t=new THREE.CanvasTexture(c); t.colorSpace=THREE.SRGBColorSpace; return t;
}

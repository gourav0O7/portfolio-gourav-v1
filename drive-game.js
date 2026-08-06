
/* ============================================================
   CAR GAME — "Take it for a drive"
   A small arcade driving toy that reuses the showroom's BMW GLB.
   Click Play → a Three.js circuit boots inside the stage: an
   infinite technical grid, chase camera, arcade physics, and a
   little game loop — collect the glowing markers for a speed
   BOOST and a rising score, weave the pylons, leave skid lines.

   Theme-aware: the dark/amber theme shows the M3 E30, the gold
   theme shows the E24 635CSi — in both the showroom viewer AND
   the game. Engine note tracks speed; audio only while driving.

   Lazy: Three.js + the model load only on the first Play, via
   dynamic import (resolved through the page's import map).
   ============================================================ */
(function () {
  'use strict';

  var stage   = document.querySelector('.ohcar__stage');
  var car3d   = document.querySelector('.ohcar');
  if (!stage || !car3d) return;

  var playBtn = stage.querySelector('[data-play]');
  var gameEl  = stage.querySelector('[data-game]');
  var canvas  = stage.querySelector('[data-canvas]');
  var exitBtn = stage.querySelector('[data-exit]');
  var loadEl  = stage.querySelector('[data-game-loading]');
  var spdEl   = stage.querySelector('[data-spd]');
  var scoreEl = stage.querySelector('[data-score]');
  var rewardEl = stage.querySelector('[data-reward]');
  var mv      = stage.querySelector('.ohcar__mv');
  if (!playBtn || !gameEl || !canvas) return;

  /* ---------- theme-aware models + showroom copy ---------- */
  var MODELS = {
    amber: {
      url: 'assets/bmw_m3_e30.glb',
      tag: 'BMW M3 E30 \u00b7 REAL-TIME 3D',
      title: 'The shape that started it.',
      sub: 'Boxflares, the DTM stance, that razor greenhouse \u2014 the E30 M3 is half the reason the shelf exists. Grab it and spin.',
      credit: 'Model \u201cBMW M3 E30\u201d<br>via Sketchfab \u00b7 CC\u2011BY'
    },
    gold: {
      url: 'assets/bmw_e24_635csi.glb',
      tag: 'BMW E24 635CSi \u00b7 REAL-TIME 3D',
      title: 'The long-hood grand tourer.',
      sub: 'Shark-nose six, frameless glass, that endless E24 bonnet \u2014 the 635CSi is peak \u201980s BMW GT. Grab it and spin.',
      credit: 'Model \u201cBMW E24 635CSi\u201d<br>via Sketchfab \u00b7 CC\u2011BY'
    }
  };
  function themeKey() { return document.documentElement.classList.contains('gold') ? 'gold' : 'amber'; }
  function carUrl() { return MODELS[themeKey()].url; }

  // warm both GLBs into the browser cache so theme swaps are near-instant
  function preloadModels() {
    Object.keys(MODELS).forEach(function (k) {
      try { fetch(MODELS[k].url, { cache: 'force-cache' }); } catch (e) {}
    });
  }

  var swapEl = stage.querySelector('[data-swap]');
  var swapTimer = 0;
  function showSwap(on) {
    stage.classList.toggle('is-swapping', !!on);
  }

  function applyShowroom() {
    var m = MODELS[themeKey()];
    if (mv && mv.getAttribute('src') !== m.url) {
      // show a brief loading veil until the (large) model is ready
      showSwap(true);
      clearTimeout(swapTimer);
      var onLoaded = function () { showSwap(false); clearTimeout(swapTimer); };
      mv.addEventListener('load', onLoaded, { once: true });
      // safety: never leave the veil stuck if 'load' doesn't fire
      swapTimer = setTimeout(function () { showSwap(false); mv.removeEventListener('load', onLoaded); }, 9000);
      mv.setAttribute('src', m.url);
    }
    var elTag = car3d.querySelector('[data-cartag]');
    var elTtl = car3d.querySelector('[data-cartitle]');
    var elSub = car3d.querySelector('[data-carsub]');
    var elCr  = car3d.querySelector('[data-credit]');
    if (elTag) elTag.textContent = m.tag;
    if (elTtl) elTtl.textContent = m.title;
    if (elSub) elSub.textContent = m.sub;
    if (elCr)  elCr.innerHTML = m.credit;
  }

  /* ---------- tunables ---------- */
  var MODEL_LEN   = 4.4;
  var MAX_SPD     = 26, MAX_REV = 10;
  var ACCEL = 22, BRAKE = 34, DRAG = 0.8, ROLL_FRIC = 6;
  var STEER_RATE  = 2.1;
  var ARENA_R     = 86;
  var KMH         = 5.0;
  var TOKEN_COUNT = 14, TOKEN_R = 2.0;
  var COIN_HEX = '#ffcf3a';      // gold coin colour — distinct from the accent barriers
  var BEAM_HEX = '#ffe79e';      // warm spotlight beam / floor-glow colour
  var BOOST_TIME  = 1.5, BOOST_MULT = 1.6;
  var FOV_BASE    = 46, FOV_BOOST = 56;
  var SKID_MAX    = 160, SKID_LIFE = 2.4;

  /* ---------- state ---------- */
  var booted = false, running = false, raf = 0, lastT = 0, loadingCar = false;
  var THREE, GLTF, scene, camera, renderer, carGroup, carModel, grid, env;
  var cones = [], tokens = [], tokenGroup, skid = [], skidGeo, skidIdx = 0, skidTimer = 0;
  var pos = { x: 0, z: 0 }, heading = 0, speed = 0, score = 0, boostT = 0, curUrl = '';
  var rewarded = false, rewardTimer = 0, goneToNift = false;
  var REWARD_AT = 5;
  var input = { up: 0, down: 0, left: 0, right: 0 };
  var engine = null, camPos = null, camAim = null, fov = FOV_BASE;

  /* ---------- input ---------- */
  var KEYMAP = {
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right'
  };
  function onKey(down) {
    return function (e) {
      if (!running) return;
      var k = KEYMAP[e.code];
      if (k) { input[k] = down ? 1 : 0; e.preventDefault(); }
      else if (down && e.code === 'Escape') exit();
    };
  }
  function bindPads() {
    stage.querySelectorAll('.gbtn').forEach(function (btn) {
      var key = btn.getAttribute('data-key');
      var press = function (e) { e.preventDefault(); input[key] = 1; btn.classList.add('is-down'); };
      var release = function (e) { if (e) e.preventDefault(); input[key] = 0; btn.classList.remove('is-down'); };
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointerleave', release);
      btn.addEventListener('pointercancel', release);
    });
  }

  /* ---------- theme colours ---------- */
  function cssVar(name, fb) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fb;
  }
  function colors() {
    return { bg: cssVar('--bg', '#07080b'), accent: cssVar('--accent', '#ff5b2e'), text: cssVar('--text', '#fff') };
  }
  // recolour scene to match the active theme (called on boot + theme switch)
  function paintScene() {
    if (!scene) return;
    var c = colors();
    var bg = new THREE.Color(c.bg), accent = new THREE.Color(c.accent);
    scene.background = bg;
    scene.fog.color = bg;
    if (grid) {
      var faint = new THREE.Color(c.text).lerp(bg, 0.82);
      scene.remove(grid); grid.geometry.dispose(); grid.material.dispose();
      grid = new THREE.GridHelper(400, 400, accent, faint);
      grid.material.transparent = true; grid.material.opacity = 0.5;
      scene.add(grid);
    }
    var gold = new THREE.Color(COIN_HEX);
    tokens.forEach(function (t) { t.mesh.traverse(function (o) { if (o.material && o.material.emissive) { o.material.color = gold; o.material.emissive = gold; } }); });
    cones.forEach(function (cn) { cn.material.color = accent; });
    skid.forEach(function (mk) { mk.material.color = accent; });
  }

  /* ---------- car model load / swap ---------- */
  function normalizeCar(model) {
    model.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    var box = new THREE.Box3().setFromObject(model);
    var size = box.getSize(new THREE.Vector3());
    if (size.x > size.z) model.rotation.y = Math.PI / 2;
    box = new THREE.Box3().setFromObject(model);
    size = box.getSize(new THREE.Vector3());
    model.scale.setScalar(MODEL_LEN / Math.max(size.x, size.z));
    box = new THREE.Box3().setFromObject(model);
    var ctr = box.getCenter(new THREE.Vector3());
    model.position.x -= ctr.x;
    model.position.z -= ctr.z;
    model.position.y -= box.min.y;
  }
  function disposeObj(obj) {
    obj.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { m.dispose && m.dispose(); }); }
    });
  }
  async function loadCar(url) {
    if (loadingCar) return;
    loadingCar = true;
    try {
      if (!GLTF) GLTF = (await import('three/addons/loaders/GLTFLoader.js')).GLTFLoader;
      var loader = new GLTF();
      var gltf = await loader.loadAsync(url);
      if (carModel) { carGroup.remove(carModel); disposeObj(carModel); }
      carModel = gltf.scene;
      normalizeCar(carModel);
      carGroup.add(carModel);
      curUrl = url;
    } catch (e) { console.error('[car-game] model load failed', e); }
    loadingCar = false;
  }

  /* ---------- boot the 3D world (once) ---------- */
  async function boot() {
    if (booted) return true;
    try {
      THREE = await import('three');
      var envMod = await import('three/addons/environments/RoomEnvironment.js');
      var c = colors();

      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      scene = new THREE.Scene();
      var bg = new THREE.Color(c.bg);
      scene.background = bg;
      scene.fog = new THREE.Fog(bg, 34, 96);

      var pmrem = new THREE.PMREMGenerator(renderer);
      env = pmrem.fromScene(new envMod.RoomEnvironment(), 0.04).texture;
      scene.environment = env;

      camera = new THREE.PerspectiveCamera(FOV_BASE, 1, 0.1, 400);
      camPos = new THREE.Vector3(0, 4, -9);
      camAim = new THREE.Vector3(0, 0.7, 0);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x202428, 0.55));
      var key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(6, 12, 4); key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 1; key.shadow.camera.far = 60;
      key.shadow.camera.left = -20; key.shadow.camera.right = 20;
      key.shadow.camera.top = 20; key.shadow.camera.bottom = -20;
      key.shadow.bias = -0.0004;
      scene.add(key);

      var ground = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.ShadowMaterial({ opacity: 0.32 }));
      ground.rotation.x = -Math.PI / 2; ground.position.y = 0.001; ground.receiveShadow = true;
      scene.add(ground);

      var accent = new THREE.Color(c.accent);
      var faint = new THREE.Color(c.text).lerp(bg, 0.82);
      grid = new THREE.GridHelper(400, 400, accent, faint);
      grid.material.transparent = true; grid.material.opacity = 0.5;
      scene.add(grid);

      // pylons (barriers) — accent cone with a dark warning band so they read
      // clearly as "avoid", never confused with the cyan collectibles.
      var coneGeo = new THREE.ConeGeometry(0.36, 1.0, 6);
      var bandGeo = new THREE.TorusGeometry(0.24, 0.055, 8, 18);
      var bandMat = new THREE.MeshStandardMaterial({ color: 0x14181d, roughness: 0.8, metalness: 0.05 });
      for (var i = 0; i < 24; i++) {
        var a = (i / 24) * Math.PI * 2, r = 16 + (i % 5) * 11;
        var cone = new THREE.Mesh(coneGeo, new THREE.MeshStandardMaterial({ color: accent, roughness: 0.5, metalness: 0.05 }));
        cone.position.set(Math.cos(a) * r, 0.5, Math.sin(a) * r);
        cone.castShadow = true;
        var band = new THREE.Mesh(bandGeo, bandMat);
        band.rotation.x = Math.PI / 2; band.position.y = -0.06;
        cone.add(band);
        scene.add(cone); cones.push(cone);
      }

      // collectible markers
      tokenGroup = new THREE.Group(); scene.add(tokenGroup);

      // skid-mark pool (flat accent decals)
      skidGeo = new THREE.PlaneGeometry(0.32, 1.1);
      for (var s = 0; s < SKID_MAX; s++) {
        var mk = new THREE.Mesh(skidGeo, new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0, depthWrite: false }));
        mk.rotation.x = -Math.PI / 2; mk.position.y = 0.02; mk.visible = false;
        mk.userData.life = 0; scene.add(mk); skid.push(mk);
      }

      carGroup = new THREE.Group(); scene.add(carGroup);
      await loadCar(carUrl());

      booted = true;
      if (loadEl) loadEl.setAttribute('hidden', '');
      return true;
    } catch (err) {
      console.error('[car-game] boot failed', err);
      if (loadEl) loadEl.textContent = 'Could not load the circuit.';
      return false;
    }
  }

  /* ---------- collectibles ---------- */
  function makeToken() {
    var gold = new THREE.Color(COIN_HEX);
    var g = new THREE.Group();

    // the coin: a thin gold disc that stands upright and spins about its axis
    var coin = new THREE.Group();
    var disc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 0.1, 30),
      new THREE.MeshStandardMaterial({ color: gold, emissive: gold, emissiveIntensity: 0.85, roughness: 0.26, metalness: 0.9 })
    );
    disc.rotation.x = Math.PI / 2;                 // round faces toward the viewer
    var rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.5, 0.07, 10, 30),
      new THREE.MeshStandardMaterial({ color: gold, emissive: gold, emissiveIntensity: 1.15, roughness: 0.18, metalness: 1.0 })
    );
    coin.add(disc); coin.add(rim);
    g.add(coin);
    g.userData.coin = coin;

    // faked spotlight: a soft additive light-shaft + a glow pool on the floor
    // (cheap stand-in for a real SpotLight, so 14 of them stay performant)
    var beam = new THREE.Mesh(
      new THREE.ConeGeometry(0.9, 3.2, 24, 1, true),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(BEAM_HEX), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
    );
    beam.position.y = 0.67;                        // base at the floor, apex up at the "source"
    g.add(beam);

    var glow = new THREE.Mesh(
      new THREE.CircleGeometry(0.95, 30),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(BEAM_HEX), transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.92;                       // pooled on the floor under the coin
    g.add(glow);

    return g;
  }
  function spawnTokens(n) {
    for (var i = 0; i < n; i++) {
      var ang = Math.random() * Math.PI * 2;
      var r = 16 + Math.random() * 58;
      var t = makeToken();
      t.position.set(Math.cos(ang) * r, 0.95, Math.sin(ang) * r);
      tokenGroup.add(t);
      tokens.push({ mesh: t, coin: t.userData.coin, phase: Math.random() * Math.PI * 2, baseY: 0.95 });
    }
  }
  function clearTokens() {
    tokens.forEach(function (t) { tokenGroup.remove(t.mesh); disposeObj(t.mesh); });
    tokens.length = 0;
  }

  /* ---------- skid marks ---------- */
  function dropSkid(x, z, ang) {
    var mk = skid[skidIdx]; skidIdx = (skidIdx + 1) % SKID_MAX;
    mk.position.set(x, 0.02, z);
    mk.rotation.z = -ang;            // plane was tipped flat (rot.x), tyaw via z after flip
    mk.material.opacity = 0.5;
    mk.userData.life = SKID_LIFE;
    mk.visible = true;
  }

  /* ---------- per-frame ---------- */
  function resize() {
    if (!renderer) return;
    var w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  function step(dt) {
    var throttle = input.up - input.down;
    var steer = input.right - input.left;
    if (boostT > 0) boostT = Math.max(0, boostT - dt);
    var boosting = boostT > 0;
    var topSpd = MAX_SPD * (boosting ? BOOST_MULT : 1);

    // longitudinal
    if (throttle > 0) speed += (ACCEL + (boosting ? 16 : 0)) * dt;
    else if (throttle < 0) speed -= BRAKE * dt;
    else {
      var f = ROLL_FRIC * dt;
      if (speed > 0) speed = Math.max(0, speed - f);
      else if (speed < 0) speed = Math.min(0, speed + f);
    }
    speed -= speed * DRAG * dt;
    if (speed > topSpd) speed = topSpd;
    if (speed < -MAX_REV) speed = -MAX_REV;

    var grip = Math.min(1, Math.abs(speed) / 8);
    var dir = speed >= 0 ? 1 : -1;
    heading -= steer * STEER_RATE * grip * dir * dt;

    var fx = Math.sin(heading), fz = Math.cos(heading);
    pos.x += fx * speed * dt;
    pos.z += fz * speed * dt;

    // boundary
    var d = Math.hypot(pos.x, pos.z);
    if (d > ARENA_R) { pos.x *= ARENA_R / d; pos.z *= ARENA_R / d; speed *= 0.4; }

    // pylons
    for (var i = 0; i < cones.length; i++) {
      var cn = cones[i];
      var dx = pos.x - cn.position.x, dz = pos.z - cn.position.z, dd = Math.hypot(dx, dz);
      if (dd < 1.25 && dd > 0.0001) {
        var push = 1.25 - dd; pos.x += (dx / dd) * push; pos.z += (dz / dd) * push;
        speed *= 0.6; cn.rotation.z = Math.min(0.5, cn.rotation.z + 0.25);
      } else if (cn.rotation.z > 0) cn.rotation.z = Math.max(0, cn.rotation.z - dt * 1.5);
    }

    // collectibles
    for (var j = tokens.length - 1; j >= 0; j--) {
      var tk = tokens[j];
      tk.phase += dt * 2.2;
      if (tk.coin) { tk.coin.rotation.y += dt * 2.6; tk.coin.position.y = Math.sin(tk.phase) * 0.14; }
      var tdx = pos.x - tk.mesh.position.x, tdz = pos.z - tk.mesh.position.z;
      if (Math.hypot(tdx, tdz) < TOKEN_R) {
        tokenGroup.remove(tk.mesh); disposeObj(tk.mesh); tokens.splice(j, 1);
        score++; boostT = BOOST_TIME;
        if (scoreEl) scoreEl.textContent = score + ' / ' + REWARD_AT;
        collectSound();
        if (score >= REWARD_AT && !rewarded) { rewarded = true; triggerReward(); }
        if (tokens.length === 0) { spawnTokens(TOKEN_COUNT + 2); levelSound(); }
      }
    }

    // skid marks when cornering hard at speed
    skidTimer += dt;
    if (Math.abs(steer) > 0.2 && Math.abs(speed) > MAX_SPD * 0.42 && skidTimer > 0.03) {
      skidTimer = 0;
      var lx = Math.cos(heading), lz = -Math.sin(heading);      // lateral
      var rx = pos.x - fx * 1.5, rz = pos.z - fz * 1.5;          // rear axle
      dropSkid(rx + lx * 0.62, rz + lz * 0.62, heading);
      dropSkid(rx - lx * 0.62, rz - lz * 0.62, heading);
    }
    for (var k = 0; k < skid.length; k++) {
      var mk = skid[k];
      if (!mk.visible) continue;
      mk.userData.life -= dt;
      if (mk.userData.life <= 0) { mk.visible = false; mk.material.opacity = 0; }
      else mk.material.opacity = (mk.userData.life / SKID_LIFE) * 0.5;
    }

    // apply to car
    carGroup.position.set(pos.x, 0, pos.z);
    carGroup.rotation.y = heading;
    var sf = speed / MAX_SPD;
    if (carModel) {
      carModel.rotation.z = -steer * 0.10 * Math.min(1, Math.abs(sf));
      carModel.rotation.x = -throttle * 0.02 * grip;
    }

    // boost visuals
    gameEl.classList.toggle('is-boost', boosting);
    fov += ((boosting ? FOV_BOOST : FOV_BASE) - fov) * Math.min(1, dt * 5);
    camera.fov = fov; camera.updateProjectionMatrix();

    // chase camera
    var camDist = 9 + Math.abs(sf) * 2.4, height = 3.7 + Math.abs(sf) * 0.6;
    camPos.lerp(new THREE.Vector3(pos.x - fx * camDist, height, pos.z - fz * camDist), Math.min(1, dt * 4.5));
    camera.position.copy(camPos);
    camAim.lerp(new THREE.Vector3(pos.x + fx * 3, 0.8, pos.z + fz * 3), Math.min(1, dt * 5));
    camera.lookAt(camAim);

    grid.position.x = Math.round(pos.x);
    grid.position.z = Math.round(pos.z);

    if (spdEl) spdEl.textContent = Math.round(Math.abs(speed) * KMH);
    if (engine) engine.set(Math.min(1.3, Math.abs(speed) / MAX_SPD), throttle, boosting);
  }

  function loop(t) {
    if (!running) return;
    var dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
    lastT = t;
    step(dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }

  /* ---------- audio ---------- */
  function ac() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    var c = window.__audioCtx || (window.__audioCtx = new AC());
    if (c.state === 'suspended') c.resume();
    return c;
  }
  function makeEngine() {
    var ctx = ac(); if (!ctx) return null;
    var t = ctx.currentTime;
    var master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    master.gain.setTargetAtTime(0.12, t, 0.2);
    var lpf = ctx.createBiquadFilter(); lpf.type = 'lowpass'; lpf.frequency.value = 700; lpf.Q.value = 0.7; lpf.connect(master);
    var harm = [{ m: 1, g: 0.9 }, { m: 2, g: 0.55 }, { m: 3, g: 0.32 }, { m: 4, g: 0.18 }];
    var oscs = harm.map(function (h) {
      var o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 30 * h.m;
      var g = ctx.createGain(); g.gain.value = h.g; o.connect(g); g.connect(lpf); o.start(t); return { o: o, m: h.m };
    });
    var len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 950; bp.Q.value = 0.8;
    var chop = ctx.createGain(); chop.gain.value = 0;
    noise.connect(bp); bp.connect(chop); chop.connect(master);
    var mod = ctx.createOscillator(); mod.type = 'sawtooth'; mod.frequency.value = 30;
    var modDepth = ctx.createGain(); modDepth.gain.value = 0.26;
    var modBias = ctx.createConstantSource(); modBias.offset.value = 0.16;
    mod.connect(modDepth); modDepth.connect(chop.gain); modBias.connect(chop.gain);
    noise.start(t); mod.start(t); modBias.start(t);
    return {
      set: function (frac, throttle, boosting) {
        var f0 = 26 + frac * 116, now = ctx.currentTime;
        oscs.forEach(function (h) { h.o.frequency.setTargetAtTime(f0 * h.m, now, 0.08); });
        mod.frequency.setTargetAtTime(f0, now, 0.08);
        lpf.frequency.setTargetAtTime(700 + frac * 2600 + (boosting ? 600 : 0), now, 0.1);
        master.gain.setTargetAtTime(0.1 + frac * 0.05 + (throttle > 0 ? 0.02 : 0) + (boosting ? 0.02 : 0), now, 0.12);
      },
      stop: function () {
        var now = ctx.currentTime; master.gain.setTargetAtTime(0.0001, now, 0.12);
        var off = now + 0.4;
        try { oscs.forEach(function (h) { h.o.stop(off); }); noise.stop(off); mod.stop(off); modBias.stop(off); } catch (e) {}
      }
    };
  }
  function blip(freqs, type, dur, vol) {
    var ctx = ac(); if (!ctx) return;
    var t0 = ctx.currentTime + 0.001;
    var master = ctx.createGain(); master.gain.value = vol || 0.16; master.connect(ctx.destination);
    freqs.forEach(function (f, i) {
      var o = ctx.createOscillator(); o.type = type || 'triangle';
      var t = t0 + i * (dur * 0.6);
      o.frequency.setValueAtTime(f, t);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.6, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
    });
  }
  function collectSound() { blip([880, 1320], 'triangle', 0.12, 0.16); }
  function levelSound() { blip([660, 990, 1320, 1760], 'triangle', 0.14, 0.18); }

  /* ---------- enter / exit ---------- */
  async function play() {
    window.__carGamePlaying = true;
    if (window.__hoverEngineStop) window.__hoverEngineStop();

    car3d.classList.add('is-playing');
    gameEl.removeAttribute('hidden');
    if (loadEl) loadEl.removeAttribute('hidden');

    var ok = await boot();
    if (!ok) return;
    if (curUrl !== carUrl()) await loadCar(carUrl());  // theme changed between plays

    // reset run
    pos.x = 0; pos.z = 0; heading = Math.PI; speed = 0; score = 0; boostT = 0;
    rewarded = false; goneToNift = false; clearTimeout(rewardTimer);
    if (rewardEl) {
      rewardEl.classList.remove('is-on');
      rewardEl.setAttribute('hidden', '');
      var resetBar = rewardEl.querySelector('.ohreward__bar i');
      if (resetBar) { resetBar.style.transition = 'none'; resetBar.style.width = '0%'; }
    }
    input.up = input.down = input.left = input.right = 0;
    if (scoreEl) scoreEl.textContent = '0 / ' + REWARD_AT;
    skid.forEach(function (mk) { mk.visible = false; mk.material.opacity = 0; });
    clearTokens(); spawnTokens(TOKEN_COUNT);
    camPos.set(-Math.sin(heading) * 9, 4, -Math.cos(heading) * 9);
    fov = FOV_BASE; camera.fov = fov; camera.updateProjectionMatrix();
    resize();

    if (!engine) engine = makeEngine();
    running = true; lastT = performance.now();
    raf = requestAnimationFrame(loop);
  }

  function exit() {
    running = false; cancelAnimationFrame(raf);
    if (engine) { engine.stop(); engine = null; }
    gameEl.setAttribute('hidden', '');
    gameEl.classList.remove('is-boost');
    car3d.classList.remove('is-playing');
    window.__carGamePlaying = false;
    stage.querySelectorAll('.gbtn.is-down').forEach(function (b) { b.classList.remove('is-down'); });
  }

  /* ---------- reward: collect 5 → message → open NIFT ---------- */
  function triggerReward() {
    // freeze the game and silence the engine, but leave the scene on screen
    running = false; cancelAnimationFrame(raf);
    if (engine) { engine.stop(); engine = null; }
    input.up = input.down = input.left = input.right = 0;
    stage.querySelectorAll('.gbtn.is-down').forEach(function (b) { b.classList.remove('is-down'); });
    // little fanfare
    blip([660, 990, 1320, 1760, 2640], 'triangle', 0.16, 0.2);

    if (!rewardEl) { goToNift(); return; }
    rewardEl.removeAttribute('hidden');
    void rewardEl.offsetWidth;            // reflow so the fade-in plays
    rewardEl.classList.add('is-on');
    var bar = rewardEl.querySelector('.ohreward__bar i');
    if (bar) { bar.style.transition = ''; void bar.offsetWidth; bar.style.width = '100%'; }
    clearTimeout(rewardTimer);
    rewardTimer = setTimeout(goToNift, 3300);   // matches the 3s bar + a beat
  }

  function goToNift() {
    if (goneToNift) return;
    goneToNift = true;
    clearTimeout(rewardTimer);
    var wipe = document.createElement('div');
    wipe.className = 'nift-wipe';
    document.body.appendChild(wipe);
    void wipe.offsetWidth;
    wipe.classList.add('is-on');
    setTimeout(function () { window.location.href = 'nift.html'; }, 620);
  }

  // Cancel the auto-transition: stop the countdown, dismiss the panel, and
  // drop the user straight back into the drive where they left off.
  function cancelReward() {
    if (goneToNift) return;                 // already navigating — too late
    clearTimeout(rewardTimer);
    if (rewardEl) {
      rewardEl.classList.remove('is-on');
      var bar = rewardEl.querySelector('.ohreward__bar i');
      setTimeout(function () {
        rewardEl.setAttribute('hidden', '');
        if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
      }, 380);                              // let the fade-out finish first
    }
    // resume the game loop
    if (booted && car3d.classList.contains('is-playing')) {
      input.up = input.down = input.left = input.right = 0;
      stage.querySelectorAll('.gbtn.is-down').forEach(function (b) { b.classList.remove('is-down'); });
      if (!engine) engine = makeEngine();
      running = true; lastT = performance.now();
      raf = requestAnimationFrame(loop);
    }
  }

  /* ---------- wire up ---------- */
  applyShowroom();
  // preloadModels() background-fetches BOTH ~17-20MB GLBs (current theme's
  // car is already loading via applyShowroom() -> model-viewer; this warms
  // the OTHER theme's car too, so a later theme swap is instant). That's a
  // reasonable trade for someone actually looking at the showroom, but
  // firing it unconditionally on an idle callback meant every visit to this
  // page silently downloaded up to ~37MB in the background within a few
  // seconds — even on a slow connection, even if the visitor never scrolled
  // anywhere near the car. Gate it the same way the neighboring inline
  // model-viewer loader in about.html already gates its own fetch: skip on
  // lite/data-saver connections, and wait until the showroom is actually
  // near the viewport.
  if (!window.__lite) {
    if ('IntersectionObserver' in window) {
      var glbIo = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          glbIo.disconnect();
          if ('requestIdleCallback' in window) requestIdleCallback(preloadModels, { timeout: 3000 });
          else setTimeout(preloadModels, 1800);
        }
      }, { rootMargin: '600px 0px' });
      glbIo.observe(car3d);
    } else if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadModels, { timeout: 3000 });
    } else {
      setTimeout(preloadModels, 1800);
    }
  }
  playBtn.addEventListener('click', play);
  if (exitBtn) exitBtn.addEventListener('click', exit);
  if (rewardEl) {
    var rewardCancel = rewardEl.querySelector('[data-reward-cancel]');
    if (rewardCancel) rewardCancel.addEventListener('click', cancelReward);
  }
  bindPads();
  window.addEventListener('keydown', onKey(true));
  window.addEventListener('keyup', onKey(false));
  window.addEventListener('resize', function () { if (running) resize(); });
  if (window.ResizeObserver) new ResizeObserver(function () { if (running) resize(); }).observe(stage);

  // react to theme switches
  new MutationObserver(function () {
    applyShowroom();
    if (booted && curUrl !== carUrl()) { paintScene(); loadCar(carUrl()); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (running) { running = false; cancelAnimationFrame(raf); if (engine) { engine.stop(); engine = null; } }
    } else if (!running && booted && car3d.classList.contains('is-playing') && !rewarded) {
      input.up = input.down = input.left = input.right = 0;
      stage.querySelectorAll('.gbtn.is-down').forEach(function (b) { b.classList.remove('is-down'); });
      if (!engine) engine = makeEngine();
      running = true; lastT = performance.now();
      raf = requestAnimationFrame(loop);
    }
  });
})();

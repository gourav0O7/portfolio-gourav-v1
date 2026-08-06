/* ============================================================
   LOADER — sci-fi boot overlay (auto, real progress)
   Shows once per session. No manual "enter" step: the counter
   climbs 000 → 100 in step with the REAL download of the hero's
   heavy assets (the 3D model + video reel), and the homepage is
   revealed only once they're actually loaded. Loading sound is
   best-effort — Web Audio can't start without a user gesture, so
   it kicks in only if the visitor moves/clicks during load; the
   loader never waits on it.
   ============================================================ */
(function () {
  'use strict';

  // Land at the TOP on every fresh open — never let the browser restore a
  // prior scroll position (that was dropping visitors straight into Work).
  // A real fragment link (index.html#work) still wins, so guard on hash.
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  if (!location.hash) window.scrollTo(0, 0);

  // skip if already booted this session (incl. internal navigation)
  if (sessionStorage.getItem('booted') === '1') {
    document.documentElement.classList.add('booted');
    return;
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- real asset tracking ----
  // c64-hero.js (injected near end of body) streams the GLB model + hero
  // video reel and reports live byte progress here. KNOWN_TOTAL is the
  // fallback denominator so the bar is accurate even if a proxy strips
  // Content-Length. In __lite mode neither asset loads, so there's nothing
  // to wait on. IMPORTANT: seed bytesTotal here — whichever script creates
  // the shared object first wins, and the loader runs first, so if we left
  // it 0 the percentage would divide by zero and sit at 000 the whole time.
  var KNOWN_TOTAL = 5219392 + 5596623; // commodore64.glb (quantized + WebP textures) + hero-reel.mp4 (re-encoded)
  var AL = window.__assetLoad = window.__assetLoad ||
    { c64: 0, video: 0, c64Done: false, videoDone: false, bytesLoaded: 0, bytesTotal: 0 };
  if (!AL.bytesTotal) AL.bytesTotal = KNOWN_TOTAL;
  var waitForAssets = !window.__lite;
  function assetsReady() { return !waitForAssets || (AL.c64Done && AL.videoDone); }
  function assetProgress() {
    if (!waitForAssets) return 1;
    return Math.min(1, AL.bytesLoaded / (AL.bytesTotal || KNOWN_TOTAL));
  }

  // ---- markup (no BEGIN button — it's a pure auto-progress loader) ----
  var root = document.createElement('div');
  root.className = 'loader';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = ''
    + '<div class="loader__grid"></div>'
    + '<div class="loader__scan"></div>'
    + '<div class="loader__panel">'
    +   '<div class="loader__head">'
    +     '<span class="loader__pip"></span>'
    +     '<span>PORTFOLIO.SYS</span>'
    +     '<span class="loader__sep">//</span>'
    +     '<span>GOURAV.SHARMA</span>'
    +     '<span class="loader__caret">v1.2</span>'
    +   '</div>'
    +   '<div class="loader__pct"><span data-pct>000</span><span class="loader__pcts">%</span></div>'
    +   '<div class="loader__bar"><i></i></div>'
    +   '<div class="loader__logs" data-logs></div>'
    +   '<div class="loader__foot">'
    +     '<span>NODE · 04</span>'
    +     '<span data-uplink>UPLINK · DOWNLOADING</span>'
    +     '<span data-clock>--:--:--</span>'
    +   '</div>'
    + '</div>';
  document.documentElement.classList.add('booting');
  if (document.body) document.body.appendChild(root);
  else document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(root); });

  // ---- mini live clock ----
  var clockEl = root.querySelector('[data-clock]');
  function tickClock() {
    var d = new Date();
    var p = function (n) { return ('0' + n).slice(-2); };
    if (clockEl) clockEl.textContent = p(d.getUTCHours()) + ':' + p(d.getUTCMinutes()) + ':' + p(d.getUTCSeconds()) + ' UTC';
  }
  tickClock();
  var clockInt = setInterval(tickClock, 1000);

  // ---- audio (Web Audio; all synthesized) ----
  var ctx = null;
  function ensureCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    window.__audioCtx = ctx; // share with easter-egg.js
    return ctx;
  }
  function playFinishChime() {
    var c = ensureCtx(); if (!c || c.state !== 'running') return;
    var t = c.currentTime + 0.01;
    var blip = c.createOscillator();
    blip.type = 'sine';
    blip.frequency.setValueAtTime(880, t);
    blip.frequency.exponentialRampToValueAtTime(1760, t + 0.18);
    var bg = c.createGain();
    bg.gain.setValueAtTime(0.0001, t);
    bg.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    blip.connect(bg); bg.connect(c.destination);
    blip.start(t); blip.stop(t + 0.28);
  }
  // Continuous download "pulse" — a rhythmic tick whose tempo/pitch track the
  // live transfer speed (setSpeed(mbps)), so it audibly speeds up or slows
  // down with the connection.
  function startLoadingPulse() {
    var c = ensureCtx();
    if (!c) return { setSpeed: function () {}, stop: function () {} };
    var stopped = false, speed = 0, timer = null;
    function scheduleNext() {
      if (stopped) return;
      timer = setTimeout(tick, Math.max(70, 240 - Math.min(speed, 6) * 28));
    }
    function tick() {
      if (stopped) return;
      if (c.state === 'suspended') c.resume();
      var t = c.currentTime + 0.004;
      var osc = c.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(480 + Math.min(speed, 8) * 55, t);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.045, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      osc.connect(g); g.connect(c.destination);
      osc.start(t); osc.stop(t + 0.05);
      scheduleNext();
    }
    tick();
    return {
      setSpeed: function (mbps) { speed = mbps; },
      stop: function () { stopped = true; if (timer) clearTimeout(timer); }
    };
  }

  // Best-effort audio: only real once the visitor makes a gesture (browser
  // autoplay rule). If they never interact during load, it stays silent —
  // the loader never blocks on it.
  var pulse = null, doneEarly = false;
  function unlockAudio() {
    if (pulse || doneEarly) return;
    var c = ensureCtx(); if (!c) return;
    c.resume();
    pulse = startLoadingPulse();
  }
  // Only real intent-to-interact gestures unlock audio — NOT pointermove,
  // otherwise merely moving the cursor over the page starts the loader sound.
  ['pointerdown', 'keydown', 'wheel', 'touchstart', 'click'].forEach(function (ev) {
    window.addEventListener(ev, unlockAudio, { passive: true });
  });

  // ---- logs stream ----
  var logs = [
    'initializing portfolio.sys',
    'loading design_systems · ui_library',
    'mounting case_studies [06]',
    'streaming 3d_assets · hero_reel',
    'calibrating grid · scanlines',
    'uplink established · GOURAV.SHARMA'
  ];
  function pushLog(line, isFinal) {
    var el = root.querySelector('[data-logs]');
    if (!el) return;
    var row = document.createElement('div');
    row.className = 'loader__log';
    row.innerHTML = '<span class="ok">[ ' + (isFinal ? 'OK' : 'ok') + ' ]</span> ' + line;
    el.appendChild(row);
    requestAnimationFrame(function () { row.classList.add('show'); });
  }

  // ---- boot: auto-run, drive the counter off REAL byte progress ----
  function boot() {
    var MIN_MS = reduced ? 0 : 700;   // keep the animation readable on warm cache
    var MAX_MS = 25000;               // safety net: never trap on a stalled asset
    var pctEl = root.querySelector('[data-pct]');
    var bar   = root.querySelector('.loader__bar i');
    var uplink = root.querySelector('[data-uplink]');
    var start = performance.now();
    var shown = 0;
    var lastBytes = AL.bytesLoaded, lastT = start;

    logs.forEach(function (line, i) {
      setTimeout(function () { pushLog(line, i === logs.length - 1); }, (1600 / logs.length) * i);
    });

    var pctInt = setInterval(function () {
      var now = performance.now();
      var elapsed = now - start;
      var target = assetProgress();
      shown += (target - shown) * 0.16;                 // ease toward true progress
      var cap = assetsReady() ? 1 : 0.99;               // don't show 100 until truly done
      var n = Math.round(Math.min(shown, cap) * 100);
      pctEl.textContent = ('00' + n).slice(-3);
      if (bar) bar.style.width = n + '%';

      // live speed → pulse tempo/pitch
      var dt = (now - lastT) / 1000;
      if (dt > 0 && pulse) pulse.setSpeed(((AL.bytesLoaded - lastBytes) / (1048576)) / dt);
      lastBytes = AL.bytesLoaded; lastT = now;

      var ready = assetsReady() && elapsed >= MIN_MS && shown > 0.995;
      if (ready || elapsed >= MAX_MS) {
        clearInterval(pctInt);
        doneEarly = true;
        if (pulse) pulse.stop();
        pctEl.textContent = '100';
        if (bar) bar.style.width = '100%';
        if (uplink) uplink.textContent = 'UPLINK · ESTABLISHED';
        playFinishChime();
        finish();
      }
    }, 30);
  }

  function finish() {
    sessionStorage.setItem('booted', '1');
    root.classList.add('is-done');
    if (!location.hash) window.scrollTo(0, 0);
    setTimeout(function () {
      root.remove();
      clearInterval(clockInt);
      document.documentElement.classList.remove('booting');
      document.documentElement.classList.add('booted');
      if (!location.hash) window.scrollTo(0, 0); // land at top once scroll unlocks
    }, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

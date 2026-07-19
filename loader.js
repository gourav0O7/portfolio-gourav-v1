/* ============================================================
   LOADER — sci-fi boot overlay
   Shows once per session. User clicks "BEGIN TRANSMISSION" →
   original synth sci-fi sweep + 0→100% counter + system logs,
   then fades out. Also unlocks the global AudioContext so the
   brand-mark easter egg can play on hover afterwards.
   ============================================================ */
(function () {
  'use strict';

  // skip if already booted this session (incl. internal navigation)
  if (sessionStorage.getItem('booted') === '1') {
    document.documentElement.classList.add('booted');
    // still publish an unlocked context if user has interacted before — silent
    return;
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- real asset tracking ----
  // c64-hero.js (injected later, near end of body) reports live progress on
  // the GLB model + hero video reel here. In __lite mode neither ever loads,
  // so there's nothing to wait for. Whichever script runs first creates the
  // shared object; both point at the same one.
  var AL = window.__assetLoad = window.__assetLoad || { c64: 0, video: 0, c64Done: false, videoDone: false, bytesLoaded: 0, bytesTotal: 0 };
  var waitForAssets = !window.__lite;
  function assetsReady() { return !waitForAssets || (AL.c64Done && AL.videoDone); }
  function assetProgress() {
    if (!waitForAssets) return 1;
    if (AL.bytesTotal) return Math.min(1, AL.bytesLoaded / AL.bytesTotal);
    return AL.c64Done && AL.videoDone ? 1 : 0;
  }

  // ---- markup ----
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
    +   '<button type="button" class="loader__begin" data-begin>'
    +     '<span class="loader__begin-l">// Engage to initialize transmission</span>'
    +     '<span class="loader__begin-cta">BEGIN TRANSMISSION <span class="arr">→</span></span>'
    +   '</button>'
    +   '<div class="loader__foot">'
    +     '<span>NODE · 04</span>'
    +     '<span>UPLINK · STAND-BY</span>'
    +     '<span data-clock>--:--:--</span>'
    +   '</div>'
    + '</div>';
  document.documentElement.classList.add('booting');
  // mount as early as possible
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

  // ---- audio: sci-fi sweep + ambient pad ----
  // built on Web Audio; nothing copyrighted, all synthesized.
  var ctx = null;
  function ensureCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    window.__audioCtx = ctx;       // share with easter-egg.js
    return ctx;
  }

  // Opening flourish — a short sweep to mark "transmission begun".
  function playOpenSweep() {
    var c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    var t = c.currentTime + 0.02;

    var master = c.createGain();
    master.gain.value = 0.0001;
    master.gain.exponentialRampToValueAtTime(0.22, t + 0.3);
    master.gain.setValueAtTime(0.22, t + 1.1);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    master.connect(c.destination);

    var drone = c.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(55, t);
    drone.frequency.exponentialRampToValueAtTime(82.5, t + 1.3);
    var dg = c.createGain(); dg.gain.value = 0.5;
    drone.connect(dg); dg.connect(master);
    drone.start(t); drone.stop(t + 1.7);

    var noiseBuf = c.createBuffer(1, c.sampleRate * 0.9, c.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    var n = c.createBufferSource();
    n.buffer = noiseBuf;
    var hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(180, t);
    hp.frequency.exponentialRampToValueAtTime(8000, t + 0.8);
    var ng = c.createGain();
    ng.gain.setValueAtTime(0.0001, t);
    ng.gain.exponentialRampToValueAtTime(0.16, t + 0.25);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    n.connect(hp); hp.connect(ng); ng.connect(master);
    n.start(t); n.stop(t + 0.95);
  }

  // Completion sting — plays once the assets are actually ready.
  function playFinishChime() {
    var c = ensureCtx();
    if (!c) return;
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

  // Continuous download "pulse" — a rhythmic tick whose tempo and pitch
  // track the live transfer speed (call setSpeed(mbps) as it changes), so
  // it visibly/audibly speeds up or slows down with the connection.
  function startLoadingPulse() {
    var c = ensureCtx();
    if (!c) return { setSpeed: function () {}, stop: function () {} };
    var stopped = false, speed = 0, timer = null;
    function scheduleNext() {
      if (stopped) return;
      var interval = Math.max(70, 240 - Math.min(speed, 6) * 28);
      timer = setTimeout(tick, interval);
    }
    function tick() {
      if (stopped) return;
      if (c.state === 'suspended') c.resume();
      var t = c.currentTime + 0.004;
      var freq = 480 + Math.min(speed, 8) * 55;
      var osc = c.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.045, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      osc.connect(g); g.connect(c.destination);
      osc.start(t); osc.stop(t + 0.05);
      scheduleNext();
    }
    // fire the first tick synchronously (still inside the caller's gesture
    // handler) — strict browsers can block audio started later, e.g. from
    // a setTimeout/rAF callback with no direct gesture in its call stack.
    tick();
    return {
      setSpeed: function (mbps) { speed = mbps; },
      stop: function () { stopped = true; if (timer) clearTimeout(timer); }
    };
  }

  // ---- logs stream ----
  var logs = [
    'initializing portfolio.sys',
    'loading design_systems · ui_library',
    'mounting case_studies [06]',
    'calibrating grid · scanlines',
    'syncing typography · instrument_serif',
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

  // ---- begin sequence ----
  var begun = false;
  var btn = root.querySelector('[data-begin]');

  // ---- auto-enter countdown ----
  // If the user doesn't engage the CTA within 3s, enter automatically.
  // (Audio needs a real gesture to play, so an auto-enter is silent — fine.)
  var AUTO_SECS = 3;
  var autoLeft = AUTO_SECS;
  var autoInt = null;
  var hintEl = root.querySelector('.loader__begin-l');
  var defaultHint = hintEl ? hintEl.textContent : '';
  function renderCountdown() {
    if (hintEl) hintEl.textContent = '// auto-initializing in ' + autoLeft + 's — or engage now';
  }
  function stopCountdown() {
    if (autoInt) { clearInterval(autoInt); autoInt = null; }
    if (hintEl) hintEl.textContent = defaultHint;
  }
  if (!reduced) {
    renderCountdown();
    autoInt = setInterval(function () {
      autoLeft -= 1;
      if (autoLeft <= 0) { stopCountdown(); begin(); return; }
      renderCountdown();
    }, 1000);
  } else {
    // reduced-motion: skip the theatrics, enter right away
    setTimeout(begin, 200);
  }

  function begin() {
    if (begun) return;
    begun = true;
    stopCountdown();
    btn.classList.add('is-engaged');
    setTimeout(function () { btn.style.display = 'none'; }, 320);
    playOpenSweep(); // no-op if this wasn't a real user gesture (browser autoplay rule)
    var pulse = startLoadingPulse(); // continuous tick, tempo/pitch follow live download speed

    // Progress now tracks REAL loading of the hero's big assets (GLB model +
    // video reel) via window.__assetLoad, instead of a fixed fake timer.
    // MIN_MS keeps a brief, readable animation even on a warm cache; MAX_MS
    // is a safety net so a stalled/broken asset can never trap someone here.
    var MIN_MS = reduced ? 0 : 900;
    var MAX_MS = 20000;
    var pctEl = root.querySelector('[data-pct]');
    var bar   = root.querySelector('.loader__bar i');
    var start = performance.now();
    var shown = 0;
    var lastBytes = AL.bytesLoaded, lastT = start;

    // stream logs across the minimum visible window
    var logSpan = Math.max(MIN_MS, 1400);
    logs.forEach(function (line, i) {
      setTimeout(function () { pushLog(line, i === logs.length - 1); }, (logSpan / logs.length) * i);
    });

    // counter — use setInterval (more reliable across tab throttling
    // than requestAnimationFrame, which can pause to 1Hz in background)
    var pctInt = setInterval(function () {
      var now = performance.now();
      var elapsed = now - start;
      var target = assetProgress();
      shown += (target - shown) * 0.25;
      var displayCap = target >= 1 ? 1 : 0.99;
      var n = Math.round(Math.min(shown, displayCap) * 100);
      pctEl.textContent = ('00' + n).slice(-3);
      if (bar) bar.style.width = n + '%';

      // live transfer speed (MB/s) — drives the pulse's tempo/pitch
      var dt = (now - lastT) / 1000;
      if (dt > 0) {
        var mbps = ((AL.bytesLoaded - lastBytes) / (1024 * 1024)) / dt;
        pulse.setSpeed(mbps);
      }
      lastBytes = AL.bytesLoaded; lastT = now;

      if ((assetsReady() && elapsed >= MIN_MS) || elapsed >= MAX_MS) {
        clearInterval(pctInt);
        pulse.stop();
        pctEl.textContent = '100';
        if (bar) bar.style.width = '100%';
        playFinishChime();
        finish();
      }
    }, 30);
  }

  function finish() {
    sessionStorage.setItem('booted', '1');
    root.classList.add('is-done');
    setTimeout(function () {
      root.remove();
      clearInterval(clockInt);
      document.documentElement.classList.remove('booting');
      document.documentElement.classList.add('booted');
    }, 700);
  }

  btn.addEventListener('click', begin);

  // pressing Enter also starts (a11y)
  window.addEventListener('keydown', function (e) {
    if (!begun && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); begin(); }
  });
})();

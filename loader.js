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

  function playSciFi() {
    var c = ensureCtx();
    if (!c) return 0;
    if (c.state === 'suspended') c.resume();

    var t = c.currentTime + 0.02;

    // master
    var master = c.createGain();
    master.gain.value = 0.0001;
    master.gain.exponentialRampToValueAtTime(0.22, t + 0.4);
    master.gain.setValueAtTime(0.22, t + 2.4);
    master.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    master.connect(c.destination);

    // 1) deep sub drone — slow rise
    var drone = c.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(55, t);
    drone.frequency.exponentialRampToValueAtTime(82.5, t + 2.6);
    var dg = c.createGain(); dg.gain.value = 0.55;
    drone.connect(dg); dg.connect(master);
    drone.start(t); drone.stop(t + 3.4);

    // 2) shimmer pad — two detuned saws through bandpass
    var padFilter = c.createBiquadFilter();
    padFilter.type = 'bandpass';
    padFilter.frequency.setValueAtTime(380, t);
    padFilter.frequency.exponentialRampToValueAtTime(2400, t + 2.4);
    padFilter.Q.value = 1.4;

    var pg = c.createGain(); pg.gain.value = 0.18;

    [220, 277.18, 329.63, 440].forEach(function (f, i) {
      var o = c.createOscillator();
      o.type = i % 2 ? 'sawtooth' : 'triangle';
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 8;
      o.connect(padFilter);
      o.start(t); o.stop(t + 3.2);
    });
    padFilter.connect(pg); pg.connect(master);

    // 3) sweep — a noise burst through a sweeping highpass for sci-fi air
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
    ng.gain.exponentialRampToValueAtTime(0.18, t + 0.25);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    n.connect(hp); hp.connect(ng); ng.connect(master);
    n.start(t); n.stop(t + 0.95);

    // 4) confirmation blip near end (a clean sine peak)
    var blipT = t + 2.55;
    var blip = c.createOscillator();
    blip.type = 'sine';
    blip.frequency.setValueAtTime(880, blipT);
    blip.frequency.exponentialRampToValueAtTime(1760, blipT + 0.18);
    var bg = c.createGain();
    bg.gain.setValueAtTime(0.0001, blipT);
    bg.gain.exponentialRampToValueAtTime(0.25, blipT + 0.01);
    bg.gain.exponentialRampToValueAtTime(0.0001, blipT + 0.22);
    blip.connect(bg); bg.connect(master);
    blip.start(blipT); blip.stop(blipT + 0.28);

    return 3.2; // total length
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

    var dur = reduced ? 800 : Math.max(2400, (playSciFi() * 1000) - 200);

    // counter — use setInterval (more reliable across tab throttling
    // than requestAnimationFrame, which can pause to 1Hz in background)
    var pctEl = root.querySelector('[data-pct]');
    var bar   = root.querySelector('.loader__bar i');
    var start = performance.now();
    var pctInt = setInterval(function () {
      var p = Math.min(1, (performance.now() - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var n = Math.round(eased * 100);
      pctEl.textContent = ('00' + n).slice(-3);
      if (bar) bar.style.width = (eased * 100) + '%';
      if (p >= 1) { clearInterval(pctInt); finish(); }
    }, 30);

    // stream logs
    logs.forEach(function (line, i) {
      setTimeout(function () { pushLog(line, i === logs.length - 1); }, (dur / logs.length) * i);
    });
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

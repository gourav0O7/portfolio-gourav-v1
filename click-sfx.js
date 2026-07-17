
/* ============================================================
   CLICK SFX
   Tiny synthesized sci-fi blip on every click. Reuses the
   shared AudioContext (window.__audioCtx) so it cooperates
   with the loader + easter-egg riff. Throttled, low volume,
   no external assets.
   ============================================================ */
(function () {
  'use strict';

  var ctx = null;
  var last = 0;
  var THROTTLE = 40; // ms between blips

  // selectors that count as "clickable / interactive"
  var INTERACTIVE_SEL = [
    'a', 'button', 'input', 'textarea', 'select', 'label',
    'summary', 'details', 'image-slot',
    '[role="button"]', '[role="link"]', '[role="tab"]',
    '[onclick]', '[data-interactive]'
  ].join(',');

  function isInteractive(el) {
    while (el && el.nodeType === 1 && el !== document.documentElement) {
      if (el.matches && el.matches(INTERACTIVE_SEL)) return true;
      var ti = el.getAttribute && el.getAttribute('tabindex');
      if (ti !== null && parseInt(ti, 10) >= 0) return true;
      // fallback heuristic: anything with cursor:pointer behaves clickable
      try {
        if (window.getComputedStyle(el).cursor === 'pointer') return true;
      } catch (e) { /* ignore */ }
      el = el.parentElement;
    }
    return false;
  }

  function ensureCtx() {
    if (window.__audioCtx) { ctx = window.__audioCtx; return ctx; }
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    window.__audioCtx = ctx;
    return ctx;
  }

  function playBlip() {
    var c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();

    var t0 = c.currentTime + 0.001;

    // master chain — highpass for crispness, very low gain
    var hp = c.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 500;
    var master = c.createGain();
    master.gain.value = 0.16;
    hp.connect(master);
    master.connect(c.destination);

    // body: sine sweep 2400 → 700 Hz
    var o1 = c.createOscillator();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(2400, t0);
    o1.frequency.exponentialRampToValueAtTime(700, t0 + 0.075);
    var g1 = c.createGain();
    g1.gain.setValueAtTime(0.0001, t0);
    g1.gain.exponentialRampToValueAtTime(0.55, t0 + 0.0025);
    g1.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.095);
    o1.connect(g1); g1.connect(hp);
    o1.start(t0); o1.stop(t0 + 0.12);

    // overtone: square 3800 → 1500 Hz for digital bite
    var o2 = c.createOscillator();
    o2.type = 'square';
    o2.frequency.setValueAtTime(3800, t0);
    o2.frequency.exponentialRampToValueAtTime(1500, t0 + 0.05);
    var g2 = c.createGain();
    g2.gain.setValueAtTime(0.0001, t0);
    g2.gain.exponentialRampToValueAtTime(0.10, t0 + 0.003);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.055);
    o2.connect(g2); g2.connect(hp);
    o2.start(t0); o2.stop(t0 + 0.08);
  }

  // "denied" blip — two descending square tones through a lowpass,
  // darker and slightly longer than the accept blip
  function playError() {
    var c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();

    var t0 = c.currentTime + 0.001;

    var lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1300;
    lp.Q.value = 0.6;
    var master = c.createGain();
    master.gain.value = 0.13;
    lp.connect(master);
    master.connect(c.destination);

    // tone 1: 320 Hz
    var o1 = c.createOscillator();
    o1.type = 'square';
    o1.frequency.value = 320;
    var g1 = c.createGain();
    g1.gain.setValueAtTime(0.0001, t0);
    g1.gain.exponentialRampToValueAtTime(0.45, t0 + 0.005);
    g1.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.07);
    o1.connect(g1); g1.connect(lp);
    o1.start(t0); o1.stop(t0 + 0.09);

    // tone 2: 180 Hz, ~70ms later
    var t1 = t0 + 0.07;
    var o2 = c.createOscillator();
    o2.type = 'square';
    o2.frequency.value = 180;
    var g2 = c.createGain();
    g2.gain.setValueAtTime(0.0001, t1);
    g2.gain.exponentialRampToValueAtTime(0.45, t1 + 0.005);
    g2.gain.exponentialRampToValueAtTime(0.0001, t1 + 0.1);
    o2.connect(g2); g2.connect(lp);
    o2.start(t1); o2.stop(t1 + 0.12);
  }

  function routeClick(e) {
    var now = performance.now();
    if (now - last < THROTTLE) return;
    last = now;
    // Only sound empty / non-interactive space — links & buttons stay silent.
    if (!isInteractive(e.target)) playError();
  }

  // capture-phase so the click is heard before any handler that
  // navigates away or stops propagation
  document.addEventListener('click', routeClick, true);

  // unlock the AudioContext on first real user gesture
  function unlock() {
    var c = ensureCtx();
    if (c && c.state === 'suspended') c.resume();
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
  }
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('keydown', unlock);
  window.addEventListener('touchstart', unlock, { passive: true });
})();

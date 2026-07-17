
/* ============================================================
   BRAND EASTER EGG
   Hover the brand wordmark → tiny rock-flavoured synth riff
   (original Web Audio synth, no copyrighted audio) plus a
   brief glitch animation on the name. Plays once per hover,
   never auto-plays, respects prefers-reduced-motion for the
   visual side.
   ============================================================ */
(function () {
  'use strict';

  var brand = document.querySelector('.brand');
  var hero  = document.querySelector('.hero__name');
  if (!brand && !hero) return;

  // collect all elements that should trigger the riff
  var triggers = [];
  if (brand) triggers.push({ el: brand, kind: 'brand' });
  if (hero)  triggers.push({ el: hero,  kind: 'hero'  });

  var ctx = null;            // lazy AudioContext
  var playing = false;       // in-flight guard
  var lastPlay = 0;          // throttle (ms)
  var COOLDOWN = 1800;

  function pop() { /* UI pill removed — keep no-op so call sites stay simple */ }

  function ensureCtx() {
    // reuse loader's unlocked context if available
    if (window.__audioCtx) { ctx = window.__audioCtx; return ctx; }
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    window.__audioCtx = ctx;
    return ctx;
  }

  // pitch helper — equal-tempered semitone from A4=440
  function hz(semitonesFromA4) {
    return 440 * Math.pow(2, semitonesFromA4 / 12);
  }

  // mini distortion via waveshaper — gives the "rock" bite
  function makeDistortion(c, amount) {
    var n = 2048;
    var curve = new Float32Array(n);
    var k = amount || 24;
    for (var i = 0; i < n; i++) {
      var x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * Math.PI / 180) / (Math.PI + k * Math.abs(x));
    }
    var ws = c.createWaveShaper();
    ws.curve = curve;
    ws.oversample = '4x';
    return ws;
  }

  // play a single distorted-saw note
  function playNote(c, freq, t0, dur, gain, dest) {
    var o1 = c.createOscillator();
    var o2 = c.createOscillator();
    o1.type = 'sawtooth'; o2.type = 'sawtooth';
    o1.frequency.value = freq;
    o2.frequency.value = freq * 1.005; // tiny detune for thickness
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o1.connect(g); o2.connect(g);
    g.connect(dest);
    o1.start(t0); o2.start(t0);
    o1.stop(t0 + dur + 0.05);
    o2.stop(t0 + dur + 0.05);
  }

  // power chord = root + perfect fifth (+7 semitones), one octave up too
  function playChord(c, rootSemis, t0, dur, gain, dest) {
    playNote(c, hz(rootSemis),       t0, dur, gain,       dest);
    playNote(c, hz(rootSemis + 7),   t0, dur, gain,       dest);
    playNote(c, hz(rootSemis + 12),  t0, dur, gain * 0.6, dest);
  }

  // a single kick at t (synthesized)
  function kick(c, t0, dest) {
    var o = c.createOscillator();
    var g = c.createGain();
    o.frequency.setValueAtTime(120, t0);
    o.frequency.exponentialRampToValueAtTime(40, t0 + 0.12);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.7, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    o.connect(g); g.connect(dest);
    o.start(t0); o.stop(t0 + 0.22);
  }

  function playRiff() {
    var now = performance.now();
    if (playing || now - lastPlay < COOLDOWN) return;
    var c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    playing = true;
    lastPlay = now;

    var t = c.currentTime + 0.02;

    // master chain: distortion → lowpass → master gain → out
    var dist = makeDistortion(c, 22);
    var lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2800;
    lp.Q.value = 0.8;
    var master = c.createGain();
    master.gain.value = 0.22;
    dist.connect(lp); lp.connect(master); master.connect(c.destination);

    // separate dry kick bus
    var dry = c.createGain();
    dry.gain.value = 0.35;
    dry.connect(c.destination);

    // Original rock riff — E5 / G5 / A5 power-chord pattern with
    // a quick pentatonic tag on the end. Loose, just for vibes.
    var BPM = 138;
    var beat = 60 / BPM;     // seconds per beat
    var s = beat / 2;        // 8th note

    // E2 = -29 from A4. Use mid octave for body: E3 = -17.
    var E = -17, G = -14, A = -12, D = -19, B_ = -10;
    var seq = [
      // chunk-chunk on E
      { t: 0*s, kind: 'chord', root: E, dur: s*0.9, gain: 0.18 },
      { t: 1*s, kind: 'chord', root: E, dur: s*0.9, gain: 0.18 },
      // push to G
      { t: 2*s, kind: 'chord', root: G, dur: s*0.9, gain: 0.20 },
      { t: 3*s, kind: 'chord', root: A, dur: s*0.9, gain: 0.20 },
      // lick: pentatonic descend
      { t: 4*s, kind: 'note',  root: B_ + 12, dur: s*0.6, gain: 0.18 },
      { t: 4.5*s, kind:'note', root: A + 12, dur: s*0.5, gain: 0.16 },
      { t: 5*s, kind: 'note',  root: G + 12, dur: s*0.5, gain: 0.16 },
      { t: 5.5*s, kind:'note', root: E + 12, dur: s*0.6, gain: 0.18 },
      // landing chord
      { t: 6*s, kind: 'chord', root: E, dur: s*2.0, gain: 0.22 }
    ];

    // kicks on beats 1 and 3 of the two-bar phrase
    [0, 2*s, 4*s, 6*s].forEach(function (off) { kick(c, t + off, dry); });

    seq.forEach(function (n) {
      if (n.kind === 'chord') playChord(c, n.root, t + n.t, n.dur, n.gain, dist);
      else playNote(c, hz(n.root), t + n.t, n.dur, n.gain, dist);
    });

    // total length ~ 8 eighths + tail
    var total = 8 * s + 0.6;
    setTimeout(function () { playing = false; }, total * 1000);
  }

  // soft note — triangle+sine, slow attack, long gentle release (no bite)
  function playSoft(c, freq, t0, dur, gain, dest) {
    var o1 = c.createOscillator();
    var o2 = c.createOscillator();
    o1.type = 'triangle';
    o2.type = 'sine';
    o1.frequency.value = freq;
    o2.frequency.value = freq * 2;       // soft octave shimmer
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.09);          // slow attack
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);         // long release
    var g2 = c.createGain();
    g2.gain.value = 0.35;                 // keep the octave subtle
    o1.connect(g);
    o2.connect(g2); g2.connect(g);
    g.connect(dest);
    o1.start(t0); o2.start(t0);
    o1.stop(t0 + dur + 0.1);
    o2.stop(t0 + dur + 0.1);
  }

  // SOOTHING riff for gold mode — a gentle major-pentatonic arpeggio
  // with a soft lowpass + shimmering delay. Calm, ambient, no drums.
  function playSoothing() {
    var now = performance.now();
    if (playing || now - lastPlay < COOLDOWN) return;
    var c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    playing = true;
    lastPlay = now;

    var t = c.currentTime + 0.03;

    // master: gentle lowpass → master gain → out
    var lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2000;
    lp.Q.value = 0.5;
    var master = c.createGain();
    master.gain.value = 0.26;
    lp.connect(master);
    master.connect(c.destination);

    // shimmer: a feedback delay tap for a soft, airy tail
    var delay = c.createDelay();
    delay.delayTime.value = 0.26;
    var fb = c.createGain();
    fb.gain.value = 0.32;
    var wet = c.createGain();
    wet.gain.value = 0.5;
    lp.connect(delay); delay.connect(fb); fb.connect(delay);
    delay.connect(wet); wet.connect(master);

    // C major pentatonic, rising then a gentle resolve.
    // C4 = 3 semitones above A3(-9) ... use offsets from A4=440.
    // C4=-9, D4=-7, E4=-5, G4=-2, A4=0, C5=3, D5=5, E5=7
    var notes = [-9, -5, -2, 0, 3, 7, 5, 0];
    var step = 0.16;
    notes.forEach(function (semi, i) {
      var dur = (i === notes.length - 1) ? 1.6 : 0.9;
      var gain = (i === notes.length - 1) ? 0.20 : 0.15;
      playSoft(c, hz(semi), t + i * step, dur, gain, lp);
    });

    var total = notes.length * step + 1.8;
    setTimeout(function () { playing = false; }, total * 1000);
  }

  // pick the hover sound by theme
  function playHover() {
    // Synth hover audio disabled — the name hover now plays the supplied
    // mask_off.mp3 (wired in index.html) instead. Visual glitch is kept.
    return;
    /* eslint-disable no-unreachable */
    if (document.documentElement.classList.contains('gold')) playSoothing();
    else playRiff();
  }

  function glitch(el) {
    if (!el) return;
    el.classList.add('is-glitching');
    setTimeout(function () { el.classList.remove('is-glitching'); }, 1100);
  }

  // wire every trigger element (nav brand + hero name) with the same fx
  triggers.forEach(function (t) {
    var el = t.el;
    el.addEventListener('mouseenter', function () {
      glitch(el);
      setTimeout(playHover, 80);
    });
    // click also fires — guarantees audio plays even if hover alone
    // hasn't satisfied the browser's user-activation requirement yet
    el.addEventListener('click', function () {
      glitch(el); playHover();
    });
    // keyboard focus for a11y
    el.addEventListener('focus', function () {
      glitch(el); setTimeout(playHover, 80);
    });
  });

  // unlock the AudioContext on the first real user interaction anywhere
  // on the page (browsers require this — hover alone is not a gesture).
  function unlockOnce() {
    var c = ensureCtx();
    if (c && c.state === 'suspended') c.resume();
    window.removeEventListener('pointerdown', unlockOnce);
    window.removeEventListener('keydown', unlockOnce);
    window.removeEventListener('touchstart', unlockOnce);
  }
  window.addEventListener('pointerdown', unlockOnce, { passive: true });
  window.addEventListener('keydown', unlockOnce);
  window.addEventListener('touchstart', unlockOnce, { passive: true });
})();

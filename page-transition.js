
/* ============================================================
   PAGE TRANSITION — animated "voiceprint" wave between pages.

   A flat gradient line blooms into woven sine strands (blue ->
   cyan -> teal -> mauve), holds for a beat, then settles back to
   a flat line — the moment the page swaps. Canvas-drawn.

   · Injected from <head> so the cover paints BEFORE the page.
   · EXIT (internal link): dark cover fades in, the wave plays its
     full bloom-and-settle (~0.9s), then navigates.
   · ENTER: the cover fades away revealing the new page.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TAU = Math.PI * 2;
  var WAVE_MS = 520;        // full bloom -> settle duration on exit
  var FADE_IN = 80;         // cover fade-in before the wave
  var FADE_OUT = 150;       // cover fade-out on enter

  /* ---- styles ---- */
  var style = document.createElement('style');
  style.textContent =
    '#pt-overlay{position:fixed;inset:0;z-index:99999;background:var(--bg,#07080b);' +
      'pointer-events:none;opacity:1;will-change:opacity}' +
    '#pt-overlay canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '#pt-overlay.pt-in{transition:opacity ' + (FADE_OUT / 1000) + 's ease-out}' +
    '#pt-overlay.pt-fadecover{transition:opacity ' + (FADE_IN / 1000) + 's ease-in}' +
    '#pt-overlay.pt-clear{opacity:0}' +
    '#pt-overlay.pt-hide{display:none}';
  (document.head || document.documentElement).appendChild(style);

  /* ---- overlay + canvas ---- */
  var ov = document.createElement('div');
  ov.id = 'pt-overlay';
  var cv = document.createElement('canvas');
  ov.appendChild(cv);
  (document.documentElement).appendChild(ov);
  var ctx = cv.getContext('2d');

  var W = 0, H = 0, grad = null, glow = 'rgba(255,91,46,0.55)';
  function isGold() { return document.documentElement.classList.contains('gold'); }
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // left -> right gradient in the active theme's accent family
    grad = ctx.createLinearGradient(0, 0, W, 0);
    if (isGold()) {
      grad.addColorStop(0.00, '#2a1d05');
      grad.addColorStop(0.16, '#9c6a12');
      grad.addColorStop(0.34, '#f2a81e');
      grad.addColorStop(0.50, '#ffc23a');
      grad.addColorStop(0.64, '#ffd45e');
      grad.addColorStop(0.80, '#ffe08a');
      grad.addColorStop(0.94, '#f2a81e');
      grad.addColorStop(1.00, '#2a1d05');
      glow = 'rgba(255,194,58,0.55)';
    } else {
      grad.addColorStop(0.00, '#2a0f06');
      grad.addColorStop(0.16, '#b8371a');
      grad.addColorStop(0.34, '#ff5b2e');
      grad.addColorStop(0.50, '#ff7a4d');
      grad.addColorStop(0.64, '#ff9a5e');
      grad.addColorStop(0.80, '#ffb472');
      grad.addColorStop(0.94, '#ff7a3a');
      grad.addColorStop(1.00, '#3a160a');
      glow = 'rgba(255,91,46,0.55)';
    }
  }
  resize();
  window.addEventListener('resize', resize);
  // rebuild the gradient live if the gold toggle flips
  new MutationObserver(resize).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // woven strands: frequency across the spindle, phase, relative amp, weight, alpha
  var STRANDS = [
    { f: 1.0, ph: 0.00, a: 1.00, w: 1.7, al: 0.95, sp: 1.7 },
    { f: 1.0, ph: 3.14, a: 0.86, w: 1.7, al: 0.85, sp: -1.5 },
    { f: 1.6, ph: 0.70, a: 0.74, w: 1.5, al: 0.80, sp: 2.1 },
    { f: 2.0, ph: 3.70, a: 0.62, w: 1.4, al: 0.72, sp: -2.0 },
    { f: 2.5, ph: 1.30, a: 0.50, w: 1.3, al: 0.62, sp: 2.6 }
  ];

  function draw(progress) {
    ctx.clearRect(0, 0, W, H);
    var cy = H * 0.5;
    var x0 = W * 0.27, x1 = W * 0.73, span = x1 - x0;
    var maxA = Math.min(H * 0.16, W * 0.075);
    // ease the whole timeline so the bloom accelerates + decelerates gently
    var te = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    // amplitude envelope over time: 0 -> 1 -> 0 (smooth)
    var env = Math.sin(Math.PI * te);
    env = env * env * (3 - 2 * env);        // smootherstep on the bell
    var motion = te * 3.0;                   // weave advances as it blooms

    // faint full-width baseline
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(180,190,210,0.16)';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(W, cy);
    ctx.stroke();

    if (env <= 0.001) return;

    ctx.strokeStyle = grad;
    ctx.shadowColor = glow;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    var STEP = 4;
    for (var s = 0; s < STRANDS.length; s++) {
      var st = STRANDS[s];
      ctx.globalAlpha = st.al * Math.min(1, env * 1.2);
      ctx.lineWidth = st.w;
      ctx.shadowBlur = 7;
      // collect points, then draw through midpoints with quadratic smoothing
      var pts = [];
      for (var x = x0; x <= x1 + 0.5; x += STEP) {
        var u = (x - x0) / span;                 // 0..1 across spindle
        var lens = Math.sin(Math.PI * u);        // 0 at ends, 1 mid -> spindle
        var y = cy - env * st.a * maxA * lens *
                Math.sin(st.f * TAU * u + st.ph + motion * st.sp * 0.5);
        pts.push(x, y);
      }
      ctx.beginPath();
      ctx.moveTo(pts[0], pts[1]);
      for (var i = 2; i < pts.length - 3; i += 2) {
        var mx = (pts[i] + pts[i + 2]) / 2;
        var my = (pts[i + 1] + pts[i + 3]) / 2;
        ctx.quadraticCurveTo(pts[i], pts[i + 1], mx, my);
      }
      ctx.lineTo(pts[pts.length - 2], pts[pts.length - 1]);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  /* ---- ENTER: fade the cover away ---- */
  var noEnter = document.documentElement.hasAttribute('data-pt-no-enter');
  var entered = false;
  function playEnter() {
    if (entered) return;
    entered = true;
    if (reduce || noEnter) { ov.classList.add('pt-clear', 'pt-hide'); return; }
    draw(0); // flat baseline behind the fade
    requestAnimationFrame(function () {
      ov.classList.add('pt-in', 'pt-clear');
      setTimeout(function () { ov.classList.add('pt-hide'); }, FADE_OUT + 20);
    });
  }
  if (noEnter) {
    ov.classList.add('pt-clear', 'pt-hide');
  } else if (document.readyState !== 'loading') {
    playEnter();
  } else {
    window.addEventListener('DOMContentLoaded', playEnter);
  }
  window.addEventListener('load', function () {
    setTimeout(function () { if (!ov.classList.contains('pt-clear')) playEnter(); }, 700);
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      entered = false; leaving = false;
      ov.classList.remove('pt-hide', 'pt-clear', 'pt-in', 'pt-fadecover');
      void ov.offsetWidth;
      playEnter();
    }
  });

  /* ---- EXIT: cover, play the wave, then navigate ---- */
  var leaving = false;
  function playExit(href) {
    if (leaving) return;
    leaving = true;
    if (reduce) { window.location.href = href; return; }
    var go = function () { window.location.href = href; };

    // bring cover up from transparent (quick fade-in over the page)
    resize();
    draw(0);
    ov.classList.remove('pt-hide', 'pt-in');
    ov.classList.add('pt-clear');
    void ov.offsetWidth;
    ov.classList.add('pt-fadecover');
    ov.classList.remove('pt-clear');   // -> opacity 1

    // run the voiceprint bloom-and-settle, navigate when it returns flat
    var start = performance.now() + FADE_IN * 0.5;
    (function tick(now) {
      var p = (now - start) / WAVE_MS;
      if (p < 0) p = 0;
      if (p >= 1) { draw(1); go(); return; }
      draw(p);
      requestAnimationFrame(tick);
    })(performance.now());

    setTimeout(go, FADE_IN + WAVE_MS + 250); // hard fallback
  }

  function isInternal(a) {
    if (!a || !a.getAttribute) return false;
    var href = a.getAttribute('href');
    if (!href) return false;
    if (a.target && a.target !== '' && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return false;
    if (a.dataset && a.dataset.noTransition !== undefined) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return false; }
    if (url.origin !== location.origin) return false;
    if (url.pathname === location.pathname && url.hash) return false;
    if (url.pathname === location.pathname && url.search === location.search) return false;
    return true;
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey ||
        e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a');
    if (!isInternal(a)) return;
    e.preventDefault();
    playExit(a.href);
  }, true);
})();

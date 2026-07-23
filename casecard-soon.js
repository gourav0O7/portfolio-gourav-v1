/* ============================================================
   Coming-soon case cards — a small glyph-particle icon (dense
   circular cluster of 0, 1, #, /, \, .) with a sparse field of the
   same characters radiating outward, drifting slowly at rest and
   brightening toward the cursor on hover. Flat — no 3D, no glow,
   no gradients. "Coming soon" lives in a small corner pill instead
   of as card-filling type. Canvas-only. Built lazily + only
   animates while visible.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GLYPHS = ['0', '1', '#', '/', '\\', '.'];

  function initCard(card) {
    var soon = card.querySelector('.casecard__soon');
    if (!soon || soon.__soonInit) return;
    soon.__soonInit = true;
    card.addEventListener('click', function (e) { e.preventDefault(); });

    var canvas = document.createElement('canvas');
    canvas.className = 'casecard__sooncanvas';
    canvas.setAttribute('aria-hidden', 'true');
    soon.insertBefore(canvas, soon.firstChild);
    soon.classList.add('has-canvas');
    var ctx = canvas.getContext('2d');

    var W = 0, H = 0, UNIT = 9, icon = [], rays = [];
    var hovered = false, raf = 0, running = false, built = false;
    var warm = 0, tWarm = 0, t = 0, fieldRot = 0;

    var accent = (getComputedStyle(card).getPropertyValue('--accent') || '#fa4c14').trim() || '#fa4c14';
    var accRGB = hexToRgb(accent);

    function build() {
      var r = soon.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      UNIT = Math.max(7, Math.min(11, Math.round(W / 46)));

      // small dense-center, soft-edge glyph blob — the "icon"
      icon = [];
      var iconR = Math.min(W, H) * 0.2;
      var cx0 = 0, cy0 = -H * 0.06;
      var cells = Math.round((iconR * 2 / UNIT) * (iconR * 2 / UNIT) * 1.05);
      for (var i = 0; i < cells; i++) {
        var ang = Math.random() * Math.PI * 2;
        var rad = iconR * Math.pow(Math.random(), 0.62);
        var gx = Math.round((cx0 + Math.cos(ang) * rad) / UNIT) * UNIT;
        var gy = Math.round((cy0 + Math.sin(ang) * rad) / UNIT) * UNIT;
        var f = rad / iconR;
        icon.push({ x: gx, y: gy, ch: rnd(), a: Math.max(0.18, 0.9 * (1 - f * 0.7)), tw: Math.random() * Math.PI * 2 });
      }

      buildRays(iconR);
      built = true;
    }

    // sparse glyph field radiating outward from the icon
    function buildRays(iconR) {
      rays = [];
      var reach = Math.hypot(W, H) * 0.6;
      var rayCount = Math.max(8, Math.round(reach / 34));
      for (var i = 0; i < rayCount; i++) {
        var angle = (i / rayCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
        var dx = Math.cos(angle), dy = Math.sin(angle);
        var steps = 4 + Math.floor(Math.random() * 5);
        var dist = iconR + 20 + Math.random() * 18;
        for (var s = 0; s < steps; s++) {
          dist += 16 + Math.random() * 18;
          if (dist > reach) break;
          var jitter = (Math.random() - 0.5) * dist * 0.16;
          var px = dx * dist - dy * jitter;
          var py = dy * dist + dx * jitter - H * 0.06;
          var f = dist / reach;
          rays.push({ x: px, y: py, ch: rnd(), a: Math.max(0.03, 0.2 * (1 - f)), tw: Math.random() * Math.PI * 2 });
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2;
      var drift = Math.sin(t * 0.018) * 2, driftY = Math.cos(t * 0.015) * 1.4;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

      // ambient field
      var rot = fieldRot, cosR = Math.cos(rot), sinR = Math.sin(rot);
      ctx.font = UNIT + 'px ui-monospace,Menlo,Consolas,monospace';
      for (var i = 0; i < rays.length; i++) {
        var p = rays[i];
        var x = p.x * cosR - p.y * sinR, y = p.x * sinR + p.y * cosR;
        var flicker = 0.75 + 0.25 * Math.sin(t * 0.03 + p.tw);
        ctx.fillStyle = 'rgba(184,186,194,' + (p.a * flicker * (1 + warm * 0.5)).toFixed(2) + ')';
        ctx.fillText(p.ch, cx + x, cy + y);
      }

      // icon cluster — brightens + warms toward accent on hover
      ctx.font = (UNIT + 1) + 'px ui-monospace,Menlo,Consolas,monospace';
      for (var j = 0; j < icon.length; j++) {
        var q = icon[j];
        var fl = 0.85 + 0.15 * Math.sin(t * 0.025 + q.tw);
        var wr = Math.round(210 + (accRGB[0] - 210) * warm);
        var wg = Math.round(212 + (accRGB[1] - 212) * warm);
        var wb = Math.round(218 + (accRGB[2] - 218) * warm);
        ctx.fillStyle = 'rgba(' + wr + ',' + wg + ',' + wb + ',' + (q.a * fl).toFixed(2) + ')';
        ctx.fillText(q.ch, cx + q.x + drift, cy + q.y + driftY);
      }
    }

    function step() {
      t++;
      tWarm = hovered ? 1 : 0;
      warm += (tWarm - warm) * 0.1;
      fieldRot += hovered ? 0.0009 : 0.0004;

      if (t % 6 === 0) {
        var n = 2 + Math.floor(Math.random() * 3);
        for (var k = 0; k < n; k++) {
          var idx = (Math.random() * rays.length) | 0;
          if (rays[idx]) rays[idx].ch = rnd();
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    function ensureRunning() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(step); } }

    card.addEventListener('pointerenter', function () { hovered = true; ensureRunning(); });
    card.addEventListener('pointerleave', function () { hovered = false; });

    function activate() {
      if (!built) build();
      if (reduce) { draw(); return; }
      ensureRunning();
    }
    var io = window.IntersectionObserver ? new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { activate(); }
        else { hovered = false; running = false; if (raf) cancelAnimationFrame(raf); }
      });
    }, { rootMargin: '160px' }) : null;
    if (io) io.observe(card); else activate();

    var ro = window.ResizeObserver ? new ResizeObserver(function () {
      built = false; build(); if (!running) draw();
    }) : null;
    if (ro) ro.observe(soon);
  }

  function rnd() { return GLYPHS[(Math.random() * GLYPHS.length) | 0]; }
  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return isNaN(n) ? [250, 76, 20] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function boot() { document.querySelectorAll('.casecard--soon').forEach(initCard); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

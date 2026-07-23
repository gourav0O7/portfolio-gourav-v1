/* ============================================================
   Coming-soon case cards — an hourglass rendered as a glyph-particle
   silhouette (0, 1, #, /, \, .), with a stream of "sand" glyphs
   actually trickling through the neck into the lower bulb — the
   icon reads as time-not-yet-up, not just decoration. A sparse
   field of the same characters radiates outward for atmosphere.
   Flat — no 3D, no glow, no gradients. "Coming soon" lives in a
   small corner pill. Canvas-only. Built lazily + only animates
   while visible.
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

    var W = 0, H = 0, UNIT = 9, icon = [], rays = [], grains = [];
    var neckTopY = 0, neckBottomY = 0, bottomInnerY = 0, neckHalf = 0, halfWidthAtTop = 0;
    var hovered = false, raf = 0, running = false, built = false;
    var warm = 0, tWarm = 0, t = 0, fieldRot = 0;

    var accent = (getComputedStyle(card).getPropertyValue('--accent') || '#fa4c14').trim() || '#fa4c14';
    var accRGB = hexToRgb(accent);

    function buildIcon() {
      var res = Math.round(Math.min(W, H) * 0.5);
      res = Math.max(120, Math.min(280, res));

      var padX = res * 0.17, capH = res * 0.05, midY = res * 0.5;
      neckHalf = res * 0.045;
      var neckSpan = res * 0.11;

      var m = document.createElement('canvas'); m.width = res; m.height = res;
      var o = m.getContext('2d');
      o.fillStyle = '#000'; o.fillRect(0, 0, res, res);
      o.fillStyle = '#fff';

      // top cap
      o.fillRect(padX, capH, res - padX * 2, capH * 0.6);
      // top bulb (wide at cap, narrows to the neck)
      o.beginPath();
      o.moveTo(padX, capH + capH * 0.6);
      o.lineTo(res - padX, capH + capH * 0.6);
      o.lineTo(res / 2 + neckHalf, midY - neckSpan / 2);
      o.lineTo(res / 2 - neckHalf, midY - neckSpan / 2);
      o.closePath(); o.fill();
      // neck
      o.fillRect(res / 2 - neckHalf, midY - neckSpan / 2, neckHalf * 2, neckSpan);
      // bottom bulb (narrow at the neck, widens to the cap)
      o.beginPath();
      o.moveTo(res / 2 - neckHalf, midY + neckSpan / 2);
      o.lineTo(res / 2 + neckHalf, midY + neckSpan / 2);
      o.lineTo(res - padX, res - capH - capH * 0.6);
      o.lineTo(padX, res - capH - capH * 0.6);
      o.closePath(); o.fill();
      // bottom cap
      o.fillRect(padX, res - capH - capH * 0.6, res - padX * 2, capH * 0.6);

      var d = o.getImageData(0, 0, res, res).data;
      icon = [];
      var step = Math.max(6, Math.round(UNIT * 0.92));
      for (var gy = step / 2; gy < res; gy += step) {
        for (var gx = step / 2; gx < res; gx += step) {
          var idx = ((gy | 0) * res + (gx | 0)) * 4;
          if (d[idx] < 110) continue;
          var lx = gx - res / 2, ly = gy - res / 2;
          var edge = Math.hypot(lx, ly) / (res * 0.5);
          icon.push({ x: lx, y: ly, ch: rnd(), a: Math.max(0.32, 0.92 - edge * 0.22), tw: Math.random() * Math.PI * 2 });
        }
      }

      neckTopY = midY - neckSpan / 2 - res / 2;
      neckBottomY = midY + neckSpan / 2 - res / 2;
      bottomInnerY = (res - capH - capH * 0.6) - res / 2;
      halfWidthAtTop = (res - padX * 2) / 2;

      buildGrains();
    }

    // sand — glyphs trickling from the neck, spreading into the lower bulb
    function buildGrains() {
      grains = [];
      var n = 12;
      for (var i = 0; i < n; i++) {
        grains.push({
          xRatio: (Math.random() * 2 - 1) * Math.pow(Math.random(), 0.6),
          y: neckTopY + Math.random() * (bottomInnerY - neckTopY),
          speed: 0.32 + Math.random() * 0.3,
          ch: rnd()
        });
      }
    }

    function stepGrains() {
      var mul = hovered ? 1.9 : 1;
      for (var i = 0; i < grains.length; i++) {
        var g = grains[i];
        g.y += g.speed * mul;
        if (g.y > bottomInnerY) {
          g.y = neckTopY - Math.random() * 10;
          g.xRatio = (Math.random() * 2 - 1) * Math.pow(Math.random(), 0.6);
          g.ch = rnd();
        }
        if (t % 4 === 0 && Math.random() < 0.3) g.ch = rnd();
      }
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

    function build() {
      var r = soon.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      UNIT = Math.max(7, Math.min(11, Math.round(W / 46)));

      buildIcon();
      buildRays(Math.min(W, H) * 0.25);
      built = true;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2 - H * 0.05;
      var drift = Math.sin(t * 0.018) * 1.6, driftY = Math.cos(t * 0.015) * 1.1;
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

      // hourglass silhouette — brightens + warms toward accent on hover
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

      // sand — always accent-tinted, brighter than the shell
      ctx.font = Math.max(6, UNIT - 1) + 'px ui-monospace,Menlo,Consolas,monospace';
      for (var k = 0; k < grains.length; k++) {
        var g = grains[k], widthHalf;
        if (g.y < neckBottomY) widthHalf = neckHalf;
        else {
          var p = Math.min(1, (g.y - neckBottomY) / (bottomInnerY - neckBottomY));
          widthHalf = neckHalf + p * (halfWidthAtTop - neckHalf) * 0.86;
        }
        var gx = g.xRatio * widthHalf;
        ctx.fillStyle = 'rgba(' + accRGB[0] + ',' + accRGB[1] + ',' + accRGB[2] + ',' + (0.55 + warm * 0.4) + ')';
        ctx.fillText(g.ch, cx + gx + drift, cy + g.y + driftY);
      }
    }

    function step() {
      t++;
      tWarm = hovered ? 1 : 0;
      warm += (tWarm - warm) * 0.1;
      fieldRot += hovered ? 0.0009 : 0.0004;
      stepGrains();

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

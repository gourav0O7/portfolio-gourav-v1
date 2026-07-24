/* ============================================================
   Coming-soon case cards — a real 3D hourglass built from glyph
   particles (0, 1, #, /, \, .), extruded in depth and tumbling on
   its own at rest (not just a hover parallax trick), with sand
   glyphs actually flowing from the top bulb through the neck into
   the bottom one. A sparse flat field of the same characters
   radiates outward for atmosphere. No gradients, no glow — color
   and depth-shading only. "Coming soon" lives in a small corner
   pill. Canvas-only. Built lazily + only animates while visible.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GLYPHS = ['0', '1', '#', '/', '\\', '.'];
  var DEPTH = 4, F = 480;

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

    var W = 0, H = 0, UNIT = 9, shell = [], rays = [], grains = [];
    var neckTopY = 0, neckBottomY = 0, topOuterY = 0, bottomInnerY = 0, neckHalf = 0, halfWidthAtTop = 0;
    var hovered = false, raf = 0, running = false, built = false;
    var warm = 0, tWarm = 0, t = 0, fieldRot = 0;
    var ax = -0.18, ay = 0, tax = -0.18, tay = 0;

    var accent = (getComputedStyle(card).getPropertyValue('--accent') || '#fa4c14').trim() || '#fa4c14';
    var accRGB = hexToRgb(accent);

    function buildIcon() {
      var res = Math.round(Math.min(W, H) * 0.46);
      res = Math.max(110, Math.min(240, res));

      var padX = res * 0.17, capH = res * 0.05, midY = res * 0.5;
      neckHalf = res * 0.045;
      var neckSpan = res * 0.11;

      var m = document.createElement('canvas'); m.width = res; m.height = res;
      var o = m.getContext('2d');
      o.fillStyle = '#000'; o.fillRect(0, 0, res, res);
      o.fillStyle = '#fff';

      o.fillRect(padX, capH, res - padX * 2, capH * 0.6);
      o.beginPath();
      o.moveTo(padX, capH + capH * 0.6);
      o.lineTo(res - padX, capH + capH * 0.6);
      o.lineTo(res / 2 + neckHalf, midY - neckSpan / 2);
      o.lineTo(res / 2 - neckHalf, midY - neckSpan / 2);
      o.closePath(); o.fill();
      o.fillRect(res / 2 - neckHalf, midY - neckSpan / 2, neckHalf * 2, neckSpan);
      o.beginPath();
      o.moveTo(res / 2 - neckHalf, midY + neckSpan / 2);
      o.lineTo(res / 2 + neckHalf, midY + neckSpan / 2);
      o.lineTo(res - padX, res - capH - capH * 0.6);
      o.lineTo(padX, res - capH - capH * 0.6);
      o.closePath(); o.fill();
      o.fillRect(padX, res - capH - capH * 0.6, res - padX * 2, capH * 0.6);

      var d = o.getImageData(0, 0, res, res).data;
      shell = [];
      var step = Math.max(6, Math.round(UNIT * 0.95));
      for (var gy = step / 2; gy < res; gy += step) {
        for (var gx = step / 2; gx < res; gx += step) {
          var idx = ((gy | 0) * res + (gx | 0)) * 4;
          if (d[idx] < 110) continue;
          var lx = gx - res / 2, ly = gy - res / 2;
          var top = { x: lx, y: ly, z: 0, layer: 0, ch: rnd(), top: true, tw: Math.random() * Math.PI * 2 };
          shell.push(top);
          for (var dz = 1; dz < DEPTH; dz++) {
            shell.push({ x: lx, y: ly, z: dz * UNIT * 0.85, layer: dz, ch: rnd(), top: false, tw: top.tw });
          }
        }
      }

      topOuterY = capH - res / 2;
      neckTopY = midY - neckSpan / 2 - res / 2;
      neckBottomY = midY + neckSpan / 2 - res / 2;
      bottomInnerY = (res - capH - capH * 0.6) - res / 2;
      halfWidthAtTop = (res - padX * 2) / 2;

      buildGrains();
    }

    // sand — flows from the top bulb, through the neck, spreading into the bottom
    function buildGrains() {
      grains = [];
      var n = 20;
      for (var i = 0; i < n; i++) {
        grains.push({
          xRatio: (Math.random() * 2 - 1) * Math.pow(Math.random(), 0.6),
          y: topOuterY + Math.random() * (bottomInnerY - topOuterY),
          speed: 0.55 + Math.random() * 0.5,
          ch: rnd()
        });
      }
    }

    function grainWidthHalf(y) {
      if (y < neckTopY) {
        var pTop = Math.max(0, (y - topOuterY) / (neckTopY - topOuterY));
        return halfWidthAtTop * (1 - pTop) + neckHalf * pTop;
      }
      if (y < neckBottomY) return neckHalf;
      var p = Math.min(1, (y - neckBottomY) / (bottomInnerY - neckBottomY));
      return neckHalf + p * (halfWidthAtTop - neckHalf) * 0.86;
    }

    function stepGrains() {
      var mul = hovered ? 2.2 : 1.15;
      for (var i = 0; i < grains.length; i++) {
        var g = grains[i];
        g.y += g.speed * mul;
        if (g.y > bottomInnerY) {
          g.y = topOuterY + Math.random() * 6;
          g.xRatio = (Math.random() * 2 - 1) * Math.pow(Math.random(), 0.6);
          g.ch = rnd();
        }
        if (Math.random() < 0.06) g.ch = rnd();
      }
    }

    // sparse flat glyph field radiating outward — atmosphere, not part of the 3D object
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
      UNIT = Math.max(7, Math.min(11, Math.round(W / 42)));

      buildIcon();
      buildRays(Math.min(W, H) * 0.25);
      built = true;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2 - H * 0.05;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

      // ambient flat field, unaffected by 3D rotation
      var rot = fieldRot, cosR = Math.cos(rot), sinR = Math.sin(rot);
      ctx.font = UNIT + 'px ui-monospace,Menlo,Consolas,monospace';
      for (var i = 0; i < rays.length; i++) {
        var p = rays[i];
        var x = p.x * cosR - p.y * sinR, y = p.x * sinR + p.y * cosR;
        var flicker = 0.75 + 0.25 * Math.sin(t * 0.03 + p.tw);
        ctx.fillStyle = 'rgba(184,186,194,' + (p.a * flicker * (1 + warm * 0.5)).toFixed(2) + ')';
        ctx.fillText(p.ch, cx + x, cy + y);
      }

      // project shell + sand together so both tumble as one rigid object
      var cosY = Math.cos(ay), sinY = Math.sin(ay), cosX = Math.cos(ax), sinX = Math.sin(ax);
      var pts = [];
      for (var j = 0; j < shell.length; j++) {
        var q = shell[j];
        var xr = q.x * cosY + q.z * sinY;
        var zr = -q.x * sinY + q.z * cosY;
        var yr = q.y * cosX - zr * sinX;
        var z2 = q.y * sinX + zr * cosX;
        var s = F / (F + z2);
        pts.push({ sx: cx + xr * s, sy: cy + yr * s, s: s, z2: z2, ch: q.ch, layer: q.layer, top: q.top, tw: q.tw, kind: 'shell' });
      }
      for (var k = 0; k < grains.length; k++) {
        var g = grains[k], wh = grainWidthHalf(g.y);
        var gx0 = g.xRatio * wh, gy0 = g.y, gz0 = 0;
        var xr2 = gx0 * cosY + gz0 * sinY;
        var zr2 = -gx0 * sinY + gz0 * cosY;
        var yr2 = gy0 * cosX - zr2 * sinX;
        var z2b = gy0 * sinX + zr2 * cosX;
        var s2 = F / (F + z2b);
        pts.push({ sx: cx + xr2 * s2, sy: cy + yr2 * s2, s: s2, z2: z2b, ch: g.ch, kind: 'grain' });
      }
      pts.sort(function (a, b) { return b.z2 - a.z2; });

      for (var m = 0; m < pts.length; m++) {
        var pt = pts[m];
        ctx.font = Math.max(5, UNIT * pt.s).toFixed(1) + 'px ui-monospace,Menlo,Consolas,monospace';
        if (pt.kind === 'grain') {
          ctx.fillStyle = 'rgba(' + accRGB[0] + ',' + accRGB[1] + ',' + accRGB[2] + ',' + (0.6 + warm * 0.35).toFixed(2) + ')';
        } else if (pt.top) {
          var fl = 0.85 + 0.15 * Math.sin(t * 0.025 + pt.tw);
          var wr = Math.round(212 + (accRGB[0] - 212) * warm);
          var wg = Math.round(214 + (accRGB[1] - 214) * warm);
          var wb = Math.round(220 + (accRGB[2] - 220) * warm);
          ctx.fillStyle = 'rgba(' + wr + ',' + wg + ',' + wb + ',' + (0.92 * fl).toFixed(2) + ')';
        } else {
          var ln = pt.layer / (DEPTH - 1);
          var a = Math.max(0.1, 0.42 - 0.3 * ln);
          ctx.fillStyle = 'rgba(' + (170 - 40 * ln | 0) + ',' + (168 - 42 * ln | 0) + ',' + (176 - 38 * ln | 0) + ',' + a.toFixed(2) + ')';
        }
        ctx.fillText(pt.ch, pt.sx, pt.sy);
      }
    }

    function step() {
      t++;
      tWarm = hovered ? 1 : 0;
      warm += (tWarm - warm) * 0.1;
      fieldRot += hovered ? 0.0009 : 0.0004;

      // idle: gentle constant tumble. hover: leans toward the cursor, spins faster.
      if (!hovered) {
        tay += 0.014;
        tax = -0.18 + Math.sin(t * 0.017) * 0.1;
      } else {
        tay += 0.03;
      }
      ay += (tay - ay) * 0.08;
      ax += (tax - ax) * 0.08;

      stepGrains();

      if (t % 5 === 0) {
        var n = 2 + Math.floor(Math.random() * 3);
        for (var k = 0; k < n; k++) {
          var idx = (Math.random() * rays.length) | 0;
          if (rays[idx]) rays[idx].ch = rnd();
        }
      }
      if (t % 7 === 0) {
        var m = (Math.random() * shell.length) | 0;
        if (shell[m] && shell[m].top) shell[m].ch = rnd();
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    function ensureRunning() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(step); } }

    card.addEventListener('pointerenter', function () { hovered = true; ensureRunning(); });
    card.addEventListener('pointermove', function (e) {
      var r = soon.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      tax = (py - 0.5) * -0.7 - 0.1;
      hovered = true; ensureRunning();
    });
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

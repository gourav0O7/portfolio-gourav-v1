/* ============================================================
   Coming-soon case cards — 3D binary "COMING SOON" wordmark over
   a sparse radiating field of glyph particles (0, 1, #, /, \, .),
   in the spirit of character-mosaic illustrations: thin streaks
   of monospace symbols fanning out from a center point, fading
   with distance, drifting slowly at rest. On hover the wordmark
   extrudes into 3D and the field brightens toward the cursor.
   Canvas-only, no CSS gradients — flat panel behind everything.
   Built lazily + only animates while visible.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var UNIT_DIV = 38, DEPTH = 5, F = 560;
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

    var W = 0, H = 0, UNIT = 9, points = [], topPoints = [], rays = [];
    var hovered = false, raf = 0, running = false, built = false;
    var depth = 0, tDepth = 0, ax = 0, tax = 0, ay = 0, tay = 0, t = 0, fieldRot = 0;

    var accent = (getComputedStyle(card).getPropertyValue('--accent') || '#fa4c14').trim() || '#fa4c14';
    var accRGB = hexToRgb(accent);

    function buildGeometry() {
      var r = soon.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      UNIT = Math.max(6, Math.min(11, Math.round(W / UNIT_DIV)));
      var cols = Math.max(20, Math.floor(W / UNIT));
      var rows = Math.max(8, Math.floor(H / UNIT));
      var S = 3;
      var m = document.createElement('canvas'); m.width = cols * S; m.height = rows * S;
      var o = m.getContext('2d');
      o.fillStyle = '#000'; o.fillRect(0, 0, m.width, m.height);
      o.fillStyle = '#fff'; o.textAlign = 'center'; o.textBaseline = 'middle';
      function setFont(px) {
        o.font = '800 ' + px + 'px "Arial Black","Helvetica Neue Bold",Impact,system-ui,sans-serif';
        try { o.letterSpacing = (px * 0.1) + 'px'; } catch (e) {}
      }
      var oneLine = (W / H) >= 2.5;
      if (oneLine) {
        var f = rows * S * 0.5; setFont(f);
        while (o.measureText('COMING SOON').width > m.width * 0.92 && f > 6) { f -= 1; setFont(f); }
        o.fillText('COMING SOON', m.width / 2, rows * S / 2);
      } else {
        var fs = rows * S * 0.38; setFont(fs);
        while (o.measureText('COMING').width > m.width * 0.9 && fs > 6) { fs -= 1; setFont(fs); }
        o.fillText('COMING', m.width / 2, rows * S * 0.33);
        o.fillText('SOON', m.width / 2, rows * S * 0.67);
      }
      var d = o.getImageData(0, 0, m.width, m.height).data;

      points = []; topPoints = [];
      for (var gy = 0; gy < rows; gy++) for (var gx = 0; gx < cols; gx++) {
        var sum = 0;
        for (var yy = 0; yy < S; yy++) for (var xx = 0; xx < S; xx++) sum += d[(((gy * S + yy) * m.width) + (gx * S + xx)) * 4];
        if (sum / (S * S) < 110) continue;
        var X = (gx - cols / 2) * UNIT, Y = (gy - rows / 2) * UNIT;
        var top = { x: X, y: Y, z: 0, layer: 0, ch: rnd(), top: true };
        points.push(top); topPoints.push(top);
        for (var dz = 1; dz < DEPTH; dz++) points.push({ x: X, y: Y, z: dz * UNIT * 0.9, layer: dz, ch: rnd(), top: false });
      }
      buildRays();
      built = true;
    }

    // Sparse glyph field radiating from the card center — thin streaks of
    // monospace symbols fanning outward, spacing widening + opacity fading
    // with distance, a couple of accent-tinted glyphs further out per ray.
    function buildRays() {
      rays = [];
      var reach = Math.hypot(W, H) * 0.62;
      var rayCount = Math.max(8, Math.round(reach / 34));
      for (var i = 0; i < rayCount; i++) {
        var angle = (i / rayCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
        var dx = Math.cos(angle), dy = Math.sin(angle);
        var steps = 5 + Math.floor(Math.random() * 6);
        var dist = 26 + Math.random() * 18;
        for (var s = 0; s < steps; s++) {
          dist += 14 + Math.random() * 16;
          if (dist > reach) break;
          var jitter = (Math.random() - 0.5) * dist * 0.16;
          var px = dx * dist - dy * jitter;
          var py = dy * dist + dx * jitter;
          var f = dist / reach;
          rays.push({
            x: px, y: py, baseAngle: angle,
            ch: rnd(), a: Math.max(0.03, 0.22 * (1 - f)),
            accent: f > 0.62 && Math.random() < 0.16,
            tw: Math.random() * Math.PI * 2
          });
        }
      }
    }

    function drawField(cx, cy, warm) {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var rot = fieldRot;
      var cosR = Math.cos(rot), sinR = Math.sin(rot);
      for (var i = 0; i < rays.length; i++) {
        var p = rays[i];
        var x = p.x * cosR - p.y * sinR, y = p.x * sinR + p.y * cosR;
        var flicker = 0.75 + 0.25 * Math.sin(t * 0.03 + p.tw);
        ctx.font = UNIT + 'px ui-monospace,Menlo,Consolas,monospace';
        if (p.accent) {
          ctx.fillStyle = 'rgba(' + accRGB[0] + ',' + accRGB[1] + ',' + accRGB[2] + ',' + (p.a * flicker * (warm ? 1.6 : 1)).toFixed(2) + ')';
        } else {
          ctx.fillStyle = 'rgba(184,186,194,' + (p.a * flicker * (warm ? 1.3 : 1)).toFixed(2) + ')';
        }
        ctx.fillText(p.ch, cx + x, cy + y);
      }
    }

    function drawFlat() {
      // cheap rest state: bright front face + drifting glyph field
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2;
      var dx = Math.sin(t * 0.02) * 2, dy = Math.cos(t * 0.017) * 1.4;
      drawField(cx, cy, false);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = (UNIT - 1) + 'px ui-monospace,Menlo,Consolas,monospace';
      ctx.fillStyle = 'rgba(238,240,246,0.9)';
      for (var i = 0; i < topPoints.length; i++) {
        var p = topPoints[i];
        ctx.fillText(p.ch, cx + p.x + dx, cy + p.y + dy);
      }
    }

    function draw3D() {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2;
      drawField(cx, cy, true);
      var cosY = Math.cos(ay), sinY = Math.sin(ay), cosX = Math.cos(ax), sinX = Math.sin(ax);
      var zf = depth; // extrusion amount 0..1

      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = (UNIT - 1) + 'px ui-monospace,Menlo,monospace';

      for (var i = 0; i < points.length; i++) {
        var p = points[i], z = p.z * zf;
        var x1 = p.x * cosY + z * sinY;
        var z1 = -p.x * sinY + z * cosY;
        var y1 = p.y * cosX - z1 * sinX;
        var z2 = p.y * sinX + z1 * cosX;
        p._s = F / (F + z2); p._x = cx + x1 * p._s; p._y = cy + y1 * p._s; p._z = z2;
      }
      points.sort(byZ);

      for (var j = 0; j < points.length; j++) {
        var q = points[j], ln = q.layer / (DEPTH - 1);
        ctx.font = Math.max(5, (UNIT - 1) * q._s).toFixed(1) + 'px ui-monospace,Menlo,monospace';
        if (q.top) {
          if (((t + (j % 71)) % (hovered ? 22 : 80)) === 0) q.ch = rnd();
          // front face warms toward the accent as it extrudes on hover
          var wr = Math.round(242 + (accRGB[0] - 242) * 0.5 * zf);
          var wg = Math.round(243 + (accRGB[1] - 243) * 0.5 * zf);
          var wb = Math.round(247 + (accRGB[2] - 247) * 0.5 * zf);
          ctx.fillStyle = 'rgba(' + wr + ',' + wg + ',' + wb + ',0.98)';
        } else {
          var a = Math.max(0.12, (0.5 - 0.4 * ln) * zf);
          ctx.fillStyle = 'rgba(' + (172 - 44 * ln | 0) + ',' + (170 - 48 * ln | 0) + ',' + (174 - 44 * ln | 0) + ',' + a.toFixed(2) + ')';
        }
        ctx.fillText(q.ch, q._x, q._y);
      }
    }

    function step() {
      t++;
      tDepth = hovered ? 1 : 0;
      depth += (tDepth - depth) * 0.12;
      if (!hovered) { tax = Math.sin(t * 0.02) * 0.05; tay = Math.sin(t * 0.016) * 0.06; }
      ax += (tax - ax) * 0.1; ay += (tay - ay) * 0.1;
      fieldRot += hovered ? 0.0009 : 0.0004;

      // slow ambient twinkle across the glyph field
      if (t % 5 === 0) {
        var n = 3 + Math.floor(Math.random() * 4);
        for (var k = 0; k < n; k++) {
          var idx = (Math.random() * rays.length) | 0;
          if (rays[idx]) rays[idx].ch = rnd();
        }
      }

      if (depth < 0.06 && !hovered) drawFlat();
      else draw3D();

      var settled = !hovered && depth < 0.04;
      raf = requestAnimationFrame(step);
      running = true;
      if (settled && t % 3 !== 0) { /* still redraw for field drift, just skip extra work */ }
    }

    function ensureRunning() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(step); } }

    // pointer: drive both the 3D tilt and cursor-follow warmth
    function setSpotlight(px, py) {
      soon.style.setProperty('--px', px.toFixed(3));
      soon.style.setProperty('--py', py.toFixed(3));
    }
    card.addEventListener('pointerenter', function () { hovered = true; ensureRunning(); });
    card.addEventListener('pointermove', function (e) {
      var r = soon.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      setSpotlight(px, py);
      tay = (px - 0.5) * 0.9;    // yaw follows cursor X
      tax = (py - 0.5) * -0.5;   // pitch follows cursor Y
      hovered = true; ensureRunning();
    });
    card.addEventListener('pointerleave', function () { hovered = false; setSpotlight(0.5, 0.42); });

    // build + first paint, then keep a light ambient loop running while visible
    function activate() {
      if (!built) buildGeometry();
      if (reduce) { drawFlat(); return; }
      ensureRunning();
    }
    var io = window.IntersectionObserver ? new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { activate(); }
        else { hovered = false; running = false; if (raf) cancelAnimationFrame(raf); }
      });
    }, { rootMargin: '160px' }) : null;
    if (io) io.observe(card); else activate();

    // keep letters + field sized right on resize
    var ro = window.ResizeObserver ? new ResizeObserver(function () {
      built = false; buildGeometry(); if (!running) drawFlat();
    }) : null;
    if (ro) ro.observe(soon);
  }

  function byZ(a, b) { return b._z - a._z; }
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

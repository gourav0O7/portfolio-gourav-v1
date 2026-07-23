/* ============================================================
   Coming-soon case cards — 3D binary "COMING SOON" wordmark.
   The words are built from 0s and 1s: a bright readable front
   face over dim, receding extrusion layers. At rest it sits
   near-flat and calm (the card's own accent sheen carries the
   ambient motion). On HOVER it extrudes into 3D, rotates toward
   the cursor, warms to the accent and shimmers — then eases back
   on leave. Canvas is transparent so the card's cursor-spotlight
   shows through. Built lazily + only animates while visible.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var UNIT_DIV = 38, DEPTH = 5, F = 560;

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

    var W = 0, H = 0, UNIT = 9, points = [], topPoints = [], bg = [];
    var hovered = false, raf = 0, running = false, built = false;
    var depth = 0, tDepth = 0, ax = 0, tax = 0, ay = 0, tay = 0, t = 0;

    var accent = (getComputedStyle(card).getPropertyValue('--accent') || '#ff5b2e').trim() || '#ff5b2e';
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
      bg = [];
      var n = Math.round(cols * rows * 0.04);
      for (var i = 0; i < n; i++) bg.push({ x: (Math.random() - 0.5) * W, y: (Math.random() - 0.5) * H, ch: rnd(), a: 0.05 + Math.random() * 0.06 });
      built = true;
    }

    function drawFlat() {
      // cheap rest state: bright front face only, near-flat, faint drift
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2;
      var dx = Math.sin(t * 0.02) * 2, dy = Math.cos(t * 0.017) * 1.4;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = (UNIT - 1) + 'px ui-monospace,Menlo,Consolas,monospace';
      for (var b = 0; b < bg.length; b++) { ctx.fillStyle = 'rgba(150,152,160,' + bg[b].a + ')'; ctx.fillText(bg[b].ch, cx + bg[b].x, cy + bg[b].y); }
      ctx.fillStyle = 'rgba(238,240,246,0.9)';
      for (var i = 0; i < topPoints.length; i++) {
        var p = topPoints[i];
        ctx.fillText(p.ch, cx + p.x + dx, cy + p.y + dy);
      }
    }

    function draw3D() {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2;
      var cosY = Math.cos(ay), sinY = Math.sin(ay), cosX = Math.cos(ax), sinX = Math.sin(ax);
      var zf = depth; // extrusion amount 0..1

      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = (UNIT - 1) + 'px ui-monospace,Menlo,monospace';
      for (var b = 0; b < bg.length; b++) { ctx.fillStyle = 'rgba(150,152,160,' + (bg[b].a * (1 - 0.4 * zf)) + ')'; ctx.fillText(bg[b].ch, cx + bg[b].x, cy + bg[b].y); }

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

      if (depth < 0.06 && !hovered) drawFlat();
      else draw3D();

      var settled = !hovered && depth < 0.04;
      if (settled) { running = false; drawFlat(); return; }
      raf = requestAnimationFrame(step);
    }

    function ensureRunning() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(step); } }

    // pointer: drive BOTH the css accent spotlight (--mx/--my) and the 3D tilt
    function setSpotlight(px, py) {
      soon.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      soon.style.setProperty('--my', (py * 100).toFixed(1) + '%');
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
    card.addEventListener('pointerleave', function () { hovered = false; setSpotlight(0.5, 0.42); ensureRunning(); });

    // build + first paint only when the card is near the viewport
    function activate() {
      if (!built) buildGeometry();
      if (reduce) { drawFlat(); }
      else { drawFlat(); }
    }
    var io = window.IntersectionObserver ? new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { activate(); }
        else { hovered = false; }
      });
    }, { rootMargin: '160px' }) : null;
    if (io) io.observe(card); else activate();

    // keep letters sized right on resize
    var ro = window.ResizeObserver ? new ResizeObserver(function () {
      built = false; buildGeometry(); if (!running) drawFlat();
    }) : null;
    if (ro) ro.observe(soon);
  }

  function byZ(a, b) { return b._z - a._z; }
  function rnd() { return Math.random() < 0.5 ? '0' : '1'; }
  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return isNaN(n) ? [255, 91, 46] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function boot() { document.querySelectorAll('.casecard--soon').forEach(initCard); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

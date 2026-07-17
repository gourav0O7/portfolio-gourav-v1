
/* Coming-soon case cards: "COMING SOON" rendered as a glyph-particle field.
   Glyphs sit faint like texture; near the cursor they scatter/distort and
   light up in the theme accent. Clicks are blocked. Reduced-motion → static. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GLYPHS = ['#', '%', 'C', 'S', '*', '>', '<', '+', '/', '.', ':', 'x', '=', '·'];

  function initCard(card) {
    var soon = card.querySelector('.casecard__soon');
    if (!soon || soon.__soonInit) return;
    soon.__soonInit = true;
    card.addEventListener('click', function (e) { e.preventDefault(); });

    var canvas = document.createElement('canvas');
    canvas.className = 'casecard__sooncanvas';
    canvas.setAttribute('aria-hidden', 'true');
    soon.insertBefore(canvas, soon.querySelector('b'));
    soon.classList.add('has-canvas');

    var ctx = canvas.getContext('2d');
    var accent = (getComputedStyle(card).getPropertyValue('--accent') || '').trim() || '#e8833a';
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var W = 0, H = 0, parts = [], stepPx = 8, raf = 0, running = false;
    var mouse = { x: -9999, y: -9999, active: false };

    function build() {
      var r = soon.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var off = document.createElement('canvas'); off.width = W; off.height = H;
      var o = off.getContext('2d');
      var fs = Math.min(W * 0.34, H * 0.46);
      o.fillStyle = '#000'; o.textAlign = 'center'; o.textBaseline = 'middle';
      o.font = '800 ' + fs + 'px "Space Grotesk", system-ui, sans-serif';
      var cx = W / 2, cy = H / 2;
      o.fillText('COMING', cx, cy - fs * 0.56);
      o.fillText('SOON', cx, cy + fs * 0.56);
      var data = o.getImageData(0, 0, W, H).data;

      stepPx = Math.max(7, Math.round(fs * 0.135));
      parts = [];
      for (var y = 0; y < H; y += stepPx) {
        for (var x = 0; x < W; x += stepPx) {
          if (data[(y * W + x) * 4 + 3] > 80) {
            parts.push({ ox: x, oy: y, cxo: 0, cyo: 0, g: GLYPHS[(Math.random() * GLYPHS.length) | 0], ph: Math.random() * 6.28 });
          }
        }
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      ctx.font = (stepPx * 1.18) + 'px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var R = Math.max(80, W * 0.16), S = 30;
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i], tx = 0, ty = 0, bright = 0;
        if (mouse.active) {
          var dx = p.ox - mouse.x, dy = p.oy - mouse.y, d = Math.hypot(dx, dy);
          if (d < R) {
            var f = 1 - d / R, ang = Math.atan2(dy, dx);
            tx = Math.cos(ang) * f * S + Math.sin(t / 260 + p.ph) * f * 7;
            ty = Math.sin(ang) * f * S + Math.cos(t / 260 + p.ph) * f * 7;
            bright = f;
          }
        }
        p.cxo += (tx - p.cxo) * 0.15; p.cyo += (ty - p.cyo) * 0.15;
        var drift = reduce ? 0 : Math.sin(t / 850 + p.ph) * 1.1;
        var alpha = 0.2 + bright * 0.78;
        if (bright > 0.32) { ctx.fillStyle = accent; ctx.globalAlpha = Math.min(1, alpha + 0.1); }
        else { ctx.fillStyle = '#ffffff'; ctx.globalAlpha = alpha; }
        ctx.fillText(p.g, p.ox + p.cxo, p.oy + p.cyo + drift);
      }
      ctx.globalAlpha = 1;
    }

    function loop(t) { if (!running) return; draw(t || 0); raf = requestAnimationFrame(loop); }
    function start() { if (running || reduce) return; running = true; raf = requestAnimationFrame(loop); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); }

    card.addEventListener('pointermove', function (e) {
      var r = soon.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
      if (reduce) draw(performance.now());
    });
    card.addEventListener('pointerleave', function () { mouse.active = false; mouse.x = mouse.y = -9999; });

    var ro = window.ResizeObserver ? new ResizeObserver(function () { build(); if (reduce || !running) draw(performance.now()); }) : null;
    if (ro) ro.observe(soon);

    var io = window.IntersectionObserver ? new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) start(); else stop(); });
    }, { rootMargin: '120px' }) : null;

    build();
    draw(performance.now());
    if (io) io.observe(card); else start();
  }

  function boot() { document.querySelectorAll('.casecard--soon').forEach(initCard); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

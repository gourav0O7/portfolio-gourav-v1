
/* ============================================================
   GOLD CURSOR — butterfly that follows the pointer and leaves a
   shimmering golden trail. Active only in the gold theme on
   hover-capable devices; the normal reticle cursor returns in amber.
   ============================================================ */
(function () {
  'use strict';

  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var root = document.documentElement;
  var bfly, rot;
  var tx = -200, ty = -200, x = -200, y = -200;
  var lastTrailX = -200, lastTrailY = -200, lastTrail = 0;
  var angle = 0, seen = false;

  function isGold() { return root.classList.contains('gold'); }

  function spawnTrail(px, py) {
    var t = document.createElement('div');
    t.className = 'gold-trail';
    var jitter = (Math.random() - 0.5) * 14;
    t.style.transform = 'translate3d(' + (px + jitter) + 'px,' + (py + jitter) + 'px,0) translate(-50%,-50%)';
    document.body.appendChild(t);
    // next frame: fade + drift upward and shrink
    requestAnimationFrame(function () {
      t.style.opacity = '0';
      t.style.transform = 'translate3d(' + (px + jitter) + 'px,' + (py - 16 + jitter) + 'px,0) translate(-50%,-50%) scale(0.3)';
    });
    setTimeout(function () { t.remove(); }, 720);
  }

  function build() {
    bfly = document.createElement('div');
    bfly.className = 'gold-bfly';
    bfly.setAttribute('aria-hidden', 'true');
    bfly.innerHTML =
      '<div class="gold-bfly__rot">' +
        '<span class="w w--ul"></span><span class="w w--ll"></span>' +
        '<span class="w w--ur"></span><span class="w w--lr"></span>' +
        '<span class="gold-bfly__body"></span>' +
      '</div>';
    rot = bfly.querySelector('.gold-bfly__rot');
    document.body.appendChild(bfly);

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!seen) { x = tx; y = ty; lastTrailX = tx; lastTrailY = ty; seen = true; }
    }, { passive: true });

    requestAnimationFrame(loop);
  }

  function loop() {
    var on = isGold() && seen;
    if (bfly.classList.contains('is-on') !== on) bfly.classList.toggle('is-on', on);

    if (on) {
      // ease toward the pointer (gentle, fluttery lag)
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;

      var dx = tx - x, dy = ty - y;
      var dist = Math.hypot(dx, dy);
      if (dist > 1.5) {
        // butterfly faces "up" by default → +90° aligns its head with travel
        var target = Math.atan2(dy, dx) * 180 / Math.PI + 90;
        var diff = ((target - angle + 540) % 360) - 180;
        angle += diff * 0.18;
      }

      bfly.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%)';
      rot.style.transform = 'rotate(' + angle + 'deg)';

      var now = performance.now();
      var moved = Math.hypot(x - lastTrailX, y - lastTrailY);
      if (now - lastTrail > 16 && moved > 2) {
        // dense trail — drop a cluster of particles each emit
        for (var i = 0; i < 10; i++) spawnTrail(x, y);
        lastTrail = now;
        lastTrailX = x; lastTrailY = y;
      }
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

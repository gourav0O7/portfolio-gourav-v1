/* ============================================================
   CAP CONSOLE — cursor-following spotlight over the disciplines
   grid. Sets --mx/--my (in %) on the [data-spotlight] element so
   the CSS radial wash tracks the pointer; toggles [data-lit] while
   the cursor is inside. Pointer-fine devices only — no-ops on touch.
   ============================================================ */
(function () {
  'use strict';
  var disc = document.querySelector('[data-spotlight]');
  if (!disc) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var raf = null, px = 50, py = 50;
  function apply() {
    raf = null;
    disc.style.setProperty('--mx', px + '%');
    disc.style.setProperty('--my', py + '%');
  }
  disc.addEventListener('pointermove', function (e) {
    var r = disc.getBoundingClientRect();
    px = ((e.clientX - r.left) / r.width) * 100;
    py = ((e.clientY - r.top) / r.height) * 100;
    if (!raf) raf = requestAnimationFrame(apply);
  });
  disc.addEventListener('pointerenter', function () { disc.setAttribute('data-lit', ''); });
  disc.addEventListener('pointerleave', function () { disc.removeAttribute('data-lit'); });
})();

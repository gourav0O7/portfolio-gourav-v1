
/* ============================================================
   STACK CARDS — scroll-driven scale & lift
   As each subsequent card stacks on top, the cards below
   recede (scale down + small Y shift) so the pile reads as
   3D depth instead of a flat list.
   ============================================================ */
(function () {
  'use strict';

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function init() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.stackcards .stackcard'));
    if (!cards.length) return;

    // Skip the effect when the cards are NOT sticky (mobile <720px)
    function sticky() { return matchMedia('(min-width: 721px)').matches; }

    // Distance each card recedes per overlap (multiplied by depth index)
    var SCALE_STEP = 0.025;   // 2.5% per layer behind
    var Y_STEP     = 6;       // px per layer behind
    var BLUR_STEP  = 3.2;     // px of blur per layer of overlap
    var BLUR_MAX   = 7;       // never blur past this
    var DIM_STEP   = 0.09;    // brightness lost per layer behind
    var DIM_FLOOR  = 0.6;     // never dim past this
    var MAX_DEPTH  = 5;
    var raf = null;

    // cache the inner panel of each card (blur goes here, so the chassis
    // frame + case badge stay razor-sharp like a frosted screen behind glass)
    var inners = cards.map(function (c) {
      var el = c.querySelector('.stackcard__inner');
      if (el) el.style.willChange = 'filter';
      return el;
    });

    function update() {
      raf = null;
      if (!sticky()) {
        cards.forEach(function (c) { c.style.transform = ''; });
        inners.forEach(function (el) { if (el) el.style.filter = ''; });
        return;
      }
      // Each card's sticky top in CSS = nav-h + 24 + i*20
      // We measure how much the NEXT card has approached "this" card's top.
      // Progress = how far the next card's top has moved from "below this card" toward "above this card".
      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        var rect = card.getBoundingClientRect();
        // accumulate depth from later cards that have begun stacking
        var depth = 0;
        for (var j = i + 1; j < cards.length && j <= i + MAX_DEPTH; j++) {
          var nextRect = cards[j].getBoundingClientRect();
          // raw progress: 1 when next card has reached this card's top, 0 when still below
          var span = rect.height; // distance over which the transition plays
          var raw = (rect.bottom - nextRect.top) / span;
          var p = Math.max(0, Math.min(1, raw));
          depth += p;
        }
        var scale = 1 - depth * SCALE_STEP;
        var y = -depth * Y_STEP;
        // clamp
        if (scale < 0.86) scale = 0.86;
        card.style.transform = 'translate3d(0,' + y.toFixed(2) + 'px,0) scale(' + scale.toFixed(4) + ')';

        // blur + dim the covered card, scaled by how overlapped it is
        var inner = inners[i];
        if (inner) {
          if (depth < 0.01) {
            inner.style.filter = '';   // top card stays perfectly crisp
          } else {
            var blur = Math.min(depth * BLUR_STEP, BLUR_MAX);
            var bright = Math.max(1 - depth * DIM_STEP, DIM_FLOOR);
            inner.style.filter = 'blur(' + blur.toFixed(2) + 'px) brightness(' + bright.toFixed(3) + ')';
          }
        }
      }
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();


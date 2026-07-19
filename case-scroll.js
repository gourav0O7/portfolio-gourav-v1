
/* ============================================================
   WORK GALLERY — pinned horizontal scroll, with graceful
   fallback to a native horizontal-scroll / drag gallery.

   Pinned mode (desktop, fine pointer, motion allowed):
     • the stage pins under the nav after the heading crosses it
     • vertical scroll through the tall rail translates the cards
     • drag converts to page scroll so it stays in sync
   Fallback mode (touch / small / reduced-motion):
     • the track scrolls horizontally natively
     • drag-to-scroll + vertical-wheel-to-horizontal
   ============================================================ */
(function () {
  'use strict';
  var sec   = document.getElementById('work');
  var root  = document.getElementById('caseScroll');
  if (!sec || !root) return;
  if (root.classList.contains('casestack')) return; // horizontal stack layout owns this section
  var rail  = sec.querySelector('[data-rail]');
  var stage = sec.querySelector('[data-stage]');
  var track = root.querySelector('[data-track]');
  var prog  = root.querySelector('[data-prog]');
  if (!track) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canPin  = window.matchMedia('(min-width: 880px) and (hover: hover) and (pointer: fine)').matches && !reduced;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function setProg(p) {
    if (!prog) return;
    var rail2 = prog.parentNode.clientWidth - prog.clientWidth;
    prog.style.transform = 'translateX(' + (p * rail2) + 'px)';
  }

  /* ======================= PINNED MODE ======================= */
  function initPinned() {
    sec.classList.add('is-pinned');
    var overflow = 0, total = 0;

    function measure() {
      // distance the cards must travel horizontally
      overflow = Math.max(0, track.scrollWidth - track.clientWidth);
      // rail is tall enough to scroll that distance vertically (1:1, a touch eased)
      total = overflow;
      rail.style.height = (stage.offsetHeight + total) + 'px';
    }

    function onScroll() {
      var top = rail.getBoundingClientRect().top;           // navH at pin start, decreasing
      var navH = stage.offsetTop ? 0 : 0;                   // sticky top handled by CSS
      var start = parseFloat(getComputedStyle(stage).top) || 0;
      var p = total > 0 ? clamp((start - top) / total, 0, 1) : 0;
      track.style.transform = 'translate3d(' + (-p * overflow) + 'px,0,0)';
      setProg(p);
    }

    var ro = ('ResizeObserver' in window) ? new ResizeObserver(function () { measure(); onScroll(); }) : null;
    if (ro) { ro.observe(track); }
    window.addEventListener('resize', function () { measure(); onScroll(); });
    window.addEventListener('scroll', onScroll, { passive: true });
    // re-measure once art/fonts settle
    measure(); onScroll();
    setTimeout(function () { measure(); onScroll(); }, 400);
    window.addEventListener('load', function () { measure(); onScroll(); });

    /* drag → page scroll (keeps the pin in sync) */
    // NOTE: capture the pointer only AFTER a real drag begins — capturing on
    // pointerdown retargets the click to the track and swallows card navigation.
    var down = false, lastX = 0, moved = 0, captured = false, pid = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      down = true; moved = 0; lastX = e.clientX; captured = false; pid = e.pointerId;
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - lastX; lastX = e.clientX;
      moved += Math.abs(dx);
      if (moved > 4) {
        track.classList.add('is-dragging');
        if (!captured) { try { track.setPointerCapture(pid); } catch (err) {} captured = true; }
      }
      window.scrollBy(0, -dx);   // drag left → scroll down → cards move left
    });
    function up(e) {
      if (!down) return;
      down = false;
      if (captured) { try { track.releasePointerCapture(e.pointerId); } catch (err) {} captured = false; }
      setTimeout(function () { track.classList.remove('is-dragging'); }, 0);
    }
    track.addEventListener('pointerup', up);
    track.addEventListener('pointercancel', up);
    track.addEventListener('click', function (e) { if (moved > 6) e.preventDefault(); }, true);
  }

  /* ====================== FALLBACK MODE ====================== */
  function initNative() {
    function updateProg() {
      var max = track.scrollWidth - track.clientWidth;
      setProg(max > 0 ? track.scrollLeft / max : 0);
    }
    track.addEventListener('scroll', updateProg, { passive: true });
    window.addEventListener('resize', updateProg);
    updateProg();

    track.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      var max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      var atStart = track.scrollLeft <= 0, atEnd = track.scrollLeft >= max - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    }, { passive: false });

    var down = false, startX = 0, startLeft = 0, moved = 0, captured = false, pid = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      down = true; moved = 0; startX = e.clientX; startLeft = track.scrollLeft; captured = false; pid = e.pointerId;
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) {
        track.classList.add('is-dragging'); moved = Math.abs(dx);
        if (!captured) { try { track.setPointerCapture(pid); } catch (err) {} captured = true; }
      }
      track.scrollLeft = startLeft - dx;
    });
    function up(e) {
      if (!down) return;
      down = false;
      if (captured) { try { track.releasePointerCapture(e.pointerId); } catch (err) {} captured = false; }
      setTimeout(function () { track.classList.remove('is-dragging'); }, 0);
    }
    track.addEventListener('pointerup', up);
    track.addEventListener('pointercancel', up);
    track.addEventListener('click', function (e) { if (moved > 6) e.preventDefault(); }, true);
  }

  if (canPin) initPinned(); else initNative();
})();

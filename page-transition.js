/* ============================================================
   PAGE TRANSITION — masked text reveal (matches gustaffurusten.se).
   No full-screen curtain. Headings/eyebrows slide within a clipped
   box, staggered line by line: EXIT slides each up and out
   (translateY 0 -> -150%), ENTER slides each up into place
   (translateY 150% -> 0). The rest of the page does a quick plain
   fade alongside it.

   IMPORTANT: this must never touch a heading's OWN transform/class —
   several headings are also driven by the site's existing scroll-
   reveal system (rise.js: .reveal/.rise/.is-rise-in), which sets its
   own inline transform on the same element. Animating the heading
   directly fights that system and can leave it permanently stuck
   off-screen. So instead: each heading gets overflow:hidden (a
   property rise.js doesn't touch) and its text is moved once into a
   dedicated inner wrapper span that WE own exclusively — only that
   wrapper's transform is ever touched.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STAGGER_MS = 45;
  var LINE_MS = 620;
  var EXTRA_FADE_MS = 260;   // rest-of-page fade, layered under the line reveal

  var HEADING_SEL = 'h1, h2, .eyebrow, .hero__readout';

  var style = document.createElement('style');
  style.textContent =
    '.pt-mask{overflow:hidden!important}' +
    '.pt-wrap{display:inline-block;will-change:transform}' +
    'html.pt-fading body{opacity:0}' +
    'body{transition:opacity ' + (EXTRA_FADE_MS / 1000) + 's ease}';
  (document.head || document.documentElement).appendChild(style);

  function headings() {
    return Array.prototype.slice.call(document.querySelectorAll(HEADING_SEL))
      .filter(function (el) { return el.offsetParent !== null; });
  }

  // wrap each heading's existing children ONCE in a span we own; reuse it
  // on repeat calls instead of re-wrapping
  function getWraps(els) {
    var out = [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var wrap = el.__ptWrap;
      if (!wrap) {
        wrap = document.createElement('span');
        wrap.className = 'pt-wrap';
        while (el.firstChild) wrap.appendChild(el.firstChild);
        el.appendChild(wrap);
        el.__ptWrap = wrap;
      }
      el.classList.add('pt-mask');
      out.push(wrap);
    }
    return out;
  }

  /* ---- ENTER: wrapped text starts pushed down inside its clipped box, eases up ---- */
  var noEnter = document.documentElement.hasAttribute('data-pt-no-enter');
  function playEnter() {
    if (reduce || noEnter) return;
    var wraps = getWraps(headings());
    if (!wraps.length) return;
    wraps.forEach(function (w) {
      w.style.transition = 'none';
      w.style.transform = 'translateY(150%)';
    });
    void document.body.offsetWidth;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wraps.forEach(function (w, i) {
          w.style.transition = 'transform ' + (LINE_MS / 1000) + 's cubic-bezier(.16,1,.3,1) ' + (i * STAGGER_MS / 1000) + 's';
          w.style.transform = 'translateY(0)';
        });
      });
    });
  }
  if (document.readyState !== 'loading') playEnter();
  else window.addEventListener('DOMContentLoaded', playEnter);
  window.addEventListener('pageshow', function (e) { if (e.persisted) playEnter(); });

  /* ---- EXIT: wrapped text slides up and out, rest of page fades, then navigate ---- */
  var leaving = false;
  function playExit(href) {
    if (leaving) return;
    leaving = true;
    if (reduce) { window.location.href = href; return; }

    var wraps = getWraps(headings());
    wraps.forEach(function (w, i) {
      w.style.transition = 'transform ' + (LINE_MS / 1000) + 's cubic-bezier(.4,0,.2,1) ' + (i * STAGGER_MS / 1000) + 's';
      requestAnimationFrame(function () { w.style.transform = 'translateY(-150%)'; });
    });
    requestAnimationFrame(function () {
      document.documentElement.classList.add('pt-fading');
    });

    var total = Math.max(EXTRA_FADE_MS, wraps.length * STAGGER_MS + LINE_MS * 0.55);
    setTimeout(function () { window.location.href = href; }, total);
  }

  function isInternal(a) {
    if (!a || !a.getAttribute) return false;
    var href = a.getAttribute('href');
    if (!href) return false;
    if (a.target && a.target !== '' && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return false;
    if (a.dataset && a.dataset.noTransition !== undefined) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return false; }
    if (url.origin !== location.origin) return false;
    if (url.pathname === location.pathname && url.hash) return false;
    if (url.pathname === location.pathname && url.search === location.search) return false;
    return true;
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey ||
        e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a');
    if (!isInternal(a)) return;
    e.preventDefault();
    playExit(a.href);
  }, true);
})();

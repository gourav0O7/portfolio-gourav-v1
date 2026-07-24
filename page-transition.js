/* ============================================================
   PAGE TRANSITION — masked text reveal (matches gustaffurusten.se).
   No full-screen curtain. Headings/eyebrows slide within their own
   clipped box, staggered line by line: EXIT slides each up and out
   (translateY 0 -> -150%), ENTER slides each up into place
   (translateY 150% -> 0). The rest of the page does a quick plain
   fade alongside it. No new DOM — overflow is toggled on each
   heading's own parent and the transform lives on the heading
   itself, so nothing else needs restructuring.
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
    '.pt-line{display:inline-block;will-change:transform}' +
    'html.pt-fading body{opacity:0}' +
    'body{transition:opacity ' + (EXTRA_FADE_MS / 1000) + 's ease}';
  (document.head || document.documentElement).appendChild(style);

  function headings() {
    return Array.prototype.slice.call(document.querySelectorAll(HEADING_SEL))
      .filter(function (el) { return el.offsetParent !== null; });
  }

  function maskEls(els) {
    var out = [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var parent = el.parentElement;
      if (parent) parent.classList.add('pt-mask');
      el.classList.add('pt-line');
      out.push({ el: el, parent: parent });
    }
    return out;
  }

  /* ---- ENTER: lines start pushed down inside their clipped box, ease up ---- */
  var noEnter = document.documentElement.hasAttribute('data-pt-no-enter');
  function playEnter() {
    if (reduce || noEnter) return;
    var lines = maskEls(headings());
    if (!lines.length) return;
    lines.forEach(function (l) {
      l.el.style.transition = 'none';
      l.el.style.transform = 'translateY(150%)';
    });
    void document.body.offsetWidth;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        lines.forEach(function (l, i) {
          l.el.style.transition = 'transform ' + (LINE_MS / 1000) + 's cubic-bezier(.16,1,.3,1) ' + (i * STAGGER_MS / 1000) + 's';
          l.el.style.transform = 'translateY(0)';
        });
        var maxDelay = lines.length * STAGGER_MS + LINE_MS;
        setTimeout(function () {
          lines.forEach(function (l) {
            l.el.style.transition = ''; l.el.style.transform = '';
            l.el.classList.remove('pt-line');
            if (l.parent) l.parent.classList.remove('pt-mask');
          });
        }, maxDelay + 60);
      });
    });
  }
  if (document.readyState !== 'loading') playEnter();
  else window.addEventListener('DOMContentLoaded', playEnter);
  window.addEventListener('pageshow', function (e) { if (e.persisted) playEnter(); });

  /* ---- EXIT: lines slide up and out, rest of page fades, then navigate ---- */
  var leaving = false;
  function playExit(href) {
    if (leaving) return;
    leaving = true;
    if (reduce) { window.location.href = href; return; }

    var lines = maskEls(headings());
    lines.forEach(function (l, i) {
      l.el.style.transition = 'transform ' + (LINE_MS / 1000) + 's cubic-bezier(.4,0,.2,1) ' + (i * STAGGER_MS / 1000) + 's';
      requestAnimationFrame(function () { l.el.style.transform = 'translateY(-150%)'; });
    });
    requestAnimationFrame(function () {
      document.documentElement.classList.add('pt-fading');
    });

    var total = Math.max(EXTRA_FADE_MS, lines.length * STAGGER_MS + LINE_MS * 0.55);
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

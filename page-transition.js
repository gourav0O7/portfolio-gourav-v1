/* ============================================================
   PAGE TRANSITION — simple fade + slide curtain, Framer-style.
   Replaces the old canvas "voiceprint wave" overlay with a plain,
   fast fade: EXIT covers the page with a flat bg fade-in, then
   navigates; ENTER fades the cover away while the incoming content
   eases up 14px -> 0. No canvas, no per-frame drawing.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var EXIT_MS = 320;
  var ENTER_MS = 420;

  var style = document.createElement('style');
  style.textContent =
    '#pt-overlay{position:fixed;inset:0;z-index:99999;background:var(--bg,#000);' +
      'pointer-events:none;opacity:0;transition:opacity ' + (EXIT_MS / 1000) + 's cubic-bezier(.4,0,.2,1)}' +
    '#pt-overlay.pt-show{opacity:1}' +
    '#pt-overlay.pt-hide{display:none}' +
    'html.pt-entering body{opacity:0;transform:translateY(14px)}' +
    'body{transition:opacity ' + (ENTER_MS / 1000) + 's cubic-bezier(.16,1,.3,1),' +
      'transform ' + (ENTER_MS / 1000) + 's cubic-bezier(.16,1,.3,1)}';
  (document.head || document.documentElement).appendChild(style);

  var ov = document.createElement('div');
  ov.id = 'pt-overlay';
  ov.className = 'pt-hide';
  document.documentElement.appendChild(ov);

  /* ---- ENTER: page starts nudged down + transparent, eases into place ---- */
  var noEnter = document.documentElement.hasAttribute('data-pt-no-enter');
  if (!reduce && !noEnter) {
    document.documentElement.classList.add('pt-entering');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.documentElement.classList.remove('pt-entering');
      });
    });
  }

  /* ---- EXIT: fade a flat cover over the page, then navigate ---- */
  var leaving = false;
  function playExit(href) {
    if (leaving) return;
    leaving = true;
    if (reduce) { window.location.href = href; return; }
    ov.classList.remove('pt-hide');
    void ov.offsetWidth;
    ov.classList.add('pt-show');
    setTimeout(function () { window.location.href = href; }, EXIT_MS);
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

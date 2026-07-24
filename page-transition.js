/* ============================================================
   PAGE TRANSITION — curtain wipe.
   A flat panel slides up from the bottom to fully cover the page
   (EXIT), then continues sliding up and off the top to reveal the
   new page underneath (ENTER) — a real curtain, not just a fade.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var EXIT_MS = 480;
  var ENTER_MS = 480;
  var EASE = 'cubic-bezier(.65,0,.35,1)';

  var style = document.createElement('style');
  style.textContent =
    '#pt-curtain{position:fixed;inset:0;z-index:99999;background:var(--bg,#000);' +
      'pointer-events:none;transform:translateY(100%)}' +
    '#pt-curtain.pt-cover{transition:transform ' + (EXIT_MS / 1000) + 's ' + EASE + ';transform:translateY(0)}' +
    '#pt-curtain.pt-reveal{transition:transform ' + (ENTER_MS / 1000) + 's ' + EASE + ';transform:translateY(-100%)}' +
    '#pt-curtain.pt-hide{display:none}';
  (document.head || document.documentElement).appendChild(style);

  var cv = document.createElement('div');
  cv.id = 'pt-curtain';
  cv.className = 'pt-hide';
  document.documentElement.appendChild(cv);

  /* ---- ENTER: curtain starts covering the new page, slides up off it ---- */
  var noEnter = document.documentElement.hasAttribute('data-pt-no-enter');
  function playEnter() {
    if (reduce || noEnter) { cv.className = 'pt-hide'; return; }
    cv.className = 'pt-cover'; // instantly covering (no transition on first paint)
    void cv.offsetWidth;
    requestAnimationFrame(function () {
      cv.className = 'pt-reveal';
      setTimeout(function () { cv.className = 'pt-hide'; }, ENTER_MS + 30);
    });
  }
  if (document.readyState !== 'loading') playEnter();
  else window.addEventListener('DOMContentLoaded', playEnter);
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) playEnter();
  });

  /* ---- EXIT: curtain slides up from the bottom to cover, then navigate ---- */
  var leaving = false;
  function playExit(href) {
    if (leaving) return;
    leaving = true;
    if (reduce) { window.location.href = href; return; }
    cv.className = ''; // reset to translateY(100%), below the fold
    void cv.offsetWidth;
    cv.className = 'pt-cover';
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

/* ============================================================
   PAGE TRANSITION — curtain effect, site-wide.
   A full-viewport panel slides UP to cover the screen on exit,
   then slides further UP and off on the next page's load, so the
   incoming page is always revealed from behind a moving curtain
   rather than a hard cut or plain fade.

   The covering state lives on <html> via a ::before pseudo-element
   so it exists the instant the document starts parsing — no DOM
   node needs to exist yet, so there's no flash of the raw page
   before the curtain is in place on load.
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var DURATION_MS = 640;

  var style = document.createElement('style');
  style.textContent =
    'html::before{content:"";position:fixed;inset:0;background:#0a0c11;z-index:99999;' +
      'transform:translateY(-100%);pointer-events:none;' +
      'transition:transform ' + (DURATION_MS / 1000) + 's cubic-bezier(.76,0,.24,1);}' +
    'html.pt-cover::before{transform:translateY(0);pointer-events:auto;}' +
    'html.pt-cover-exit::before{transform:translateY(-100%);}' +
    'html.pt-instant::before{transition:none!important;}' +
    'html.gold::before{background:#f2a81e;}';
  (document.head || document.documentElement).appendChild(style);

  var root = document.documentElement;

  /* ---- ENTER: curtain starts fully covering (no transition), then lifts off ---- */
  function playEnter() {
    if (reduce) { root.classList.remove('pt-cover', 'pt-instant'); return; }
    root.classList.add('pt-cover', 'pt-instant');
    // force the instant (transition:none) covered state to paint once...
    void root.offsetWidth;
    requestAnimationFrame(function () {
      root.classList.remove('pt-instant');
      requestAnimationFrame(function () {
        // ...then transition it away on the next frame.
        root.classList.add('pt-cover-exit');
        setTimeout(function () {
          root.classList.remove('pt-cover', 'pt-cover-exit');
        }, DURATION_MS + 60);
      });
    });
  }
  // Cover instantly at parse time (before first paint) so there's nothing
  // to flash — the reveal above then plays once the DOM is interactive.
  root.classList.add('pt-cover', 'pt-instant');
  if (document.readyState !== 'loading') playEnter();
  else window.addEventListener('DOMContentLoaded', playEnter);
  window.addEventListener('pageshow', function (e) { if (e.persisted) playEnter(); });

  /* ---- EXIT: curtain rises to cover the screen, then navigate ---- */
  var leaving = false;
  function playExit(href) {
    if (leaving) return;
    leaving = true;
    if (reduce) { window.location.href = href; return; }
    root.classList.remove('pt-cover-exit', 'pt-instant');
    root.classList.add('pt-cover');
    setTimeout(function () { window.location.href = href; }, DURATION_MS);
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

  // bfcache restores can leave the curtain mid-animation from the page that
  // was navigated away from — always land in the fully-revealed state.
  window.addEventListener('pagehide', function () {
    root.classList.remove('pt-cover', 'pt-cover-exit', 'pt-instant');
  });
})();

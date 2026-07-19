/* Coming-soon case cards: block clicks and drive the CSS microinteractions
   (cursor spotlight + wordmark parallax). The big "COMING SOON" wordmark is
   plain CSS text so it is always visible — no canvas, no observers to miss. */
(function () {
  function initCard(card) {
    var soon = card.querySelector('.casecard__soon');
    if (!soon || soon.__soonInit) return;
    soon.__soonInit = true;
    soon.classList.remove('has-canvas');
    card.addEventListener('click', function (e) { e.preventDefault(); });

    function set(px, py) {
      soon.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      soon.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      soon.style.setProperty('--px', px.toFixed(3));
      soon.style.setProperty('--py', py.toFixed(3));
    }
    card.addEventListener('pointermove', function (e) {
      var r = soon.getBoundingClientRect();
      set((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    });
    card.addEventListener('pointerleave', function () { set(0.5, 0.42); });
  }

  function boot() { document.querySelectorAll('.casecard--soon').forEach(initCard); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

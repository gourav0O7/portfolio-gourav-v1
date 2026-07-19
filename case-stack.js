/* Pinned horizontal card stack: one case panel visible at a time; each next
   panel slides in from the right and fully covers the previous as you scroll.
   Also relocates each card's tags into the left write-up column.
   Static vertical column on mobile / reduced-motion (CSS handles those). */
(function () {
  var root = document.getElementById('caseScroll');
  if (!root || !root.classList.contains('casestack')) return;
  var track = root.querySelector('[data-track]');
  if (!track) return;
  var cards = [].slice.call(track.querySelectorAll('.casecard'));
  if (!cards.length) return;

  // move tags into the write-up column (they live in .casecard__media by default),
  // and inject a real CTA element (links only) that nav-scramble can target.
  cards.forEach(function (c) {
    var cap = c.querySelector('.casecard__cap');
    var tags = c.querySelector('.casecard__tags');
    if (tags && cap) {
      var meta = cap.querySelector('.casecard__meta');
      cap.insertBefore(tags, meta || null);
    }
    if (cap && c.tagName === 'A' && c.getAttribute('href') && !cap.querySelector('.casecard__cta')) {
      var cta = document.createElement('span');
      cta.className = 'casecard__cta';
      cta.innerHTML = '<span class="casecard__cta-t">View case study</span><span class="casecard__cta-arw" aria-hidden="true">\u2192</span>';
      cap.appendChild(cta);
    }
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var wide = window.matchMedia('(min-width: 861px)');
  var PER = 92; // vh of scroll travel per card

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function active() { return wide.matches && !reduce.matches; }

  function layout() {
    if (!active()) { root.style.height = ''; cards.forEach(function (c) { c.style.transform = ''; c.style.zIndex = ''; }); return; }
    root.style.height = (cards.length * PER + 100) + 'vh';
    cards.forEach(function (c, i) { c.style.zIndex = i + 1; });
    onScroll();
  }

  function onScroll() {
    if (!active()) return;
    var vh = window.innerHeight;
    var top = root.getBoundingClientRect().top;
    var total = root.offsetHeight - vh;
    var p = total > 0 ? clamp(-top / total, 0, 1) * (cards.length - 1) : 0;
    for (var i = 0; i < cards.length; i++) {
      var x = clamp(i - p, 0, 1);   // 1 = waiting off-right, 0 = covering
      cards[i].style.transform = x > 0.0001 ? 'translate3d(' + (x * 118) + '%,0,0)' : 'translate3d(0,0,0)';
    }
  }

  layout();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', layout);
  if (wide.addEventListener) { wide.addEventListener('change', layout); reduce.addEventListener('change', layout); }
})();

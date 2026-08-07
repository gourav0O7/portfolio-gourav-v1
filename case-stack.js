/* Pinned card stack: one case panel visible at a time; each next panel
   slides in from the right and fully covers the previous as you scroll.
   Static vertical column below 861px / reduced-motion (CSS handles those).
   Also relocates each card's tags into the left write-up column. */
(function () {
  var root = document.getElementById('caseScroll');
  if (!root || !root.classList.contains('casestack')) return;
  var track = root.querySelector('[data-track]');
  if (!track) return;
  var cards = [].slice.call(track.querySelectorAll('.casecard'));
  if (!cards.length) return;

  // move tags into the write-up column (they live in .casecard__media by default),
  // and inject a real CTA link (the card itself is a plain div now \u2014 only
  // this CTA navigates, so tabbing through the page lands cleanly on "View
  // case study" instead of the whole sprawling card being one giant link).
  cards.forEach(function (c) {
    var cap = c.querySelector('.casecard__cap');
    var tags = c.querySelector('.casecard__tags');
    if (tags && cap) {
      var meta = cap.querySelector('.casecard__meta');
      cap.insertBefore(tags, meta || null);
    }
    if (cap && c.dataset.href && !cap.querySelector('.casecard__cta')) {
      var cta = document.createElement('a');
      cta.href = c.dataset.href;
      // .pill \u2014 the exact same outline\u2192accent-fill CTA as the "Let's talk"
      // button in the footer. The old permanently-orange-filled button made
      // the hover scramble's dark-on-orange dud glyphs barely legible;
      // .pill stays outlined/light by default and only floods accent color
      // on hover, so the scramble always renders on a light (or, on hover,
      // deliberately high-contrast dark-on-accent) background, same as
      // every other .pill on the site.
      cta.className = 'casecard__cta pill';
      // Label as a DIRECT text node (not wrapped in its own span) \u2014 that's
      // what nav-scramble.js's directLabel() reads to decide if an element
      // is scramble-eligible. Wrapping it broke that silently: nav-scramble
      // was already explicitly wired to this class, but always found an
      // empty label and bailed, so this CTA never got the hover-scramble
      // every other CTA on the site has. Only the trailing arrow is a
      // nested element (directLabel() ignores non-text children by design).
      cta.appendChild(document.createTextNode('View case study'));
      cta.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.6"/></svg>');
      cap.appendChild(cta);
    }
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Pin by WIDTH only now — not input type. This used to also require
  // (any-hover:hover) and (any-pointer:fine), unpinning any touch device
  // regardless of screen size; that part was fine (a touch laptop/tablet
  // wide enough to fit the pinned layout should still get it) but it also
  // got tried as "pin at every width, touch included" for a stretch, which
  // broke real phones: the pinned card sits inside a fixed 8vh top/bottom
  // envelope, and at phone widths the image-on-top + full text stack
  // doesn't fit that envelope — images were rendering cropped in half.
  // The 40/60 side-by-side card layout this pin is built around simply
  // doesn't work below ~861px regardless of input device, so width is the
  // right gate, same threshold the CSS fallback below already uses.
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

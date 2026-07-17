
/* ============================================================
   RISE — masked reveal for text, site-wide.
   Short text (headings, eyebrows, ledes) rises word-by-word;
   longer copy (paragraphs, list items, quotes) rises as one
   masked block. Skips the CTA and interactive/chrome UI.
   Runs on every page, incl. dynamically-built project pages.
   ============================================================ */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;

  var STAGGER = 0.05;      // seconds between words
  var MAXDELAY = 0.5;      // cap so long text doesn't crawl
  var WORD_MAX = 7;        // <= this many words → word-rise, else block-rise

  // Editorial text to animate. Class-targeted (not raw p/li everywhere) so we
  // never touch prototype UIs, tables, nav, footer marquee, etc.
  var SELECTOR = [
    '.section-title', '.about-lede', '.writing-hero__name', '.nift-hero__name',
    '.article__title', '.article__dek', '.p-title', '.p-one',
    '.hero__intro', '.gloss-hero__lede', '.writing-hero__lede', '.nift-hero__lede',
    '.eyebrow', '.lede',
    '.prose > p', '.prose > h2', '.prose > h3', '.prose > ul > li', '.prose > ol > li', '.prose > blockquote',
    '.p-prose', '.p-step__h', '.p-principle h4',
    '.term__name', '.term__def',
    /* homepage content */
    '.screenstats__head', '.sstat__l', '.head-row__count',
    '.casecard__title', '.casecard__desc',
    '.ltag__name', '.ltag__quote', '.ltag__meta', '.ltag__svc',
    '.disc__label', '.disc__t', '.cert__t', '.tools__item',
    /* about page */
    '.about-hero__name', '.about-hero__lede', '.about__p', '.bio__p',
    '[data-rise]'
  ].join(', ');

  // Never rise inside these (CTA, testimonials, the ball card, footer, interactive UI).
  var DENY = '.cta-band, .ltag, .remember, .gloss-bar, .hero__name, nav, .nav, .drawer, .footer, .bigfoot, [data-bigfoot], ' +
             '.loader, table, .p-screens, .device, .phone, .frame, button, .btn, ' +
             '.tweaks, [data-proto], .ed-adm, .interviewer';

  function isGradientText(el) {
    var cs = getComputedStyle(el);
    var clip = ((cs.webkitBackgroundClip || cs.backgroundClip || '') + '');
    var fill = ((cs.webkitTextFillColor || '') + '');
    return clip.indexOf('text') !== -1 || fill === 'transparent' || fill === 'rgba(0, 0, 0, 0)';
  }

  function mkUnit(ctx, block) {
    var w = document.createElement('span'); w.className = block ? 'rise__w rise__w--b' : 'rise__w';
    var i = document.createElement('span'); i.className = 'rise__i';
    var d = Math.min(ctx.n * STAGGER, MAXDELAY);
    i.style.setProperty('--rd', d.toFixed(3) + 's');
    ctx.n++;
    w.appendChild(i);
    return { w: w, i: i };
  }

  // Word-rise: split text nodes into per-word masks, preserving <br> and inline
  // tags; gradient runs (chrome/foil/em) stay intact as one unit.
  function splitWords(node, ctx) {
    var kids = [].slice.call(node.childNodes);
    kids.forEach(function (child) {
      if (child.nodeType === 3) {
        var parts = child.textContent.split(/(\s+)/);
        var frag = document.createDocumentFragment();
        parts.forEach(function (p) {
          if (p === '') return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          var u = mkUnit(ctx, false); u.i.textContent = p; frag.appendChild(u.w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        if (isGradientText(child)) {
          var u = mkUnit(ctx, false);
          node.replaceChild(u.w, child);
          u.i.appendChild(child);
        } else {
          splitWords(child, ctx);
        }
      }
    });
  }

  // Block-rise: wrap the element's whole content in a single masked unit.
  function wrapBlock(el, ctx) {
    var u = mkUnit(ctx, true);
    while (el.firstChild) u.i.appendChild(el.firstChild);
    el.appendChild(u.w);
  }

  function wordCount(el) {
    return (el.textContent || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight * 0.94 && r.bottom > 0;
  }

  function init() {
    var risers = [].slice.call(document.querySelectorAll(SELECTOR)).filter(function (el) {
      return !el.classList.contains('rise') && !el.closest(DENY) && (el.textContent || '').trim();
    });
    if (!risers.length) return;

    var riseIn = function (el) { el.classList.add('is-rise-in'); };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { riseIn(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });

    risers.forEach(function (el) {
      el.classList.add('rise');
      if (wordCount(el) <= WORD_MAX) splitWords(el, { n: 0 });
      else wrapBlock(el, { n: 0 });
      io.observe(el);
    });

    // Only reveal what's already on screen at load. Everything below the fold
    // waits for the observer so YOU see it animate as you scroll to it.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        risers.forEach(function (el) { if (inView(el)) { riseIn(el); io.unobserve(el); } });
      });
    });

    // Per-element failsafe: if an element is in view but somehow never got
    // observed, reveal just that one — never a blanket reveal of off-screen text.
    setTimeout(function () {
      risers.forEach(function (el) {
        if (!el.classList.contains('is-rise-in') && inView(el)) el.classList.add('rise-shown');
      });
    }, 4000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('load', init);
  setTimeout(init, 500);
})();

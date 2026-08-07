
/* ============================================================
   LINK SCRAMBLE — split-flap / departure-board hover effect
   On hover, a link/button's label jumbles through random glyphs
   and resolves, left-to-right, into the real word — like an
   airline flip-board settling on a destination.

   Applied to EVERY simple clickable link or button: nav, drawer,
   buttons, footer links, CTAs, social rows, etc. Links whose
   label isn't a single run of text (cards with nested headings,
   icon-only controls, the brand mark, game pads, the loader) are
   skipped automatically so their markup stays intact.
   ============================================================ */
(function () {
  'use strict';

  var GLYPHS = '!<>-_\\/[]{}\u2014=+*^?#0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Don't touch these — icon-only, functional, or structurally complex.
  var SKIP_MATCH = '.brand, .nav__burger, .theme-toggle, .gbtn, .ohgame__exit, .ohcar__play, image-slot';
  var SKIP_WITHIN = '.loader, .ohgame, [data-reward], .bigfoot__marquee, .cap__list';

  function Scramble(el) {
    this.el = el;
    this.frameRequest = 0;
    this.update = this.update.bind(this);
  }
  Scramble.prototype.setText = function (newText) {
    var oldText = this.el.textContent;
    var len = Math.max(oldText.length, newText.length);
    this.queue = [];
    for (var i = 0; i < len; i++) {
      var start = Math.floor(Math.random() * 24);
      var end = start + 20 + Math.floor(Math.random() * 30);
      this.queue.push({ from: oldText[i] || '', to: newText[i] || '', start: start, end: end, char: '' });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
  };
  Scramble.prototype.update = function () {
    var output = '', complete = 0;
    for (var i = 0; i < this.queue.length; i++) {
      var q = this.queue[i];
      if (this.frame >= q.end) { complete++; output += q.to; }
      else if (this.frame >= q.start) {
        if (!q.char || Math.random() < 0.3) q.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        output += '<span class="nav-dud">' + q.char + '</span>';
      } else { output += q.from; }
    }
    this.el.innerHTML = output;
    if (complete < this.queue.length) { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
  };

  // Concatenate a link's DIRECT child text nodes (ignores nested
  // elements like the .idx badge or a trailing arrow span).
  function directLabel(el) {
    var t = '';
    Array.prototype.forEach.call(el.childNodes, function (n) {
      if (n.nodeType === 3) t += n.textContent;
    });
    return t.trim();
  }

  function wire(el, opts) {
    if (el.dataset.fxWired) return;
    opts = opts || {};
    if (!opts.force && (el.matches(SKIP_MATCH) || el.closest(SKIP_WITHIN))) return;

    var label = directLabel(el);
    if (!label || label.length > 28) return;       // skip empty / paragraph-length
    if (!/[A-Za-z0-9]/.test(label)) return;          // skip pure-symbol (arrows, ×, ↓ …)

    // Move the label text into one span we can rewrite, in place.
    var firstText = null;
    Array.prototype.forEach.call(el.childNodes, function (n) {
      if (n.nodeType === 3 && !firstText) firstText = n;
    });
    var span = document.createElement('span');
    span.className = 'nav-fx';
    span.textContent = label;
    el.insertBefore(span, firstText);
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) el.removeChild(n);
    });
    el.dataset.fxWired = '1';

    if (reduce) return;

    var fx = new Scramble(span), busy = false;
    var trigger = opts.trigger || el;
    trigger.addEventListener('mouseenter', function () {
      if (busy) return;
      busy = true;
      // lock the label box to its resolved width so proportional fonts
      // don't reflow / jitter while the glyphs are scrambling
      span.style.width = '';
      span.style.width = span.offsetWidth + 'px';
      fx.setText(label);
      setTimeout(function () { busy = false; span.style.width = ''; }, 950);
    });
  }

  function init() {
    document.querySelectorAll('a, button').forEach(function (el) { wire(el); });
    // CTAs nested inside whole-card links: wire the label, but fire the
    // scramble when the parent card is hovered.
    document.querySelectorAll('.feature__cta').forEach(function (el) {
      wire(el, { force: true, trigger: el.closest('.feature') || el });
    });
    document.querySelectorAll('.workmore__txt').forEach(function (el) {
      wire(el, { force: true, trigger: el.closest('.workmore__cta') || el });
    });
    // Case-card "View case" CTA — it's a <span> inside the whole-card <a>,
    // not its own link, so it needs an explicit wire + a trigger on the
    // ancestor card.
    document.querySelectorAll('.casecard__go').forEach(function (el) {
      wire(el, { force: true, trigger: el.closest('.casecard') || el });
    });
    // "All work" overlay rows: the whole row is one <a> with everything in
    // nested spans, so the default a/button pass above finds no direct text
    // to scramble and skips it silently. Wire the title explicitly instead.
    document.querySelectorAll('.awrow__main b').forEach(function (el) {
      wire(el, { force: true, trigger: el.closest('.awrow') || el });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  // second pass for links injected by other scripts (e.g. the big footer)
  window.addEventListener('load', init);
})();

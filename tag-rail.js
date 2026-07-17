
/* Testimonial luggage-tag rail.
   On desktop the section PINS: scrolling down moves the tag row left until
   the last card is reached, then the page scroll continues. On small screens
   / reduced-motion it falls back to a normal native horizontal scroll. */
(function () {
  var mq = window.matchMedia('(min-width: 760px) and (prefers-reduced-motion: no-preference)');

  function init(section) {
    var rail = section.querySelector('[data-tagrail]');
    var track = section.querySelector('[data-tagtrack]');
    if (!rail || !track) return;
    var sticky = section.querySelector('.tag-pin__sticky');
    var prev = section.querySelector('[data-tagprev]');
    var next = section.querySelector('[data-tagnext]');
    var hint = section.querySelector('[data-taghint]');
    var tags = Array.prototype.slice.call(track.querySelectorAll('.ltag'));

    var pinned = false;     // pin mode active (desktop)
    var D = 0;              // horizontal travel distance (px) = (n-1) * card pitch
    var startShift = 0;     // row offset that centers the FIRST card
    var pinStartY = 0;      // page scrollY at which the rail begins to pin
    var lead = 0, tail = 0; // dwell buffers before/after the horizontal scroll
    var lastShift = 0, vel = 0, raf = null;

    function pitch() {
      if (tags.length < 2) return tags[0] ? tags[0].offsetWidth : 360;
      return tags[1].offsetLeft - tags[0].offsetLeft;
    }

    /* ---- measure & (de)activate pin ---- */
    function measure() {
      section.style.height = '';                 // reset to read natural metrics
      section.classList.remove('is-pin');
      var overflow = Math.max(0, track.scrollWidth - track.clientWidth);
      var first = tags[0], last = tags[tags.length - 1];
      if (mq.matches && overflow > 24 && first && last) {
        pinned = true;
        var vw = track.clientWidth;
        // shifts that put the first / last card dead-centre in the viewport
        startShift = vw / 2 - (first.offsetLeft + first.offsetWidth / 2);
        var endShift = vw / 2 - (last.offsetLeft + last.offsetWidth / 2);
        D = Math.max(1, startShift - endShift);   // total horizontal travel
        // dwell so the first/last card sit centred for a beat before/after moving
        lead = Math.round(window.innerHeight * 0.32);
        tail = Math.round(window.innerHeight * 0.30);
        // the rail pins only once the heading has scrolled up past it
        var stickyTop = sticky.offsetTop;
        pinStartY = section.getBoundingClientRect().top + window.scrollY + stickyTop;
        section.classList.add('is-pin');
        section.style.height = (stickyTop + sticky.offsetHeight + lead + D + tail) + 'px';
      } else {
        pinned = false;
        lead = tail = 0; startShift = 0;
        section.style.height = '';
        track.style.removeProperty('--shift');
      }
      apply();
      updateNav();
    }

    /* ---- map page scroll → row shift ---- */
    function progress() {
      var scrolled = window.scrollY - pinStartY;
      return Math.max(0, Math.min(1, (scrolled - lead) / D));
    }
    function apply() {
      if (!pinned) return;
      var shift = startShift - progress() * D;
      track.style.setProperty('--shift', shift.toFixed(1) + 'px');
      // tilt the tags by scroll velocity
      var inst = shift - lastShift; lastShift = shift;
      vel += (inst - vel) * 0.3;
      var tilt = Math.max(-7, Math.min(7, vel * 0.5));
      for (var i = 0; i < tags.length; i++) tags[i].style.setProperty('--drift', tilt.toFixed(2) + 'deg');
      if (hint) hint.style.opacity = progress() > 0.98 ? '0.35' : '1';
    }
    function onScroll() {
      if (!pinned) return;
      if (!raf) raf = requestAnimationFrame(function () { raf = null; apply(); });
    }

    /* ---- nav buttons ---- */
    function go(dir) {
      if (pinned) {
        // advance the PAGE by one card's worth (1px vert ≈ 1px horiz travel)
        window.scrollBy({ top: dir * pitch(), behavior: 'smooth' });
      } else {
        track.scrollBy({ left: dir * pitch(), behavior: 'smooth' });
      }
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });

    function updateNav() {
      var atStart, atEnd;
      if (pinned) { var p = progress(); atStart = p <= 0.01; atEnd = p >= 0.99; }
      else {
        var max = track.scrollWidth - track.clientWidth - 2;
        atStart = track.scrollLeft <= 2; atEnd = track.scrollLeft >= max;
      }
      if (prev) prev.disabled = atStart;
      if (next) next.disabled = atEnd;
    }

    window.addEventListener('scroll', function () { onScroll(); updateNav(); }, { passive: true });
    track.addEventListener('scroll', updateNav, { passive: true });   // fallback mode
    window.addEventListener('resize', measure);
    mq.addEventListener('change', measure);
    measure();
  }

  function boot() {
    document.querySelectorAll('[data-tagpin]').forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();


/* ============================================================
   site.js — shared chrome + behaviour for the v2 site
   · renders the nav into [data-site-nav] and the footer into
     [data-site-foot] (one source for every page)
   · menu toggle, scrolled-nav state, scroll reveal
   · phone-number gate (email → reveal), ported from bigfoot.js
   Load it at the end of <body>.
   ============================================================ */
(function () {
  'use strict';

  var EMAIL = 'gouravsharma.ux@gmail.com';
  var LINKEDIN = 'https://www.linkedin.com/in/gourav-sharmaux/';
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.6"/></svg>';

  /* ---------- nav ---------- */
  var page = document.body.getAttribute('data-page') || '';
  function cur(name) { return page === name ? ' aria-current="page"' : ''; }
  var navHTML =
    '<nav class="nav" aria-label="Main"><div class="wrap nav__in">' +
      '<a class="nav__brand" href="index.html">' +
        '<span class="nav__mark"><img src="assets/portrait.webp" alt="" width="32" height="32" /></span>' +
        '<span>Gourav Sharma<small>Product &amp; UI/UX Designer</small></span>' +
      '</a>' +
      '<button class="nav__toggle" aria-label="Menu" aria-expanded="false"><span></span></button>' +
      '<div class="nav__links">' +
        '<a href="index.html#work"' + cur('work') + '>Work</a>' +
        '<a href="about.html"' + cur('about') + '>About</a>' +
        '<a href="glossary.html"' + cur('glossary') + '>Glossary</a>' +
        '<a href="resume.html"' + cur('resume') + '>Résumé</a>' +
        '<a class="btn btn--ink" href="mailto:' + EMAIL + '">Get in touch</a>' +
      '</div>' +
    '</div></nav>';

  /* ---------- footer ---------- */
  var footHTML =
    '<footer class="foot">' +
      '<div class="wrap">' +
        '<div class="foot__statement">' +
          '<p class="label label--plain" style="color:#8f8d86;margin:0 0 24px">End note</p>' +
          '<h2 class="display">Design is <em>what remains.</em></h2>' +
          '<p>Good design fades into the task. Great design is the only thing the user remembers.</p>' +
        '</div>' +
        '<div class="foot__grid">' +
          '<div>' +
            '<div class="foot__lbl">Move</div>' +
            '<h3 class="foot__h">Got a hard product problem?</h3>' +
            '<p class="foot__p">From discovery to ship. I work end-to-end across SaaS, mobile and complex operational tools.</p>' +
            '<a class="btn btn--sm" href="mailto:' + EMAIL + '">Start a project ' + ARROW + '</a>' +
          '</div>' +
          '<div>' +
            '<div class="foot__lbl">Join</div>' +
            '<h3 class="foot__h">Currently designing at Omniful.</h3>' +
            '<p class="foot__p">Open to senior product / UX roles where systems thinking and craft can compound.</p>' +
            '<a class="btn btn--sm" href="resume.html">Download résumé ' + ARROW + '</a>' +
          '</div>' +
          '<div>' +
            '<div class="foot__lbl">Social</div>' +
            '<div class="foot__social">' +
              '<a href="' + LINKEDIN + '" target="_blank" rel="noopener">LinkedIn <span>→</span></a>' +
              '<a href="https://www.instagram.com/drivenbygourav/" target="_blank" rel="noopener">Instagram <span>→</span></a>' +
              '<a href="https://youtube.com/@drivenbygourav" target="_blank" rel="noopener">YouTube <span>→</span></a>' +
              '<a href="mailto:' + EMAIL + '">Email <span>→</span></a>' +
              '<a href="#" data-phone-gate>Phone <span>→</span></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="foot__bar">' +
          '<span class="foot__loc"><i></i>Gurgaon, Haryana · IND · open to opportunities</span>' +
          '<nav aria-label="Footer">' +
            '<a href="index.html">Index</a><a href="index.html#work">Work</a><a href="about.html">About</a>' +
            '<a href="glossary.html">Glossary</a><a href="project-portfolio.html">This site</a><a href="resume.html">Résumé</a>' +
          '</nav>' +
          '<span>© 2026 Gourav Sharma</span>' +
        '</div>' +
      '</div>' +
    '</footer>';

  function mountChrome(scope) {
    scope = scope || document;
    var n = scope.querySelector('[data-site-nav]');
    if (n) n.outerHTML = navHTML;
    var f = scope.querySelector('[data-site-foot]');
    if (f) f.outerHTML = footHTML;
  }
  window.SITE = { nav: navHTML, foot: footHTML, mount: mountChrome, arrow: ARROW, initReveal: initReveal };
  mountChrome();

  /* ---------- nav behaviour ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.nav__toggle');
    if (t) {
      var open = document.body.classList.toggle('menu-open');
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
    if (e.target.closest && e.target.closest('.nav__links a')) document.body.classList.remove('menu-open');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') document.body.classList.remove('menu-open'); });
  function onScroll() {
    var nav = document.querySelector('.nav');
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal ---------- */
  function initReveal(scope) {
    var els = (scope || document).querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
    // never leave content hidden if the observer stalls
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 2500);
  }
  initReveal();

  /* ---------- immersive: cursor + 3D tilt (fine pointers only) ---------- */
  var fine = window.matchMedia && matchMedia('(pointer: fine)').matches;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fine && !calm) {
    var cur = document.createElement('div');
    cur.className = 'cursor';
    cur.innerHTML = '<div class="cursor__ring"></div><div class="cursor__dot"></div>';
    document.body.appendChild(cur);
    document.documentElement.classList.add('has-cursor');
    var ring = cur.firstChild, dot = cur.lastChild;
    var mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    addEventListener('pointerdown', function () { cur.classList.add('is-down'); });
    addEventListener('pointerup', function () { cur.classList.remove('is-down'); });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest && e.target.closest('a, button, [data-tilt], label, input');
      cur.classList.toggle('is-hover', !!t && !(t.matches && t.matches('[data-tilt]')) );
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
  }
  function initTilt(scope) {
    if (!fine || calm) return;
    (scope || document).querySelectorAll('[data-tilt]').forEach(function (el) {
      if (el._tilt) return; el._tilt = 1;
      var max = parseFloat(el.getAttribute('data-tilt')) || 6;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.transform = 'perspective(1100px) rotateX(' + ((0.5 - y) * max) + 'deg) rotateY(' + ((x - 0.5) * max) + 'deg) translateZ(0)';
        el.style.setProperty('--mx', (x * 100) + '%'); el.style.setProperty('--my', (y * 100) + '%');
      });
      el.addEventListener('pointerleave', function () { el.classList.remove('is-tilting'); el.style.transform = ''; });
    });
  }
  initTilt();
  window.SITE.initTilt = initTilt;

  /* ---------- phone gate ---------- */
  var PHONE = '+91 62002 04324';
  var PHONE_HREF = 'tel:+916200204324';
  function buildModal() {
    if (document.querySelector('.phonegate')) return;
    var wrap = document.createElement('div');
    wrap.className = 'phonegate';
    wrap.setAttribute('hidden', '');
    wrap.innerHTML =
      '<div class="phonegate__scrim" data-pg-close></div>' +
      '<div class="phonegate__panel" role="dialog" aria-modal="true" aria-label="Reveal phone number">' +
        '<button class="phonegate__x" data-pg-close aria-label="Close">×</button>' +
        '<div class="phonegate__head"><span class="phonegate__pip"></span> Direct line</div>' +
        '<h3 class="phonegate__title">Drop your email to reveal my number.</h3>' +
        '<p class="phonegate__sub">No spam, no list. It just helps me know who’s calling.</p>' +
        '<form class="phonegate__form" novalidate>' +
          '<input type="email" class="phonegate__input" placeholder="you@company.com" autocomplete="email" required />' +
          '<button type="submit" class="phonegate__go">Reveal →</button>' +
        '</form>' +
        '<div class="phonegate__err" hidden>Enter a valid email to continue.</div>' +
        '<div class="phonegate__reveal" hidden>' +
          '<div class="phonegate__rlbl">Access granted</div>' +
          '<div class="phonegate__numrow">' +
            '<a class="phonegate__num" href="' + PHONE_HREF + '">' + PHONE + '</a>' +
            '<button type="button" class="phonegate__copy" data-pg-copy aria-label="Copy number">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path></svg>' +
              '<span class="phonegate__copytxt">Copy</span>' +
            '</button>' +
          '</div>' +
          '<div class="phonegate__rsub">Tap to call · or save it for later.</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    var input = wrap.querySelector('.phonegate__input');
    var form = wrap.querySelector('.phonegate__form');
    var err = wrap.querySelector('.phonegate__err');
    var reveal = wrap.querySelector('.phonegate__reveal');
    function unlocked() { try { return sessionStorage.getItem('pg-unlocked') === '1'; } catch (e) { return false; } }
    function close() { wrap.setAttribute('hidden', ''); document.documentElement.style.overflow = ''; }
    function showNumber() { form.setAttribute('hidden', ''); err.setAttribute('hidden', ''); reveal.removeAttribute('hidden'); }
    function open() {
      wrap.removeAttribute('hidden');
      document.documentElement.style.overflow = 'hidden';
      if (unlocked()) showNumber(); else setTimeout(function () { input.focus(); }, 60);
    }
    wrap.addEventListener('click', function (e) { if (e.target.hasAttribute('data-pg-close')) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !wrap.hasAttribute('hidden')) close(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) { err.removeAttribute('hidden'); input.focus(); return; }
      try { sessionStorage.setItem('pg-unlocked', '1'); } catch (x) {}
      showNumber();
    });
    var copyBtn = wrap.querySelector('[data-pg-copy]');
    var copyTxt = wrap.querySelector('.phonegate__copytxt');
    var reset;
    copyBtn.addEventListener('click', function () {
      function flash() {
        copyBtn.classList.add('is-copied'); copyTxt.textContent = 'Copied';
        clearTimeout(reset);
        reset = setTimeout(function () { copyBtn.classList.remove('is-copied'); copyTxt.textContent = 'Copy'; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(PHONE).then(flash, flash);
      else flash();
    });
    window.__openPhoneGate = open;
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-phone-gate]');
    if (!t) return;
    e.preventDefault();
    buildModal();
    window.__openPhoneGate();
  });
})();

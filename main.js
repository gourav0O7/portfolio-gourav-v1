
/* ============================================================
   AMBER TERMINAL — shared behaviour
   nav state, mobile drawer, scroll reveal, counters,
   typed hero, parallax grid, boot sequence
   ============================================================ */
(function () {
  'use strict';

  /* ---- Inject ambient sweep layer ---- */
  if (!document.querySelector('.sweep')) {
    var sweep = document.createElement('div');
    sweep.className = 'sweep';
    document.body.appendChild(sweep);
  }

  /* ---- Nav: scrolled state + the pill's MENU trigger ----
     The trigger's icon (dots -> × on open, both drawn via CSS box-shadow,
     no extra markup needed) and label are built here rather than
     duplicated across every page's HTML / the project.js template — one
     shared enhancement, applied wherever `.nav__inner` shows up. Label
     stays "Menu" in both states (matches the reference this was modeled
     on) — only the icon and the pill's border communicate open/closed. */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.querySelector('.nav__burger');
  if (burger && !burger.querySelector('.nav__burger-ico')) {
    var oldSpan = burger.querySelector('span');
    if (oldSpan) oldSpan.remove(); // drop the old 3-line hamburger markup
    var ico = document.createElement('span');
    ico.className = 'nav__burger-ico';
    ico.setAttribute('aria-hidden', 'true');
    ico.innerHTML = '<i class="nav__burger-dots"></i><i class="nav__burger-x"></i>';
    burger.insertBefore(ico, burger.firstChild);
    var lbl = document.createElement('span');
    lbl.className = 'nav__burger-lbl';
    lbl.textContent = 'Menu';
    burger.appendChild(lbl);
    burger.setAttribute('aria-expanded', 'false');
  }

  // Résumé link, wherever it lives in the menu, reads as plain "Resume"
  document.querySelectorAll('.drawer a[href="resume.html"]').forEach(function (a) {
    var idx = a.querySelector('.idx'); if (idx) idx.remove();
    a.textContent = 'Resume';
  });

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    var open = document.body.classList.toggle('menu-open');
    if (burger) burger.setAttribute('aria-expanded', String(open));
  }
  if (burger) burger.addEventListener('click', toggleMenu);
  document.querySelectorAll('.drawer a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) closeMenu();
  });

  /* ---- Scroll reveal ---- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }
  // Masked heading rise now lives in rise.js (loaded site-wide, incl. project pages).

  /* ---- Number counters ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = (el.getAttribute('data-dec') === '1') ? 1 : 0;
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = dec ? val.toFixed(1) : Math.round(val).toString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = dec ? target.toFixed(1) : Math.round(target).toString();
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (reduced || !('IntersectionObserver' in window)) {
    counters.forEach(function (el) {
      var t = parseFloat(el.getAttribute('data-count'));
      el.textContent = (el.getAttribute('data-dec') === '1') ? t.toFixed(1) : t;
    });
  } else {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Typed hero (data-typed = "a|b|c") ---- */
  document.querySelectorAll('[data-typed]').forEach(function (el) {
    if (reduced) { el.textContent = el.getAttribute('data-typed').split('|')[0]; return; }
    var words = el.getAttribute('data-typed').split('|');
    var wi = 0, ci = 0, deleting = false;
    function tick() {
      var w = words[wi];
      if (!deleting) {
        el.textContent = w.slice(0, ci + 1); ci++;
        if (ci === w.length) { deleting = true; return setTimeout(tick, 1700); }
        setTimeout(tick, 60 + Math.random() * 40);
      } else {
        el.textContent = w.slice(0, ci - 1); ci--;
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, 280); }
        setTimeout(tick, 32);
      }
    }
    setTimeout(tick, 700);
  });

  /* ---- Live clock readout (data-clock) ---- */
  var clocks = document.querySelectorAll('[data-clock]');
  if (clocks.length) {
    function updateClock() {
      var d = new Date();
      var s = d.toUTCString().split(' ')[4] + ' UTC';
      clocks.forEach(function (c) { c.textContent = s; });
    }
    updateClock(); setInterval(updateClock, 1000);
  }

  /* ---- Viewport-relative parallax ---- */
  if (!reduced) {
    var pels = document.querySelectorAll('[data-parallax]');
    if (pels.length) {
      var vh = window.innerHeight;
      window.addEventListener('resize', function () { vh = window.innerHeight; });
      function tickParallax() {
        pels.forEach(function (el) {
          var r = el.getBoundingClientRect();
          var center = vh / 2;
          var elCenter = r.top + r.height / 2;
          var dist = elCenter - center;
          var sp = parseFloat(el.getAttribute('data-parallax')) || 0.1;
          el.style.transform = 'translate3d(0,' + (-dist * sp) + 'px,0)';
        });
        requestAnimationFrame(tickParallax);
      }
      requestAnimationFrame(tickParallax);
    }
  }

  /* ---- Boot sequence overlay (legacy — superseded by loader.js) ---- */
  // intentionally no-op; loader.js owns the boot experience now.

  /* ---- Custom cursor (refined: dot + lagging ring) ----------- */
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    var dot = document.createElement('div');  dot.className  = 'cursor-dot';
    var ring = document.createElement('div'); ring.className = 'cursor-ring';
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    var dx = -100, dy = -100, rx = -100, ry = -100, tx = -100, ty = -100;
    var seen = false;
    function show(on) {
      dot.style.opacity  = on ? '1' : '0';
      ring.style.opacity = on ? '1' : '0';
    }
    show(false);
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!seen) { dx = tx; dy = ty; rx = tx; ry = ty; seen = true; show(true); }
    }, { passive: true });
    document.addEventListener('mouseleave', function () { show(false); });
    document.addEventListener('mouseenter', function () { if (seen) show(true); });
    document.addEventListener('mousedown',  function () { ring.classList.add('is-down'); });
    document.addEventListener('mouseup',    function () { ring.classList.remove('is-down'); });
    function loop() {
      // dot tracks tight
      dx += (tx - dx) * 0.55;
      dy += (ty - dy) * 0.55;
      // ring lags
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      dot.style.transform  = 'translate3d(' + dx + 'px,' + dy + 'px,0) translate(-50%, -50%)';
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%, -50%)';
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    function attach(el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-link'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-link'); });
    }
    function attachText(el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-text'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-text'); });
    }
    document.querySelectorAll('a, button, .pcard, [role="button"]').forEach(attach);
    document.querySelectorAll('input, textarea, [contenteditable]').forEach(attachText);
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.matches && n.matches('a, button, .pcard, [role="button"]')) attach(n);
          n.querySelectorAll && n.querySelectorAll('a, button, .pcard, [role="button"]').forEach(attach);
          if (n.matches && n.matches('input, textarea, [contenteditable]')) attachText(n);
          n.querySelectorAll && n.querySelectorAll('input, textarea, [contenteditable]').forEach(attachText);
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  /* ---- Contact gate: email → phone reveal (with friction theater) ---- */
  document.querySelectorAll('[data-gate]').forEach(function (gate) {
    var unlocked = localStorage.getItem('gs_phone_unlocked') === '1';
    if (unlocked) gate.classList.add('is-unlocked');
    var form = gate.querySelector('.gate__form');
    var msg = gate.querySelector('.gate__msg');
    if (!form) return;

    // ensure steps container + progress bar exist
    var steps = gate.querySelector('.gate__steps');
    if (!steps) {
      steps = document.createElement('div');
      steps.className = 'gate__steps';
      form.appendChild(steps);
    }
    var prog = gate.querySelector('.gate__progress');
    if (!prog) {
      prog = document.createElement('div');
      prog.className = 'gate__progress';
      prog.innerHTML = '<i></i>';
      form.appendChild(prog);
    }

    function pushStep(text) {
      var el = document.createElement('span');
      el.className = 'step';
      el.innerHTML = '<span class="ok">[OK]</span>' + text;
      steps.appendChild(el);
      requestAnimationFrame(function () { el.classList.add('show'); });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var val = (input.value || '').trim();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!ok) {
        msg.textContent = '> invalid email \u2014 please re-enter';
        input.focus();
        return;
      }
      msg.textContent = '';
      steps.innerHTML = '';
      gate.classList.add('is-loading');
      prog.querySelector('i').style.width = '100%';
      var domain = val.split('@')[1] || '';
      var seq = [
        { t: 80,   m: '&gt; submitting handshake&hellip;' },
        { t: 420,  m: 'channel keypair generated' },
        { t: 720,  m: 'verifying ' + domain.toUpperCase() + ' SPF / MX' },
        { t: 1050, m: 'visitor signature logged \u00b7 ' + ('00000' + Math.floor(Math.random()*99999)).slice(-5) },
        { t: 1320, m: 'added to my contact registry' },
        { t: 1600, m: 'access granted \u00b7 channel open' }
      ];
      seq.forEach(function (s) { setTimeout(function () { pushStep(s.m); }, s.t); });
      setTimeout(function () {
        localStorage.setItem('gs_phone_unlocked', '1');
        localStorage.setItem('gs_visitor_email', val);
        gate.classList.remove('is-loading');
        gate.classList.add('is-unlocked');
      }, 1850);
    });
  });

  /* ---- Marquee: scroll-coupled speed, two tracks counter-direction ---- */
  var marquees = document.querySelectorAll('[data-marquee]');
  if (marquees.length) {
    var lastY = window.scrollY, lastT = performance.now();
    var velocity = 0;       // px/ms
    var offsets = [];       // current x offset per marquee
    var trackWs = [];       // width of one group (loop length)
    var dirs = [];
    marquees.forEach(function (mq, i) {
      var track = mq.querySelector('.mq__track');
      var group = mq.querySelector('.mq__group');
      // ensure enough copies to cover 3x viewport
      var copies = Math.max(6, Math.ceil((window.innerWidth * 3) / Math.max(120, group.offsetWidth)));
      for (var j = 1; j < copies; j++) track.appendChild(group.cloneNode(true));
      trackWs[i] = group.offsetWidth;
      offsets[i] = 0;
      dirs[i] = parseInt(mq.dataset.marquee, 10) || (i % 2 === 0 ? -1 : 1);
    });
    window.addEventListener('scroll', function () {
      var now = performance.now();
      var dy = window.scrollY - lastY;
      var dt = Math.max(1, now - lastT);
      velocity = velocity * 0.7 + (dy / dt) * 0.3; // smooth
      lastY = window.scrollY; lastT = now;
    }, { passive: true });
    var prev = performance.now();
    function tick(now) {
      var dt = Math.min(64, now - prev); prev = now;
      // ambient drift + |velocity|-driven boost
      var boost = Math.min(2.4, Math.abs(velocity) * 0.6);
      var base = 0.04; // px/ms
      marquees.forEach(function (mq, i) {
        var w = trackWs[i] || 1;
        var step = (base + boost) * dt * dirs[i];
        offsets[i] += step;
        // wrap
        if (offsets[i] <= -w) offsets[i] += w;
        if (offsets[i] >= 0)  offsets[i] -= w;
        mq.querySelector('.mq__track').style.transform = 'translate3d(' + offsets[i] + 'px,0,0)';
      });
      // decay scroll velocity
      velocity *= 0.92;
      requestAnimationFrame(tick);
    }
    if (!reduced) requestAnimationFrame(tick);
    else {
      // static fallback: leave tracks at base position
    }
  }
})();

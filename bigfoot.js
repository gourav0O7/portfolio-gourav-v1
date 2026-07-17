/* ============================================================
   BIG FOOTER — counter-scrolling marquees + grid
   Inject into [data-bigfoot] mount points (or replace .footer).
   ============================================================ */
(function () {
  'use strict';

  var STAR = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z" fill="currentColor"/></svg>';

  function marquee(direction, text) {
    var group = '<div class="mq__group">' +
      text.map(function (t) {
        return t === '*' ? '<span class="star">' + STAR + '</span>' : '<span>' + t + '</span>';
      }).join('') +
      '</div>';
    return '<div class="bigfoot__marquee" data-marquee="' + direction + '"><div class="mq__track">' + group + '</div></div>';
  }

  var arrowUR = '<svg viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.6"/></svg>';

  var remember = '' +
    '<section class="remember" data-screen-label="Remember"><div class="remember__shell">' +
      '<div class="remember__num">SIGNAL &middot; 04</div>' +
      '<h2 class="halftone" data-parallax="0.04">' +
        '<span class="line">DESIGN IS</span>' +
        '<span class="line accent">WHAT REMAINS.</span>' +
      '</h2>' +
      '<aside class="remember__card">' +
        '<div class="eyebrow no-tick">/ END NOTE</div>' +
        '<p>Good design fades into the task. Great design is the only thing the user remembers.</p>' +
        '<a class="pill" href="mailto:gouravsharma.ux@gmail.com">Let&rsquo;s talk ' + arrowUR + '</a>' +
      '</aside>' +
    '</div></section>';

  var html = '' +
    remember +
    '<footer class="bigfoot" data-screen-label="Footer">' +
      marquee(-1, ['DESIGNED FOR HUMANS', '*', 'GOURAV / SHARMA', '*', 'PRODUCT \u00b7 UI / UX', '*']) +
      marquee( 1, ['CASE FILES \u00b7 FIELD-TESTED', '*', 'AVAILABLE FOR WORK', '*', 'EST. 2021', '*']) +
      '<div class="bigfoot__glb" data-glb aria-hidden="true">' +
        '<model-viewer src="assets/footer-model.glb" disable-zoom interaction-prompt="none" auto-rotate-delay="0" rotation-per-second="120deg" shadow-intensity="0.25" exposure="1.05" loading="lazy" reveal="auto" style="background:transparent;"></model-viewer>' +
      '</div>' +
      '<div class="bigfoot__body">' +
        '<div class="bigfoot__top">' +
          '<div class="bigfoot__brand">' +
            '<span class="word">/ END TRANSMISSION</span>' +
            '<span class="name">Gourav Sharma<span class="accent">.</span></span>' +
          '</div>' +
          '<div class="bigfoot__office">' +
            '<span class="lbl">// Located</span>' +
            'Gurgaon, Haryana &middot; IND<br />' +
            '<a href="mailto:gouravsharma.ux@gmail.com" class="underline">gouravsharma.ux@gmail.com</a><br />' +
            '<span class="accent">\u25c6</span> open to opportunities' +
          '</div>' +
        '</div>' +

        '<div class="bigfoot__grid">' +
          '<div>' +
            '<div class="bigfoot__lbl">Move</div>' +
            '<h3 class="bigfoot__h">Got a hard product problem?</h3>' +
            '<p class="bigfoot__desc">From discovery to ship. I work end-to-end across SaaS, mobile and complex operational tools.</p>' +
            '<a class="pill" href="mailto:gouravsharma.ux@gmail.com">Start a project ' + arrowUR + '</a>' +
          '</div>' +

          '<div>' +
            '<div class="bigfoot__lbl">Join</div>' +
            '<h3 class="bigfoot__h">Currently designing at Omniful.</h3>' +
            '<p class="bigfoot__desc">Open to senior product / UX roles where systems thinking and craft can compound.</p>' +
            '<a class="pill" href="uploads/cv.pdf" download>Download r\u00e9sum\u00e9 ' + arrowUR + '</a>' +
          '</div>' +

          '<div>' +
            '<div class="bigfoot__lbl">Social</div>' +
            '<div class="sociallist">' +
              '<a href="https://www.linkedin.com/in/gourav-sharmaux/" target="_blank" rel="noopener" class="underline">LinkedIn <span class="arrow">\u2192</span></a>' +
              '<a href="mailto:gouravsharma.ux@gmail.com" class="underline">Email <span class="arrow">\u2192</span></a>' +
              '<a href="#" data-phone-gate class="underline">Phone <span class="arrow">\u2192</span></a>' +
              // '<a href="https://www.behance.net/" target="_blank" rel="noopener" class="underline">Behance <span class="arrow">→</span></a>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="bigfoot__bar">' +
          '<span class="links">' +
            '<a href="index.html" class="bigfoot__navlink">Index</a>' +
            '<a href="index.html#work" class="bigfoot__navlink">Work</a>' +
            '<a href="about.html" class="bigfoot__navlink">About</a>' +
            '<a href="blog.html" class="bigfoot__navlink">Blogs</a>' +
            '<a href="glossary.html" class="bigfoot__navlink">Glossary</a>' +
          '</span>' +
          '<span>\u00a9 2026 Gourav Sharma</span>' +
          '<span class="links">' +
            '<span>v1.2 \u00b7 <span data-clock>--:--:-- UTC</span></span>' +
          '</span>' +
        '</div>' +
      '</div>' +
    '</footer>';

  function mount() {
    // already mounted? bail.
    if (document.querySelector('.bigfoot')) return true;
    var slot = document.querySelector('[data-bigfoot]');
    if (slot) { slot.outerHTML = html; return true; }
    // fallback: replace any existing .footer
    var existing = document.querySelector('footer.footer');
    if (existing) { existing.outerHTML = html; return true; }
    return false;
  }

  // expose for explicit callers (e.g. project.js after dynamic render)
  window.__mountBigfoot = mount;

  /* ---------- Phone gate modal ----------
     The footer "Phone →" link opens a small modal that asks for an
     email. On submit we reveal the number (and mailto the address so
     there's a real reason to ask). Persists unlock for the session. */
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
        '<button class="phonegate__x" data-pg-close aria-label="Close">\u00d7</button>' +
        '<div class="phonegate__head"><span class="phonegate__pip"></span> Direct line</div>' +
        '<h3 class="phonegate__title">Drop your email to reveal my number.</h3>' +
        '<p class="phonegate__sub">No spam, no list. It just helps me know who\u2019s calling.</p>' +
        '<form class="phonegate__form" novalidate>' +
          '<input type="email" class="phonegate__input" placeholder="you@company.com" autocomplete="email" required />' +
          '<button type="submit" class="phonegate__go">Reveal <span>\u2192</span></button>' +
        '</form>' +
        '<div class="phonegate__err" hidden>Enter a valid email to continue.</div>' +
        '<div class="phonegate__reveal" hidden>' +
          '<div class="phonegate__rlbl">// access granted</div>' +
          '<div class="phonegate__numrow">' +
            '<a class="phonegate__num" href="' + PHONE_HREF + '">' + PHONE + '</a>' +
            '<button type="button" class="phonegate__copy" data-pg-copy aria-label="Copy number">' +
              '<span class="phonegate__copyicon" aria-hidden="true">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path></svg>' +
              '</span>' +
              '<span class="phonegate__copytxt">Copy</span>' +
            '</button>' +
          '</div>' +
          '<div class="phonegate__rsub">Tap to call \u00b7 or save it for later.</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    var input = wrap.querySelector('.phonegate__input');
    var form = wrap.querySelector('.phonegate__form');
    var err = wrap.querySelector('.phonegate__err');
    var reveal = wrap.querySelector('.phonegate__reveal');

    function close() { wrap.setAttribute('hidden', ''); document.documentElement.style.overflow = ''; }
    function open() {
      wrap.removeAttribute('hidden');
      document.documentElement.style.overflow = 'hidden';
      if (sessionStorage.getItem('pg-unlocked') === '1') { showNumber(); }
      else { setTimeout(function () { input.focus(); }, 60); }
    }
    function showNumber() {
      form.setAttribute('hidden', ''); err.setAttribute('hidden', '');
      reveal.removeAttribute('hidden');
    }

    wrap.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-pg-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !wrap.hasAttribute('hidden')) close();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (!ok) { err.removeAttribute('hidden'); input.focus(); return; }
      sessionStorage.setItem('pg-unlocked', '1');
      showNumber();
    });

    var copyBtn = wrap.querySelector('[data-pg-copy]');
    var copyTxt = wrap.querySelector('.phonegate__copytxt');
    var copyReset;
    copyBtn.addEventListener('click', function () {
      function flash() {
        copyBtn.classList.add('is-copied');
        copyTxt.textContent = 'Copied';
        clearTimeout(copyReset);
        copyReset = setTimeout(function () {
          copyBtn.classList.remove('is-copied');
          copyTxt.textContent = 'Copy';
        }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(PHONE).then(flash, fallbackCopy);
      } else { fallbackCopy(); }
      function fallbackCopy() {
        var ta = document.createElement('textarea');
        ta.value = PHONE; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        flash();
      }
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

  // attempt synchronous mount first — works on static pages where
  // footer.footer or [data-bigfoot] already exists above this script.
  // Falls back to DOMContentLoaded for any edge cases.
  if (!mount()) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  }

  /* ---------- Flashlight reveal on the "Remember" band ----------
     The section sits dimmed; a soft circle of light tracks the
     cursor and reveals the type underneath, like a torch beam. */
  function initFlashlight() {
    var sec = document.querySelector('.remember');
    if (!sec || sec.querySelector('.remember__spot')) return;
    // skip on touch / no-hover devices — nothing to track the beam
    if (window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var spot = document.createElement('div');
    spot.className = 'remember__spot';
    spot.setAttribute('aria-hidden', 'true');
    sec.appendChild(spot);
    sec.classList.add('has-spot');

    var raf = 0;
    sec.addEventListener('pointermove', function (e) {
      var r = sec.getBoundingClientRect();
      var mx = e.clientX - r.left, my = e.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        sec.style.setProperty('--mx', mx + 'px');
        sec.style.setProperty('--my', my + 'px');
      });
    });
    sec.addEventListener('pointerenter', function () { sec.classList.add('is-lit'); });
    sec.addEventListener('pointerleave', function () { sec.classList.remove('is-lit'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFlashlight);
  else initFlashlight();

  /* ---------- END NOTE card: ball physics (grab · throw · bounce) ---------- */
  function initDragCard() {
    var card = document.querySelector('.remember__card');
    if (!card || card.dataset.dragInit) return;
    if (window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    card.dataset.dragInit = '1';
    card.classList.add('is-draggable');

    // visible grip affordance
    var grip = document.createElement('span');
    grip.className = 'remember__grip';
    grip.setAttribute('aria-hidden', 'true');
    grip.innerHTML = '<i></i><i></i><i></i><i></i><i></i><i></i>';
    card.appendChild(grip);

    var parent = card.offsetParent || card.parentElement;

    // physics state (units: px, px/s, deg, deg/s)
    var x = 0, y = 0, vx = 0, vy = 0, rot = 0, vr = 0;
    var pinned = false, dragging = false, moved = false;
    var px = 0, py = 0, lastT = 0, pVX = 0, pVY = 0;
    var downX = 0, downY = 0, downT = 0;
    var rafId = 0, prevFrame = 0;
    var homeX = 0, homeY = 0, homeSet = false, homeTimer = 0;
    var HOME_DELAY = 1500;   // ms after release before it glides back

    var GRAV = 2800;     // gravity
    var REST = 0.68;     // wall restitution (bounciness)
    var AIR = 0.993;     // air drag per step
    var GROUNDF = 0.84;  // horizontal friction on floor contact
    var STOP_V = 24;     // settle threshold
    var clampV = function (v) { return Math.max(-3000, Math.min(3000, v)); };
    var clampR = function (v) { return Math.max(-520, Math.min(520, v)); };

    function bounds() {
      return { w: Math.max(0, parent.clientWidth - card.offsetWidth),
               h: Math.max(0, parent.clientHeight - card.offsetHeight) };
    }
    function pin() {
      if (pinned) return;
      var cr = card.getBoundingClientRect();
      var pr = parent.getBoundingClientRect();
      x = cr.left - pr.left; y = cr.top - pr.top;
      card.style.right = 'auto';
      card.style.left = x + 'px';
      card.style.top = y + 'px';
      card.style.transform = 'none';
      pinned = true;
      if (!homeSet) { homeX = x; homeY = y; homeSet = true; }
    }
    function draw() {
      card.style.left = x + 'px';
      card.style.top = y + 'px';
      card.style.transform = rot ? 'rotate(' + rot.toFixed(2) + 'deg)' : 'none';
    }
    function step(t) {
      if (!prevFrame) prevFrame = t;
      var dt = Math.min((t - prevFrame) / 1000, 0.032);
      prevFrame = t;
      var b = bounds();

      vy += GRAV * dt;
      x += vx * dt; y += vy * dt; rot += vr * dt;

      // side walls
      if (x < 0) { x = 0; vx = Math.abs(vx) * REST; vr = clampR(vr + vx * 0.08); }
      else if (x > b.w) { x = b.w; vx = -Math.abs(vx) * REST; vr = clampR(vr - vx * 0.08); }
      // ceiling
      if (y < 0) { y = 0; vy = Math.abs(vy) * REST; }
      // floor
      var onFloor = false;
      if (y > b.h) {
        y = b.h; onFloor = true;
        vy = -Math.abs(vy) * REST;
        if (Math.abs(vy) < STOP_V) vy = 0;
        vx *= GROUNDF;
        vr = clampR(vr * 0.7 + vx * 0.5 * 0.3); // roll with horizontal speed
      }
      vx *= AIR; vr *= 0.95;

      var resting = onFloor && Math.abs(vx) < STOP_V && Math.abs(vy) < 1;
      if (resting) {
        vx = 0; vy = 0; vr = 0;
        rot += (0 - rot) * 0.25;
        if (Math.abs(rot) < 0.15) rot = 0;
      }
      draw();
      if (!resting || rot !== 0) { rafId = requestAnimationFrame(step); }
      else { rafId = 0; card.classList.remove('is-ball-active'); }
    }
    function launch(ivx, ivy, ivr) {
      vx = clampV(ivx); vy = clampV(ivy); vr = clampR(ivr || 0);
      card.classList.add('is-ball-active');
      if (!rafId) { prevFrame = 0; rafId = requestAnimationFrame(step); }
    }
    function scheduleHome() {
      clearTimeout(homeTimer);
      homeTimer = setTimeout(returnHome, HOME_DELAY);
    }
    function returnHome() {
      if (!homeSet) return;
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      vx = vy = vr = 0;
      card.classList.remove('is-ball-active');
      card.classList.add('is-homing');
      x = homeX; y = homeY; rot = 0;
      draw();
      clearTimeout(homeTimer);
      homeTimer = setTimeout(function () { card.classList.remove('is-homing'); }, 820);
    }

    card.addEventListener('pointerdown', function (e) {
      if (e.target.closest('a, button')) return;   // CTA / links: do nothing
      if (e.button !== 0) return;
      pin();
      clearTimeout(homeTimer);
      card.classList.remove('is-homing');
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      dragging = true; moved = false;
      vx = vy = vr = 0; pVX = pVY = 0;
      px = downX = e.clientX; py = downY = e.clientY;
      lastT = downT = performance.now();
      card.classList.add('is-dragging', 'is-ball-active');
      card.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    card.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var now = performance.now();
      var dt = Math.max((now - lastT) / 1000, 0.001);
      var ndx = e.clientX - px, ndy = e.clientY - py;
      if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 3) moved = true;
      pVX = 0.75 * (ndx / dt) + 0.25 * pVX;   // smoothed pointer velocity
      pVY = 0.75 * (ndy / dt) + 0.25 * pVY;
      var b = bounds();
      x = Math.max(0, Math.min(x + ndx, b.w));
      y = Math.max(0, Math.min(y + ndy, b.h));
      draw();
      px = e.clientX; py = e.clientY; lastT = now;
    });
    function release(e) {
      if (!dragging) return;
      dragging = false;
      card.classList.remove('is-dragging');
      try { card.releasePointerCapture(e.pointerId); } catch (err) {}
      var dur = performance.now() - downT;
      if (moved) {
        launch(pVX, pVY, pVX * 0.05);                 // throw with flick velocity
      } else if (dur < 450) {
        launch((Math.random() * 2 - 1) * 360, -1050, (Math.random() * 2 - 1) * 260); // poke → bounce up
      } else {
        card.classList.remove('is-ball-active');
      }
      scheduleHome();   // glide back to its original spot after a beat
    }
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
    // swallow the click that follows a real drag/throw so the pill doesn't fire
    card.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);

    // keep it inside the section if the viewport resizes
    window.addEventListener('resize', function () {
      if (!pinned) return;
      var b = bounds();
      x = Math.max(0, Math.min(x, b.w));
      y = Math.max(0, Math.min(y, b.h));
      draw();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDragCard);
  else initDragCard();

  /* ---------- Traveling .glb model across the marquee band ---------- */
  function loadModelViewer() {
    if (document.querySelector('script[data-model-viewer]')) return;
    var s = document.createElement('script');
    s.type = 'module';
    s.src = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
    s.setAttribute('data-model-viewer', '1');
    document.head.appendChild(s);
  }
  function initGlb() {
    var box = document.querySelector('[data-glb]');
    if (!box || box.dataset.glbInit) return;

    // On lite / data-saver connections, never load model-viewer or the .glb —
    // the can is purely decorative (aria-hidden). Leave the slot empty.
    if (window.__lite) { box.dataset.glbInit = 'skipped'; return; }

    // Otherwise defer the heavy lib + model until the footer is near the
    // viewport, so first paint never pays for a model the user may not scroll to.
    var start = function () {
      if (box.dataset.glbInit) return;
      box.dataset.glbInit = '1';
      loadModelViewer();
      wireGlb(box);
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); start(); }
      }, { rootMargin: '600px 0px' });
      io.observe(box);
    } else {
      start();
    }
  }

  function wireGlb(box) {
    var mv = box.querySelector('model-viewer');

    // a short synthesized "crack + fizz" — like cracking open / knocking a can.
    // Reuses the shared AudioContext (the knock itself is the unlocking gesture).
    function fizz() {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        var c = window.__audioCtx || (window.__audioCtx = AC ? new AC() : null);
        if (!c) return;
        if (c.state === 'suspended') c.resume();
        var t = c.currentTime;
        // pop — a quick pitch-drop click
        var o = c.createOscillator(); o.type = 'square';
        o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.08);
        var og = c.createGain();
        og.gain.setValueAtTime(0.0001, t);
        og.gain.exponentialRampToValueAtTime(0.22, t + 0.005);
        og.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        o.connect(og); og.connect(c.destination); o.start(t); o.stop(t + 0.14);
        // fizz — decaying high-passed noise tail
        var len = Math.floor(c.sampleRate * 0.55);
        var nb = c.createBuffer(1, len, c.sampleRate);
        var d = nb.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
        var n = c.createBufferSource(); n.buffer = nb;
        var hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200;
        var ng = c.createGain(); ng.gain.value = 0.16;
        n.connect(hp); hp.connect(ng); ng.connect(c.destination);
        n.start(t + 0.02); n.stop(t + 0.57);
      } catch (e) { /* audio optional */ }
    }

    // pop a little mono sound-word off the top of the can
    var PUFFS = ['FZZT', '*POP*', 'SSST', '*CRACK*', 'GLUG', '*PSST*'];
    var puffN = 0;
    function puff() {
      var p = box.parentNode; if (!p) return;
      var el = document.createElement('span');
      el.className = 'can-puff';
      el.textContent = PUFFS[(puffN++) % PUFFS.length];
      el.style.left = box.offsetLeft + 'px';
      el.style.top  = (box.offsetTop - 6) + 'px';
      p.appendChild(el);
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1000);
    }

    // Click the can → it pops up BIG, centered over a dim backdrop.
    // Click it again (or the backdrop / Esc) → it shrinks back to the footer.
    var big = false, backdrop = null, hint = null;
    function openBig() {
      if (big) return;
      big = true;
      fizz(); puff();
      backdrop = document.createElement('div');
      backdrop.className = 'can-backdrop';
      backdrop.addEventListener('pointerdown', closeBig);
      document.body.appendChild(backdrop);
      hint = document.createElement('div');
      hint.className = 'can-hint';
      hint.textContent = '// tap to put it back';
      document.body.appendChild(hint);
      box.classList.add('is-big');
    }
    function closeBig() {
      if (!big) return;
      big = false;
      box.classList.remove('is-big');
      if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
      backdrop = hint = null;
    }
    function toggleBig(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (big) closeBig(); else openBig();
    }
    // pointer-events live on the model-viewer; the event bubbles up to the box
    box.addEventListener('pointerdown', toggleBig);
    window.addEventListener('keydown', function (e) { if (big && e.key === 'Escape') closeBig(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initGlb);
  else initGlb();
})();

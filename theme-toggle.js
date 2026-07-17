
/* ============================================================
   THEME TOGGLE — Amber ⇄ Gold
   Small bottom-center switch that recolors the whole site to a
   bright golden palette. Only colour changes (design untouched);
   the case-study product mockups (.ed-proto) keep their colours.
   Switching ON plays a cinematic golden "wipe" reveal + soft chime.
   Choice persists across pages via localStorage.
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'gs-theme';
  var root = document.documentElement;

  // Apply stored theme as early as possible (loaded in <head>) — no flash.
  var stored;
  try { stored = localStorage.getItem(KEY); } catch (e) { stored = null; }
  if (stored === 'gold') root.classList.add('gold');

  function isGold() { return root.classList.contains('gold'); }
  function persist() {
    try { localStorage.setItem(KEY, isGold() ? 'gold' : 'amber'); } catch (e) {}
  }
  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ---- soft golden shimmer chime (reuses the shared AudioContext) ---- */
  function chime(rising) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      var c = window.__audioCtx || (window.__audioCtx = new AC());
      if (c.state === 'suspended') c.resume();
      var t = c.currentTime + 0.02;
      var lp = c.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 2600;
      var master = c.createGain();
      master.gain.value = 0.18;
      lp.connect(master); master.connect(c.destination);
      // C major add9 sparkle: C5 E5 G5 D6  (or reversed when turning off)
      var hz = function (s) { return 440 * Math.pow(2, s / 12); };
      var notes = rising ? [3, 7, 10, 17] : [17, 10, 7, 3];
      notes.forEach(function (semi, i) {
        var o = c.createOscillator();
        o.type = 'triangle';
        o.frequency.value = hz(semi);
        var g = c.createGain();
        var t0 = t + i * 0.07;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
        o.connect(g); g.connect(lp);
        o.start(t0); o.stop(t0 + 1.0);
      });
    } catch (e) { /* audio is best-effort */ }
  }

  /* ---- cinematic transition: shockwave ring + radial fill + bloom ---- */
  function wipe(turningGold, cx, cy, done) {
    var R = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 40;

    var fillGrad = turningGold
      ? 'radial-gradient(circle at ' + cx + 'px ' + cy + 'px, #ffc44d, #ef9f16 55%, #d4860a)'
      : 'radial-gradient(circle at ' + cx + 'px ' + cy + 'px, #1a2030, #0a0c11 58%, #07080b)';
    var edgeColor = turningGold ? '#fff3cf' : '#ff7a4d';

    // conic shimmer that rotates behind the fill for an energetic edge
    var streaks = document.createElement('div');
    streaks.className = 'theme-wipe__streaks';
    streaks.style.background =
      'conic-gradient(from 0deg at ' + cx + 'px ' + cy + 'px, ' +
      'transparent 0deg, ' + (turningGold ? 'rgba(255,243,207,0.55)' : 'rgba(255,122,77,0.4)') + ' 18deg, ' +
      'transparent 40deg, transparent 180deg, ' +
      (turningGold ? 'rgba(255,243,207,0.4)' : 'rgba(255,122,77,0.3)') + ' 200deg, transparent 230deg, transparent 360deg)';

    // the colour fill, revealed by an expanding circle
    var fill = document.createElement('div');
    fill.className = 'theme-wipe';
    fill.style.background = fillGrad;
    fill.style.clipPath = fill.style.webkitClipPath = 'circle(0px at ' + cx + 'px ' + cy + 'px)';

    // leading shockwave ring
    var ring = document.createElement('div');
    ring.className = 'theme-wipe__ring';
    ring.style.color = edgeColor;
    ring.style.left = cx + 'px';
    ring.style.top = cy + 'px';
    var ringSize = R * 2.1;
    ring.style.width = ring.style.height = ringSize + 'px';

    // bloom flash
    var flash = document.createElement('div');
    flash.className = 'theme-wipe__flash';
    flash.style.background = turningGold
      ? 'radial-gradient(circle at ' + cx + 'px ' + cy + 'px, rgba(255,236,170,0.9), rgba(255,196,77,0.35) 45%, transparent 70%)'
      : 'radial-gradient(circle at ' + cx + 'px ' + cy + 'px, rgba(255,122,77,0.5), transparent 60%)';

    document.body.appendChild(streaks);
    document.body.appendChild(fill);
    document.body.appendChild(ring);
    document.body.appendChild(flash);

    // force reflow then kick off all the animations together
    void fill.offsetWidth;

    fill.style.transition = 'clip-path 0.66s cubic-bezier(0.66,0,0.2,1), -webkit-clip-path 0.66s cubic-bezier(0.66,0,0.2,1)';
    fill.style.clipPath = fill.style.webkitClipPath = 'circle(' + R + 'px at ' + cx + 'px ' + cy + 'px)';

    ring.style.transition = 'transform 0.6s cubic-bezier(0.3,0.7,0.2,1), opacity 0.6s ease';
    ring.style.opacity = '0.9';
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
    requestAnimationFrame(function () {
      ring.style.opacity = '0';
    });

    streaks.style.transition = 'opacity 0.5s ease, transform 0.8s ease';
    streaks.style.opacity = '1';
    streaks.style.transform = 'rotate(' + (turningGold ? 150 : -150) + 'deg)';

    // quick bloom flash near the midpoint
    flash.style.transition = 'opacity 0.16s ease';
    setTimeout(function () {
      flash.style.opacity = turningGold ? '1' : '0.7';
      setTimeout(function () {
        flash.style.transition = 'opacity 0.5s ease';
        flash.style.opacity = '0';
      }, 150);
    }, 300);

    // swap the theme right as the fill covers the screen
    var swapped = false;
    setTimeout(function () {
      if (swapped) return; swapped = true;
      done();
    }, 440);

    // fade everything away to reveal the freshly themed page
    setTimeout(function () {
      [fill, streaks].forEach(function (el) {
        el.style.transition = 'opacity 0.45s ease';
        el.style.opacity = '0';
      });
    }, 680);
    setTimeout(function () {
      [streaks, fill, ring, flash].forEach(function (el) { el.remove(); });
    }, 1200);
  }

  function build() {
    if (document.querySelector('.theme-toggle')) return;

    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('role', 'switch');
    btn.setAttribute('aria-label', 'Toggle gold theme');
    btn.innerHTML =
      '<span class="theme-toggle__label">GOLD</span>' +
      '<span class="theme-toggle__switch" aria-hidden="true"><span class="theme-toggle__knob"></span></span>';

    function sync() {
      var on = isGold();
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
    }

    var busy = false;
    btn.addEventListener('click', function () {
      if (busy) return;
      var turningGold = !isGold();

      // reduced motion (or no body yet) → switch instantly
      if (reduceMotion()) {
        root.classList.toggle('gold');
        sync(); persist();
        return;
      }

      busy = true;
      var rect = btn.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;

      chime(turningGold);
      // flip the switch knob immediately for responsive feedback
      btn.classList.toggle('is-on', turningGold);
      btn.setAttribute('aria-checked', turningGold ? 'true' : 'false');

      wipe(turningGold, cx, cy, function () {
        root.classList.toggle('gold', turningGold);
        sync();
        persist();
      });

      setTimeout(function () { busy = false; }, 1250);
    });

    sync();
    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();


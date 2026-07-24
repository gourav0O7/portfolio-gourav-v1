/* ============================================================
   Coming-soon case cards — a true-3D hourglass drawn as a dense,
   fine glyph point-cloud (0 1 # / \ .). The hourglass is a real
   surface of revolution: its profile (two curved bulbs pinched at
   a neck, with cap plates) is revolved around the vertical axis
   into a 3D ring cloud, then spun continuously with perspective +
   depth shading, so you genuinely see its front and back — not a
   flat shape faked with a few stacked layers. Sand glyphs fall down
   the central axis through the neck and spread into the lower bulb,
   rotating with the glass as one rigid object. A sparse flat field
   of the same characters radiates outward for atmosphere. No
   gradients, no glow. "Coming soon" lives in a small corner pill.
   Canvas-only. Built lazily + animates only while visible.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var GLYPHS = ['0', '1', '#', '/', '\\', '.'];

  // profile (local units): radius as a function of height y in [-HALF, +HALF]
  var HALF = 1.18, NECK_Y = 0.055, RMAX = 1.0, RNECK = 0.07;
  var CAP_START = 1.06;      // |y| beyond this is the flat end plate
  var BULB_TOP = CAP_START;  // bulb runs from the neck to the cap plate

  function radiusAt(y) {
    var ay = Math.abs(y);
    if (ay <= NECK_Y) return RNECK;                       // straight neck
    if (ay >= CAP_START) return RMAX;                     // cap plate
    var u = (ay - NECK_Y) / (BULB_TOP - NECK_Y);          // 0 at neck → 1 at cap
    return RNECK + (RMAX - RNECK) * Math.pow(u, 0.72);    // curved bulb wall
  }

  function initCard(card) {
    var soon = card.querySelector('.casecard__soon');
    if (!soon || soon.__soonInit) return;
    soon.__soonInit = true;
    card.addEventListener('click', function (e) { e.preventDefault(); });

    var canvas = document.createElement('canvas');
    canvas.className = 'casecard__sooncanvas';
    canvas.setAttribute('aria-hidden', 'true');
    soon.insertBefore(canvas, soon.firstChild);
    soon.classList.add('has-canvas');
    var ctx = canvas.getContext('2d');

    var W = 0, H = 0, scale = 60, GS = 6, F = 560;
    var shell = [], grains = [], rays = [], pile = [];
    var hovered = false, raf = 0, running = false, built = false;
    var fillLevel = 0, tFill = 0, t = 0, fieldRot = 0;
    var ay = 0, tay = 0, ax = -0.32, tax = -0.32;

    var accent = (getComputedStyle(card).getPropertyValue('--accent') || '#fa4c14').trim() || '#fa4c14';
    var accRGB = hexToRgb(accent);

    function buildShell() {
      shell = [];
      // vertical sampling step chosen so rings are ~1 glyph apart in pixels
      var yStep = Math.max(0.03, GS * 0.62 / scale);
      for (var y = -HALF; y <= HALF + 1e-6; y += yStep) {
        var r = radiusAt(y);
        var isCap = Math.abs(y) >= CAP_START;
        // points around the ring; density ∝ circumference so spacing stays even
        var circ = 2 * Math.PI * r * scale;
        var n = Math.max(3, Math.round(circ / (GS * 0.7)));
        for (var i = 0; i < n; i++) {
          var a = (i / n) * Math.PI * 2 + (y * 3.1);       // slight helical offset
          shell.push({ r: r, a: a, y: y, cap: isCap, ch: rnd(), tw: Math.random() * 6.28 });
        }
        // cap plates: also fill the disk interior so the ends read solid
        if (isCap) {
          var rings = Math.max(1, Math.round(r * scale / (GS * 0.9)));
          for (var ir = 1; ir <= rings; ir++) {
            var rr = r * (ir / (rings + 1));
            var nn = Math.max(3, Math.round(2 * Math.PI * rr * scale / (GS * 0.8)));
            for (var j = 0; j < nn; j++) {
              shell.push({ r: rr, a: (j / nn) * Math.PI * 2, y: y, cap: true, ch: rnd(), tw: Math.random() * 6.28 });
            }
          }
        }
      }
    }

    function buildGrains() {
      grains = [];
      var n = 46;
      for (var i = 0; i < n; i++) {
        grains.push(newGrain(true));
      }
    }
    function newGrain(anywhere) {
      var a = Math.random() * Math.PI * 2;
      var y = anywhere ? (-HALF * 0.5 + Math.random() * (HALF * 1.4)) : (-NECK_Y - 0.02 - Math.random() * 0.06);
      return {
        a: a,
        rr: Math.random(),                                 // 0..1 within the allowed radius
        y: y,
        speed: 0.010 + Math.random() * 0.012,
        ch: rnd()
      };
    }
    function stepGrains() {
      var mul = hovered ? 4.2 : 1.0;                        // hover: sand rushes down fast
      for (var i = 0; i < grains.length; i++) {
        var g = grains[i];
        g.y += g.speed * mul;
        if (g.y > HALF * 0.92) { grains[i] = newGrain(false); continue; }
        if (Math.random() < 0.05) g.ch = rnd();
      }
    }

    // static pile points filling the bottom bulb's interior — revealed from
    // the bottom up as fillLevel rises, so hovering visibly fills the glass
    function buildPile() {
      pile = [];
      var yStep = Math.max(0.035, GS * 0.7 / scale);
      for (var y = NECK_Y; y <= HALF * 0.92; y += yStep) {
        var maxR = radiusAt(y) * 0.82;
        var rings = Math.max(1, Math.round(maxR * scale / (GS * 0.85)));
        for (var ir = 0; ir <= rings; ir++) {
          var rr = maxR * (ir / (rings + 1));
          var nn = Math.max(3, Math.round(2 * Math.PI * rr * scale / (GS * 0.8)));
          for (var j = 0; j < nn; j++) {
            pile.push({ r: rr, a: (j / nn) * Math.PI * 2 + y * 2.6, y: y, ch: rnd(), tw: Math.random() * 6.28 });
          }
        }
      }
    }

    // sparse flat glyph field radiating outward — atmosphere, not part of the 3D object
    function buildRays() {
      rays = [];
      var iconR = Math.min(W, H) * 0.26;
      var reach = Math.hypot(W, H) * 0.6;
      var rayCount = Math.max(8, Math.round(reach / 34));
      for (var i = 0; i < rayCount; i++) {
        var angle = (i / rayCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
        var dx = Math.cos(angle), dy = Math.sin(angle);
        var steps = 4 + Math.floor(Math.random() * 5);
        var dist = iconR + 22 + Math.random() * 18;
        for (var s = 0; s < steps; s++) {
          dist += 16 + Math.random() * 18;
          if (dist > reach) break;
          var jit = (Math.random() - 0.5) * dist * 0.16;
          rays.push({
            x: dx * dist - dy * jit, y: dy * dist + dx * jit - H * 0.05,
            ch: rnd(), a: Math.max(0.03, 0.2 * (1 - dist / reach)), tw: Math.random() * 6.28
          });
        }
      }
    }

    function build() {
      var r = soon.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      GS = Math.max(5, Math.min(8, Math.round(Math.min(W, H) / 62)));  // fine glyphs
      scale = Math.min(W, H) * 0.205;                                   // hourglass size
      F = scale * 5.5;

      buildShell();
      buildGrains();
      buildPile();
      buildRays();
      built = true;
    }

    // project a local (r,a,y) or (x,y,z) point through spin + tilt + perspective
    function project(x, y, z, cosY, sinY, cosX, sinX) {
      var x1 = x * cosY + z * sinY;
      var z1 = -x * sinY + z * cosY;
      var y1 = y * cosX - z1 * sinX;
      var z2 = y * sinX + z1 * cosX;
      var s = F / (F + z2);
      return { sx: x1 * s, sy: y1 * s, s: s, z: z2 };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H / 2 - H * 0.04;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

      // ambient flat field (independent slow swirl, unaffected by the 3D spin)
      var fr = fieldRot, fc = Math.cos(fr), fs = Math.sin(fr);
      ctx.font = GS + 'px ui-monospace,Menlo,Consolas,monospace';
      for (var i = 0; i < rays.length; i++) {
        var p = rays[i];
        var rx = p.x * fc - p.y * fs, ry = p.x * fs + p.y * fc;
        var fl = 0.75 + 0.25 * Math.sin(t * 0.03 + p.tw);
        ctx.fillStyle = 'rgba(180,182,190,' + (p.a * fl).toFixed(2) + ')';
        ctx.fillText(p.ch, cx + rx, cy + ry);
      }

      var cosY = Math.cos(ay), sinY = Math.sin(ay), cosX = Math.cos(ax), sinX = Math.sin(ax);
      var pts = [];

      // hourglass shell — every ring point revolved into 3D
      for (var k = 0; k < shell.length; k++) {
        var q = shell[k];
        var lx = q.r * Math.cos(q.a) * scale;
        var lz = q.r * Math.sin(q.a) * scale;
        var ly = q.y * scale;
        var pr = project(lx, ly, lz, cosY, sinY, cosX, sinX);
        pts.push({ sx: pr.sx, sy: pr.sy, s: pr.s, z: pr.z, ch: q.ch, cap: q.cap, tw: q.tw, kind: 's' });
      }
      // sand grains — same rotation, so they fall through the real 3D neck
      for (var m = 0; m < grains.length; m++) {
        var g = grains[m];
        var maxR = radiusAt(g.y) * 0.82;
        var rr = Math.min(maxR, g.rr * maxR + (g.y > NECK_Y ? (g.y / HALF) * 0.12 : 0));
        var gx = rr * Math.cos(g.a) * scale;
        var gz = rr * Math.sin(g.a) * scale;
        var gy = g.y * scale;
        var pg = project(gx, gy, gz, cosY, sinY, cosX, sinX);
        pts.push({ sx: pg.sx, sy: pg.sy, s: pg.s, z: pg.z, ch: g.ch, kind: 'g' });
      }
      // settled sand pile — fills upward from the bottom as fillLevel rises
      if (fillLevel > 0.01) {
        var pileTop = HALF * 0.92 - fillLevel * (HALF * 0.92 - NECK_Y);
        for (var pI = 0; pI < pile.length; pI++) {
          var sgp = pile[pI];
          if (sgp.y < pileTop) continue;
          var px = sgp.r * Math.cos(sgp.a) * scale;
          var pz = sgp.r * Math.sin(sgp.a) * scale;
          var py = sgp.y * scale;
          var pp = project(px, py, pz, cosY, sinY, cosX, sinX);
          pts.push({ sx: pp.sx, sy: pp.sy, s: pp.s, z: pp.z, ch: sgp.ch, tw: sgp.tw, kind: 'p' });
        }
      }

      pts.sort(function (a, b) { return b.z - a.z; });      // far → near

      var zNear = -RMAX * scale, zFar = RMAX * scale;
      for (var n = 0; n < pts.length; n++) {
        var pt = pts[n];
        var fs2 = Math.max(4, GS * pt.s);
        ctx.font = fs2.toFixed(1) + 'px ui-monospace,Menlo,Consolas,monospace';
        if (pt.kind === 'g') {
          ctx.fillStyle = 'rgba(' + accRGB[0] + ',' + accRGB[1] + ',' + accRGB[2] + ',0.7)';
        } else if (pt.kind === 'p') {
          var pshim = 0.85 + 0.15 * Math.sin(t * 0.04 + pt.tw);
          ctx.fillStyle = 'rgba(' + accRGB[0] + ',' + accRGB[1] + ',' + accRGB[2] + ',' + (0.78 * pshim).toFixed(2) + ')';
        } else {
          // depth shade: front bright, back dim → reads as a solid volume
          var dn = (pt.z - zNear) / (zFar - zNear);          // 0 near → 1 far
          var base = 0.9 - 0.66 * dn;
          if (pt.cap) base *= 1.05;
          var shim = 0.9 + 0.1 * Math.sin(t * 0.03 + pt.tw);
          var a = Math.max(0.12, base * shim);
          ctx.fillStyle = 'rgba(214,216,222,' + a.toFixed(2) + ')';
        }
        ctx.fillText(pt.ch, cx + pt.sx, cy + pt.sy);
      }
    }

    function step() {
      t++;
      tFill = hovered ? 1 : 0;
      fillLevel += (tFill - fillLevel) * (hovered ? 0.045 : 0.03); // fills fast, drains a bit slower
      fieldRot += hovered ? 0.0008 : 0.0004;

      // continuous idle spin around Y; hover spins faster + tilts toward cursor
      tay += hovered ? 0.026 : 0.012;
      if (!hovered) tax = -0.32 + Math.sin(t * 0.012) * 0.08;
      ay += (tay - ay) * 0.1;
      ax += (tax - ax) * 0.08;

      stepGrains();
      if (t % 6 === 0) {                                    // ambient shimmer
        for (var c = 0; c < 3; c++) {
          var ri = (Math.random() * rays.length) | 0; if (rays[ri]) rays[ri].ch = rnd();
          var si = (Math.random() * shell.length) | 0; if (shell[si]) shell[si].ch = rnd();
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    }

    function ensureRunning() { if (!running && !reduce) { running = true; raf = requestAnimationFrame(step); } }

    card.addEventListener('pointerenter', function () { hovered = true; ensureRunning(); });
    card.addEventListener('pointermove', function (e) {
      var r = soon.getBoundingClientRect();
      var py = (e.clientY - r.top) / r.height;
      tax = (py - 0.5) * -0.7 - 0.2;
      hovered = true; ensureRunning();
    });
    card.addEventListener('pointerleave', function () { hovered = false; });

    function activate() {
      if (!built) build();
      if (reduce) { draw(); return; }
      ensureRunning();
    }
    var io = window.IntersectionObserver ? new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { activate(); }
        else { hovered = false; running = false; if (raf) cancelAnimationFrame(raf); }
      });
    }, { rootMargin: '160px' }) : null;
    if (io) io.observe(card); else activate();

    var ro = window.ResizeObserver ? new ResizeObserver(function () {
      built = false; build(); if (!running) draw();
    }) : null;
    if (ro) ro.observe(soon);
  }

  function rnd() { return GLYPHS[(Math.random() * GLYPHS.length) | 0]; }
  function hexToRgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return isNaN(n) ? [250, 76, 20] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function boot() { document.querySelectorAll('.casecard--soon').forEach(initCard); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();


/* ============================================================
   CASE GATE — NDA-protected case studies, the cryptic way.

   Everything below the hero (#caseGate) is ENCRYPTED on load:
     · every text node is replaced with cryptic glyphs (the same
       departure-board vocabulary as the hover scramble), with a
       slow live flicker so it reads as "live encryption";
     · every image / product screen is sealed behind an
       ACCESS REQUIRED vault tag (no blur);
     · a sticky console prompt asks for the passphrase.
   The correct passphrase runs a top-to-bottom decryption sweep
   (cryptic → real text, covers dissolve) and is remembered in
   localStorage so it stays unlocked across every case page.

   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
   ░  TO CHANGE THE PASSPHRASE (case-insensitive):            ░
   ░  it's stored as a SHA-256 hash below, not in plain text.  ░
   ░  In any browser console, run:                             ░
   ░    crypto.subtle.digest('SHA-256',                        ░
   ░      new TextEncoder().encode('your new phrase'.toLowerCase()))  ░
   ░      .then(b=>console.log([...new Uint8Array(b)]           ░
   ░      .map(x=>x.toString(16).padStart(2,'0')).join('')))    ░
   ░  then paste the result into PASSPHRASE_HASH below.         ░
   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */
(function () {
  'use strict';

  // Not stored in the clear — a SHA-256 hash of the lowercased passphrase,
  // so it can't just be read straight out of this file. (Note: on a static
  // site with no server, this is a deterrent against casual "view source"
  // lookups, not real access control — anyone willing to brute-force this
  // hash, or dig through devtools, can still get past it. There's no way
  // to fully close that on client-side-only hosting.)
  var PASSPHRASE_HASH = '0d441fb195996c906b91d297c3b3e21453bf00b0f39c1ef5e5f3beb13b82f4c9';
  var STORE_KEY  = 'gs-case-access';

  function sha256Hex(str) {
    var data = new TextEncoder().encode(str);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ('0' + b.toString(16)).slice(-2);
      }).join('');
    });
  }
  function checkPassphrase(val) {
    if (!(window.crypto && window.crypto.subtle)) return Promise.resolve(false); // requires a secure context
    return sha256Hex(val).then(function (hex) { return hex === PASSPHRASE_HASH; });
  }

  var gate = document.getElementById('caseGate');
  if (!gate) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var G = '!#$%*+-=?@/\\[]{}|~^ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  function rg() { return G[Math.floor(Math.random() * G.length)]; }
  function crypt(str) { return str.replace(/\S/g, rg); }
  function esc(c) { return c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c; }

  /* ---- inject styles ---- */
  var css = document.createElement('style');
  css.textContent =
    '.case-gatewrap.is-arming{opacity:0}' +
    '.cg-enc{opacity:.5;font-family:var(--font-mono);transition:opacity .5s var(--ease)}' +
    '.cg-dud{font-style:normal;color:var(--accent);opacity:.9}' +
    /* corner HUD chip (sticky, expands on click) */
    '.cg-hud{position:fixed;right:clamp(14px,2.4vw,28px);bottom:clamp(14px,2.4vw,26px);z-index:940;font-family:var(--font-mono)}' +
    '.cg-hud *{box-sizing:border-box}' +
    '.cg-hud__chip{position:relative;display:flex;align-items:center;gap:9px;cursor:pointer;background:linear-gradient(180deg,var(--bg-1),var(--bg));border:1px solid var(--accent);color:var(--text);padding:10px 14px;box-shadow:0 18px 44px -22px rgba(0,0,0,.9),0 0 0 1px var(--accent-soft,rgba(255,91,46,.18)),0 0 26px -6px var(--accent-glow,rgba(255,91,46,.55));transition:border-color .25s var(--ease),box-shadow .25s var(--ease),transform .25s var(--ease)}' +
    '.cg-hud__chip:hover{transform:translateY(-1px);box-shadow:0 22px 50px -22px rgba(0,0,0,.95),0 0 0 1px var(--accent),0 0 32px -4px var(--accent-glow,rgba(255,91,46,.7))}' +
    '.cg-hud__chip::after{content:"";position:absolute;inset:-1px;border:1px solid var(--accent);pointer-events:none;opacity:0;animation:cghudping 3.2s var(--ease) infinite}' +
    '@keyframes cghudping{0%{opacity:.5;transform:scale(1)}70%{opacity:0;transform:scale(1.5)}100%{opacity:0;transform:scale(1.5)}}' +
    '.cg-hud.is-open .cg-hud__chip::after,.cg-hud.is-out .cg-hud__chip::after{animation:none;opacity:0}' +
    '.cg-hud--enter{animation:cghudin .7s var(--ease)}' +
    '@keyframes cghudin{0%{opacity:0;transform:translateY(20px)}60%{transform:translateY(-4px)}100%{opacity:1;transform:translateY(0)}}' +
    '@media (prefers-reduced-motion:reduce){.cg-hud__chip::after,.cg-hud--enter{animation:none!important;opacity:0}}' +
    '.cg-hud__dot{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 10px var(--accent-glow,rgba(255,91,46,.6));animation:cghudblink 1.4s steps(1) infinite;flex:none}' +
    '@keyframes cghudblink{50%{opacity:.25}}' +
    '.cg-hud__lock{color:var(--accent);display:flex;flex:none}' +
    '.cg-hud__lock svg{width:15px;height:15px}' +
    '.cg-hud__label{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--text);white-space:nowrap}' +
    '.cg-hud__label b{color:var(--text-faint);font-weight:400}' +
    '.cg-hud__car{font-size:10px;letter-spacing:.06em;color:var(--text-faint);flex:none;transition:color .2s var(--ease)}' +
    /* expanded popover */
    '.cg-hud__pop{position:absolute;right:0;bottom:calc(100% + 10px);width:min(360px,calc(100vw - 28px));background:linear-gradient(180deg,var(--bg-1),var(--bg));border:1px solid var(--line-accent,rgba(255,91,46,.32));box-shadow:0 28px 64px -28px rgba(0,0,0,.95),inset 0 0 0 1px rgba(255,255,255,.02);overflow:hidden;transform-origin:bottom right;opacity:0;transform:translateY(8px) scale(.96);pointer-events:none;transition:opacity .26s var(--ease),transform .26s var(--ease)}' +
    '.cg-hud__pop::before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,91,46,.04) 0 1px,transparent 1px 5px);mix-blend-mode:screen}' +
    '.cg-hud.is-open .cg-hud__pop{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}' +
    '.cg-hud.is-open .cg-hud__car{color:var(--accent)}' +
    '.cg-hud__bar{display:flex;align-items:center;gap:9px;padding:10px 14px;border-bottom:1px solid var(--line);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);position:relative}' +
    '.cg-hud__bar .spacer{flex:1}.cg-hud__bar .muted{color:var(--text-faint);letter-spacing:.14em}' +
    '.cg-hud__body{padding:15px 15px 16px;position:relative}' +
    '.cg-hud__h{font-family:"Space Grotesk",system-ui,sans-serif;font-size:14.5px;font-weight:600;letter-spacing:-.01em;color:var(--text);margin-bottom:5px}' +
    '.cg-hud__sub{font-size:11.5px;line-height:1.5;color:var(--text-dim);margin-bottom:13px}' +
    '.cg-hud__form{display:flex;gap:8px}' +
    '.cg-hud__field{flex:1;display:flex;align-items:center;gap:8px;background:var(--bg);border:1px solid var(--line-2);padding:0 11px;min-width:0;transition:border-color .2s var(--ease),box-shadow .2s var(--ease)}' +
    '.cg-hud__field:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft,rgba(255,91,46,.14))}' +
    '.cg-hud__field .pre{font-size:12px;color:var(--accent);opacity:.8}' +
    '.cg-hud__input{flex:1;background:none;border:0;outline:0;color:var(--text);font-family:var(--font-mono);font-size:13px;letter-spacing:.16em;padding:11px 0;min-width:0}' +
    /* the site-wide input:focus-visible rule (styles.css) outranks the
       plain-class outline:0 above, so its own ring doubles up with the
       field's box-shadow ring below — kill it here at matching specificity */
    '.cg-hud__input:focus-visible{outline:none}' +
    '.cg-hud__input::placeholder{color:var(--text-faint);letter-spacing:.12em}' +
    '.cg-hud__btn{flex:none;background:var(--accent);color:#0a0c11;border:0;font-family:var(--font-mono);font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:0 14px;cursor:pointer;transition:filter .2s var(--ease),transform .15s var(--ease)}' +
    '.cg-hud__btn:hover{filter:brightness(1.08)}.cg-hud__btn:active{transform:translateY(1px)}' +
    '.cg-hud__err{font-size:10.5px;letter-spacing:.04em;color:var(--accent);margin-top:11px;min-height:1em;opacity:0;transition:opacity .2s var(--ease)}' +
    '.cg-hud__err.show{opacity:1}' +
    '.cg-hud.shake{animation:cghudshake .4s var(--ease)}' +
    '@keyframes cghudshake{10%,90%{transform:translateX(-2px)}30%,70%{transform:translateX(4px)}50%{transform:translateX(-5px)}}' +
    '.cg-hud.is-out{opacity:0;transform:translateY(10px) scale(.96);pointer-events:none;transition:opacity .45s var(--ease),transform .45s var(--ease)}' +
    /* vault covers over images / products */
    '.case-vault{position:relative}' +
    '.case-vault__cover{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;text-align:center;padding:18px;background:linear-gradient(180deg,rgba(10,12,17,.94),rgba(10,12,17,.97));border:1px solid var(--line-2);transition:opacity .55s var(--ease)}' +
    '.case-vault__cover::before{content:"";position:absolute;inset:9px;border:1px dashed var(--line-accent,rgba(255,91,46,.32));pointer-events:none}' +
    '.case-vault__cover svg{color:var(--accent)}' +
    '.case-vault__tag{font-family:var(--font-mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--text)}' +
    '.case-vault__sub{font-family:var(--font-mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-faint)}' +
    '.case-vault.unsealed .case-vault__cover{opacity:0;pointer-events:none}';
  document.head.appendChild(css);

  var LOCK = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="10.5" width="16" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="15" r="1.4" fill="currentColor"/></svg>';
  var LOCK_SM = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="10.5" width="16" height="10" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3" stroke="currentColor" stroke-width="1.6"/></svg>';

  /* ---- frame-based scramble that resolves a span to its real text ---- */
  function Scr(el) { this.el = el; this.req = 0; this.update = this.update.bind(this); }
  Scr.prototype.to = function (real, done) {
    var len = real.length; this.q = [];
    for (var i = 0; i < len; i++) {
      var s = Math.floor(Math.random() * 14);
      this.q.push({ to: real[i], start: s, end: s + 10 + Math.floor(Math.random() * 22), c: '' });
    }
    cancelAnimationFrame(this.req); this.frame = 0; this.done = done; this.update();
  };
  Scr.prototype.update = function () {
    var out = '', ok = 0;
    for (var i = 0; i < this.q.length; i++) {
      var q = this.q[i];
      if (this.frame >= q.end) { ok++; out += esc(q.to); }
      else if (this.frame >= q.start) {
        if (!q.c || Math.random() < 0.3) q.c = rg();
        out += '<i class="cg-dud">' + esc(q.c) + '</i>';
      } else { out += esc(rg()); }
    }
    this.el.innerHTML = out;
    if (ok < this.q.length) { this.req = requestAnimationFrame(this.update); this.frame++; }
    else { this.el.textContent = this.toReal; if (this.done) this.done(); }
  };

  /* ---- collect & encrypt every meaningful text node ----
     Takes an optional root (defaults to the whole gate) so late-inserted
     subtrees can be swept individually — see the MutationObserver in arm().
     Also rejects anything already inside a .cg-enc span: without that guard,
     the observer would see encryptText()'s own span insertion as new
     content and try to re-encrypt the already-scrambled placeholder text,
     looping forever. */
  function collect(root) {
    var out = [];
    var w = document.createTreeWalker(root || gate, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode; if (!p || !p.closest) return NodeFilter.FILTER_REJECT;
        var tag = p.tagName ? p.tagName.toUpperCase() : '';
        if (tag === 'SCRIPT' || tag === 'STYLE') return NodeFilter.FILTER_REJECT;
        if (p.closest('svg') || p.closest('image-slot') ||
            p.closest('.case-gate-panel') || p.closest('.case-vault__cover') ||
            p.closest('.cg-enc') || p.closest('.cg-hud')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n; while ((n = w.nextNode())) out.push(n);
    return out;
  }

  var items = [];   // { el(span), real, locked, cur, vis }
  // Item lookup lives in a WeakMap, not on the element itself — a plain
  // span.__cg property would let anyone read the real text straight out of
  // devtools with one line (`el.__cg.real`) without ever touching the
  // passphrase. This isn't unbreakable (nothing client-side is), but it's
  // no longer a one-line console trick.
  var itemOf = new WeakMap();
  // only animate text that's on (or near) screen — keeps long case pages smooth
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { var it = itemOf.get(e.target); if (it) it.vis = e.isIntersecting; });
  }, { rootMargin: '140px 0px' }) : null;

  function encryptText(root) {
    collect(root).forEach(function (tn) {
      var real = tn.nodeValue;
      var span = document.createElement('span');
      span.className = 'cg-enc';
      span.textContent = crypt(real);
      tn.parentNode.replaceChild(span, tn);
      var it = { el: span, real: real, locked: true, cur: crypt(real).split(''), vis: true };
      itemOf.set(span, it);
      items.push(it);
      if (io) io.observe(span);
    });
  }

  /* ---- seal every image / product behind an ACCESS REQUIRED tag ---- */
  var vaults = [];
  function sealVisuals(root) {
    var scope = root || gate;
    var nodes = [];
    scope.querySelectorAll('image-slot').forEach(function (n) { nodes.push(n); });
    scope.querySelectorAll('.p-screens__group').forEach(function (n) { nodes.push(n); });
    // the root itself can BE one of these (not just contain them) when a
    // whole subtree gets inserted after the initial sweep
    if (scope.matches && (scope.matches('image-slot') || scope.matches('.p-screens__group'))) nodes.push(scope);
    nodes.forEach(function (node) {
      if (node.closest('.case-vault')) return;          // already inside one
      var w = document.createElement('div');
      w.className = 'case-vault';
      node.parentNode.insertBefore(w, node);
      w.appendChild(node);
      var cover = document.createElement('div');
      cover.className = 'case-vault__cover';
      cover.innerHTML = LOCK_SM +
        '<span class="case-vault__tag">Access Required</span>' +
        '<span class="case-vault__sub">Encrypted &middot; NDA</span>';
      w.appendChild(cover);
      vaults.push(w);
    });
  }

  /* ---- the corner HUD chip ---- */
  function buildHud() {
    var hud = document.createElement('div');
    hud.className = 'cg-hud';
    hud.innerHTML =
      '<div class="cg-hud__pop">' +
        '<div class="cg-hud__bar"><span class="cg-hud__dot"></span>Encrypted Case File<span class="spacer"></span><span class="muted">AES // NDA</span></div>' +
        '<div class="cg-hud__body">' +
          '<div class="cg-hud__h">This case study is under NDA.</div>' +
          '<p class="cg-hud__sub">The work below is encrypted. Enter the passphrase to decrypt &mdash; it&rsquo;s included in my CV &amp; outreach emails.</p>' +
          '<form class="cg-hud__form" autocomplete="off">' +
            '<label class="cg-hud__field"><span class="pre">&gt;</span>' +
            '<input class="cg-hud__input" type="password" name="cg-pass" placeholder="PASSPHRASE" aria-label="Passphrase" autocomplete="off" spellcheck="false" /></label>' +
            '<button class="cg-hud__btn" type="submit">Decrypt</button>' +
          '</form>' +
          '<div class="cg-hud__err" role="alert"></div>' +
        '</div>' +
      '</div>' +
      '<button class="cg-hud__chip" type="button" aria-expanded="false" aria-label="Locked — enter passphrase to decrypt">' +
        '<span class="cg-hud__dot"></span>' +
        '<span class="cg-hud__lock">' + LOCK_SM + '</span>' +
        '<span class="cg-hud__label">Locked <b>// NDA</b> &middot; Enter Password</span>' +
        '<span class="cg-hud__car">[ + ]</span>' +
      '</button>';
    document.body.appendChild(hud);

    // one-time attention entrance (skipped under reduced motion)
    if (!reduce) { hud.classList.add('cg-hud--enter'); setTimeout(function () { hud.classList.remove('cg-hud--enter'); }, 800); }

    var chip  = hud.querySelector('.cg-hud__chip');
    var form  = hud.querySelector('.cg-hud__form');
    var input = hud.querySelector('.cg-hud__input');
    var err   = hud.querySelector('.cg-hud__err');
    var car   = hud.querySelector('.cg-hud__car');

    function open()  { hud.classList.add('is-open'); chip.setAttribute('aria-expanded', 'true'); if (car) car.textContent = '[ − ]'; setTimeout(function () { input.focus(); }, 130); }
    function close() { hud.classList.remove('is-open'); chip.setAttribute('aria-expanded', 'false'); if (car) car.textContent = '[ + ]'; }
    chip.addEventListener('click', function () { hud.classList.contains('is-open') ? close() : open(); });
    // click anywhere outside, or Esc, closes the popover
    document.addEventListener('pointerdown', function (e) { if (hud.classList.contains('is-open') && !hud.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = (input.value || '').trim().toLowerCase();
      checkPassphrase(val).then(function (ok) {
        if (ok) {
          try { localStorage.setItem(STORE_KEY, '1'); } catch (_) {}
          unlock(hud);
        } else {
          err.textContent = '✗ ACCESS DENIED — incorrect passphrase';
          err.classList.add('show');
          hud.classList.remove('shake'); void hud.offsetWidth; hud.classList.add('shake');
          input.value = ''; input.focus();
        }
      });
    });
    return hud;
  }

  /* ---- continuous live encryption while locked (budgeted) ---- */
  var flickerTimer = 0;
  function startFlicker() {
    if (reduce) return;
    var cursor = 0;        // round-robin position through items
    var BUDGET = 4;        // max text nodes mutated per tick — bounds the cost
    flickerTimer = setInterval(function () {
      if (document.hidden) return;
      var n = items.length;
      if (!n) return;
      var done = 0, scanned = 0;
      while (done < BUDGET && scanned < n) {
        var it = items[cursor];
        cursor = (cursor + 1) % n;
        scanned++;
        if (!it.locked || (io && !it.vis)) continue;
        var real = it.real, cur = it.cur;
        if (!cur || cur.length !== real.length) { cur = crypt(real).split(''); it.cur = cur; }
        for (var i = 0; i < real.length; i++) {
          var ch = real[i];
          if (ch === ' ' || ch === '\n' || ch === '\t' || ch === ' ') { cur[i] = ch; continue; }
          if (Math.random() < 0.28) cur[i] = rg();
        }
        it.el.textContent = cur.join('');
        done++;
      }
    }, 130);
  }

  /* ---- decryption sweep ---- */
  function unlock(hud) {
    sessionUnlocked = true;
    clearInterval(flickerTimer);
    if (hud) {
      hud.classList.remove('is-open');
      hud.classList.add('is-out');
      setTimeout(function () { if (hud.parentNode) hud.parentNode.removeChild(hud); }, 500);
    }
    // dissolve the asset covers, staggered
    vaults.forEach(function (v, i) {
      setTimeout(function () { v.classList.add('unsealed'); }, 120 + i * 90);
    });
    // resolve text top-to-bottom
    items.forEach(function (it, i) {
      it.locked = false;
      if (reduce) { it.el.textContent = it.real; it.el.classList.remove('cg-enc'); return; }
      var delay = Math.min(i * 9, 2600);
      setTimeout(function () {
        it.el.classList.remove('cg-enc');
        var s = new Scr(it.el); s.toReal = it.real; s.to(it.real);
      }, delay);
    });
  }

  /* ---- already unlocked? show in the clear ---- */
  var unlocked = false;
  try { unlocked = localStorage.getItem(STORE_KEY) === '1'; } catch (_) {}
  var sessionUnlocked = unlocked;   // flips true the moment unlock() runs, same session

  function arm() {
    if (unlocked) { gate.classList.remove('is-arming'); return; }
    try {
      buildHud();
      encryptText();
      sealVisuals();
      startFlicker();
      // The initial sweep above only sees what's in the gate at this exact
      // moment. Content can still be inserted afterward — e.g. the omniful-ds
      // page moves its entire live component library into the gate via a
      // script that runs later. Without watching for that, anything added
      // after this point renders in the clear, bypassing the lock entirely.
      // collect()'s .cg-enc rejection keeps this from re-encrypting its own
      // output and looping.
      var mo = new MutationObserver(function (records) {
        if (sessionUnlocked) { mo.disconnect(); return; }
        records.forEach(function (rec) {
          rec.addedNodes.forEach(function (node) {
            if (node.nodeType !== 1) return; // elements only
            if (node.classList && (node.classList.contains('cg-hud') ||
                node.classList.contains('cg-enc') || node.classList.contains('case-vault'))) return;
            encryptText(node);
            sealVisuals(node);
          });
        });
      });
      mo.observe(gate, { childList: true, subtree: true });
    } catch (e) { /* fail open rather than trap the page */ }
    gate.classList.remove('is-arming');
  }

  // run after layout settles so vault covers size correctly
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm);
  else arm();
  // failsafe: never leave the region hidden
  setTimeout(function () { gate.classList.remove('is-arming'); }, 2500);
})();

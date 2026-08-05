
/* ============================================================
   SOUND MANAGER  (site-wide)
   One mute switch that silences EVERYTHING: hero hover audio,
   click blips, theme chime, loader sweep, easter-egg riff,
   hero reel video, mini-game SFX — on every page.

   How: patch the audio APIs at the source so no individual
   script has to cooperate —
     • AudioContext / webkitAudioContext  → suspended while muted
     • HTMLMediaElement.play()            → no-ops while muted
   State lives in localStorage('soundMuted') so it persists and
   is shared across every page. Renders the bottom-left toggle.
   Load EARLY (before other audio scripts) in <head>.
   ============================================================ */
(function () {
  'use strict';

  function isMuted() { return localStorage.getItem('soundMuted') === '1'; }
  window.__soundMuted = isMuted();

  var ctxs = [];

  /* ---- 1. Web Audio: register + suspend every AudioContext ---- */
  var Native = window.AudioContext || window.webkitAudioContext;
  if (Native) {
    var Patched = function () {
      var c = new Native();
      ctxs.push(c);
      if (isMuted()) { try { c.suspend(); } catch (e) {} }
      // Every other audio script (piano, click-sfx, easter-egg, bigfoot,
      // theme-toggle, drive-game, loader) unlocks its OWN context on the
      // first user gesture by calling c.resume() unconditionally — none of
      // them check the mute state first. Muting, then merely clicking
      // anywhere or hovering a piano key, silently resumed the context and
      // un-muted the whole site. Patch resume() itself (same trick as
      // HTMLMediaElement.play() below) so it's a no-op while muted — every
      // script's own resume() call now automatically respects the toggle
      // without any of them needing to check it themselves.
      var nativeResume = c.resume.bind(c);
      c.resume = function () {
        if (isMuted()) return Promise.resolve();
        return nativeResume();
      };
      return c;
    };
    Patched.prototype = Native.prototype;
    try {
      window.AudioContext = Patched;
      window.webkitAudioContext = Patched;
    } catch (e) {}
  }

  /* ---- 2. HTMLMediaElement: block play() while muted ---- */
  if (window.HTMLMediaElement) {
    var nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (isMuted()) {
        try { this.muted = true; this.pause(); } catch (e) {}
        return Promise.resolve();
      }
      return nativePlay.apply(this, arguments);
    };
  }

  /* ---- apply current state to everything already running ---- */
  function applyAudioState() {
    var muted = isMuted();
    window.__soundMuted = muted;
    // web-audio contexts
    ctxs.forEach(function (c) {
      try { muted ? c.suspend() : c.resume(); } catch (e) {}
    });
    if (window.__audioCtx && ctxs.indexOf(window.__audioCtx) === -1) {
      ctxs.push(window.__audioCtx);
      try { muted ? window.__audioCtx.suspend() : window.__audioCtx.resume(); } catch (e) {}
    }
    // media elements
    var media = document.querySelectorAll('audio, video');
    for (var i = 0; i < media.length; i++) {
      try {
        media[i].muted = muted;
        if (muted) media[i].pause();
      } catch (e) {}
    }
    // hero hover audio helper
    if (muted && typeof window.__stopHeroSound === 'function') window.__stopHeroSound();
  }
  window.__applySoundState = applyAudioState;

  /* ---- 3. the toggle button (rendered on every page) ---- */
  var SPK = '<svg viewBox="0 0 24 24" fill="none"><path class="si-spk" d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path class="si-on" d="M16.5 8.5a5 5 0 0 1 0 7M18.8 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path class="si-off" d="m17 10 4 4M21 10l-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

  var CSS =
    '#soundToggle{position:fixed;left:22px;bottom:22px;z-index:99998;display:inline-flex;align-items:center;gap:9px;' +
    'padding:9px 14px 9px 11px;font:600 11px/1 "IBM Plex Mono","JetBrains Mono","Courier New",monospace;letter-spacing:.16em;' +
    'color:#e9eaf0;background:rgba(16,17,24,.62);border:1px solid rgba(255,255,255,.16);border-radius:999px;' +
    'backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);cursor:pointer;-webkit-tap-highlight-color:transparent;' +
    'transition:color .18s ease,border-color .18s ease,background .18s ease,transform .12s ease;}' +
    '#soundToggle:hover{border-color:rgba(255,255,255,.4);background:rgba(16,17,24,.8);}' +
    '#soundToggle:active{transform:scale(.96);}' +
    '#soundToggle .soundToggle__ico{display:inline-flex;}' +
    '#soundToggle .soundToggle__ico svg{width:18px;height:18px;display:block;}' +
    '#soundToggle .si-off{display:none;}' +
    '#soundToggle[aria-pressed="true"]{color:#8f93a3;}' +
    '#soundToggle[aria-pressed="true"] .si-on{display:none;}' +
    '#soundToggle[aria-pressed="true"] .si-off{display:inline;}' +
    '@media (max-width:600px){#soundToggle{left:14px;bottom:14px;}#soundToggle .soundToggle__lbl{display:none;}}';

  function mount() {
    if (document.getElementById('soundToggle')) return;
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.id = 'soundToggle';
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.title = 'Toggle sound';
    btn.innerHTML = '<span class="soundToggle__ico" aria-hidden="true">' + SPK + '</span><span class="soundToggle__lbl">SOUND</span>';
    document.body.appendChild(btn);

    function refresh() {
      var muted = isMuted();
      btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      btn.querySelector('.soundToggle__lbl').textContent = muted ? 'MUTED' : 'SOUND';
    }
    btn.addEventListener('click', function () {
      localStorage.setItem('soundMuted', isMuted() ? '0' : '1');
      refresh();
      applyAudioState();
    });
    // reflect changes made on other tabs/pages
    window.addEventListener('storage', function (e) {
      if (e.key === 'soundMuted') { refresh(); applyAudioState(); }
    });
    refresh();
    applyAudioState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();


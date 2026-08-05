
/* ============================================================
   PROJECT SCREENS, Bulk OTP Verification (Omniful)
   The case-study "Product" section. Filmstrip frames are real
   screenshots of the working prototype (prototype-bulk-otp.html)
   captured from its seed states, so the screens and the live
   build are the SAME thing. The CTA opens that prototype in a
   modal, fully usable.
   Sets window.PROJECT_SCREENS = { driver, live, tag }.
   ============================================================ */
(function () {
  'use strict';
  if (window.PROJECT_KEY !== 'bulk-otp') return;

  var PROTO = 'prototype-bulk-otp.html';

  var css = [
'.otp { --ot-accent:#5468FA; font-family:"Poppins", system-ui, sans-serif; }',

'.otp-capbar { font-family:var(--font-mono); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-faint); display:flex; justify-content:space-between; align-items:baseline; gap:18px; padding-bottom:14px; border-bottom:1px solid var(--line); margin-bottom:24px; flex-wrap:wrap; }',
'.otp-capbar b { color:var(--accent); font-weight:600; }',

/* ---- screenshot filmstrip ---- */
'.otp-strip { display:flex; gap:30px; overflow-x:auto; overflow-y:hidden; padding:8px clamp(20px,4vw,46px) 30px; scroll-snap-type:x proximity; scroll-padding-left:clamp(20px,4vw,46px); -webkit-overflow-scrolling:touch; scrollbar-width:thin; scrollbar-color:rgba(84,104,250,0.5) rgba(18,18,24,0.06); }',
'.otp-strip::-webkit-scrollbar { height:10px; }',
'.otp-strip::-webkit-scrollbar-thumb { background:rgba(84,104,250,0.45); border-radius:99px; }',
'.otp-strip::-webkit-scrollbar-thumb:hover { background:rgba(84,104,250,0.7); }',
'.otp-strip::-webkit-scrollbar-track { background:rgba(18,18,24,0.05); border-radius:99px; }',
'.otp-frame { scroll-snap-align:center; flex:0 0 auto; display:flex; flex-direction:column; align-items:center; gap:18px; }',
/* ---- CSS iPhone mockup ---- */
'.otp-phone { --pw:270px; --ph:587px; --pscale:0.75; position:relative; width:calc(var(--pw) + 24px); height:calc(var(--ph) + 24px); border-radius:54px; padding:12px; background:linear-gradient(145deg,#34363f,#16171c 62%); box-shadow:inset 0 0 0 2px rgba(255,255,255,0.06), inset 0 1px 2px rgba(255,255,255,0.18), 0 30px 60px -22px rgba(0,0,0,0.7), 0 10px 26px rgba(0,0,0,0.34); }',
'.otp-phone__screen { position:relative; width:var(--pw); height:var(--ph); border-radius:42px; overflow:hidden; background:#0d0e14; }',
'.otp-phone__screen iframe { width:360px; height:782px; border:0; display:block; transform:scale(var(--pscale)); transform-origin:top left; background:transparent; }',
'.otp-phone__island { position:absolute; top:9px; left:50%; transform:translateX(-50%); width:76px; height:21px; background:#000; border-radius:99px; z-index:4; box-shadow:inset 0 0 0 1px rgba(255,255,255,0.05); }',
'.otp-phone__island::after { content:""; position:absolute; right:10px; top:50%; transform:translateY(-50%); width:7px; height:7px; border-radius:50%; background:#0a0a10; box-shadow:inset 0 0 0 1px rgba(90,110,255,0.25); }',
'.otp-phone__btn { position:absolute; background:linear-gradient(#2b2d35,#16171c); border-radius:3px; }',
'.otp-phone__btn--silent { left:-2px; top:96px; width:3px; height:26px; }',
'.otp-phone__btn--vup { left:-2px; top:140px; width:3px; height:46px; }',
'.otp-phone__btn--vdn { left:-2px; top:198px; width:3px; height:46px; }',
'.otp-phone__btn--pwr { right:-2px; top:166px; width:3px; height:66px; }',
'.otp-frame__cap { display:flex; align-items:center; gap:9px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.03em; color:var(--text-dim); }',
'.otp-frame__cap .n { color:var(--accent); font-weight:600; }',
'.otp-frame__cap b { color:var(--text); font-weight:600; }',
'.otp-acts { display:flex; flex-direction:column; }',
'.otp-act { padding-top:34px; }',
'.otp-act:first-child { padding-top:0; }',
'.otp-act__head { display:flex; align-items:baseline; gap:12px; padding:0 clamp(20px,4vw,46px) 16px; flex-wrap:wrap; }',
'.otp-act__no { font-family:var(--font-mono); font-size:12px; font-weight:600; color:var(--accent); }',
'.otp-act__title { font-size:18px; font-weight:600; letter-spacing:-0.01em; color:var(--text); }',
'.otp-act__desc { font-family:var(--font-mono); font-size:11px; letter-spacing:0.04em; text-transform:uppercase; color:var(--text-faint); margin-left:auto; }',
'@media (max-width:560px){ .otp-phone { --pw:230px; --ph:500px; --pscale:0.6389; } }',

/* ---- live CTA panel (on-theme: hairline editorial, accent CTA) ---- */
'.otp-live { margin-top:18px; border:1px solid var(--line); background:var(--bg-1); position:relative; }',
'.otp-live::before { content:""; position:absolute; top:12px; left:12px; width:15px; height:15px; border:1px solid var(--line-accent); border-right:0; border-bottom:0; pointer-events:none; }',
'.otp-live::after { content:""; position:absolute; bottom:12px; right:12px; width:15px; height:15px; border:1px solid var(--line-accent); border-left:0; border-top:0; pointer-events:none; }',
'.otp-live__in { padding:clamp(22px,3vw,30px) clamp(24px,4vw,40px); display:flex; align-items:center; gap:24px; flex-wrap:wrap; }',
'.otp-live__lede { color:var(--text-dim); font-size:14.5px; line-height:1.6; margin:0; flex:1 1 320px; max-width:62ch; }',
'.otp-live__btn { margin:0; flex:0 0 auto; }',
'.otp-live__eyebrow { flex:0 0 auto; }',
'.otp-live__eyebrow { font-family:var(--font-mono); font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:var(--accent); display:inline-flex; align-items:center; gap:10px; }',
'.otp-live__eyebrow::before { content:""; width:24px; height:1px; background:linear-gradient(90deg,transparent,var(--accent)); }',

/* ---- live prototype modal ---- */
'.otp-modal { position:fixed; inset:0; z-index:100050; display:none; align-items:center; justify-content:center; padding:max(18px,3vh) 16px; }',
'.otp-modal.is-open { display:flex; }',
'.otp-modal__scrim { position:absolute; inset:0; background:rgba(8,9,14,0.66); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); animation:otpModalFade .2s ease; }',
'.otp-modal__panel { position:relative; z-index:1; width:min(440px,92vw); height:min(880px,92vh); display:flex; flex-direction:column; background:#0f1016; border:1px solid rgba(255,255,255,0.1); border-radius:20px; overflow:hidden; animation:otpModalPop .26s cubic-bezier(.16,1,.3,1); }',
'.otp-modal__bar { flex:0 0 auto; display:flex; align-items:center; gap:12px; padding:11px 12px 11px 16px; border-bottom:1px solid rgba(255,255,255,0.08); flex-wrap:wrap; }',
'.otp-modal__title { display:flex; align-items:center; gap:9px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.72); flex:0 0 auto; }',
'.otp-modal__net { display:flex; align-items:center; gap:2px; margin:0 auto; padding:3px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:9px; }',
'.otp-modal__net button { font-family:var(--font-mono); font-size:11px; letter-spacing:0.03em; color:rgba(255,255,255,0.62); background:transparent; border:0; padding:5px 11px; border-radius:6px; cursor:pointer; transition:background .14s ease, color .14s ease; }',
'.otp-modal__net button:hover { color:#fff; }',
'.otp-modal__net button.is-on { background:#5468FA; color:#fff; }',
'.otp-modal__demo { font-family:var(--font-mono); font-size:11px; letter-spacing:0.04em; color:rgba(255,255,255,0.5); }',
'.otp-modal__demo b { color:rgba(255,255,255,0.92); font-weight:600; letter-spacing:0.16em; }',
'.otp-modal__title .led { width:7px; height:7px; border-radius:50%; background:#46d39a; box-shadow:0 0 0 0 rgba(70,211,154,0.5); animation:otpLed 1.8s ease-out infinite; }',
'@keyframes otpLed { 0%{ box-shadow:0 0 0 0 rgba(70,211,154,0.5);} 70%{ box-shadow:0 0 0 6px rgba(70,211,154,0);} 100%{ box-shadow:0 0 0 0 rgba(70,211,154,0);} }',
'.otp-modal__actions { display:flex; align-items:center; gap:8px; flex:0 0 auto; }',
'.otp-modal__reset { font-family:var(--font-mono); font-size:11px; letter-spacing:0.04em; text-transform:uppercase; color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); padding:7px 12px; border-radius:8px; transition:background .14s ease, color .14s ease; }',
'.otp-modal__reset:hover { background:rgba(255,255,255,0.12); color:#fff; }',
'.otp-modal__close { width:34px; height:34px; display:grid; place-items:center; color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:8px; transition:background .14s ease, color .14s ease; }',
'.otp-modal__close:hover { background:rgba(255,255,255,0.12); color:#fff; }',
'.otp-modal__stage { flex:1 1 auto; position:relative; background:#0d0e14; }',
'.otp-modal__frame { position:absolute; inset:0; width:100%; height:100%; border:0; display:block; }',
'@keyframes otpModalFade { from{ opacity:0; } }',
'@keyframes otpModalPop { from{ transform:scale(.96) translateY(10px); opacity:0; } }',
'.otp-modal, .otp-modal * { cursor:auto !important; }',
'.otp-modal__reset, .otp-modal__close { cursor:pointer !important; }',
'html.otp-modal-open { overflow:hidden; }',
'html.otp-modal-open .cursor-dot, html.otp-modal-open .cursor-ring { opacity:0 !important; }',
''
].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  function frame(n, seed, label, sub) {
    return '<figure class="otp-frame">' +
      '<div class="otp-phone">' +
        '<span class="otp-phone__btn otp-phone__btn--silent"></span>' +
        '<span class="otp-phone__btn otp-phone__btn--vup"></span>' +
        '<span class="otp-phone__btn otp-phone__btn--vdn"></span>' +
        '<span class="otp-phone__btn otp-phone__btn--pwr"></span>' +
        '<div class="otp-phone__screen">' +
          '<span class="otp-phone__island"></span>' +
          '<iframe loading="lazy" scrolling="no" title="Bulk OTP, ' + label + '" src="' + PROTO + '?seed=' + seed + '&static=1&bare=1"></iframe>' +
        '</div>' +
      '</div>' +
      '<figcaption class="otp-frame__cap"><span class="n">' + n + '</span><b>' + label + '</b> \u00b7 ' + sub + '</figcaption>' +
    '</figure>';
  }

  function frameSrc(n, src, label, sub) {
    return '<figure class="otp-frame">' +
      '<div class="otp-phone">' +
        '<span class="otp-phone__btn otp-phone__btn--silent"></span>' +
        '<span class="otp-phone__btn otp-phone__btn--vup"></span>' +
        '<span class="otp-phone__btn otp-phone__btn--vdn"></span>' +
        '<span class="otp-phone__btn otp-phone__btn--pwr"></span>' +
        '<div class="otp-phone__screen">' +
          '<span class="otp-phone__island"></span>' +
          '<iframe loading="lazy" scrolling="no" title="Delivery, ' + label + '" src="' + src + '"></iframe>' +
        '</div>' +
      '</div>' +
      '<figcaption class="otp-frame__cap"><span class="n">' + n + '</span><b>' + label + '</b> \u00b7 ' + sub + '</figcaption>' +
    '</figure>';
  }

  function act(no, title, desc, frames){
    return '<section class="otp-act"><div class="otp-act__head">' +
      '<span class="otp-act__no">'+no+'</span>' +
      '<span class="otp-act__title">'+title+'</span>' +
      '<span class="otp-act__desc">'+desc+'</span></div>' +
      '<div class="otp-strip">'+frames+'</div></section>';
  }

  var driverHTML =
    '<div class="otp">' +
      '<div class="otp-capbar"><span><b>// Bulk OTP</b>, multi-package delivery</span>' +
        '<span>18 screens \u00b7 5 flows</span></div>' +
      '<div class="otp-acts">' +
        act('00', 'At the door', 'the redesigned multi-package moment',
          frameSrc('01', 'otp-live/state-1-scan.html', 'Scan & verify', 'all parcels for one stop') +
          frameSrc('02', 'otp-live/state-2-otp.html',  'One code',      'single OTP for the set')) +
        act('01', 'The happy path', 'pick the set, one code clears it',
          frame('03', '',         'The stop',      'every parcel, one customer') +
          frame('04', 'select',   'Pick the set',  'keep one back if you need') +
          frame('05', 'otp',      'One code',      'a single OTP for the set') +
          frame('06', 'typed',    'Code entered',  'ready to verify') +
          frame('07', 'success',  'Verified',      'three parcels, one moment') +
          frame('08', 'done',     'All cleared',   'per-parcel status')) +
        act('02', 'When the code fights back', 'wrong, locked, expired, all handled in place',
          frame('09', 'error',    'Wrong code',    'attempts counted down') +
          frame('10', 'locked',   'Locked',        'cool-down, not a dead end') +
          frame('11', 'expired',  'Expired',       'resend without starting over')) +
        act('03', 'Connectivity', 'doorsteps have dead zones',
          frame('12', 'slow',     'Slow start',    'skeleton, not a spinner') +
          frame('13', 'sending',  'Sending\u2026',     'code on a weak signal') +
          frame('14', 'sendfail', 'Send failed',   'retry in place') +
          frame('15', 'offline',  'Offline',       'state is explicit')) +
        act('04', 'Edge cases', 'partial handovers and awkward data',
          frame('16', 'verified', 'Partial set',   'some now, the rest later') +
          frame('17', 'longname', 'Long everything','names and addresses stretch') +
          frame('18', 'empty',    'Nothing left',  'the empty stop')) +
      '</div>' +
    '</div>';

  var arrow = '<svg class="arrow" width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.6"/></svg>';
  var liveHTML =
    '<div class="otp-live reveal">' +
      '<div class="otp-live__in">' +
        '<span class="otp-live__eyebrow">Prototype</span>' +
        '<p class="otp-live__lede">Step through the full flow yourself \u2014 every network state, error and edge case above.</p>' +
        '<button type="button" class="btn btn--primary otp-live__btn" data-open-otp>Open prototype ' + arrow + '</button>' +
      '</div>' +
    '</div>';

  window.PROJECT_SCREENS = { driver: driverHTML, live: liveHTML, tag: '18 screens' };

  /* ---- live prototype modal ---- */
  var closeIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var modal = null;

  function buildModal() {
    var m = document.createElement('div');
    m.className = 'otp-modal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-label', 'Bulk OTP Verification, live prototype');
    m.innerHTML =
      '<div class="otp-modal__scrim" data-close></div>' +
      '<div class="otp-modal__panel">' +
        '<div class="otp-modal__bar">' +
          '<span class="otp-modal__title"><span class="led"></span>Bulk OTP</span>' +
          '<div class="otp-modal__net" role="group" aria-label="Simulate network">' +
            '<button type="button" data-net="online" class="is-on">Online</button>' +
            '<button type="button" data-net="slow">Slow</button>' +
            '<button type="button" data-net="offline">Offline</button>' +
          '</div>' +
          '<div class="otp-modal__actions">' +
            '<span class="otp-modal__demo">OTP <b>4819</b></span>' +
            '<button type="button" class="otp-modal__reset" data-reset>Reset</button>' +
            '<button type="button" class="otp-modal__close" data-close aria-label="Close">' + closeIcon + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="otp-modal__stage"><iframe class="otp-modal__frame" title="Bulk OTP prototype" src="' + PROTO + '?embed=1"></iframe></div>' +
      '</div>';
    document.body.appendChild(m);
    return m;
  }

  function openModal() {
    if (!modal) modal = buildModal();
    document.documentElement.classList.add('otp-modal-open');
    modal.classList.add('is-open');
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.documentElement.classList.remove('otp-modal-open');
  }

  function postToProto(msg){
    if (!modal) return;
    var fr = modal.querySelector('.otp-modal__frame');
    if (fr && fr.contentWindow) fr.contentWindow.postMessage(msg, '*');
  }
  function setNetUI(net){
    if (!modal) return;
    modal.querySelectorAll('.otp-modal__net [data-net]').forEach(function(b){
      b.classList.toggle('is-on', b.getAttribute('data-net') === net);
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-open-otp]')) {
      e.preventDefault();
      if (window.caseGateLocked && window.caseGateLocked()) { window.caseGatePrompt && window.caseGatePrompt(); return; }
      openModal(); return;
    }
    if (!modal) return;
    var netBtn = e.target.closest('[data-net]');
    if (netBtn) { var n = netBtn.getAttribute('data-net'); setNetUI(n); postToProto({ type: 'otp-net', net: n }); return; }
    if (e.target.closest('[data-reset]')) { setNetUI('online'); postToProto({ type: 'otp-reset' }); return; }
    if (e.target.closest('[data-close]')) { closeModal(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });
})();

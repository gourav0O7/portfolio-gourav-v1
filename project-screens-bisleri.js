/* ============================================================
   PROJECT SCREENS, Edgistify × Bisleri (route optimization)
   The case-study "Product" section, in the same format as the
   Bulk OTP / Dual Payment case studies: filmstrip frames are
   live seed states of the working prototypes, so the screens
   and the build are the SAME thing. CTAs open both prototypes
   in modals, fully usable.
   Sets window.PROJECT_SCREENS = { driver, admin, live, tag }.
   ============================================================ */
(function () {
  'use strict';
  if (window.PROJECT_KEY !== 'route-optimization-bisleri') return;

  var DRV = 'prototype-driver-bisleri.html';
  var ADM = 'prototype-admin-bisleri.html';

  var css = [
'.bis { --bis-accent:#01A699; font-family:"Poppins", system-ui, sans-serif; }',

'.bis-capbar { font-family:var(--font-mono); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-faint); display:flex; justify-content:space-between; align-items:baseline; gap:18px; padding-bottom:14px; border-bottom:1px solid var(--line); margin-bottom:24px; flex-wrap:wrap; }',
'.bis-capbar b { color:var(--accent); font-weight:600; }',

/* ---- filmstrip ---- */
'.bis-strip { display:flex; gap:30px; overflow-x:auto; overflow-y:hidden; padding:8px clamp(20px,4vw,46px) 30px; scroll-snap-type:x proximity; scroll-padding-left:clamp(20px,4vw,46px); -webkit-overflow-scrolling:touch; scrollbar-width:thin; scrollbar-color:rgba(1,166,153,0.5) rgba(18,18,24,0.06); }',
'.bis-strip::-webkit-scrollbar { height:10px; }',
'.bis-strip::-webkit-scrollbar-thumb { background:rgba(1,166,153,0.45); border-radius:99px; }',
'.bis-strip::-webkit-scrollbar-thumb:hover { background:rgba(1,166,153,0.7); }',
'.bis-strip::-webkit-scrollbar-track { background:rgba(18,18,24,0.05); border-radius:99px; }',
'.bis-frame { scroll-snap-align:center; flex:0 0 auto; display:flex; flex-direction:column; align-items:center; gap:18px; }',
'.bis-frame--open { cursor:pointer; outline:none; }',
'.bis-frame--open .bis-phone__screen, .bis-frame--open .bis-win__view { position:relative; }',
'.bis-open { position:absolute; inset:0; z-index:6; display:flex; align-items:flex-end; justify-content:flex-end; padding:12px; background:linear-gradient(to top, rgba(6,26,23,0.5), transparent 45%); opacity:0; transition:opacity .18s ease; }',
'.bis-frame--open:hover .bis-open, .bis-frame--open:focus-visible .bis-open { opacity:1; }',
'.bis-open__btn { font-family:var(--font-mono); font-size:10.5px; letter-spacing:0.08em; text-transform:uppercase; color:#08211d; background:#fff; padding:8px 13px; border-radius:999px; font-weight:600; box-shadow:0 10px 26px -8px rgba(0,0,0,0.5); transform:translateY(4px); transition:transform .18s ease; }',
'.bis-frame--open:hover .bis-open__btn, .bis-frame--open:focus-visible .bis-open__btn { transform:translateY(0); }',
'.bis-frame--open:focus-visible .bis-phone, .bis-frame--open:focus-visible .bis-win { box-shadow:0 0 0 3px var(--accent), 0 30px 60px -22px rgba(0,0,0,0.7); }',

/* ---- CSS iPhone mockup (390x844 screen scaled) ---- */
'.bis-phone { --pw:270px; --ph:585px; --pscale:0.6923; position:relative; width:calc(var(--pw) + 24px); height:calc(var(--ph) + 24px); border-radius:54px; padding:12px; background:linear-gradient(145deg,#34363f,#16171c 62%); box-shadow:inset 0 0 0 2px rgba(255,255,255,0.06), inset 0 1px 2px rgba(255,255,255,0.18), 0 30px 60px -22px rgba(0,0,0,0.7), 0 10px 26px rgba(0,0,0,0.34); }',
'.bis-phone__screen { position:relative; width:var(--pw); height:var(--ph); border-radius:42px; overflow:hidden; background:#0d0e14; }',
'.bis-phone__screen iframe { width:390px; height:844px; border:0; display:block; transform:scale(var(--pscale)); transform-origin:top left; background:transparent; pointer-events:none; }',
'.bis-phone__island { position:absolute; top:9px; left:50%; transform:translateX(-50%); width:76px; height:21px; background:#000; border-radius:99px; z-index:4; box-shadow:inset 0 0 0 1px rgba(255,255,255,0.05); }',
'.bis-phone__island::after { content:""; position:absolute; right:10px; top:50%; transform:translateY(-50%); width:7px; height:7px; border-radius:50%; background:#0a0a10; box-shadow:inset 0 0 0 1px rgba(1,166,153,0.3); }',
'.bis-phone__btn { position:absolute; background:linear-gradient(#2b2d35,#16171c); border-radius:3px; }',
'.bis-phone__btn--silent { left:-2px; top:96px; width:3px; height:26px; }',
'.bis-phone__btn--vup { left:-2px; top:140px; width:3px; height:46px; }',
'.bis-phone__btn--vdn { left:-2px; top:198px; width:3px; height:46px; }',
'.bis-phone__btn--pwr { right:-2px; top:166px; width:3px; height:66px; }',
'@media (max-width:560px){ .bis-phone { --pw:230px; --ph:498px; --pscale:0.5897; } }',

/* ---- CSS browser mockup (1180x760 screen scaled) ---- */
'.bis-win { --bw:640px; --bh:412px; --bscale:0.5424; width:calc(var(--bw) + 2px); border-radius:14px; overflow:hidden; background:#16171c; box-shadow:inset 0 0 0 1px rgba(255,255,255,0.08), 0 30px 60px -22px rgba(0,0,0,0.7), 0 10px 26px rgba(0,0,0,0.3); }',
'.bis-win__bar { display:flex; align-items:center; gap:7px; height:34px; padding:0 14px; background:linear-gradient(#26272e,#1b1c22); }',
'.bis-win__bar i { width:10px; height:10px; border-radius:50%; background:#3a3b43; }',
'.bis-win__bar i:nth-child(1){ background:#e0564f; } .bis-win__bar i:nth-child(2){ background:#e0a03f; } .bis-win__bar i:nth-child(3){ background:#59b25c; }',
'.bis-win__url { flex:1; margin-left:8px; height:20px; border-radius:6px; background:rgba(255,255,255,0.07); display:flex; align-items:center; padding:0 10px; font-family:var(--font-mono); font-size:9.5px; letter-spacing:0.04em; color:rgba(255,255,255,0.45); overflow:hidden; white-space:nowrap; }',
'.bis-win__view { position:relative; width:var(--bw); height:var(--bh); overflow:hidden; background:#F5F6F7; }',
'.bis-win__view iframe { width:1180px; height:760px; border:0; display:block; transform:scale(var(--bscale)); transform-origin:top left; pointer-events:none; }',
'@media (max-width:760px){ .bis-win { --bw:460px; --bh:296px; --bscale:0.39; } }',
'@media (max-width:520px){ .bis-win { --bw:320px; --bh:206px; --bscale:0.2712; } }',

'.bis-frame__cap { display:flex; align-items:center; gap:9px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.03em; color:var(--text-dim); max-width:100%; }',
'.bis-frame__cap .n { color:var(--accent); font-weight:600; }',
'.bis-frame__cap b { color:var(--text); font-weight:600; }',

'.bis-acts { display:flex; flex-direction:column; }',
'.bis-act { padding-top:34px; }',
'.bis-act:first-child { padding-top:0; }',
'.bis-act__head { display:flex; align-items:baseline; gap:12px; padding:0 clamp(20px,4vw,46px) 16px; flex-wrap:wrap; }',
'.bis-act__no { font-family:var(--font-mono); font-size:12px; font-weight:600; color:var(--accent); }',
'.bis-act__title { font-size:18px; font-weight:600; letter-spacing:-0.01em; color:var(--text); }',
'.bis-act__desc { font-family:var(--font-mono); font-size:11px; letter-spacing:0.04em; text-transform:uppercase; color:var(--text-faint); margin-left:auto; }',

/* ---- live CTA panel ---- */
'.bis-live { margin-top:18px; border:1px solid var(--line); background:var(--bg-1); position:relative; }',
'.bis-live::before { content:""; position:absolute; top:12px; left:12px; width:15px; height:15px; border:1px solid var(--line-accent); border-right:0; border-bottom:0; pointer-events:none; }',
'.bis-live::after { content:""; position:absolute; bottom:12px; right:12px; width:15px; height:15px; border:1px solid var(--line-accent); border-left:0; border-top:0; pointer-events:none; }',
'.bis-live__in { padding:clamp(22px,3vw,30px) clamp(24px,4vw,40px); display:flex; align-items:center; gap:20px; flex-wrap:wrap; }',
'.bis-live__lede { color:var(--text-dim); font-size:14.5px; line-height:1.6; margin:0; flex:1 1 300px; max-width:58ch; }',
'.bis-live__eyebrow { flex:0 0 auto; font-family:var(--font-mono); font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:var(--accent); display:inline-flex; align-items:center; gap:10px; }',
'.bis-live__eyebrow::before { content:""; width:24px; height:1px; background:linear-gradient(90deg,transparent,var(--accent)); }',
'.bis-live__btns { display:flex; gap:10px; flex-wrap:wrap; flex:0 0 auto; }',

/* ---- live prototype modal ---- */
'.bis-modal { position:fixed; inset:0; z-index:100050; display:none; align-items:center; justify-content:center; padding:max(18px,3vh) 16px; }',
'.bis-modal.is-open { display:flex; }',
'.bis-modal__scrim { position:absolute; inset:0; background:rgba(8,9,14,0.66); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); animation:bisModalFade .2s ease; }',
'.bis-modal__panel { position:relative; z-index:1; display:flex; flex-direction:column; background:#0f1016; border:1px solid rgba(255,255,255,0.1); border-radius:20px; overflow:hidden; animation:bisModalPop .26s cubic-bezier(.16,1,.3,1); }',
'.bis-modal--phone .bis-modal__panel { width:min(460px,92vw); height:min(920px,92vh); }',
'.bis-modal--web .bis-modal__panel { width:min(1280px,94vw); height:min(860px,92vh); }',
'.bis-modal__bar { flex:0 0 auto; display:flex; align-items:center; gap:12px; padding:11px 12px 11px 16px; border-bottom:1px solid rgba(255,255,255,0.08); flex-wrap:wrap; }',
'.bis-modal__title { display:flex; align-items:center; gap:9px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.72); flex:0 0 auto; }',
'.bis-modal__title .led { width:7px; height:7px; border-radius:50%; background:#46d39a; animation:bisLed 1.8s ease-out infinite; }',
'@keyframes bisLed { 0%{ box-shadow:0 0 0 0 rgba(70,211,154,0.5);} 70%{ box-shadow:0 0 0 6px rgba(70,211,154,0);} 100%{ box-shadow:0 0 0 0 rgba(70,211,154,0);} }',
'.bis-modal__demo { font-family:var(--font-mono); font-size:11px; letter-spacing:0.04em; color:rgba(255,255,255,0.5); margin-left:auto; }',
'.bis-modal__demo b { color:rgba(255,255,255,0.92); font-weight:600; letter-spacing:0.1em; }',
'.bis-modal__actions { display:flex; align-items:center; gap:8px; flex:0 0 auto; }',
'.bis-modal__reset { font-family:var(--font-mono); font-size:11px; letter-spacing:0.04em; text-transform:uppercase; color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); padding:7px 12px; border-radius:8px; transition:background .14s ease, color .14s ease; }',
'.bis-modal__reset:hover { background:rgba(255,255,255,0.12); color:#fff; }',
'.bis-modal__close { width:34px; height:34px; display:grid; place-items:center; color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:8px; transition:background .14s ease, color .14s ease; }',
'.bis-modal__close:hover { background:rgba(255,255,255,0.12); color:#fff; }',
'.bis-modal__stage { flex:1 1 auto; position:relative; background:#0d0e14; }',
'.bis-modal--web .bis-modal__stage { background:#F5F6F7; }',
'.bis-modal__frame { position:absolute; inset:0; width:100%; height:100%; border:0; display:block; }',
'@keyframes bisModalFade { from{ opacity:0; } }',
'@keyframes bisModalPop { from{ transform:scale(.96) translateY(10px); opacity:0; } }',
'.bis-modal, .bis-modal * { cursor:auto !important; }',
'.bis-modal__reset, .bis-modal__close { cursor:pointer !important; }',
'html.bis-modal-open { overflow:hidden; }',
'html.bis-modal-open .cursor-dot, html.bis-modal-open .cursor-ring { opacity:0 !important; }',
''
].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---- frame builders ---- */
  function phone(n, seed, label, sub) {
    return '<figure class="bis-frame">' +
      '<div class="bis-phone">' +
        '<span class="bis-phone__btn bis-phone__btn--silent"></span>' +
        '<span class="bis-phone__btn bis-phone__btn--vup"></span>' +
        '<span class="bis-phone__btn bis-phone__btn--vdn"></span>' +
        '<span class="bis-phone__btn bis-phone__btn--pwr"></span>' +
        '<div class="bis-phone__screen">' +
          '<span class="bis-phone__island"></span>' +
          '<iframe loading="lazy" scrolling="no" tabindex="-1" title="Driver app, ' + label + '" src="' + DRV + '?seed=' + seed + '&static=1&bare=1"></iframe>' +
        '</div>' +
      '</div>' +
      '<figcaption class="bis-frame__cap"><span class="n">' + n + '</span><b>' + label + '</b> \u00b7 ' + sub + '</figcaption>' +
    '</figure>';
  }

  function win(n, seed, label, sub) {
    return '<figure class="bis-frame bis-frame--open" data-open-bis="admin" data-seed="' + seed + '" role="button" tabindex="0" aria-label="Open admin planner at ' + label + '">' +
      '<div class="bis-win">' +
        '<div class="bis-win__bar"><i></i><i></i><i></i><span class="bis-win__url">edgistify.com/bisleri/planner</span></div>' +
        '<div class="bis-win__view">' +
          '<iframe loading="lazy" scrolling="no" tabindex="-1" title="Admin planner, ' + label + '" src="' + ADM + '?seed=' + seed + '&static=1"></iframe>' +
          '<span class="bis-open"><span class="bis-open__btn">Open \u2197</span></span>' +
        '</div>' +
      '</div>' +
      '<figcaption class="bis-frame__cap"><span class="n">' + n + '</span><b>' + label + '</b> \u00b7 ' + sub + '</figcaption>' +
    '</figure>';
  }

  function act(no, title, desc, frames){
    return '<section class="bis-act"><div class="bis-act__head">' +
      '<span class="bis-act__no">'+no+'</span>' +
      '<span class="bis-act__title">'+title+'</span>' +
      '<span class="bis-act__desc">'+desc+'</span></div>' +
      '<div class="bis-strip">'+frames+'</div></section>';
  }

  /* ---- driver app screens ---- */
  var driverHTML =
    '<div class="bis">' +
      '<div class="bis-capbar"><span><b>// Driver App</b>, the whole day in one list</span>' +
        '<span>17 screens \u00b7 5 flows</span></div>' +
      '<div class="bis-acts">' +
        act('01', 'The morning run', 'login to first doorbell',
          phone('01', 'login',    'Login',        'driver ID, nothing else') +
          phone('02', 'start',    'Today\u2019s route', 'every stop, in order') +
          phone('03', 'map',      'Route map',     'live Google Map, all stops') +
          phone('04', 'detail',   'Stop detail',   'no-lift flag front and centre') +
          phone('05', 'call',     'Call ahead',    'confirm before you climb')) +
        act('02', 'Proof, not promises', 'every delivery leaves a photo behind',
          phone('06', 'proof',     'Proof of delivery', 'one photo at the door') +
          phone('07', 'proofshot', 'Captured',      'timestamp + GPS locked') +
          phone('08', 'success',   'Delivered',     'jars out, planner notified')) +
        act('03', 'When the door doesn\u2019t open', 'failure is a flow, not a dead end',
          phone('09', 'reason',    'Can\u2019t deliver', 'reasons the planner can act on') +
          phone('10', 'reasonerr', '\u201cOther\u201d requires words', 'no silent failures') +
          phone('11', 'failed',    'Failed on the list', 'undo window, then it sticks') +
          phone('12', 'loginerr',  'Wrong password', 'recoverable, with a way out')) +
        act('04', 'Dead zones', 'the route doesn\u2019t stop when the signal does',
          phone('13', 'offline',  'Offline banner', 'state is explicit, list still works') +
          phone('14', 'queued',   'Saved on the phone', 'delivery recorded offline') +
          phone('15', 'offqueue', 'Waiting to sync', 'flagged until it lands')) +
        act('05', 'The day closes', 'progress you can feel',
          phone('16', 'mid',  'Mid-route', 'delivered, failed, remaining') +
          phone('17', 'done', 'Route complete', 'every stop accounted for')) +
      '</div>' +
    '</div>';

  /* ---- admin console screens ---- */
  var adminHTML =
    '<div class="bis">' +
      '<div class="bis-capbar"><span><b>// Admin Planner</b>, sheet to dispatched route</span>' +
        '<span>10 screens \u00b7 2 flows</span></div>' +
      '<div class="bis-acts">' +
        act('06', 'Plan the day', 'sign in, upload, validate, assign, dispatch',
          win('18', 'login',     'Sign in',       'dispatchers only') +
          win('19', 'upload',    'Upload',        'warehouse + daily sheet') +
          win('20', 'uploaded',  'Sheet loaded',  '7 rows found') +
          win('21', 'validate',  'Validation',    'errors surface before anything ships') +
          win('22', 'fixed',     'All clear',     'fixed inline, dup removed') +
          win('23', 'vehicle',   'Assign driver', 'pick who runs the route') +
          win('24', 'route',     'Plan the route', 'choose vehicle \u00b7 optimised on a live map') +
          win('25', 'dispatched','Dispatched',    'straight to the driver\u2019s phone')) +
        act('07', 'Planner edge cases', 'the mornings that go sideways',
          win('26', 'overcap',   'Over capacity', '60 jars won\u2019t fit a 3-wheeler') +
          win('27', 'nodrivers', 'No drivers free','every driver already on a route')) +
      '</div>' +
    '</div>';

  /* ---- live CTA ---- */
  var arrow = '<svg class="arrow" width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.6"/></svg>';
  var liveHTML =
    '<div class="bis-live reveal">' +
      '<div class="bis-live__in">' +
        '<span class="bis-live__eyebrow">Prototypes</span>' +
        '<p class="bis-live__lede">Run the whole day yourself \u2014 plan a route in the console, then deliver it on the phone. Every edge case above is reachable.</p>' +
        '<div class="bis-live__btns">' +
          '<button type="button" class="btn btn--primary" data-open-bis="driver">Driver app ' + arrow + '</button>' +
          '<button type="button" class="btn btn--primary" data-open-bis="admin">Admin planner ' + arrow + '</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  window.PROJECT_SCREENS = { driver: driverHTML, admin: adminHTML, live: liveHTML, tag: '27 screens' };

  /* ---- live prototype modals ---- */
  var closeIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var modals = {};

  function buildModal(kind) {
    var isDrv = kind === 'driver';
    var m = document.createElement('div');
    m.className = 'bis-modal ' + (isDrv ? 'bis-modal--phone' : 'bis-modal--web');
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-label', isDrv ? 'Bisleri driver app, live prototype' : 'Bisleri admin planner, live prototype');
    m.innerHTML =
      '<div class="bis-modal__scrim" data-close></div>' +
      '<div class="bis-modal__panel">' +
        '<div class="bis-modal__bar">' +
          '<span class="bis-modal__title"><span class="led"></span>' + (isDrv ? 'Driver App' : 'Admin Planner') + '</span>' +
          (isDrv ? '<span class="bis-modal__demo">Login <b>MUM-0482</b> \u00b7 <b>bisleri</b></span>'
                 : '<span class="bis-modal__demo">Login <b>ops@edgistify.com</b> \u00b7 <b>bisleri</b></span>') +
          '<div class="bis-modal__actions">' +
            '<button type="button" class="bis-modal__reset" data-reset>Restart</button>' +
            '<button type="button" class="bis-modal__close" data-close aria-label="Close">' + closeIcon + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="bis-modal__stage"><iframe class="bis-modal__frame" title="' + (isDrv ? 'Driver app' : 'Admin planner') + ' prototype"></iframe></div>' +
      '</div>';
    document.body.appendChild(m);
    return m;
  }

  function srcFor(kind, seed){
    if (kind === 'driver') return DRV + '?embed=1' + (seed ? '&seed=' + seed : '');
    return ADM + (seed ? '?seed=' + seed : '');
  }

  function openModal(kind, seed) {
    if (!modals[kind]) modals[kind] = buildModal(kind);
    var m = modals[kind];
    var fr = m.querySelector('.bis-modal__frame');
    var src = srcFor(kind, seed);
    if (fr.getAttribute('data-src') !== src) { fr.setAttribute('data-src', src); fr.src = src; }
    document.documentElement.classList.add('bis-modal-open');
    m.classList.add('is-open');
  }
  function closeModals() {
    Object.keys(modals).forEach(function(k){ modals[k].classList.remove('is-open'); });
    document.documentElement.classList.remove('bis-modal-open');
  }

  document.addEventListener('click', function (e) {
    var opener = e.target.closest && e.target.closest('[data-open-bis]');
    if (opener) { e.preventDefault(); openModal(opener.getAttribute('data-open-bis'), opener.getAttribute('data-seed') || ''); return; }
    var m = e.target.closest && e.target.closest('.bis-modal');
    if (!m) return;
    if (e.target.closest('[data-reset]')) {
      var fr = m.querySelector('.bis-modal__frame');
      if (fr) fr.src = fr.getAttribute('data-src');
      return;
    }
    if (e.target.closest('[data-close]')) closeModals();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var f = document.activeElement;
      if (f && f.hasAttribute && f.hasAttribute('data-open-bis')) {
        e.preventDefault();
        openModal(f.getAttribute('data-open-bis'), f.getAttribute('data-seed') || '');
      }
    }
    if (e.key === 'Escape') closeModals();
  });
})();

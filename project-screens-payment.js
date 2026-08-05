
/* ============================================================
   PROJECT SCREENS, Collect Payment (Omniful)
   The case-study "Product" section. Every frame is the real
   working prototype (prototype-collect-payment.html) frozen at a
   seed state and shown in an iPhone mockup, so the screens and
   the live build are the SAME thing. The CTA opens that build in
   a modal, fully usable, with a network simulator in the chrome.
   Sets window.PROJECT_SCREENS = { driver, live, tag }.
   ============================================================ */
(function () {
  'use strict';
  if (window.PROJECT_KEY !== 'dual-payment') return;

  var PROTO = 'prototype-collect-payment.html';

  var css = [
'.pay { --pk-accent:#5468FA; font-family:"Poppins", system-ui, sans-serif; }',

'.pay-capbar { font-family:var(--font-mono); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-faint); display:flex; justify-content:space-between; align-items:baseline; gap:18px; padding-bottom:14px; border-bottom:1px solid var(--line); margin-bottom:24px; flex-wrap:wrap; }',
'.pay-capbar b { color:var(--accent); font-weight:600; }',

/* ---- screen strips ---- */
'.pay-strip { display:flex; gap:30px; overflow-x:auto; overflow-y:hidden; padding:8px clamp(20px,4vw,46px) 30px; scroll-snap-type:x proximity; scroll-padding-left:clamp(20px,4vw,46px); -webkit-overflow-scrolling:touch; scrollbar-width:thin; scrollbar-color:rgba(84,104,250,0.5) rgba(18,18,24,0.06); }',
'.pay-strip::-webkit-scrollbar { height:10px; }',
'.pay-strip::-webkit-scrollbar-thumb { background:rgba(84,104,250,0.45); border-radius:99px; }',
'.pay-strip::-webkit-scrollbar-thumb:hover { background:rgba(84,104,250,0.7); }',
'.pay-strip::-webkit-scrollbar-track { background:rgba(18,18,24,0.05); border-radius:99px; }',
'.pay-frame { scroll-snap-align:center; flex:0 0 auto; display:flex; flex-direction:column; align-items:center; gap:18px; }',

/* ---- CSS iPhone mockup ---- */
'.pay-phone { --pw:270px; --ph:585px; --pscale:0.6923; position:relative; width:calc(var(--pw) + 24px); height:calc(var(--ph) + 24px); border-radius:54px; padding:12px; background:linear-gradient(145deg,#34363f,#16171c 62%); box-shadow:inset 0 0 0 2px rgba(255,255,255,0.06), inset 0 1px 2px rgba(255,255,255,0.18), 0 30px 60px -22px rgba(0,0,0,0.7), 0 10px 26px rgba(0,0,0,0.34); }',
'.pay-phone__screen { position:relative; width:var(--pw); height:var(--ph); border-radius:42px; overflow:hidden; background:#0d0e14; }',
'.pay-phone__screen iframe { width:390px; height:844px; border:0; display:block; transform:scale(var(--pscale)); transform-origin:top left; background:transparent; }',
'.pay-phone__island { position:absolute; top:9px; left:50%; transform:translateX(-50%); width:76px; height:21px; background:#000; border-radius:99px; z-index:4; box-shadow:inset 0 0 0 1px rgba(255,255,255,0.05); }',
'.pay-phone__island::after { content:""; position:absolute; right:10px; top:50%; transform:translateY(-50%); width:7px; height:7px; border-radius:50%; background:#0a0a10; box-shadow:inset 0 0 0 1px rgba(90,110,255,0.25); }',
'.pay-phone__btn { position:absolute; background:linear-gradient(#2b2d35,#16171c); border-radius:3px; }',
'.pay-phone__btn--silent { left:-2px; top:96px; width:3px; height:26px; }',
'.pay-phone__btn--vup { left:-2px; top:140px; width:3px; height:46px; }',
'.pay-phone__btn--vdn { left:-2px; top:198px; width:3px; height:46px; }',
'.pay-phone__btn--pwr { right:-2px; top:166px; width:3px; height:66px; }',
'.pay-frame__cap { display:flex; align-items:center; gap:9px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.03em; color:var(--text-dim); }',
'.pay-frame__cap .n { color:var(--accent); font-weight:600; }',
'.pay-frame__cap b { color:var(--text); font-weight:600; }',

/* ---- acts ---- */
'.pay-acts { display:flex; flex-direction:column; }',
'.pay-act { padding-top:34px; }',
'.pay-act:first-child { padding-top:0; }',
'.pay-act__head { display:flex; align-items:baseline; gap:12px; padding:0 clamp(20px,4vw,46px) 16px; flex-wrap:wrap; }',
'.pay-act__no { font-family:var(--font-mono); font-size:12px; font-weight:600; color:var(--accent); }',
'.pay-act__title { font-size:18px; font-weight:600; letter-spacing:-0.01em; color:var(--text); }',
'.pay-act__desc { font-family:var(--font-mono); font-size:11px; letter-spacing:0.04em; text-transform:uppercase; color:var(--text-faint); margin-left:auto; }',
'@media (max-width:560px){ .pay-phone { --pw:230px; --ph:498px; --pscale:0.5897; } }',

/* ---- live CTA panel (compact, on-theme) ---- */
'.pay-live { margin-top:18px; border:1px solid var(--line); background:var(--bg-1); position:relative; }',
'.pay-live::before { content:""; position:absolute; top:12px; left:12px; width:15px; height:15px; border:1px solid var(--line-accent); border-right:0; border-bottom:0; pointer-events:none; }',
'.pay-live::after { content:""; position:absolute; bottom:12px; right:12px; width:15px; height:15px; border:1px solid var(--line-accent); border-left:0; border-top:0; pointer-events:none; }',
'.pay-live__in { padding:clamp(22px,3vw,30px) clamp(24px,4vw,40px); display:flex; align-items:center; gap:24px; flex-wrap:wrap; }',
'.pay-live__eyebrow { flex:0 0 auto; font-family:var(--font-mono); font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:var(--accent); display:inline-flex; align-items:center; gap:10px; }',
'.pay-live__eyebrow::before { content:""; width:24px; height:1px; background:linear-gradient(90deg,transparent,var(--accent)); }',
'.pay-live__lede { color:var(--text-dim); font-size:14.5px; line-height:1.6; margin:0; flex:1 1 320px; max-width:62ch; }',
'.pay-live__btn { margin:0; flex:0 0 auto; }',

/* ---- live prototype modal ---- */
'.pay-modal { position:fixed; inset:0; z-index:100050; display:none; align-items:center; justify-content:center; padding:max(18px,3vh) 16px; }',
'.pay-modal.is-open { display:flex; }',
'.pay-modal__scrim { position:absolute; inset:0; background:rgba(8,9,14,0.66); backdrop-filter:blur(3px); -webkit-backdrop-filter:blur(3px); animation:payModalFade .2s ease; }',
'.pay-modal__panel { position:relative; z-index:1; width:min(440px,92vw); height:min(900px,94vh); display:flex; flex-direction:column; background:#0f1016; border:1px solid rgba(255,255,255,0.1); border-radius:20px; overflow:hidden; animation:payModalPop .26s cubic-bezier(.16,1,.3,1); }',
'.pay-modal__bar { flex:0 0 auto; display:flex; align-items:center; gap:12px; padding:11px 12px 11px 16px; border-bottom:1px solid rgba(255,255,255,0.08); flex-wrap:wrap; }',
'.pay-modal__title { display:flex; align-items:center; gap:9px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.72); flex:0 0 auto; }',
'.pay-modal__title .led { width:7px; height:7px; border-radius:50%; background:#46d39a; box-shadow:0 0 0 0 rgba(70,211,154,0.5); animation:payLed 1.8s ease-out infinite; }',
'@keyframes payLed { 0%{ box-shadow:0 0 0 0 rgba(70,211,154,0.5);} 70%{ box-shadow:0 0 0 6px rgba(70,211,154,0);} 100%{ box-shadow:0 0 0 0 rgba(70,211,154,0);} }',
'.pay-modal__net { display:flex; align-items:center; gap:2px; margin:0 auto; padding:3px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:9px; }',
'.pay-modal__net button { font-family:var(--font-mono); font-size:11px; letter-spacing:0.03em; color:rgba(255,255,255,0.62); background:transparent; border:0; padding:5px 11px; border-radius:6px; cursor:pointer; transition:background .14s ease, color .14s ease; }',
'.pay-modal__net button:hover { color:#fff; }',
'.pay-modal__net button.is-on { background:#5468FA; color:#fff; }',
'.pay-modal__actions { display:flex; align-items:center; gap:8px; flex:0 0 auto; }',
'.pay-modal__reset { font-family:var(--font-mono); font-size:11px; letter-spacing:0.04em; text-transform:uppercase; color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); padding:7px 12px; border-radius:8px; transition:background .14s ease, color .14s ease; }',
'.pay-modal__reset:hover { background:rgba(255,255,255,0.12); color:#fff; }',
'.pay-modal__close { width:34px; height:34px; display:grid; place-items:center; color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:8px; transition:background .14s ease, color .14s ease; }',
'.pay-modal__close:hover { background:rgba(255,255,255,0.12); color:#fff; }',
'.pay-modal__stage { flex:1 1 auto; position:relative; background:#0d0e14; }',
'.pay-modal__frame { position:absolute; inset:0; width:100%; height:100%; border:0; display:block; }',
'@keyframes payModalFade { from{ opacity:0; } }',
'@keyframes payModalPop { from{ transform:scale(.96) translateY(10px); opacity:0; } }',
'.pay-modal, .pay-modal * { cursor:auto !important; }',
'.pay-modal__reset, .pay-modal__close, .pay-modal__net button { cursor:pointer !important; }',
'html.pay-modal-open { overflow:hidden; }',
'html.pay-modal-open .cursor-dot, html.pay-modal-open .cursor-ring { opacity:0 !important; }',
''
].join('\n');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  function frame(n, seed, label, sub) {
    return '<figure class="pay-frame">' +
      '<div class="pay-phone">' +
        '<span class="pay-phone__btn pay-phone__btn--silent"></span>' +
        '<span class="pay-phone__btn pay-phone__btn--vup"></span>' +
        '<span class="pay-phone__btn pay-phone__btn--vdn"></span>' +
        '<span class="pay-phone__btn pay-phone__btn--pwr"></span>' +
        '<div class="pay-phone__screen">' +
          '<span class="pay-phone__island"></span>' +
          '<iframe scrolling="no" data-seed="' + seed + '" title="Collect Payment, ' + label + '" data-src="' + PROTO + '?seed=' + seed + '&static=1&bare=1"></iframe>' +
        '</div>' +
      '</div>' +
      '<figcaption class="pay-frame__cap"><span class="n">' + n + '</span><b>' + label + '</b> \u00b7 ' + sub + '</figcaption>' +
    '</figure>';
  }

  function act(no, title, desc, frames){
    return '<section class="pay-act"><div class="pay-act__head">' +
      '<span class="pay-act__no">'+no+'</span>' +
      '<span class="pay-act__title">'+title+'</span>' +
      '<span class="pay-act__desc">'+desc+'</span></div>' +
      '<div class="pay-strip">'+frames+'</div></section>';
  }

  var driverHTML =
    '<div class="pay">' +
      '<div class="pay-capbar"><span><b>// Collect Payment</b>, doorstep cash + card</span>' +
        '<span>18 screens \u00b7 5 flows</span></div>' +
      '<div class="pay-acts">' +
        act('01', 'The happy path', 'one bill \u2192 split &amp; prove \u2192 review \u2192 done',
          frame('01', 'empty',   'Amount due',     'one order, one bill') +
          frame('02', 'partial', 'Auto-split',     'cash in, card auto-fills the rest') +
          frame('03', 'filled',  'Split + proof',  'cash + card, evidence') +
          frame('04', 'review',  'Review',         'one combined record') +
          frame('05', 'success', 'Collected',      'done at the doorstep')) +
        act('02', 'One method only', 'no split needed, cash or card covers it all',
          frame('06', 'cashonly', 'All cash',  'full amount, one method') +
          frame('07', 'cardonly', 'All card',  'no cash at the door')) +
        act('03', 'Proof of payment', 'capture evidence in-flow',
          frame('08', 'methodneeded', 'Pick method',  'amount covered, method missing') +
          frame('09', 'camera',       'Capture proof','frame &amp; shoot in-app') +
          frame('10', 'maxproof',     'Four max',     'upload cap reached')) +
        act('04', 'Guardrails', 'amounts that don\u2019t add up are caught',
          frame('11', 'proofreq', 'Proof required', 'can\u2019t continue without it') +
          frame('12', 'exceeds',  'Online > due',   'blocked inline') +
          frame('13', 'overpaid', 'Overpaid',       'exceeds the due amount') +
          frame('14', 'limit',    'Online limit',   'explained in a sheet') +
          frame('15', 'info',     'What counts?',   'other-method help')) +
        act('05', 'Connectivity', 'doorsteps have dead zones',
          frame('16', 'offline', 'Offline',  'record now, submit later') +
          frame('17', 'slow',    'Slow',     'heads-up, still works') +
          frame('18', 'queued',  'Queued',   'saved offline, syncs itself')) +
      '</div>' +
    '</div>';

  var arrow = '<svg class="arrow" width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.6"/></svg>';
  var liveHTML =
    '<div class="pay-live reveal">' +
      '<div class="pay-live__in">' +
        '<span class="pay-live__eyebrow">Prototype</span>' +
        '<p class="pay-live__lede">Split an amount across two methods, capture proof, hit the guardrails, and complete the order \u2014 with the network toggle in the top bar.</p>' +
        '<button type="button" class="btn btn--primary pay-live__btn" data-open-proto>Open prototype ' + arrow + '</button>' +
      '</div>' +
    '</div>';

  window.PROJECT_SCREENS = { driver: driverHTML, live: liveHTML, tag: '18 screens' };

  /* ---- live prototype modal ---- */
  var closeIcon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var modal = null;

  function buildModal() {
    var m = document.createElement('div');
    m.className = 'pay-modal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-label', 'Collect Payment, live prototype');
    m.innerHTML =
      '<div class="pay-modal__scrim" data-close></div>' +
      '<div class="pay-modal__panel">' +
        '<div class="pay-modal__bar">' +
          '<span class="pay-modal__title"><span class="led"></span>Collect Payment</span>' +
          '<div class="pay-modal__net" role="group" aria-label="Simulate network">' +
            '<button type="button" data-net="online" class="is-on">Online</button>' +
            '<button type="button" data-net="slow">Slow</button>' +
            '<button type="button" data-net="offline">Offline</button>' +
          '</div>' +
          '<div class="pay-modal__actions">' +
            '<button type="button" class="pay-modal__reset" data-reset>Reset</button>' +
            '<button type="button" class="pay-modal__close" data-close aria-label="Close">' + closeIcon + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="pay-modal__stage"><iframe class="pay-modal__frame" title="Collect Payment prototype" src="' + PROTO + '?embed=1"></iframe></div>' +
      '</div>';
    document.body.appendChild(m);
    return m;
  }

  function openModal() {
    if (!modal) modal = buildModal();
    document.documentElement.classList.add('pay-modal-open');
    modal.classList.add('is-open');
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.documentElement.classList.remove('pay-modal-open');
  }
  function postToProto(msg){
    if (!modal) return;
    var fr = modal.querySelector('.pay-modal__frame');
    if (fr && fr.contentWindow) fr.contentWindow.postMessage(msg, '*');
  }
  function setNetUI(net){
    if (!modal) return;
    modal.querySelectorAll('.pay-modal__net [data-net]').forEach(function(b){
      b.classList.toggle('is-on', b.getAttribute('data-net') === net);
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-open-proto]')) {
      e.preventDefault();
      if (window.caseGateLocked && window.caseGateLocked()) { window.caseGatePrompt && window.caseGatePrompt(); return; }
      openModal(); return;
    }
    if (!modal) return;
    var netBtn = e.target.closest('[data-net]');
    if (netBtn) { var n = netBtn.getAttribute('data-net'); setNetUI(n); postToProto({ type: 'pay-net', net: n }); return; }
    if (e.target.closest('[data-reset]')) { setNetUI('online'); postToProto({ type: 'pay-reset' }); return; }
    if (e.target.closest('[data-close]')) { closeModal(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
  });

  /* ---- lazy iframe loader: mount one React app at a time so the strip of
          15 frozen screens never floods the renderer (that was crashing the
          preview). Each frame loads only when it nears the viewport, and the
          next waits for the previous to finish. ---- */
  function initLazyFrames() {
    var host = document.querySelector('.pay');
    if (!host) { setTimeout(initLazyFrames, 120); return; }
    var frames = [].slice.call(host.querySelectorAll('iframe[data-src]'));
    if (!frames.length) return;
    var busy = false, queue = [];
    function pump() {
      if (busy) return;
      var f = queue.shift();
      if (!f) return;
      if (!f.getAttribute('data-src')) { pump(); return; }
      busy = true;
      var done = function () { if (f.__d) return; f.__d = true; f.removeEventListener('load', done); busy = false; setTimeout(pump, 160); };
      f.addEventListener('load', done);
      setTimeout(done, 4500); // failsafe so a stalled frame never blocks the queue
      f.src = f.getAttribute('data-src');
      f.removeAttribute('data-src');
    }
    function want(f) { if (f && f.getAttribute('data-src') && queue.indexOf(f) < 0) { queue.push(f); pump(); } }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); want(e.target); } });
      }, { rootMargin: '400px' });
      frames.forEach(function (f) { io.observe(f); });
    } else {
      frames.forEach(want);
    }
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') initLazyFrames();
  else document.addEventListener('DOMContentLoaded', initLazyFrames);
})();

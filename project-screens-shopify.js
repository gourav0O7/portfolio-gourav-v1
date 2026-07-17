
/* ============================================================
   PROJECT SCREENS, App Builder, Shopify-aligned (Omniful)
   The case-study "Product" section. Shows the REAL Figma screens,
   exported from the source file as flat images (screens-img/*).
   Plain <img> in browser-window cards, no React, no framework ,
   so the page is light and loads instantly.

   Cards are grouped by module and scaled to the column; click any
   screen to view it full-size in a lightbox.
   Sets window.PROJECT_SCREENS = { tag, driver }.
   ============================================================ */
(function () {
  'use strict';
  if (window.PROJECT_KEY !== 'app-builder-shopify') return;

  var BASE = 'screens-img/';

  // NEW phase, the real coded Polaris screens, embedded LIVE (iframes).
  var LIVE_BASE = 'app-builder-live/';
  var LIVE_W = 1280; // design width each screen renders at for the scaled preview
  var LIVE = [
    { file:'01-theme.html',         module:'Theme',         label:'Theme library & live preview', desc:'Browse and switch storefront themes with an instant mobile preview.' },
    { file:'02-branding.html',      module:'Branding',      label:'Brand settings',               desc:'Set the app icon, logo, colors, and store identity in one place.' },
    { file:'03-pages.html',         module:'Page Builder',  label:'Media & product blocks',       desc:'Compose home, category, and product pages from drag-in content blocks.' },
    { file:'04-settings.html',      module:'Settings',      label:'Tabs & navigation menu',       desc:'Toggle app features and configure the bottom tab bar and menus.' },
    { file:'05-integrations.html',  module:'Integrations',  label:'Marketing apps & plans',       desc:'Connect marketing, analytics, and growth apps to the storefront.' },
    { file:'06-notifications.html', module:'Notifications', label:'Push notifications',           desc:'Create, schedule, and track push campaigns sent to app customers.' },
    { file:'07-deeplink.html',      module:'Deep Links',    label:'Product deep links',           desc:'Generate shareable links that open any product or collection in-app.' }
  ];

  // OLD design, the element-builder before the redesign (dark UI).
  var OLD_MODULES = [
    { name: 'Element Builder', screens: [
      { src: 'old-element-default.png',      label: 'Element library',  ar: 924/540 },
      { src: 'old-element-strip.png',        label: 'Strip element',    ar: 924/540 },
      { src: 'old-element-banner.png',       label: 'Banner element',   ar: 924/540 },
      { src: 'old-element-carousel.png',     label: 'Carousel element', ar: 924/540 },
      { src: 'old-element-countdown.png',    label: 'Countdown timer',  ar: 924/540 },
      { src: 'old-element-offers.png',       label: 'Offers / coupon',  ar: 924/540 },
      { src: 'old-element-recentlyview.png', label: 'Recently viewed',  ar: 924/540 },
      { src: 'old-element-spacer.png',       label: 'Spacer element',   ar: 924/540 }
    ]}
  ];

  // module → screens (real Figma frames). ar = width/height of the source frame.
  var MODULES = [
    { name: 'Theme', screens: [
      { src: 'theme-library.png',  label: 'Theme library',     ar: 1512/1110 },
      { src: 'theme-details.png',  label: 'Theme details',     ar: 1512/1110 },
      { src: 'theme-preview.png',  label: 'Live preview',      ar: 1512/1110 }
    ]},
    { name: 'Branding', screens: [
      { src: 'brand-settings.png', label: 'Brand settings',    ar: 1512/1219 }
    ]},
    { name: 'Page Builder', screens: [
      { src: 'page-upload-media.png', label: 'Upload media',        ar: 1029/556 },
      { src: 'page-link-product.png', label: 'Link to product',     ar: 1029/794 }
    ]},
    { name: 'Settings', screens: [
      { src: 'settings-tabs.png', label: 'Add tabs',  ar: 1512/1087 },
      { src: 'settings-menu.png', label: 'Add menu',  ar: 1512/1087 }
    ]},
    { name: 'Integrations', screens: [
      { src: 'integration-apps.png',    label: 'Marketing apps',  ar: 1512/1110 },
      { src: 'integration-pricing.png', label: 'Pricing & plans', ar: 1512/1270 }
    ]},
    { name: 'Notifications', screens: [
      { src: 'notification-list.png',   label: 'Push notifications', ar: 1512/1110 },
      { src: 'notification-create.png', label: 'Create notification', ar: 1029/863 }
    ]},
    { name: 'Deep Links', screens: [
      { src: 'deeplink-products.png', label: 'Product deep link', ar: 1512/1143 }
    ]}
  ];

  var total = MODULES.reduce(function (n, m) { return n + m.screens.length; }, 0);

  var css = [
'.sb { --sb-accent:#008060; }',
/* big phase divider between OLD / NEW / SYSTEM */
'.sb-phase { margin:0 0 6px; }',
'.sb-phase:not(:first-child) { margin-top:clamp(64px,9vw,120px); }',
'.sb-phase__bar { display:flex; align-items:baseline; gap:16px; padding-bottom:16px; border-bottom:2px solid var(--text); }',
'.sb-phase__k { font-family:var(--font-mono); font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:#fff; background:var(--text); padding:5px 10px; border-radius:4px; flex:none; }',
'.sb-phase--old .sb-phase__k { background:#3a3f4b; }',
'.sb-phase--new .sb-phase__k { background:#008060; }',
'.sb-phase--sys .sb-phase__k { background:#5a3df0; }',
'.sb-phase__h { font-size:clamp(26px,3.4vw,40px); font-weight:720; letter-spacing:-0.025em; color:var(--text); }',
'.sb-phase__sub { margin-left:auto; flex:none; max-width:340px; text-align:right; font-size:13px; line-height:1.45; color:var(--text-faint); padding-bottom:2px; }',
'.sb-phase--old { --sb-accent:#6b7280; }',
'.sb-phase--new { --sb-accent:#008060; }',
'.sb-capbar { font-family:var(--font-mono); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-faint); display:flex; justify-content:space-between; align-items:baseline; gap:18px; padding-bottom:14px; border-bottom:1px solid var(--line); margin-bottom:8px; flex-wrap:wrap; }',
'.sb-capbar b { color:var(--sb-accent); font-weight:600; }',
'.sb-boards { display:flex; flex-direction:column; gap:clamp(44px,6vw,80px); }',
'.sb-board__head { display:flex; gap:16px; align-items:baseline; margin:30px 0 22px; }',
'.sb-board__n { font-family:var(--font-mono); font-size:12px; color:var(--sb-accent); flex:none; padding-top:3px; }',
'.sb-board__h { font-size:clamp(22px,2.6vw,30px); font-weight:680; letter-spacing:-0.02em; color:var(--text); }',
'.sb-board__c { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--text-faint); padding-top:6px; }',
'.sb-board__grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:clamp(18px,2vw,28px); align-items:start; }',
'.sb-card { display:flex; flex-direction:column; cursor:zoom-in; content-visibility:auto; contain-intrinsic-size:auto 420px; }',
'.sb-win { border:1px solid var(--line); border-radius:11px; overflow:hidden; background:#fff; box-shadow:0 18px 44px -30px rgba(0,0,0,0.5); transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease; }',
'.sb-card:hover .sb-win { transform:translateY(-3px); box-shadow:0 30px 60px -32px rgba(0,0,0,0.55); border-color:var(--sb-accent); }',
'.sb-win__bar { display:flex; align-items:center; gap:9px; padding:8px 11px; background:#f1f1f3; border-bottom:1px solid var(--line); }',
'.sb-win__dots { display:flex; gap:5px; flex:none; }',
'.sb-win__dots i { width:8px; height:8px; border-radius:50%; background:#d0d0d6; display:block; }',
'.sb-win__dots i:nth-child(1){ background:#ec6a5e; } .sb-win__dots i:nth-child(2){ background:#f3bf4f; } .sb-win__dots i:nth-child(3){ background:#61c454; }',
'.sb-win__zoom { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:#a6a6ae; }',
'.sb-shot { display:block; width:100%; height:auto; background:#f1f1f1; }',
'.sb-cap { display:flex; align-items:baseline; gap:9px; padding:11px 3px 0; }',
'.sb-cap__t { font-size:14px; font-weight:560; letter-spacing:-0.01em; color:var(--text); line-height:1.3; }',
'.sb-cap__tag { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-faint); padding-top:1px; }',
'.sb-note { margin-top:44px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.06em; color:var(--text-faint); display:flex; align-items:center; gap:10px; }',
'.sb-note::before { content:""; width:18px; height:1px; background:var(--line-2); }',
/* lightbox */
'.sb-lb { position:fixed; inset:0; z-index:9999; background:rgba(16,16,20,0.86); backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; padding:clamp(16px,4vw,56px); opacity:0; transition:opacity .2s ease; }',
'.sb-lb.is-open { display:flex; opacity:1; }',
'.sb-lb__win { background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 40px 120px -30px rgba(0,0,0,0.7); display:flex; flex-direction:column; max-width:100%; max-height:100%; }',
'.sb-lb__bar { display:flex; align-items:center; gap:12px; padding:11px 16px; background:#f1f1f3; border-bottom:1px solid var(--line); flex:none; }',
'.sb-lb__bar .sb-win__dots i { width:11px; height:11px; }',
'.sb-lb__title { font-size:13px; font-weight:600; color:var(--text); }',
'.sb-lb__sub { font-family:var(--font-mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#9a9aa2; }',
'.sb-lb__x { margin-left:auto; flex:none; width:30px; height:30px; border-radius:50%; border:1px solid var(--line); background:#fff; color:#555; font-size:16px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center; }',
'.sb-lb__x:hover { background:#111; color:#fff; border-color:#111; }',
'.sb-lb__body { overflow:hidden; background:#f1f1f1; flex:none; display:flex; }',
'.sb-lb__body img { display:block; width:100%; height:100%; object-fit:contain; }',
'.sb-lb__body iframe { display:block; width:100%; height:100%; border:0; background:#fff; }',
'.sb-lb__open { font-family:var(--font-mono); font-size:10px; letter-spacing:0.06em; text-transform:uppercase; color:#555; text-decoration:none; border:1px solid var(--line); border-radius:6px; padding:5px 9px; flex:none; }',
'.sb-lb__open:hover { background:#111; color:#fff; border-color:#111; }',
/* live coded-screen cards (the After phase), clean, no window chrome */
'.sb-board__grid--live { display:block; column-width:430px; column-gap:clamp(20px,2.4vw,34px); grid-template-columns:none; }',
'.sl-card { content-visibility:visible; contain-intrinsic-size:auto; break-inside:avoid; -webkit-column-break-inside:avoid; display:inline-block; width:100%; margin:0 0 clamp(28px,3vw,44px); vertical-align:top; }',
'.sl-cap { display:flex; align-items:flex-start; gap:13px; margin:0 2px 14px; }',
'.sl-num { font-family:var(--font-mono); font-size:11px; font-weight:600; letter-spacing:0.08em; color:var(--text-faint,#a6a6ae); padding-top:3px; flex:none; font-variant-numeric:tabular-nums; }',
'.sl-cap__txt { flex:1; min-width:0; }',
'.sl-title { margin:0; font-size:15px; font-weight:640; letter-spacing:-0.01em; color:var(--text); line-height:1.3; }',
'.sl-desc { margin:3px 0 0; font-size:13px; line-height:1.5; color:var(--text-soft,#62656e); text-wrap:pretty; }',
'.sl-live { flex:none; display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:9px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#1f8a4c; padding-top:4px; }',
'.sl-live::before { content:""; width:6px; height:6px; border-radius:50%; background:#1f8a4c; box-shadow:0 0 0 3px rgba(31,138,76,0.16); animation:sbpulse 2.2s ease-in-out infinite; }',
'@keyframes sbpulse { 0%,100%{opacity:1} 50%{opacity:.4} }',
'.sl-frame { position:relative; border:1px solid var(--line); border-radius:14px; overflow:hidden; background:#f2f2f2; box-shadow:0 1px 2px rgba(0,0,0,0.04), 0 24px 50px -32px rgba(0,0,0,0.42); cursor:zoom-in; transition:transform .22s cubic-bezier(.2,.7,.3,1), box-shadow .22s ease, border-color .22s ease; }',
'.sl-frame:hover { transform:translateY(-3px); border-color:#cfcfd6; box-shadow:0 1px 2px rgba(0,0,0,0.05), 0 36px 70px -34px rgba(0,0,0,0.5); }',
'.sl-open { position:absolute; right:12px; bottom:12px; z-index:3; display:inline-flex; align-items:center; gap:6px; font-family:var(--font-mono); font-size:10px; font-weight:600; letter-spacing:0.04em; text-transform:uppercase; color:#fff; background:rgba(17,17,19,0.9); -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px); padding:7px 11px; border-radius:8px; opacity:0; transform:translateY(4px); transition:opacity .2s ease, transform .2s ease; pointer-events:none; }',
'.sl-frame:hover .sl-open { opacity:1; transform:translateY(0); }',
'.sb-live { position:relative; width:100%; height:260px; overflow:hidden; background:#f2f2f2; }',
'.sb-live__f { position:absolute; top:0; left:0; width:1280px; height:64px; border:0; transform-origin:0 0; pointer-events:none; background:#f2f2f2; }',
'.sb-live__hit { position:absolute; inset:0; z-index:2; cursor:zoom-in; }',
/* components / design-system band */
'.sb-sys { margin-top:26px; }',
'.sb-sys__lead { max-width:680px; font-size:15px; line-height:1.6; color:var(--text-soft,#52555e); margin:0 0 26px; }',
'.sb-sys__sheet { border:1px solid var(--line); border-radius:14px; overflow:hidden; background:#fff; box-shadow:0 22px 60px -38px rgba(0,0,0,0.45); cursor:zoom-in; transition:box-shadow .2s ease, border-color .2s ease; }',
'.sb-sys__sheet:hover { border-color:#5a3df0; box-shadow:0 34px 80px -40px rgba(90,61,240,0.4); }',
'.sb-sys__bar { display:flex; align-items:center; gap:9px; padding:10px 14px; background:#faf9ff; border-bottom:1px solid var(--line); }',
'.sb-sys__bar b { font-size:12px; font-weight:600; color:#5a3df0; letter-spacing:0.02em; }',
'.sb-sys__bar span { margin-left:auto; font-family:var(--font-mono); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:#a6a6ae; }',
'.sb-sys__img { display:block; width:100%; height:auto; }',
'.sb-sys__tokens { display:flex; flex-wrap:wrap; gap:10px; margin-top:22px; }',
'.sb-tok { display:flex; align-items:center; gap:9px; border:1px solid var(--line); border-radius:8px; padding:8px 13px 8px 9px; font-family:var(--font-mono); font-size:11px; color:var(--text); background:#fff; }',
'.sb-tok i { width:18px; height:18px; border-radius:5px; flex:none; border:1px solid rgba(0,0,0,0.08); display:block; }'
  ].join('\n');

  function buildBoards(mods) { return mods.map(function (m, gi) {
    var cards = m.screens.map(function (s, i) {
      return '' +
        '<figure class="sb-card" data-src="' + BASE + s.src + '" data-ar="' + s.ar + '" ' +
              'data-module="' + m.name + '" data-label="' + s.label + '" ' +
              'data-pos="' + ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + m.screens.length).slice(-2) + '" style="margin:0">' +
          '<div class="sb-win">' +
            '<div class="sb-win__bar"><span class="sb-win__dots"><i></i><i></i><i></i></span><span class="sb-win__zoom">⤢ Expand</span></div>' +
            '<img class="sb-shot" decoding="async" src="' + BASE + s.src + '" alt="' + m.name + ', ' + s.label + '" style="aspect-ratio:' + s.ar + '">' +
          '</div>' +
          '<figcaption class="sb-cap"><span class="sb-cap__t">' + s.label + '</span>' +
            '<span class="sb-cap__tag">' + ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + m.screens.length).slice(-2) + '</span></figcaption>' +
        '</figure>';
    }).join('');
    return '' +
      '<section class="sb-board" data-screen-label="' + m.name + '">' +
        '<div class="sb-board__head">' +
          '<span class="sb-board__n">' + ('0' + (gi + 1)).slice(-2) + '</span>' +
          '<div class="sb-board__h">' + m.name + '</div>' +
          '<span class="sb-board__c">' + m.screens.length + (m.screens.length === 1 ? ' screen' : ' screens') + '</span>' +
        '</div>' +
        '<div class="sb-board__grid">' + cards + '</div>' +
      '</section>';
  }).join(''); }

  var liveCards = LIVE.map(function (s, i) {
    var num = ('0' + (i + 1)).slice(-2);
    return '' +
      '<figure class="sl-card sb-card--live" data-live="' + LIVE_BASE + s.file + '" ' +
            'data-module="' + s.module + '" data-label="' + s.label + '" data-pos="' + num + ' / ' + ('0' + LIVE.length).slice(-2) + '" style="margin:0">' +
        '<figcaption class="sl-cap">' +
          '<span class="sl-num">' + num + '</span>' +
          '<div class="sl-cap__txt">' +
            '<h4 class="sl-title">' + s.module + '</h4>' +
            '<p class="sl-desc">' + s.desc + '</p>' +
          '</div>' +
          '<span class="sl-live">Live</span>' +
        '</figcaption>' +
        '<div class="sl-frame">' +
          '<div class="sb-live">' +
            '<iframe class="sb-live__f" data-src="' + LIVE_BASE + s.file + '" scrolling="no" tabindex="-1" aria-hidden="true"></iframe>' +
            '<span class="sb-live__hit"></span>' +
          '</div>' +
          '<span class="sl-open">Open live <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3 8L8 3M8 3H4M8 3V7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '</div>' +
      '</figure>';
  }).join('');
  var newBoards = '<section class="sb-board" data-screen-label="Polaris screens">' +
      '<div class="sb-board__grid sb-board__grid--live">' + liveCards + '</div></section>';
  var oldBoards = buildBoards(OLD_MODULES);

  var oldTotal = OLD_MODULES.reduce(function (n, m) { return n + m.screens.length; }, 0);

  var phaseOld =
    '<div class="sb-phase sb-phase--old">' +
      '<div class="sb-phase__bar">' +
        '<span class="sb-phase__k">Before</span>' +
        '<div class="sb-phase__h">The old app builder</div>' +
        '<div class="sb-phase__sub">A dark, dense element editor, heavy panels and low contrast made configuration hard to scan.</div>' +
      '</div>' +
    '</div>' +
    '<div class="sb-boards">' + oldBoards + '</div>';

  var phaseNew =
    '<div class="sb-phase sb-phase--new">' +
      '<div class="sb-phase__bar">' +
        '<span class="sb-phase__k">After</span>' +
        '<div class="sb-phase__h">Rebuilt on Shopify Polaris</div>' +
        '<div class="sb-phase__sub">Light, structured, and native to the Shopify admin. Click any screen to open it.</div>' +
      '</div>' +
    '</div>' +
    '<div class="sb-boards">' + newBoards + '</div>';

  var phaseSys =
    '<div class="sb-phase sb-phase--sys">' +
      '<div class="sb-phase__bar">' +
        '<span class="sb-phase__k">System</span>' +
        '<div class="sb-phase__h">Components &amp; design system</div>' +
        '<div class="sb-phase__sub">A Polaris-aligned kit I built to keep every screen consistent.</div>' +
      '</div>' +
    '</div>' +
    '<div class="sb-sys">' +
      '<p class="sb-sys__lead">Buttons, inputs, selection controls, status tags, tabs, uploads and banners, each component was built once as a reusable Figma component, then composed into the screens above.</p>' +
      '<figure class="sb-sys__sheet" data-src="' + BASE + 'components-sheet.png" data-ar="' + (1200 / 699) + '" data-module="Design system" data-label="Component library" data-pos="01 / 01" style="margin:0">' +
        '<div class="sb-sys__bar"><b>◆ Component library</b><span>16 components · Figma</span></div>' +
        '<img class="sb-sys__img" decoding="async" src="' + BASE + 'components-sheet.png" alt="Polaris-aligned component library" style="aspect-ratio:' + (1200 / 699) + '">' +
      '</figure>' +
      '<div class="sb-sys__tokens">' +
        '<span class="sb-tok"><i style="background:#5a3df0"></i>Primary / #5A3DF0</span>' +
        '<span class="sb-tok"><i style="background:#008060"></i>Success / #008060</span>' +
        '<span class="sb-tok"><i style="background:#1f2430"></i>Ink / #1F2430</span>' +
        '<span class="sb-tok"><i style="background:#eef0f4"></i>Line / #EEF0F4</span>' +
        '<span class="sb-tok"><i style="background:#fff;border-color:#ddd"></i>Surface / #FFFFFF</span>' +
        '<span class="sb-tok">Type / Poppins</span>' +
      '</div>' +
    '</div>';

  window.PROJECT_SCREENS = {
    tag: 'Before / after · ' + LIVE.length + ' screens',
    driver:
      '<div class="sb">' +
        '<style>' + css + '</style>' +
        '<div class="sb-capbar"><span>App builder redesign · <b>Shopify Polaris</b></span><span>Click any "After" screen to open it live</span></div>' +
        phaseOld +
        phaseNew +
        '<div class="sb-note">All "After" screens are interactive — click one to explore it</div>' +
        '<div class="sb-lb" role="dialog" aria-modal="true">' +
          '<div class="sb-lb__win">' +
            '<div class="sb-lb__bar">' +
              '<span class="sb-win__dots"><i></i><i></i><i></i></span>' +
              '<span class="sb-lb__title" data-lb-title></span>' +
              '<span class="sb-lb__sub" data-lb-sub></span>' +
              '<a class="sb-lb__open" data-lb-open target="_blank" rel="noopener" style="display:none">Open ↗</a>' +
              '<button class="sb-lb__x" type="button" aria-label="Close" data-lb-close>✕</button>' +
            '</div>' +
            '<div class="sb-lb__body"><img alt=""><iframe class="sb-lb__frame" title="Live screen" style="display:none"></iframe></div>' +
          '</div>' +
        '</div>' +
      '</div>'
  };

  /* ---------------- lightbox ---------------- */
  function openLightbox(card) {
    var lb = document.querySelector('.sb-lb');
    if (!lb) return;
    if (lb.parentElement !== document.body) document.body.appendChild(lb);
    var live = card.getAttribute('data-live');
    var img = lb.querySelector('.sb-lb__body img');
    var frame = lb.querySelector('.sb-lb__frame');
    var body = lb.querySelector('.sb-lb__body');
    var openLink = lb.querySelector('[data-lb-open]');
    lb.querySelector('[data-lb-title]').textContent = card.getAttribute('data-module') + ' · ' + card.getAttribute('data-label');

    if (live) {
      lb.querySelector('[data-lb-sub]').textContent = 'Live · interactive';
      img.style.display = 'none';
      frame.style.display = 'block';
      if (openLink) { openLink.style.display = ''; openLink.setAttribute('href', live + (location.search || '')); }
      var p2 = Math.max(16, Math.min(56, window.innerWidth * 0.04));
      body.style.width = Math.round(Math.min(window.innerWidth - 2 * p2, 1320)) + 'px';
      body.style.height = Math.round(window.innerHeight - 2 * p2 - 46) + 'px';
      var liveUrl = live + (location.search || '');
      if (frame.getAttribute('src') !== liveUrl) frame.setAttribute('src', liveUrl);
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      return;
    }

    frame.style.display = 'none';
    img.style.display = 'block';
    if (openLink) openLink.style.display = 'none';
    lb.querySelector('[data-lb-sub]').textContent = 'Screen ' + card.getAttribute('data-pos');

    var ar = parseFloat(card.getAttribute('data-ar')) || 1.4;
    img.src = card.getAttribute('data-src');

    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    function fit() {
      var p = Math.max(16, Math.min(56, window.innerWidth * 0.04));
      var availW = window.innerWidth - 2 * p;
      var availH = window.innerHeight - 2 * p - 46;
      // never upscale past the image's true pixel size, or it looks blurry
      var maxW = (img.naturalWidth || availW);
      var w = Math.min(availW, maxW), h = w / ar;
      if (h > availH) { h = availH; w = h * ar; }
      body.style.width = Math.round(w) + 'px';
      body.style.height = Math.round(h) + 'px';
    }
    if (img.complete && img.naturalWidth) requestAnimationFrame(fit);
    else img.onload = fit;
  }
  function closeLightbox() {
    var lb = document.querySelector('.sb-lb');
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  function wire() {
    var lb = document.querySelector('.sb-lb');
    if (!lb || lb.__wired) return;
    if (lb.parentElement !== document.body) document.body.appendChild(lb);
    lb.__wired = true;
    document.addEventListener('click', function (e) {
      var card = e.target.closest && e.target.closest('.sb-card, .sl-card, .sb-sys__sheet');
      if (card && lb.contains(card) === false) { openLightbox(card); return; }
      if (e.target === lb || (e.target.hasAttribute && e.target.hasAttribute('data-lb-close'))) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox();
    });
    window.addEventListener('resize', function () { if (lb.classList.contains('is-open')) closeLightbox(); });
  }

  function sizeLive(box) {
    if (!box) return;
    var f = box.querySelector('.sb-live__f');
    if (!f || !box.clientWidth) return;
    var k = box.clientWidth / LIVE_W;
    f.style.transform = 'scale(' + k + ')';
    if (f.__h) { f.style.height = f.__h + 'px'; box.style.height = Math.round(f.__h * k) + 'px'; }
  }
  function scaleLive() {
    var boxes = document.querySelectorAll('.sb-live');
    for (var i = 0; i < boxes.length; i++) sizeLive(boxes[i]);
  }

  // load the preview iframes only as they near the viewport (deterministic
  // lazy-load; the native loading="lazy" heuristic doesn't fire reliably
  // inside content-visibility cards).
  function lazyLive() {
    var frames = [].slice.call(document.querySelectorAll('.sb-live__f[data-src]'));
    if (!frames.length) return;
    var queue = [], busy = false;
    function next() {
      if (busy) return;
      var f = queue.shift();
      if (!f) return;
      busy = true;
      var fin = function () { if (f.__fin) return; f.__fin = true; f.removeEventListener('load', fin); busy = false; setTimeout(scan, 0); setTimeout(next, 150); };
      f.addEventListener('load', fin);
      setTimeout(fin, 4500); // failsafe so a stalled frame never blocks the queue
      f.src = f.getAttribute('data-src') + (location.search || '');
      f.removeAttribute('data-src');
    }
    function want(f) { if (f && f.getAttribute('data-src') && queue.indexOf(f) < 0) { queue.push(f); next(); } }

    // Primary trigger: IntersectionObserver (independent of which element
    // scrolls). Works now that the live cards are content-visibility:visible.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { io.unobserve(e.target); want(e.target.querySelector('.sb-live__f')); }
        });
      }, { rootMargin: '700px 0px' });
      document.querySelectorAll('.sb-live').forEach(function (b) { io.observe(b); });
    }

    // Fallback trigger: scroll/resize proximity scan. Reading
    // getBoundingClientRect forces layout so positions are always real.
    function scan() {
      var vh = window.innerHeight || 800;
      var pending = document.querySelectorAll('.sb-live__f[data-src]');
      for (var i = 0; i < pending.length; i++) {
        var box = pending[i].closest('.sb-live') || pending[i];
        var r = box.getBoundingClientRect();
        if (r.top < vh + 700 && r.bottom > -700) want(pending[i]);
      }
      if (!document.querySelectorAll('.sb-live__f[data-src]').length && scan.__h) {
        window.removeEventListener('scroll', scan.__h, true);
        window.removeEventListener('resize', scan.__h, true);
      }
    }
    var raf;
    scan.__h = function () { if (raf) return; raf = requestAnimationFrame(function () { raf = null; scan(); }); };
    window.addEventListener('scroll', scan.__h, true);
    window.addEventListener('resize', scan.__h, true);
    scan();
  }

  function boot() {
    if (!document.querySelector('.sb-lb')) { setTimeout(boot, 120); return; }
    wire();
    scaleLive();
    lazyLive();
    requestAnimationFrame(scaleLive);
    setTimeout(scaleLive, 400);
    if (!boot.__msg) {
      boot.__msg = true;
      window.addEventListener('message', function (e) {
        var d = e.data;
        if (!d || typeof d.__omScreenH !== 'number') return;
        var h = Math.max(200, Math.min(d.__omScreenH, 8000)); // clamp: safety net against any runaway report
        var frames = document.querySelectorAll('.sb-live__f');
        for (var i = 0; i < frames.length; i++) {
          if (frames[i].contentWindow === e.source) {
            // ignore tiny jitter; accept first value and meaningful changes only
            if (frames[i].__h && Math.abs(frames[i].__h - h) < 4) break;
            frames[i].__h = h;
            sizeLive(frames[i].closest('.sb-live'));
            break;
          }
        }
      });
    }
    if (!boot.__rs) {
      boot.__rs = true;
      var t;
      window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(scaleLive, 100); });
      if (window.ResizeObserver) {
        var grid = document.querySelector('.sb-board__grid--live');
        if (grid) new ResizeObserver(scaleLive).observe(grid);
      }
    }
  }
  window.__bootShopifyScreens = boot;
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();

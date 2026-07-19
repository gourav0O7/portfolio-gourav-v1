
/* ============================================================
   PROJECT SCREENS, Edgistify Website (marketing-site redesign)
   Sections of the redesigned homepage, captured as flat images
   (screens-img/edge-*). Plain <img> in browser-window cards with
   a designer-led narrative; click any to view full-size.
   Sets window.PROJECT_SCREENS = { tag, driver }.
   ============================================================ */
(function () {
  'use strict';
  if (window.PROJECT_KEY !== 'edgistify-website') return;

  var BASE = 'screens-img/';
  var AR = 924 / 540;
  var MODULES = [
    {
      name: 'The redesigned homepage',
      lead: "The old site was flat, text-heavy and all-green, with no real identity, and it no longer matched the company Edgistify had become. I rebuilt the homepage section by section: a near-black canvas with the brand teal used deliberately, a serif display moment, and a clear hierarchy that finally lets the work breathe.",
      screens: [
        { src: 'edge-home-hero.png', label: 'Hero', ar: AR, feature: true,
          note: "The first screen leads with the promise that actually sells, same-day delivery, Pan-India, set in Outfit on a near-black canvas, with an isometric of the network beside it. The teal ‘Schedule a call’ and ‘Contact Us’ ride the nav, so the page's one job is always in reach.",
          points: ["Brand teal on a confident dark canvas", "One outcome-led headline, not a paragraph", "Schedule-a-call pinned from the top"] },
        { src: 'edge-home-stats.png', label: 'Proof numbers', ar: AR,
          note: "1 Lac+ daily orders, 75+ marketplaces, 50+ cities, 100+ warehouses, the credibility a logistics partner lives on, lifted into a clean card row right under the hero." },
        { src: 'edge-home-design.png', label: '“Design your supply chain”', ar: AR,
          note: "A full-bleed teal break with a Noto Serif display line, the one editorial moment that gives the brand a voice the old site never had, and resets the eye between dark sections." },
        { src: 'edge-home-services.png', label: 'Solutions', ar: AR,
          note: "Tabbed solutions, warehousing, same-day, technology, transportation, each anchored by a hard number like ‘20% cut per order’, so the range reads as outcomes, not a feature list." },
        { src: 'edge-home-industries.png', label: 'Industries', ar: AR,
          note: "Twelve industries as a clean icon grid, so a prospect finds themselves in a glance instead of reading down a paragraph." },
        { src: 'edge-home-why.png', label: 'Why Edgistify', ar: AR,
          note: "Network, platform and expertise as three pillars on dark, the reasons to trust them, stated plainly under one confident line." },
        { src: 'edge-home-network.png', label: 'Pan-India network', ar: AR,
          note: "The reach made concrete, 18000+ pin codes, 50+ cities, 4.5 Lac sq ft, paired with the map, because coverage is the buying decision in logistics." },
        { src: 'edge-home-cta.png', label: 'Talk to an expert', ar: AR,
          note: "The page resolves to one action. Whatever you read, it ends on a teal ‘talk to our supply chain experts’ with the form right there." }
      ]
    }
  ];

  var total = MODULES.reduce(function (n, m) { return n + m.screens.length; }, 0);

  var css = [
'.sb { --sb-accent:#00a699; }',
'.sb-capbar { font-family:var(--font-mono); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-faint); display:flex; justify-content:space-between; align-items:baseline; gap:18px; padding-bottom:14px; border-bottom:1px solid var(--line); margin-bottom:8px; flex-wrap:wrap; }',
'.sb-capbar b { color:var(--sb-accent); font-weight:600; }',
'.sb-boards { display:flex; flex-direction:column; gap:clamp(56px,8vw,104px); }',
'.sb-board__head { display:flex; gap:16px; align-items:baseline; margin:30px 0 16px; }',
'.sb-board__n { font-family:var(--font-mono); font-size:12px; color:var(--sb-accent); flex:none; padding-top:3px; }',
'.sb-board__h { font-size:clamp(22px,2.6vw,30px); font-weight:680; letter-spacing:-0.02em; color:var(--text); }',
'.sb-board__c { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--text-faint); padding-top:6px; }',
'.sb-board__lead { max-width:66ch; font-size:clamp(15px,1.4vw,17px); line-height:1.62; color:var(--text-dim,#aeb4c0); margin:0 0 30px; }',
'.sb-feature { display:grid; grid-template-columns:1.55fr 1fr; gap:clamp(22px,2.6vw,40px); align-items:center; margin-bottom:34px; }',
'.sb-callout__k { font-family:var(--font-mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--sb-accent); }',
'.sb-callout__t { font-size:clamp(15.5px,1.5vw,18px); line-height:1.55; color:var(--text); margin:13px 0 0; font-weight:500; letter-spacing:-0.01em; }',
'.sb-callout__pts { list-style:none; margin:20px 0 0; padding:0; display:flex; flex-direction:column; gap:11px; }',
'.sb-callout__pts li { position:relative; padding-left:21px; font-size:13.5px; line-height:1.5; color:var(--text-faint); }',
'.sb-callout__pts li::before { content:""; position:absolute; left:2px; top:7px; width:7px; height:7px; border-radius:2px; background:var(--sb-accent); }',
'.sb-board__grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:clamp(20px,2.2vw,30px); align-items:start; }',
'.sb-card { display:flex; flex-direction:column; cursor:zoom-in; content-visibility:auto; contain-intrinsic-size:auto 360px; }',
'.sb-win { border:1px solid var(--line); border-radius:11px; overflow:hidden; background:#0c0f17; box-shadow:0 18px 44px -30px rgba(0,0,0,0.5); transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease; }',
'.sb-card:hover .sb-win { transform:translateY(-3px); box-shadow:0 30px 60px -32px rgba(0,0,0,0.55); border-color:var(--sb-accent); }',
'.sb-win__bar { display:flex; align-items:center; gap:9px; padding:8px 11px; background:#181b24; border-bottom:1px solid var(--line); }',
'.sb-win__dots { display:flex; gap:5px; flex:none; }',
'.sb-win__dots i { width:8px; height:8px; border-radius:50%; background:#3a3f4b; display:block; }',
'.sb-win__dots i:nth-child(1){ background:#ec6a5e; } .sb-win__dots i:nth-child(2){ background:#f3bf4f; } .sb-win__dots i:nth-child(3){ background:#61c454; }',
'.sb-win__zoom { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:#6b7280; }',
'.sb-shot { display:block; width:100%; height:auto; background:#0c0f17; }',
'.sb-cap { display:flex; flex-direction:column; gap:6px; padding:12px 3px 0; }',
'.sb-cap__row { display:flex; align-items:baseline; gap:9px; }',
'.sb-cap__t { font-size:14px; font-weight:560; letter-spacing:-0.01em; color:var(--text); line-height:1.3; }',
'.sb-cap__tag { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-faint); padding-top:1px; }',
'.sb-cap__note { font-size:12.5px; line-height:1.5; color:var(--text-faint); margin:0; }',
'.sb-note { margin-top:48px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.06em; color:var(--text-faint); display:flex; align-items:center; gap:10px; }',
'.sb-note::before { content:""; width:18px; height:1px; background:var(--line-2); }',
'@media (max-width:760px){ .sb-feature{ grid-template-columns:1fr; } }',
/* lightbox */
'.sb-lb { position:fixed; inset:0; z-index:9999; background:rgba(8,11,18,0.9); backdrop-filter:blur(6px); display:none; align-items:center; justify-content:center; padding:clamp(16px,4vw,56px); opacity:0; transition:opacity .2s ease; }',
'.sb-lb.is-open { display:flex; opacity:1; }',
'.sb-lb__win { background:#0c0f17; border-radius:12px; overflow:hidden; box-shadow:0 40px 120px -30px rgba(0,0,0,0.8); display:flex; flex-direction:column; max-width:100%; max-height:100%; border:1px solid rgba(255,255,255,0.08); }',
'.sb-lb__bar { display:flex; align-items:center; gap:12px; padding:11px 16px; background:#181b24; border-bottom:1px solid var(--line); flex:none; }',
'.sb-lb__bar .sb-win__dots i { width:11px; height:11px; }',
'.sb-lb__title { font-size:13px; font-weight:600; color:var(--text); }',
'.sb-lb__sub { font-family:var(--font-mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:#6b7280; }',
'.sb-lb__x { margin-left:auto; flex:none; width:30px; height:30px; border-radius:50%; border:1px solid var(--line); background:transparent; color:#aaa; font-size:16px; line-height:1; cursor:pointer; display:flex; align-items:center; justify-content:center; }',
'.sb-lb__x:hover { background:#fff; color:#111; border-color:#fff; }',
'.sb-lb__body { overflow:hidden; background:#0c0f17; flex:none; display:flex; }',
'.sb-lb__body img { display:block; width:100%; height:100%; object-fit:contain; }'
  ].join('\n');

  function winMarkup(s, label) {
    return '<div class="sb-win">' +
      '<div class="sb-win__bar"><span class="sb-win__dots"><i></i><i></i><i></i></span><span class="sb-win__zoom">⤢ Expand</span></div>' +
      '<img class="sb-shot" decoding="async" src="' + BASE + s.src + '" alt="' + label + '" style="aspect-ratio:' + s.ar + '" onerror="this.onerror=null;var u=this.src.split(\'?\')[0];this.src=u+\'?r=\'+Date.now()">' +
    '</div>';
  }
  function cardAttrs(s, m, i, n) {
    return 'data-src="' + BASE + s.src + '" data-ar="' + s.ar + '" data-module="' + m.name + '" data-label="' + s.label + '" ' +
      'data-pos="' + ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + n).slice(-2) + '"';
  }

  function buildBoards(mods) { return mods.map(function (m, gi) {
    var n = m.screens.length;
    var feat = m.screens[0];
    var pts = (feat.points || []).map(function (p) { return '<li>' + p + '</li>'; }).join('');
    var feature =
      '<div class="sb-feature">' +
        '<figure class="sb-card sb-card--feat" ' + cardAttrs(feat, m, 0, n) + ' style="margin:0">' + winMarkup(feat, m.name + ', ' + feat.label) + '</figure>' +
        '<div class="sb-callout">' +
          '<span class="sb-callout__k">' + feat.label + ' · key decision</span>' +
          '<p class="sb-callout__t">' + feat.note + '</p>' +
          (pts ? '<ul class="sb-callout__pts">' + pts + '</ul>' : '') +
        '</div>' +
      '</div>';

    var rest = m.screens.slice(1).map(function (s, idx) {
      var i = idx + 1;
      return '<figure class="sb-card" ' + cardAttrs(s, m, i, n) + ' style="margin:0">' +
          winMarkup(s, m.name + ', ' + s.label) +
          '<figcaption class="sb-cap">' +
            '<div class="sb-cap__row"><span class="sb-cap__t">' + s.label + '</span>' +
              '<span class="sb-cap__tag">' + ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + n).slice(-2) + '</span></div>' +
            (s.note ? '<p class="sb-cap__note">' + s.note + '</p>' : '') +
        '</figcaption></figure>';
    }).join('');

    return '' +
      '<section class="sb-board" data-screen-label="' + m.name + '">' +
        '<div class="sb-board__head">' +
          '<span class="sb-board__n">' + ('0' + (gi + 1)).slice(-2) + '</span>' +
          '<div class="sb-board__h">' + m.name + '</div>' +
          '<span class="sb-board__c">' + n + ' sections</span>' +
        '</div>' +
        '<p class="sb-board__lead">' + m.lead + '</p>' +
        feature +
        '<div class="sb-board__grid">' + rest + '</div>' +
      '</section>';
  }).join(''); }

  window.PROJECT_SCREENS = {
    tag: total + ' SECTIONS',
    driver:
      '<div class="sb">' +
        '<style>' + css + '</style>' +
        '<div class="sb-capbar"><span>Website redesign · <b>Edgistify</b></span><span>Redesigned homepage · click any to view full size</span></div>' +
        '<div class="sb-boards">' + buildBoards(MODULES) + '</div>' +
        '<div class="sb-note">Redesigned marketing site · sections of the homepage</div>' +
        '<div class="sb-lb" role="dialog" aria-modal="true">' +
          '<div class="sb-lb__win">' +
            '<div class="sb-lb__bar">' +
              '<span class="sb-win__dots"><i></i><i></i><i></i></span>' +
              '<span class="sb-lb__title" data-lb-title></span>' +
              '<span class="sb-lb__sub" data-lb-sub></span>' +
              '<button class="sb-lb__x" type="button" aria-label="Close" data-lb-close>✕</button>' +
            '</div>' +
            '<div class="sb-lb__body"><img alt=""></div>' +
          '</div>' +
        '</div>' +
      '</div>'
  };

  /* ---------------- lightbox ---------------- */
  function openLightbox(card) {
    var lb = document.querySelector('.sb-lb');
    if (!lb) return;
    if (lb.parentElement !== document.body) document.body.appendChild(lb);
    lb.querySelector('[data-lb-title]').textContent = card.getAttribute('data-module') + ' · ' + card.getAttribute('data-label');
    lb.querySelector('[data-lb-sub]').textContent = 'Section ' + card.getAttribute('data-pos');

    var ar = parseFloat(card.getAttribute('data-ar')) || 1.7;
    var img = lb.querySelector('.sb-lb__body img');
    var body = lb.querySelector('.sb-lb__body');
    img.src = card.getAttribute('data-src');

    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    function fit() {
      var p = Math.max(16, Math.min(56, window.innerWidth * 0.04));
      var availW = window.innerWidth - 2 * p;
      var availH = window.innerHeight - 2 * p - 46;
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
      var card = e.target.closest && e.target.closest('.sb-card');
      if (card && lb.contains(card) === false) { openLightbox(card); return; }
      if (e.target === lb || (e.target.hasAttribute && e.target.hasAttribute('data-lb-close'))) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('is-open')) closeLightbox();
    });
    window.addEventListener('resize', function () { if (lb.classList.contains('is-open')) closeLightbox(); });
  }

  function boot() {
    if (!document.querySelector('.sb-lb')) { setTimeout(boot, 120); return; }
    wire();
  }
  window.__bootEdgistifyScreens = boot;
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();

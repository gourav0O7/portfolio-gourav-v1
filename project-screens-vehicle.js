
/* ============================================================
   PROJECT SCREENS, Vehicle Maintenance (Omniful TMS)
   Shows the REAL Figma screens, exported from the source file as
   flat images (screens-img/veh-*). Plain <img> in browser-window
   cards, no React, no framework, light and instant.
   Grouped by area; click any screen to view full-size in a lightbox.
   Sets window.PROJECT_SCREENS = { tag, driver }.
   ============================================================ */
(function () {
  'use strict';
  if (window.PROJECT_KEY !== 'vehicle-maintenance') return;

  var BASE = 'screens-img/';
  // Each flow opens with context (lead), leads with a primary screen + a
  // "key decision" callout, then supporting screens each carry a rationale.
  var MODULES = [
    {
      name: 'Reminders',
      heading: 'Knowing what needs you, before it goes overdue',
      lead: "This is where an operator lives day to day, usually on a phone, between trips. I designed the surface to answer one question fast (what needs me now?) and to let them act on it without ever leaving the row.",
      screens: [
        { src: 'veh-reminders-all.png', label: 'All reminders', ar: 656/486, feature: true,
          note: "The default view. Every reminder across the fleet in one table, ordered so overdue and due-soon rise to the top. Status colour and a plain ‘time left’ column carry the urgency, so a scan is enough, you don't read dates to know where things stand.",
          points: ["Colour codes due / due-soon / overdue", "‘Time left’ instead of raw dates", "Act on a row without opening it"] },
        { src: 'veh-reminders-duesoon.png', label: 'Due soon', ar: 656/486,
          note: "Filtered to what's coming up, the planning view for booking a service before anything actually lapses." },
        { src: 'veh-reminders-overdue.png', label: 'Overdue', ar: 656/486,
          note: "The escalation view. Anything past due, pulled out on its own so it can't get lost in a long list." },
        { src: 'veh-reminders-actions.png', label: 'Row actions', ar: 656/486,
          note: "Complete, edit, snooze and delete all hang off the row's overflow menu, the table stays calm until you need it." },
        { src: 'veh-delete-reminder.png', label: 'Delete reminder', ar: 656/486,
          note: "A guarded confirm. Removing a live reminder is easy to regret, so it stops and asks first." },
        { src: 'veh-mark-complete.png', label: 'Mark service complete', ar: 656/486,
          note: "Closing out a service straight from the table, the most common action, kept to a couple of taps." }
      ]
    },
    {
      name: 'Plans, vehicles & history',
      heading: 'Set it up once, and keep a record you can prove',
      lead: "Behind the reminders is the setup and the record: attach a service plan to vehicles once, then log what actually happened so each vehicle builds a history you can trust later.",
      screens: [
        { src: 'veh-vehicles-listing.png', label: 'Vehicles listing', ar: 656/505, feature: true,
          note: "The fleet, with maintenance state visible on every vehicle. It's the entry point for attaching a plan or opening a vehicle's history, and it reuses the TMS vehicles table people already know, so nothing here is new to learn.",
          points: ["Maintenance status shown per vehicle", "Bulk-select to apply a plan to many", "Built on the existing vehicles table"] },
        { src: 'veh-add-reminder.png', label: 'Add reminder', ar: 656/505,
          note: "Setting a reminder in a side-sheet, so the list behind it never disappears while you work." },
        { src: 'veh-add-reminder-config.png', label: 'Configure reminder', ar: 656/505,
          note: "Cadence, task and lead-time, the rules that let a reminder recur on its own instead of being re-entered." },
        { src: 'veh-add-service-history.png', label: 'Add service history', ar: 656/505,
          note: "Logging a finished service with cost, notes and uploaded proof, the step that turns an alert list into an auditable record." },
        { src: 'veh-service-history.png', label: 'Service history', ar: 656/505,
          note: "A vehicle's full timeline of work done, the answer to ‘what's been serviced, and when?’" },
        { src: 'veh-mark-complete-vehicle.png', label: 'Mark as complete', ar: 656/505,
          note: "Completing from inside the vehicle, mirroring the table action so both paths behave identically." }
      ]
    }
  ];

  var total = MODULES.reduce(function (n, m) { return n + m.screens.length; }, 0);

  var css = [
'.sb { --sb-accent:#5468fa; }',
'.sb-capbar { font-family:var(--font-mono); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-faint); display:flex; justify-content:space-between; align-items:baseline; gap:18px; padding-bottom:14px; border-bottom:1px solid var(--line); margin-bottom:8px; flex-wrap:wrap; }',
'.sb-capbar b { color:var(--sb-accent); font-weight:600; }',
'.sb-boards { display:flex; flex-direction:column; gap:clamp(56px,8vw,104px); }',
'.sb-board__head { display:flex; gap:16px; align-items:baseline; margin:30px 0 16px; }',
'.sb-board__n { font-family:var(--font-mono); font-size:12px; color:var(--sb-accent); flex:none; padding-top:3px; }',
'.sb-board__h { font-size:clamp(22px,2.6vw,30px); font-weight:680; letter-spacing:-0.02em; color:var(--text); }',
'.sb-board__c { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--text-faint); padding-top:6px; }',
'.sb-board__lead { max-width:66ch; font-size:clamp(15px,1.4vw,17px); line-height:1.62; color:var(--text-dim,#aeb4c0); margin:0 0 30px; }',
/* feature row: primary screen on a tinted stage + key-decision callout */
'.sb-feature { display:grid; grid-template-columns:1.5fr 1fr; gap:clamp(22px,3vw,48px); align-items:center; margin-bottom:38px; }',
'.sb-stage { position:relative; border-radius:18px; padding:clamp(20px,3vw,40px); background:radial-gradient(120% 130% at 18% 0%, color-mix(in srgb, var(--sb-accent) 22%, transparent), transparent 60%), linear-gradient(160deg, color-mix(in srgb, var(--sb-accent) 13%, var(--bg-1,#12141c)), var(--bg-1,#101218)); border:1px solid color-mix(in srgb, var(--sb-accent) 22%, var(--line)); overflow:hidden; }',
'.sb-stage::before { content:""; position:absolute; inset:0; background:repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0 2px, transparent 2px 9px); pointer-events:none; }',
'.sb-stage .sb-card--feat { margin:0; }',
'.sb-stage .sb-win { box-shadow:0 40px 80px -34px rgba(0,0,0,0.7); }',
'.sb-feat-tag { position:absolute; top:16px; left:16px; z-index:2; font-family:var(--font-mono); font-size:9.5px; letter-spacing:0.16em; text-transform:uppercase; color:#fff; background:var(--sb-accent); padding:5px 10px; border-radius:999px; box-shadow:0 4px 14px -4px color-mix(in srgb, var(--sb-accent) 80%, transparent); }',
'.sb-callout__k { font-family:var(--font-mono); font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--sb-accent); }',
'.sb-callout__t { font-size:clamp(15.5px,1.5vw,18px); line-height:1.55; color:var(--text); margin:13px 0 0; font-weight:500; letter-spacing:-0.01em; }',
'.sb-callout__pts { list-style:none; margin:22px 0 0; padding:0; display:flex; flex-direction:column; gap:14px; counter-reset:sbpt; }',
'.sb-callout__pts li { position:relative; padding-left:36px; font-size:13.5px; line-height:1.5; color:var(--text-dim,#aeb4c0); min-height:24px; display:flex; align-items:center; }',
'.sb-callout__pts li::before { counter-increment:sbpt; content:counter(sbpt,decimal-leading-zero); position:absolute; left:0; top:0; width:24px; height:24px; border-radius:7px; background:color-mix(in srgb, var(--sb-accent) 16%, transparent); border:1px solid color-mix(in srgb, var(--sb-accent) 40%, transparent); color:var(--sb-accent); font-family:var(--font-mono); font-size:10px; font-weight:600; display:flex; align-items:center; justify-content:center; }',
'.sb-board__grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:clamp(20px,2.2vw,30px); align-items:start; }',
'.sb-card { display:flex; flex-direction:column; cursor:zoom-in; content-visibility:auto; contain-intrinsic-size:auto 380px; }',
'.sb-card--feat { cursor:zoom-in; }',
'.sb-win { border:1px solid var(--line); border-radius:11px; overflow:hidden; background:#fff; box-shadow:0 18px 44px -30px rgba(0,0,0,0.5); transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease; }',
'.sb-card:hover .sb-win { transform:translateY(-3px); box-shadow:0 30px 60px -32px rgba(0,0,0,0.55); border-color:var(--sb-accent); }',
'.sb-win__bar { display:flex; align-items:center; gap:9px; padding:8px 11px; background:#f1f1f3; border-bottom:1px solid var(--line); }',
'.sb-win__dots { display:flex; gap:5px; flex:none; }',
'.sb-win__dots i { width:8px; height:8px; border-radius:50%; background:#d0d0d6; display:block; }',
'.sb-win__dots i:nth-child(1){ background:#ec6a5e; } .sb-win__dots i:nth-child(2){ background:#f3bf4f; } .sb-win__dots i:nth-child(3){ background:#61c454; }',
'.sb-win__zoom { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:#a6a6ae; }',
'.sb-shot { display:block; width:100%; height:auto; background:#f1f1f1; }',
'.sb-cap { display:flex; flex-direction:column; gap:6px; padding:12px 3px 0; }',
'.sb-cap__row { display:flex; align-items:baseline; gap:9px; }',
'.sb-cap__t { font-size:14px; font-weight:560; letter-spacing:-0.01em; color:var(--text); line-height:1.3; }',
'.sb-cap__tag { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-faint); padding-top:1px; }',
'.sb-cap__note { font-size:12.5px; line-height:1.5; color:var(--text-faint); margin:0; }',
'.sb-note { margin-top:48px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.06em; color:var(--text-faint); display:flex; align-items:center; gap:10px; }',
'.sb-note::before { content:""; width:18px; height:1px; background:var(--line-2); }',
'@media (max-width:760px){ .sb-feature{ grid-template-columns:1fr; } }',
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
        '<div class="sb-stage">' +
          '<span class="sb-feat-tag">Primary screen</span>' +
          '<figure class="sb-card sb-card--feat" ' + cardAttrs(feat, m, 0, n) + '>' + winMarkup(feat, m.name + ', ' + feat.label) + '</figure>' +
        '</div>' +
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
          '<div class="sb-board__h">' + (m.heading || m.name) + '</div>' +
          '<span class="sb-board__c">' + n + ' screens</span>' +
        '</div>' +
        '<p class="sb-board__lead">' + m.lead + '</p>' +
        feature +
        '<div class="sb-board__grid">' + rest + '</div>' +
      '</section>';
  }).join(''); }

  window.PROJECT_SCREENS = {
    tag: total + ' TMS SCREENS',
    driver:
      '<div class="sb">' +
        '<style>' + css + '</style>' +
        '<div class="sb-capbar"><span>Vehicle maintenance · <b>Omniful TMS</b></span><span>Real Figma screens · click any to view full size</span></div>' +
        '<div class="sb-boards">' + buildBoards(MODULES) + '</div>' +
        '<div class="sb-note">Real screens, exported from the Figma source</div>' +
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
    lb.querySelector('[data-lb-sub]').textContent = 'Screen ' + card.getAttribute('data-pos');

    var ar = parseFloat(card.getAttribute('data-ar')) || 1.5;
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
  window.__bootVehicleScreens = boot;
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();

/* ============================================================
   PROJECT SCREENS, Demand Forecasting (Omniful)
   The case-study "Product" section. Embeds the REAL coded
   forecasting screen(s) LIVE (iframe), scaled to the column;
   click to open full-size + interactive in a lightbox.
   Sets window.PROJECT_SCREENS = { tag, driver }.
   ============================================================ */
(function () {
  'use strict';
  if (window.PROJECT_KEY !== 'demand-forecasting') return;

  var LIVE_BASE = 'demand-live/';
  var LIVE_W = 1512; // design width each screen renders at for the scaled preview
  var LIVE = [
    { file: '10-forecasts.html', module: 'Forecasts workspace', group: 'flow',
      label: 'The planner\u2019s home for demand forecasts',
      desc: 'Every planner lands here \u2014 Key Metrics up top, seller / period / method filters, and a status table where each run reads Generated, Processing or Failed with an inline Retry.' },
    { file: '30-basic-details.html', module: 'Basic Details', group: 'flow', step: 'Step 1',
      label: 'Name it and set the demand context',
      desc: 'Name the forecast, pick the seller, choose how much sales history to train on, and set the hub. Required fields validate inline.' },
    { file: '20-select-sku.html', module: 'Select SKU', group: 'flow', step: 'Step 2',
      label: 'Choose which SKUs to forecast',
      desc: 'Pick how SKUs enter the forecast \u2014 here By Sales Velocity \u2014 and the system pre-groups them into Slow- and Fast-Moving sets, showing what matched and what was excluded.' },
    { file: '40-time-selection.html', module: 'Time Period', group: 'flow', step: 'Step 3',
      label: 'History in, horizon out',
      desc: 'Sets how much past data trains the model and how far ahead it projects. Amber notes surface data-sufficiency risks before the planner commits.' },
    { file: '50-forecast-method.html', module: 'Forecast Method', group: 'flow', step: 'Step 4',
      label: 'Pick the statistical model',
      desc: 'Choose the model \u2014 Moving Average, Exponential Smoothing, Seasonal or Weighted. Each explains its fit and flags where it needs more history than the SKUs have.' },
    { file: '60-forecast-loader.html', module: 'Generating', group: 'flow',
      label: 'The in-progress state',
      desc: 'After Generate, a progress modal shows SKUs being processed with a \u201Crun in background\u201D escape hatch, so a long compute never traps the planner.' },
    { file: '65-toast-success.html', module: 'Success toast', group: 'flow',
      label: 'The run finished while you worked',
      desc: 'Generation completes in the background and announces itself with a toast on the listing \u2014 the planner never has to sit and watch a spinner.' },
    { file: '70-forecast-detail.html', module: 'Forecast Detail', group: 'flow',
      label: 'Read demand, then act on it',
      desc: 'The generated result: run summary, a per-SKU table with trend direction and a confidence bar, and Recommended Actions that lead to a Purchase Order or Stock Transfer.' },
    { file: '75-po-recommendations.html', module: 'PO Recommendations', group: 'flow',
      label: 'From forecast to purchase order',
      desc: 'The recommendation workspace: pending actions on the left, completed on the right. Each card carries the SKU count, sub-total and fulfilment route, with Review and Create PO one tap away.' },
    { file: '80-categories.html', module: 'Categories', group: 'flow',
      label: 'SKU groupings that power forecasts',
      desc: 'SKUs grouped by sales velocity \u2014 fast, slow or mixed \u2014 that forecasts can target. Searchable, filterable, and the entry point for a new category.' },
    { file: '85-create-category.html', module: 'Create Category', group: 'flow',
      label: 'A new grouping, without leaving the list',
      desc: 'Category creation lives in a side sheet: name it, pick the seller, add SKUs as removable chips, and save \u2014 the listing stays in view behind it.' },
    { file: '90-empty-state.html', module: 'Empty state', group: 'edge',
      label: 'Before the first forecast exists',
      desc: 'Zeroed metrics and a single clear call to action \u2014 a brand-new workspace guides the planner to create, instead of showing an empty table.' },
    { file: '28-select-sku-empty.html', module: 'SKU empty state', group: 'edge',
      label: 'When the method matches nothing',
      desc: 'If no SKUs match the chosen method for this seller, the step says so plainly and points to the way out \u2014 try another method or check the catalogue.' },
    { file: '66-toast-fail.html', module: 'Failure toast', group: 'edge',
      label: 'Bad news, delivered usefully',
      desc: 'A failed run announces itself the same way a successful one does \u2014 with the reason and the recovery (retry, or switch method) in the toast itself.' },
    { file: '91-failed-state.html', module: 'Failure diagnosis', group: 'edge',
      label: 'When a run can\u2019t converge',
      desc: 'A failed forecast explains itself: a plain-language reason, a step-by-step diagnostic of what passed and what didn\u2019t, and one-tap recovery with a safer method.' }
  ];
  var PROTO = { file: '10-forecasts.html', module: 'Demand Forecasting' };
  // ordered walkthrough for in-screen Next/Previous navigation
  var FLOW_FILES = LIVE.filter(function (s) { return s.group === 'flow'; }).map(function (s) { return s.file; });

  /* ---------------- styles ---------------- */
  var css = [
'.dg{--ac:#5468FA;--acw:#EEF0FE;}',
/* section head */
'.dg-head{display:flex;align-items:baseline;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--line);margin-bottom:26px;flex-wrap:wrap;}',
'.dg-head h3{font-size:22px;font-weight:650;letter-spacing:-0.02em;color:var(--text);margin:0;}',
'.dg-head .sub{font-size:14px;color:var(--text-soft,#62656e);}',
/* gallery: compact 2-up grid, numbered, soft tinted plinth */
'.dg-gal{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:36px 24px;}',
'.dg-gal .dg-item:first-child{grid-column:1 / -1;}',
'@media(max-width:860px){.dg-gal{grid-template-columns:1fr;}}',
'.dg-item{display:block;min-width:0;}',
'.dg-cap{display:flex;align-items:flex-start;gap:12px;margin:0 2px 12px;height:96px;}',
'.dg-idx{font-family:var(--font-mono);font-size:11px;font-weight:600;letter-spacing:.04em;color:var(--ac);background:var(--acw);border-radius:7px;padding:4px 8px;flex:none;font-variant-numeric:tabular-nums;line-height:1;}',
'.dg-cap__t{flex:1;min-width:0;overflow:hidden;}',
'.dg-step{font-family:var(--font-mono);font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--text-faint,#9a9db0);display:block;margin-bottom:3px;}',
'.dg-cap__t h5{font-size:15px;font-weight:650;letter-spacing:-0.01em;color:var(--text);margin:0 0 4px;line-height:1.25;}',
'.dg-cap__t p{font-size:12.5px;line-height:1.55;color:var(--text-soft,#62656e);margin:0;text-wrap:pretty;max-width:60ch;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}',
'.dg-plinth{background:linear-gradient(160deg,#f6f7fb,#eef0f7);border:1px solid var(--line);border-radius:14px;padding:clamp(10px,1.6vw,16px);}',
'.dg-shot{position:relative;border-radius:10px;overflow:hidden;background:#f2f2f2;cursor:zoom-in;box-shadow:0 0 0 1px rgba(20,24,60,.07),0 2px 6px rgba(20,24,60,.05),0 20px 44px -28px rgba(20,24,60,.32);transition:box-shadow .2s ease,transform .2s ease;}',
'.dg-shot:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(20,24,60,.09),0 3px 8px rgba(20,24,60,.06),0 26px 52px -26px rgba(20,24,60,.42);}',
'.dg-view{position:relative;width:100%;overflow:hidden;background:#f2f2f2;aspect-ratio:1512/920;}',
'.dg-view:not(.is-sized)::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.65) 50%,transparent 70%) no-repeat;background-size:220% 100%;animation:dgshimmer 1.6s ease-in-out infinite;}',
'@keyframes dgshimmer{0%{background-position:130% 0}100%{background-position:-90% 0}}',
'.dg-view iframe{position:absolute;top:0;left:0;width:1512px;border:0;transform-origin:0 0;pointer-events:none;background:#f2f2f2;}',
/* edge subhead */
'.dg-edge-head{display:flex;align-items:center;gap:12px;margin:22px 0 26px;}',
'.dg-edge-head span{font-size:13px;font-weight:600;letter-spacing:.02em;color:var(--text-soft,#62656e);}',
'.dg-edge-head::before{content:"";width:22px;height:1px;background:var(--line-2,#d8dae4);}',
'.dg-edge-head::after{content:"";flex:1;height:1px;background:var(--line-2,#e6e8f0);}',
/* hero mac mockup: live dashboard + micro float */
'.dg-heroview{position:relative;width:100%;aspect-ratio:1512/860;overflow:hidden;background:#f7f7f7;}',
'.dg-heroview iframe{position:absolute;top:0;left:0;width:1512px;height:860px;border:0;transform-origin:0 0;pointer-events:none;background:#f7f7f7;}',
'@media (prefers-reduced-motion: no-preference){',
'  .p-visual .p-macwin,.p-visual .mbook{animation:dgfloat 7s ease-in-out infinite;will-change:transform;}',
'}',
'.p-herodevice--wide{padding:48px 56px;}',
'.p-herodevice--wide .mbook{max-width:760px;margin:0 auto;position:relative;z-index:2;}',
'@media(max-width:720px){.p-herodevice--wide{padding:28px 18px;}}',
'@media (prefers-reduced-motion: no-preference){',
'  @keyframes dgfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}',
'}',
/* live CTA panel, same pattern as the other case studies */
'.pay-live{margin-top:56px;border:1px solid var(--line);background:var(--bg-1);position:relative;}',
'.pay-live::before{content:"";position:absolute;top:12px;left:12px;width:15px;height:15px;border:1px solid var(--line-accent);border-right:0;border-bottom:0;pointer-events:none;}',
'.pay-live::after{content:"";position:absolute;bottom:12px;right:12px;width:15px;height:15px;border:1px solid var(--line-accent);border-left:0;border-top:0;pointer-events:none;}',
'.pay-live__in{padding:clamp(22px,3vw,30px) clamp(24px,4vw,40px);display:flex;align-items:center;gap:24px;flex-wrap:wrap;}',
'.pay-live__eyebrow{flex:0 0 auto;font-family:var(--font-mono);font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);display:inline-flex;align-items:center;gap:10px;}',
'.pay-live__eyebrow::before{content:"";width:24px;height:1px;background:linear-gradient(90deg,transparent,var(--accent));}',
'.pay-live__lede{color:var(--text-dim);font-size:14.5px;line-height:1.6;margin:0;flex:1 1 320px;max-width:62ch;}',
'.pay-live__btn{margin:0;flex:0 0 auto;}',
'.dg-livebtn{display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 24px;border-radius:10px;background:var(--accent,#ff5b2e);color:#fff;font-family:var(--font-mono);font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;border:0;cursor:pointer;}',
'.dg-livebtn:hover{filter:brightness(1.08);}',
'.dg-livebtn svg{width:15px;height:15px;}',
/* live prototype modal (wide, desktop app) */
'.dg-modal{position:fixed;inset:0;z-index:100050;display:none;align-items:center;justify-content:center;padding:max(18px,3vh) 16px;}',
'.dg-modal.is-open{display:flex;}',
'.dg-modal__scrim{position:absolute;inset:0;background:rgba(8,9,14,0.66);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);}',
'.dg-modal__panel{position:relative;z-index:1;width:min(1520px,96vw);height:min(940px,92vh);display:flex;flex-direction:column;background:#0f1016;border:1px solid rgba(255,255,255,0.1);border-radius:14px;overflow:hidden;box-shadow:0 40px 120px -30px rgba(0,0,0,0.8);}',
'.dg-modal__bar{flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:11px 12px 11px 16px;border-bottom:1px solid rgba(255,255,255,0.08);}',
'.dg-modal__title{display:flex;align-items:center;gap:9px;font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.72);}',
'.dg-modal__title .led{width:7px;height:7px;border-radius:50%;background:#46d39a;box-shadow:0 0 0 0 rgba(70,211,154,0.5);animation:dgLed 1.8s ease-out infinite;}',
'@keyframes dgLed{0%{box-shadow:0 0 0 0 rgba(70,211,154,0.5);}70%{box-shadow:0 0 0 6px rgba(70,211,154,0);}100%{box-shadow:0 0 0 0 rgba(70,211,154,0);}}',
'.dg-modal__nav{display:flex;align-items:center;gap:2px;margin:0 auto;padding:3px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:9px;max-width:60%;overflow-x:auto;scrollbar-width:none;}',
'.dg-modal__nav button{font-family:var(--font-mono);font-size:11px;letter-spacing:0.03em;color:rgba(255,255,255,0.62);background:transparent;border:0;padding:5px 11px;border-radius:6px;cursor:pointer;white-space:nowrap;}',
'.dg-modal__nav button:hover{color:#fff;}',
'.dg-modal__nav button.is-on{background:#5468FA;color:#fff;}',
'.dg-modal__close{margin-left:12px;width:34px;height:34px;display:grid;place-items:center;color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;cursor:pointer;flex:0 0 auto;}',
'.dg-modal__close:hover{background:rgba(255,255,255,0.12);color:#fff;}',
'.dg-modal__stage{flex:1 1 auto;position:relative;background:#0d0e14;overflow:hidden;}',
'.dg-modal__stage iframe{display:block;border:0;background:#f7f7f7;transform-origin:0 0;}'
  ].join('\n');

  function galItem(s, i) {
    var idx = ('0' + (i + 1)).slice(-2);
    var step = s.step ? '<span class="dg-step">' + s.step + '</span>' : '';
    return '' +
      '<figure class="dg-item" style="margin:0">' +
        '<figcaption class="dg-cap">' +
          '<span class="dg-idx">' + idx + '</span>' +
          '<div class="dg-cap__t">' + step +
            '<h5>' + s.module + '</h5>' +
            '<p>' + s.desc + '</p>' +
          '</div>' +
        '</figcaption>' +
        '<div class="dg-plinth"><div class="dg-shot" data-open="' + LIVE_BASE + s.file + '">' +
          '<div class="dg-view">' +
            '<iframe data-src="' + LIVE_BASE + s.file + '" scrolling="no" tabindex="-1" aria-hidden="true"></iframe>' +
          '</div>' +
        '</div></div>' +
      '</figure>';
  }

  var flow = LIVE.filter(function (s) { return s.group === 'flow'; });
  var edge = LIVE.filter(function (s) { return s.group === 'edge'; });
  var flowHtml = flow.map(function (s, i) { return galItem(s, i); }).join('');
  var edgeHtml = edge.map(function (s, i) { return galItem(s, flow.length + i); }).join('');

  var navBtns = LIVE.map(function (s, i) {
    return '<button data-nav="' + LIVE_BASE + s.file + '"' + (i === 0 ? ' class="is-on"' : '') + '>' + s.module + '</button>';
  }).join('');

  window.PROJECT_SCREENS = {
    tag: LIVE.length + ' screens',
    driver:
      '<div class="dg">' +
        '<style>' + css + '</style>' +
        '<div class="dg-head"><h3>The flow</h3><span class="sub">From an empty workspace to a forecast you can act on.</span></div>' +
        '<section class="dg-gal" data-screen-label="Core flow">' + flowHtml + '</section>' +
        '<div class="dg-edge-head"><span>Edge cases</span></div>' +
        '<section class="dg-gal" data-screen-label="Edge cases">' + edgeHtml + '</section>' +
      '</div>',
    live:
      '<section class="pay-live reveal" data-screen-label="Live prototype">' +
        '<div class="pay-live__in">' +
          '<span class="pay-live__eyebrow">Prototype</span>' +
          '<p class="pay-live__lede">Walk through the module yourself \u2014 every screen above, full-size, in one place.</p>' +
          '<button class="dg-livebtn pay-live__btn" type="button" data-dg-open>Open prototype' +
            '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0-4-4m4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="dg-modal" role="dialog" aria-modal="true">' +
          '<div class="dg-modal__scrim" data-dg-close></div>' +
          '<div class="dg-modal__panel">' +
            '<div class="dg-modal__bar">' +
              '<span class="dg-modal__title"><span class="led"></span>Demand Forecasting</span>' +
              '<div class="dg-modal__nav">' + navBtns + '</div>' +
              '<button class="dg-modal__close" type="button" aria-label="Close" data-dg-close>' +
                '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2 2 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
              '</button>' +
            '</div>' +
            '<div class="dg-modal__stage"><iframe title="Demand Forecasting prototype"></iframe></div>' +
          '</div>' +
        '</div>' +
      '</section>'
  };

  /* ---------------- modal ---------------- */
  function modalEl(){ return document.querySelector('.dg-modal'); }
  function sizeModal() {
    var m = modalEl();
    if (!m || !m.classList.contains('is-open')) return;
    var stage = m.querySelector('.dg-modal__stage');
    var f = m.querySelector('.dg-modal__stage iframe');
    if (!stage || !f || !stage.clientWidth) return;
    var k = stage.clientWidth / LIVE_W;
    f.style.width = LIVE_W + 'px';
    f.style.transform = 'scale(' + k + ')';
    // fill the stage exactly so there's no black gutter; the screen scrolls inside itself
    f.style.height = Math.round(stage.clientHeight / k) + 'px';
  }
  function openModal(file) {
    var m = modalEl();
    if (!m) return;
    if (m.parentElement !== document.body) document.body.appendChild(m);
    var f = m.querySelector('.dg-modal__stage iframe');
    var target = file || (m.querySelector('[data-nav]') || {}).getAttribute && m.querySelector('[data-nav]').getAttribute('data-nav');
    if (!target) { var fn = m.querySelector('[data-nav]'); target = fn && fn.getAttribute('data-nav'); }
    if (f && target) {
      var url = target + (location.search || '');
      if (f.getAttribute('src') !== url) f.setAttribute('src', url);
      m.querySelectorAll('[data-nav]').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-nav') === target); });
    }
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(sizeModal);
    setTimeout(sizeModal, 60);
  }
  function closeModal() {
    var m = modalEl();
    if (!m) return;
    m.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  // which screen is in the stage right now
  function currentFile() {
    var m = modalEl(); if (!m) return null;
    var f = m.querySelector('.dg-modal__stage iframe');
    var s = f && f.getAttribute('src'); if (!s) return null;
    s = s.split('?')[0];
    return s.indexOf(LIVE_BASE) === 0 ? s.slice(LIVE_BASE.length) : s;
  }
  function goStage(file) {
    var m = modalEl(); if (!m) return;
    var f = m.querySelector('.dg-modal__stage iframe');
    var url = LIVE_BASE + file + (location.search || '');
    if (f.getAttribute('src') !== url) f.setAttribute('src', url);
    m.querySelectorAll('[data-nav]').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-nav') === LIVE_BASE + file); });
    requestAnimationFrame(sizeModal);
  }
  // wire in-screen buttons (Next / Previous / Generate) so the flow actually advances.
  // screens are same-origin, so the parent can attach handlers on each load.
  function wireScreenNav(fr) {
    var doc; try { doc = fr.contentDocument; } catch (e) { return; } if (!doc) return;
    var cur = currentFile(); var idx = FLOW_FILES.indexOf(cur);
    var btns = doc.querySelectorAll('button, .btn-next, .btn-ghost, .btn-primary, .btn-cta, .back, [data-cta], [data-goto]');
    btns.forEach(function (b) {
      if (b.__omWired) return; b.__omWired = true;
      // explicit navigation target wins over any text-based guess (used by the
      // Categories <-> Create Category sheet, and the Purchase Order "View" CTA)
      if (b.hasAttribute('data-goto')) {
        b.addEventListener('click', function (e) { e.preventDefault(); goStage(b.getAttribute('data-goto')); });
        return;
      }
      var t = (b.textContent || '').trim().toLowerCase();
      if (t === 'next' || t === 'continue' || t === 'save & continue' || t === 'save and continue') {
        b.addEventListener('click', function (e) { e.preventDefault(); if (idx >= 0 && idx < FLOW_FILES.length - 1) goStage(FLOW_FILES[idx + 1]); });
      } else if (t === 'previous' || t === 'back' || t === 'go back' || b.classList.contains('back')) {
        // icon-only back arrows (.crumb .back / .dhead .back) carry no text at
        // all, so they never matched here before — treat the class the same
        // as the text match.
        b.addEventListener('click', function (e) { e.preventDefault(); if (idx > 0) goStage(FLOW_FILES[idx - 1]); });
      } else if (t.indexOf('generate') === 0) {
        b.addEventListener('click', function (e) { e.preventDefault(); goStage('60-forecast-loader.html'); setTimeout(function () { if (currentFile() === '60-forecast-loader.html') goStage('70-forecast-detail.html'); }, 2600); });
      } else if (t.indexOf('create forecast') === 0 || t === 'new forecast' || t.indexOf('create new') === 0) {
        b.addEventListener('click', function (e) { e.preventDefault(); goStage('30-basic-details.html'); });
      } else if (t === 'create category') {
        b.addEventListener('click', function (e) { e.preventDefault(); goStage('85-create-category.html'); });
      } else if (t.indexOf('retry') === 0) {
        b.addEventListener('click', function (e) { e.preventDefault(); goStage('60-forecast-loader.html'); setTimeout(function () { if (currentFile() === '60-forecast-loader.html') goStage('70-forecast-detail.html'); }, 2600); });
      } else if (t === 'edit forecast') {
        b.addEventListener('click', function (e) { e.preventDefault(); goStage('30-basic-details.html'); });
      }
    });
  }
  function wire() {
    if (wire.__done) return;
    wire.__done = true;
    var stage0 = document.querySelector('.dg-modal__stage iframe');
    if (stage0) stage0.addEventListener('load', function () { wireScreenNav(stage0); sizeModal(); });
    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-dg-open]')) { openModal(); return; }
      var shot = e.target.closest && e.target.closest('[data-open]');
      if (shot) { openModal(shot.getAttribute('data-open')); return; }
      if (e.target.closest && e.target.closest('[data-dg-close]')) { closeModal(); return; }
      var nav = e.target.closest && e.target.closest('[data-nav]');
      if (nav) {
        var m = modalEl();
        m.querySelectorAll('[data-nav]').forEach(function (b) { b.classList.toggle('is-on', b === nav); });
        m.querySelector('.dg-modal__stage iframe').src = nav.getAttribute('data-nav') + (location.search || '');
        requestAnimationFrame(sizeModal);
      }
    });
    document.addEventListener('keydown', function (e) {
      var m = modalEl();
      if (e.key === 'Escape' && m && m.classList.contains('is-open')) closeModal();
    });
    window.addEventListener('resize', function () { sizeModal(); });
  }

  /* ---------------- scaling ---------------- */
  function sizeView(view) {
    if (!view) return;
    var f = view.querySelector('iframe');
    if (!f || !view.clientWidth) return;
    var k = view.clientWidth / LIVE_W;
    f.style.transform = 'scale(' + k + ')';
    // fixed MacBook-Air-height crop: render the screen tall, let the card clip it
    f.style.height = (f.__h || 1400) + 'px';
    view.classList.add('is-sized');
  }
  function scaleAll() {
    var views = document.querySelectorAll('.dg-view');
    for (var i = 0; i < views.length; i++) sizeView(views[i]);
    var hv = document.querySelector('.dg-heroview');
    if (hv && hv.clientWidth) {
      var f = hv.querySelector('iframe');
      if (f) f.style.transform = 'scale(' + (hv.clientWidth / LIVE_W) + ')';
    }
  }

  /* ---------------- lazy loading (one at a time) ---------------- */
  function lazyAll() {
    var hv = document.querySelector('.dg-heroview iframe[data-src]');
    if (hv) { hv.src = hv.getAttribute('data-src') + (location.search || ''); hv.removeAttribute('data-src'); }
    var views = [].slice.call(document.querySelectorAll('.dg-view'));
    if (!views.length) return;
    var active = 0, queue = [];
    var MAX = 3;
    function pump() {
      while (active < MAX && queue.length) {
        var v = queue.shift();
        var f = v.querySelector('iframe[data-src]');
        if (!f) continue;
        active++;
        (function (fr) {
          var done = function () { if (fr.__d) return; fr.__d = true; fr.removeEventListener('load', done); active--; setTimeout(pump, 60); };
          fr.addEventListener('load', done);
          setTimeout(done, 3500);
          fr.src = fr.getAttribute('data-src') + (location.search || '');
          fr.removeAttribute('data-src');
        })(f);
      }
    }
    function want(v) { if (v && v.querySelector('iframe[data-src]') && queue.indexOf(v) < 0) { queue.push(v); pump(); } }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); want(e.target); } });
      }, { rootMargin: '500px 0px' });
      views.forEach(function (v) { io.observe(v); });
      // after the near-viewport ones get priority, queue the rest anyway so
      // every screen is loaded well before the user scrolls to it
      setTimeout(function () { views.forEach(want); }, 1200);
    } else {
      views.forEach(want);
    }
  }

  function boot() {
    if (!document.querySelector('.dg-gal')) { setTimeout(boot, 120); return; }
    wire();
    scaleAll();
    lazyAll();
    requestAnimationFrame(scaleAll);
    setTimeout(scaleAll, 400);
    if (!boot.__msg) {
      boot.__msg = true;
      window.addEventListener('message', function (e) {
        var d = e.data;
        if (!d || typeof d.__omScreenH !== 'number') return;
        var h = Math.max(200, Math.min(d.__omScreenH, 8000));
        var frames = document.querySelectorAll('.dg-view iframe');
        for (var i = 0; i < frames.length; i++) {
          if (frames[i].contentWindow === e.source) {
            if (frames[i].__h && Math.abs(frames[i].__h - h) < 4) return;
            frames[i].__h = h;
            sizeView(frames[i].closest('.dg-view'));
            return;
          }
        }
      });
    }
    if (!boot.__rs) {
      boot.__rs = true;
      var t;
      window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(scaleAll, 100); });
      if (window.ResizeObserver) {
        var g = document.querySelector('.dg-gal');
        if (g) new ResizeObserver(scaleAll).observe(g);
      }
    }
  }
  window.__bootDemandScreens = boot;
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();

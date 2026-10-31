
/* ============================================================
   PROJECT page renderer (v2) — reads window.PROJECT_KEY + window.PROJECTS
   Builds the case study into #app; nav + footer come from site.js.
   Sections: hero · (sub-projects) · overview · challenge · approach
             · screens · impact · reflection · next
   Each section is conditional on data presence.
   ============================================================ */
(function () {
  'use strict';
  var key = window.PROJECT_KEY;
  var P = (window.PROJECTS || {})[key];
  var root = document.getElementById('app');
  if (!P || !root) { if (root) root.innerHTML = '<p style="padding:120px var(--gutter)">Project not found.</p>'; return; }

  document.title = P.title + ' · Gourav Sharma';
  var nextP = window.PROJECTS[P.next];

  function esc(s){ return String(s == null ? '' : s); }
  function slot(id, attrs) {
    attrs = attrs || '';
    return '<image-slot id="' + id + '" shape="rect" placeholder="Drop image · ' + id + '" ' + attrs + '></image-slot>';
  }

  // running counter for section numbering
  var N = 0;
  function nx(){ N += 1; return ('0' + N).slice(-2); }
  function splitHead(label){
    return '<div class="p-split__label reveal"><span class="n">// ' + nx() + '</span>' + label + '</div>';
  }

  // hero illustration: live product screens (staggered device duo) > iso art > slot
  function deviceFan(proto, altSeed, mainSeed, label){
    function ph(cls, seed){
      return '<div class="p-herostage__ph p-herostage__ph--' + cls + '">' +
        '<iframe loading="lazy" scrolling="no" title="' + label + '" src="' + proto + '?seed=' + seed + '&static=1"></iframe>' +
      '</div>';
    }
    return '<div class="p-herodevice">' +
      '<span class="p-herodevice__glow" aria-hidden="true"></span>' +
      '<div class="p-herostage">' +
        ph('alt', altSeed) +
        ph('main', mainSeed) +
      '</div>' +
    '</div>';
  }
  // a macOS browser window — wraps either a real screenshot (img) or an
  // HTML dummy mockup (inner). Pass exactly one of {src} or {inner}.
  function macWin(o){
    var url = o.url || P.heroUrl || 'app.omniful.com';
    var view = o.inner
      ? '<div class="p-macwin__view p-macwin__view--mk">' + o.inner + '</div>'
      : '<div class="p-macwin__view"><img src="' + o.src + '" alt="' + esc(o.label || '') + '" loading="eager" decoding="async" onerror="this.onerror=null;var s=this.src.split(\'?\')[0];this.src=s+\'?r=\'+Date.now()"></div>';
    return '<figure class="p-macwin">' +
      '<div class="p-macwin__bar">' +
        '<span class="p-macwin__lights"><i></i><i></i><i></i></span>' +
        '<span class="p-macwin__url"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2"/></svg>' + esc(url) + '</span>' +
        '<span class="p-macwin__sp"></span>' +
      '</div>' + view +
    '</figure>';
  }
  function heroShot(src, label){ return macWin({ src: src, label: label }); }
  // a clean front-facing MacBook with the live UI flat on its screen
  function macBook(inner){
    return '<figure class="mbook">' +
      '<div class="mbook__lid">' +
        '<div class="mbook__bezel">' +
          '<span class="mbook__notch"></span>' +
          '<div class="mbook__screen p-macwin__view--mk">' + inner + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="mbook__base"><span class="mbook__dip"></span></div>' +
    '</figure>';
  }
  var heroMock = (window.PROJECT_MOCKUP && window.PROJECT_MOCKUP[key]) || '';
  var heroArt = (window.PROJECT_ART && window.PROJECT_ART[key]) || '';
  var heroVisual =
    (key === 'bulk-otp') ? deviceFan('prototype-bulk-otp.html', 'typed', '', 'Bulk OTP verification') :
    (key === 'dual-payment') ? deviceFan('prototype-collect-payment.html', 'review', '', 'Collect Payment') :
    // Same live driver-app prototype used on this project's homepage card
    // (prototype-driver-bisleri.html?seed=start) — front card matches that
    // exact screen, a stop-detail screen behind it for depth. Previously this
    // key had no special case, so it fell through to the generic CASE_COVER
    // fallback — a flat, low-contrast placeholder meant for projects with NO
    // real screens, which reads as a near-blank hero for a project that does.
    (key === 'route-optimization-bisleri') ? deviceFan('prototype-driver-bisleri.html', 'detail', 'start', 'Bisleri driver app') :
    (key === 'demand-forecasting') ? '<div class="p-herodevice p-herodevice--wide"><span class="p-herodevice__glow" aria-hidden="true"></span>' + macBook('<div class="dg-heroview"><iframe data-src="demand-live/10-forecasts.html" scrolling="no" tabindex="-1" title="Demand Forecasting dashboard"></iframe></div>') + '</div>' :
    (key === 'omniful-ds') ? '<div class="p-herodevice p-herodevice--wide"><span class="p-herodevice__glow" aria-hidden="true"></span>' + macBook('<div style="position:relative;overflow:hidden;background:linear-gradient(150deg,#F4F5FE,#EEF0FE);aspect-ratio:16/10;container-type:inline-size;font-family:Poppins,system-ui,sans-serif;color:#222;padding:2.6cqw 3cqw;display:flex;flex-direction:column;gap:1.6cqw;"><div style="display:flex;align-items:center;justify-content:space-between;"><div style="display:flex;align-items:center;gap:0.7cqw;"><div style="width:1.7cqw;height:1.7cqw;background:#5468FA;border-radius:0.45cqw;transform:rotate(45deg);flex:none;"></div><div style="font-size:1.5cqw;font-weight:700;color:#1A1C21;letter-spacing:-0.01em;">Omniful DS</div></div><div style="font-size:0.95cqw;color:#8C9196;">55 tokens · 230 icons · 30+ components</div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:1.4cqw;flex:1;min-height:0;"><div style="border:1.5px dashed #C7CDFB;border-radius:0.9cqw;padding:1.4cqw;display:flex;flex-direction:column;gap:0.9cqw;background:rgba(255,255,255,0.4);"><div style="display:flex;align-items:center;gap:0.5cqw;font-size:1.05cqw;font-weight:700;color:#5468FA;"><span style="font-size:0.85cqw;">◆</span>Buttons</div><div style="background:#5468FA;color:#fff;border-radius:0.5cqw;padding:0.75cqw;text-align:center;font-weight:600;font-size:1.05cqw;">Button CTA</div><div style="background:#EEF0FE;color:#5468FA;border-radius:0.5cqw;padding:0.75cqw;text-align:center;font-weight:600;font-size:1.05cqw;">Button CTA</div><div style="border:1px solid #DEDEDE;border-radius:0.5cqw;padding:0.75cqw;text-align:center;font-weight:600;font-size:1.05cqw;color:#444;background:#fff;">Button CTA</div></div><div style="border:1.5px dashed #C7CDFB;border-radius:0.9cqw;padding:1.4cqw;display:flex;flex-direction:column;gap:0.9cqw;background:rgba(255,255,255,0.4);"><div style="display:flex;align-items:center;gap:0.5cqw;font-size:1.05cqw;font-weight:700;color:#5468FA;"><span style="font-size:0.85cqw;">◆</span>Tags</div><div style="display:flex;flex-wrap:wrap;gap:0.5cqw;"><span style="background:#E6F1E6;color:#067603;font-size:0.9cqw;font-weight:600;padding:0.35cqw 0.8cqw;border-radius:999px;">Delivered</span><span style="background:#FEE3CE;color:#F9720A;font-size:0.9cqw;font-weight:600;padding:0.35cqw 0.8cqw;border-radius:999px;">Picking</span><span style="background:#E5FCFF;color:#00CFE8;font-size:0.9cqw;font-weight:600;padding:0.35cqw 0.8cqw;border-radius:999px;">In transit</span><span style="background:#FFE5E5;color:#C21808;font-size:0.9cqw;font-weight:600;padding:0.35cqw 0.8cqw;border-radius:999px;">Failed</span></div><div style="display:flex;align-items:center;gap:0.5cqw;font-size:1.05cqw;font-weight:700;color:#5468FA;margin-top:0.4cqw;"><span style="font-size:0.85cqw;">◆</span>Avatars</div><div style="display:flex;"><div style="width:2.6cqw;height:2.6cqw;border-radius:50%;background:#CCD2FD;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:0.9cqw;font-weight:700;color:#495AD9;">AF</div><div style="width:2.6cqw;height:2.6cqw;border-radius:50%;background:#5468FA;border:2px solid #fff;margin-left:-0.7cqw;display:flex;align-items:center;justify-content:center;font-size:0.9cqw;font-weight:700;color:#fff;">OH</div><div style="width:2.6cqw;height:2.6cqw;border-radius:50%;background:#495AD9;border:2px solid #fff;margin-left:-0.7cqw;display:flex;align-items:center;justify-content:center;font-size:0.9cqw;font-weight:700;color:#fff;">YA</div></div></div></div><div style="border:1.5px dashed #C7CDFB;border-radius:0.9cqw;padding:1.4cqw;display:flex;align-items:center;gap:2cqw;background:rgba(255,255,255,0.4);"><div style="display:flex;gap:0.9cqw;"><div><div style="width:4.4cqw;height:3.2cqw;border-radius:0.5cqw;background:#5468FA;"></div><div style="font-size:0.85cqw;color:#8C9196;margin-top:0.35cqw;">500 · #5468FA</div></div><div><div style="width:4.4cqw;height:3.2cqw;border-radius:0.5cqw;background:#CCD2FD;"></div><div style="font-size:0.85cqw;color:#8C9196;margin-top:0.35cqw;">200 · #CCD2FD</div></div><div><div style="width:4.4cqw;height:3.2cqw;border-radius:0.5cqw;background:#067603;"></div><div style="font-size:0.85cqw;color:#8C9196;margin-top:0.35cqw;">Green</div></div><div><div style="width:4.4cqw;height:3.2cqw;border-radius:0.5cqw;background:#F9720A;"></div><div style="font-size:0.85cqw;color:#8C9196;margin-top:0.35cqw;">Orange</div></div></div><div style="flex:1;min-width:0;"><div style="font-size:0.85cqw;color:#8C9196;font-weight:600;">Typography · Poppins</div><div style="font-size:2.2cqw;font-weight:600;color:#1A1C21;letter-spacing:-0.02em;line-height:1.15;">Design system</div></div></div></div>') + '</div>' :
    P.heroImage ? heroShot(P.heroImage, P.heroImageLabel || P.title) :
    (window.CASE_COVER && window.CASE_COVER(key)) ? window.CASE_COVER(key, { hero: true }) :
    heroMock ? macBook(window.mkFrame(heroMock)) :
    heroArt ? '<div class="iso-wrap">' + heroArt + '</div>' :
    slot('proj-hero');

  var arrowUR = '<svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.5"/></svg>';

  // section shell: sticky side label + content column
  function sec(name, inner, cls) {
    return '<section class="cs-sec' + (cls ? ' ' + cls : '') + '"><div class="wrap cs-split">' +
      '<div class="cs-side reveal"><span class="cs-side__n">' + nx() + '</span>' + name + '</div>' +
      '<div class="cs-main">' + inner + '</div>' +
    '</div></section>';
  }
  function wideHead(name, title, aside) {
    return '<div class="sec-head reveal"><div><p class="label"><span class="cs-side__n">' + nx() + '</span>' + name + '</p>' +
      '<h2 class="h2">' + title + '</h2></div>' +
      (aside ? '<p class="sec-head__aside">' + aside + '</p>' : '') + '</div>';
  }
  function findInterviewerPoint(re){
    if (!P.interviewer || !P.interviewer.points) return null;
    for (var i = 0; i < P.interviewer.points.length; i++) {
      if (re.test(P.interviewer.points[i].h)) return P.interviewer.points[i];
    }
    return null;
  }

  /* ---------- HERO ---------- */
  var hero =
    '<header class="cs-hero"><div class="wrap">' +
      '<a class="cs-back" href="index.html#work"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.6"/></svg>All work</a>' +
      '<div class="cs-hero__meta reveal"><span class="cs-hero__idx">Case ' + P.index + '</span><span>' + P.client + '</span><span>' + P.year + '</span></div>' +
      '<h1 class="cs-hero__title reveal">' + P.title + '</h1>' +
      '<p class="cs-hero__one lede reveal">' + P.one + '</p>' +
      '<dl class="cs-facts reveal">' +
        '<div><dt>Role</dt><dd>' + P.meta.role + '</dd></div>' +
        '<div><dt>Timeline</dt><dd>' + P.meta.timeline + '</dd></div>' +
        '<div><dt>Platform</dt><dd>' + P.meta.platform + '</dd></div>' +
        '<div><dt>Team</dt><dd>' + P.meta.team + '</dd></div>' +
      '</dl>' +
    '</div>' +
    '<div class="wrap wrap--wide"><div class="cs-stage reveal">' + heroVisual + '</div></div>' +
    '</header>';

  /* ---------- OVERVIEW ---------- */
  var overviewSec = sec('Overview',
    '<div class="cs-prose reveal">' + P.overview.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>');

  /* ---------- THE CHALLENGE ---------- */
  var reframe = (P.insights && P.insights.lead) ? '<p class="cs-prose reveal">' + P.insights.lead + '</p>' : '';
  var pains = '';
  if (P.insights && P.insights.pains && P.insights.pains.length) {
    pains = '<div class="cs-pains">' + P.insights.pains.map(function (p, i) {
      return '<div class="cs-pain reveal"><span class="cs-pain__n">' + ('0' + (i + 1)).slice(-2) + '</span>' +
        '<h4>' + p.h + '</h4><p>' + p.b + '</p></div>';
    }).join('') + '</div>';
  }
  var evidence = '';
  if (P.evidence && (P.evidence.quote || P.evidence.sample)) {
    var eq = P.evidence.quote;
    evidence = '<figure class="cs-quote reveal">' +
      (eq ? '<blockquote>“' + eq.text + '”</blockquote><figcaption>' + eq.who + '</figcaption>' : '') +
      (P.evidence.sample ? '<p class="cs-quote__sample"><b>Research</b> ' + P.evidence.sample + '</p>' : '') +
    '</figure>';
  }
  var challengeSec = sec('The challenge',
    '<div class="cs-lead reveal">' + P.challenge + '</div>' + reframe + pains + evidence);

  /* ---------- APPROACH ---------- */
  var hardest = findInterviewerPoint(/hardest|decision|the call/i);
  var decisionText = '', decisionLabel = 'The hardest call';
  if (hardest) {
    decisionText = hardest.b;
  } else if (P.ideation && P.ideation.tradeoff) {
    decisionText = P.ideation.tradeoff; decisionLabel = 'The tradeoff';
  } else if (P.validation && P.validation.changes && P.validation.changes.length) {
    var c0 = P.validation.changes[0];
    decisionText = '<b>' + c0.h + '.</b> ' + c0.b; decisionLabel = 'A decision that mattered';
  }
  var steps = '<ol class="cs-steps">' + P.sections.map(function (s) {
    return '<li class="cs-step reveal"><span class="cs-step__k">' + s.k + '</span>' +
      '<div><h3 class="cs-step__h">' + s.h + '</h3><div class="cs-step__b">' + s.b + '</div></div></li>';
  }).join('') + '</ol>';
  var approachSec = sec('Approach',
    '<h2 class="h2 cs-h reveal">Designing the <em>solution.</em></h2>' + steps +
    (decisionText ? '<aside class="cs-call reveal"><span class="cs-call__lbl">' + decisionLabel + '</span><div>' + decisionText + '</div></aside>' : ''));

  /* ---------- SCREENS ---------- */
  var gallery;
  if (window.PROJECT_SCREENS) {
    var PS = window.PROJECT_SCREENS;
    gallery =
      '<section class="cs-sec cs-screens"><div class="wrap">' +
        wideHead('Screens', 'The <em>product.</em>', PS.tag || 'Driver · Admin') +
        '<div class="p-screens">' +
          '<div class="p-screens__group reveal">' + PS.driver + '</div>' +
          (PS.admin ? '<div class="p-screens__group reveal">' + PS.admin + '</div>' : '') +
        '</div>' +
        (PS.live ? PS.live : '') +
      '</div></section>';
  } else {
    gallery =
      '<section class="cs-sec cs-screens"><div class="wrap"><div class="cs-gallery reveal">' +
        slot('proj-g1') + slot('proj-g2') +
        '<div style="grid-column:1/-1">' + slot('proj-g3', 'style="aspect-ratio:21/9"') + '</div>' +
      '</div></div></section>';
  }

  /* ---------- IMPACT ---------- */
  var impactSec = '';
  if (P.impact && P.impact.metrics && P.impact.metrics.length) {
    var cards = P.impact.metrics.map(function (m) {
      var nums = (m.before && m.after)
        ? '<div class="cs-metric__nums"><span class="cs-metric__before">' + m.before + '</span><span class="cs-metric__arrow">→</span><span>' + m.after + '</span></div>'
        : '<div class="cs-metric__nums"><span>' + (m.after || m.value || '') + '</span></div>';
      return '<div class="cs-metric reveal">' + nums +
        '<div class="cs-metric__label">' + m.label + '</div>' +
        (m.source ? '<div class="cs-metric__src">' + m.source + '</div>' : '') +
      '</div>';
    }).join('');
    impactSec =
      '<section class="cs-sec cs-impact"><div class="wrap">' +
        wideHead('Impact', 'What <em>changed.</em>', 'Measured') +
        '<div class="cs-metrics">' + cards + '</div>' +
        (P.impact.note ? '<p class="cs-impact__note reveal">' + P.impact.note + '</p>' : '') +
      '</div></section>';
  }

  /* ---------- REFLECTION ---------- */
  var reflectionSec = '';
  if (P.interviewer) {
    var takeaway = P.interviewer.lead ? P.interviewer.lead.replace(/^What I want you to remember:\s*/i, '') : '';
    var moreP = findInterviewerPoint(/more time|revisit/i);
    reflectionSec = sec('Reflection',
      (takeaway ? '<div class="cs-lead reveal">' + takeaway + '</div>' : '') +
      '<div class="cs-notes">' +
        ((P.learning && P.learning.b) ? '<div class="cs-note reveal"><h4>' + (P.learning.h || 'What surprised me') + '</h4><p>' + P.learning.b + '</p></div>' : '') +
        (moreP ? '<div class="cs-note reveal"><h4>What I’d revisit</h4><p>' + moreP.b + '</p></div>' : '') +
      '</div>');
  }

  /* ---------- NEXT ---------- */
  var nextSec = nextP ?
    '<section class="cs-next"><div class="wrap"><a class="cs-next__card reveal" data-tilt="3" href="project-' + P.next + '.html">' +
      '<span class="label label--plain">Next case · ' + nextP.index + '</span>' +
      '<span class="cs-next__title">' + nextP.title + '</span>' +
      '<span class="cs-next__meta">' + nextP.client + '<span class="cs-next__go">' + arrowUR + '</span></span>' +
    '</a></div></section>' : '';

  /* ---------- Sub-projects: "Inside this app" (umbrella case only) ---------- */
  var subSec = '';
  if (P.subProjects && P.subProjects.length) {
    var subCards = P.subProjects.map(function (k) {
      var sp = (window.PROJECTS || {})[k];
      if (!sp) return '';
      var spTags = (sp.tags || []).slice(0, 3).map(function (t) { return '<span class="chip">' + t + '</span>'; }).join('');
      return '<a class="cs-sub reveal" data-tilt="5" href="project-' + k + '.html">' +
        '<span class="cs-sub__no">' + sp.index + '</span>' +
        '<h3 class="cs-sub__title">' + sp.title + '</h3>' +
        '<p class="cs-sub__desc">' + sp.one + '</p>' +
        (spTags ? '<div class="cs-sub__tags">' + spTags + '</div>' : '') +
        '<span class="cs-sub__go">' + arrowUR + '</span>' +
      '</a>';
    }).join('');
    subSec =
      '<section class="cs-sec"><div class="wrap">' +
        '<div class="sec-head reveal"><div><p class="label">Inside this app</p><h2 class="h2">Featured <em>work.</em></h2></div>' +
        '<p class="sec-head__aside">' + P.subProjects.length + ' features</p></div>' +
        '<div class="cs-subgrid">' + subCards + '</div>' +
      '</div></section>';
  }

  // A case can declare itself public (P.open). Public cases get the wrapper
  // but NOT the #caseGate id, so case-gate.js finds no gate and returns.
  var isOpen = P.open === true;
  var gateOpen = isOpen
    ? '<div class="case-gatewrap">'
    : '<div class="case-gatewrap is-arming" id="caseGate">';

  root.innerHTML =
    '<div data-site-nav></div>' +
    '<main>' +
      hero +
      subSec +
      gateOpen +
        overviewSec +
        challengeSec +
        approachSec +
        gallery +
        impactSec +
        reflectionSec +
      '</div>' +
      nextSec +
    '</main>' +
    '<div data-site-foot></div>';

  if (window.SITE) { window.SITE.mount(root); window.SITE.initReveal(root); if (window.SITE.initTilt) window.SITE.initTilt(root); }

  // scale any HTML mockups injected into the hero (laptop + frames)
  if (typeof window.initLaptops === 'function') window.initLaptops(root);
  if (typeof window.initMockupScale === 'function') window.initMockupScale(root);

  // NDA gate: scrambles everything below the hero until the passphrase is entered
  var g = document.createElement('script');
  g.src = 'case-gate.js';
  document.body.appendChild(g);
})();

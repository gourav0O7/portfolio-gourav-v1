
/* ============================================================
   PROJECT page renderer — reads window.PROJECT_KEY + window.PROJECTS
   Builds the case study, nav, footer; wires shared main.js after.
   Sections render in case-study order:
     hero · problem · goals · research · overview · insights
     · principles · ideation · solution · designSystem
     · gallery · validation · outcomes · interviewer · next
   Each new section is conditional on data presence.
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
    (key === 'omniful-ds') ? '<div class="p-herodevice p-herodevice--wide"><span class="p-herodevice__glow" aria-hidden="true"></span>' + macBook('<div style="position:relative;overflow:hidden;background:#F4F5F7;aspect-ratio:16/10;container-type:inline-size;font-family:Poppins,system-ui,sans-serif;color:#222;display:flex;"><div style="width:9%;background:#fff;border-right:1px solid #EEEFF2;display:flex;flex-direction:column;align-items:center;padding:2.6cqw 0;gap:2.4cqw;"><div style="width:58%;aspect-ratio:1;border-radius:26%;background:#5468FA;"></div><div style="width:58%;aspect-ratio:1;border-radius:26%;background:#EEF0FE;"></div><div style="width:58%;aspect-ratio:1;border-radius:26%;background:#F4F5F7;"></div><div style="width:58%;aspect-ratio:1;border-radius:26%;background:#F4F5F7;"></div><div style="width:58%;aspect-ratio:1;border-radius:26%;background:#F4F5F7;"></div></div><div style="flex:1;padding:3cqw 3.4cqw;min-width:0;"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3cqw;"><div><div style="font-size:2.6cqw;font-weight:600;letter-spacing:-0.02em;">Orders overview</div><div style="font-size:1.3cqw;color:#999;margin-top:0.5cqw;">Riyadh Central hub · live</div></div><div style="display:flex;gap:1.4cqw;align-items:center;"><div style="width:16cqw;height:3.4cqw;border-radius:1cqw;background:#FAFAFA;border:1px solid #DEDEDE;"></div><div style="width:3.4cqw;height:3.4cqw;border-radius:50%;background:#EEF0FE;"></div></div></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1.8cqw;margin-bottom:2.6cqw;"><div style="background:#fff;border:1px solid #EEEFF2;border-radius:1.4cqw;padding:1.8cqw 2cqw;"><div style="font-size:1.2cqw;color:#999;text-transform:uppercase;letter-spacing:0.05em;">Live orders</div><div style="font-size:3.4cqw;font-weight:600;margin-top:0.6cqw;color:#5468FA;">148</div></div><div style="background:#fff;border:1px solid #EEEFF2;border-radius:1.4cqw;padding:1.8cqw 2cqw;"><div style="font-size:1.2cqw;color:#999;text-transform:uppercase;letter-spacing:0.05em;">Dispatched</div><div style="font-size:3.4cqw;font-weight:600;margin-top:0.6cqw;color:#067603;">63</div></div><div style="background:#fff;border:1px solid #EEEFF2;border-radius:1.4cqw;padding:1.8cqw 2cqw;"><div style="font-size:1.2cqw;color:#999;text-transform:uppercase;letter-spacing:0.05em;">In transit</div><div style="font-size:3.4cqw;font-weight:600;margin-top:0.6cqw;color:#0093A6;">29</div></div><div style="background:#fff;border:1px solid #EEEFF2;border-radius:1.4cqw;padding:1.8cqw 2cqw;"><div style="font-size:1.2cqw;color:#999;text-transform:uppercase;letter-spacing:0.05em;">Failed</div><div style="font-size:3.4cqw;font-weight:600;margin-top:0.6cqw;color:#C21808;">3</div></div></div><div style="background:#fff;border:1px solid #EEEFF2;border-radius:1.4cqw;overflow:hidden;"><div style="display:flex;align-items:center;gap:2cqw;padding:1.8cqw 2.2cqw;border-bottom:1px solid #EEEFF2;font-size:1.15cqw;color:#999;font-weight:500;text-transform:uppercase;letter-spacing:0.04em;"><span style="width:24%;">Order</span><span style="width:34%;">Customer</span><span style="width:20%;">Hub</span><span style="margin-left:auto;">Status</span></div><div style="display:flex;align-items:center;gap:2cqw;padding:1.7cqw 2.2cqw;border-top:1px solid #F6F7F9;font-size:1.5cqw;"><span style="width:24%;font-family:JetBrains Mono,monospace;color:#666;">OM-48291</span><span style="width:34%;">Aisha Al-Farsi</span><span style="width:20%;color:#666;">Riyadh C.</span><span style="margin-left:auto;font-size:1.3cqw;font-weight:600;color:#067603;background:#E6F1E6;padding:0.6cqw 1.4cqw;border-radius:1cqw;">Delivered</span></div><div style="display:flex;align-items:center;gap:2cqw;padding:1.7cqw 2.2cqw;border-top:1px solid #F6F7F9;font-size:1.5cqw;"><span style="width:24%;font-family:JetBrains Mono,monospace;color:#666;">OM-48292</span><span style="width:34%;">Omar Haddad</span><span style="width:20%;color:#666;">Riyadh C.</span><span style="margin-left:auto;font-size:1.3cqw;font-weight:600;color:#F9720A;background:#FEE3CE;padding:0.6cqw 1.4cqw;border-radius:1cqw;">Picking</span></div><div style="display:flex;align-items:center;gap:2cqw;padding:1.7cqw 2.2cqw;border-top:1px solid #F6F7F9;font-size:1.5cqw;"><span style="width:24%;font-family:JetBrains Mono,monospace;color:#666;">OM-48293</span><span style="width:34%;">Fatima Noor</span><span style="width:20%;color:#666;">Jeddah W.</span><span style="margin-left:auto;font-size:1.3cqw;font-weight:600;color:#0093A6;background:#E5FCFF;padding:0.6cqw 1.4cqw;border-radius:1cqw;">In transit</span></div><div style="display:flex;align-items:center;gap:2cqw;padding:1.7cqw 2.2cqw;border-top:1px solid #F6F7F9;font-size:1.5cqw;"><span style="width:24%;font-family:JetBrains Mono,monospace;color:#666;">OM-48294</span><span style="width:34%;">Yousef Amir</span><span style="width:20%;color:#666;">Riyadh C.</span><span style="margin-left:auto;font-size:1.3cqw;font-weight:600;color:#067603;background:#E6F1E6;padding:0.6cqw 1.4cqw;border-radius:1cqw;">Delivered</span></div><div style="display:flex;align-items:center;gap:2cqw;padding:1.7cqw 2.2cqw;border-top:1px solid #F6F7F9;font-size:1.5cqw;"><span style="width:24%;font-family:JetBrains Mono,monospace;color:#666;">OM-48295</span><span style="width:34%;">Layla Hassan</span><span style="width:20%;color:#666;">Dammam E.</span><span style="margin-left:auto;font-size:1.3cqw;font-weight:600;color:#C21808;background:#FFE5E5;padding:0.6cqw 1.4cqw;border-radius:1cqw;">Failed</span></div></div></div></div>') + '</div>' :
    P.heroImage ? heroShot(P.heroImage, P.heroImageLabel || P.title) :
    (window.CASE_COVER && window.CASE_COVER(key)) ? window.CASE_COVER(key, { hero: true }) :
    heroMock ? macBook(window.mkFrame(heroMock)) :
    heroArt ? '<div class="iso-wrap">' + heroArt + '</div>' :
    slot('proj-hero');

  var arrowUR = '<svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.4"/></svg>';

  var navHTML =
    '<nav class="nav"><div class="nav__inner">' +
      '<a class="brand" href="index.html"><span class="brand__mark" aria-hidden="true"><svg class="brand__logo" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="31" height="31" rx="6" fill="#0a0c11" stroke="#ff5b2e" stroke-width="1"/><line x1="7" y1="25" x2="25" y2="7" stroke="#ff5b2e" stroke-width="1" stroke-opacity="0.55"/><text x="6" y="13" font-family="Space Grotesk, system-ui, sans-serif" font-size="10" font-weight="600" fill="#ffffff">G</text><text x="20" y="27" font-family="Space Grotesk, system-ui, sans-serif" font-size="10" font-weight="600" fill="#ffffff">S</text></svg><img class="brand__face" src="assets/portrait.png" alt="" /></span><b>GOURAV</b><span>/SHARMA</span></a>' +
      '<div class="nav__links">' +
        '<a href="index.html"><span class="idx">01</span>Index</a>' +
        '<a href="index.html#work" class="active"><span class="idx">02</span>Work</a>' +
        '<a href="about.html"><span class="idx">03</span>About</a>' +
        '<a href="index.html#contact"><span class="idx">04</span>Contact</a>' +
      '</div>' +
      '<a class="btn btn--ghost nav__cta" href="resume.html">Resume ↓</a>' +
      '<button class="nav__burger" aria-label="Menu"><span></span></button>' +
    '</div></nav>' +
    '<div class="drawer">' +
      '<a href="index.html"><span class="idx">01</span>Index</a>' +
      '<a href="index.html#work" class="active"><span class="idx">02</span>Work</a>' +
      '<a href="about.html"><span class="idx">03</span>About</a>' +
      '<a href="index.html#contact"><span class="idx">04</span>Contact</a>' +
      '<a href="resume.html"><span class="idx">→</span>Download Resume</a>' +
    '</div>';

  var metaTop =
    '<div class="p-meta-top">' +
      '<span><span class="i">CASE //</span> ' + P.index + '</span>' +
      '<span><span class="i">CLIENT //</span> ' + P.client + '</span>' +
      '<span><span class="i">YEAR //</span> ' + P.year + '</span>' +
    '</div>';

  var strip =
    '<dl class="p-strip reveal">' +
      '<div><dt>Role</dt><dd>' + P.meta.role + '</dd></div>' +
      '<div><dt>Timeline</dt><dd>' + P.meta.timeline + '</dd></div>' +
      '<div><dt>Platform</dt><dd>' + P.meta.platform + '</dd></div>' +
      '<div><dt>Team</dt><dd>' + P.meta.team + '</dd></div>' +
    '</dl>';

  var overviewParas = P.overview.map(function (p) { return '<p>' + p + '</p>'; }).join('');

  var steps = P.sections.map(function (s) {
    return '<div class="p-step reveal"><div class="p-step__k">' + s.k + ' /</div>' +
      '<div><div class="p-step__h">' + s.h + '</div><div class="p-step__b">' + s.b + '</div></div></div>';
  }).join('');

  var outcomes = (P.outcomes || []).map(function (o) {
    return '<div class="p-outcome reveal"><div class="n">' + o.n + '</div><div class="l">' + o.l + '</div></div>';
  }).join('');

  /* ---------- HERO ---------- */
  var hero =
    '<header class="p-hero" data-screen-label="Project / ' + P.title + '"><div class="wrap">' +
      '<a class="p-back" href="index.html#work"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.4"/></svg> All Work</a>' +
      metaTop +
      '<h1 class="p-title">' + P.title + '</h1>' +
      '<p class="p-one">' + P.one + '</p>' +
      '<div class="p-visual reveal">' + heroVisual +
        '<div class="p-visual__cap"><span>' + P.client + ' · ' + P.meta.platform + '</span><span>' + P.year + '</span></div>' +
      '</div>' +
      strip +
    '</div></header>';

  /* ============================================================
     SENIOR NARRATIVE STRUCTURE
     Overview · The Challenge · Approach · The Product · Reflection
     A tight story, not a checklist of UX deliverables. The richer
     data (goals / research / principles / ideation alts / design
     system / validation) is folded into these few sections.
     ============================================================ */

  // pull a specific point out of the interviewer takeaways
  function findInterviewerPoint(re){
    if (!P.interviewer || !P.interviewer.points) return null;
    for (var i = 0; i < P.interviewer.points.length; i++) {
      if (re.test(P.interviewer.points[i].h)) return P.interviewer.points[i];
    }
    return null;
  }

  /* ---------- 01 · OVERVIEW (context + my role, set the scene) ---------- */
  var overviewSec =
    '<section class="p-section"><div class="wrap"><div class="p-split">' +
      splitHead('Overview') +
      '<div class="p-prose reveal">' + overviewParas + '</div>' +
    '</div></div></section>';

  /* ---------- 02 · THE CHALLENGE (the problem, the reframe, what was really going on) ---------- */
  var reframe = (P.insights && P.insights.lead) ?
    '<p class="p-prose reveal" style="margin-top:26px">' + P.insights.lead + '</p>' : '';
  var painsRows = '';
  if (P.insights && P.insights.pains && P.insights.pains.length) {
    painsRows = '<div class="p-pains reveal" style="margin-top:48px">' + P.insights.pains.map(function (p, i) {
      return '<div class="p-pain"><div class="p-pain__n">' + ('0' + (i + 1)).slice(-2) + '</div>' +
        '<div><h4>' + p.h + '</h4><p>' + p.b + '</p></div></div>';
    }).join('') + '</div>';
  }
  // research evidence: sample size + a real user quote (renders only when present)
  var evidenceBlock = '';
  if (P.evidence && (P.evidence.quote || P.evidence.sample)) {
    var eq = P.evidence.quote;
    evidenceBlock = '<div class="p-evidence reveal" style="margin-top:44px">' +
      (P.evidence.sample ? '<div class="p-evidence__sample"><span class="i">Research //</span> ' + P.evidence.sample + '</div>' : '') +
      (eq ? '<blockquote class="p-quote">\u201C' + eq.text + '\u201D<cite>' + eq.who + '</cite></blockquote>' : '') +
    '</div>';
  }
  var challengeSec =
    '<section class="p-section"><div class="wrap"><div class="p-split">' +
      splitHead('The Challenge') +
      '<div>' +
        '<div class="p-prose big reveal">' + P.challenge + '</div>' +
        reframe +
        painsRows +
        evidenceBlock +
      '</div>' +
    '</div></div></section>';

  /* ---------- 03 · APPROACH (the moves, then the one hard decision) ---------- */
  var hardest = findInterviewerPoint(/hardest|decision|the call/i);
  var decisionText = '', decisionLabel = 'The hardest call';
  if (hardest) {
    decisionText = hardest.b;
  } else if (P.ideation && P.ideation.tradeoff) {
    decisionText = P.ideation.tradeoff; decisionLabel = 'The tradeoff';
  } else if (P.validation && P.validation.changes && P.validation.changes.length) {
    var c0 = P.validation.changes[0];
    decisionText = '<b style="color:var(--text);font-weight:500">' + c0.h + '.</b> ' + c0.b; decisionLabel = 'A decision that mattered';
  }
  var decisionCallout = decisionText ?
    '<div class="p-tradeoff reveal" style="margin-top:16px"><span class="p-tradeoff__lbl">' + decisionLabel + '</span>' + decisionText + '</div>' : '';
  var approachSec =
    '<section class="p-section"><div class="wrap">' +
      '<div class="head-row reveal"><div><div class="eyebrow">// ' + nx() + ' · Approach</div>' +
      '<h2 class="section-title" style="margin-top:18px;">Designing the solution.</h2></div>' +
      '<div class="head-row__count">[ ' + P.sections.length + ' STAGES ]</div></div>' +
      '<div class="p-approach">' + steps + '</div>' +
      decisionCallout +
    '</div></section>';

  /* ---------- gallery (visual breather) ---------- */
  var gallery;
  if (window.PROJECT_SCREENS) {
    // project-specific: replace the placeholder gallery with replica screens
    gallery =
      '<section class="p-section p-screens-sec"><div class="wrap">' +
        '<div class="head-row reveal"><div><div class="eyebrow">// ' + nx() + ' · Screens</div>' +
        '<h2 class="section-title" style="margin-top:18px;">The product.</h2></div>' +
        '<div class="head-row__count">[ ' + (window.PROJECT_SCREENS.tag || 'DRIVER · ADMIN') + ' ]</div></div>' +
        '<div class="p-screens">' +
          '<div class="p-screens__group reveal">' + window.PROJECT_SCREENS.driver + '</div>' +
          (window.PROJECT_SCREENS.admin ? '<div class="p-screens__group reveal">' + window.PROJECT_SCREENS.admin + '</div>' : '') +
        '</div>' +
        (window.PROJECT_SCREENS.live ? window.PROJECT_SCREENS.live : '') +
      '</div></section>';
  } else {
    gallery =
      '<section class="p-section--tight"><div class="wrap"><div class="p-gallery reveal">' +
        slot('proj-g1') + slot('proj-g2') +
        '<div class="wide" style="grid-column:1/-1">' + slot('proj-g3', 'style="aspect-ratio:21/9"') + '</div>' +
      '</div></div></section>';
  }

  /* ---------- IMPACT (real before\u2192after metrics, renders only when present) ---------- */
  var impactSec = '';
  if (P.impact && P.impact.metrics && P.impact.metrics.length) {
    var impactCards = P.impact.metrics.map(function (m) {
      var nums = (m.before && m.after)
        ? '<div class="p-impact__nums"><span class="before">' + m.before + '</span><span class="arrow">\u2192</span><span class="after">' + m.after + '</span></div>'
        : '<div class="p-impact__nums"><span class="after">' + (m.after || m.value || '') + '</span></div>';
      return '<div class="p-impact__card reveal">' + nums +
        '<div class="p-impact__label">' + m.label + '</div>' +
        (m.source ? '<div class="p-impact__src">' + m.source + '</div>' : '') +
      '</div>';
    }).join('');
    impactSec =
      '<section class="p-section"><div class="wrap">' +
        '<div class="head-row reveal"><div><div class="eyebrow">// ' + nx() + ' \u00B7 Impact</div>' +
        '<h2 class="section-title" style="margin-top:18px;">What changed.</h2></div>' +
        '<div class="head-row__count">[ MEASURED ]</div></div>' +
        '<div class="p-impact">' + impactCards + '</div>' +
        (P.impact.note ? '<p class="p-impact__note reveal">' + P.impact.note + '</p>' : '') +
      '</div></section>';
  }

  /* ---------- 05 · REFLECTION (the takeaway + what I'd revisit) ---------- */
  var reflectionSec = '';
  if (P.interviewer) {
    var takeaway = P.interviewer.lead ? P.interviewer.lead.replace(/^What I want you to remember:\s*/i, '') : '';
    var moreP = findInterviewerPoint(/more time|revisit/i);
    var learnP = (P.learning && P.learning.b) ? '<p class="p-prose reveal" style="margin-top:26px"><b style="color:var(--text);font-weight:500">' + (P.learning.h || 'What surprised me') + ': </b>' + P.learning.b + '</p>' : '';
    reflectionSec =
      '<section class="p-section"><div class="wrap"><div class="p-split">' +
        splitHead('Reflection') +
        '<div>' +
          (takeaway ? '<div class="p-prose big reveal">' + takeaway + '</div>' : '') +
          learnP +
          (moreP ? '<p class="p-prose reveal" style="margin-top:26px"><b style="color:var(--text);font-weight:500">What I\u2019d revisit: </b>' + moreP.b + '</p>' : '') +
        '</div>' +
      '</div></div></section>';
  }

  /* ---------- Next ---------- */
  var nextSec =
    '<section class="p-section p-next-sec"><div class="wrap"><div class="p-next"><a href="project-' + P.next + '.html">' +
      '<div class="p-next__lbl">Next<br />Case</div>' +
      '<div><div class="p-next__lbl" style="margin-bottom:10px">' + nextP.index + ' // ' + nextP.client + '</div>' +
      '<div class="p-next__title">' + nextP.title + '</div></div>' +
      '<div class="p-next__arrow">' + arrowUR + '</div>' +
    '</a></div></div></section>';

  var footer =
    '<footer class="footer"><div class="wrap"><div class="footer__grid">' +
      '<div><div class="footer__big">Gourav Sharma<span class="accent">.</span></div>' +
      '<p class="dim" style="margin-top:14px;max-width:36ch;">Product &amp; UI/UX Designer. Designing scalable systems for logistics, SaaS &amp; mobile.</p></div>' +
      '<div class="footer__col"><h4>Navigate</h4>' +
        '<a href="index.html">Index</a><a href="index.html#work">Work</a><a href="about.html">About</a><a href="blog.html">Blogs</a><a href="glossary.html">Glossary</a><a href="resume.html">Resume ↓</a></div>' +
      '<div class="footer__col"><h4>Connect</h4>' +
        '<a href="mailto:gouravsharma.ux@gmail.com">Email</a>' +
        '<a href="https://www.linkedin.com/in/gourav-sharmaux/" target="_blank" rel="noopener">LinkedIn</a>' +
        '<a href="https://www.behance.net/" target="_blank" rel="noopener">Behance</a>' +
        '<a href="#" data-phone-gate>Phone</a></div>' +
    '</div><div class="footer__bar"><span>© 2026 GOURAV SHARMA</span>' +
    '<span>CASE ' + P.index + ' · <span data-clock>--:--:-- UTC</span></span></div></div></footer>';

  /* ---------- Sub-projects: "Inside this app" (umbrella case only) ---------- */
  var subSec = '';
  if (P.subProjects && P.subProjects.length) {
    var subCards = P.subProjects.map(function (k) {
      var sp = (window.PROJECTS || {})[k];
      if (!sp) return '';
      var spTags = (sp.tags || []).slice(0, 3).map(function (t) { return '<span>' + t + '</span>'; }).join('');
      return '<a class="p-subcard reveal" href="project-' + k + '.html">' +
        '<div class="p-subcard__no">' + sp.index + '</div>' +
        '<div class="p-subcard__body">' +
          '<h3 class="p-subcard__title">' + sp.title + '</h3>' +
          '<p class="p-subcard__desc">' + sp.one + '</p>' +
          (spTags ? '<div class="p-subcard__tags">' + spTags + '</div>' : '') +
        '</div>' +
        '<div class="p-subcard__go">' + arrowUR + '</div>' +
      '</a>';
    }).join('');
    subSec =
      '<section class="p-section p-subprojects"><div class="wrap">' +
        '<div class="head-row reveal"><div><div class="eyebrow">// Inside this app</div>' +
        '<h2 class="section-title" style="margin-top:18px;">Featured work.</h2></div>' +
        '<div class="head-row__count">[ ' + ('0' + P.subProjects.length).slice(-2) + ' FEATURES ]</div></div>' +
        '<div class="p-subgrid">' + subCards + '</div>' +
      '</div></section>';
  }

  root.innerHTML = navHTML +
    '<main>' +
      hero +
      subSec +
      '<div class="case-gatewrap is-arming" id="caseGate" data-screen-label="Project / Protected">' +
        overviewSec +
        challengeSec +
        approachSec +
        gallery +
        impactSec +
        reflectionSec +
      '</div>' +
      nextSec +
    '</main>' +
    footer;

  // scale any HTML mockups injected into the hero (laptop photo + frames)
  if (typeof window.initLaptops === 'function') window.initLaptops(root);
  if (typeof window.initMockupScale === 'function') window.initMockupScale(root);

  // upgrade the simple footer into the shared marquee + bigfoot immediately,
  // so when main.js boots the marquees exist and can be animated.
  if (typeof window.__mountBigfoot === 'function') window.__mountBigfoot();

  // load shared behaviour AFTER markup exists
  var s = document.createElement('script');
  s.src = 'main.js';
  document.body.appendChild(s);

  // NDA gate: scrambles everything below the hero until the passphrase is entered
  var g = document.createElement('script');
  g.src = 'case-gate.js';
  document.body.appendChild(g);
})();

/* ============================================================
   PROJECT SCREENS — "This portfolio" (self-initiated)
   Two boards, both rendered as real markup rather than images:

     driver → WIREFRAMES. Low-fidelity, annotated layout studies
              for the three templates the whole site composes from
              (home, case study, mobile), plus the IA map. Drawn in
              CSS so they stay crisp at any zoom and honest about
              being wireframes — grey blocks, no colour, no type.

     admin  → COMPONENT LIBRARY. The actual "Amber Terminal" design
              system this site ships on: token layer, type scale,
              spacing, then LIVE components (real buttons, real
              states) on a dark stage matching their true context —
              not screenshots of a Figma page.

   Sets window.PROJECT_SCREENS = { tag, driver, admin }.
   ============================================================ */
(function () {
  'use strict';
  if (window.PROJECT_KEY !== 'portfolio') return;

  /* ---------------- shared styles (scoped to .pf) ---------------- */
  var css = [
    /* ---- board chrome ---- */
    '.pf{--ink:var(--text);--soft:var(--text-dim);--faint:var(--text-faint);}',
    '.pf-board{margin-bottom:clamp(44px,6vw,84px);}',
    '.pf-board:last-child{margin-bottom:0;}',
    '.pf-head{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;padding-bottom:14px;border-bottom:1px solid var(--line);margin-bottom:8px;}',
    '.pf-head .n{font-family:var(--font-mono);font-size:11px;font-weight:600;letter-spacing:.14em;color:var(--accent);}',
    '.pf-head h3{font-size:clamp(19px,2.2vw,25px);font-weight:650;letter-spacing:-0.02em;color:var(--ink);margin:0;}',
    '.pf-head .c{margin-left:auto;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);}',
    '.pf-lede{font-size:14.5px;line-height:1.65;color:var(--soft);max-width:70ch;margin:14px 0 30px;}',
    '.pf-sub{display:flex;align-items:center;gap:12px;margin:38px 0 20px;}',
    '.pf-sub b{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);font-family:var(--font-mono);}',
    '.pf-sub::after{content:"";flex:1;height:1px;background:var(--line);}',

    /* ---- WIREFRAMES: honest grey-box studies ---- */
    '.pf-wf{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:26px;}',
    '@media(max-width:900px){.pf-wf{grid-template-columns:1fr;}}',
    '.pf-wf__item{min-width:0;}',
    '.pf-wf__cap{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;}',
    '.pf-wf__i{font-family:var(--font-mono);font-size:10.5px;font-weight:600;letter-spacing:.04em;color:var(--accent);background:var(--accent-soft);border-radius:6px;padding:3px 7px;flex:none;line-height:1.5;}',
    '.pf-wf__cap h5{font-size:14px;font-weight:650;color:var(--ink);margin:0 0 3px;letter-spacing:-0.01em;}',
    '.pf-wf__cap p{font-size:12.5px;line-height:1.55;color:var(--soft);margin:0;}',
    /* the frame itself — graph paper, like a real wireframe sheet */
    '.pf-frame{position:relative;border:1px solid var(--line-2);border-radius:8px;padding:14px;background:#fbfbfc;',
    '  background-image:linear-gradient(rgba(18,18,24,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(18,18,24,.045) 1px,transparent 1px);background-size:16px 16px;}',
    '.pf-frame--tall{min-height:430px;}',
    /* generic wireframe primitives */
    '.wf{display:block;background:#dfe0e4;border-radius:3px;}',
    '.wf--line{height:7px;margin-bottom:6px;}',
    '.wf--line.s{width:52%;}.wf--line.m{width:74%;}.wf--line.l{width:92%;}',
    '.wf--head{height:19px;background:#c3c5cb;border-radius:3px;margin-bottom:9px;}',
    '.wf--head.sm{height:13px;width:60%;}',
    '.wf--box{background:#eceef1;border:1px dashed #b9bcc4;border-radius:5px;display:flex;align-items:center;justify-content:center;',
    '  font-family:var(--font-mono);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:#8d9098;text-align:center;padding:6px;}',
    '.wf--btn{height:24px;width:96px;background:#b7bac1;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;',
    '  font-family:var(--font-mono);font-size:9px;letter-spacing:.08em;color:#fff;}',
    '.wf--btn.ghost{background:transparent;border:1px solid #b7bac1;color:#8d9098;}',
    '.wf-row{display:flex;gap:8px;}',
    '.wf-nav{display:flex;align-items:center;gap:8px;border:1px dashed #b9bcc4;border-radius:5px;padding:7px 9px;margin-bottom:12px;background:#f4f5f7;}',
    '.wf-nav .dot{width:14px;height:14px;border-radius:4px;background:#c3c5cb;flex:none;}',
    '.wf-nav .sp{flex:1;}',
    '.wf-sec{margin-bottom:14px;}',
    /* annotation callouts — the reason a wireframe is worth showing */
    '.wf-note{display:flex;gap:7px;align-items:flex-start;margin-top:7px;}',
    '.wf-note i{font-style:normal;font-family:var(--font-mono);font-size:9px;font-weight:600;color:#fff;background:var(--accent);border-radius:50%;width:15px;height:15px;display:flex;align-items:center;justify-content:center;flex:none;margin-top:1px;}',
    '.wf-note span{font-size:11.5px;line-height:1.5;color:var(--soft);}',
    '.pf-notes{margin-top:12px;padding-top:12px;border-top:1px dashed var(--line-2);}',

    /* ---- IA MAP ---- */
    '.pf-ia{border:1px solid var(--line);border-radius:10px;padding:clamp(16px,2.4vw,26px);background:var(--bg-1);}',
    '.pf-ia__row{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch;}',
    '.pf-ia__node{flex:1 1 150px;min-width:0;border:1px solid var(--line-2);border-radius:8px;padding:11px 13px;background:var(--bg);}',
    '.pf-ia__node b{display:block;font-size:12.5px;font-weight:650;color:var(--ink);margin-bottom:3px;}',
    '.pf-ia__node span{font-size:11px;line-height:1.5;color:var(--soft);display:block;}',
    '.pf-ia__node.is-root{border-color:var(--accent);background:var(--accent-soft);}',
    '.pf-ia__arrow{display:flex;align-items:center;justify-content:center;color:var(--faint);font-size:15px;padding:6px 0;}',

    /* ---- COMPONENT LIBRARY ---- */
    '.pf-tokens{display:grid;grid-template-columns:repeat(auto-fill,minmax(184px,1fr));gap:10px;}',
    '.pf-tok{border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--bg);}',
    '.pf-tok__sw{height:52px;border-bottom:1px solid var(--line);}',
    '.pf-tok__m{padding:9px 11px;}',
    '.pf-tok__n{font-family:var(--font-mono);font-size:10.5px;font-weight:600;color:var(--ink);letter-spacing:.02em;display:block;}',
    '.pf-tok__v{font-family:var(--font-mono);font-size:10px;color:var(--faint);display:block;margin-top:2px;}',
    '.pf-tok__r{font-size:11px;line-height:1.45;color:var(--soft);display:block;margin-top:5px;}',

    /* type scale */
    '.pf-type{border:1px solid var(--line);border-radius:10px;overflow:hidden;}',
    '.pf-type__r{display:flex;align-items:baseline;gap:18px;padding:13px 16px;border-bottom:1px solid var(--line);flex-wrap:wrap;}',
    '.pf-type__r:last-child{border-bottom:0;}',
    '.pf-type__s{font-family:var(--font-mono);font-size:10px;letter-spacing:.06em;color:var(--faint);width:150px;flex:none;}',
    '.pf-type__s b{color:var(--ink);font-weight:600;display:block;font-size:11px;margin-bottom:2px;}',
    '.pf-type__d{color:var(--ink);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',

    /* spacing + radius */
    '.pf-scale{display:flex;align-items:flex-end;gap:9px;flex-wrap:wrap;}',
    '.pf-scale__i{text-align:center;}',
    '.pf-scale__b{background:var(--accent);opacity:.82;border-radius:2px;width:26px;}',
    '.pf-scale__l{font-family:var(--font-mono);font-size:9.5px;color:var(--faint);margin-top:5px;display:block;}',

    /* live component stage — dark, matching the components\' real context */
    '.pf-stage{background:#0a0c11;border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:clamp(18px,2.6vw,30px);',
    '  --bg:#0a0c11;--text:#f2f2f2;--text-dim:#9a9a9a;--text-faint:#7d7d7d;--white:#fff;',
    '  --line:rgba(242,242,242,.08);--line-2:rgba(242,242,242,.15);--accent:#fa4c14;--accent-2:#ff6a33;',
    '  --accent-soft:rgba(250,76,20,.10);--accent-glow:rgba(250,76,20,.45);color:#f2f2f2;}',
    '.pf-stage + .pf-stage{margin-top:12px;}',
    '.pf-specrow{display:grid;grid-template-columns:170px 1fr;gap:22px;align-items:start;padding:20px 0;border-bottom:1px solid rgba(242,242,242,.08);}',
    '.pf-specrow:last-child{border-bottom:0;padding-bottom:0;}',
    '.pf-specrow:first-child{padding-top:0;}',
    '@media(max-width:760px){.pf-specrow{grid-template-columns:1fr;gap:12px;}}',
    '.pf-specrow__m b{display:block;font-size:13px;font-weight:650;color:#f2f2f2;margin-bottom:5px;letter-spacing:-0.01em;}',
    '.pf-specrow__m span{display:block;font-size:11.5px;line-height:1.55;color:#9a9a9a;}',
    '.pf-specrow__m code{font-family:var(--font-mono);font-size:10.5px;color:#ff8a5c;background:rgba(250,76,20,.10);border-radius:4px;padding:1px 5px;display:inline-block;margin-top:6px;}',
    '.pf-demo{display:flex;gap:12px;flex-wrap:wrap;align-items:center;}',
    '.pf-state{font-family:var(--font-mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#7d7d7d;display:block;margin-bottom:7px;}',
    '.pf-st{display:flex;flex-direction:column;}',

    /* demo components — real markup, real states */
    '.pfb{display:inline-flex;align-items:center;justify-content:center;gap:9px;font-family:var(--font-mono);font-size:11px;font-weight:500;',
    '  letter-spacing:.1em;text-transform:uppercase;padding:12px 20px;min-height:42px;border:1px solid var(--accent);color:#f2f2f2;',
    '  background:transparent;position:relative;z-index:0;overflow:hidden;cursor:pointer;transition:color .3s var(--ease,cubic-bezier(.22,1,.36,1));}',
    '.pfb::before{content:"";position:absolute;inset:0;background:var(--accent);transform:translateY(101%);transition:transform .35s var(--ease,cubic-bezier(.22,1,.36,1));z-index:-1;}',
    '.pfb:hover::before,.pfb.is-hover::before{transform:translateY(0);}',
    '.pfb:hover,.pfb.is-hover{color:#0a0c11;}',
    '.pfb--primary{background:var(--accent);color:#0a0c11;}',
    '.pfb--ghost{border-color:rgba(242,242,242,.15);}',
    '.pfb--sm{padding:7px 12px;min-height:30px;font-size:10px;}',
    '.pfb--disabled{opacity:.38;pointer-events:none;}',
    '.pfb.is-focus{outline:2px solid var(--accent);outline-offset:3px;}',
    '.pfb .arw{transition:transform .3s var(--ease,cubic-bezier(.22,1,.36,1));}',
    '.pfb:hover .arw,.pfb.is-hover .arw{transform:translateX(4px);}',
    '.pft{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9a;',
    '  border:1px solid rgba(242,242,242,.15);border-radius:999px;padding:6px 13px;display:inline-block;}',
    '.pft.is-on{color:#fa4c14;border-color:rgba(250,76,20,.45);background:rgba(250,76,20,.08);}',
    '.pfdot{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#9a9a9a;}',
    '.pfdot i{width:7px;height:7px;border-radius:50%;background:#fa4c14;box-shadow:0 0 10px rgba(250,76,20,.45);flex:none;}',
    '.pfdot.ok i{background:#46d39a;box-shadow:0 0 10px rgba(70,211,154,.45);}',
    '.pfdot.mute i{background:#7d7d7d;box-shadow:none;}',
    '.pffield{display:flex;align-items:center;gap:9px;border:1px solid rgba(242,242,242,.15);background:#05070b;padding:11px 13px;min-width:230px;}',
    '.pffield span{font-family:var(--font-mono);font-size:11px;color:#fa4c14;}',
    '.pffield input{flex:1;background:none;border:0;outline:0;color:#f2f2f2;font-family:var(--font-mono);font-size:12px;letter-spacing:.16em;min-width:0;}',
    '.pfcard{border:1px solid rgba(242,242,242,.10);background:#101116;padding:16px;max-width:270px;}',
    '.pfcard__m{height:88px;background:radial-gradient(120% 80% at 50% 0%,rgba(250,76,20,.10),transparent 60%),#07080b;border:1px solid rgba(242,242,242,.06);margin-bottom:13px;',
    '  display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:9px;letter-spacing:.14em;color:#5a5c63;}',
    '.pfcard__t{font-size:15px;font-weight:600;color:#f2f2f2;letter-spacing:-0.01em;display:block;}',
    '.pfcard__d{font-size:11.5px;line-height:1.5;color:#9a9a9a;display:block;margin-top:5px;}',
    '.pflock{border:1px solid rgba(250,76,20,.45);background:rgba(10,12,17,.92);padding:11px 15px;display:inline-flex;align-items:center;gap:10px;',
    '  font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#9a9a9a;border-radius:999px;}',
    '.pflock b{color:#fa4c14;font-weight:600;}',
    '.pfenc{font-family:var(--font-mono);font-size:12px;color:#7d7d7d;letter-spacing:.04em;word-break:break-all;line-height:1.7;}',
    '.pfenc em{font-style:normal;color:#fa4c14;opacity:.75;}',

    /* rules / a11y list */
    '.pf-rules{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;}',
    '.pf-rule{border:1px solid var(--line);border-left:2px solid var(--accent);border-radius:0 8px 8px 0;padding:13px 15px;background:var(--bg-1);}',
    '.pf-rule b{display:block;font-size:12.5px;font-weight:650;color:var(--ink);margin-bottom:5px;}',
    '.pf-rule span{font-size:11.5px;line-height:1.55;color:var(--soft);}',
    '.pf-cap{font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-top:14px;display:block;}'
  ].join('');

  /* ---------------- helpers ---------------- */
  function head(n, title, count, lede) {
    return '<div class="pf-head"><span class="n">' + n + '</span><h3>' + title + '</h3><span class="c">' + count + '</span></div>' +
      '<p class="pf-lede">' + lede + '</p>';
  }
  function sub(t) { return '<div class="pf-sub"><b>' + t + '</b></div>'; }
  function note(i, t) { return '<div class="wf-note"><i>' + i + '</i><span>' + t + '</span></div>'; }
  function wfItem(idx, title, desc, frame, notes) {
    return '<div class="pf-wf__item">' +
      '<div class="pf-wf__cap"><span class="pf-wf__i">' + idx + '</span><div><h5>' + title + '</h5><p>' + desc + '</p></div></div>' +
      '<div class="pf-frame pf-frame--tall">' + frame + '</div>' +
      (notes ? '<div class="pf-notes">' + notes + '</div>' : '') +
    '</div>';
  }

  /* ---------------- WIREFRAMES ---------------- */
  var wfNav = '<div class="wf-nav"><span class="dot"></span><span class="sp"></span><span class="wf wf--line s" style="width:52px;margin:0"></span></div>';

  // 01 · Home
  var wfHome =
    wfNav +
    '<div class="wf-sec" style="display:grid;grid-template-columns:1.05fr .95fr;gap:12px;align-items:center;min-height:150px">' +
      '<div>' +
        '<span class="wf wf--line s" style="height:6px;width:44%"></span>' +
        '<div class="wf--head" style="height:26px"></div><div class="wf--head" style="height:26px;width:78%"></div>' +
        '<span class="wf wf--line l" style="margin-top:10px"></span><span class="wf wf--line l"></span><span class="wf wf--line m"></span>' +
      '</div>' +
      '<div class="wf--box" style="min-height:132px">3D object · differentiator</div>' +
    '</div>' +
    '<div class="wf-sec"><div class="wf--head sm"></div>' +
      '<div class="wf-row"><div class="wf--box" style="flex:1;min-height:46px">stat</div><div class="wf--box" style="flex:1;min-height:46px">stat</div><div class="wf--box" style="flex:1;min-height:46px">stat</div><div class="wf--box" style="flex:1;min-height:46px">stat</div></div>' +
    '</div>' +
    '<div class="wf-sec"><div class="wf--head sm"></div>' +
      '<div class="wf-row" style="align-items:stretch">' +
        '<div class="wf--box" style="flex:1.35;min-height:104px">case card · live product</div>' +
        '<div class="wf--box" style="flex:1;min-height:104px;opacity:.55">next →</div>' +
      '</div>' +
    '</div>' +
    '<div class="wf-row" style="justify-content:space-between;align-items:center">' +
      '<span class="wf wf--line s" style="width:96px;margin:0"></span><span class="wf--btn">CONTACT</span>' +
    '</div>';

  // 02 · Case study
  var wfCase =
    wfNav +
    '<div class="wf-sec">' +
      '<span class="wf wf--line s" style="height:6px;width:38%"></span>' +
      '<div class="wf--head" style="height:24px;width:70%"></div>' +
      '<span class="wf wf--line l"></span><span class="wf wf--line m"></span>' +
      '<div class="wf--box" style="min-height:96px;margin-top:11px">hero · real product screen</div>' +
    '</div>' +
    '<div class="wf-sec" style="display:grid;grid-template-columns:100px 1fr;gap:12px">' +
      '<span class="wf wf--line" style="height:9px;width:76px"></span>' +
      '<div><span class="wf wf--line l"></span><span class="wf wf--line l"></span><span class="wf wf--line m"></span></div>' +
    '</div>' +
    '<div class="wf-sec" style="display:grid;grid-template-columns:100px 1fr;gap:12px">' +
      '<span class="wf wf--line" style="height:9px;width:60px"></span>' +
      '<div class="wf-row"><div class="wf--box" style="flex:1;min-height:52px">problem</div><div class="wf--box" style="flex:1;min-height:52px">insight</div><div class="wf--box" style="flex:1;min-height:52px">principle</div></div>' +
    '</div>' +
    '<div class="wf--box" style="min-height:74px;border-style:solid;border-color:#c9723f;background:#f7efe9">locked · NDA state</div>';

  // 03 · Mobile
  var wfMobile =
    '<div style="display:flex;gap:14px;justify-content:center;align-items:flex-start">' +
      '<div style="width:132px;flex:none">' +
        '<div style="border:1px solid #b9bcc4;border-radius:12px;padding:8px;background:#fff">' +
          '<div class="wf-nav" style="margin-bottom:8px;padding:5px 6px"><span class="dot" style="width:10px;height:10px"></span><span class="sp"></span><span class="wf" style="width:20px;height:5px"></span></div>' +
          '<span class="wf wf--line s" style="height:5px"></span>' +
          '<div class="wf--head" style="height:17px"></div><div class="wf--head" style="height:17px;width:72%"></div>' +
          '<span class="wf wf--line l" style="height:5px"></span><span class="wf wf--line l" style="height:5px"></span><span class="wf wf--line m" style="height:5px"></span>' +
          '<div class="wf--box" style="min-height:74px;margin-top:8px;font-size:8px">3D · below copy</div>' +
        '</div>' +
        '<span class="pf-cap" style="text-align:center;display:block">Hero — stacked</span>' +
      '</div>' +
      '<div style="width:132px;flex:none">' +
        '<div style="border:1px solid #b9bcc4;border-radius:12px;padding:8px;background:#fff">' +
          '<div class="wf--box" style="min-height:56px;font-size:8px">static poster</div>' +
          '<div style="margin-top:8px"><span class="wf wf--line" style="height:9px;width:80%"></span>' +
          '<span class="wf wf--line l" style="height:5px"></span><span class="wf wf--line m" style="height:5px"></span></div>' +
          '<div class="wf-row" style="margin-top:8px;gap:5px"><span class="wf" style="height:14px;width:38px;border-radius:999px"></span><span class="wf" style="height:14px;width:30px;border-radius:999px"></span></div>' +
          '<span class="wf--btn" style="margin-top:9px;width:100%;height:20px;font-size:7px">VIEW CASE</span>' +
        '</div>' +
        '<span class="pf-cap" style="text-align:center;display:block">Card — content-sized</span>' +
      '</div>' +
    '</div>';

  var wireframes =
    '<div class="pf">' +
      '<style>' + css + '</style>' +
      head('01', 'Wireframes &amp; information architecture', '3 templates',
        'The whole site is three templates and one component set. I wireframed at low fidelity deliberately — the arguments here are about hierarchy and what earns space, and colour would only have hidden a weak layout. Annotations mark the decisions that survived to the live build.') +

      sub('Structure — what the site is made of') +
      '<div class="pf-ia">' +
        '<div class="pf-ia__row">' +
          '<div class="pf-ia__node is-root"><b>Home</b><span>The argument: who I am, what I do, proof.</span></div>' +
        '</div>' +
        '<div class="pf-ia__arrow">↓</div>' +
        '<div class="pf-ia__row">' +
          '<div class="pf-ia__node"><b>Work rail</b><span>12 cases, pinned horizontal gallery with live product in each card.</span></div>' +
          '<div class="pf-ia__node"><b>About</b><span>Trajectory, the human bits, the résumé path.</span></div>' +
          '<div class="pf-ia__node"><b>Design system</b><span>The Omniful system, rendered live and NDA-locked.</span></div>' +
        '</div>' +
        '<div class="pf-ia__arrow">↓</div>' +
        '<div class="pf-ia__row">' +
          '<div class="pf-ia__node"><b>Case study ×12</b><span>One template. Overview → Challenge → Approach → Product → Impact → Reflection. Locked by default, public when self-initiated.</span></div>' +
          '<div class="pf-ia__node"><b>Live prototypes</b><span>Real clickable mini-apps embedded into the cases they belong to.</span></div>' +
        '</div>' +
      '</div>' +

      sub('Layout studies') +
      '<div class="pf-wf">' +
        wfItem('01', 'Home — one screen, one claim',
          'Everything above the fold answers "who is this and can they think?". The 3D object earns its place by being the only thing that makes the site memorable.',
          wfHome,
          note(1, 'Copy left, object right — the claim reads first, the craft signal second.') +
          note(2, 'Stats as proof, immediately under the claim. Numbers before narrative.') +
          note(3, 'Case cards carry the live product, not a thumbnail — evidence over screenshot.')) +
        wfItem('02', 'Case study — argument, then evidence',
          'A fixed narrative spine every case fills in. Screens only appear after the problem and the thinking have been stated.',
          wfCase,
          note(1, 'Problem and reframe before any visual. If the thinking is weak, no screenshot saves it.') +
          note(2, 'Two-column split: section label pinned left, prose right — scannable at speed.') +
          note(3, 'The NDA state is designed, not an apology — a deliberate encrypted block.')) +
      '</div>' +

      sub('Mobile — the real test') +
      '<p class="pf-lede" style="margin-top:0">A recruiter on mobile data is the honest test case, so mobile isn\'t a squeeze of the desktop layout — several compositions invert. The hero stacks so copy is never behind the 3D object, and heavy embedded prototypes swap for static posters.</p>' +
      wfMobile +
    '</div>';

  /* ---------------- COMPONENT LIBRARY ---------------- */
  function tok(name, val, role, sw) {
    return '<div class="pf-tok"><div class="pf-tok__sw" style="background:' + (sw || val) + '"></div>' +
      '<div class="pf-tok__m"><span class="pf-tok__n">' + name + '</span><span class="pf-tok__v">' + val + '</span>' +
      '<span class="pf-tok__r">' + role + '</span></div></div>';
  }
  function typeRow(name, spec, sample, style) {
    return '<div class="pf-type__r"><span class="pf-type__s"><b>' + name + '</b>' + spec + '</span>' +
      '<span class="pf-type__d" style="' + style + '">' + sample + '</span></div>';
  }
  function specRow(title, desc, code, demo) {
    return '<div class="pf-specrow"><div class="pf-specrow__m"><b>' + title + '</b><span>' + desc + '</span>' +
      (code ? '<code>' + code + '</code>' : '') + '</div><div class="pf-demo">' + demo + '</div></div>';
  }
  function st(label, el) { return '<div class="pf-st"><span class="pf-state">' + label + '</span>' + el + '</div>'; }

  var arw = '<svg class="arw" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H5M12 4V11" stroke="currentColor" stroke-width="1.6"/></svg>';

  var spacing = [4, 8, 12, 18, 26, 38, 56, 80].map(function (n) {
    return '<div class="pf-scale__i"><div class="pf-scale__b" style="height:' + Math.round(n * 0.85) + 'px"></div><span class="pf-scale__l">' + n + '</span></div>';
  }).join('');

  var library =
    '<div class="pf">' +
      head('02', 'Component library — “Amber Terminal”', 'Design system',
        'The system the entire site ships on. It exists for one reason: adding a new case study should be a data entry, not a redesign. Everything below is live markup rendered by the same rules the real pages use — the buttons are real buttons, in real states.') +

      sub('Foundations — colour') +
      '<p class="pf-lede" style="margin-top:0">One accent carries every interactive affordance. Two complete themes are defined purely as token values, so a full palette swap needs no component changes at all.</p>' +
      '<div class="pf-tokens">' +
        tok('--bg', '#000000', 'Page ground. Near-absolute black so the accent reads as light.', '#000') +
        tok('--bg-1 / --bg-2', '#030303 · #0a0a0a', 'Raised panels and card surfaces.', 'linear-gradient(90deg,#030303 50%,#0a0a0a 50%)') +
        tok('--accent', '#fa4c14', 'Every interactive affordance — CTAs, focus, active state.', '#fa4c14') +
        tok('--accent-2', '#ff6a33', 'Gradient partner and hover lift on the accent.', '#ff6a33') +
        tok('--text', '#f2f2f2', 'Primary copy. Off-white, never pure, to cut glare on black.', '#f2f2f2') +
        tok('--text-dim', '#9a9a9a', 'Secondary copy and descriptions.', '#9a9a9a') +
        tok('--text-faint', '#7d7d7d', 'Mono metadata, labels, timestamps.', '#7d7d7d') +
        tok('--line', 'rgba(242,242,242,.06)', 'Hairline dividers and resting card borders.', '#1a1a1a') +
      '</div>' +
      '<span class="pf-cap">Gold theme — the same tokens, re-valued: --bg #f2a81e · --text #1a1206 · --accent #1a1206 (ink on gold, a full duotone inversion)</span>' +

      sub('Foundations — type') +
      '<div class="pf-type">' +
        typeRow('Display XL', 'Space Grotesk · 500', 'Gourav Sharma', 'font-size:34px;font-weight:500;letter-spacing:-0.03em') +
        typeRow('Section title', 'Space Grotesk · 500', 'Work that shipped.', 'font-size:25px;font-weight:500;letter-spacing:-0.025em') +
        typeRow('Body', 'Space Grotesk · 400 / 1.7', 'Designed for operators who read a thousand rows a day.', 'font-size:15px;line-height:1.7') +
        typeRow('Eyebrow', 'JetBrains Mono · 600 · 0.18em', '// SELECTED WORK', 'font-family:var(--font-mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--accent)') +
        typeRow('Meta', 'JetBrains Mono · 400 · 0.12em', '[ 13 PROJECTS // 2022 — 2026 ]', 'font-family:var(--font-mono);font-size:11px;letter-spacing:.12em;color:var(--text-faint)') +
      '</div>' +
      '<span class="pf-cap">Two families only. Space Grotesk carries voice; JetBrains Mono carries system metadata — the split is what makes the interface read as an instrument.</span>' +

      sub('Foundations — spacing, radius, motion') +
      '<div class="pf-scale">' + spacing + '</div>' +
      '<span class="pf-cap">Spacing scale (px) — roughly 1.4× steps. Radius is deliberately near-zero: square corners read as terminal, not consumer app. Motion: one shared easing, cubic-bezier(0.22, 1, 0.36, 1), 0.3–0.7s.</span>' +

      sub('Components — live') +
      '<div class="pf-stage">' +
        specRow('Button', 'One component, three variants and one size modifier. The hover is a fill-wipe rising from the bottom edge — used site-wide so any accent fill behaves identically.',
          '.btn · .btn--primary · .btn--ghost · .btn--sm',
          st('rest', '<span class="pfb">Start a project ' + arw + '</span>') +
          st('hover', '<span class="pfb is-hover">Start a project ' + arw + '</span>') +
          st('primary', '<span class="pfb pfb--primary">View case ' + arw + '</span>') +
          st('ghost / sm', '<span class="pfb pfb--ghost pfb--sm">View case ' + arw + '</span>') +
          st('focus', '<span class="pfb is-focus">Focus ring</span>') +
          st('disabled', '<span class="pfb pfb--disabled">Unavailable</span>')) +

        specRow('Tag', 'Non-interactive classification. Pill shape is reserved exclusively for tags so it never competes with a button.',
          '.tag',
          st('rest', '<span class="pft">Logistics</span>') +
          st('active', '<span class="pft is-on">Design System</span>') +
          st('group', '<span class="pft">B2B</span> <span class="pft">Mobile</span>')) +

        specRow('Status', 'A single dot carries system state. Colour is never the only signal — the label always states it in words.',
          '.pip · aria-live',
          st('live', '<span class="pfdot"><i></i>Recording</span>') +
          st('ok', '<span class="pfdot ok"><i></i>Deployed</span>') +
          st('idle', '<span class="pfdot mute"><i></i>Archived</span>')) +

        specRow('Field', 'Square, mono, ground-dark. Caret prefix marks it as a command line rather than a form input.',
          '.cg-hud__field',
          '<label class="pffield"><span>&gt;</span><input type="text" placeholder="PASSPHRASE" aria-label="Passphrase demo" /></label>') +
      '</div>' +

      '<div class="pf-stage">' +
        specRow('Case card', 'The workhorse. Media well on top, then title, description, tags and the shared CTA. On mobile the media sizes to its content instead of reserving a fixed viewport height.',
          '.casecard',
          '<div class="pfcard"><div class="pfcard__m">LIVE PRODUCT</div>' +
            '<span class="pfcard__t">Demand forecasting</span>' +
            '<span class="pfcard__d">From a chart the planner can trust to a purchase order, in one step.</span>' +
            '<div style="margin-top:12px;display:flex;gap:7px"><span class="pft" style="font-size:9px;padding:4px 10px">Data</span><span class="pft" style="font-size:9px;padding:4px 10px">Web</span></div>' +
          '</div>') +

        specRow('NDA lock', 'The system\'s signature state. Confidential copy is replaced in the DOM with scrambled glyphs and visuals seal behind an access cover; the correct passphrase resolves each character back to its real value.',
          'case-gate.js · .cg-enc',
          '<div style="min-width:0;flex:1">' +
            '<div class="pflock">🔒 Locked <b>// NDA</b> · Enter password</div>' +
            '<div class="pfenc" style="margin-top:12px">Th<em>#</em> pl<em>4</em>nner c<em>@</em>n tr<em>~</em>st <em>}</em> a p<em>%</em>rch<em>&amp;</em>se or<em>*</em>er, <em>[</em>n one st<em>3</em>p.</div>' +
          '</div>') +
      '</div>' +

      sub('Shared behaviours') +
      '<div class="pf-rules">' +
        '<div class="pf-rule"><b>Hover scramble</b><span>Every CTA label cycles through random glyphs and resolves left-to-right, like a departure board. One shared script wires it to every link and button on the site.</span></div>' +
        '<div class="pf-rule"><b>Fill-wipe</b><span>Accent fills always rise from the bottom edge, never fade. Applied identically to buttons, cards and nav items so the whole interface moves as one mechanism.</span></div>' +
        '<div class="pf-rule"><b>Scroll reveal</b><span>Headings rise into place through a clipped mask, staggered word by word. Fires once, never on re-entry — repetition reads as noise.</span></div>' +
        '<div class="pf-rule"><b>Theme swap</b><span>A full palette inversion driven entirely by token values. No component knows which theme is active; two themes cost one component set.</span></div>' +
      '</div>' +

      sub('Rules the system enforces') +
      '<div class="pf-rules">' +
        '<div class="pf-rule"><b>One accent, always</b><span>If it\'s accent-coloured it is interactive or it is a live status. Nothing decorative is ever allowed to borrow the accent.</span></div>' +
        '<div class="pf-rule"><b>Colour is never alone</b><span>Every status pairs its colour with a written label, so the system survives greyscale and colour-blindness.</span></div>' +
        '<div class="pf-rule"><b>Every motion has an off switch</b><span>All animation is behind prefers-reduced-motion, and every scroll-driven effect degrades to a static layout rather than breaking.</span></div>' +
        '<div class="pf-rule"><b>Weight is a design decision</b><span>Heavy components declare their own fallback — the 3D hero skips on slow links, live prototypes become posters on mobile. Adaptive loading is part of the component contract, not an afterthought.</span></div>' +
      '</div>' +
      '<span class="pf-cap">Contrast: body copy on ground measures ~15.8:1, mono metadata ~5.2:1 — both clear of WCAG AA at their sizes. Focus rings are never removed, only restyled.</span>' +
    '</div>';

  window.PROJECT_SCREENS = {
    tag: 'Wireframes · Design system',
    driver: wireframes,
    admin: library
  };
})();

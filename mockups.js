
/* ============================================================
   PROJECT MOCKUPS — modern light-UI dummy product screens,
   pure HTML/CSS (no images), designed on a fixed 1040×650 canvas
   and auto-scaled to fit any container (hero mac-window or card).
   window.PROJECT_MOCKUP[key] -> html string.
   window.initMockups(root?) -> hydrate [data-mock] nodes + scale.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- scoped stylesheet (injected once) ---------- */
  var CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .mkframe{position:relative;width:100%;aspect-ratio:1040/650;overflow:hidden;background:#eceef2;}
  .lapimg{position:relative;width:100%;max-width:940px;margin:0 auto;aspect-ratio:2000/1333;}
  .lapimg__stage{position:absolute;top:0;left:0;width:2000px;height:1333px;transform-origin:top left;}
  .lapimg__png{position:absolute;top:0;left:0;width:2000px;height:1333px;display:block;pointer-events:none;user-select:none;}
  .lapimg__screen{position:absolute;top:0;left:0;width:1040px;height:650px;transform-origin:0 0;overflow:hidden;background:#000;}
  .lapimg__screen .mkframe{width:1040px;height:650px;aspect-ratio:auto;}
  .mkscale{position:absolute;top:0;left:0;width:1040px;height:650px;transform-origin:top left;}
  .mk{width:1040px;height:650px;display:flex;font-family:"Inter",-apple-system,"Segoe UI",sans-serif;
      color:#1c2330;background:#f4f6f9;letter-spacing:-0.005em;text-align:left;--ac:#E8833A;--acd:#c96a26;}
  .mk *{box-sizing:border-box;}
  /* sidebar */
  .mk-side{width:228px;flex:none;background:#0f1420;color:#aeb6c6;padding:22px 16px;display:flex;flex-direction:column;gap:6px;}
  .mk-brand{display:flex;align-items:center;gap:10px;padding:4px 8px 20px;}
  .mk-brand i{width:30px;height:30px;border-radius:8px;background:var(--ac);display:grid;place-items:center;color:#fff;font-weight:800;font-size:15px;flex:none;}
  .mk-brand b{color:#fff;font-size:15px;font-weight:700;letter-spacing:-0.01em;}
  .mk-brand span{font-size:10px;color:#6b7690;display:block;font-weight:500;}
  .mk-nav{font-size:12.5px;font-weight:500;padding:9px 11px;border-radius:8px;display:flex;align-items:center;gap:10px;color:#aeb6c6;}
  .mk-nav svg{width:16px;height:16px;flex:none;opacity:.8;}
  .mk-nav.on{background:rgba(255,255,255,.07);color:#fff;}
  .mk-nav.on svg{opacity:1;color:var(--ac);}
  .mk-navlbl{font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:#586079;padding:14px 11px 6px;font-weight:600;}
  .mk-side-foot{margin-top:auto;display:flex;align-items:center;gap:10px;padding:10px 8px 2px;border-top:1px solid rgba(255,255,255,.08);}
  .mk-av{width:30px;height:30px;border-radius:50%;flex:none;background:linear-gradient(135deg,var(--ac),#f2b07a);display:grid;place-items:center;color:#fff;font-weight:700;font-size:12px;}
  /* main */
  .mk-main{flex:1;display:flex;flex-direction:column;min-width:0;}
  .mk-top{height:62px;flex:none;border-bottom:1px solid #e6e9ef;background:#fff;display:flex;align-items:center;gap:16px;padding:0 26px;}
  .mk-top h1{font-size:17px;font-weight:700;margin:0;letter-spacing:-0.02em;}
  .mk-top .sub{font-size:11.5px;color:#8a93a6;font-weight:500;margin-top:1px;}
  .mk-search{margin-left:auto;height:34px;width:230px;border-radius:9px;background:#f1f3f7;border:1px solid #e6e9ef;display:flex;align-items:center;gap:8px;padding:0 12px;color:#9aa3b5;font-size:12px;}
  .mk-search svg{width:14px;height:14px;}
  .mk-btn{height:34px;border-radius:9px;background:var(--ac);color:#fff;font-weight:600;font-size:12px;display:flex;align-items:center;gap:7px;padding:0 14px;flex:none;}
  .mk-btn svg{width:14px;height:14px;}
  .mk-body{flex:1;padding:22px 26px;overflow:hidden;background:#f4f6f9;}
  /* stat cards */
  .mk-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px;}
  .mk-stat{background:#fff;border:1px solid #e9ecf2;border-radius:13px;padding:15px 16px;}
  .mk-stat .k{font-size:11px;color:#8a93a6;font-weight:500;display:flex;align-items:center;gap:6px;}
  .mk-stat .v{font-size:25px;font-weight:750;margin-top:8px;letter-spacing:-0.02em;}
  .mk-stat .d{font-size:10.5px;font-weight:600;margin-top:4px;color:#1d9d63;}
  .mk-stat .d.dn{color:#d9534f;}
  .mk-dot{width:8px;height:8px;border-radius:50%;background:var(--ac);flex:none;}
  /* generic card */
  .mk-card{background:#fff;border:1px solid #e9ecf2;border-radius:14px;padding:18px;}
  .mk-card h2{font-size:13.5px;font-weight:700;margin:0 0 2px;letter-spacing:-0.01em;}
  .mk-card .ch-sub{font-size:11px;color:#8a93a6;font-weight:500;}
  .mk-ch-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;}
  .mk-tabs{display:flex;gap:4px;background:#f1f3f7;border-radius:8px;padding:3px;}
  .mk-tabs span{font-size:11px;font-weight:600;color:#8a93a6;padding:5px 11px;border-radius:6px;}
  .mk-tabs span.on{background:#fff;color:#1c2330;box-shadow:0 1px 2px rgba(0,0,0,.06);}
  /* table */
  .mk-tbl{width:100%;border-collapse:collapse;}
  .mk-tbl th{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#9aa3b5;font-weight:600;text-align:left;padding:0 12px 11px;}
  .mk-tbl td{font-size:12.5px;padding:12px;border-top:1px solid #eef1f5;font-weight:500;}
  .mk-tbl tr:first-child td{border-top:0;}
  .mk-tbl .strong{font-weight:650;}
  .mk-tag{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;padding:4px 10px;border-radius:999px;}
  .mk-tag i{width:6px;height:6px;border-radius:50%;background:currentColor;}
  .mk-tag.ok{background:#e7f6ee;color:#1d9d63;}
  .mk-tag.warn{background:#fdf3e3;color:#cf8a1d;}
  .mk-tag.bad{background:#fdecea;color:#d9534f;}
  .mk-tag.info{background:#eaf1fe;color:#2f6fe0;}
  .mk-tag.mute{background:#eef1f5;color:#7a849a;}
  .mk-pic{width:26px;height:26px;border-radius:7px;background:#eef1f5;display:inline-grid;place-items:center;font-size:10px;font-weight:700;color:#6b7690;margin-right:9px;vertical-align:middle;}
  .mk-prog{height:6px;border-radius:6px;background:#eef1f5;overflow:hidden;}
  .mk-prog i{display:block;height:100%;background:var(--ac);border-radius:6px;}
  .mk-grid2{display:grid;grid-template-columns:1.55fr 1fr;gap:16px;}
  .mk-grid2b{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
  .mk-soft{font-size:11px;color:#8a93a6;font-weight:500;}
  `;

  function injectCSS(){
    if (document.getElementById('mk-style')) return;
    var s = document.createElement('style');
    s.id = 'mk-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------- scaling (single debounced resize listener, no observers) ---------- */
  var _fitFns = [];
  var _resizeBound = false;
  var _raf = 0;
  function _runFits(){
    _raf = 0;
    for (var i = 0; i < _fitFns.length; i++) { try { _fitFns[i](); } catch (e) {} }
  }
  function _scheduleFits(){
    if (_raf) return;
    _raf = (window.requestAnimationFrame || window.setTimeout)(_runFits);
  }
  function _bindResize(){
    if (_resizeBound) return;
    _resizeBound = true;
    window.addEventListener('resize', _scheduleFits, { passive: true });
  }
  function scaleOne(frame){
    var sc = frame.querySelector('.mkscale');
    if (!sc) return;
    var w = frame.clientWidth;
    if (!w) return;
    sc.style.transform = 'scale(' + (w / 1040) + ')';
  }
  function initScale(root){
    (root || document).querySelectorAll('.mkframe').forEach(function (f) {
      scaleOne(f);
      if (!f.__mkfit) { f.__mkfit = true; _fitFns.push(function () { scaleOne(f); }); }
    });
    _bindResize();
  }

  /* wrap a mockup html in the scalable frame */
  function frame(html){
    return '<div class="mkframe"><div class="mkscale">' + html + '</div></div>';
  }

  /* hydrate [data-mock] placeholders (homepage cards) */
  function initMockups(root){
    injectCSS();
    (root || document).querySelectorAll('[data-mock]').forEach(function (el) {
      if (el.__mkdone) return;
      var k = el.getAttribute('data-mock');
      var m = window.PROJECT_MOCKUP && window.PROJECT_MOCKUP[k];
      if (!m) return;
      el.innerHTML = frame(m);
      el.__mkdone = true;
    });
    initScale(root);
  }

  injectCSS();
  window.PROJECT_MOCKUP = {};
  window.mkFrame = frame;
  window.initMockups = initMockups;
  window.initMockupScale = initScale;

  /* ---------- image-based laptop: map UI onto the photo's screen ---------- */
  // natural image size + the 4 screen-display corners (in image px),
  // order: TL, TR, BL, BR
  var LAP = {
    img: 'assets/macbook-frame.png',
    iw: 2000, ih: 1333,
    src: { w: 1040, h: 650 },
    quad: [486,324, 1172,196, 606,800, 1232,672]
  };

  function adj(m){return[m[4]*m[8]-m[5]*m[7],m[2]*m[7]-m[1]*m[8],m[1]*m[5]-m[2]*m[4],
    m[5]*m[6]-m[3]*m[8],m[0]*m[8]-m[2]*m[6],m[2]*m[3]-m[0]*m[5],
    m[3]*m[7]-m[4]*m[6],m[1]*m[6]-m[0]*m[7],m[0]*m[4]-m[1]*m[3]];}
  function mmm(a,b){var r=[];for(var i=0;i<3;i++)for(var j=0;j<3;j++){var s=0;for(var k=0;k<3;k++)s+=a[3*i+k]*b[3*k+j];r[3*i+j]=s;}return r;}
  function mmv(m,v){return[m[0]*v[0]+m[1]*v[1]+m[2]*v[2],m[3]*v[0]+m[4]*v[1]+m[5]*v[2],m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];}
  function b2p(x1,y1,x2,y2,x3,y3,x4,y4){var m=[x1,x2,x3,y1,y2,y3,1,1,1];var v=mmv(adj(m),[x4,y4,1]);return mmm(m,[v[0],0,0,0,v[1],0,0,0,v[2]]);}
  function proj(s,d){return mmm(b2p.apply(null,d),adj(b2p.apply(null,s)));}
  function screenMatrix(){
    var W=LAP.src.w,H=LAP.src.h,q=LAP.quad;
    var t=proj([0,0,W,0,0,H,W,H],[q[0],q[1],q[2],q[3],q[4],q[5],q[6],q[7]]);
    for(var i=0;i<9;i++)t[i]=t[i]/t[8];
    return 'matrix3d('+[t[0],t[3],0,t[6],t[1],t[4],0,t[7],0,0,1,0,t[2],t[5],0,t[8]].join(',')+')';
  }

  // returns the laptop figure HTML with the UI mockup html on its screen
  function laptopImg(innerHtml){
    return '<figure class="lapimg"><div class="lapimg__stage">' +
      '<img class="lapimg__png" src="' + LAP.img + '" alt="" width="' + LAP.iw + '" height="' + LAP.ih + '" draggable="false">' +
      '<div class="lapimg__screen p-macwin__view--mk">' + innerHtml + '</div>' +
    '</div></figure>';
  }
  function initLaptops(root){
    injectCSS();
    var mtx = screenMatrix();
    (root || document).querySelectorAll('.lapimg').forEach(function (fig) {
      var stage = fig.querySelector('.lapimg__stage');
      var screen = fig.querySelector('.lapimg__screen');
      if (screen) screen.style.transform = mtx;
      function fit(){ if (fig.clientWidth) stage.style.transform = 'scale(' + (fig.clientWidth / LAP.iw) + ')'; }
      fit();
      if (!fig.__lapfit) { fig.__lapfit = true; _fitFns.push(fit); }
    });
    _bindResize();
    initScale(root);
  }
  window.laptopImg = laptopImg;
  window.initLaptops = initLaptops;
  window.__LAPCFG = LAP;
})();

/* ============================================================
   SCREENS
   ============================================================ */
(function () {
  'use strict';
  var M = window.PROJECT_MOCKUP;

  var IC = {
    grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
    truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
    box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/></svg>',
    route:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="6" cy="18" r="2.4"/><circle cx="18" cy="6" r="2.4"/><path d="M8.4 16.5C14 14 10 9.5 15.6 7.5"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V5M4 19h16M8 16l3.5-4 3 2.5L20 8"/></svg>',
    list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    cog:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>',
    scan:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M4 12h16"/></svg>',
    layers:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.2-3.2"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>'
  };

  function nav(items){
    return items.map(function (n) {
      if (n.h) return '<div class="mk-navlbl">' + n.h + '</div>';
      return '<div class="mk-nav' + (n.on ? ' on' : '') + '">' + (IC[n.i] || '') + n.label + '</div>';
    }).join('');
  }

  function shell(o){
    return '<div class="mk" style="--ac:' + o.ac + (o.acd ? ';--acd:' + o.acd : '') + '">' +
      '<aside class="mk-side">' +
        '<div class="mk-brand"><i>' + o.mark + '</i><div><b>' + o.brand + '</b><span>' + o.bsub + '</span></div></div>' +
        nav(o.nav) +
        '<div class="mk-side-foot"><div class="mk-av">GS</div><div style="font-size:11.5px"><div style="color:#fff;font-weight:600">Gourav S.</div><div style="color:#6b7690;font-size:10px">Product Designer</div></div></div>' +
      '</aside>' +
      '<main class="mk-main">' +
        '<header class="mk-top"><div><h1>' + o.title + '</h1><div class="sub">' + o.topsub + '</div></div>' +
          '<div class="mk-search">' + IC.search + 'Search…</div>' +
          (o.action ? '<div class="mk-btn">' + IC.plus + o.action + '</div>' : '') +
        '</header>' +
        '<div class="mk-body">' + o.body + '</div>' +
      '</main>' +
    '</div>';
  }
  window.__mkShell = shell;
  window.__mkIC = IC;

  function stat(k, v, d, dn){
    return '<div class="mk-stat"><div class="k"><span class="mk-dot"></span>' + k + '</div><div class="v">' + v + '</div>' +
      (d ? '<div class="d' + (dn ? ' dn' : '') + '">' + d + '</div>' : '') + '</div>';
  }
  window.__mkStat = stat;

  /* ---------- 1 · Stock on Wheel — live mobile inventory (Omniful) ---------- */
  (function () {
    var rows = [
      ['MH-12 KA-4408', 'R. Mehta', '182 / 200', 'ok', 'Synced', '12s ago'],
      ['MH-14 DT-9921', 'S. Khan', '96 / 120', 'info', 'Syncing', 'now'],
      ['DL-01 LR-3370', 'A. Verma', '54 / 80', 'warn', 'Low signal', '4m ago'],
      ['KA-05 MJ-1185', 'P. Nair', '210 / 220', 'ok', 'Synced', '38s ago'],
      ['MH-12 KA-7781', 'D. Joshi', '0 / 160', 'mute', 'Idle', '1h ago']
    ];
    var tbl = rows.map(function (r) {
      return '<tr><td class="strong"><span class="mk-pic">' + IC.truck + '</span>' + r[0] + '</td>' +
        '<td>' + r[1] + '</td><td class="strong">' + r[2] + '</td>' +
        '<td><span class="mk-tag ' + r[3] + '"><i></i>' + r[4] + '</span></td>' +
        '<td class="mk-soft">' + r[5] + '</td></tr>';
    }).join('');
    M['stock-on-wheel'] = shell({
      ac:'#E8833A', mark:'S', brand:'Stock on Wheel', bsub:'Omniful · Live',
      nav:[{h:'Operations'},{i:'grid',label:'Overview'},{i:'truck',label:'Vehicles',on:true},{i:'box',label:'Inventory'},{i:'route',label:'Dispatch'},{h:'Manage'},{i:'chart',label:'Reports'},{i:'cog',label:'Settings'}],
      title:'Mobile inventory', topsub:'Live stock across 24 vehicles', action:'Load vehicle',
      body:
        '<div class="mk-stats">' +
          stat('Vehicles live', '21', '+3 today') +
          stat('Units on road', '4,820', '+6.2%') +
          stat('Count drift', '0.4%', '−1.1%') +
          stat('Confirmed today', '1,196', '+212') +
        '</div>' +
        '<div class="mk-card"><div class="mk-ch-head"><div><h2>Stock on vehicles</h2><div class="ch-sub">Real-time, synced from the driver app</div></div>' +
          '<div class="mk-tabs"><span class="on">All</span><span>Synced</span><span>Issues</span></div></div>' +
          '<table class="mk-tbl"><thead><tr><th>Vehicle</th><th>Driver</th><th>Units</th><th>Status</th><th>Last sync</th></tr></thead><tbody>' + tbl + '</tbody></table>' +
        '</div>'
    });
  })();

  /* ---------- 2 · Delivery Partner App / TMS — dispatch board (Omniful) ---------- */
  (function () {
    var trips = [
      ['TRIP 0412-K', 'R. Mehta', '7 stops', 'ok', 'On route'],
      ['TRIP 0418-A', 'S. Khan', '5 stops', 'info', 'Loading'],
      ['TRIP 0420-C', 'A. Verma', '9 stops', 'warn', 'Delayed'],
      ['TRIP 0423-M', 'P. Nair', '6 stops', 'ok', 'On route']
    ];
    var tbl = trips.map(function (r) {
      return '<tr><td class="strong">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td>' +
        '<td><span class="mk-tag ' + r[3] + '"><i></i>' + r[4] + '</span></td></tr>';
    }).join('');
    var stops = [['1','Bandra W · Hill Rd','ok','Delivered'],['2','Khar · 14th Rd','ok','Delivered'],['3','Santacruz · Linking','info','At stop'],['4','Vile Parle · Nehru','mute','Pending']];
    var stopList = stops.map(function (s) {
      return '<div style="display:flex;align-items:center;gap:11px;padding:10px 0;border-top:1px solid #eef1f5">' +
        '<span class="mk-pic" style="background:' + (s[2]==='info'?'var(--ac)':'#eef1f5') + ';color:' + (s[2]==='info'?'#fff':'#6b7690') + '">' + s[0] + '</span>' +
        '<div style="flex:1"><div style="font-size:12px;font-weight:600">' + s[1] + '</div></div>' +
        '<span class="mk-tag ' + s[2] + '">' + s[3] + '</span></div>';
    }).join('');
    M['tms-delivery-app'] = shell({
      ac:'#E8833A', mark:'T', brand:'TMS Console', bsub:'Omniful · Dispatch',
      nav:[{h:'Logistics'},{i:'grid',label:'Dashboard'},{i:'route',label:'Trips',on:true},{i:'truck',label:'Vehicles'},{i:'pin',label:'Live map'},{h:'Manage'},{i:'chart',label:'Reports'},{i:'cog',label:'Settings'}],
      title:'Dispatch board', topsub:'18 trips active · 142 stops today', action:'New trip',
      body:
        '<div class="mk-stats">' +
          stat('Active trips', '18', '+4') +
          stat('On-time', '94%', '+2.4%') +
          stat('Stops today', '142', '+18') +
          stat('Collected', '₹2.4L', '+12%') +
        '</div>' +
        '<div class="mk-grid2">' +
          '<div class="mk-card"><div class="mk-ch-head"><div><h2>Active trips</h2><div class="ch-sub">Across dispatch and last-mile</div></div>' +
            '<div class="mk-tabs"><span class="on">Today</span><span>Week</span></div></div>' +
            '<table class="mk-tbl"><thead><tr><th>Trip</th><th>Driver</th><th>Stops</th><th>Status</th></tr></thead><tbody>' + tbl + '</tbody></table></div>' +
          '<div class="mk-card"><div class="mk-ch-head"><div><h2>Trip 0412-K</h2><div class="ch-sub">R. Mehta · 7 stops</div></div></div>' +
            stopList +
            '<div style="margin-top:14px;background:#f7f8fb;border:1px solid #eef1f5;border-radius:11px;padding:13px"><div class="mk-soft" style="font-weight:600;color:#1c2330;margin-bottom:8px">Proof of delivery + payment</div>' +
            '<div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700"><span>Collected</span><span>₹ 2,480.00</span></div></div>' +
          '</div>' +
        '</div>'
    });
  })();

  /* ---------- 3 · Demand Forecasting — chart + create order (Omniful) ---------- */
  (function () {
    var pts = [44,60,52,76,70,96,88,120,110,150,138,176];
    var W=560,H=210,pad=14,max=190;
    var step=(W-pad*2)/(pts.length-1);
    function xy(v,i){return [pad+i*step, H-pad-(v/max)*(H-pad*2)];}
    var line=pts.map(function(v,i){var p=xy(v,i);return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' ');
    var area=line+' L'+(W-pad)+' '+(H-pad)+' L'+pad+' '+(H-pad)+' Z';
    var bandTop=pts.map(function(v,i){var p=xy(v*1.12,i);return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' ');
    var bandBot=pts.slice().reverse().map(function(v,i){var idx=pts.length-1-i;var p=xy(v*0.88,idx);return 'L'+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' ');
    var band=bandTop+' '+bandBot+' Z';
    var end=xy(pts[pts.length-1],pts.length-1);
    var svg='<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block">'+
      '<defs><linearGradient id="mkfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--ac)" stop-opacity="0.22"/><stop offset="1" stop-color="var(--ac)" stop-opacity="0"/></linearGradient></defs>'+
      '<path d="'+band+'" fill="var(--ac)" opacity="0.10"/>'+
      '<path d="'+area+'" fill="url(#mkfg)"/>'+
      '<path d="'+line+'" fill="none" stroke="var(--ac)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<circle cx="'+end[0].toFixed(1)+'" cy="'+end[1].toFixed(1)+'" r="5" fill="var(--ac)"/><circle cx="'+end[0].toFixed(1)+'" cy="'+end[1].toFixed(1)+'" r="9" fill="none" stroke="var(--ac)" stroke-opacity="0.35"/>'+
      '</svg>';
    M['demand-forecasting'] = shell({
      ac:'#E8833A', mark:'F', brand:'Forecast', bsub:'Omniful · WMS',
      nav:[{h:'Planning'},{i:'grid',label:'Overview'},{i:'chart',label:'Forecast',on:true},{i:'box',label:'Inventory'},{i:'list',label:'Orders'},{h:'Manage'},{i:'layers',label:'Catalog'},{i:'cog',label:'Settings'}],
      title:'Demand forecast', topsub:'SKU · Aquafina 1L · Mumbai DC', action:'Create order',
      body:
        '<div class="mk-stats" style="grid-template-columns:repeat(3,1fr)">' +
          stat('90-day demand', '18,420', '+24.6%') +
          stat('Confidence', '92%', '+5%') +
          stat('Suggested order', '4,200', 'units') +
        '</div>' +
        '<div class="mk-grid2">' +
          '<div class="mk-card"><div class="mk-ch-head"><div><h2>Projected demand</h2><div class="ch-sub">Shaded band = forecast confidence</div></div>' +
            '<div class="mk-tabs"><span>30d</span><span class="on">90d</span><span>1y</span></div></div>' + svg + '</div>' +
          '<div class="mk-card"><div class="mk-ch-head"><div><h2>Create order</h2><div class="ch-sub">Pre-filled from forecast</div></div></div>' +
            '<div style="display:flex;flex-direction:column;gap:11px;margin-top:4px">' +
              fld('SKU','Aquafina 1L · 12-pack') + fld('Quantity','4,200 units') + fld('Warehouse','Mumbai DC-01') + fld('Deliver by','12 Jun 2026') +
            '</div>' +
            '<div class="mk-btn" style="width:100%;justify-content:center;margin-top:15px">Confirm order</div></div>' +
        '</div>'
    });
    function fld(k,v){return '<div><div class="mk-soft" style="margin-bottom:5px">'+k+'</div><div style="height:38px;border:1px solid #e6e9ef;border-radius:9px;background:#f7f8fb;display:flex;align-items:center;padding:0 12px;font-size:12.5px;font-weight:600">'+v+'</div></div>';}
  })();

})();

/* ============================================================
   SCREENS · part 2 (Edgistify)
   ============================================================ */
(function () {
  'use strict';
  var M = window.PROJECT_MOCKUP, shell = window.__mkShell, IC = window.__mkIC, stat = window.__mkStat;

  /* ---------- 4 · Route Optimization — map + stops (Edgistify × Bisleri) ---------- */
  (function () {
    var blocks='';
    for (var r=0;r<4;r++) for (var c=0;c<6;c++){
      var x=18+c*90, y=18+r*68;
      blocks+='<rect x="'+x+'" y="'+y+'" width="74" height="52" rx="6" fill="#eef2f6" stroke="#e0e6ee"/>';
    }
    var routePts=[[40,210],[150,150],[250,200],[360,120],[470,170],[520,70]];
    var rl=routePts.map(function(p,i){return (i?'L':'M')+p[0]+' '+p[1];}).join(' ');
    var pins=routePts.map(function(p,i){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="11" fill="#fff" stroke="var(--ac)" stroke-width="2.4"/><text x="'+p[0]+'" y="'+(p[1]+4)+'" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ac)">'+String.fromCharCode(65+i)+'</text>';}).join('');
    var map='<svg viewBox="0 0 558 280" style="width:100%;height:auto;display:block;border-radius:11px">'+
      '<rect width="558" height="280" fill="#f4f7fa"/>'+blocks+
      '<path d="'+rl+'" fill="none" stroke="var(--ac)" stroke-width="9" opacity="0.16" stroke-linecap="round"/>'+
      '<path d="'+rl+'" fill="none" stroke="var(--ac)" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>'+pins+'</svg>';
    var stops=[['A','Andheri E · MIDC','ok','OK'],['B','Powai · Hiranandani','ok','OK'],['C','Ghatkopar W','warn','No lift'],['D','Mulund · LBS Marg','ok','OK'],['E','Bhandup · Station','mute','Queued']];
    var sl=stops.map(function(s){return '<div style="display:flex;align-items:center;gap:11px;padding:9px 0;border-top:1px solid #eef1f5"><span class="mk-pic">'+s[0]+'</span><div style="flex:1;font-size:12px;font-weight:600">'+s[1]+'</div><span class="mk-tag '+s[2]+'">'+s[3]+'</span></div>';}).join('');
    M['route-optimization-bisleri'] = shell({
      ac:'#0FA3A3', acd:'#0c8585', mark:'R', brand:'RoutePlan', bsub:'Edgistify × Bisleri',
      nav:[{h:'Planning'},{i:'grid',label:'Overview'},{i:'route',label:'Routes',on:true},{i:'pin',label:'Live map'},{i:'truck',label:'Fleet'},{h:'Data'},{i:'list',label:'Uploads'},{i:'cog',label:'Settings'}],
      title:'Route planner', topsub:'Daily plan · 1 vehicle · 22 stops', action:'Optimize',
      body:
        '<div style="background:#e7f6ee;border:1px solid #c7ecd7;border-radius:11px;padding:11px 15px;display:flex;align-items:center;gap:10px;margin-bottom:16px;font-size:12.5px;font-weight:600;color:#1d9d63"><span class="mk-tag ok" style="background:#fff"><i></i>Validated</span>20 of 22 addresses clean · 2 flagged on upload (row 14, row 19)</div>' +
        '<div class="mk-grid2">' +
          '<div class="mk-card" style="padding:13px"><div class="mk-ch-head" style="margin-bottom:11px"><div><h2>Optimized route · Run-09</h2><div class="ch-sub">22 stops · −18% distance vs. manual</div></div></div>' + map + '</div>' +
          '<div class="mk-card"><div class="mk-ch-head"><div><h2>Stops</h2><div class="ch-sub">In driving order</div></div><div class="mk-tabs"><span class="on">All</span><span>Flagged</span></div></div>' + sl + '</div>' +
        '</div>'
    });
  })();

  /* ---------- 5 · Picker App — floor picking console (Edgistify) ---------- */
  (function () {
    var done=14,total=24;
    M['picker-app'] = shell({
      ac:'#0E9F6E', acd:'#0b7e58', mark:'P', brand:'PickFlow', bsub:'Edgistify · Floor',
      nav:[{h:'Warehouse'},{i:'grid',label:'Overview'},{i:'list',label:'Pick lists',on:true},{i:'box',label:'Bins'},{i:'scan',label:'Scan'},{h:'Manage'},{i:'chart',label:'Productivity'},{i:'cog',label:'Settings'}],
      title:'Pick list · 24 SKU', topsub:'Wave 0312 · Aisle B', action:'',
      body:
        '<div class="mk-stats">' +
          stat('Picks / hr', '142', '+18%') +
          stat('Accuracy', '99.6%', '+0.4%') +
          stat('Idle time', '3%', '−6%', true) +
          stat('Progress', done+' / '+total, 'this wave') +
        '</div>' +
        '<div class="mk-grid2">' +
          '<div class="mk-card" style="background:#0f1420;border-color:#0f1420;color:#fff;display:flex;flex-direction:column;justify-content:center;min-height:300px">' +
            '<div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#7c869c;font-weight:600">Go to location</div>' +
            '<div style="font-size:58px;font-weight:800;letter-spacing:-0.02em;line-height:1;margin:8px 0 4px">B · 04 · 12</div>' +
            '<div style="font-size:14px;color:#aeb6c6;font-weight:500;margin-bottom:22px">Aisle B · Bay 04 · Level 12</div>' +
            '<div style="display:flex;align-items:center;gap:14px;background:#1a2030;border:1px solid #283044;border-radius:13px;padding:15px">' +
              '<span style="width:46px;height:46px;border-radius:11px;background:var(--ac);display:grid;place-items:center;color:#fff;font-weight:800">×6</span>' +
              '<div style="flex:1"><div style="font-size:15px;font-weight:700">Aquafina 1L · 12-pack</div><div style="font-size:12px;color:#aeb6c6">SKU 88421 · Pick 6 units</div></div>' +
              '<span style="color:var(--ac)">'+IC.scan+'</span>' +
            '</div>' +
            '<div class="mk-btn" style="justify-content:center;margin-top:14px;height:42px;font-size:14px">Confirm pick</div>' +
          '</div>' +
          '<div class="mk-card"><div class="mk-ch-head"><div><h2>This wave</h2><div class="ch-sub">'+done+' of '+total+' picked</div></div></div>' +
            '<div class="mk-prog" style="margin-bottom:16px"><i style="width:'+Math.round(done/total*100)+'%"></i></div>' +
            ['B·04·08|Pepsi 500ml|ok|Picked','B·04·10|Lays Classic|ok|Picked','B·04·12|Aquafina 1L|info|Current','B·05·02|Kurkure|mute|Next','B·05·06|7Up 1L|mute|Queued'].map(function(s){var p=s.split('|');return '<div style="display:flex;align-items:center;gap:11px;padding:10px 0;border-top:1px solid #eef1f5"><span class="mk-pic" style="font-family:monospace;font-size:9px">'+p[0]+'</span><div style="flex:1;font-size:12px;font-weight:600">'+p[1]+'</div><span class="mk-tag '+p[2]+'">'+p[3]+'</span></div>';}).join('') +
          '</div>' +
        '</div>'
    });
  })();

  /* ---------- 6 · EdgeOS — platform dashboard (Edgistify) ---------- */
  (function () {
    var bars=[52,70,60,86,78,104,96,120];
    var bw=30,gap=22,H=180;
    var max=130;
    var chart='<svg viewBox="0 0 '+(bars.length*(bw+gap))+' '+H+'" style="width:100%;height:auto;display:block">'+
      bars.map(function(v,i){var h=(v/max)*(H-30);var x=i*(bw+gap)+8;var y=H-h-22;var on=i===bars.length-1;
        return '<rect x="'+x+'" y="'+y+'" width="'+bw+'" height="'+h+'" rx="6" fill="'+(on?'var(--ac)':'#e3e8f0')+'"/>';
      }).join('')+'</svg>';
    var orders=[['#EO-7741','Acme Retail','b2b','₹84,200','ok','Fulfilled'],['#EO-7742','Nova D2C','b2c','₹2,480','info','Packing'],['#EO-7745','BlueMart','b2b','₹1,20,400','ok','Fulfilled'],['#EO-7748','Kessa','b2c','₹5,900','warn','On hold']];
    var tbl=orders.map(function(r){return '<tr><td class="strong">'+r[0]+'</td><td>'+r[1]+'</td><td><span class="mk-tag '+(r[2]==='b2b'?'info':'mute')+'">'+r[2].toUpperCase()+'</span></td><td class="strong">'+r[3]+'</td><td><span class="mk-tag '+r[4]+'"><i></i>'+r[5]+'</span></td></tr>';}).join('');
    M['edgeos'] = shell({
      ac:'#5B5BF0', acd:'#4646d6', mark:'E', brand:'EdgeOS', bsub:'Edgistify · Platform',
      nav:[{h:'Platform'},{i:'grid',label:'Dashboard',on:true},{i:'list',label:'Orders'},{i:'box',label:'Inventory'},{i:'truck',label:'Fulfilment'},{h:'Workspace'},{i:'layers',label:'Integrations'},{i:'cog',label:'Settings'}],
      title:'Platform overview', topsub:'B2B + B2C · all channels', action:'New order',
      body:
        '<div class="mk-stats">' +
          stat('Orders today', '3,184', '+9.2%') +
          stat('Fulfilment', '97.4%', '+1.8%') +
          stat('GMV', '₹18.4L', '+14%') +
          stat('Active SKUs', '12,840', '+320') +
        '</div>' +
        '<div class="mk-grid2">' +
          '<div class="mk-card"><div class="mk-ch-head"><div><h2>Order volume</h2><div class="ch-sub">Last 8 weeks · B2B + B2C</div></div><div class="mk-tabs"><span>B2C</span><span>B2B</span><span class="on">All</span></div></div>' + chart + '</div>' +
          '<div class="mk-card"><div class="mk-ch-head"><div><h2>Channel split</h2><div class="ch-sub">This month</div></div></div>' +
            ['B2B wholesale|62%|var(--ac)','D2C storefront|28%|#9aa3f5','Marketplace|10%|#c7cbf8'].map(function(s){var p=s.split('|');return '<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:6px"><span>'+p[0]+'</span><span>'+p[1]+'</span></div><div class="mk-prog"><i style="width:'+p[1]+';background:'+p[2]+'"></i></div></div>';}).join('') +
            '<div style="margin-top:18px;font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#9aa3b5">Recent orders</div>' +
          '</div>' +
        '</div>' +
        '<div class="mk-card" style="margin-top:16px"><table class="mk-tbl"><thead><tr><th>Order</th><th>Account</th><th>Type</th><th>Value</th><th>Status</th></tr></thead><tbody>' + tbl + '</tbody></table></div>'
    });
  })();

})();

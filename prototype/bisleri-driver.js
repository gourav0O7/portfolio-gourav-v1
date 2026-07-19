/* ============================================================
   BISLERI DRIVER APP — working prototype
   Flow: Login (validated) → Today's route → Map (live Google
   embed) → Stop detail (no-lift / call-ahead) → slide-to-deliver
   → proof photo → delivered · Can't deliver → reason (incl.
   required free-text Other) → failed + 5s undo.
   Edge cases: bad login, offline queue + sync, call-ahead,
   day-done state. Seeds via ?seed=login|start|mid|done.
   ============================================================ */
(function () {
  'use strict';

  var PARAMS = new URLSearchParams(location.search);
  var STATIC = PARAMS.get('static') === '1';
  var EMBED  = PARAMS.get('embed') === '1';
  var BARE   = PARAMS.get('bare') === '1';
  var FILL   = PARAMS.get('fill') === '1';
  var SEED   = PARAMS.get('seed') || 'login';
  if (STATIC) document.documentElement.classList.add('is-static');
  if (EMBED)  document.documentElement.classList.add('is-embed');
  if (FILL)   document.documentElement.classList.add('is-static', 'is-fill');
  if (BARE)   document.documentElement.classList.add('is-bare');

  var ROOT = document.getElementById('app');
  var DEPOT = 'Bisleri Compound, Western Express Highway, Andheri East, Mumbai';

  /* ---------------- data ---------------- */
  function freshStops(){ return [
    { id:'s1', seq:1, name:'Crystal Plaza', who:'Meera Desai', phone:'+91 98204 11857',
      addr:'A-702, Crystal Plaza, New Link Rd, Andheri West, Mumbai 400053', q:'Crystal Plaza, New Link Road, Andheri West, Mumbai', ll:'19.1364,72.8296', acc:6,
      jars:10, floor:'7th floor', lift:'service', tags:['floor'], eta:'9:20 AM', status:'pending' },
    { id:'s2', seq:2, name:'Sea Breeze CHS', who:'Rohan Mehta', phone:'+91 99301 74562',
      addr:'302, Sea Breeze CHS, Carter Rd, Bandra West, Mumbai 400050', q:'Carter Road, Bandra West, Mumbai', ll:'19.0585,72.8200', acc:8,
      jars:6, floor:'3rd floor', lift:'none', tags:['nolift','call'], eta:'10:05 AM', status:'pending',
      note:'Older building — no lift. 20L jars up 3 floors: call before arriving so someone meets you at the gate.' },
    { id:'s3', seq:3, name:'Aarti Kulkarni', who:'Aarti Kulkarni', phone:'+91 98675 30219',
      addr:'Bungalow 14, Kataria Rd, Shivaji Park, Dadar West, Mumbai 400028', q:'Shivaji Park, Dadar West, Mumbai', ll:'19.0281,72.8395', acc:5,
      jars:4, floor:'Ground', lift:null, tags:['call'], eta:'10:50 AM', status:'pending',
      note:'Customer is home only until noon — call ahead to confirm.' },
    { id:'s4', seq:4, name:'Trident Offices', who:'Kamala Mills reception', phone:'+91 22 4090 1180',
      addr:'Unit 4B, Kamala Mills, Senapati Bapat Marg, Lower Parel, Mumbai 400013', q:'Kamala Mills, Lower Parel, Mumbai', ll:'18.9949,72.8258', acc:9,
      jars:20, floor:'Dock B', lift:'dock', tags:['dock'], eta:'11:35 AM', status:'pending' },
    { id:'s5', seq:5, name:'Ashok Towers', who:'Vikram Shah', phone:'+91 98194 22703',
      addr:'1404, Tower B, Ashok Towers, Dr Babasaheb Ambedkar Rd, Parel, Mumbai 400012', q:'Ashok Towers, Parel, Mumbai', ll:'18.9990,72.8340', acc:7,
      jars:12, floor:'14th floor', lift:'service', tags:['floor'], eta:'12:20 PM', status:'pending' },
    { id:'s6', seq:6, name:'Galaxy Apartments', who:'Farhan Qureshi', phone:'+91 99872 60441',
      addr:'501, Galaxy Apartments, Worli Sea Face, Mumbai 400030', q:'Worli Sea Face, Mumbai', ll:'18.9930,72.8140', acc:6,
      jars:5, floor:'5th floor', lift:'ok', tags:[], eta:'1:05 PM', status:'pending' },
    { id:'s7', seq:7, name:'Lakeview CHS', who:'Nisha Iyer', phone:'+91 98332 90116',
      addr:'B-204, Lakeview CHS, Hiranandani Gardens, Powai, Mumbai 400076', q:'Hiranandani Gardens, Powai, Mumbai', ll:'19.1180,72.9050', acc:8,
      jars:8, floor:'2nd floor', lift:'none', tags:['nolift'], eta:'2:10 PM', status:'pending',
      note:'No lift in B wing. Two trips likely — keep the trolley on the kerb side.' }
  ]; }

  var REASONS = [
    { id:'nohome',  h:'No one home',        s:'Rang / called, no answer at the address' },
    { id:'addr',    h:'Wrong address',      s:'Building or flat doesn’t match the sheet' },
    { id:'lift',    h:'No lift access',     s:'Couldn’t carry the jars up, no help arranged' },
    { id:'refused', h:'Customer refused',   s:'Order cancelled or refused at the door' },
    { id:'other',   h:'Other',              s:'Type what happened' }
  ];

  /* ---------------- state ---------------- */
  var S = {};
  function applySeed(){
    S = { screen:'login', detailId:null, sheet:null, net:'online',
          uid:'MUM-0482', pw:'bisleri', showPw:false, loginErr:null, fieldErr:{}, loggingIn:false,
          stops:freshStops(), called:{}, proofShot:false,
          reasonSel:null, reasonText:'', reasonErr:false,
          success:null, celebrated:false };
    if (SEED === 'start'){ S.screen = 'home'; }
    if (SEED === 'loginerr'){ S.uid = 'MUM-0482'; S.loginErr = 'That ID and password don’t match. Try again, or ask your supervisor to reset it. (Demo password: bisleri)'; }
    if (SEED === 'map'){ S.screen = 'map'; }
    if (SEED === 'detail'){ S.screen = 'detail'; S.detailId = 's2'; }
    if (SEED === 'call'){ S.screen = 'detail'; S.detailId = 's2'; S.sheet = 'call'; }
    if (SEED === 'proof'){ S.screen = 'detail'; S.detailId = 's1'; S.sheet = 'proof'; }
    if (SEED === 'proofshot'){ S.screen = 'detail'; S.detailId = 's1'; S.sheet = 'proof'; S.proofShot = true; }
    if (SEED === 'success'){ S.screen = 'detail'; S.detailId = 's1'; S.stops[0].status = 'done'; S.success = { kind:'done', msg:'10 jars at Crystal Plaza. Proof photo sent to the planner.' }; }
    if (SEED === 'queued'){ S.net = 'offline'; S.screen = 'detail'; S.detailId = 's1'; S.stops[0].status = 'queued'; S.success = { kind:'queued', msg:'10 jars at Crystal Plaza — recorded with the proof photo.' }; }
    if (SEED === 'reason'){ S.screen = 'detail'; S.detailId = 's3'; S.sheet = 'reason'; }
    if (SEED === 'reasonerr'){ S.screen = 'detail'; S.detailId = 's3'; S.sheet = 'reason'; S.reasonSel = 'other'; S.reasonErr = true; }
    if (SEED === 'failed'){ S.screen = 'home'; S.stops[2].status = 'fail'; S.stops[2].failWhy = 'No one home'; }
    if (SEED === 'offline'){ S.screen = 'home'; S.net = 'offline'; }
    if (SEED === 'offqueue'){ S.screen = 'home'; S.net = 'offline'; S.stops[0].status = 'queued'; }
    if (SEED === 'mid'){
      S.screen = 'home';
      S.stops[0].status = 'done'; S.stops[1].status = 'done';
      S.stops[2].status = 'fail'; S.stops[2].failWhy = 'No one home';
      S.called.s2 = true;
    }
    if (SEED === 'done'){
      S.screen = 'home'; S.celebrated = true;
      S.stops.forEach(function(st,i){ st.status = i===2 ? 'fail' : 'done'; if(i===2) st.failWhy='Wrong address'; });
    }
  }

  var toastTimer = null, undoTimer = null, undoTick = null, callTick = null;

  /* ---------------- helpers ---------------- */
  function stop(id){ return S.stops.filter(function(s){ return s.id===id; })[0]; }
  function pending(){ return S.stops.filter(function(s){ return s.status==='pending'; }); }
  function counts(){
    var d=0,f=0,q=0;
    S.stops.forEach(function(s){ if(s.status==='done')d++; else if(s.status==='fail')f++; else if(s.status==='queued')q++; });
    return { done:d, fail:f, queued:q, total:S.stops.length, resolved:d+f+q };
  }
  function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function enc(t){ return encodeURIComponent(t); }
  var DEPOT_LL = '19.1180,72.8630';
  // real map centred on coordinates (deterministic — no geocoding ambiguity)
  function mapEmbed(ll, z){ return 'https://maps.google.com/maps?q=' + enc(ll) + '&z=' + (z||15) + '&hl=en&output=embed'; }
  // real Google directions embed: depot → every pending stop, in order (draws the route line)
  function routeEmbed(){
    var ps = pending();
    var pts = ps.length ? ps : S.stops;
    return 'https://maps.google.com/maps?saddr=' + enc(DEPOT_LL) + '&daddr=' +
      pts.map(function(s){ return enc(s.ll); }).join('+to:') +
      '&hl=en&output=embed';
  }
  function maskPhone(p){
    var di = 0, digits = (p.match(/\d/g)||[]).length;
    return p.replace(/\d/g, function(d){ di++; return (di<=4 || di>digits-2) ? d : '•'; });
  }

  /* ---------------- icons ---------------- */
  var I = {
    wifi:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><circle cx="12" cy="18.6" r="1.4" fill="currentColor"/></svg>',
    wifiOff:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5a10 10 0 0 1 6-2.9M16 11a10 10 0 0 1 3 1.5M8 15.5a6 6 0 0 1 4.5-1.7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><circle cx="12" cy="18.6" r="1.4" fill="currentColor"/><path d="m4 4 16 16" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    cell:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 18v-3M9 18v-6M14 18V8M19 18V4" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg>',
    batt:'<svg viewBox="0 0 27 24" fill="none"><rect x="2" y="8" width="19" height="9" rx="2.6" stroke="currentColor" stroke-width="1.4" opacity=".5"/><rect x="4" y="10" width="13" height="5" rx="1.2" fill="currentColor"/><path d="M23 10.8v3.4c1.1-.3 1.6-1 1.6-1.7 0-.7-.5-1.4-1.6-1.7Z" fill="currentColor" opacity=".5"/></svg>',
    back:'<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.6" stroke="currentColor" stroke-width="1.8"/></svg>',
    phone:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 4h4l1.6 4.2-2 1.5a13 13 0 0 0 5.7 5.7l1.5-2L20 15v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.6 4.5L19 7.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    checkDraw:'<svg viewBox="0 0 24 24" fill="none"><path class="path" d="m5 12.5 4.6 4.5L19 7.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    cross:'<svg viewBox="0 0 24 24" fill="none"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/></svg>',
    warn:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2.7 19.5h18.6L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4.4M12 17.6h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    lock:'<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" stroke="currentColor" stroke-width="1.8"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.2" r="3.6" stroke="currentColor" stroke-width="1.8"/><path d="M4.8 19.4a7.6 7.6 0 0 1 14.4 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    eye:'<svg viewBox="0 0 24 24" fill="none"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2.7" stroke="currentColor" stroke-width="1.7"/></svg>',
    eyeOff:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 4.5 20 19.5M9.5 6.3A9.7 9.7 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3 3.6M6 8a16 16 0 0 0-3.5 4S6 18.2 12 18.2c1 0 2-.2 2.8-.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    truck:'<svg viewBox="0 0 24 24" fill="none"><path d="M2.5 6.5h11v10h-11zM13.5 9.5h4.2l3.3 3.4v3.6h-7.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="7" cy="17.8" r="1.9" stroke="currentColor" stroke-width="1.6"/><circle cx="17.4" cy="17.8" r="1.9" stroke="currentColor" stroke-width="1.6"/></svg>',
    expand:'<svg viewBox="0 0 24 24" fill="none"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    nav:'<svg viewBox="0 0 24 24" fill="none"><path d="M20.5 3.5 10 20l-1.6-6.9L2 11.5 20.5 3.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    camera:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 8.2h3l1.6-2.4h6.8L17 8.2h3a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 20.2H4A1.5 1.5 0 0 1 2.5 18.7v-9A1.5 1.5 0 0 1 4 8.2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="13.8" r="3.4" stroke="currentColor" stroke-width="1.7"/></svg>',
    chev:'<svg viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    box:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.7 3.5 6.9v10.2L12 21.3l8.5-4.2V6.9L12 2.7Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M3.5 6.9 12 11l8.5-4.1M12 11v10" stroke="currentColor" stroke-width="1.7"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    undoI:'<svg viewBox="0 0 24 24" fill="none"><path d="M8 5 4 9l4 4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 9h10a6 6 0 1 1 0 12h-3" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    cloudOff:'<svg viewBox="0 0 24 24" fill="none"><path d="M7 18.5h11a3.8 3.8 0 0 0 .6-7.6 6 6 0 0 0-10.3-3M4.5 9.4A4.6 4.6 0 0 0 7 18.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="m4 4 16 16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    sync:'<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 9a8 8 0 0 1 13.3-3L21 9M19.5 15a8 8 0 0 1-13.3 3L3 15M21 3.5V9h-5.5M3 20.5V15h5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------------- statusbar ---------------- */
  function statusbar(dark, bg){
    var net = S.net==='offline' ? '<span class="sb-net--off">'+I.wifiOff+'</span>' : I.wifi + I.cell;
    return '<div class="statusbar '+(dark?'on-dark':'on-light')+'" style="background:'+(bg||'transparent')+'">' +
      '<span class="t">9:41</span><span class="ic">'+net+I.batt+'</span></div>';
  }
  function netbar(){
    if (S.net==='offline') return '<div class="netbar">'+I.cloudOff+'You’re offline — deliveries save on the phone and sync later.</div>';
    return '';
  }

  /* ---------------- screens ---------------- */
  function loginScreen(){
    var fe = S.fieldErr;
    return statusbar(true, '#062B27') +
    '<div class="login'+(S.loginErr?' shake':'')+'" data-shake>' +
      '<div class="login__hero"><div class="bg"></div><div class="grid"></div>' +
        '<svg class="login__art" viewBox="0 0 340 300" fill="none" aria-hidden="true">' +
          '<path class="rt" d="M42 250 C 90 250 96 176 150 176 C 210 176 206 108 150 100 C 96 92 92 44 150 44 C 212 44 250 60 296 52" stroke="#1EC8B9" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="7 9" opacity="0.55"/>' +
          '<g class="pin" transform="translate(42 250)"><circle r="15" fill="#0C564D"/><circle r="6" fill="#7FE8DC"/></g>' +
          '<g transform="translate(150 176)"><circle r="12" fill="#0C564D"/><circle r="4.5" fill="#5FE0D2"/></g>' +
          '<g transform="translate(150 44)"><circle r="12" fill="#0C564D"/><circle r="4.5" fill="#5FE0D2"/></g>' +
          '<g transform="translate(296 52)"><path d="M0 -18 C 10 -6 15 2 15 9 A 15 15 0 1 1 -15 9 C -15 2 -10 -6 0 -18 Z" fill="#12B5A6"/><path d="M-5 8 a 5 5 0 0 0 5 5" stroke="#EAFFFC" stroke-width="2" stroke-linecap="round" opacity="0.7" fill="none"/></g>' +
        '</svg>' +
        '<div class="login__top"><div class="login__mark">e</div>' +
          '<span class="login__tag"><span class="pip"></span>Driver App</span></div>' +
        '<div class="login__brand"><div class="mk">Edgistify × Bisleri</div>' +
          '<h1>Run your route.<br/><b>Every stop, one list.</b></h1></div>' +
      '</div>' +
      '<div class="login__card">' +
        '<div class="login__title">Login to your account<small>Use the driver ID your supervisor gave you.</small></div>' +
        (S.loginErr ? '<div class="login__err">'+I.warn+'<span>'+esc(S.loginErr)+'</span></div>' : '') +
        '<div class="field'+(fe.uid?' is-error':'')+'" data-f="uid"><label>Driver ID</label>' +
          '<div class="box">'+I.user+'<input id="f-uid" type="text" inputmode="text" autocomplete="off" placeholder="e.g. MUM-0482" value="'+esc(S.uid)+'"/></div>' +
          (fe.uid?'<div class="err">'+I.warn+esc(fe.uid)+'</div>':'') + '</div>' +
        '<div class="field'+(fe.pw?' is-error':'')+'" data-f="pw"><label>Password</label>' +
          '<div class="box">'+I.lock+'<input id="f-pw" type="'+(S.showPw?'text':'password')+'" placeholder="Your password" value="'+esc(S.pw)+'"/>' +
          '<button class="eye" data-act="eye" type="button">'+(S.showPw?I.eyeOff:I.eye)+'</button></div>' +
          (fe.pw?'<div class="err">'+I.warn+esc(fe.pw)+'</div>':'') + '</div>' +
        '<button class="btn'+(S.loggingIn?' is-loading':'')+'" data-act="login" type="button"><span class="btn__txt">Login</span><span class="spin"></span></button>' +
        '<div class="login__foot">&nbsp;</div>' +
      '</div>' +
    '</div>';
  }

  function stopTags(s, small){
    var t = '';
    if (s.status==='queued') t += '<span class="tag tag--queued">'+I.cloudOff+'Saved offline</span>';
    (s.tags||[]).forEach(function(k){
      if (k==='nolift') t += '<span class="tag tag--nolift">'+I.warn+'No lift</span>';
      if (k==='call')   t += '<span class="tag tag--call">'+I.phone+'Call ahead</span>';
      if (k==='dock')   t += '<span class="tag tag--dock">'+I.box+'Dock delivery</span>';
      if (k==='floor')  t += '<span class="tag tag--floor">'+esc(s.floor)+' · service lift</span>';
    });
    return t;
  }

  function homeScreen(){
    var c = counts();
    var next = pending()[0];
    var dayOver = c.resolved === c.total;
    var list = S.stops.map(function(s){
      var st = s.status;
      var isNext = next && s.id===next.id;
      var seq = st==='done' ? I.check : (st==='fail' ? I.cross : (st==='queued' ? I.check : s.seq));
      var foot = '';
      if (st==='done') foot = '<div class="stop__foot ok">'+I.check+'Delivered · proof on record</div>';
      if (st==='queued') foot = '<div class="stop__foot ok" style="color:var(--amber)">'+I.cloudOff+'Delivered · waiting to sync</div>';
      if (st==='fail') foot = '<div class="stop__foot bad">'+I.cross+'Failed · '+esc(s.failWhy||'')+'</div>';
      var tags = stopTags(s);
      return '<div class="stop'+(isNext?' is-next':'')+(st==='done'||st==='queued'?' is-done':'')+(st==='fail'?' is-fail':'')+'" data-stop="'+s.id+'">' +
        (isNext ? '<div class="stop__next"><span>'+I.nav+'Next stop</span><span>ETA '+esc(s.eta)+'</span></div>' : '') +
        '<div class="stop__row"><div class="stop__seq">'+seq+'</div>' +
        '<div class="stop__mid"><div class="stop__name">'+esc(s.name)+'</div>' +
          '<div class="stop__addr">'+I.pin+'<span>'+esc(s.addr)+'</span></div>' +
          (tags ? '<div class="stop__tags">'+tags+'</div>' : '') +
        '</div>' +
        '<div class="stop__end"><span class="stop__jars"><b>'+s.jars+'</b>jars</span>' +
          (st==='pending' ? '<span class="stop__go">'+I.chev+'</span>' : '') + '</div>' +
        '</div>' + foot + '</div>';
    }).join('');

    var daydone = '';
    if (dayOver){
      daydone = '<div class="daydone"><div class="seal">'+I.checkDraw+'</div>' +
        '<h2>Route complete</h2><p>Every stop on today’s sheet is accounted for.<br/>The planner can see the full day.</p>' +
        '<div class="nums"><div><b style="color:var(--green-600)">'+c.done+(c.queued? '+'+c.queued:'')+'</b><span>Delivered</span></div>' +
        '<div><b style="color:'+(c.fail?'var(--red)':'var(--ink-4)')+'">'+c.fail+'</b><span>Failed</span></div>' +
        '<div><b>'+S.stops.reduce(function(a,s){return a+(s.status!=='fail'?s.jars:0);},0)+'</b><span>Jars out</span></div></div></div>';
    }

    return statusbar(true, 'var(--teal-800)') +
      '<div class="appbar"><div class="who"><b>Morning route · MUM-04</b>' +
        '<span>'+I.pin+'Andheri East depot · Tata Ace (AC-3812)</span></div>' +
        '<button class="av" data-act="logout" title="Log out">RS</button></div>' +
      netbar() +
      '<div class="runbar"><div class="r1"><b><i>'+(c.done+c.queued)+'</i> of '+c.total+' delivered</b><span class="due">Due back 4:30 PM</span></div>' +
        '<div class="track"><i class="ok" style="width:'+((c.done+c.queued)/c.total*100)+'%"></i><i class="bad" style="width:'+(c.fail/c.total*100)+'%"></i></div>' +
        '<div class="r2"><span class="chip"><span class="dot" style="background:var(--teal)"></span><b>'+(c.total-c.resolved)+'</b>&nbsp;remaining</span>' +
        (c.fail?'<span class="chip"><span class="dot" style="background:var(--red-soft)"></span><b>'+c.fail+'</b>&nbsp;failed</span>':'') +
        (c.queued?'<span class="chip"><span class="dot" style="background:var(--amber-400)"></span><b>'+c.queued+'</b>&nbsp;to sync</span>':'') +
        '</div></div>' +
      (dayOver ? '' :
      '<div class="mapcard"><iframe loading="lazy" src="'+(S.net==='offline' ? 'about:blank' : (next ? routeEmbed() : mapEmbed(DEPOT_LL,12)))+'" title="Route map preview"></iframe>' +
        '<span class="veh">'+I.truck+esc(next? 'Next: '+next.name : 'Route')+'</span>' +
        '<button class="expand" data-act="map">'+I.expand+'Route map</button></div>') +
      '<div class="scroll">' + daydone +
        '<div class="listhead"><b>Today’s stops</b><span>Planned order · no 10-stop limit</span></div>' +
        list + '</div>';
  }

  function mapScreen(){
    var next = pending()[0];
    var legend = S.stops.map(function(s){
      var col = s.status==='done'||s.status==='queued' ? 'var(--green)' : s.status==='fail' ? 'var(--red-soft)' : 'var(--teal)';
      return '<span class="lg"><i style="background:'+col+'"></i>'+s.seq+' · '+esc(s.name)+'</span>';
    }).join('');
    return statusbar(true, 'var(--teal-800)') +
      '<div class="appbar"><button class="back" data-act="home">'+I.back+'</button>' +
        '<div class="who"><b>Route map</b><span>'+I.nav+'Live · '+pending().length+' stops left, in order</span></div></div>' +
      netbar() +
      '<div class="mapfull">' +
        (S.net==='offline'
          ? '<div style="position:absolute;inset:0;display:grid;place-items:center;background:var(--canvas-2);"><div style="text-align:center;color:var(--ink-3);max-width:220px;"><div style="width:52px;height:52px;margin:0 auto 12px;border-radius:50%;background:var(--surface);display:grid;place-items:center;color:var(--amber);box-shadow:var(--shadow-card)">'+I.cloudOff+'</div><b style="font-size:14px;color:var(--ink)">Map needs a connection</b><p style="font-size:12px;line-height:1.5;margin:6px 0 0">Your stop list still works offline — run the day from there.</p></div></div>'
          : '<iframe loading="lazy" src="'+routeEmbed()+'" title="Full route on Google Maps"></iframe>') +
        (next ? '<div class="mapsheet"><div class="grip"></div><div class="row"><div class="seq">'+next.seq+'</div>' +
          '<div class="tx"><b>'+esc(next.name)+'</b><span>ETA '+esc(next.eta)+' · '+next.jars+' jars</span></div>' +
          '<button class="go" data-stop="'+next.id+'">Open stop '+I.chev+'</button></div>' +
          '<div class="maplegend">'+legend+'</div></div>' : '') +
      '</div>';
  }

  function detailScreen(){
    var s = stop(S.detailId); if (!s) { S.screen='home'; return homeScreen(); }
    var resolved = s.status!=='pending';
    var noLift = (s.tags||[]).indexOf('nolift')>-1;
    var callAhead = (s.tags||[]).indexOf('call')>-1;
    var called = !!S.called[s.id];

    var note = '';
    if (noLift) note = '<div class="dnote red">'+I.warn+'<span><b>No lift.</b> '+esc(s.note||'Call ahead so someone meets you.')+'</span></div>';
    else if (callAhead) note = '<div class="dnote">'+I.phone+'<span><b>Call ahead.</b> '+esc(s.note||'Confirm someone is home before you climb.')+'</span></div>';

    var status = '';
    if (s.status==='done'||s.status==='queued')
      status = '<div class="dcard" style="text-align:center"><div class="stop__seq" style="margin:0 auto 10px;background:var(--green-50);color:var(--green-600)">'+I.check+'</div>' +
        '<b style="font-size:15px">Delivered'+(s.status==='queued'?' · waiting to sync':'')+'</b>' +
        '<p style="margin:6px 0 0;font-size:12.5px;color:var(--ink-3)">Proof photo is on record for the planner.</p></div>';
    if (s.status==='fail')
      status = '<div class="dcard" style="text-align:center"><div class="stop__seq" style="margin:0 auto 10px;background:var(--red-50);color:var(--red)">'+I.cross+'</div>' +
        '<b style="font-size:15px">Marked failed</b>' +
        '<p style="margin:6px 0 0;font-size:12.5px;color:var(--ink-3)">Reason sent to the planner: “'+esc(s.failWhy||'')+'”</p></div>';

    return statusbar(true, 'var(--teal-800)') +
      '<div class="appbar"><button class="back" data-act="home">'+I.back+'</button>' +
        '<div class="who"><b>Stop '+s.seq+' of '+S.stops.length+'</b><span>'+I.clock+'ETA '+esc(s.eta)+'</span></div></div>' +
      netbar() +
      '<div class="detail">' +
        '<div class="detail__map">' +
          (S.net==='offline'
            ? '<div style="position:absolute;inset:0;display:grid;place-items:center;color:var(--ink-4);font-size:12px;">Map offline</div>'
            : '<iframe loading="lazy" src="'+mapEmbed(s.ll,16)+'" title="Stop location"></iframe>' +
              '<button class="open" data-act="map">'+I.expand+'Route map</button>') +
        '</div>' +
        '<div class="detail__body">' +
          '<div class="dcard">' +
            (stopTags(s)?'<div class="dcard__tags">'+stopTags(s)+'</div>':'') +
            '<h2>'+esc(s.name)+'</h2>' +
            '<div class="addr">'+I.pin+'<span>'+esc(s.addr)+'</span></div>' +
            '<div class="meta"><div class="m"><b>'+s.jars+'</b><span>20L jars</span></div>' +
              '<div class="m"><b>'+esc(s.floor||'—')+'</b><span>Floor</span></div>' +
              '<div class="m"><b>'+esc(s.eta)+'</b><span>ETA</span></div></div>' +
          '</div>' +
          note +
          '<div class="dcard dcontact"><div class="ava">'+esc(s.who.split(' ').map(function(w){return w[0];}).slice(0,2).join(''))+'</div>' +
            '<div class="tx"><b>'+esc(s.who)+'</b><span>'+esc(maskPhone(s.phone))+' · masked</span></div>' +
            (called ? '<span class="called">'+I.check+'Called</span>'
                    : '<button class="callbtn" data-act="call" title="Call">'+I.phone+'</button>') +
          '</div>' +
          (resolved ? status :
            '<div class="slidewrap">' +
              ((noLift||callAhead) && !called ? '<div class="dnote" style="margin-bottom:11px">'+I.info+'<span>Tip: call before you unload — this stop is flagged <b>'+(noLift?'no lift':'call ahead')+'</b>.</span></div>' : '') +
              '<div class="slide" id="slide"><div class="slide__fill"></div>' +
                '<div class="slide__lbl">Slide to deliver '+I.chev+'</div>' +
                '<div class="slide__knob">'+I.box+'</div></div>' +
              '<button class="btn btn--danger-ghost cantbtn" data-act="cant">Can’t deliver this stop</button>' +
            '</div>') +
        '</div>' +
      '</div>';
  }

  /* ---------------- sheets ---------------- */
  function sheetHtml(){
    if (!S.sheet) return '';
    var s = stop(S.detailId);
    if (S.sheet==='call'){
      return '<div class="scrim" data-act="closeSheet"></div><div class="sheet">' +
        '<div class="grip"></div>' +
        '<div class="callsheet__ava"><span class="ring"></span>'+esc(s.who.split(' ').map(function(w){return w[0];}).slice(0,2).join(''))+'</div>' +
        '<div class="callsheet__nm">'+esc(s.who)+'</div>' +
        '<div class="callsheet__st" id="callTimer">Calling…</div>' +
        '<div class="callsheet__num">'+I.phone+esc(maskPhone(s.phone))+'</div>' +
        '<div class="callsheet__q">Did they pick up?</div>' +
        '<div class="sheet__foot"><button class="btn" data-act="endCall">'+I.check+'Yes — they’ll meet me</button>' +
        '<button class="btn btn--ghost" data-act="closeSheet">No answer — try later</button></div></div>';
    }
    if (S.sheet==='proof'){
      return '<div class="scrim"></div><div class="sheet">' +
        '<div class="grip"></div><h3>Proof of delivery</h3>' +
        '<div class="sub">One photo of the jars at the door — the planner sees it against the stop.</div>' +
        '<div class="sheet__scroll">' +
          '<div class="proof__shot'+(S.proofShot?' is-captured':'')+'" data-act="capture">' +
            '<div class="hint">'+I.camera+'<b>Tap to capture</b><span>Camera · simulated</span></div>' +
            '<div class="proof__img"><div class="ph"></div>' +
              '<div class="jars"><span class="jar"></span><span class="jar" style="height:58px"></span><span class="jar" style="height:48px"></span></div>' +
              '<div class="stamp">'+esc(s.name)+' · 9:41 AM · GPS locked</div>' +
              '<div class="okbdg">'+I.check+'</div></div>' +
            '<div class="flash" id="flash"></div>' +
          '</div>' +
          '<div class="proof__row">'+I.box+'<span class="tx"><b>'+s.jars+' × 20L jars</b> · '+esc(s.name)+'</span></div>' +
          '<div class="proof__row proof__gps'+(S.proofShot?' is-locked':'')+'">'+I.pin+'<span class="tx">'+(S.proofShot
              ? '<b>Location captured</b> · '+esc(s.ll)+' · ±'+s.acc+' m'
              : '<b>Locating…</b> · GPS will lock with the photo')+'</span>'+(S.proofShot?I.check:'')+'</div>' +
          (S.net==='offline' ? '<div class="dnote">'+I.cloudOff+'<span><b>Offline.</b> The delivery saves on the phone and syncs when you’re back on network.</span></div>' : '') +
        '</div>' +
        '<div class="sheet__foot">' +
          '<button class="btn" data-act="confirmDeliver" '+(S.proofShot?'':'disabled')+'><span class="btn__txt">Confirm delivery</span><span class="spin"></span></button>' +
          '<button class="btn btn--ghost" data-act="closeSheet">Back</button></div></div>';
    }
    if (S.sheet==='reason'){
      var list = REASONS.map(function(r){
        return '<div class="reason'+(S.reasonSel===r.id?' is-sel':'')+'" data-reason="'+r.id+'">' +
          '<span class="rad"><i></i></span><span class="tx"><b>'+r.h+'</b><span>'+r.s+'</span></span></div>' +
          (r.id==='other' && S.reasonSel==='other'
            ? '<div class="reason__other'+(S.reasonErr?' is-error':'')+'"><textarea id="otherTx" placeholder="What happened at the door?">'+esc(S.reasonText)+'</textarea>' +
              (S.reasonErr?'<div class="err">'+I.warn+'Tell the planner what happened — this is required.</div>':'') + '</div>'
            : '');
      }).join('');
      return '<div class="scrim" data-act="closeSheet"></div><div class="sheet">' +
        '<div class="grip"></div><h3>Why can’t this be delivered?</h3>' +
        '<div class="sub">The reason goes straight to the planner against row '+ (s.seq+11) +' of today’s sheet.</div>' +
        '<div class="sheet__scroll">'+list+'</div>' +
        '<div class="sheet__foot"><button class="btn" data-act="confirmFail" '+(S.reasonSel?'':'disabled')+' style="background:var(--red);box-shadow:0 12px 24px -10px rgba(201,58,50,.5)">Mark stop failed</button>' +
        '<button class="btn btn--ghost" data-act="closeSheet">Go back</button></div></div>';
    }
    return '';
  }

  function successHtml(){
    if (!S.success) return '';
    var s = S.success;
    var conf = '';
    if (s.kind==='done'){
      var cols=['#01A699','#FCAF43','#60B359','#2FBFB2','#F2C14E'];
      for (var i=0;i<26;i++){
        conf += '<i style="left:'+(4+Math.random()*92)+'%;background:'+cols[i%5]+';animation-delay:'+(Math.random()*0.35)+'s;animation-duration:'+(1.1+Math.random()*0.8)+'s"></i>';
      }
    }
    return '<div class="successwrap'+(s.kind==='queued'?' amber':'')+'">' +
      (conf?'<div class="confetti">'+conf+'</div>':'') +
      '<div class="seal">'+(s.kind==='queued'?I.cloudOff:I.checkDraw)+'</div>' +
      '<h2>'+(s.kind==='queued'?'Saved on the phone':'Delivered')+'</h2>' +
      '<p>'+esc(s.msg)+'</p>' +
      (s.kind==='queued'?'<div class="qn"><b>Offline.</b> This delivery syncs to the planner the moment you’re back on network — nothing to redo.</div>':'') +
      '<div style="width:100%;margin-top:26px"><button class="btn" data-act="successDone">'+(pending().length? 'Next stop':'Back to route')+'</button></div>' +
    '</div>';
  }

  /* ---------------- render ---------------- */
  function render(){
    var inner = S.screen==='login' ? loginScreen()
              : S.screen==='map' ? mapScreen()
              : S.screen==='detail' ? detailScreen()
              : homeScreen();
    ROOT.innerHTML = '<div class="screen">' + inner + sheetHtml() + successHtml() + '</div>';
    wire();
    // seeded frames: surface the "Other" error which lives below the sheet fold
    if (S.sheet === 'reason' && S.reasonSel === 'other'){
      var sc = ROOT.querySelector('.sheet__scroll');
      if (sc) sc.scrollTop = sc.scrollHeight;
    }
  }

  /* ---------------- toast ---------------- */
  function toast(msg, opts){
    opts = opts || {};
    clearTimeout(toastTimer); clearInterval(undoTick); clearTimeout(undoTimer);
    var el = document.createElement('div');
    el.className = 'toast'+(opts.red?' red':'');
    el.innerHTML = (opts.red?I.cross:I.check) + '<span class="tx">'+msg+'</span>' +
      (opts.undo ? '<button class="undo" id="undoBtn">Undo · <span id="undoN">5</span></button>' : '');
    var screen = ROOT.querySelector('.screen'); if(!screen) return;
    var old = screen.querySelector('.toast'); if (old) old.remove();
    screen.appendChild(el);
    var life = opts.undo ? 5000 : 2600;
    if (opts.undo){
      var n = 5;
      undoTick = setInterval(function(){ n--; var sp=document.getElementById('undoN'); if(sp) sp.textContent = n; if(n<=0) clearInterval(undoTick); },1000);
      var ub = document.getElementById('undoBtn');
      if (ub) ub.addEventListener('click', function(){ clearInterval(undoTick); clearTimeout(undoTimer); opts.undo(); });
      undoTimer = setTimeout(dismiss, life);
    } else {
      toastTimer = setTimeout(dismiss, life);
    }
    function dismiss(){ el.classList.add('leaving'); setTimeout(function(){ el.remove(); }, 320); }
  }

  /* ---------------- actions ---------------- */
  function doLogin(){
    if (S.loggingIn) return;
    var uid = document.getElementById('f-uid'), pw = document.getElementById('f-pw');
    S.uid = uid?uid.value.trim():''; S.pw = pw?pw.value:'';
    S.fieldErr = {}; S.loginErr = null;
    if (!S.uid) S.fieldErr.uid = 'Enter your driver ID.';
    if (!S.pw) S.fieldErr.pw = 'Enter your password.';
    if (S.fieldErr.uid || S.fieldErr.pw){ render(); return; }
    if (S.pw !== 'bisleri'){
      S.loginErr = 'That ID and password don’t match. Try again, or ask your supervisor to reset it. (Demo password: bisleri)';
      S.pw=''; render(); return;
    }
    S.loggingIn = true; render();
    setTimeout(function(){ S.loggingIn=false; S.screen='home'; render(); toast('Logged in · route for '+new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short'})+' loaded'); }, 950);
  }

  function completeDeliver(){
    var s = stop(S.detailId);
    var offline = S.net==='offline';
    s.status = offline ? 'queued' : 'done';
    S.sheet = null; S.proofShot = false;
    S.success = offline
      ? { kind:'queued', msg: s.jars+' jars at '+s.name+' — recorded with the proof photo.' }
      : { kind:'done',  msg: s.jars+' jars at '+s.name+'. Proof photo sent to the planner.' };
    render();
  }

  function confirmFail(){
    var s = stop(S.detailId);
    if (!S.reasonSel) return;
    if (S.reasonSel==='other' && !S.reasonText.trim()){ S.reasonErr = true; render(); return; }
    var r = REASONS.filter(function(x){return x.id===S.reasonSel;})[0];
    var why = S.reasonSel==='other' ? S.reasonText.trim() : r.h;
    var prev = s.status;
    s.status = 'fail'; s.failWhy = why;
    S.sheet=null; S.reasonSel=null; S.reasonText=''; S.reasonErr=false; S.screen='home';
    render();
    toast('<b>'+esc(s.name)+'</b> marked failed · planner notified', { red:true, undo:function(){
      s.status = prev; s.failWhy = null; render(); toast('Restored — stop is back on your route');
    }});
  }

  function setNet(n){
    if (S.net === n) return;
    S.net = n;
    document.querySelectorAll('.netsim button').forEach(function(b){ b.classList.toggle('is-on', b.getAttribute('data-net')===n); });
    if (n==='online'){
      var q = S.stops.filter(function(s){ return s.status==='queued'; });
      render();
      if (q.length){
        setTimeout(function(){
          q.forEach(function(s){ s.status='done'; });
          render();
          toast(q.length+' offline '+(q.length===1?'delivery':'deliveries')+' synced to the planner');
        }, 1100);
        toast('Back online · syncing '+q.length+'…');
      } else { toast('Back online'); }
    } else {
      render();
    }
  }

  /* ---------------- slide-to-deliver ---------------- */
  function wireSlide(){
    var el = document.getElementById('slide'); if (!el || STATIC) return;
    var knob = el.querySelector('.slide__knob'), fill = el.querySelector('.slide__fill');
    var max = el.clientWidth - knob.offsetWidth - 10;
    var startX = null, x = 0, active = false;
    function move(cx){
      x = Math.max(0, Math.min(max, cx - startX));
      knob.style.transform = 'translateX(' + x + 'px)';
      fill.style.width = (x + 54) + 'px';
    }
    knob.addEventListener('pointerdown', function(e){
      active = true; startX = e.clientX; el.classList.remove('is-springing');
      knob.setPointerCapture(e.pointerId);
    });
    knob.addEventListener('pointermove', function(e){ if (active) move(e.clientX); });
    knob.addEventListener('pointerup', function(){
      if (!active) return; active = false;
      if (x >= max * 0.82){
        el.classList.add('is-done');
        knob.style.transform = 'translateX(' + max + 'px)';
        knob.innerHTML = I.check;
        setTimeout(function(){ S.sheet = 'proof'; S.proofShot = false; render(); }, 260);
      } else {
        el.classList.add('is-springing');
        knob.style.transform = 'translateX(0)'; fill.style.width = '0';
      }
    });
  }

  /* ---------------- wiring ---------------- */
  function wire(){
    if (STATIC) return;
    ROOT.querySelectorAll('[data-act]').forEach(function(el){
      el.addEventListener('click', function(ev){
        ev.stopPropagation();
        var a = el.getAttribute('data-act');
        if (a==='login') doLogin();
        if (a==='eye'){ S.showPw = !S.showPw; keepFields(); render(); }
        if (a==='logout'){ applySeed(); S.screen='login'; render(); }
        if (a==='home'){ S.screen='home'; S.sheet=null; render(); }
        if (a==='map'){ S.screen='map'; S.sheet=null; render(); }
        if (a==='call'){ S.sheet='call'; render(); startCallTimer(); }
        if (a==='endCall'){ S.called[S.detailId]=true; S.sheet=null; clearInterval(callTick); render(); toast('Noted — '+esc(stop(S.detailId).who)+' is expecting you'); }
        if (a==='closeSheet'){ S.sheet=null; S.reasonErr=false; clearInterval(callTick); render(); }
        if (a==='cant'){ S.sheet='reason'; S.reasonSel=null; S.reasonText=''; S.reasonErr=false; render(); }
        if (a==='capture'){ if (!S.proofShot){ var f=document.getElementById('flash'); if(f){ f.classList.add('go'); } setTimeout(function(){ S.proofShot=true; render(); },220); } }
        if (a==='confirmDeliver'){ if (!S.proofShot) return; el.classList.add('is-loading'); setTimeout(completeDeliver, 750); }
        if (a==='confirmFail') confirmFail();
        if (a==='successDone'){
          S.success = null;
          var nx = pending()[0];
          if (nx){ S.detailId = nx.id; S.screen='detail'; } else { S.screen='home'; }
          render();
        }
      });
    });
    ROOT.querySelectorAll('[data-stop]').forEach(function(el){
      el.addEventListener('click', function(){
        S.detailId = el.getAttribute('data-stop'); S.screen='detail'; S.sheet=null; render();
      });
    });
    ROOT.querySelectorAll('[data-reason]').forEach(function(el){
      el.addEventListener('click', function(){
        var v = el.getAttribute('data-reason');
        if (v==='other' && S.reasonSel==='other') return;
        var tx = document.getElementById('otherTx'); if (tx) S.reasonText = tx.value;
        S.reasonSel = v; S.reasonErr = false; render();
        var ntx = document.getElementById('otherTx'); if (ntx && v==='other') ntx.focus();
      });
    });
    var otherTx = document.getElementById('otherTx');
    if (otherTx) otherTx.addEventListener('input', function(){ S.reasonText = otherTx.value; S.reasonErr=false;
      var w = otherTx.closest('.reason__other'); if (w) w.classList.remove('is-error'); });
    // focus rings on login fields
    ['f-uid','f-pw'].forEach(function(id){
      var inp = document.getElementById(id); if (!inp) return;
      inp.addEventListener('focus', function(){ inp.closest('.field').classList.add('is-focus'); });
      inp.addEventListener('blur',  function(){ inp.closest('.field').classList.remove('is-focus'); });
      inp.addEventListener('keydown', function(e){ if (e.key==='Enter') doLogin(); });
    });
    wireSlide();
  }
  function keepFields(){
    var uid = document.getElementById('f-uid'), pw = document.getElementById('f-pw');
    if (uid) S.uid = uid.value; if (pw) S.pw = pw.value;
  }
  function startCallTimer(){
    clearInterval(callTick);
    var t = 0;
    callTick = setInterval(function(){
      t++;
      var el = document.getElementById('callTimer');
      if (el) el.textContent = t < 2 ? 'Ringing…' : ('00:' + String(t-2).padStart(2,'0'));
    }, 1000);
  }

  /* ---------------- demo controls ---------------- */
  var resetBtn = document.getElementById('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', function(){ applySeed(); render(); });
  document.querySelectorAll('.netsim button').forEach(function(b){
    b.addEventListener('click', function(){ setNet(b.getAttribute('data-net')); });
  });

  /* ---------------- fit / scale ---------------- */
  function fit(){
    if (BARE) return;
    if (FILL){
      document.documentElement.style.setProperty('--scale', (window.innerWidth/390).toFixed(4));
      return;
    }
    var reserve = (STATIC || EMBED) ? 12 : 84;
    var s = Math.min(window.innerWidth/430, (window.innerHeight-reserve)/900, 1);
    document.documentElement.style.setProperty('--scale', s.toFixed(3));
  }
  window.addEventListener('resize', fit); fit();

  /* ---------------- boot ---------------- */
  applySeed();
  render();
})();


/* ============================================================
   BISLERI ADMIN PLANNER — working prototype
   Flow: Upload sheet (warehouse + file) → Validate rows (missing
   address, duplicate order, over-capacity — all fixable inline)
   → Choose vehicle + driver (capacity check) → Plan route on a
   live Google Map (drag to reorder) → Dispatch to the driver app.
   Edge cases: empty file, all drivers busy, duplicate order ids,
   unfixed rows blocking continue, capacity overflow warning.
   ============================================================ */
(function () {
  'use strict';
  var ROOT = document.getElementById('root');
  var PARAMS = new URLSearchParams(location.search);
  var STATIC = PARAMS.get('static') === '1';
  var SEED = PARAMS.get('seed') || '';
  if (STATIC) document.documentElement.classList.add('is-static');
  var WAREHOUSE_Q = 'Bisleri Compound, Western Express Highway, Andheri East, Mumbai';

  var WAREHOUSES = {
    'Andheri East \u2014 Main Depot': '19.1180,72.8630',
    'Bhiwandi \u2014 Regional Hub': '19.2810,73.0480',
    'Thane \u2014 Satellite Store': '19.2183,72.9781'
  };

  function freshRows(){ return [
    { id:'BSL-4471', addr:'A-702, Crystal Plaza, New Link Rd, Andheri West, Mumbai', ll:'19.1364,72.8296', jars:10, status:'ok' },
    { id:'BSL-4472', addr:'302, Sea Breeze CHS, Carter Rd, Bandra West, Mumbai', ll:'19.0585,72.8200', jars:6, status:'ok' },
    { id:'BSL-4473', addr:'', ll:'19.0281,72.8395', jars:4, status:'bad', errType:'addr', name:'Aarti Kulkarni' },
    { id:'BSL-4474', addr:'Unit 4B, Kamala Mills, Senapati Bapat Marg, Lower Parel, Mumbai', ll:'18.9949,72.8258', jars:20, status:'ok' },
    { id:'BSL-4475', addr:'1404, Tower B, Ashok Towers, Dr B.A. Rd, Parel, Mumbai', ll:'18.9990,72.8340', jars:12, status:'ok' },
    { id:'BSL-4471', addr:'501, Galaxy Apartments, Worli Sea Face, Mumbai', ll:'18.9930,72.8140', jars:5, status:'dup' },
    { id:'BSL-4477', addr:'B-204, Lakeview CHS, Hiranandani Gardens, Powai, Mumbai', ll:'19.1180,72.9050', jars:8, status:'ok' }
  ]; }

  var VEHICLES = [
    { id:'2w', name:'2-Wheeler', sub:'Bike carrier', route:'Tight lanes, quick single drops' },
    { id:'3w', name:'3-Wheeler', sub:'Auto tempo', route:'Dense neighbourhood clusters' },
    { id:'4w', name:'4-Wheeler', sub:'Tata Ace', route:'Balanced mixed-area runs' },
    { id:'lcv', name:'LCV Truck', sub:'407 / Bolero pickup', route:'Long hauls, bulk stops' }
  ];

  var DRIVERS = [
    { id:'MUM-0482', name:'Ramesh Sawant', vehicle:'Tata Ace \u00b7 AC-3812', avail:true,  phone:'+91 98201 44857', email:'ramesh.s@edgistify.com' },
    { id:'MUM-0511', name:'Deepak Patil', vehicle:'407 LCV \u00b7 AC-2290', avail:true,  phone:'+91 99304 71126', email:'deepak.p@edgistify.com' },
    { id:'MUM-0339', name:'Suresh Yadav', vehicle:'3-Wheeler \u00b7 AC-1187', avail:false, phone:'+91 98678 03395', email:'' },
    { id:'MUM-0402', name:'Iqbal Shaikh', vehicle:'Tata Ace \u00b7 AC-4410', avail:true,  phone:'+91 98190 27741', email:'iqbal.s@edgistify.com' }
  ];

  function maskPhone(p){
    if (!p) return '';
    var di = 0, digits = (p.match(/\d/g)||[]).length;
    return p.replace(/\d/g, function(d){ di++; return (di<=4 || di>digits-2) ? d : '\u2022'; });
  }

  var S = {};
  var ROUTES = [
    { id:'RT-0714', driver:'Deepak Patil', vehicle:'LCV Truck', stops:9, jars:96, when:'Today · 8:10 AM', status:'running', done:4 },
    { id:'RT-0713', driver:'Iqbal Shaikh', vehicle:'4-Wheeler', stops:7, jars:58, when:'Today · 7:45 AM', status:'running', done:6 },
    { id:'RT-0709', driver:'Ramesh Sawant', vehicle:'4-Wheeler', stops:8, jars:72, when:'Yesterday', status:'done', done:8 },
    { id:'RT-0705', driver:'Suresh Yadav', vehicle:'3-Wheeler', stops:5, jars:22, when:'Yesterday', status:'done', done:5 },
    { id:'RT-0701', driver:'Deepak Patil', vehicle:'LCV Truck', stops:11, jars:124, when:'2 days ago', status:'done', done:11 }
  ];

  function reset(){
    S = { authed:false, view:'home', step:0, warehouse:'Andheri East \u2014 Main Depot', fileName:'', rows:[],
          vehicle:null, driver:null, planned:false, dispatching:false, dispatched:false,
          uid:'ops@edgistify.com', pw:'bisleri', showPw:false, loginErr:null, loggingIn:false, dragIdx:null };
    applySeed();
  }
  function newRun(){
    // start a fresh route WITHOUT signing out
    S.view = 'plan';
    S.step = 0; S.fileName = ''; S.rows = [];
    S.vehicle = null; S.driver = null; S.planned = false;
    S.dispatching = false; S.dispatched = false; S.dragIdx = null;
  }

  function fixRows(){
    S.rows = freshRows();
    S.rows[2].addr = 'Bungalow 14, Kataria Rd, Shivaji Park, Dadar West, Mumbai';
    S.rows[2].status = 'ok';
    S.rows = S.rows.filter(function(r){ return r.status !== 'dup'; });
  }
  function applySeed(){
    if (!SEED || SEED === 'login'){ return; }
    S.authed = true;
    if (SEED === 'home'){ S.view = 'home'; return; }
    if (SEED === 'current'){ S.view = 'current'; return; }
    if (SEED === 'history'){ S.view = 'history'; return; }
    if (SEED === 'drivers'){ S.view = 'drivers'; return; }
    if (SEED === 'settings'){ S.view = 'settings'; return; }
    S.view = 'plan';
    var loaded = function(){ S.fileName = 'bisleri_route_09jul.xlsx'; S.rows = freshRows(); };
    if (SEED === 'upload'){ /* authed, empty step 0 */ }
    if (SEED === 'uploaded'){ loaded(); }
    if (SEED === 'validate'){ loaded(); S.step = 1; }
    if (SEED === 'fixed'){ S.fileName = 'bisleri_route_09jul.xlsx'; fixRows(); S.step = 1; }
    if (SEED === 'vehicle'){ S.fileName = 'bisleri_route_09jul.xlsx'; fixRows(); S.step = 2; S.driver = 'MUM-0482'; }
    if (SEED === 'overcap'){ S.fileName = 'bisleri_route_09jul.xlsx'; fixRows(); S.step = 3; S.driver = 'MUM-0482'; S.vehicle = '3w'; }
    if (SEED === 'nodrivers'){ S.fileName = 'bisleri_route_09jul.xlsx'; fixRows(); S.step = 2; DRIVERS.forEach(function(d){ d.avail = false; }); }
    if (SEED === 'route' || SEED === 'dispatched'){ S.fileName = 'bisleri_route_09jul.xlsx'; fixRows(); S.step = 3; S.vehicle = '4w'; S.driver = 'MUM-0482'; }
  }

  function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function enc(t){ return encodeURIComponent(t); }
  function totalJars(){ return S.rows.reduce(function(a,r){ return a + (r.status!=='dup' ? r.jars : 0); }, 0); }
  function badCount(){ return S.rows.filter(function(r){ return r.status==='bad'; }).length; }
  function dupCount(){ return S.rows.filter(function(r){ return r.status==='dup'; }).length; }
  function okRows(){ return S.rows.filter(function(r){ return r.status==='ok'; }); }
  function vehicleById(id){ return VEHICLES.filter(function(v){return v.id===id;})[0]; }
  function driverById(id){ return DRIVERS.filter(function(d){return d.id===id;})[0]; }
  function initials(n){ return n.split(' ').map(function(w){return w[0];}).slice(0,2).join(''); }

  var I = {
    upload:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 15V4M7 8l5-5 5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none"><path d="m5 12.5 4.6 4.5L19 7.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warn:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 3 2.7 19.5h18.6L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 10v4.4M12 17.6h.01" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    cross:'<svg viewBox="0 0 24 24" fill="none"><path d="m7 7 10 10M17 7 7 17" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    truck:'<svg viewBox="0 0 24 24" fill="none"><path d="M2.5 6.5h11v10h-11zM13.5 9.5h4.2l3.3 3.4v3.6h-7.5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="7" cy="17.8" r="1.9" stroke="currentColor" stroke-width="1.6"/><circle cx="17.4" cy="17.8" r="1.9" stroke="currentColor" stroke-width="1.6"/></svg>',
    bike:'<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="17" r="3" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="17" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M6 17 10 8h5l3 5M9 17h7M10 8H8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    auto:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 15V8.5A2.5 2.5 0 0 1 6.5 6h7L17 10h1a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 15h15" stroke="currentColor" stroke-width="1.6"/><circle cx="7" cy="17.6" r="1.8" stroke="currentColor" stroke-width="1.6"/><circle cx="16.5" cy="17.6" r="1.8" stroke="currentColor" stroke-width="1.6"/></svg>',
    lcv:'<svg viewBox="0 0 24 24" fill="none"><path d="M1.5 7h13v9h-13zM14.5 10h4.2l3.3 3v3h-7.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="6" cy="18.2" r="1.9" stroke="currentColor" stroke-width="1.5"/><circle cx="17" cy="18.2" r="1.9" stroke="currentColor" stroke-width="1.5"/></svg>',
    drag:'<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="6" r="1.4" fill="currentColor"/><circle cx="9" cy="12" r="1.4" fill="currentColor"/><circle cx="9" cy="18" r="1.4" fill="currentColor"/><circle cx="15" cy="6" r="1.4" fill="currentColor"/><circle cx="15" cy="12" r="1.4" fill="currentColor"/><circle cx="15" cy="18" r="1.4" fill="currentColor"/></svg>',
    send:'<svg viewBox="0 0 24 24" fill="none"><path d="m3 11 18-7-7 18-2.5-7.5L3 11Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    box:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.7 3.5 6.9v10.2L12 21.3l8.5-4.2V6.9L12 2.7Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M3.5 6.9 12 11l8.5-4.1M12 11v10" stroke="currentColor" stroke-width="1.7"/></svg>',
    lock:'<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" stroke="currentColor" stroke-width="1.8"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    phone:'<svg viewBox="0 0 24 24" fill="none"><path d="M5 4h4l1.6 4.2-2 1.5a13 13 0 0 0 5.7 5.7l1.5-2L20 15v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 6.2 2 2 0 0 1 5 4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    idc:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="8.5" cy="11" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M13 10h5M13 13.5h3M5.5 15.5a3 3 0 0 1 6 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    route:'<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="18" r="2.4" stroke="currentColor" stroke-width="1.7"/><circle cx="18" cy="6" r="2.4" stroke="currentColor" stroke-width="1.7"/><path d="M8.3 17.4H14a3.5 3.5 0 0 0 0-7H9.5a3.5 3.5 0 0 1 0-7H16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    live:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 18.4a9 9 0 0 0 0-12.8M8.5 8.5a5 5 0 0 0 0 7M15.5 15.5a5 5 0 0 0 0-7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    people:'<svg viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-2.3-4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    logout:'<svg viewBox="0 0 24 24" fill="none"><path d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M10 12h10m0 0-3-3m3 3-3 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    home:'<svg viewBox="0 0 24 24" fill="none"><path d="m4 10.5 8-6.5 8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.5 20.5v-6h5v6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    gear:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.8 13.5 5h2.6l.9 2.4 2.3 1.2-.4 2.6 1.6 2-1.6 2 .4 2.6-2.3 1.2-.9 2.4h-2.6L12 21.2 10.5 19H7.9L7 16.6l-2.3-1.2.4-2.6-1.6-2 1.6-2L4.7 6.2 7 5h2.6L12 2.8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8.2" r="3.6" stroke="currentColor" stroke-width="1.8"/><path d="M4.8 19.4a7.6 7.6 0 0 1 14.4 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    eye:'<svg viewBox="0 0 24 24" fill="none"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2.7" stroke="currentColor" stroke-width="1.7"/></svg>',
    eyeOff:'<svg viewBox="0 0 24 24" fill="none"><path d="M4 4.5 20 19.5M9.5 6.3A9.7 9.7 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3 3.6M6 8a16 16 0 0 0-3.5 4S6 18.2 12 18.2c1 0 2-.2 2.8-.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
  };

  function stepbar(){
    var steps = ['Upload','Validate','Driver','Plan route'];
    return '<div class="flowsteps">' + steps.map(function(s,i){
      var cls = i===S.step ? 'is-on' : (i<S.step ? 'is-done' : '');
      return '<div class="fstep '+cls+'"><span class="n">'+(i<S.step?I.check:(i+1))+'</span><span class="t">'+s+'</span></div>' +
        (i<steps.length-1 ? '<div class="fstep__sep"></div>' : '');
    }).join('') + '</div>';
  }

  function mapEmbed(ll, z){ return 'https://maps.google.com/maps?q=' + enc(ll) + '&z=' + (z||14) + '&hl=en&output=embed'; }
  function warehouseLL(){ return WAREHOUSES[S.warehouse] || '19.1180,72.8630'; }
  function routeEmbed(){
    var ordered = S.rows.filter(function(r){ return r.status==='ok'; });
    if (!ordered.length) return mapEmbed(warehouseLL(), 12);
    return 'https://maps.google.com/maps?saddr=' + enc(warehouseLL()) + '&daddr=' +
      ordered.map(function(r){ return enc(r.ll); }).join('+to:') + '&hl=en&output=embed';
  }

  /* ---------------- screens ---------------- */
  function uploadScreen(){
    var hasFile = !!S.fileName;
    return '<div class="pagehead">' +
      '<h1>Upload today\u2019s delivery sheet</h1><p>Pick the dispatching warehouse and drop in the day\u2019s order sheet. We\u2019ll flag anything that needs a fix before you plan the route.</p></div>' +
      '<div class="uplgrid">' +
        '<div class="card"><div class="card__body">' +
          '<div class="field"><label>Dispatch warehouse</label><div class="select"><select id="whSel">' +
            ['Andheri East \u2014 Main Depot','Bhiwandi \u2014 Regional Hub','Thane \u2014 Satellite Store'].map(function(w){
              return '<option'+(S.warehouse===w?' selected':'')+'>'+w+'</option>'; }).join('') +
          '</select></div></div>' +
          '<div class="field"><label>Order sheet</label>' +
            '<div class="dropzone'+(hasFile?' is-filled':'')+'" data-act="pick">' +
              '<div class="ic">'+(hasFile?I.check:I.upload)+'</div>' +
              (hasFile ? '<b>'+esc(S.fileName)+'</b><span>7 rows found \u00b7 click to replace</span>'
                       : '<b>Drop the .xlsx here, or click to browse</b><span>Demo: loads a sample Bisleri route sheet</span>') +
              '<input id="fileInput" type="file" accept=".xlsx,.xls,.csv"/>' +
            '</div></div>' +
          '<div class="uplfoot"><button class="btn" id="continueUpload" '+(hasFile?'':'disabled')+'>Continue to validation</button></div>' +
        '</div></div>' +
        '<div class="mapcard"><div class="mcap"><b>'+esc(S.warehouse)+'</b><span>Dispatch point</span></div>' +
          '<iframe loading="lazy" src="'+mapEmbed(warehouseLL(),13)+'" title="Warehouse location"></iframe></div>' +
      '</div>';
  }

  function validateScreen(){
    var bad = badCount(), dup = dupCount(), ok = okRows().length;
    var blocked = bad>0 || dup>0;
    var rows = S.rows.map(function(r, i){
      var rowCls = r.status==='bad' ? 'is-bad' : (r.status==='dup' ? 'is-warn' : '');
      var pill = r.status==='ok' ? '<span class="pill pill--ok">'+I.check+'Ready</span>'
               : r.status==='dup' ? '<span class="pill pill--warn">'+I.warn+'Duplicate</span>'
               : '<span class="pill pill--bad">'+I.cross+'Missing address</span>';
      var addrCell = r.status==='bad'
        ? '<div class="rowaddr"><input class="rowinput is-err" data-fix="'+i+'" placeholder="Type the delivery address\u2026" value=""/>' +
          '<span class="err">'+I.warn+'Required to include this stop</span></div>'
        : esc(r.addr);
      return '<tr class="'+rowCls+'"><td class="rowid">'+esc(r.id)+(r.status==='dup'?' <span style="color:var(--red);font-weight:600">(dup)</span>':'')+'</td>' +
        '<td>'+addrCell+'</td><td>'+r.jars+'</td><td>'+pill+'</td>' +
        '<td>'+(r.status==='dup' ? '<button class="btn btn--ghost btn--sm" data-act="dropdup" data-i="'+i+'">Remove row</button>' : '') + '</td></tr>';
    }).join('');

    return '<div class="pagehead">' +
      '<h1>Validate the sheet</h1><p>'+S.rows.length+' rows from <b>'+esc(S.fileName)+'</b>. Fix flagged rows before continuing \u2014 nothing ships to a driver with a missing address.</p></div>' +
      '<div class="vsummary">' +
        '<div class="vstat ok"><div class="l">Ready</div><div class="v">'+ok+'</div></div>' +
        '<div class="vstat bad"><div class="l">Missing address</div><div class="v">'+bad+'</div></div>' +
        '<div class="vstat warn"><div class="l">Duplicate order</div><div class="v">'+dup+'</div></div>' +
        '<div class="vstat"><div class="l">Total jars</div><div class="v">'+totalJars()+'</div></div>' +
      '</div>' +
      (dup ? '<div class="dupbanner">'+I.warn+'<span><b>Duplicate order ID BSL-4471</b> appears twice on this sheet \u2014 remove the extra row before continuing so the same jars aren\u2019t counted twice.</span></div>' : '') +
      (bad ? '<div class="capbanner">'+I.warn+'<span><b>1 row is missing an address.</b> Type it in below \u2014 we can\u2019t route a driver to a stop with no address.</span></div>' : '') +
      '<div class="card"><div class="card__head"><h3>Stops on this sheet</h3><span class="sub">'+S.rows.length+' rows</span></div>' +
      '<div style="overflow-x:auto"><table class="table"><thead><tr><th>Order ID</th><th>Address</th><th>Jars</th><th>Status</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div></div>' +
      '<div style="height:80px"></div>' +
      '<div class="footbar">' +
        '<span class="status">'+(blocked ? I.warn+' Fix the flagged rows to continue' : I.check+' All rows ready')+'</span>' +
        '<button class="btn btn--ghost" data-act="backUpload">Back</button>' +
        '<button class="btn" id="continueValidate" '+(blocked?'disabled':'')+'>Continue to vehicle & driver</button>' +
      '</div>';
  }

  function vehicleScreen(){
    var jars = totalJars();
    var veh = S.vehicle ? vehicleById(S.vehicle) : null;
    var over = veh && jars > veh.cap;
    var drvs = DRIVERS.map(function(d){
      return '<div class="drv'+(S.driver===d.id?' is-sel':'')+(d.avail?'':' is-disabled')+'" data-act="'+(d.avail?'setdrv':'')+'" data-id="'+d.id+'" style="'+(d.avail?'':'opacity:.55;cursor:default;')+'">' +
        '<span class="av">'+initials(d.name)+'</span><span class="tx"><b>'+d.name+'</b><span>'+d.vehicle+' \u00b7 '+d.id+'</span></span>' +
        '<span class="stat '+(d.avail?'avail':'busy')+'">'+(d.avail?'Available':'On route')+'</span></div>';
    }).join('');
    var anyAvail = DRIVERS.some(function(d){return d.avail;});

    return '<div class="pagehead">' +
      '<h1>Assign the driver</h1><p>'+okRows().length+' stops \u00b7 <b>'+jars+' jars</b>. Pick who\u2019ll run today\u2019s route \u2014 you\u2019ll choose the vehicle when you plan it.</p></div>' +
      '<div class="card"><div class="card__head"><div><h3>Driver</h3><span class="sub">'+(anyAvail?DRIVERS.filter(function(d){return d.avail;}).length+' available now':'none available')+'</span></div>' +
        '<button class="btn btn--ghost btn--sm" data-act="adddrv">'+I.plus+'Add driver</button></div>' +
        '<div class="card__body">' + (anyAvail ? '<div class="drvlist">'+drvs+'</div>' : '<div class="capwarn">'+I.warn+'<span><b>Every driver is on a route right now.</b> Add a new driver, wait for one to finish, or dispatch this to whoever is free next.</span></div>') +
        '</div></div>' +
      '<div style="height:80px"></div>' +
      '<div class="footbar"><span class="status"></span>' +
        '<button class="btn btn--ghost" data-act="backValidate">Back</button>' +
        '<button class="btn" id="continueVehicle" '+(S.driver?'':'disabled')+'>Continue to route</button></div>';
  }

  function routeScreen(){
    var rows = okRows();
    var jars = totalJars();
    var drv = driverById(S.driver), veh = S.vehicle ? vehicleById(S.vehicle) : null;
    var vcards = VEHICLES.map(function(v){
      var icon = v.id==='2w'?I.bike : v.id==='3w'?I.auto : v.id==='lcv'?I.lcv : I.truck;
      return '<button class="vopt'+(S.vehicle===v.id?' is-sel':'')+'" data-act="setveh" data-id="'+v.id+'">' +
        '<span class="vic">'+icon+'</span><b>'+v.name+'</b><span class="vsub">'+v.sub+'</span>' +
        '<span class="vcap">'+v.route+'</span></button>';
    }).join('');
    var list = rows.map(function(r, i){
      return '<div class="rstop" draggable="true" data-idx="'+i+'"><span class="drag">'+I.drag+'</span>' +
        '<span class="seq">'+(i+1)+'</span><span class="tx"><b>'+esc(r.id)+'</b><span>'+esc(r.addr)+'</span></span>' +
        '<span style="font-size:12px;color:var(--ink-3);font-weight:600">'+r.jars+' jars</span></div>';
    }).join('');
    return '<div class="pagehead">' +
      '<h1>Plan the route</h1><p>Pick the vehicle so the stop order is built to suit how it moves, then drag to fine-tune. Dispatch lands straight in '+esc(drv.name)+'\u2019s app.</p></div>' +
      '<div class="assignbar"><span class="av">'+initials(drv.name)+'</span><span class="tx"><b>'+drv.name+'</b><span>'+(veh?veh.name+' \u00b7 ':'')+rows.length+' stops \u00b7 '+jars+' jars</span></span>' +
        '<button class="btn btn--ghost btn--sm" data-act="backVehicle">Change driver</button></div>' +
      '<div class="card" style="margin-bottom:16px"><div class="card__head"><div><h3>Vehicle type</h3><span class="sub">The route is built to suit how this vehicle moves</span></div></div>' +
        '<div class="card__body"><div class="vgrid">'+vcards+'</div></div></div>' +
      '<div class="rgrid">' +
        '<div class="card"><div class="card__head"><h3>Stop order</h3><span class="sub">'+(veh?'Built for '+veh.name+' \u00b7 drag to adjust':'Pick a vehicle first')+'</span></div>' +
          '<div class="card__body"><div class="rstoplist" id="stoplist">'+list+'</div></div></div>' +
        '<div class="mapcard"><div class="mcap"><b>Live route</b><span>'+(veh?'Updates as you reorder':'Depot \u2192 stops')+'</span></div>' +
          '<iframe id="routeFrame" loading="lazy" src="'+routeEmbed()+'" title="Planned route"></iframe></div>' +
      '</div>' +
      '<div style="height:80px"></div>' +
      '<div class="footbar"><span class="status">'+(!veh ? I.truck+' Pick a vehicle to build the route' : '')+'</span>' +
        '<button class="btn btn--ghost" data-act="backVehicle">Back</button>' +
        '<button class="btn" id="dispatchBtn"'+((S.dispatching||!veh)?' disabled':'')+'>'+(S.dispatching?'<span class="spin"></span>Dispatching\u2026':I.send+'Dispatch to driver')+'</button></div>';
  }

  function loginScreen(){
    return '<div class="adm-login">' +
        '<div class="adm-login__art"><div class="bg"></div><div class="grid"></div>' +
          '<div class="adm-login__brand"><div class="mk">e</div><div class="nm">Edgistify<span>Route Planner</span></div></div>' +
          '<svg class="adm-login__viz" viewBox="0 0 420 300" fill="none" aria-hidden="true">' +
            '<path d="M40 244 C 120 244 128 150 210 150 C 300 150 300 70 214 70 C 150 70 150 40 214 40 C 300 40 350 56 392 50" stroke="#1EC8B9" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="8 10" opacity="0.6"/>' +
            '<g transform="translate(40 244)"><circle r="16" fill="#0C564D"/><circle r="6" fill="#7FE8DC"/></g>' +
            '<g transform="translate(210 150)"><circle r="13" fill="#0C564D"/><circle r="5" fill="#5FE0D2"/></g>' +
            '<g transform="translate(392 50)"><path d="M0 -20 C 11 -7 17 2 17 10 A 17 17 0 1 1 -17 10 C -17 2 -11 -7 0 -20 Z" fill="#12B5A6"/></g>' +
          '</svg>' +
          '<div class="adm-login__tagline"><h2>Plan the morning<br/>in three steps.</h2>' +
            '<p>Upload the sheet, fix what\u2019s flagged, dispatch a route straight to the driver\u2019s phone.</p></div>' +
        '</div>' +
        '<div class="adm-login__panel"><div class="adm-login__form">' +
          '<div class="adm-login__eyebrow">Admin Console</div>' +
          '<h1>Sign in to the planner</h1>' +
          '<p class="adm-login__sub">Dispatchers only. Use your Edgistify operations login.</p>' +
          (S.loginErr ? '<div class="adm-login__err">'+I.warn+'<span>'+esc(S.loginErr)+'</span></div>' : '') +
          '<div class="afield'+(S.loginErr?' is-error':'')+'"><label>Work email</label>' +
            '<div class="abox">'+I.user+'<input id="a-uid" type="text" autocomplete="off" placeholder="you@edgistify.com" value="'+esc(S.uid)+'"/></div></div>' +
          '<div class="afield'+(S.loginErr?' is-error':'')+'"><label>Password</label>' +
            '<div class="abox">'+I.lock+'<input id="a-pw" type="'+(S.showPw?'text':'password')+'" placeholder="Your password" value="'+esc(S.pw)+'"/>' +
            '<button class="aeye" data-act="aeye" type="button">'+(S.showPw?I.eyeOff:I.eye)+'</button></div></div>' +
          '<button class="btn" id="adminLogin" style="width:100%;height:48px"'+(S.loggingIn?' disabled':'')+'>'+(S.loggingIn?'<span class="spin"></span>Signing in\u2026':'Sign in')+'</button>' +
        '</div></div>' +
      '</div>';
  }

  function sidebar(){
    var nav = [
      { v:'home', ic:I.home, label:'Home' },
      { v:'current', ic:I.live, label:'Live routes', badge:ROUTES.filter(function(r){return r.status==='running';}).length },
      { v:'history', ic:I.clock, label:'History' },
      { v:'drivers', ic:I.people, label:'Drivers' },
      { v:'settings', ic:I.gear, label:'Settings' }
    ].map(function(n){
      return '<button class="side__item'+(S.view===n.v?' is-on':'')+'" data-view="'+n.v+'">' +
        '<span class="side__ic">'+n.ic+'</span><span class="side__lbl">'+n.label+'</span>' +
        (n.badge?'<span class="side__badge">'+n.badge+'</span>':'') + '</button>';
    }).join('');
    return '<div class="side__brand"><span class="side__mark">e</span><span class="side__brandtx"><b>Edgistify</b><span>\u00d7 Bisleri</span></span></div>' +
      '<button class="side__new'+(S.view==='plan'?' is-active':'')+'" data-act="newroute">'+I.route+'<span>Plan a route</span></button>' +
      '<nav class="side__nav">'+nav+'</nav>' +
      '<div class="side__foot">' +
        '<div class="side__user"><span class="side__avatar">OP</span><span class="side__usertx"><b>Ops desk</b><span>ops@edgistify.com</span></span>' +
        '<button class="side__signout" data-act="logout" title="Sign out">'+I.logout+'</button></div>' +
      '</div>';
  }

  function render(){
    var sb = document.getElementById('sidebar');
    var crumb = document.getElementById('topCrumb');
    if (!S.authed){
      document.body.classList.add('is-auth');
      if (sb) sb.innerHTML = '';
      if (crumb) crumb.innerHTML = '';
      ROOT.innerHTML = loginScreen();
      wireLogin();
      return;
    }
    document.body.classList.remove('is-auth');
    if (sb){ sb.innerHTML = sidebar(); wireSidebar(sb); }
    var crumbs = { home:'Home', plan:'Plan a route', current:'Live routes', history:'History', drivers:'Drivers', settings:'Settings' };
    if (crumb) crumb.innerHTML = '<b>'+(crumbs[S.view]||'Home')+'</b>';

    var body;
    if (S.view==='home')         body = homeScreen();
    else if (S.view==='current') body = currentScreen();
    else if (S.view==='history') body = historyScreen();
    else if (S.view==='drivers') body = driversScreen();
    else if (S.view==='settings')body = settingsScreen();
    else body = stepbar() + (S.step===0 ? uploadScreen() : S.step===1 ? validateScreen() : S.step===2 ? vehicleScreen() : routeScreen());
    ROOT.innerHTML = body;
    wire();
  }

  function wireSidebar(sb){
    sb.querySelectorAll('[data-view]').forEach(function(b){
      b.addEventListener('click', function(){ S.view = b.getAttribute('data-view'); render(); });
    });
    var nw = sb.querySelector('[data-act="newroute"]'); if (nw) nw.addEventListener('click', function(){ newRun(); render(); });
    var lo = sb.querySelector('[data-act="logout"]'); if (lo) lo.addEventListener('click', function(){ reset(); S.authed=false; render(); });
  }

  function routeStatusPill(st){
    return st==='running'
      ? '<span class="rt-pill rt-pill--run">'+I.live+'On route</span>'
      : '<span class="rt-pill rt-pill--done">'+I.check+'Completed</span>';
  }
  function routeCard(r){
    return '<div class="rt-card"><div class="rt-card__top"><span class="rt-id">'+r.id+'</span>'+routeStatusPill(r.status)+'</div>' +
      '<div class="rt-card__drv"><span class="rt-av">'+initials(r.driver)+'</span><div><b>'+esc(r.driver)+'</b><span>'+r.vehicle+' \u00b7 '+r.when+'</span></div></div>' +
      '<div class="rt-card__stats"><div><b>'+r.done+'/'+r.stops+'</b><span>stops</span></div><div><b>'+r.jars+'</b><span>jars</span></div>' +
      '<div class="rt-prog"><i style="width:'+Math.round(r.done/r.stops*100)+'%"></i></div></div></div>';
  }
  function currentScreen(){
    var live = ROUTES.filter(function(r){return r.status==='running';});
    return '<div class="pagehead"><div class="eyebrow"><span class="dot"></span>Live</div>' +
      '<h1>Current routes</h1><p>'+live.length+' route'+(live.length===1?'':'s')+' out for delivery right now.</p></div>' +
      (live.length ? '<div class="rt-grid">'+live.map(routeCard).join('')+'</div>'
        : '<div class="rt-empty">'+I.live+'<b>No routes running</b><span>Dispatch a route to see it here.</span></div>');
  }
  function historyScreen(){
    return '<div class="pagehead"><div class="eyebrow"><span class="dot"></span>Log</div>' +
      '<h1>Route history</h1><p>Every route dispatched from this warehouse.</p></div>' +
      '<div class="rt-grid">'+ROUTES.map(routeCard).join('')+'</div>';
  }
  function driversScreen(){
    var rows = DRIVERS.map(function(d){
      return '<div class="drv drv--row"><span class="av">'+initials(d.name)+'</span>' +
        '<span class="tx"><b>'+esc(d.name)+'</b><span>'+esc(d.vehicle)+' \u00b7 '+d.id+'</span></span>' +
        '<span class="drv__contact">'+(d.phone?'<span>'+I.phone+esc(maskPhone(d.phone))+'</span>':'')+(d.email?'<span>'+I.mail+esc(d.email)+'</span>':'')+'</span>' +
        '<span class="stat '+(d.avail?'avail':'busy')+'">'+(d.avail?'Available':'On route')+'</span></div>';
    }).join('');
    return '<div class="pagehead"><div class="eyebrow"><span class="dot"></span>Team</div>' +
      '<h1>Drivers</h1><p>'+DRIVERS.length+' drivers \u00b7 '+DRIVERS.filter(function(d){return d.avail;}).length+' available now.</p></div>' +
      '<div class="card"><div class="card__head"><div><h3>All drivers</h3><span class="sub">Numbers are masked for privacy</span></div>' +
        '<button class="btn btn--ghost btn--sm" data-act="adddrv">'+I.plus+'Add driver</button></div>' +
        '<div class="card__body"><div class="drvlist drvlist--page">'+rows+'</div></div></div>';
  }

  function homeScreen(){
    var live = ROUTES.filter(function(r){return r.status==='running';});
    var availDrv = DRIVERS.filter(function(d){return d.avail;}).length;
    var stopsDone = live.reduce(function(a,r){return a+r.done;},0);
    var stopsAll = live.reduce(function(a,r){return a+r.stops;},0);
    return '<div class="pagehead"><div class="eyebrow"><span class="dot"></span>'+new Date().toLocaleDateString('en-IN',{weekday:'long', day:'numeric', month:'long'})+'</div>' +
      '<h1>Good morning, Ops desk</h1></div>' +
      '<div class="home-hero"><div class="home-hero__tx"><b>Plan today\u2019s route</b>' +
        '<span>Upload the delivery sheet, fix what\u2019s flagged, and dispatch \u2014 it lands on the driver\u2019s phone.</span></div>' +
        '<button class="btn" data-act="newroute">'+I.route+'Plan a route</button></div>' +
      '<div class="vsummary" style="grid-template-columns:repeat(3,1fr)">' +
        '<div class="vstat"><div class="l">Routes live</div><div class="v">'+live.length+'</div></div>' +
        '<div class="vstat ok"><div class="l">Stops delivered</div><div class="v">'+stopsDone+'<span class="vsub">/ '+stopsAll+'</span></div></div>' +
        '<div class="vstat"><div class="l">Drivers available</div><div class="v">'+availDrv+'</div></div>' +
      '</div>' +
      '<div class="card__plainhead"><h3>Out for delivery</h3><button class="linkbtn" data-view-link="current">View all</button></div>' +
      (live.length ? '<div class="rt-grid">'+live.map(routeCard).join('')+'</div>'
        : '<div class="rt-empty">'+I.live+'<b>Nothing on the road yet</b><span>Plan a route to get the day moving.</span></div>');
  }

  function settingsScreen(){
    return '<div class="pagehead"><div class="eyebrow"><span class="dot"></span>Workspace</div>' +
      '<h1>Settings</h1><p>Defaults for how routes are planned and dispatched.</p></div>' +
      '<div class="card" style="max-width:560px"><div class="card__body">' +
        '<div class="field"><label>Default warehouse</label><div class="select"><select id="setWh">' +
          Object.keys(WAREHOUSES).map(function(w){ return '<option'+(S.warehouse===w?' selected':'')+'>'+w+'</option>'; }).join('') +
        '</select></div></div>' +
        '<div class="field"><label>Due-back time</label><div class="select"><select id="setDue">' +
          ['4:30 PM','5:00 PM','5:30 PM','6:00 PM'].map(function(t,i){ return '<option'+(i===0?' selected':'')+'>'+t+'</option>'; }).join('') +
        '</select></div></div>' +
        '<label class="togglerow"><span><b>Alert on failed stops</b><span>Get notified the moment a driver marks a stop failed.</span></span>' +
          '<input type="checkbox" id="setAlert" checked /><i></i></label>' +
      '</div></div>';
  }

  function wireLogin(){
    var eye = document.querySelector('[data-act="aeye"]');
    if (eye) eye.addEventListener('click', function(){ keepLogin(); S.showPw = !S.showPw; render(); });
    function keepLogin(){ var u=document.getElementById('a-uid'), p=document.getElementById('a-pw'); if(u)S.uid=u.value; if(p)S.pw=p.value; }
    function submit(){
      keepLogin();
      if (S.loggingIn) return;
      S.loggingIn = true; S.loginErr = null; render();
      setTimeout(function(){ S.loggingIn = false; S.authed = true; S.step = 0; render(); toast('Signed in \u00b7 ready to plan'); }, 850);
    }
    var btn = document.getElementById('adminLogin'); if (btn) btn.addEventListener('click', submit);
    ['a-uid','a-pw'].forEach(function(id){
      var el = document.getElementById(id); if (!el) return;
      el.addEventListener('keydown', function(e){ if (e.key==='Enter') submit(); });
    });
  }

  var vehSeq = 0, drvSeq = 0;
  function formModal(opts){
    // opts: { title, sub, fields:[{key,label,icon,ph,type,note}], onSubmit(vals)->errObj|null }
    var vals = {};
    opts.fields.forEach(function(f){ vals[f.key] = ''; });
    var errs = {};
    var scrim = document.createElement('div');
    scrim.className = 'scrim';
    function draw(){
      scrim.innerHTML = '<div class="modal modal--form">' +
        '<div class="modal__formhead"><h3>'+opts.title+'</h3><p>'+opts.sub+'</p></div>' +
        '<div class="modal__fields">' +
          opts.fields.map(function(f){
            return '<div class="afield'+(errs[f.key]?' is-error':'')+'"><label>'+f.label+(f.opt?' <span class="opt">optional</span>':'')+'</label>' +
              '<div class="abox">'+(f.icon||'')+'<input data-k="'+f.key+'" type="'+(f.type||'text')+'" placeholder="'+f.ph+'" value="'+esc(vals[f.key])+'"/></div>' +
              (errs[f.key]?'<div class="afield__err">'+I.warn+errs[f.key]+'</div>':(f.note?'<div class="afield__note">'+f.note+'</div>':'')) + '</div>';
          }).join('') +
        '</div>' +
        '<div class="foot"><button class="btn btn--ghost" data-x>Cancel</button><button class="btn" data-ok>'+opts.cta+'</button></div>' +
      '</div>';
      scrim.querySelectorAll('input').forEach(function(inp){
        inp.addEventListener('input', function(){ vals[inp.getAttribute('data-k')] = inp.value; if(errs[inp.getAttribute('data-k')]){ errs[inp.getAttribute('data-k')]=null; inp.closest('.afield').classList.remove('is-error'); } });
        inp.addEventListener('keydown', function(e){ if(e.key==='Enter') submit(); });
      });
      scrim.querySelector('[data-x]').addEventListener('click', function(){ scrim.remove(); });
      scrim.querySelector('[data-ok]').addEventListener('click', submit);
    }
    function submit(){
      var e = opts.onSubmit(vals);
      if (e){ errs = e; draw(); return; }
      scrim.remove();
    }
    scrim.addEventListener('click', function(ev){ if(ev.target===scrim) scrim.remove(); });
    draw();
    document.body.appendChild(scrim);
    var first = scrim.querySelector('input'); if(first) first.focus();
  }

  function openVehicleForm_removed(){
    formModal({
      title:'Add a vehicle', sub:'Register a vehicle so it can carry a route.', cta:'Add vehicle',
      fields:[
        { key:'name', label:'Vehicle name', icon:I.truck, ph:'e.g. Tempo 14ft' },
        { key:'sub', label:'Description', icon:I.idc, ph:'e.g. 407 flatbed', opt:true },
        { key:'cap', label:'Capacity (20L jars)', icon:I.box, ph:'e.g. 80', type:'number', note:'Whole number of jars it can hold.' }
      ],
      onSubmit:function(v){
        var e = {};
        if (!v.name.trim()) e.name = 'Give the vehicle a name.';
        else if (VEHICLES.some(function(x){ return x.name.toLowerCase()===v.name.trim().toLowerCase(); })) e.name = 'A vehicle with this name already exists.';
        var cap = parseInt(v.cap,10);
        if (!v.cap.trim()) e.cap = 'Enter the jar capacity.';
        else if (isNaN(cap) || cap<=0) e.cap = 'Capacity must be a number above zero.';
        else if (cap>1000) e.cap = 'That looks too high — check the number.';
        if (Object.keys(e).length) return e;
        var id = 'veh-'+(++vehSeq);
        VEHICLES.push({ id:id, name:v.name.trim(), sub:v.sub.trim()||'Custom vehicle', cap:cap });
        S.vehicle = id;
        render();
        toast(v.name.trim()+' added · '+cap+' jars');
        return null;
      }
    });
  }

  function openDriverForm(){
    formModal({
      title:'Add a driver', sub:'Add a driver so you can assign today\u2019s route to them.', cta:'Add driver',
      fields:[
        { key:'name', label:'Full name', icon:I.idc, ph:'e.g. Amit Verma' },
        { key:'phone', label:'Phone number', icon:I.phone, ph:'e.g. 98XXXXXX10', type:'tel' },
        { key:'email', label:'Email', icon:I.mail, ph:'name@example.com', type:'email', opt:true },
        { key:'vehicle', label:'Assigned vehicle', icon:I.truck, ph:'e.g. Tata Ace · AC-9931', opt:true }
      ],
      onSubmit:function(v){
        var e = {};
        if (!v.name.trim()) e.name = 'Enter the driver\u2019s name.';
        var digits = (v.phone.match(/\d/g)||[]).length;
        if (!v.phone.trim()) e.phone = 'Phone number is required.';
        else if (digits<10) e.phone = 'Enter a valid phone number (at least 10 digits).';
        else if (DRIVERS.some(function(d){ return (d.phone||'').replace(/\D/g,'') === v.phone.replace(/\D/g,''); })) e.phone = 'A driver with this number already exists.';
        if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'That email doesn\u2019t look right.';
        if (Object.keys(e).length) return e;
        var id = 'MUM-'+(9000+(++drvSeq));
        DRIVERS.push({ id:id, name:v.name.trim(), phone:v.phone.trim(), email:v.email.trim(),
          vehicle:v.vehicle.trim()||'Unassigned', avail:true });
        S.driver = id;
        render();
        toast(v.name.trim()+' added · available now');
        return null;
      }
    });
  }

  function toast(msg){
    var wrap = document.getElementById('toastwrap');
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = I.check + '<span class="tx">'+msg+'</span>';
    wrap.appendChild(el);
    setTimeout(function(){ el.classList.add('leaving'); setTimeout(function(){ el.remove(); }, 300); }, 3000);
  }

  function wire(){
    document.querySelectorAll('[data-act="newroute"]').forEach(function(b){
      if (b.closest('.sidebar')) return;
      b.addEventListener('click', function(){ newRun(); render(); });
    });
    document.querySelectorAll('[data-view-link]').forEach(function(b){
      b.addEventListener('click', function(){ S.view = b.getAttribute('data-view-link'); render(); });
    });
    var setWh = document.getElementById('setWh');
    if (setWh) setWh.addEventListener('change', function(){ S.warehouse = setWh.value; toast('Default warehouse updated'); });
    var setDue = document.getElementById('setDue');
    if (setDue) setDue.addEventListener('change', function(){ toast('Due-back time updated'); });
    var setAlert = document.getElementById('setAlert');
    if (setAlert) setAlert.addEventListener('change', function(){ toast(setAlert.checked?'Failed-stop alerts on':'Failed-stop alerts off'); });
    var pick = document.getElementById('fileInput');
    var dz = document.querySelector('[data-act="pick"]');
    if (dz) dz.addEventListener('click', function(){
      S.fileName = 'bisleri_route_09jul.xlsx'; S.rows = freshRows(); render(); toast('Sheet loaded \u2014 7 rows found');
    });
    var whSel = document.getElementById('whSel');
    if (whSel) whSel.addEventListener('change', function(){ S.warehouse = whSel.value; render(); });
    var cu = document.getElementById('continueUpload'); if (cu) cu.addEventListener('click', function(){ S.step=1; render(); });
    var cv = document.getElementById('continueValidate'); if (cv) cv.addEventListener('click', function(){ S.step=2; render(); });
    var back1 = document.querySelector('[data-act="backUpload"]'); if (back1) back1.addEventListener('click', function(){ S.step=0; render(); });
    var back2 = document.querySelector('[data-act="backValidate"]'); if (back2) back2.addEventListener('click', function(){ S.step=1; render(); });
    var back3 = document.querySelectorAll('[data-act="backVehicle"]'); back3.forEach(function(b){ b.addEventListener('click', function(){ S.step=2; render(); }); });

    document.querySelectorAll('[data-fix]').forEach(function(inp){
      inp.addEventListener('input', function(){ S.rows[+inp.getAttribute('data-fix')].addr = inp.value; });
      inp.addEventListener('blur', function(){
        var idx = +inp.getAttribute('data-fix');
        if (inp.value.trim().length > 4){ S.rows[idx].status='ok'; S.rows[idx].addr = inp.value.trim(); render(); }
      });
      inp.addEventListener('keydown', function(e){ if (e.key==='Enter') inp.blur(); });
    });
    document.querySelectorAll('[data-act="dropdup"]').forEach(function(b){
      b.addEventListener('click', function(){ S.rows.splice(+b.getAttribute('data-i'),1); render(); toast('Duplicate row removed'); });
    });

    document.querySelectorAll('[data-act="setveh"]').forEach(function(b){
      b.addEventListener('click', function(){ S.vehicle = b.getAttribute('data-id'); render(); });
    });
    var addD = document.querySelector('[data-act="adddrv"]'); if (addD) addD.addEventListener('click', openDriverForm);
    document.querySelectorAll('[data-act="setdrv"]').forEach(function(b){
      b.addEventListener('click', function(){ S.driver = b.getAttribute('data-id'); render(); });
    });
    var cveh = document.getElementById('continueVehicle'); if (cveh) cveh.addEventListener('click', function(){ S.step=3; render(); });

    /* drag reorder */
    var list = document.getElementById('stoplist');
    if (list){
      var rows = okRows();
      list.querySelectorAll('.rstop').forEach(function(el){
        el.addEventListener('dragstart', function(){ S.dragIdx = +el.getAttribute('data-idx'); el.classList.add('is-drag'); });
        el.addEventListener('dragend', function(){ el.classList.remove('is-drag'); list.querySelectorAll('.rstop').forEach(function(x){x.classList.remove('is-over');}); });
        el.addEventListener('dragover', function(e){ e.preventDefault(); el.classList.add('is-over'); });
        el.addEventListener('dragleave', function(){ el.classList.remove('is-over'); });
        el.addEventListener('drop', function(e){
          e.preventDefault();
          var to = +el.getAttribute('data-idx');
          var from = S.dragIdx;
          if (from===null || from===to) return;
          var okIdx = [];
          S.rows.forEach(function(r,i){ if (r.status==='ok') okIdx.push(i); });
          var moved = okIdx[from];
          okIdx.splice(from,1); okIdx.splice(to,0,moved);
          var newOk = okIdx.map(function(i){ return S.rows[i]; });
          var k=0;
          S.rows = S.rows.map(function(r){ return r.status==='ok' ? newOk[k++] : r; });
          render();
        });
      });
    }
    var dispatch = document.getElementById('dispatchBtn');
    if (dispatch) dispatch.addEventListener('click', function(){
      if (S.dispatching) return;
      S.dispatching = true; render();
      setTimeout(function(){
        S.dispatching=false; S.dispatched=true;
        var veh = vehicleById(S.vehicle), drv = driverById(S.driver);
        ROUTES.unshift({ id:'RT-0'+(715+ROUTES.length), driver:drv.name, vehicle:veh.name,
          stops:okRows().length, jars:totalJars(), when:'Today \u00b7 just now', status:'running', done:0 });
        render(); showDispatchModal();
      }, 1100);
    });
  }

  function showDispatchModal(){
    var scrim = document.createElement('div');
    scrim.className = 'scrim';
    var drv = driverById(S.driver);
    scrim.innerHTML = '<div class="modal"><div class="seal">'+I.check+'</div>' +
      '<h3>Route dispatched</h3><p>'+okRows().length+' stops \u00b7 '+totalJars()+' jars sent to <b>'+drv.name+'</b>\u2019s phone. It\u2019ll appear at the top of their route the moment they open the app.</p>' +
      '<div class="foot"><button class="btn btn--ghost" data-act="seeCurrent">View current routes</button><button class="btn" data-act="planAnother">Plan another route</button></div></div>';
    document.body.appendChild(scrim);
    var sc = scrim.querySelector('[data-act="seeCurrent"]');
    if (sc) sc.addEventListener('click', function(){ scrim.remove(); newRun(); S.view='current'; render(); });
    scrim.querySelector('[data-act="planAnother"]').addEventListener('click', function(){ scrim.remove(); newRun(); render(); });
  }

  reset();
  render();
  if (SEED === 'dispatched') showDispatchModal();
})();


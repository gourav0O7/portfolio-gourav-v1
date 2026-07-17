
/* ============================================================
   BULK OTP VERIFICATION — v2 redesign (delivery-partner app)
   The partner arrives at a stop, sees the customer + the COD
   they must collect, and verifies every parcel for that stop
   with a SINGLE OTP. All parcels are pre-selected (the common
   case = hand over everything); deselect to do a partial drop.
   Per-parcel status + partial delivery preserved.
   Seed/static API (?seed=…&static=1) freezes frames for the
   case-study filmstrip.
   ============================================================ */
(function () {
  'use strict';

  var I = {
    back:    '<svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x:       '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    help:    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M9.6 9.2a2.4 2.4 0 014.4 1.3c0 1.6-2 1.8-2 3.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17" r="1.1" fill="currentColor"/></svg>',
    phone:   '<svg viewBox="0 0 24 24" fill="none"><path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 005.5 5.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16 16 0 014.5 6.2 2 2 0 016.5 4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    cash:    '<svg viewBox="0 0 24 24" fill="none"><rect x="2.5" y="6" width="19" height="12" rx="2" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.7"/></svg>',
    wifi:    '<svg viewBox="0 0 18 14" fill="currentColor"><path d="M9 0c3.38 0 6.49 1.12 9 3.02L9 14 0 3.01C2.5 1.12 5.62 0 9 0z"/></svg>',
    cell:    '<svg viewBox="0 0 14 14" fill="currentColor"><path d="M0 14h14V0L0 14z"/></svg>',
    batt:    '<svg viewBox="0 0 9 14" fill="currentColor"><path d="M6 .88V0H3v.88H0V14h9V.88H6z"/></svg>',
    shield:  '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.5l8 3v6c0 5.2-3.6 8.2-7.4 9.8a1.5 1.5 0 01-1.2 0C7.6 19.7 4 16.7 4 11.5v-6l8-3z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.8 12l2.2 2.2 4.2-4.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check:   '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    tick:    '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warn:    '<svg viewBox="0 0 16 16" fill="none"><path d="M8 5.5v3.2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="8" cy="11.4" r="1" fill="currentColor"/><path d="M8 1.8l6.4 11.1a1 1 0 01-.87 1.5H2.47a1 1 0 01-.87-1.5L8 1.8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    err:     '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.4" stroke="currentColor" stroke-width="1.6"/><path d="M8 4.8v3.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="8" cy="11" r=".9" fill="currentColor"/></svg>',
    arrow:   '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    wifiOff: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M9.3 9.6A6.7 6.7 0 005 11.6M16.8 11.4a9.5 9.5 0 00-3.1-1.9M2.5 7.9A14 14 0 016 5.8M21.5 7.9a14 14 0 00-7.9-3.6 14 14 0 00-2.3-.05M8.4 15a4 4 0 015 .3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="18.4" r="1.1" fill="currentColor"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 5v5h5M20 19v-5h-5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4 9A7.5 7.5 0 006.3 6.3L4 10M4.6 15a7.5 7.5 0 0013.1 2.7L20 14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock:    '<svg viewBox="0 0 24 24" fill="none"><rect x="4.5" y="10.5" width="15" height="10" rx="2.2" stroke="currentColor" stroke-width="1.8"/><path d="M8 10.5V8a4 4 0 018 0v2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="15.4" r="1.3" fill="currentColor"/></svg>',
    clock:   '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.4" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.6V12l3 1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    box:     '<svg viewBox="0 0 48 48" fill="none"><path d="M24 5l16 8v22l-16 8-16-8V13l16-8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 13l16 8 16-8M24 21v22" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    box2:    '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.6l8.4 4.2v10.4L12 21.4 3.6 17.2V6.8L12 2.6z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M3.8 7l8.2 4.2L20.2 7M12 11.2V21" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    pin:     '<svg viewBox="0 0 16 16" fill="none"><path d="M8 1.6c2.5 0 4.5 2 4.5 4.5 0 3-4.5 8.3-4.5 8.3S3.5 9.1 3.5 6.1C3.5 3.6 5.5 1.6 8 1.6z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="8" cy="6.1" r="1.6" stroke="currentColor" stroke-width="1.4"/></svg>',
    bigshield:'<svg viewBox="0 0 92 92" fill="none"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E80FF"/><stop offset="1" stop-color="#3E50D6"/></linearGradient></defs><path d="M46 6 80 17v25c0 24.8-19 36.4-30.6 41.2a4 4 0 01-2.8 0C34 78.4 12 66.8 12 42V17L46 6Z" fill="url(#sg)"/><path d="M33 46l9 9 18-20" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  var PARAMS = new URLSearchParams(location.search);
  var SEED = PARAMS.get('seed') || '';
  var STATIC = PARAMS.get('static') === '1';
  var EMBED = PARAMS.get('embed') === '1';
  if (EMBED) document.documentElement.classList.add('is-embed');
  var BARE = PARAMS.get('bare') === '1';
  if (BARE) document.documentElement.classList.add('is-bare');
  var FILL = PARAMS.get('fill') === '1';
  if (FILL) document.documentElement.classList.add('is-static', 'is-fill');

  var ROOT = document.getElementById('app');

  var CUSTOMER = { name:'Gourav Sharma', initials:'GS', addr:'Flat 402, Al Olaya, Riyadh', phoneMask:'+966 ••• •4324' };

  // ---- parcel model (all pre-selected by default = hand over everything) ----
  function freshPkgs(){
    return [
      { awb:'ON488705168', size:'Medium box · 1.2 kg', verified:false, selected:true },
      { awb:'ON488705169', size:'Small parcel · 0.4 kg', verified:false, selected:true },
      { awb:'ON488705170', size:'Medium box · 2.0 kg', verified:false, selected:true }
    ];
  }
  var pkgs = freshPkgs();
  var net = 'online';      // online | slow | offline   (live network simulator)
  var booting = false;     // true = slow-connection skeleton on load
  var sheet = null;        // null | 'otp' | 'success'
  var otpVal = ['','','',''];
  var otpError = '';
  var otpStatus = 'idle';  // idle | sending | sendfail | verifying | locked | expired
  var attempts = 3;        // remaining OTP attempts before lockout
  var lockLeft = 0;        // lockout countdown (s)
  var resendLeft = 30;
  var lastVerifiedCount = 0;
  var lastVerifiedAmt = 0;
  var resendTimer = null, lockTimer = null, expiryTimer = null, sendTimer = null;

  // ---- seed presets (freeze any screen for the case study) ----
  function applySeed(){
    switch (SEED){
      case 'select':    pkgs[2].selected=false; break;
      case 'empty':     pkgs=[]; break;
      case 'offline':   net='offline'; break;
      case 'slow':      net='slow'; booting=true; break;
      case 'otp':       sheet='otp'; otpStatus='idle'; break;
      case 'sending':   sheet='otp'; otpStatus='sending'; net='slow'; break;
      case 'sendfail':  sheet='otp'; otpStatus='sendfail'; net='offline'; break;
      case 'typed':     sheet='otp'; otpStatus='idle'; otpVal=['4','8','1','9']; break;
      case 'verifying': sheet='otp'; otpStatus='verifying'; otpVal=['4','8','1','9']; break;
      case 'error':     sheet='otp'; otpStatus='idle'; otpVal=['4','8','1','2']; attempts=2; otpError='Wrong OTP'; break;
      case 'locked':    sheet='otp'; otpStatus='locked'; attempts=0; lockLeft=28; break;
      case 'expired':   sheet='otp'; otpStatus='expired'; break;
      case 'verified':  pkgs[0].verified=true; pkgs[0].selected=false; pkgs[1].verified=true; pkgs[1].selected=false; break;
      case 'done':      pkgs.forEach(function(p){ p.verified=true; p.selected=false; }); break;
      case 'success':   pkgs[0].verified=true; pkgs[1].verified=true; pkgs[2].verified=true; lastVerifiedCount=3; sheet='success'; break;
      case 'longname':  CUSTOMER={ name:'Abdulrahman Al-Muhaisen', initials:'AM', addr:'Villa 27B, King Abdullah Rd, Al Yasmin District, near Granada Mall, Riyadh 13322', phoneMask:'+966 ••• •4324' }; break;
    }
  }

  // ---- helpers ----
  function verifiedCount(){ return pkgs.filter(function(p){return p.verified;}).length; }
  function selected(){ return pkgs.filter(function(p){return p.selected && !p.verified;}); }
  function selectableCount(){ return pkgs.filter(function(p){return !p.verified;}).length; }
  function codTotal(list){ return list.reduce(function(s,p){return s+p.amt;},0); }
  function sar(n){ return n.toLocaleString('en-US'); }

  function showToast(msg){
    var t = document.createElement('div'); t.className='toast';
    t.innerHTML = I.tick + '<span>'+msg+'</span>';
    ROOT.querySelector('.screen').appendChild(t);
    setTimeout(function(){ t.remove(); }, 2200);
  }

  // ---- render ----
  function render(){
    var vc = verifiedCount();
    var selCount = selected().length;
    var inner;
    if (booting){
      inner = appbar() + summary() + skeleton();
    } else if (pkgs.length===0){
      inner = appbar() + emptyState();
    } else {
      inner = appbar() + banner() + summary() + track(vc, selCount) + body(vc, selCount) + actionbar(vc, selCount);
    }
    ROOT.innerHTML = '<div class="screen">' + statusbar() + inner + overlay() + '</div>';
    wire();
  }

  function statusbar(){
    var n = net==='offline'
      ? '<span class="sb-net sb-net--off">'+I.wifiOff+'</span>'
      : (net==='slow'
          ? '<span class="sb-net sb-net--slow">'+I.wifi+'<i></i></span>'
          : I.wifi+I.cell);
    return '<div class="statusbar"><span class="t">9:41</span>'+n+I.batt+'</div>';
  }
  function banner(){
    if (net==='offline'){
      return '<div class="netbanner netbanner--off">'+I.wifiOff+
        '<div class="netbanner__t"><b>You\u2019re offline</b><span>Verification needs a connection.</span></div>'+
        '<button class="netbanner__btn" data-act="retrynet">'+I.refresh+'Retry</button></div>';
    }
    if (net==='slow'){
      return '<div class="netbanner netbanner--slow">'+I.wifi+
        '<div class="netbanner__t"><b>Slow connection</b><span>Sending and verifying may take longer.</span></div></div>';
    }
    return '';
  }
  function skeleton(){
    var row = '<div class="skel-card"><span class="skel-check"></span>'+
      '<span class="skel-lines"><span class="skel skel--xs"></span><span class="skel skel--m"></span><span class="skel skel--s"></span></span>'+
      '<span class="skel-box"></span></div>';
    return '<div class="track track--skel"><span class="skel skel--bar"></span></div>'+
      '<div class="body"><div class="skel-note">'+I.refresh+'Loading parcels for this stop…</div>'+row+row+row+'</div>';
  }
  function emptyState(){
    return '<div class="body body--empty"><div class="empty">'+
      '<div class="empty__ico">'+I.box+'</div>'+
      '<div class="empty__t">No parcels for this stop</div>'+
      '<div class="empty__s">Everything assigned to '+CUSTOMER.name.split(' ')[0]+' has been handled. Head to your next stop on the route.</div>'+
      '<button class="btn btn--ghost" data-act="close">Back to route</button></div></div>';
  }
  function appbar(){
    return '<div class="appbar"><div class="ico" data-act="close">'+I.back+'</div>'+
      '<div class="title">Verify &amp; Deliver</div>'+
      '<div class="ico" data-act="help">'+I.help+'</div></div>';
  }
  function summary(){
    var n = pkgs.length;
    return '<div class="summary">'+
      '<div class="cust"><div class="cust__ava">'+CUSTOMER.initials+'</div>'+
        '<div class="cust__info"><div class="cust__lbl">Delivering to</div>'+
          '<div class="cust__name">'+CUSTOMER.name+'</div>'+
          '<div class="cust__addr">'+I.pin+'<span>'+CUSTOMER.addr+'</span></div></div>'+
        '<div class="cust__call" data-act="call">'+I.phone+'</div></div>'+
    '</div>';
  }
  function track(vc, selCount){
    var canSelect = selectableCount();
    var pct = Math.round((vc/pkgs.length)*100);
    var done = vc===pkgs.length;
    var allSel = canSelect>0 && selCount===canSelect;
    var lead, rightSlot;
    if (done){
      lead = '<span class="track__lead"><b>All verified</b></span>';
      rightSlot = '<span class="track__done">'+I.tick+' Ready to hand over</span>';
    } else if (vc>0){
      lead = '<span class="track__lead"><b>Partly verified</b> · <span class="acc">rest selected</span></span>';
      rightSlot = selToggle(allSel);
    } else {
      lead = '<span class="track__lead"><b>Ready to verify</b> · one OTP for all</span>';
      rightSlot = selToggle(allSel);
    }
    // segmented progress — one segment per parcel: verified=green, selected=indigo, idle=track
    var segs = pkgs.map(function(p){
      var cls = p.verified ? 'is-done' : (p.selected ? 'is-sel' : '');
      return '<span class="seg '+cls+'"></span>';
    }).join('');
    return '<div class="track"><div class="track__row">'+lead+rightSlot+'</div>'+
      '<div class="segbar">'+segs+'</div></div>';
  }
  function selToggle(allSel){
    return '<span class="selall '+(allSel?'on':'')+'" data-act="selall"><span class="box">'+I.check+'</span>'+
      (allSel?'Deselect all':'Select all')+'</span>';
  }
  function body(vc, selCount){
    var canSelect = selectableCount();
    var cards = pkgs.map(card).join('');
    var foot = (canSelect===0)
      ? '<div class="allset">'+I.shield+'<span>Every parcel for this stop is verified. Hand them over to '+CUSTOMER.name.split(' ')[0]+'.</span></div>'
      : '';
    return '<div class="body">'+cards+foot+'</div>';
  }
  function card(p, i){
    if (p.verified){
      return '<div class="card is-verified"><div class="card__top">'+cardInner(p)+'</div>'+
        '<div class="card__verified">'+I.tick+' OTP verified</div></div>';
    }
    return '<div class="card '+(p.selected?'is-selected':'')+'" data-act="toggle" data-i="'+i+'">'+
      '<div class="card__top">'+cardInner(p)+'</div></div>';
  }
  function cardInner(p){
    return '<div class="card__check">'+I.check+'</div>'+
      '<div class="card__info"><div class="card__awblbl">AWB number</div>'+
        '<div class="card__awb">'+p.awb+'</div>'+
        '<div class="card__meta"><span class="card__amt">'+p.size+'</span></div></div>'+
      '<div class="card__box"><img src="assets/otp-box.svg" alt=""/></div>';
  }

  function actionbar(vc, selCount){
    if (selCount>0 && vc<pkgs.length){
      if (net==='offline'){
        return '<div class="actionbar"><button class="btn btn--primary" disabled>'+I.wifiOff+'Verify — needs connection</button>'+
          '<div class="actionbar__hint">'+I.err+'Reconnect to send the OTP.</div></div>';
      }
      return '<div class="actionbar"><button class="btn btn--primary" data-act="openotp">'+I.shield+
        'Verify with one OTP</button></div>';
    }
    var disabled = vc===0;
    var label = disabled ? 'Select parcels to verify' : (vc<pkgs.length ? 'Hand over verified parcels' : 'Hand over parcels');
    return '<div class="actionbar"><button class="btn btn--primary" data-act="deliver" '+(disabled?'disabled':'')+'>'+
      (disabled?'':I.arrow)+label+'</button></div>';
  }

  // ---- overlay / sheets ----
  function overlay(){
    if (!sheet) return '<div class="overlay"></div>';
    if (sheet==='success') return '<div class="overlay is-open"><div class="scrim"></div><div class="sheet-wrap">'+successSheet()+'</div></div>';
    return '<div class="overlay is-open"><div class="scrim" data-act="closesheet"></div><div class="sheet-wrap">'+otpSheet()+'</div></div>';
  }
  function otpSheet(){
    var sel = selected();
    var who = CUSTOMER.name.split(' ')[0];
    var nlbl = 'Parcels for '+who;

    // --- whole-body status states ---
    if (otpStatus==='sending'){
      return sheetShell('Sending OTP', nlbl, I.shield,
        '<div class="otp-state"><div class="otp-state__spin"><span class="spinner spinner--lg"></span></div>'+
          '<div class="otp-state__t">Sending a code to '+CUSTOMER.phoneMask+'</div>'+
          '<div class="otp-state__s">'+(net==='slow'?'Slow connection, this may take a few seconds.':'This will only take a moment.')+'</div></div>'+
        '<div class="otp-actions"><button class="btn btn--ghost" data-act="closesheet">Cancel</button></div>');
    }
    if (otpStatus==='sendfail'){
      return sheetShell('Couldn\u2019t send OTP', nlbl, I.wifiOff,
        '<div class="otp-state otp-state--bad"><div class="otp-state__ico otp-state__ico--bad">'+I.wifiOff+'</div>'+
          '<div class="otp-state__t">No connection</div>'+
          '<div class="otp-state__s">We couldn\u2019t reach the network to send the code. Reconnect and try again, nothing has been delivered yet.</div></div>'+
        '<div class="otp-actions"><button class="btn btn--primary" data-act="retrysend">'+I.refresh+'Try again</button>'+
          '<button class="btn btn--ghost" data-act="closesheet">Cancel</button></div>', 'bad');
    }
    if (otpStatus==='locked'){
      return sheetShell('Verification locked', nlbl, I.lock,
        '<div class="otp-state otp-state--bad"><div class="otp-state__ico otp-state__ico--lock">'+I.lock+'</div>'+
          '<div class="otp-state__t">Too many incorrect codes</div>'+
          '<div class="otp-state__s">For the customer\u2019s security, verification is paused. Try again in <b class="lockt">00:'+('0'+lockLeft).slice(-2)+'</b>, or call them to confirm the code.</div></div>'+
        '<div class="otp-actions"><button class="btn btn--primary" data-act="call">'+I.phone+'Call '+who+'</button>'+
          '<button class="btn btn--ghost" data-act="closesheet">Cancel</button></div>', 'bad');
    }
    if (otpStatus==='expired'){
      return sheetShell('OTP expired', nlbl, I.clock,
        '<div class="otp-state"><div class="otp-state__ico otp-state__ico--warn">'+I.clock+'</div>'+
          '<div class="otp-state__t">This code is no longer valid</div>'+
          '<div class="otp-state__s">OTPs expire after a few minutes for security. Send '+who+' a fresh one to continue.</div></div>'+
        '<div class="otp-actions"><button class="btn btn--primary" data-act="resendnew">'+I.refresh+'Send new OTP</button>'+
          '<button class="btn btn--ghost" data-act="closesheet">Cancel</button></div>', 'warn');
    }

    // --- entry UI (idle | verifying | error) ---
    var verifying = otpStatus==='verifying';
    var chips = sel.map(function(p){ return '<span class="otp-pkgchip">'+I.box2+p.awb.slice(-4)+'</span>'; }).join('');
    var resendOn = resendLeft<=0;
    var cells = otpVal.map(function(v,i){
      return '<input class="otp-cell" inputmode="numeric" maxlength="1" placeholder=" " data-otp="'+i+'" value="'+v+'" '+(verifying?'disabled':'')+'/>';
    }).join('');
    var resendRow = otpError
      ? '<div class="otp-resend otp-resend--err"><span class="att">'+I.err+(attempts>0?(attempts+' attempt'+(attempts>1?'s':'')+' left'):'No attempts left')+'</span>'+
          '<span class="link '+(resendOn?'on':'')+'" data-act="resend">Resend OTP</span></div>'
      : '<div class="otp-resend"><span class="lead">Didn\u2019t get the code?</span>'+
          '<span class="sec"'+(resendOn?' style="display:none"':'')+'>Resend in 0:'+('0'+resendLeft).slice(-2)+'</span>'+
          '<span class="link '+(resendOn?'on':'')+'" data-act="resend">Resend OTP</span></div>';
    var bodyHtml =
      '<div class="otp-pkgs">'+chips+'</div>'+
      '<div class="warn">'+I.warn+'<span>Once verified, these parcels are marked delivered and can\u2019t be cancelled.</span></div>'+
      '<div class="otp-lead">'+I.phone+'<span>Code sent to <b>'+CUSTOMER.phoneMask+'</b></span></div>'+
      '<div class="otp-inputs '+(otpError?'is-error':'')+'">'+cells+'</div>'+
      (otpError?'<div class="otp-err">'+I.err+'<span>'+otpError+'</span></div>':'')+
      resendRow+
      '<div class="otp-actions"><button class="btn btn--primary" data-act="validate" '+(verifying?'disabled':'')+'>'+
        (verifying?'<span class="spinner"></span>Verifying…':'Verify &amp; mark delivered')+'</button>'+
        '<button class="btn btn--ghost" data-act="closesheet">Cancel</button></div>';
    return sheetShell('Enter delivery OTP', nlbl, I.shield, bodyHtml);
  }
  function sheetShell(title, sub, ico, bodyHtml, tone){
    return '<div class="sheet"><div class="sheet__grip"></div>'+
      '<div class="sheet__head"><div class="sheet__shield '+(tone?'sheet__shield--'+tone:'')+'">'+ico+'</div>'+
        '<div class="sheet__htext"><div class="sheet__title">'+title+'</div>'+
          '<div class="sheet__sub">'+sub+'</div></div>'+
        '<div class="sheet__x" data-act="closesheet">'+I.x+'</div></div>'+
      '<div class="sheet__body">'+bodyHtml+'</div></div>';
  }
  function successSheet(){
    var vc = verifiedCount();
    var allDone = vc===pkgs.length;
    var title = allDone ? 'All parcels verified' : 'Parcels verified';
    var msg = allDone
      ? '<b>Every parcel for '+CUSTOMER.name.split(' ')[0]+'</b> is verified. Hand them over to complete the delivery.'
      : '<b>The selected parcels are verified.</b> Hand them over now, or verify the rest to deliver everything together.';
    return '<div class="sheet sheet--success"><div class="sheet__grip"></div><div class="sheet__body">'+
      '<div class="success-shield">'+I.bigshield+'</div>'+
      '<div class="success-title">'+title+'</div>'+
      '<div class="success-msg">'+msg+'</div>'+
      '<button class="btn btn--primary" data-act="closesuccess" style="margin-top:6px">'+
        (allDone?'Okay, close':'Got it')+'</button>'+
      '</div></div>';
  }

  // ---- timers ----
  function clearAllTimers(){ [resendTimer, lockTimer, expiryTimer, sendTimer].forEach(function(t){ clearInterval(t); clearTimeout(t); }); resendTimer=lockTimer=expiryTimer=sendTimer=null; }
  function startResend(){
    clearInterval(resendTimer); resendLeft = 30;
    if (STATIC) return;
    resendTimer = setInterval(function(){
      resendLeft--;
      if (resendLeft<=0){ clearInterval(resendTimer); }
      var el = ROOT.querySelector('.otp-resend');
      if (el && !el.classList.contains('otp-resend--err')){
        var sec = el.querySelector('.sec');
        if (sec) sec.textContent = 'Resend in 0:'+('0'+Math.max(0,resendLeft)).slice(-2);
        if (resendLeft<=0){ if(sec) sec.style.display='none'; var lk=el.querySelector('.link'); if(lk) lk.classList.add('on'); }
      }
    }, 1000);
  }
  function startExpiry(){
    clearTimeout(expiryTimer);
    if (STATIC) return;
    expiryTimer = setTimeout(function(){
      if (sheet==='otp' && otpStatus==='idle' && !otpError){ otpStatus='expired'; render(); }
    }, 45000);
  }
  function startLock(){
    clearInterval(lockTimer); lockLeft = 30;
    if (STATIC) return;
    lockTimer = setInterval(function(){
      lockLeft--;
      var el = ROOT.querySelector('.lockt'); if (el) el.textContent = '00:'+('0'+Math.max(0,lockLeft)).slice(-2);
      if (lockLeft<=0){ clearInterval(lockTimer); otpStatus='idle'; attempts=3; otpVal=['','','','']; otpError=''; render(); startResend(); startExpiry(); }
    }, 1000);
  }

  // ---- OTP send flow (depends on simulated network) ----
  function beginSend(){
    otpVal=['','','','']; otpError=''; attempts=3;
    if (net==='offline'){ otpStatus='sendfail'; render(); return; }
    otpStatus='sending'; render();
    if (STATIC) return;
    var delay = net==='slow' ? 2600 : 800;
    sendTimer = setTimeout(function(){
      if (sheet!=='otp') return;
      otpStatus='idle'; render(); startResend(); startExpiry();
    }, delay);
  }

  // ---- events ----
  function wire(){
    ROOT.querySelectorAll('[data-act]').forEach(function(el){ el.addEventListener('click', onAct); });
    ROOT.querySelectorAll('.otp-cell').forEach(function(c){
      c.addEventListener('input', onOtpInput);
      c.addEventListener('keydown', onOtpKey);
      c.addEventListener('paste', onOtpPaste);
    });
    if (sheet==='otp' && !STATIC){
      var idx = otpVal.findIndex(function(v){return !v;});
      var first = ROOT.querySelector('.otp-cell[data-otp="'+(idx<0?0:idx)+'"]') || ROOT.querySelector('.otp-cell');
      if (first) setTimeout(function(){ first.focus(); }, 80);
    }
  }
  function onAct(e){
    var act = e.currentTarget.getAttribute('data-act');
    if (act==='toggle'){ var i=+e.currentTarget.getAttribute('data-i'); pkgs[i].selected=!pkgs[i].selected; render(); }
    else if (act==='selall'){ var canSel=pkgs.filter(function(p){return !p.verified;}); var all=canSel.every(function(p){return p.selected;}); canSel.forEach(function(p){p.selected=!all;}); render(); }
    else if (act==='openotp'){ if(selected().length){ sheet='otp'; beginSend(); } }
    else if (act==='retrysend'){ beginSend(); }
    else if (act==='resendnew'){ beginSend(); showToast('New OTP sent to '+CUSTOMER.phoneMask); }
    else if (act==='retrynet'){ net='online'; render(); showToast('Back online'); }
    else if (act==='closesheet'){ sheet=null; otpVal=['','','','']; otpError=''; otpStatus='idle'; clearAllTimers(); render(); }
    else if (act==='validate'){ validate(); }
    else if (act==='resend'){ if(resendLeft<=0){ beginSend(); showToast('New OTP sent to '+CUSTOMER.phoneMask); } }
    else if (act==='deliver'){ showToast('Handing over parcels…'); }
    else if (act==='closesuccess'){ sheet=null; render(); }
    else if (act==='call'){ showToast('Calling '+CUSTOMER.name+'…'); }
    else if (act==='help'){ showToast('OTP is sent to the customer\u2019s registered number.'); }
    else if (act==='close'){ /* app close — no-op in proto */ }
  }
  function validate(){
    if (net==='offline'){ otpError='No connection — reconnect to verify.'; otpStatus='idle'; render(); return; }
    var code = otpVal.join('');
    if (code.replace(/\D/g,'').length<4){ otpError='Enter the 4-digit OTP to continue.'; otpStatus='idle'; render(); return; }
    otpError=''; otpStatus='verifying'; clearTimeout(expiryTimer); render();
    if (STATIC) return;
    var delay = net==='slow' ? 1900 : 1100;
    setTimeout(function(){
      if (code==='4819'){
        var sel = selected();
        lastVerifiedCount = sel.length;
        sel.forEach(function(p){ p.verified=true; p.selected=false; });
        sheet='success'; otpStatus='idle'; clearAllTimers(); render();
      } else {
        attempts--;
        if (attempts<=0){ otpStatus='locked'; render(); startLock(); }
        else { otpStatus='idle'; otpVal=['','','','']; otpError='Wrong OTP'; render(); }
      }
    }, delay);
  }
  function onOtpInput(e){
    var i=+e.target.getAttribute('data-otp');
    var v=e.target.value.replace(/[^0-9]/g,'').slice(-1);
    otpVal[i]=v; e.target.value=v; otpError='';
    if (v && i<3){ var nx=ROOT.querySelector('.otp-cell[data-otp="'+(i+1)+'"]'); if(nx) nx.focus(); }
  }
  function onOtpKey(e){
    var i=+e.target.getAttribute('data-otp');
    if (e.key==='Backspace' && !otpVal[i] && i>0){ var pv=ROOT.querySelector('.otp-cell[data-otp="'+(i-1)+'"]'); if(pv) pv.focus(); }
    if (e.key==='Enter') validate();
  }
  function onOtpPaste(e){
    e.preventDefault();
    var d=(e.clipboardData||window.clipboardData).getData('text').replace(/[^0-9]/g,'').slice(0,4).split('');
    for(var i=0;i<4;i++) otpVal[i]=d[i]||'';
    otpError=''; render();
    var last=ROOT.querySelector('.otp-cell[data-otp="'+Math.min(d.length,3)+'"]'); if(last) last.focus();
  }

  // ---- boot ----
  applySeed();
  if (STATIC){ document.documentElement.classList.add('is-static'); }
  render();
  if (sheet==='otp' && otpStatus==='idle') startResend();

  // simulate the slow-connection load resolving into the list
  if (booting && !STATIC){
    setTimeout(function(){ booting=false; render(); }, 2400);
  }

  // ---- fit / scale ----
  function fit(){
    if (FILL){
      document.documentElement.style.setProperty('--scale', (window.innerWidth/390).toFixed(4));
      return;
    }
    // reserve room for the controls bar so the phone never sits under it
    var reserve = (STATIC || EMBED) ? 12 : 84;
    var s = Math.min(window.innerWidth/430, (window.innerHeight-reserve)/900, 1);
    document.documentElement.style.setProperty('--scale', s.toFixed(3));
  }
  window.addEventListener('resize', fit); fit();

  // ---- live controls (network simulator + reset) ----
  function syncNetUI(){
    document.querySelectorAll('#netsim [data-net]').forEach(function(b){
      b.classList.toggle('is-on', b.getAttribute('data-net')===net);
    });
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest ? e.target.closest('[data-net],#resetBtn') : null;
    if (!t) return;
    if (t.id==='resetBtn'){
      net='online'; booting=false; pkgs=freshPkgs(); sheet=null; otpVal=['','','','']; otpError=''; otpStatus='idle'; attempts=3;
      clearAllTimers(); syncNetUI(); render(); return;
    }
    var mode = t.getAttribute('data-net');
    if (mode && mode!==net){
      net=mode;
      if (sheet){ sheet=null; clearAllTimers(); otpStatus='idle'; }
      syncNetUI(); render();
    }
  });
  syncNetUI();

  // ---- parent-frame controls (modal sends network + reset via postMessage) ----
  window.addEventListener('message', function(e){
    var d = e.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === 'otp-net' && ['online','slow','offline'].indexOf(d.net) > -1){
      net = d.net;
      if (sheet){ sheet=null; clearAllTimers(); otpStatus='idle'; }
      booting = (d.net === 'slow');
      syncNetUI(); render();
      if (booting && !STATIC){ setTimeout(function(){ booting=false; render(); }, 2000); }
    } else if (d.type === 'otp-reset'){
      net='online'; booting=false; pkgs=freshPkgs(); sheet=null; otpVal=['','','','']; otpError=''; otpStatus='idle'; attempts=3;
      clearAllTimers(); syncNetUI(); render();
    }
  });
})();

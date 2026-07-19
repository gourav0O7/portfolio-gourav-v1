
/* ============================================================
   PROJECT SCREENS, EdgeOS Platform (Edgistify)
   EdgeOS predates the Figma export pipeline, so there are no flat
   PNG frames for it. Instead we present polished, native-style
   product screens built in the shared .mk mockup language (same
   one the hero uses), the B2B operator console and the B2C
   customer side, shown in browser-window cards.
   Sets window.PROJECT_SCREENS = { tag, driver, admin }.
   ============================================================ */
(function () {
  'use strict';
  if (window.PROJECT_KEY !== 'edgeos') return;

  var M = window.PROJECT_MOCKUP || {};
  var shell = window.__mkShell, IC = window.__mkIC || {}, stat = window.__mkStat;
  if (!shell) return; // mockups.js must load first

  /* ---- B2B · operator console (reuse the hero dashboard) ---- */
  var b2bDash = M['edgeos'];

  /* ---- B2B · order detail / fulfilment ---- */
  var timeline = [
    ['Order placed', 'Acme Retail · PO #4471', 'ok', '09:12'],
    ['Allocated', 'Mumbai DC-01 · 3 SKUs', 'ok', '09:14'],
    ['Picked &amp; packed', 'Wave 0312 · 2 cartons', 'ok', '10:48'],
    ['Out for delivery', 'Trip 0412-K · R. Mehta', 'info', '11:30'],
    ['Delivered', 'Awaiting PoD', 'mute', ', ']
  ];
  var tl = timeline.map(function (s, i) {
    var last = i === timeline.length - 1;
    return '<div style="display:flex;gap:14px;align-items:flex-start">' +
      '<div style="display:flex;flex-direction:column;align-items:center;flex:none">' +
        '<span style="width:13px;height:13px;border-radius:50%;border:2px solid ' + (s[2] === 'mute' ? '#cfd5e0' : 'var(--ac)') + ';background:' + (s[2] === 'mute' ? '#fff' : 'var(--ac)') + '"></span>' +
        (last ? '' : '<span style="width:2px;flex:1;min-height:26px;background:#e6e9ef"></span>') +
      '</div>' +
      '<div style="flex:1;padding-bottom:' + (last ? '0' : '16px') + '">' +
        '<div style="display:flex;justify-content:space-between;gap:10px"><span style="font-size:13px;font-weight:650">' + s[0] + '</span><span class="mk-soft">' + s[3] + '</span></div>' +
        '<div class="mk-soft" style="margin-top:2px">' + s[1] + '</div>' +
      '</div></div>';
  }).join('');
  var items = [['Aquafina 1L · 12-pack', '×40', '₹3,360'], ['Lays Classic · case', '×24', '₹1,440'], ['Pepsi 500ml · 24-pack', '×30', '₹2,100']]
    .map(function (r) { return '<tr><td class="strong">' + r[0] + '</td><td>' + r[1] + '</td><td class="strong" style="text-align:right">' + r[2] + '</td></tr>'; }).join('');
  var b2bOrder = shell({
    ac: '#5B5BF0', acd: '#4646d6', mark: 'E', brand: 'EdgeOS', bsub: 'Edgistify · Platform',
    nav: [{ h: 'Platform' }, { i: 'grid', label: 'Dashboard' }, { i: 'list', label: 'Orders', on: true }, { i: 'box', label: 'Inventory' }, { i: 'truck', label: 'Fulfilment' }, { h: 'Workspace' }, { i: 'layers', label: 'Integrations' }, { i: 'cog', label: 'Settings' }],
    title: 'Order #EO-7741', topsub: 'Acme Retail · B2B wholesale · ₹84,200', action: '',
    body:
      '<div class="mk-grid2">' +
        '<div class="mk-card"><div class="mk-ch-head"><div><h2>Fulfilment timeline</h2><div class="ch-sub">Live across warehouse + last-mile</div></div><span class="mk-tag info"><i></i>Out for delivery</span></div>' +
          '<div style="margin-top:6px">' + tl + '</div></div>' +
        '<div style="display:flex;flex-direction:column;gap:16px">' +
          '<div class="mk-card"><div class="mk-ch-head"><div><h2>Line items</h2><div class="ch-sub">3 SKUs · 94 units</div></div></div>' +
            '<table class="mk-tbl"><tbody>' + items + '</tbody></table>' +
            '<div style="display:flex;justify-content:space-between;border-top:1px solid #eef1f5;margin-top:6px;padding-top:13px;font-size:14px;font-weight:750"><span>Order total</span><span>₹84,200</span></div></div>' +
          '<div class="mk-card"><div class="mk-ch-head"><div><h2>Account</h2><div class="ch-sub">B2B · Net-30 terms</div></div></div>' +
            '<div style="display:flex;align-items:center;gap:12px"><span class="mk-pic" style="width:38px;height:38px;background:var(--ac);color:#fff">AR</span>' +
            '<div><div style="font-size:13px;font-weight:650">Acme Retail Pvt Ltd</div><div class="mk-soft">142 orders · ₹1.4Cr lifetime</div></div></div></div>' +
        '</div>' +
      '</div>'
  });

  /* ---- B2C · customer order tracking (storefront side) ---- */
  function b2cShell(inner) {
    return '<div class="mk" style="--ac:#5B5BF0;--acd:#4646d6;display:block;background:#f6f7fb">' +
      '<header style="height:60px;background:#fff;border-bottom:1px solid #e6e9ef;display:flex;align-items:center;gap:14px;padding:0 30px">' +
        '<span style="width:30px;height:30px;border-radius:8px;background:var(--ac);display:grid;place-items:center;color:#fff;font-weight:800;font-size:15px">E</span>' +
        '<b style="font-size:15px;letter-spacing:-0.01em">Edgistify</b>' +
        '<nav style="margin-left:28px;display:flex;gap:22px;font-size:12.5px;font-weight:550;color:#5a6378"><span>Shop</span><span style="color:var(--ac)">Track order</span><span>Support</span></nav>' +
        '<div style="margin-left:auto;display:flex;align-items:center;gap:16px;color:#5a6378">' + (IC.search || '') + '<span class="mk-pic" style="margin:0;background:#eef1f5">RM</span></div>' +
      '</header>' +
      '<div style="padding:34px 40px;display:flex;justify-content:center"><div style="width:760px;max-width:100%">' + inner + '</div></div>' +
    '</div>';
  }
  var steps = [['Confirmed', true], ['Packed', true], ['Shipped', true], ['Out for delivery', false], ['Delivered', false]];
  var progIdx = 3;
  var bar = steps.map(function (s, i) {
    var done = i < progIdx, cur = i === progIdx;
    return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:9px;position:relative">' +
      (i ? '<span style="position:absolute;top:11px;right:50%;width:100%;height:3px;background:' + (done || cur ? 'var(--ac)' : '#e1e5ee') + '"></span>' : '') +
      '<span style="position:relative;z-index:1;width:24px;height:24px;border-radius:50%;background:' + (done ? 'var(--ac)' : cur ? '#fff' : '#eef1f5') + ';border:2px solid ' + (done || cur ? 'var(--ac)' : '#e1e5ee') + ';display:grid;place-items:center;color:#fff;font-size:12px">' + (done ? '✓' : '') + '</span>' +
      '<span style="font-size:11px;font-weight:600;color:' + (done || cur ? '#1c2330' : '#9aa3b5') + ';text-align:center">' + s[0] + '</span></div>';
  }).join('');
  var b2cTrack = b2cShell(
    '<div style="font-size:12px;font-weight:600;letter-spacing:.04em;color:#8a93a6">ORDER #EO-7742</div>' +
    '<h2 style="font-size:24px;font-weight:760;letter-spacing:-0.02em;margin:6px 0 4px">Arriving today, by 6 PM</h2>' +
    '<div class="mk-soft" style="font-size:13px;margin-bottom:26px">3 items · Nova D2C · Shipped from Mumbai DC</div>' +
    '<div class="mk-card" style="padding:26px 24px"><div style="display:flex;align-items:flex-start;margin-bottom:8px">' + bar + '</div></div>' +
    '<div class="mk-card" style="margin-top:16px;display:flex;align-items:center;gap:16px">' +
      '<span style="width:46px;height:46px;border-radius:12px;background:var(--ac);display:grid;place-items:center;color:#fff">' + (IC.truck || '') + '</span>' +
      '<div style="flex:1"><div style="font-size:13.5px;font-weight:650">Out for delivery</div><div class="mk-soft">R. Mehta is 4 stops away · Trip 0412-K</div></div>' +
      '<span class="mk-tag info"><i></i>Live</span></div>' +
    '<div class="mk-card" style="margin-top:16px"><h2 style="font-size:13.5px;font-weight:700;margin:0 0 12px">In this delivery</h2>' +
      '<table class="mk-tbl"><tbody>' +
      [['Aquafina 1L · 12-pack', '×2'], ['Lays Classic · case', '×1'], ['Pepsi 500ml · 6-pack', '×1']].map(function (r) {
        return '<tr><td><span class="mk-pic">' + (IC.box || '') + '</span><span class="strong">' + r[0] + '</span></td><td class="mk-soft" style="text-align:right">' + r[1] + '</td></tr>';
      }).join('') + '</tbody></table></div>'
  );

  /* ---------- presentation: browser-window cards ---------- */
  var css = [
    '.es { --es-ac:#5B5BF0; }',
    '.es-capbar { font-family:var(--font-mono); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--text-faint); display:flex; justify-content:space-between; align-items:baseline; gap:18px; padding-bottom:14px; border-bottom:1px solid var(--line); margin-bottom:8px; flex-wrap:wrap; }',
    '.es-capbar b { color:var(--es-ac); font-weight:600; }',
    '.es-boards { display:flex; flex-direction:column; gap:clamp(48px,7vw,92px); }',
    '.es-board__head { display:flex; gap:16px; align-items:baseline; margin:26px 0 14px; }',
    '.es-board__n { font-family:var(--font-mono); font-size:12px; color:var(--es-ac); flex:none; padding-top:3px; }',
    '.es-board__h { font-size:clamp(22px,2.6vw,30px); font-weight:680; letter-spacing:-0.02em; color:var(--text); }',
    '.es-board__c { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--text-faint); padding-top:6px; }',
    '.es-board__lead { max-width:66ch; font-size:clamp(15px,1.4vw,17px); line-height:1.62; color:var(--text-dim,#aeb4c0); margin:0 0 28px; }',
    '.es-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(440px,1fr)); gap:clamp(20px,2.4vw,34px); align-items:start; }',
    '.es-card { display:flex; flex-direction:column; }',
    '.es-win { border:1px solid var(--line); border-radius:11px; overflow:hidden; background:#fff; box-shadow:0 18px 44px -30px rgba(0,0,0,0.5); transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease; }',
    '.es-card:hover .es-win { transform:translateY(-3px); box-shadow:0 30px 60px -32px rgba(0,0,0,0.55); border-color:var(--es-ac); }',
    '.es-win__bar { display:flex; align-items:center; gap:8px; padding:9px 12px; background:#f1f1f3; border-bottom:1px solid var(--line); }',
    '.es-win__dots { display:flex; gap:5px; flex:none; }',
    '.es-win__dots i { width:8px; height:8px; border-radius:50%; background:#d0d0d6; display:block; }',
    '.es-win__dots i:nth-child(1){ background:#ec6a5e; } .es-win__dots i:nth-child(2){ background:#f3bf4f; } .es-win__dots i:nth-child(3){ background:#61c454; }',
    '.es-win__url { margin:0 auto; flex:none; font-family:var(--font-mono); font-size:10px; letter-spacing:0.04em; color:#9a9aa2; }',
    '.es-win .mkframe { background:#f4f6f9; }',
    '.es-cap { display:flex; flex-direction:column; gap:6px; padding:14px 3px 0; }',
    '.es-cap__row { display:flex; align-items:baseline; gap:9px; }',
    '.es-cap__t { font-size:14px; font-weight:560; letter-spacing:-0.01em; color:var(--text); line-height:1.3; }',
    '.es-cap__tag { margin-left:auto; flex:none; font-family:var(--font-mono); font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-faint); padding-top:1px; }',
    '.es-cap__note { font-size:12.5px; line-height:1.5; color:var(--text-faint); margin:0; }',
    '.es-note { margin-top:46px; font-family:var(--font-mono); font-size:11px; letter-spacing:0.06em; color:var(--text-faint); display:flex; align-items:center; gap:10px; }',
    '.es-note::before { content:""; width:18px; height:1px; background:var(--line-2,#2a2a30); }',
    '@media (max-width:560px){ .es-grid{ grid-template-columns:1fr; } }'
  ].join('\n');

  function win(url, inner) {
    return '<div class="es-win">' +
      '<div class="es-win__bar"><span class="es-win__dots"><i></i><i></i><i></i></span><span class="es-win__url">' + url + '</span></div>' +
      '<div class="mkframe"><div class="mkscale">' + inner + '</div></div>' +
    '</div>';
  }
  function card(url, inner, t, note, pos) {
    return '<figure class="es-card" style="margin:0">' + win(url, inner) +
      '<figcaption class="es-cap"><div class="es-cap__row"><span class="es-cap__t">' + t + '</span><span class="es-cap__tag">' + pos + '</span></div>' +
      '<p class="es-cap__note">' + note + '</p></figcaption></figure>';
  }

  function board(n, h, count, lead, cards) {
    return '<section class="es-board" data-screen-label="' + h + '">' +
      '<div class="es-board__head"><span class="es-board__n">' + n + '</span><div class="es-board__h">' + h + '</div><span class="es-board__c">' + count + '</span></div>' +
      '<p class="es-board__lead">' + lead + '</p>' +
      '<div class="es-grid">' + cards + '</div></section>';
  }

  var b2b = board('01', 'The operator side · B2B', '2 screens',
    "Where an operations team runs the business, orders, inventory and fulfilment in one console. The job here was density without clutter: show a lot, but keep one thing obviously the most important on every screen.",
    card('app.edgistify.com/dashboard', b2bDash, 'Platform overview', "The home an operator opens to. Today's numbers up top, order volume and channel split below, recent orders within reach, one glance answers \"is anything off?\"", '01 / 02') +
    card('app.edgistify.com/orders/EO-7741', b2bOrder, 'Order detail', "One order, end to end, warehouse and last-mile on a single timeline, so support never has to chase two systems to answer where's my order.", '02 / 02'));

  var b2c = board('02', 'The customer side · B2C', '1 screen',
    "The same platform, turned outward. The operator view is dense by design; the customer view is the opposite, calm, one answer per screen, no jargon. Both are built from the same parts, which is the whole point of EdgeOS.",
    card('edgistify.com/track', b2cTrack, 'Track your order', "A customer only wants one thing: when. So the screen leads with the answer, arriving today, by 6 PM, and everything else (the steps, the driver, the items) sits quietly underneath.", '01 / 01'));

  window.PROJECT_SCREENS = {
    tag: 'B2B · B2C',
    driver:
      '<div class="es">' +
        '<style>' + css + '</style>' +
        '<div class="es-capbar"><span>EdgeOS · <b>one platform, two faces</b></span><span>Representative product screens · operator + customer</span></div>' +
        '<div class="es-boards">' + b2b + b2c + '</div>' +
        '<div class="es-note">Built in the same UI system the live product shipped on</div>' +
      '</div>'
  };
})();

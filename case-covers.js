
/* ============================================================
   CASE COVERS — clean editorial covers for projects that have
   no real screen exports. Big type + brand color, no fake UI.
   Used on (a) the WORK cards on index and (b) the case-study
   hero. One source of truth: window.CASE_COVER(key).
   ============================================================ */
(function () {
  'use strict';

  // brand color · short cover title · one-line tag · domain glyph · client
  var COVERS = {
    'stock-on-wheel':   { no: '001', accent: '#E2552B', title: 'Real-time mobile inventory', tag: 'A van the office can finally see into.', client: 'Omniful', glyph: 'box' },
    'tms-delivery-app': { no: '002', accent: '#E8833A', title: 'Unified delivery flow',       tag: 'Vehicles, trips, proof and payment — one flow.', client: 'Omniful', glyph: 'truck' },
    'demand-forecasting':{ no: '003', accent: '#7A5AF8', title: 'Demand forecasting',          tag: 'From a chart you trust to an order, in one step.', client: 'Omniful', glyph: 'trend' },
    'route-optimization-bisleri': { no: '004', accent: '#2A8FE0', title: 'Route optimization', tag: 'Vehicle-aware routes, past the ten-stop ceiling.', client: 'Edgistify × Bisleri', glyph: 'pin' },
    'picker-app':       { no: '005', accent: '#0E9F6E', title: 'Warehouse picker',            tag: 'Two things on screen, max — built for the floor.', client: 'Edgistify', glyph: 'pick' },
    'edgeos':           { no: '006', accent: '#5468FA', title: 'EdgeOS platform',             tag: 'One platform across B2B and B2C.', client: 'Edgistify', glyph: 'layers' }
  };

  var G = {
    box:    '<path d="M3 8l9-4 9 4-9 4-9-4z"/><path d="M3 8v8l9 4 9-4V8"/><path d="M12 12v8"/>',
    truck:  '<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7.5" cy="18.5" r="1.7"/><circle cx="17.5" cy="18.5" r="1.7"/>',
    trend:  '<path d="M3 17l6-6 4 4 7-7"/><path d="M17 8h4v4"/>',
    pin:    '<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>',
    pick:   '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M9 13l2 2 4-4"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>'
  };

  function svg(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (G[name] || '') + '</svg>';
  }

  // hero=true → larger type + meta row for the case-study hero
  window.CASE_COVER = function (key, opts) {
    var c = COVERS[key];
    if (!c) return '';
    var hero = opts && opts.hero;
    return '' +
      '<div class="cvr' + (hero ? ' cvr--hero' : '') + '" style="--cvr:' + c.accent + '">' +
        '<span class="cvr__glyph" aria-hidden="true">' + svg(c.glyph) + '</span>' +
        '<div class="cvr__top">' +
          '<span>CASE / ' + c.no + '</span>' +
          '<span>' + c.client.toUpperCase() + '</span>' +
        '</div>' +
        '<div class="cvr__btm">' +
          '<div class="cvr__title">' + c.title + '</div>' +
          '<div class="cvr__tag">' + c.tag + '</div>' +
        '</div>' +
      '</div>';
  };

  // auto-hydrate WORK cards on the index page
  function hydrateCards() {
    document.querySelectorAll('.casecard__mock').forEach(function (mock) {
      var view = mock.querySelector('[data-mock]');
      if (!view) return;
      var key = view.getAttribute('data-mock');
      var html = window.CASE_COVER(key);
      if (html) mock.innerHTML = html;
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateCards);
  } else {
    hydrateCards();
  }
})();

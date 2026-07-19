
/* Omniful DS docs — renderer + interactions. Reads window.OM_CATALOG + icon data. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var I = window.OM_I;

  /* ============ render component sections from catalog ============ */
  var main = $('#catalogMount');
  var railComp = $('#railComponents');
  var whyIco = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.4v3.4M8 5.1v.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var doIco = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="m5.2 8.3 1.9 1.9 3.7-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var dontIco = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="m5.5 5.5 5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';

  function stateGrid(lbl, cols, cells) {
    return '<div class="ds-lbl">' + lbl + '</div><div class="ds-states ds-states--' + cols + '">' +
      cells.map(function (c) {
        return '<div class="ds-state"><span class="ds-state__demo">' + c.h + '</span><span class="ds-state__name">' + c.n + '</span></div>';
      }).join('') + '</div>';
  }

  (window.OM_CATALOG || []).forEach(function (sec, si) {
    var snum = ('0' + (si + 1)).slice(-2);
    var html = '<section class="ds-sec" id="' + sec.id + '"><div class="ds-sec__head"><div class="ds-sec__count">' + snum + '</div><div><div class="ds-sec__eyebrow">' + sec.eyebrow + '</div><h2>' + sec.title + '</h2><p class="ds-sec__intro">' + sec.intro + '</p></div></div>';
    sec.components.forEach(function (c, ci) {
      var cnum = snum + '.' + (ci + 1);
      html += '<article class="ds-comp" id="' + c.id + '">';
      html += '<div class="ds-comp__head"><span class="ds-comp__num">' + cnum + '</span><h3>' + c.name + '</h3><a class="anchor" href="#' + c.id + '" aria-label="Link to ' + c.name + '">#</a></div>';
      html += '<p class="ds-comp__desc">' + c.desc + '</p>';
      if (c.why) html += '<div class="ds-why">' + whyIco + '<span>' + c.why + '</span></div>';
      html += '<div class="ds-lbl">Preview <span class="ds-lbl__hint">interactive</span></div><div class="ds-preview"><div class="ds-preview__stage">' + c.preview + '</div></div>';
      if (c.states) html += stateGrid(c.lblStates || 'States', c.statesCols || c.states.length, c.states);
      (c.extra || []).forEach(function (ex) { html += stateGrid(ex.lbl, ex.cols || ex.states.length, ex.states); });
      if (c.spec) {
        html += '<div class="ds-lbl">Specs</div><table class="ds-spec"><thead><tr><th style="width:34%">Property</th><th>Value</th></tr></thead><tbody>' +
          c.spec.map(function (r) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table>';
      }
      if (c.guide) {
        html += '<div class="ds-lbl">Usage</div><div class="ds-guide">' +
          '<div class="ds-guide__card ds-guide--do"><div class="ds-guide__demo">' + c.guide.do.demo + '</div><div class="ds-guide__tag">' + doIco + 'Do</div><div class="ds-guide__tx">' + c.guide.do.tx + '</div></div>' +
          '<div class="ds-guide__card ds-guide--dont"><div class="ds-guide__demo">' + c.guide.dont.demo + '</div><div class="ds-guide__tag">' + dontIco + 'Don\u2019t</div><div class="ds-guide__tx">' + c.guide.dont.tx + '</div></div></div>';
      }
      html += '</article>';
    });
    html += '</section>';
    main.insertAdjacentHTML('beforeend', html);

    // rail group
    var rail = '<div class="ds-rail__group">' + sec.group + '</div>' + sec.components.map(function (c) {
      return '<a class="ds-rail__link" href="#' + c.id + '">' + c.name + '</a>';
    }).join('');
    railComp.insertAdjacentHTML('beforeend', rail);
  });

  /* ============ foundations: swatches, scales, icons ============ */
  $$('[data-swatches]').forEach(function (grid) {
    var items = JSON.parse(grid.getAttribute('data-swatches'));
    grid.innerHTML = items.map(function (it) {
      var name = it[0], hex = it[1];
      var light = /^#(F|E|CC)/i.test(hex) ? 'box-shadow:inset 0 0 0 1px var(--om-divider);' : '';
      return '<div class="ds-swatch"><div class="ds-swatch__chip" style="background:' + hex + ';' + light + '"></div><div class="ds-swatch__tx"><b>' + name + '</b><span>' + hex + '</span></div></div>';
    }).join('');
  });

  // Polaris-style color list: swatch + token + hex + usage
  $$('[data-colors]').forEach(function (list) {
    var items = JSON.parse(list.getAttribute('data-colors'));
    list.innerHTML = items.map(function (it) {
      return '<div class="ds-colorrow"><span class="sw" style="background:' + it[1] + '"></span>' +
        '<span class="meta"><b>' + it[0] + '</b><code>' + it[1] + '</code></span>' +
        '<span class="use">' + it[2] + '</span></div>';
    }).join('');
  });

  var SPACING = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56];
  var sp = $('#spaceScale');
  if (sp) sp.innerHTML = SPACING.map(function (v, i) {
    return '<div class="ds-space-row"><span class="n">spacing-' + i + ' · ' + v + 'px</span><span class="ds-space-bar" style="width:' + Math.max(v, 2) + 'px"></span></div>';
  }).join('');

  var RADII = [0, 4, 6, 8, 16, 24, 999];
  var ra = $('#radiusScale');
  if (ra) ra.innerHTML = RADII.map(function (r) {
    return '<div style="text-align:center"><div style="width:60px;height:60px;background:var(--om-primary-lighter);border:1.5px solid var(--om-primary-light);border-radius:' + r + 'px"></div><div style="font-size:10.5px;color:var(--om-ink-3);margin-top:6px;font-family:var(--om-mono)">' + (r === 999 ? 'full' : r + 'px') + '</div></div>';
  }).join('');

  var elev = $('#elevScale');
  if (elev) elev.innerHTML = [['card', 'var(--om-shadow-card)'], ['popover', 'var(--om-shadow-pop)'], ['modal', 'var(--om-shadow-modal)']].map(function (e) {
    return '<div class="ds-elev__card" style="box-shadow:' + e[1] + ';border:1px solid var(--om-divider)">' + e[0] + '</div>';
  }).join('');

  // icons — all at once, filterable
  function renderIcons(icons) {
    var names = Object.keys(icons).sort();
    var grid = $('#iconGrid'), count = $('#iconCount');
    function draw(q) {
      var hits = q ? names.filter(function (n) { return n.toLowerCase().indexOf(q.toLowerCase()) !== -1; }) : names;
      grid.innerHTML = hits.map(function (n) {
        var ic = icons[n];
        return '<div class="ds-icon" title="' + n + '"><span class="ic"><svg viewBox="' + ic.viewBox + '">' + ic.body + '</svg></span><span>' + n + '</span></div>';
      }).join('') || '<div style="grid-column:1/-1;color:var(--om-ink-3);font-size:13px;padding:24px;text-align:center">No icons match.</div>';
      count.textContent = hits.length + ' of ' + names.length + ' icons';
    }
    draw('');
    var search = $('#iconSearch');
    var input = $('input', search), clr = $('.clr', search);
    input.addEventListener('input', function () {
      search.classList.toggle('has-value', !!input.value); draw(input.value);
    });
    clr.addEventListener('click', function () {
      input.value = ''; search.classList.remove('has-value'); draw(''); input.focus();
    });

    // vnav icons
    var VMAP = { overview: 'Overview', orders: 'LiveOrder', inv: 'Inventory', ret: 'Returns', set: 'Settings' };
    $$('[data-vnav] .om-vnav__item').forEach(function (item) {
      var n = VMAP[item.getAttribute('data-ic')];
      if (n && icons[n]) item.insertAdjacentHTML('afterbegin', '<svg viewBox="' + icons[n].viewBox + '">' + icons[n].body + '</svg>');
    });
  }
  import(window.OM_ICON_BASE || './icons/icon-data.js').then(function (m) { renderIcons(m.default); });

  /* ============ interactions ============ */
  // dropdown (single)
  function closeDds(except) { $$('.om-dd.is-open').forEach(function (d) { if (d !== except) d.classList.remove('is-open'); }); }
  document.addEventListener('click', function (e) { if (!e.target.closest('.om-dd')) closeDds(); });
  $$('[data-dd]').forEach(function (dd) {
    $('.om-dd__btn', dd).addEventListener('click', function () { closeDds(dd); dd.classList.toggle('is-open'); });
    $$('.om-dd__opt', dd).forEach(function (opt) {
      opt.addEventListener('click', function () {
        $$('.om-dd__opt', dd).forEach(function (o) { o.classList.remove('is-sel'); });
        opt.classList.add('is-sel');
        $('.om-dd__btn', dd).firstChild.outerHTML = '<span>' + opt.getAttribute('data-v') + '</span>';
        dd.classList.remove('is-open');
      });
    });
  });
  // dropdown (multi)
  $$('[data-dd-multi]').forEach(function (dd) {
    $('.om-dd__btn', dd).addEventListener('click', function () { closeDds(dd); dd.classList.toggle('is-open'); });
    $$('label.om-dd__opt', dd).forEach(function (opt) {
      opt.addEventListener('click', function (e) {
        e.preventDefault();
        var cb = $('input', opt); cb.checked = !cb.checked;
        var n = $$('input:checked', dd).length;
        var lbl = $('.om-dd__btn', dd).firstChild;
        lbl.textContent = n ? 'Order status (' + n + ')' : 'Order status';
        lbl.className = n ? '' : 'ph';
      });
    });
  });
  // number stepper
  $$('[data-stepnum]').forEach(function (st) {
    var inp = $('input', st), dec = $('[data-dec]', st), inc = $('[data-inc]', st);
    var min = +st.getAttribute('data-min') || 0, max = +st.getAttribute('data-max') || 999;
    function set(v) {
      v = Math.max(min, Math.min(max, v)); inp.value = v;
      dec.disabled = v <= min; inc.disabled = v >= max;
    }
    dec.addEventListener('click', function () { set(+inp.value - 1); });
    inc.addEventListener('click', function () { set(+inp.value + 1); });
    inp.addEventListener('change', function () { set(+inp.value.replace(/\D/g, '') || min); });
    set(+inp.value);
  });
  // chips
  $$('[data-chiprow]').forEach(function (row) {
    row.addEventListener('click', function (e) {
      var xBtn = e.target.closest('.x'), chip = e.target.closest('.om-chip');
      if (!chip) return;
      if (xBtn) { chip.remove(); return; }
      chip.classList.toggle('is-selected');
    });
  });
  // search live demo
  $$('[data-search]').forEach(function (s) {
    var input = $('input', s), clr = $('.clr', s);
    input.addEventListener('input', function () { s.classList.toggle('has-value', !!input.value); });
    if (clr) clr.addEventListener('click', function () { input.value = ''; s.classList.remove('has-value'); input.focus(); });
  });
  // drop-zone hover-by-drag
  $$('[data-drop]').forEach(function (d) {
    ['dragenter', 'dragover'].forEach(function (ev) { d.addEventListener(ev, function (e) { e.preventDefault(); d.classList.add('is-drag'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { d.addEventListener(ev, function (e) { e.preventDefault(); d.classList.remove('is-drag'); }); });
  });
  // calendar
  $$('[data-cal]').forEach(function (mount) {
    var sel = 9;
    var isMobile = mount.getAttribute('data-cal') === 'mobile';
    function draw() {
      var cells = '';
      ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(function (d) { cells += '<span class="ds-cal-dow om-cal__dow">' + d + '</span>'; });
      for (var i = 29; i <= 30; i++) cells += '<button class="om-cal__day is-muted">' + i + '</button>';
      for (var d2 = 1; d2 <= 31; d2++) {
        var cls = 'om-cal__day' + (d2 === 11 ? ' is-today' : '') + (d2 === sel ? ' is-sel' : '');
        cells += '<button class="' + cls + '" data-d="' + d2 + '">' + d2 + '</button>';
      }
      for (var d3 = 1; d3 <= 2; d3++) cells += '<button class="om-cal__day is-muted">' + d3 + '</button>';
      mount.innerHTML = '<div class="om-cal' + (isMobile ? ' om-cal--mobile' : '') + '"><div class="om-cal__head"><button class="om-cal__nav" aria-label="Previous month"><svg viewBox="0 0 16 16" fill="none"><path d="m10 4-4 4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button><b>July 2026</b><button class="om-cal__nav" aria-label="Next month"><svg viewBox="0 0 16 16" fill="none"><path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div><div class="om-cal__grid">' + cells + '</div>' + (isMobile ? '<div class="om-cal-mob__foot"><button class="om-btn om-btn--line om-btn--compact">Cancel</button><button class="om-btn om-btn--compact">Confirm</button></div>' : '') + '</div>';
      $$('.om-cal__day[data-d]', mount).forEach(function (b) {
        b.addEventListener('click', function () { sel = +b.getAttribute('data-d'); draw(); });
      });
    }
    draw();
  });
  // tabs + segmented
  $$('[data-tabs]').forEach(function (tabs) {
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', tabs).forEach(function (t) { t.classList.remove('is-on'); }); b.classList.add('is-on');
    });
  });
  $$('[data-seg]').forEach(function (seg) {
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', seg).forEach(function (t) { t.classList.remove('is-on'); }); b.classList.add('is-on');
    });
  });
  // vnav
  // app navigation (icon rail + expandable panel)
  $$('[data-appnav]').forEach(function (nav) {
    $$('.om-appnav__railitem', nav).forEach(function (r) {
      r.addEventListener('click', function () {
        $$('.om-appnav__railitem', nav).forEach(function (x) { x.classList.remove('is-on'); });
        r.classList.add('is-on');
        // switching top-level section collapses any open secondary menu
        $$('.om-appnav__row.is-expanded', nav).forEach(function (row) {
          row.classList.remove('is-expanded');
          var subId = row.getAttribute('data-sub');
          if (subId) { var sub = document.getElementById(subId); if (sub) sub.style.display = 'none'; }
        });
      });
    });
    $$('.om-appnav__row', nav).forEach(function (row) {
      row.addEventListener('click', function () {
        row.classList.toggle('is-expanded');
        var subId = row.getAttribute('data-sub');
        if (subId) { var sub = document.getElementById(subId); if (sub) sub.style.display = row.classList.contains('is-expanded') ? 'flex' : 'none'; }
      });
    });
    $$('.om-appnav__sub a', nav).forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var p = a.closest('.om-appnav__sub');
        $$('a', p).forEach(function (x) { x.classList.remove('is-on'); });
        a.classList.add('is-on');
      });
    });
  });
  // stepper
  var CHK = '<svg viewBox="0 0 12 12" fill="none"><path d="m2 6.2 2.7 2.6L10 3.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  $$('[data-stepper]').forEach(function (st) {
    var STEPS = ['Details', 'Items', 'Shipping', 'Review'];
    function draw() {
      var cur = +st.getAttribute('data-current');
      st.innerHTML = STEPS.map(function (s, i) {
        var cls = i < cur ? 'is-done' : i === cur ? 'is-on' : '';
        var c = i < cur ? CHK : (i + 1);
        var bar = i < STEPS.length - 1 ? '<span class="om-step__bar ' + (i < cur ? 'is-fill' : '') + '"></span>' : '';
        return '<span class="om-step ' + cls + '" data-i="' + i + '" style="cursor:pointer"><span class="c">' + c + '</span>' + s + '</span>' + bar;
      }).join('');
    }
    st.addEventListener('click', function (e) {
      var s2 = e.target.closest('.om-step'); if (!s2) return;
      st.setAttribute('data-current', s2.getAttribute('data-i')); draw();
    });
    draw();
  });
  // pagination
  var CL = '<svg viewBox="0 0 16 16" fill="none"><path d="m10 4-4 4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var CR = '<svg viewBox="0 0 16 16" fill="none"><path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  $$('[data-pager]').forEach(function (pg) {
    function draw() {
      var page = +pg.getAttribute('data-page'), total = +pg.getAttribute('data-total');
      var nums;
      if (total <= 7) { nums = []; for (var i = 1; i <= total; i++) nums.push(i); }
      else if (page <= 4) nums = [1, 2, 3, 4, 5, '…', total];
      else if (page >= total - 3) nums = [1, '…', total - 4, total - 3, total - 2, total - 1, total];
      else nums = [1, '…', page - 1, page, page + 1, '…', total];
      pg.innerHTML = '<button data-go="' + (page - 1) + '"' + (page === 1 ? ' disabled' : '') + ' aria-label="Previous">' + CL + '</button>' +
        nums.map(function (n) { return n === '…' ? '<span class="gap">…</span>' : '<button data-go="' + n + '" class="' + (n === page ? 'is-on' : '') + '">' + n + '</button>'; }).join('') +
        '<button data-go="' + (page + 1) + '"' + (page === total ? ' disabled' : '') + ' aria-label="Next">' + CR + '</button>' +
        '<span class="om-pager__go">Go to<input type="text" inputmode="numeric" aria-label="Go to page" value="' + page + '"><button class="pgo" aria-label="Go">→</button></span>';
      var inp = pg.querySelector('.om-pager__go input'), gob = pg.querySelector('.pgo');
      function jump() { var v = parseInt(inp.value, 10); if (v >= 1 && v <= total) { pg.setAttribute('data-page', v); draw(); } else { inp.value = page; } }
      gob.addEventListener('click', jump);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); jump(); } });
    }
    pg.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-go]'); if (!b || b.disabled) return;
      pg.setAttribute('data-page', b.getAttribute('data-go')); draw();
    });
    draw();
  });
  // side sheet + modal demos
  $$('[data-sheetdemo]').forEach(function (box) {
    var sheet = $('[data-sheet]', box), blanket = $('[data-blanket]', box);
    $('[data-open]', box).addEventListener('click', function () { sheet.classList.add('is-open'); blanket.classList.add('is-on'); });
    function close() { sheet.classList.remove('is-open'); blanket.classList.remove('is-on'); }
    $('[data-close]', box).addEventListener('click', close);
    blanket.addEventListener('click', close);
  });
  $$('[data-modaldemo]').forEach(function (box) {
    var modal = $('[data-modal]', box), blanket = $('[data-blanket]', box);
    $('[data-open]', box).addEventListener('click', function () { modal.classList.add('is-open'); blanket.classList.add('is-on'); });
    function close() { modal.classList.remove('is-open'); blanket.classList.remove('is-on'); }
    $$('[data-close]', box).forEach(function (b) { b.addEventListener('click', close); });
    blanket.addEventListener('click', close);
  });
  // toasts
  var OKT = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="m5.2 8.3 1.9 1.9 3.7-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ERRT = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="m5.5 5.5 5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  $$('[data-toast]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var kind = btn.getAttribute('data-toast');
      var lane = $('[data-toastlane]', btn.closest('.ds-preview__stage') || document);
      if (!lane) lane = $('[data-toastlane]');
      var t = document.createElement('div');
      t.className = 'om-toast om-toast--' + kind;
      t.innerHTML = (kind === 'success' ? OKT : ERRT) +
        '<span>' + (kind === 'success' ? 'Wave W-1042 released — 36 orders sent to picking.' : 'Couldn\u2019t release wave — 2 SKUs have no bin assigned.') + '</span>' +
        '<button class="x" aria-label="Dismiss">' + I.x + '</button>';
      $('.x', t).addEventListener('click', function () { t.remove(); });
      lane.appendChild(t);
      setTimeout(function () { t.style.transition = 'opacity .3s ease'; t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 320); }, 4000);
    });
  });
  // tooltip (hover handled visually — bubble always in DOM, shown via JS)
  $$('[data-tip]').forEach(function (tip) {
    var b = $('.om-tip__bubble', tip);
    b.style.display = 'none';
    ['mouseenter', 'focusin'].forEach(function (ev) { tip.addEventListener(ev, function () { b.style.display = 'block'; }); });
    ['mouseleave', 'focusout'].forEach(function (ev) { tip.addEventListener(ev, function () { b.style.display = 'none'; }); });
  });
  // accordion
  $$('[data-acc]').forEach(function (acc) {
    $$('.om-acc__btn', acc).forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.closest('.om-acc__item').classList.toggle('is-open');
      });
    });
  });
  // table select-all
  $$('[data-table]').forEach(function (wrap) {
    var all = $('[data-all]', wrap); if (!all) return;
    var rows = $$('.tblRow', wrap);
    function sync() {
      var n = rows.filter(function (r) { return r.checked; }).length;
      all.checked = n === rows.length;
      all.indeterminate = n > 0 && n < rows.length;
      rows.forEach(function (r) {
        r.closest('tr').classList.toggle('is-sel', r.checked);
        r.closest('.om-check').classList.toggle('is-checked', r.checked);
      });
      all.closest('.om-check').classList.toggle('is-checked', all.checked);
      all.closest('.om-check').classList.toggle('is-indeterminate', all.indeterminate);
    }
    all.addEventListener('change', function () { rows.forEach(function (r) { r.checked = all.checked; }); sync(); });
    rows.forEach(function (r) { r.addEventListener('change', sync); });
    sync();
  });
  // inline edit
  $$('[data-inline]').forEach(function (wrap) {
    var val = $('.val', wrap);
    function start() {
      var cur = val.textContent;
      var inp = document.createElement('input');
      inp.value = cur;
      val.replaceWith(inp);
      inp.focus(); inp.select();
      var done = false;
      function finish(save) {
        if (done) return; done = true;
        inp.replaceWith(val);
        if (save && inp.value.trim()) val.textContent = inp.value.trim();
      }
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') finish(true);
        if (e.key === 'Escape') finish(false);
      });
      inp.addEventListener('blur', function () { finish(true); });
    }
    val.addEventListener('click', start);
    val.addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });
  });
  // loading button demo (in preview only — first .om-btn inside button preview left alone; states are static)

  /* ============ rail scroll-spy ============ */
  var links = $$('.ds-rail__link');
  var map = {};
  links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
  var targets = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('is-on'); });
        var l2 = map[en.target.id]; if (l2) { l2.classList.add('is-on'); }
      }
    });
  }, { rootMargin: '-15% 0px -75% 0px' });
  targets.forEach(function (t) { spy.observe(t); });
})();


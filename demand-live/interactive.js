/* ============================================================
   interactive.js — shared interactivity for the Demand Forecasting
   prototype screens (demand-live/*.html).

   Each screen used to be a static mockup: filter "dropdowns" that only
   flashed on click, radio-style method/period rows with no click handler,
   a search box that didn't search, table row actions that did nothing.
   This file wires all of that for real, generically, across every screen
   that includes it — safe to include everywhere (every wire* function is
   a no-op if its selector matches nothing on a given page).
   ============================================================ */
(function () {
  'use strict';

  var OPTIONS = {
    seller: ['All', 'Nike', 'Adidas', 'Uniqlo', 'American Tourister', 'Samsung', 'Bath & Body Works', 'Puma', 'The Ordinary', 'Bata', 'Nespresso', 'Levi’s', 'Decathlon', 'Charles & Keith'],
    historicData: ['All', 'Last 2 months', 'Last 3 months', 'Last 6 months', 'Last 12 months'],
    method: ['All', 'Moving Average', 'Seasonal', 'Exp. Smoothing', 'Weighted Avg'],
    timePeriod: ['All', 'Next 1 month', 'Next 2 months', 'Next 3 months', 'Next 4 weeks', 'Next 6 weeks', 'Next 8 weeks', 'Next 6 months'],
    hub: ['Riyadh hub (12345)', 'Jeddah hub (48213)', 'Dammam hub (77410)', 'Khobar hub (30021)'],
    velocity: ['All', 'High sales velocity', 'Low sales velocity', 'Mixed velocity'],
    dateRange: ['All time', 'Today', 'Last 7 days', 'Last 30 days', 'Last 3 months', 'Last 12 months']
  };
  // seller dropdowns used as a *value picker* (not "All"-filtered) shouldn't offer "All"
  var NO_ALL = { seller: OPTIONS.seller.slice(1), historicData: OPTIONS.historicData.slice(1) };

  /* ---------------- injected styles (scoped, prefixed omx-) ---------------- */
  var css = ''
    + '.omx-menu{position:fixed;z-index:900;background:#fff;border:1px solid var(--line,#E7E9EE);border-radius:10px;box-shadow:0 12px 32px -8px rgba(20,22,30,.22);padding:6px;min-width:180px;max-height:280px;overflow-y:auto;font-family:Poppins,sans-serif;}'
    + '.omx-menu i{display:block;padding:8px 10px;border-radius:7px;font-size:13px;color:var(--ink,#1A1C21);cursor:pointer;font-style:normal;white-space:nowrap;}'
    + '.omx-menu i:hover{background:var(--wash-2,#F4F5FD);}'
    + '.omx-menu i.is-sel{color:var(--brand,#5468FA);font-weight:600;background:var(--wash,#EEF0FE);}'
    + '.omx-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(8px);background:#1A1C21;color:#fff;font-family:Poppins,sans-serif;font-size:13px;font-weight:500;padding:11px 18px;border-radius:10px;box-shadow:0 12px 32px -8px rgba(0,0,0,.4);z-index:950;opacity:0;transition:opacity .18s ease,transform .18s ease;pointer-events:none;max-width:80vw;text-align:center;}'
    + '.omx-toast.on{opacity:1;transform:translateX(-50%) translateY(0);}'
    + '.inp[contenteditable],.ss-input[contenteditable]{cursor:text;}'
    + '.inp[contenteditable]:focus,.ss-input[contenteditable]:focus{outline:none;border-color:var(--brand,#5468FA);box-shadow:0 0 0 3px rgba(84,104,250,.12);}'
    + '.omx-row-fade{opacity:0;transform:translateX(8px);transition:opacity .22s ease,transform .22s ease;}'
    + 'input.ss-input{font-family:inherit;outline:none;}';
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------------- toast ---------------- */
  var toastEl = null, toastT = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'omx-toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add('on'); });
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2200);
  }
  window.__omToast = toast;

  /* ---------------- dropdown widget: .fsel / .inp.sel / .ss-input.sel, all [data-field] ---------------- */
  var openMenu = null;
  function closeMenu() { if (openMenu) { openMenu.remove(); openMenu = null; } }
  document.addEventListener('click', function (e) {
    if (openMenu && !e.target.closest('.omx-menu') && !e.target.closest('[data-field]')) closeMenu();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  function labelFor(el) { return el.querySelector('.fv, .inp-v'); }

  function wireDropdowns() {
    var els = document.querySelectorAll('.fsel[data-field], .inp.sel[data-field], .ss-input.sel[data-field]');
    els.forEach(function (el) {
      if (el.__ixWired) return; el.__ixWired = true;
      el.style.cursor = 'pointer';
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        var field = el.getAttribute('data-field');
        var opts = (el.hasAttribute('data-no-all') && NO_ALL[field]) || OPTIONS[field];
        if (!opts) return;
        if (openMenu && openMenu.__forEl === el) { closeMenu(); return; }
        closeMenu();
        var current = el.getAttribute('data-value') || (labelFor(el) && labelFor(el).textContent.trim());
        var menu = document.createElement('div');
        menu.className = 'omx-menu';
        menu.__forEl = el;
        opts.forEach(function (opt) {
          var i = document.createElement('i');
          i.textContent = opt;
          if (opt === current) i.className = 'is-sel';
          i.addEventListener('click', function (ev) {
            ev.stopPropagation();
            el.setAttribute('data-value', opt);
            var lbl = labelFor(el);
            if (lbl) lbl.textContent = opt;
            if (field === 'hub' && opt) {
              el.classList.remove('err');
              var errTxt = el.parentElement && el.parentElement.querySelector('.err-txt');
              if (errTxt) errTxt.style.display = 'none';
            }
            closeMenu();
            document.dispatchEvent(new CustomEvent('omselect', { detail: { field: field, value: opt, el: el } }));
          });
          menu.appendChild(i);
        });
        document.body.appendChild(menu);
        var r = el.getBoundingClientRect();
        var top = r.bottom + 6, left = r.left;
        var mw = 220;
        if (left + mw > window.innerWidth - 12) left = Math.max(12, window.innerWidth - mw - 12);
        menu.style.top = top + 'px';
        menu.style.left = left + 'px';
        openMenu = menu;
      });
    });
  }

  /* ---------------- radio rows: .method-row / .opt-row ---------------- */
  function wireRadioRows() {
    ['method-row', 'opt-row'].forEach(function (cls) {
      var rows = document.querySelectorAll('.' + cls);
      if (!rows.length) return;
      rows.forEach(function (row) {
        if (row.__ixWired) return; row.__ixWired = true;
        row.addEventListener('click', function () {
          rows.forEach(function (r) { r.classList.toggle('sel', r === row); });
        });
      });
    });
  }

  /* ---------------- chip segments: .seg .chip ---------------- */
  function wireChips() {
    document.querySelectorAll('.seg').forEach(function (seg) {
      if (seg.__ixWired) return; seg.__ixWired = true;
      var chips = [].slice.call(seg.querySelectorAll('.chip'));
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.toggle('on', c === chip); });
        });
      });
    });
  }

  /* ---------------- generic table search ---------------- */
  function wireSearch() {
    var input = document.querySelector('.tsearch input');
    var table = document.querySelector('.tcard table, table');
    if (!input || !table || input.__ixWired) return;
    input.__ixWired = true;
    var tbody = table.querySelector('tbody');
    var cnt = document.querySelector('.tsub .cnt, .tsub');
    function apply() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      [].slice.call(tbody.querySelectorAll('tr')).forEach(function (tr) {
        if (tr.dataset.omVelHidden === '1') { tr.style.display = 'none'; return; } // hidden by the velocity filter
        var nameEl = tr.querySelector('.fname, .cname');
        var text = (nameEl ? nameEl.textContent : tr.textContent).toLowerCase();
        var vis = !q || text.indexOf(q) > -1;
        tr.style.display = vis ? '' : 'none';
        if (vis) shown++;
      });
      if (cnt) cnt.textContent = shown ? ('Showing 1–' + shown + ' of ' + shown + ' items') : 'No results match your search';
    }
    input.addEventListener('input', apply);
  }

  /* ---------------- categories: velocity filter dropdown drives row visibility ---------------- */
  function wireVelocityFilter() {
    document.addEventListener('omselect', function (e) {
      if (e.detail.field !== 'velocity') return;
      var table = document.querySelector('.tcard table');
      if (!table) return;
      var v = e.detail.value;
      [].slice.call(table.querySelectorAll('tbody tr')).forEach(function (tr) {
        var vel = tr.querySelector('.vel');
        var match = v === 'All' || (vel && vel.textContent.trim() === v);
        tr.dataset.omVelHidden = match ? '0' : '1';
        tr.style.display = match ? '' : 'none';
      });
      var search = document.querySelector('.tsearch input');
      if (search) search.dispatchEvent(new Event('input'));
    });
  }

  /* ---------------- table row actions (categories: edit / delete) ---------------- */
  function wireRowActions() {
    document.querySelectorAll('.rowacts').forEach(function (acts) {
      if (acts.__ixWired) return; acts.__ixWired = true;
      var icons = acts.querySelectorAll('.a');
      // icons[0] (edit) is left to a page-level [data-goto] when one is set in
      // the markup (80-categories.html routes it to the Create Category sheet);
      // otherwise just acknowledge the click.
      if (icons[0] && !icons[0].hasAttribute('data-goto')) icons[0].addEventListener('click', function (e) {
        e.stopPropagation();
        var tr = acts.closest('tr');
        var name = tr && tr.querySelector('.cname');
        toast('Editing “' + (name ? name.textContent.trim() : 'category') + '”');
      });
      if (icons[1]) icons[1].addEventListener('click', function (e) {
        e.stopPropagation();
        var tr = acts.closest('tr');
        if (!tr) return;
        var name = tr.querySelector('.cname');
        tr.classList.add('omx-row-fade');
        setTimeout(function () {
          tr.remove();
          var cnt = document.querySelector('.tsub .cnt, .tsub');
          var remaining = document.querySelectorAll('.tcard table tbody tr').length;
          if (cnt) cnt.textContent = 'Showing 1–' + remaining + ' of ' + remaining + ' items';
        }, 220);
        toast('Deleted “' + (name ? name.textContent.trim() : 'category') + '”');
      });
    });
  }

  /* ---------------- create-category side sheet chips (85-create-category.html) ---------------- */
  function wireChipRemove() {
    document.querySelectorAll('.ss-chip svg').forEach(function (svg) {
      if (svg.__ixWired) return; svg.__ixWired = true;
      svg.addEventListener('click', function () {
        var chip = svg.closest('.ss-chip');
        if (chip) chip.remove();
        updateSkuHint();
      });
    });
  }
  function updateSkuHint() {
    var hint = document.querySelector('.ss-hint');
    var chips = document.querySelectorAll('.ss-chips .ss-chip');
    if (hint) hint.textContent = chips.length + ' SKU' + (chips.length === 1 ? '' : 's') + ' added · search by SKU code or product name';
  }
  function wireChipAdd() {
    var input = document.querySelector('.ss-chips [data-chip-add]');
    if (!input || input.__ixWired) return;
    input.__ixWired = true;
    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || !input.value.trim()) return;
      e.preventDefault();
      var chip = document.createElement('span');
      chip.className = 'ss-chip';
      chip.textContent = input.value.trim();
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 12 12'); svg.setAttribute('fill', 'none');
      svg.innerHTML = '<path d="M3 3l6 6M9 3l-6 6" stroke="#5468FA" stroke-width="1.5" stroke-linecap="round"/>';
      chip.appendChild(svg);
      input.parentElement.insertBefore(chip, input);
      input.value = '';
      wireChipRemove();
      updateSkuHint();
    });
  }

  /* ---------------- inert-link catch-all: give every remaining clickable-looking
     element with no handler at least a visible acknowledgement, so nothing
     on the page reads as dead. Runs last and only touches un-wired elements
     that also aren't parent-handled navigation ([data-goto]/[data-cta]). ---------------- */
  function wireFallback() {
    var sel = '.link, .ticon, .cols, .dl, .view, .cta';
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.__ixWired || el.hasAttribute('data-goto') || el.hasAttribute('data-cta')) return;
      el.__ixWired = true;
      el.addEventListener('click', function () {
        var t = (el.textContent || '').trim();
        if (!t) return;
        toast(t.length > 40 ? t.slice(0, 40) + '…' : t);
      });
    });
  }

  function wireAll() {
    wireDropdowns();
    wireRadioRows();
    wireChips();
    wireSearch();
    wireVelocityFilter();
    wireRowActions();
    wireChipRemove();
    wireChipAdd();
    wireFallback();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wireAll);
  else wireAll();
})();

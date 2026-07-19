
/* Omniful DS catalog — Forms. Pushes onto window.OM_CATALOG. */
(function () {
  window.OM_CATALOG = window.OM_CATALOG || [];
  var I = window.OM_I;
  var box = '<span class="box">' + I.check + '</span>';
  var tick = '<span class="tick"><svg viewBox="0 0 16 16" fill="none"><path d="m3 8.5 3.2 3L13 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  window.OM_CATALOG.push({
    id: 'forms', group: 'Forms', title: 'Forms & inputs',
    eyebrow: 'Components', intro: 'Fields, selection controls and pickers. Every input is 40px tall on an 8px radius, shares one focus ring, and explains its own errors inline instead of only turning red.',
    components: [
      {
        id: 'text-field', name: 'Text field', desc: 'Single-line text entry. Label, optional helper text, and an error state that names the problem below the field.',
        why: 'The focus ring (primary + 3px lighter halo) is identical on every input in the system, so “this is active” reads the same everywhere. Errors describe the fix — a red border alone never tells the user what’s wrong.',
        preview: '<div class="om-field"><label>Order ID</label><input class="om-input" placeholder="e.g. OM-48291" /><span class="om-assist">Used across shipments and invoices</span></div>',
        lblStates: 'States',
        statesCols: 6,
        states: [
          { n: 'Default', h: '<input class="om-input" placeholder="Placeholder" style="width:150px" />' },
          { n: 'Hover', h: '<input class="om-input is-hover" placeholder="Placeholder" style="width:150px" />' },
          { n: 'Focus', h: '<input class="om-input is-focus" value="Typing" style="width:150px" />' },
          { n: 'Filled', h: '<input class="om-input" value="OM-48291" style="width:150px" />' },
          { n: 'Error', h: '<input class="om-input is-error" value="OM-48" style="width:150px" />' },
          { n: 'Disabled', h: '<input class="om-input" value="Locked" disabled style="width:150px" />' }
        ],
        extra: [
          { lbl: 'With adornments', cols: 3, states: [
            { n: 'Leading icon', h: '<span class="om-inputwrap om-inputwrap--lead" style="width:170px;display:block"><span class="adorn">' + I.search + '</span><input class="om-input" placeholder="Search" /></span>' },
            { n: 'Trailing action', h: '<span class="om-inputwrap" style="width:170px;display:block"><input class="om-input" type="password" value="omniful123" /><button class="adorn" aria-label="Show">' + I.eye + '</button></span>' },
            { n: 'Error + helper', h: '<span style="width:170px;display:block"><input class="om-input is-error" value="ravi@omniful" /><span class="om-assist is-error" style="margin-top:5px">' + I.warn + 'Enter a valid email</span></span>' }
          ]}
        ],
        spec: [['Height', '<code>40</code> px'], ['Radius', '<code>8</code> px'], ['Border', '<code>#D6D9DF</code> → primary on focus'], ['Focus ring', '<code>3px</code> primary-lighter'], ['Placeholder', '<code>#9BA0A8</code>']],
        guide: {
          do: { demo: '<span style="width:190px;display:block"><input class="om-input is-error" value="ravi@omniful" /><span class="om-assist is-error" style="margin-top:5px">' + I.warn + 'Enter a valid email</span></span>', tx: 'Explain the error below the field so people know how to fix it.' },
          dont: { demo: '<input class="om-input is-error" value="ravi@omniful" style="width:190px" />', tx: 'Don’t rely on a red border alone — colour can’t say what went wrong.' }
        }
      },
      {
        id: 'textarea', name: 'Textarea', desc: 'Multi-line text for notes, addresses and descriptions. Resizes vertically; shares the field’s focus and error styling.',
        why: 'Only vertical resize is allowed so a stretched textarea can’t break the form’s column width.',
        preview: '<div class="om-field" style="width:320px"><label>Delivery note <span class="opt">(optional)</span></label><textarea class="om-textarea" placeholder="e.g. Leave at reception, call on arrival">Gate code 4471. Ask for the store manager.</textarea></div>',
        lblStates: 'States', statesCols: 3,
        states: [
          { n: 'Default', h: '<textarea class="om-textarea" placeholder="Placeholder" style="width:180px;min-height:64px"></textarea>' },
          { n: 'Focus', h: '<textarea class="om-textarea is-focus" style="width:180px;min-height:64px">Typing a note…</textarea>' },
          { n: 'Disabled', h: '<textarea class="om-textarea" disabled style="width:180px;min-height:64px">Locked</textarea>' }
        ],
        spec: [['Min height', '<code>84</code> px'], ['Line height', '<code>21</code> px'], ['Resize', 'vertical only'], ['Padding', '<code>10 / 12</code> px']]
      },
      {
        id: 'number', name: 'Number stepper', desc: 'Quantity entry with decrement / increment controls. Digits are tabular so the value doesn’t shift as it changes.',
        why: 'For bounded counts (jars, cartons, cases) where tapping is faster than typing. The − button disables at the minimum instead of allowing invalid values.',
        preview: '<div class="om-stepnum" data-stepnum data-min="1" data-max="99"><button data-dec aria-label="Decrease">−</button><input value="4" inputmode="numeric" aria-label="Quantity" /><button data-inc aria-label="Increase">+</button></div>',
        lblStates: 'States', statesCols: 3,
        states: [
          { n: 'Default', h: '<div class="om-stepnum"><button>−</button><input value="4" readonly /><button>+</button></div>' },
          { n: 'At minimum', h: '<div class="om-stepnum"><button disabled>−</button><input value="1" readonly /><button>+</button></div>' },
          { n: 'Focus', h: '<div class="om-stepnum" style="border-color:var(--om-primary);box-shadow:0 0 0 3px var(--om-primary-lighter)"><button>−</button><input value="12" readonly /><button>+</button></div>' }
        ],
        spec: [['Height', '<code>40</code> px'], ['Button', '<code>38</code> px wide'], ['Value', 'tabular numerals, centered']]
      },
      {
        id: 'select', name: 'Select', desc: 'Choose one value from a list. Trigger mirrors the text field; the menu opens below with a 6px offset and a checkmark on the current value.',
        why: 'A custom menu (not native select) so option rows, groups and checkmarks match the rest of the system across every browser.',
        preview: '<div class="om-dd" data-dd><button class="om-dd__btn" type="button"><span class="ph">Select hub</span>' + I.chevD + '</button><div class="om-dd__menu"><div class="om-dd__opt" data-v="Riyadh Central">Riyadh Central' + tick + '</div><div class="om-dd__opt" data-v="Jeddah Port">Jeddah Port' + tick + '</div><div class="om-dd__opt" data-v="Dammam East">Dammam East' + tick + '</div></div></div>',
        lblStates: 'States', statesCols: 4,
        states: [
          { n: 'Default', h: '<button class="om-dd__btn" style="width:150px"><span class="ph">Select</span>' + I.chevD + '</button>' },
          { n: 'Hover', h: '<button class="om-dd__btn is-hover" style="width:150px"><span class="ph">Select</span>' + I.chevD + '</button>' },
          { n: 'Focus / open', h: '<button class="om-dd__btn is-focus" style="width:150px">Riyadh Central' + I.chevD + '</button>' },
          { n: 'Disabled', h: '<button class="om-dd__btn" disabled style="width:150px"><span class="ph">Select</span>' + I.chevD + '</button>' }
        ],
        spec: [['Trigger', 'matches text field — <code>40</code> px'], ['Menu offset', '<code>6</code> px'], ['Option height', '<code>~36</code> px'], ['Max height', '<code>260</code> px, scrolls']]
      },
      {
        id: 'multiselect', name: 'Multi-select', desc: 'Pick several values from grouped options. The menu stays open while selecting; the trigger shows a live count.',
        why: 'A count (“Order status (3)”) beats a truncated list of labels — it stays readable no matter how many are picked.',
        preview: '<div class="om-dd" data-dd-multi><button class="om-dd__btn" type="button"><span class="ph">Order status</span>' + I.chevD + '</button><div class="om-dd__menu"><div class="om-dd__group">Active</div><label class="om-dd__opt"><label class="om-check om-check--sm" style="pointer-events:none"><input type="checkbox" />' + box + '</label>New</label><label class="om-dd__opt"><label class="om-check om-check--sm" style="pointer-events:none"><input type="checkbox" />' + box + '</label>Picking</label><div class="om-dd__group">Closed</div><label class="om-dd__opt"><label class="om-check om-check--sm" style="pointer-events:none"><input type="checkbox" />' + box + '</label>Delivered</label><label class="om-dd__opt"><label class="om-check om-check--sm" style="pointer-events:none"><input type="checkbox" />' + box + '</label>Cancelled</label></div></div>',
        spec: [['Selection', 'checkbox per row, menu stays open'], ['Trigger label', 'live count'], ['Groups', 'uppercase group headers']]
      },
      {
        id: 'checkbox', name: 'Checkbox', desc: 'Turns an option on or off, or selects rows. Includes a true indeterminate state for select-all headers, plus a smaller variant for dense tables.',
        why: 'Indeterminate is a first-class state, not a hack — select-all in a table needs to say “some, not all”. The 14px variant exists so table rows don’t get crowded.',
        preview: '<label class="om-check"><input type="checkbox" checked />' + box + 'Email me order updates</label>',
        lblStates: 'States', statesCols: 6,
        states: [
          { n: 'Unchecked', h: '<label class="om-check"><input type="checkbox" />' + box + '</label>' },
          { n: 'Hover', h: '<label class="om-check is-hover"><input type="checkbox" />' + box + '</label>' },
          { n: 'Checked', h: '<label class="om-check is-checked"><input type="checkbox" checked />' + box + '</label>' },
          { n: 'Indeterminate', h: '<label class="om-check is-indeterminate"><input type="checkbox" />' + box + '</label>' },
          { n: 'Focus', h: '<label class="om-check is-focus is-checked"><input type="checkbox" checked />' + box + '</label>' },
          { n: 'Disabled', h: '<label class="om-check is-disabled is-checked"><input type="checkbox" checked disabled />' + box + '</label>' }
        ],
        extra: [{ lbl: 'Table size · 14px', cols: 3, states: [
          { n: 'Unchecked', h: '<label class="om-check om-check--sm"><input type="checkbox" />' + box + '</label>' },
          { n: 'Checked', h: '<label class="om-check om-check--sm is-checked"><input type="checkbox" checked />' + box + '</label>' },
          { n: 'Indeterminate', h: '<label class="om-check om-check--sm is-indeterminate"><input type="checkbox" />' + box + '</label>' }
        ]}],
        spec: [['Size', '<code>18</code> px form / <code>14</code> px table'], ['Radius', '<code>4</code> / <code>3</code> px'], ['States', 'unchecked · checked · indeterminate · disabled']],
        guide: {
          do: { demo: '<div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start"><label class="om-check"><input type="checkbox" checked />' + box + 'COD</label><label class="om-check"><input type="checkbox" />' + box + 'Prepaid</label></div>', tx: 'Use checkboxes when several options can be selected together.' },
          dont: { demo: '<div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start"><label class="om-check"><input type="checkbox" checked />' + box + 'Standard</label><label class="om-check"><input type="checkbox" />' + box + 'Express</label></div>', tx: 'Don’t use them for mutually exclusive choices — that’s a radio group.' }
        }
      },
      {
        id: 'radio', name: 'Radio', desc: 'Selects exactly one option from a small, visible set. When only one choice can win, radios beat a dropdown because every option stays in view.',
        why: 'Kept separate from checkbox on purpose — shape signals behaviour. Round means “pick one”, square means “pick any”.',
        preview: '<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start"><label class="om-radio"><input type="radio" name="ship" checked /><span class="dot"></span>Standard delivery</label><label class="om-radio"><input type="radio" name="ship" /><span class="dot"></span>Express</label></div>',
        lblStates: 'States', statesCols: 5,
        states: [
          { n: 'Unselected', h: '<label class="om-radio"><input type="radio" /><span class="dot"></span></label>' },
          { n: 'Hover', h: '<label class="om-radio is-hover"><input type="radio" /><span class="dot"></span></label>' },
          { n: 'Selected', h: '<label class="om-radio is-checked"><input type="radio" /><span class="dot"></span></label>' },
          { n: 'Focus', h: '<label class="om-radio is-focus is-checked"><input type="radio" /><span class="dot"></span></label>' },
          { n: 'Disabled', h: '<label class="om-radio is-disabled is-checked"><input type="radio" disabled /><span class="dot"></span></label>' }
        ],
        spec: [['Size', '<code>18</code> px'], ['Inner dot', '<code>9</code> px'], ['Use when', 'one choice, ≤5 options, all visible']]
      },
      {
        id: 'toggle', name: 'Toggle', desc: 'Flips a setting on or off, taking effect immediately. Used only for instant switches — never as a form field you submit later.',
        why: 'The rule keeps expectations honest: a toggle changes something now. If a choice needs a Save button, it’s a checkbox, not a toggle.',
        preview: '<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start"><label class="om-toggle"><input type="checkbox" checked /><span class="tk"></span>Email alerts</label><label class="om-toggle"><input type="checkbox" /><span class="tk"></span>Auto-assign orders</label></div>',
        lblStates: 'States', statesCols: 5,
        states: [
          { n: 'Off', h: '<label class="om-toggle"><input type="checkbox" /><span class="tk"></span></label>' },
          { n: 'On', h: '<label class="om-toggle is-checked"><input type="checkbox" checked /><span class="tk"></span></label>' },
          { n: 'Focus', h: '<label class="om-toggle is-focus is-checked"><input type="checkbox" checked /><span class="tk"></span></label>' },
          { n: 'Off · disabled', h: '<label class="om-toggle is-disabled"><input type="checkbox" disabled /><span class="tk"></span></label>' },
          { n: 'On · disabled', h: '<label class="om-toggle is-disabled is-checked"><input type="checkbox" checked disabled /><span class="tk"></span></label>' }
        ],
        spec: [['Track', '<code>36 × 20</code> px'], ['Knob', '<code>16</code> px'], ['Behaviour', 'applies instantly']],
        guide: {
          do: { demo: '<label class="om-toggle is-checked"><input type="checkbox" checked /><span class="tk"></span>Dark mode</label>', tx: 'Use for settings that take effect the moment they’re switched.' },
          dont: { demo: '<label class="om-toggle"><input type="checkbox" /><span class="tk"></span>Agree to terms</label>', tx: 'Don’t use a toggle inside a form that’s saved later — use a checkbox.' }
        }
      },
      {
        id: 'chip', name: 'Chip', desc: 'A compact, selectable token for filters and multi-value inputs. Selectable, and removable with an explicit ×.',
        why: 'Selected chips use a filled tint with a solid border so a row of active filters stays legible against unselected ones.',
        preview: '<div class="ds-preview__stage" style="padding:0;gap:8px" data-chiprow><button class="om-chip is-selected">Pending <span class="x">' + I.x + '</span></button><button class="om-chip is-selected">Riyadh Hub <span class="x">' + I.x + '</span></button><button class="om-chip">COD only</button><button class="om-chip">Express</button></div>',
        lblStates: 'States', statesCols: 4,
        states: [
          { n: 'Default', h: '<button class="om-chip">Filter</button>' },
          { n: 'Hover', h: '<button class="om-chip is-hover">Filter</button>' },
          { n: 'Selected', h: '<button class="om-chip is-selected">Filter <span class="x">' + I.x + '</span></button>' },
          { n: 'Disabled', h: '<button class="om-chip is-disabled">Filter</button>' }
        ],
        spec: [['Height', '<code>28</code> px'], ['Radius', 'full pill'], ['Remove', 'optional × on selected']]
      },
      {
        id: 'search', name: 'Search', desc: 'A filter-as-you-type field with its own resting colour so it reads as “search”, not “fill this in”.',
        why: 'The grey (#FAFAFB) rest state distinguishes search from form inputs at a glance; focus lifts it to white with the standard ring, and the clear × only shows once there’s a value.',
        preview: '<label class="om-search" data-search style="width:300px">' + I.search + '<input placeholder="Search orders, SKUs, AWBs…" /><button class="clr" aria-label="Clear">' + I.x + '</button></label>',
        lblStates: 'States', statesCols: 3,
        states: [
          { n: 'Empty', h: '<label class="om-search" style="width:170px">' + I.search + '<input placeholder="Search…" /></label>' },
          { n: 'Focus', h: '<label class="om-search is-focus" style="width:170px">' + I.search + '<input value="Riyadh" /></label>' },
          { n: 'With value', h: '<label class="om-search has-value" style="width:170px">' + I.search + '<input value="OM-4829" /><button class="clr" aria-label="Clear">' + I.x + '</button></label>' }
        ],
        spec: [['Height', '<code>36</code> px'], ['Rest bg', '<code>#FAFAFB</code> → white on focus'], ['Clear', 'appears when non-empty']]
      },
      {
        id: 'file-upload', name: 'File upload', desc: 'A drop-zone for importing sheets and attachments, with a filled-file row and progress once a file lands.',
        why: 'Both affordances in one place: drop a file or click to browse. After selection it becomes a compact row with type, size and upload progress.',
        preview: '<div style="display:flex;flex-direction:column;gap:14px;width:100%;max-width:440px"><div class="om-drop" data-drop><span class="om-drop__ic">' + I.upload + '</span><b>Drop your file here, or <span>browse</span></b><small>XLSX or CSV · up to 10 MB</small></div></div>',
        lblStates: 'File states',
        states: [
          { n: 'Uploading', h: '<div class="om-file" style="width:230px"><span class="om-file__ic">' + I.doc + '</span><span class="om-file__tx"><b>bisleri_route.xlsx</b><small>412 KB · uploading 64%…</small><span class="om-file__bar"><i style="width:64%"></i></span></span></div>' },
          { n: 'Uploaded', h: '<div class="om-file om-file--done" style="width:230px"><span class="om-file__ic om-file__ic--ok">' + I.check + '</span><span class="om-file__tx"><b>bisleri_route.xlsx</b><small>412 KB · 512 rows imported</small></span><button class="om-file__act" aria-label="Remove">' + I.x + '</button></div>' },
          { n: 'Failed', h: '<div class="om-file om-file--error" style="width:230px"><span class="om-file__ic om-file__ic--err">' + I.warn + '</span><span class="om-file__tx"><b>bisleri_route.xlsx</b><small style="color:var(--om-red)">Wrong format — needs XLSX</small></span><button class="om-file__retry">Retry</button></div>' },
          { n: 'Multiple', h: '<div style="display:flex;flex-direction:column;gap:8px;width:230px"><div class="om-file om-file--done"><span class="om-file__ic om-file__ic--ok">' + I.check + '</span><span class="om-file__tx"><b>riyadh.xlsx</b><small>512 rows</small></span><button class="om-file__act" aria-label="Remove">' + I.x + '</button></div><div class="om-file om-file--done"><span class="om-file__ic om-file__ic--ok">' + I.check + '</span><span class="om-file__tx"><b>jeddah.csv</b><small>288 rows</small></span><button class="om-file__act" aria-label="Remove">' + I.x + '</button></div></div>' }
        ],
        statesCols: 4,
        spec: [['Drop radius', '<code>10</code> px, dashed border'], ['Hover / drag', 'primary border + tint'], ['States', 'uploading · uploaded · failed · multiple']]
      },
      {
        id: 'date-picker', name: 'Date picker', desc: 'A calendar popover for choosing a date, with today marked and the selection filled in primary.',
        why: 'Fixed 7-column grid with muted overflow days so the current month is unmistakable; today gets a ring, the selection a solid fill — never both competing.',
        preview: '<div style="display:flex;gap:34px;flex-wrap:wrap;align-items:flex-start"><div><div class="ds-lbl" style="margin-top:0">Desktop</div><div data-cal></div></div><div><div class="ds-lbl" style="margin-top:0">Mobile</div><div class="om-cal-mob" data-cal="mobile"></div></div></div>',
        spec: [['Desktop', '<code>264</code> px popover'], ['Mobile', '<code>300</code> px, 40px tap targets + actions'], ['Today', 'primary-light ring'], ['Selected', 'solid primary fill']]
      },
      {
        id: 'otp-input', name: 'OTP / code input', desc: 'Segmented single-character boxes for confirmation codes — one OTP verifies a whole delivery stop.',
        why: 'One box per digit makes length obvious and errors local; the filled tint confirms progress, and an invalid code turns the whole set red rather than a vague message.',
        preview: '<div class="om-otp"><input class="om-otp__d is-filled" value="4" maxlength="1" /><input class="om-otp__d is-filled" value="8" maxlength="1" /><input class="om-otp__d is-filled" value="2" maxlength="1" /><input class="om-otp__d is-focus" value="" maxlength="1" placeholder="0" /><input class="om-otp__d" value="" maxlength="1" placeholder="0" /><input class="om-otp__d" value="" maxlength="1" placeholder="0" /></div>',
        lblStates: 'States', statesCols: 5,
        states: [
          { n: 'Empty', h: '<span class="om-otp om-otp--sm"><input class="om-otp__d" placeholder="0" /><input class="om-otp__d" placeholder="0" /><input class="om-otp__d" placeholder="0" /></span>' },
          { n: 'Typing', h: '<span class="om-otp om-otp--sm"><input class="om-otp__d is-filled" value="4" /><input class="om-otp__d is-focus" value="" placeholder="0" /><input class="om-otp__d" placeholder="0" /></span>' },
          { n: 'Filled', h: '<span class="om-otp om-otp--sm"><input class="om-otp__d is-filled" value="4" /><input class="om-otp__d is-filled" value="8" /><input class="om-otp__d is-filled" value="2" /></span>' },
          { n: 'Error', h: '<span class="om-otp om-otp--sm is-error"><input class="om-otp__d is-error" value="4" /><input class="om-otp__d is-error" value="8" /><input class="om-otp__d is-error" value="1" /></span>' },
          { n: 'Disabled', h: '<span class="om-otp om-otp--sm"><input class="om-otp__d" value="4" disabled /><input class="om-otp__d" value="8" disabled /><input class="om-otp__d" value="2" disabled /></span>' }
        ],
        spec: [['Box', '<code>46\u00d756</code> px (sm <code>38\u00d746</code>)'], ['Filled', 'primary-lighter tint'], ['Error', 'whole set turns red'], ['Use for', 'delivery OTP, 2FA codes']]
      },
      {
        id: 'amount-field', name: 'Amount field', desc: 'A currency-prefixed money input with tabular, right-aligned figures for cash-on-delivery and payment totals.',
        why: 'The currency sits in a fixed prefix so it never scrolls away; tabular numerals keep decimals aligned when amounts stack in a list.',
        preview: '<span class="om-amount"><span class="om-amount__cur">SAR</span><input class="om-amount__in" value="248.00" /></span>',
        lblStates: 'States', statesCols: 4,
        states: [
          { n: 'Default', h: '<span class="om-amount" style="width:150px"><span class="om-amount__cur">SAR</span><input class="om-amount__in" placeholder="0.00" /></span>' },
          { n: 'Focus', h: '<span class="om-amount is-focus" style="width:150px"><span class="om-amount__cur">SAR</span><input class="om-amount__in" value="248.00" /></span>' },
          { n: 'Error', h: '<span class="om-amount is-error" style="width:150px"><span class="om-amount__cur">SAR</span><input class="om-amount__in" value="0.00" /></span>' },
          { n: 'Disabled', h: '<span class="om-amount is-disabled" style="width:150px"><span class="om-amount__cur">SAR</span><input class="om-amount__in" value="248.00" disabled /></span>' }
        ],
        spec: [['Height', '<code>48</code> px'], ['Prefix', 'currency on bg2, fixed'], ['Figures', 'tabular, right-aligned'], ['Use for', 'COD, totals, refunds']]
      },
      {
        id: 'radio-card', name: 'Payment-method card', desc: 'A large, tappable radio card for choosing one option from a short set — payment methods, delivery types.',
        why: 'The whole card is the target (not a tiny radio), so it works on a phone; selection fills primary-lighter with a ringed border and a checked tick, unmistakable at a glance.',
        preview: '<div style="display:flex;flex-direction:column;gap:12px"><button class="om-radiocard is-selected"><span class="om-radiocard__ic"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.7"/></svg></span><span class="om-radiocard__tx"><b>Card on delivery</b><span>Pay by card at the door</span></span><span class="om-radiocard__tick"><svg viewBox="0 0 16 16" fill="none"><path d="m3 8.5 3.2 3L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button><button class="om-radiocard"><span class="om-radiocard__ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10H4zM4 11h16" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><span class="om-radiocard__tx"><b>Cash</b><span>Collect cash on delivery</span></span><span class="om-radiocard__tick"><svg viewBox="0 0 16 16" fill="none"><path d="m3 8.5 3.2 3L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button></div>',
        lblStates: 'States', statesCols: 4,
        states: [
          { n: 'Default', h: '<button class="om-radiocard" style="width:210px"><span class="om-radiocard__ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10H4zM4 11h16" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><span class="om-radiocard__tx"><b>Cash</b><span>On delivery</span></span><span class="om-radiocard__tick"><svg viewBox="0 0 16 16" fill="none"><path d="m3 8.5 3.2 3L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>' },
          { n: 'Hover', h: '<button class="om-radiocard is-hover" style="width:210px"><span class="om-radiocard__ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10H4zM4 11h16" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><span class="om-radiocard__tx"><b>Cash</b><span>On delivery</span></span><span class="om-radiocard__tick"><svg viewBox="0 0 16 16" fill="none"><path d="m3 8.5 3.2 3L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>' },
          { n: 'Selected', h: '<button class="om-radiocard is-selected" style="width:210px"><span class="om-radiocard__ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10H4zM4 11h16" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><span class="om-radiocard__tx"><b>Cash</b><span>On delivery</span></span><span class="om-radiocard__tick"><svg viewBox="0 0 16 16" fill="none"><path d="m3 8.5 3.2 3L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>' },
          { n: 'Disabled', h: '<button class="om-radiocard is-disabled" style="width:210px"><span class="om-radiocard__ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16v10H4zM4 11h16" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><span class="om-radiocard__tx"><b>Wallet</b><span>Unavailable</span></span><span class="om-radiocard__tick"></span></button>' }
        ],
        spec: [['Target', 'whole card, min 44px tall'], ['Selected', 'primary ring + tint + tick'], ['Group', 'one selection at a time'], ['Use for', 'payment method, delivery type']]
      },
      {
        id: 'map-card', name: 'Map card', desc: 'A route preview with a drawn path and start/end pins, plus a summary bar — used on dispatch and delivery screens.',
        why: 'Shows the shape of the route at a glance before the driver commits; skeleton while the route computes, and an explicit empty state instead of a blank grey box.',
        preview: '<div class="om-mapcard"><div class="om-mapcard__canvas"><svg class="om-mapcard__route" viewBox="0 0 320 180" preserveAspectRatio="none"><path d="M40 150 C 90 120, 90 70, 150 70 S 240 90, 280 40" /></svg><span class="om-mapcard__pin om-mapcard__pin--start" style="left:40px;top:150px"></span><span class="om-mapcard__pin" style="left:150px;top:70px"></span><span class="om-mapcard__pin om-mapcard__pin--end" style="left:280px;top:40px"></span></div><div class="om-mapcard__bar"><b>12 stops</b><span>\u00b7 18.4 km</span><span class="push">~2h 10m</span></div></div>',
        lblStates: 'States', statesCols: 3,
        states: [
          { n: 'Loaded', h: '<div class="om-mapcard" style="width:230px"><div class="om-mapcard__canvas" style="height:120px"><svg class="om-mapcard__route" viewBox="0 0 230 120" preserveAspectRatio="none"><path d="M30 100 C 70 80, 70 40, 120 45 S 190 60, 200 25" /></svg><span class="om-mapcard__pin om-mapcard__pin--start" style="left:30px;top:100px"></span><span class="om-mapcard__pin om-mapcard__pin--end" style="left:200px;top:25px"></span></div><div class="om-mapcard__bar"><b>12 stops</b><span class="push">18.4 km</span></div></div>' },
          { n: 'Loading', h: '<div class="om-mapcard om-mapcard--loading" style="width:230px"><div class="om-mapcard__canvas" style="height:120px"><span class="om-mapcard__skel"></span></div><div class="om-mapcard__bar"><span>Building route\u2026</span></div></div>' },
          { n: 'Empty', h: '<div class="om-mapcard om-mapcard--empty" style="width:230px"><div class="om-mapcard__canvas" style="height:120px"><span class="om-mapcard__empty"><svg viewBox="0 0 24 24" fill="none"><path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.6"/></svg>No stops to map yet</span></div><div class="om-mapcard__bar"><span>Add stops to preview the route</span></div></div>' }
        ],
        spec: [['Canvas', '180px, grid backdrop'], ['Pins', 'green start \u00b7 red end \u00b7 primary waypoints'], ['States', 'loaded \u00b7 loading \u00b7 empty'], ['Use for', 'dispatch, route detail']]
      }
    ]
  });
})();

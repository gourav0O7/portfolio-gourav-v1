
/* Omniful DS catalog — Navigation, Feedback, Data display. Pushes onto window.OM_CATALOG. */
(function () {
  window.OM_CATALOG = window.OM_CATALOG || [];
  var I = window.OM_I;
  var chevR = '<svg viewBox="0 0 16 16" fill="none"><path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var chevL = '<svg viewBox="0 0 16 16" fill="none"><path d="m10 4-4 4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ok = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="m5.2 8.3 1.9 1.9 3.7-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var info = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.4v3.4M8 5.1v.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var warn = '<svg viewBox="0 0 16 16" fill="none"><path d="M8 2 14.5 13.5h-13L8 2Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 6.8v2.8M8 11.5v.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var err = '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="m5.5 5.5 5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  var x = I.x, chk = I.check;

  /* ---------------- NAVIGATION ---------------- */
  window.OM_CATALOG.push({
    id: 'navigation', group: 'Navigation', title: 'Navigation',
    eyebrow: 'Components', intro: 'How people move through the product and track where they are. Counts and states turn navigation into information, not just links.',
    components: [
      {
        id: 'tabs', name: 'Tabs', desc: 'Switches between related views within one page. Count pills preview what’s inside each tab before it’s opened.',
        why: 'Underline tabs with counts — an operator sees “Pending 24” and decides where to go without clicking. The active tab is the only coloured one.',
        preview: '<div class="om-tabs" data-tabs style="width:100%"><button class="is-on">All orders <span class="n">148</span></button><button>Pending <span class="n">24</span></button><button>Packed <span class="n">61</span></button><button>Dispatched <span class="n">63</span></button></div>',
        lblStates: 'States', statesCols: 3,
        states: [
          { n: 'Active', h: '<div class="om-tabs"><button class="is-on">Orders</button></div>' },
          { n: 'Default', h: '<div class="om-tabs"><button>Orders</button></div>' },
          { n: 'With count', h: '<div class="om-tabs"><button class="is-on">Pending <span class="n">24</span></button></div>' }
        ],
        spec: [['Indicator', '<code>2px</code> primary underline'], ['Count pill', 'canvas grey → primary when active']]
      },
      {
        id: 'breadcrumb', name: 'Breadcrumb', desc: 'Shows the path to the current page and lets people jump back up the hierarchy.',
        why: 'Ops products go deep (Hub → Inventory → SKU → Batch). Breadcrumbs keep that depth navigable without a back-button guessing game.',
        preview: '<nav class="om-crumb"><a href="#navigation">Inventory</a><span class="sep">' + chevR + '</span><a href="#navigation">Riyadh Central</a><span class="sep">' + chevR + '</span><b>SKU BIS-1L-24</b></nav>',
        spec: [['Separator', 'chevron, <code>#D6D9DF</code>'], ['Current', 'bold, non-link'], ['Truncation', 'collapse middle on overflow']]
      },
      {
        id: 'vnav', name: 'Vertical navigation', desc: 'The product’s primary sidebar. Domain icons, one active item, attention badges, and expandable sub-menus for depth.',
        why: 'With 15+ modules the left nav is the map. Two tiers: a primary rail of modules, and a secondary panel showing that module’s sections (menu headings, which may nest sub-headings). One selected item per tier; an orange dot marks a module (and the nested item) with something pending.',
        preview: '<nav class="om-appnav om-appnav--full" data-appnav><div class="om-appnav__rail"><span class="om-appnav__brand">O</span><button class="om-appnav__railitem"><span class="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4 11l8-6 8 6M6 10v9h12v-9" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span>Home</button><button class="om-appnav__railitem"><span class="dot dot--orange"></span><span class="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7l8 4 8-4" stroke="currentColor" stroke-width="1.6"/></svg></span>Orders</button><button class="om-appnav__railitem"><span class="ic"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>Inventory</button><button class="om-appnav__railitem"><span class="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4 8h16l-1.5 10.5a2 2 0 0 1-2 1.5H7.5a2 2 0 0 1-2-1.5L4 8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 8V6a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="1.6"/></svg></span>Purchase</button><button class="om-appnav__railitem"><span class="ic"><svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.4" stroke="currentColor" stroke-width="1.6"/></svg></span>Catalog</button><button class="om-appnav__railitem is-on"><span class="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7l8 4 8-4" stroke="currentColor" stroke-width="1.6"/></svg></span>All Hubs</button><button class="om-appnav__railitem"><span class="ic"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>Settings</button></div><div class="om-appnav__panel"><div class="om-appnav__title">All Hubs</div><button class="om-appnav__row" data-exp><span class="ic"><svg viewBox="0 0 20 20" fill="none"><rect x="4" y="4" width="12" height="12" rx="3" stroke="currentColor" stroke-width="1.6"/></svg></span>Sorting Hub<span class="chev"><svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button><button class="om-appnav__row"><span class="ic"><svg viewBox="0 0 20 20" fill="none"><path d="M10 3 3 6.5v7L10 17l7-3.5v-7L10 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></span>Delivery Zones</button><button class="om-appnav__row is-expanded" data-exp data-sub="fleetSub"><span class="ic"><svg viewBox="0 0 20 20" fill="none"><path d="M2 6h9v7H2zM11 8h4l3 3v2h-7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="6" cy="15" r="1.4" stroke="currentColor" stroke-width="1.4"/><circle cx="14" cy="15" r="1.4" stroke="currentColor" stroke-width="1.4"/></svg></span>Fleet Management<span class="chev"><svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button><div class="om-appnav__sub" id="fleetSub"><a href="#vnav">Fleets</a><a href="#vnav" class="is-on">Vehicles</a><a href="#vnav">Drivers</a></div><button class="om-appnav__row"><span class="ic"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>Reminders</button><button class="om-appnav__row" data-exp><span class="ic"><svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M4 16a6 6 0 0 1 12 0" stroke="currentColor" stroke-width="1.5"/></svg></span>Client Management<span class="chev"><svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button><button class="om-appnav__row" data-exp><span class="ic"><svg viewBox="0 0 20 20" fill="none"><path d="M4 4h6l6 6-6 6-6-6V4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="7.5" cy="7.5" r="1" fill="currentColor"/></svg></span>Tags Management<span class="chev"><svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button><button class="om-appnav__row"><span class="ic"><svg viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" stroke-width="1.5"/></svg></span>Change Password</button><button class="om-appnav__row"><span class="ic"><svg viewBox="0 0 20 20" fill="none"><path d="M3 5h14v10H3zM3 8h14" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></span>Sales Channel</button><button class="om-appnav__row"><span class="ic"><svg viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4v12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></span>Zones — no nested sections</button></div></nav>',
        guide: null,
        lblStates: 'Rail item states',
        states: [
          { n: 'Default', h: '<button class="om-appnav__railitem" style="pointer-events:none"><span class="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7l8 4 8-4" stroke="currentColor" stroke-width="1.6"/></svg></span>Shipments</button>' },
          { n: 'Hover', h: '<button class="om-appnav__railitem" style="pointer-events:none;color:var(--om-ink)"><span class="ic" style="background:var(--om-bg2)"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7l8 4 8-4" stroke="currentColor" stroke-width="1.6"/></svg></span>Shipments</button>' },
          { n: 'Active', h: '<button class="om-appnav__railitem is-on" style="pointer-events:none"><span class="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7l8 4 8-4" stroke="currentColor" stroke-width="1.6"/></svg></span>Shipments</button>' }
        ],
        extra: [{ lbl: 'Panel row states', states: [
          { n: 'Default', h: '<div style="width:210px;pointer-events:none"><button class="om-appnav__row"><span class="ic"><svg viewBox="0 0 20 20" fill="none"><path d="M10 3 3 6.5v7L10 17l7-3.5v-7L10 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></span>Delivery Zones</button></div>' },
          { n: 'Expanded', h: '<div style="width:210px;pointer-events:none"><button class="om-appnav__row is-expanded"><span class="ic"><svg viewBox="0 0 20 20" fill="none"><path d="M2 6h9v7H2zM11 8h4l3 3v2h-7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></span>Fleet<span class="chev"><svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button></div>' },
          { n: 'Sub-item active', h: '<div class="om-appnav__sub" style="width:210px;pointer-events:none;margin:0"><a class="is-on">Vehicles</a></div>' }
        ]}, { lbl: 'Attention states', states: [
          { n: 'Primary — pending', h: '<button class="om-appnav__railitem" style="pointer-events:none"><span class="dot dot--orange"></span><span class="ic"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7l8 4 8-4" stroke="currentColor" stroke-width="1.6"/></svg></span>Shipments</button>' },
          { n: 'Secondary — pending', h: '<div style="width:210px;pointer-events:none"><button class="om-appnav__row"><span class="ic"><svg viewBox="0 0 20 20" fill="none"><path d="M2 6h9v7H2zM11 8h4l3 3v2h-7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></span>Vehicles<span class="dot dot--orange"></span></button></div>' }
        ]}],
        spec: [['Rail', 'icon + label, active = filled tile'], ['Panel', 'expandable groups, chevron rotates'], ['Active item', 'full-width primary fill'], ['Expanded parent', 'left accent bar + bold']]
      },
      {
        id: 'stepper', name: 'Stepper', desc: 'Tracks progress through a multi-step task. Completed steps become ticks so remaining work is always visible.',
        why: 'Three states — done, current, upcoming — with a ring on the current step. Click a step to jump.',
        preview: '<div class="om-stepper" data-stepper data-current="1"></div>',
        lblStates: 'States', statesCols: 3,
        states: [
          { n: 'Done', h: '<span class="om-step is-done"><span class="c">' + chk + '</span>Details</span>' },
          { n: 'Current', h: '<span class="om-step is-on"><span class="c">2</span>Items</span>' },
          { n: 'Upcoming', h: '<span class="om-step"><span class="c">3</span>Review</span>' }
        ],
        spec: [['Node', '<code>24</code> px circle'], ['Current', 'primary fill + 4px ring'], ['Done', 'tick on primary-lighter']]
      },
      {
        id: 'pagination', name: 'Pagination', desc: 'Moves through pages of table data. Numbered pages with an ellipsis gap and edge prev/next controls.',
        why: '32px hit targets — small enough for a table footer, big enough to tap. The current page is the only solid one.',
        preview: '<div class="om-pager" data-pager data-page="3" data-total="12"></div>',
        spec: [['Button', '<code>32</code> px'], ['Current', 'solid primary'], ['Gap', 'ellipsis past 7 pages'], ['Jump', 'go-to-page input at the end']]
      },
      {
        id: 'side-sheet', name: 'Side sheet', desc: 'Opens a detail panel beside the list instead of over it, so the row you came from stays in view.',
        why: 'A 320px right panel with a blanket. Detail views don’t need a full page — and keeping the table half-visible means you never lose your place.',
        preview: '<div class="ds-stagebox" data-sheetdemo><button class="om-btn om-btn--compact" data-open>Open side sheet</button><div class="ds-blanket" data-blanket></div><aside class="ds-sheet" data-sheet><div class="ds-sheet__head"><b>Order OM-48291</b><button class="om-xbtn" data-close aria-label="Close">' + x + '</button></div><div class="ds-sheet__body">Customer, items, payment and shipment details live here — the list behind stays visible.</div><div class="ds-sheet__foot"><button class="om-btn om-btn--line om-btn--compact">Print label</button><button class="om-btn om-btn--compact">Mark packed</button></div></aside></div>',
        spec: [['Width', '<code>320</code> px'], ['Motion', 'slide-in <code>.28s</code>'], ['Blanket', 'rgba(26,28,33,.4)'], ['Regions', 'header · scroll body · sticky footer']]
      }
    ]
  });

  /* ---------------- FEEDBACK ---------------- */
  window.OM_CATALOG.push({
    id: 'feedback', group: 'Feedback', title: 'Feedback & status',
    eyebrow: 'Components', intro: 'How the system talks back. Transient confirmations are toasts, persistent context is a banner, blocking decisions are a modal — one job each.',
    components: [
      {
        id: 'toast', name: 'Toast', desc: 'A brief, self-dismissing confirmation of an action. Dark on light for maximum contrast; success and error differ only by icon colour.',
        why: 'The shape your eye learns stays constant, so meaning comes from the icon, not a re-learned layout each time.',
        preview: '<div style="display:flex;flex-direction:column;gap:12px;align-items:flex-start;width:100%"><div style="display:flex;gap:10px"><button class="om-btn om-btn--compact" data-toast="success">Show success</button><button class="om-btn om-btn--line om-btn--compact" data-toast="error">Show error</button></div><div class="om-toastlane" data-toastlane></div></div>',
        lblStates: 'Variants', statesCols: 2,
        states: [
          { n: 'Success', h: '<div class="om-toast om-toast--success">' + ok + 'Wave released — 36 orders</div>' },
          { n: 'Error', h: '<div class="om-toast om-toast--error">' + err + '2 SKUs have no bin</div>' }
        ],
        spec: [['Background', 'ink <code>#1A1C21</code>'], ['Auto-dismiss', '<code>4s</code>'], ['Position', 'bottom-left stack']]
      },
      {
        id: 'banner', name: 'Banner', desc: 'Persistent, page-level context in one of four intents. Stays until the situation changes or the user dismisses it.',
        why: 'Uses the accent-bg tints, not solid fills, so a banner informs without shouting over the content beneath it.',
        preview: '<div style="display:flex;flex-direction:column;gap:12px;width:100%"><div class="om-banner om-banner--info"><span class="om-banner__ic">' + info + '</span><span><b>Scheduled maintenance</b> — order sync pauses tonight 02:00–02:30 AST.</span><button class="om-banner__x" aria-label="Dismiss">' + x + '</button></div><div class="om-banner om-banner--success"><span class="om-banner__ic">' + ok + '</span><span><b>Import complete</b> — 1,204 SKUs added to Riyadh Central.</span></div></div>',
        lblStates: 'Intents', statesCols: 4,
        states: [
          { n: 'Info', h: '<div class="om-banner om-banner--info" style="max-width:none"><span class="om-banner__ic">' + info + '</span><span>Heads up</span></div>' },
          { n: 'Success', h: '<div class="om-banner om-banner--success" style="max-width:none"><span class="om-banner__ic">' + ok + '</span><span>All done</span></div>' },
          { n: 'Warning', h: '<div class="om-banner om-banner--warning" style="max-width:none"><span class="om-banner__ic">' + warn + '</span><span>Low stock</span></div>' },
          { n: 'Error', h: '<div class="om-banner om-banner--error" style="max-width:none"><span class="om-banner__ic">' + err + '</span><span>Sync failed</span></div>' }
        ],
        spec: [['Intents', 'info · success · warning · error'], ['Dismiss', 'optional ×'], ['Scope', 'page or section level']]
      },
      {
        id: 'note', name: 'Inline note', desc: 'A quiet aside for guidance inside a form or section. Left border, tinted background, no competing icon.',
        why: 'Lower-emphasis than a banner — for tips and context that help but shouldn’t alarm.',
        preview: '<div class="om-note"><b>Note:</b> serial-tracked SKUs need a scan at both inbound and packing. Change this later in SKU Configurations.</div>',
        spec: [['Border', '<code>3px</code> primary left rule'], ['Use for', 'inline tips, not alerts']]
      },
      {
        id: 'tooltip', name: 'Tooltip', desc: 'A tiny label revealed on hover or focus, for clarifying an icon or truncated value.',
        why: 'Supplementary only — never the sole home of information a user needs, since touch and keyboard users may not surface it.',
        preview: '<div class="ds-preview__stage" style="padding:44px 30px;gap:24px"><span class="om-tip om-tip--top" data-tip><button class="om-btn om-btn--line om-btn--compact">Top</button><span class="om-tip__bubble">Synced 2 min ago</span></span><span class="om-tip om-tip--bottom" data-tip><button class="om-btn om-btn--line om-btn--compact">Bottom</button><span class="om-tip__bubble">Synced 2 min ago</span></span><span class="om-tip om-tip--left" data-tip><button class="om-btn om-btn--line om-btn--compact">Left</button><span class="om-tip__bubble">Synced 2 min ago</span></span><span class="om-tip om-tip--right" data-tip><button class="om-btn om-btn--line om-btn--compact">Right</button><span class="om-tip__bubble">Synced 2 min ago</span></span></div>',
        spec: [['Directions', 'top · bottom · left · right'], ['Background', 'ink, white text'], ['Arrow', 'centred, 5px'], ['Trigger', 'hover + focus']]
      },
      {
        id: 'progress', name: 'Progress & skeleton', desc: 'Determinate progress bars for known-length tasks, and skeleton placeholders for content that’s still loading.',
        why: 'A bar when we know how far along we are (uploads, imports); a skeleton when we don’t, so the layout doesn’t jump when data arrives.',
        preview: '<div style="display:flex;flex-direction:column;gap:20px;width:100%;max-width:420px"><div class="om-progress"><i style="width:62%"></i></div><div style="display:flex;gap:12px;align-items:center"><div class="om-skel" style="width:40px;height:40px;border-radius:50%"></div><div style="flex:1;display:flex;flex-direction:column;gap:8px"><div class="om-skel" style="width:60%;height:12px"></div><div class="om-skel" style="width:40%;height:10px"></div></div></div></div>',
        spec: [['Bar height', '<code>8</code> px'], ['Skeleton', 'shimmer 1.4s'], ['Use', 'determinate = bar · unknown = skeleton']]
      },
      {
        id: 'empty-state', name: 'Empty state', desc: 'Fills a zero-data view with an icon, a plain explanation and the one action that resolves it.',
        why: 'An empty table is a dead end; an empty state turns it into a next step. Always offers the action that creates the missing data.',
        preview: '<div class="om-empty"><span class="om-empty__ic"><svg viewBox="0 0 24 24" fill="none"><path d="M4 8l8-4 8 4-8 4-8-4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 8v8l8 4 8-4V8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></span><b>No routes yet</b><p>Plan your first route and it’ll show up here with live progress.</p><button class="om-btn om-btn--compact">' + I.plus + 'Plan a route</button></div>',
        spec: [['Icon tile', '<code>56</code> px, primary-lighter'], ['Contains', 'icon · title · reason · action']]
      },
      {
        id: 'modal', name: 'Modal', desc: 'Interrupts the flow for a decision that must be made now — destructive confirms and required input.',
        why: 'Reserved for blocking moments. The grey footer separates actions from content and puts the primary action where the eye lands.',
        preview: '<div class="ds-stagebox" data-modaldemo><button class="om-btn om-btn--compact" data-open>Open confirm modal</button><div class="ds-blanket" data-blanket></div><div class="ds-modalwrap" data-modal><div class="om-modal"><div class="om-modal__head"><b>Cancel 3 orders?</b><button class="om-xbtn" data-close aria-label="Close">' + x + '</button></div><div class="om-modal__body">The customer will be notified and reserved inventory returns to available stock. This can’t be undone.</div><div class="om-modal__foot"><button class="om-btn om-btn--line om-btn--compact" data-close>Keep orders</button><button class="om-btn om-btn--danger om-btn--compact" data-close>Cancel orders</button></div></div></div></div>',
        extra: [{ lbl: 'Scenarios — destructive · form · success · error', states: [
          { n: 'Destructive confirm', h: '<div class="om-modal" style="width:300px;position:static;box-shadow:var(--om-shadow-card)"><div class="om-modal__head"><b>Cancel 3 orders?</b></div><div class="om-modal__body" style="font-size:13px">Reserved inventory returns to stock. This can’t be undone.</div><div class="om-modal__foot"><button class="om-btn om-btn--line om-btn--compact">Keep</button><button class="om-btn om-btn--danger om-btn--compact">Cancel orders</button></div></div>' },
          { n: 'Form input', h: '<div class="om-modal" style="width:300px;position:static;box-shadow:var(--om-shadow-card)"><div class="om-modal__head"><b>Add a note</b></div><div class="om-modal__body"><div class="om-field" style="width:100%"><label>Delivery note</label><textarea class="om-textarea" style="min-height:56px" placeholder="e.g. Leave at reception…"></textarea></div></div><div class="om-modal__foot"><button class="om-btn om-btn--line om-btn--compact">Cancel</button><button class="om-btn om-btn--compact">Save</button></div></div>' },
          { n: 'Success', h: '<div class="om-modal" style="width:284px;position:static;box-shadow:var(--om-shadow-card)"><div class="om-modal__body" style="text-align:center;padding-top:24px"><span style="width:48px;height:48px;border-radius:50%;background:var(--om-green-bg);color:var(--om-green);display:grid;place-items:center;margin:0 auto 12px">' + ok + '</span><b style="display:block;font-size:15px;color:var(--om-ink)">Route dispatched</b><p style="margin-top:6px;font-size:13px">All 24 stops sent to the driver.</p></div><div class="om-modal__foot" style="justify-content:center"><button class="om-btn om-btn--compact">Done</button></div></div>' },
          { n: 'Error', h: '<div class="om-modal" style="width:300px;position:static;box-shadow:var(--om-shadow-card)"><div class="om-modal__body" style="text-align:center;padding-top:24px"><span style="width:48px;height:48px;border-radius:50%;background:var(--om-red-bg);color:var(--om-red);display:grid;place-items:center;margin:0 auto 12px">' + x + '</span><b style="display:block;font-size:15px;color:var(--om-ink)">Couldn’t dispatch</b><p style="margin-top:6px;font-size:13px">2 stops have no address. Fix them and retry.</p></div><div class="om-modal__foot" style="justify-content:center"><button class="om-btn om-btn--line om-btn--compact">Dismiss</button><button class="om-btn om-btn--compact">Fix stops</button></div></div>' }
        ]}],
        spec: [['Width', '<code>420</code> px (confirm)'], ['Footer', 'grey, right-aligned actions'], ['Scenarios', 'destructive · form · success · error'], ['Use for', 'blocking decisions only']],
        guide: {
          do: { demo: '<div class="om-banner om-banner--info" style="max-width:none"><span class="om-banner__ic">' + info + '</span><span>Saved to drafts</span></div>', tx: 'Use a toast or banner for routine confirmations that don’t block.' },
          dont: { demo: '<div class="om-modal" style="width:200px;box-shadow:var(--om-shadow-card)"><div class="om-modal__body" style="padding:14px">Saved!</div></div>', tx: 'Don’t trap a simple “saved” message in a modal the user must dismiss.' }
        }
      }
    ]
  });

  /* ---------------- DATA DISPLAY ---------------- */
  var trow = function (id, cust, hub, tag, amt, sel) {
    return '<tr' + (sel ? ' class="is-sel"' : '') + '><td><label class="om-check om-check--sm' + (sel ? ' is-checked' : '') + '"><input type="checkbox"' + (sel ? ' checked' : '') + ' class="tblRow" /><span class="box">' + chk + '</span></label></td><td class="mono">' + id + '</td><td>' + cust + '</td><td>' + hub + '</td><td>' + tag + '</td><td class="mono num">' + amt + '</td></tr>';
  };
  window.OM_CATALOG.push({
    id: 'data', group: 'Data display', title: 'Data display',
    eyebrow: 'Components', intro: 'The surfaces that carry the actual work — tables, status, identity and grouping. Built for density first, decoration never.',
    components: [
      {
        id: 'table', name: 'Table', desc: 'The workhorse of every ops screen. Sticky header, select-all with indeterminate state, hover and selected rows, and horizontal scroll when columns overflow.',
        why: 'Rows are 48px, headers 44px and sticky; the whole grid scrolls horizontally inside its own frame so a wide table never breaks the page layout.',
        preview: '<div class="om-tablewrap" data-table><table class="om-table"><thead><tr><th style="width:40px"><label class="om-check om-check--sm"><input type="checkbox" data-all /><span class="box">' + chk + '</span></label></th><th>Order</th><th>Customer</th><th>Hub</th><th>Status</th><th class="num">Amount</th></tr></thead><tbody>' +
          trow('OM-48291', 'Aisha Al-Farsi', 'Riyadh Central', '<span class="om-tag om-tag--green"><span class="dot"></span>Delivered</span>', 'SAR 412.00', true) +
          trow('OM-48292', 'Omar Haddad', 'Jeddah Port', '<span class="om-tag om-tag--orange"><span class="dot"></span>Picking</span>', 'SAR 1,280.50') +
          trow('OM-48293', 'Fatima Noor', 'Dammam East', '<span class="om-tag om-tag--red"><span class="dot"></span>Failed</span>', 'SAR 96.00') +
          trow('OM-48294', 'Yusuf Karim', 'Dubai South', '<span class="om-tag om-tag--cyan"><span class="dot"></span>In transit</span>', 'SAR 745.25') +
          '</tbody></table></div>',
        spec: [['Header', '<code>44</code> px, sticky, uppercase'], ['Row', '<code>48</code> px'], ['Overflow', 'horizontal scroll in frame'], ['Select-all', 'indeterminate when partial'], ['Numbers', 'right-aligned, tabular']]
      },
      {
        id: 'tags', name: 'Status tags', desc: 'Communicates the state of a record. Pill shape with a leading dot, in one of eight reserved status hues.',
        why: 'The dot is the signal: “this is a state”. It appears on tags and nowhere else, so status is instantly separable from category or count.',
        preview: '<div class="ds-preview__stage" style="padding:0;gap:8px"><span class="om-tag om-tag--green"><span class="dot"></span>Active</span><span class="om-tag om-tag--orange"><span class="dot"></span>Pending</span><span class="om-tag om-tag--red"><span class="dot"></span>Failed</span><span class="om-tag om-tag--cyan"><span class="dot"></span>In transit</span><span class="om-tag om-tag--purple"><span class="dot"></span>On hold</span><span class="om-tag om-tag--brown"><span class="dot"></span>Archived</span><span class="om-tag om-tag--blue"><span class="dot"></span>New</span><span class="om-tag om-tag--grey"><span class="dot"></span>Draft</span></div>',
        spec: [['Height', '<code>22</code> px'], ['Radius', '<code>10</code> px'], ['Marker', 'leading dot'], ['Hues', '8 reserved status colours']],
        guide: {
          do: { demo: '<span class="om-tag om-tag--green"><span class="dot"></span>Delivered</span>', tx: 'Use tags for record status, with a colour that matches meaning.' },
          dont: { demo: '<span class="om-tag om-tag--purple"><span class="dot"></span>Delivered</span>', tx: 'Don’t pick status colours at random — green means good, red means failed, everywhere.' }
        }
      },
      {
        id: 'badges', name: 'Badges', desc: 'A compact counter or notification marker — unread counts, cart quantities, a dot for “something changed”.',
        why: 'Numbers and dots only, never words. A badge answers “how many” or “is there something new”, not “what state”.',
        preview: '<div class="ds-preview__stage" style="gap:26px;align-items:center"><span class="om-badge">8</span><span class="om-badge om-badge--red">99+</span><span class="om-badge om-badge--grey">24</span><span class="om-badge--anchor"><button class="om-iconbtn" aria-label="Notifications"><svg viewBox="0 0 20 20" fill="none"><path d="M5 8.5a5 5 0 0 1 10 0c0 4 1.4 5 1.4 5H3.6s1.4-1 1.4-5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 16a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button><span class="om-badge om-badge--red">3</span></span><span class="om-badge--anchor"><span class="om-avatar om-avatar--32">AF</span><span class="om-badge om-badge--dot" style="background:var(--om-green)"></span></span></div>',
        spec: [['Height', '<code>20</code> px'], ['Dot', '<code>8</code> px'], ['Content', 'number or dot only'], ['Anchor', 'top-right, white ring']]
      },
      {
        id: 'labels', name: 'Labels', desc: 'A square-cornered tag for categories and attributes — order type, payment mode, handling flags.',
        why: 'Deliberately squared (3px) so it never gets confused with a round status tag. Category, not state.',
        preview: '<div class="ds-preview__stage" style="padding:0;gap:8px"><span class="om-label" style="background:var(--om-primary-lighter);color:var(--om-primary-dark)">B2B</span><span class="om-label" style="background:var(--om-green-bg);color:var(--om-green)">COD</span><span class="om-label" style="background:var(--om-orange-bg);color:var(--om-orange)">Fragile</span><span class="om-label" style="background:var(--om-canvas);color:var(--om-ink-2)">Bulk</span></div>',
        spec: [['Height', '<code>20</code> px'], ['Radius', '<code>3</code> px (squared)'], ['Use for', 'category / attribute, not status']]
      },
      {
        id: 'avatar', name: 'Avatar', desc: 'Represents a person or entity. Initials on primary-lighter when there’s no photo; overlap groups with a +N overflow.',
        why: 'Four sizes cover table rows to profile headers; the group with +N fits “who touched this” into one cell.',
        preview: '<div class="ds-preview__stage" style="padding:0;gap:16px"><span class="om-avatar om-avatar--24">GS</span><span class="om-avatar om-avatar--32">AF</span><span class="om-avatar om-avatar--40"><img src="https://i.pravatar.cc/80?img=12" alt="" /></span><span class="om-avatar om-avatar--48"><img src="https://i.pravatar.cc/96?img=32" alt="" /></span><span class="om-avgroup"><span class="om-avatar om-avatar--32"><img src="https://i.pravatar.cc/64?img=5" alt="" /></span><span class="om-avatar om-avatar--32"><img src="https://i.pravatar.cc/64?img=8" alt="" /></span><span class="om-avatar om-avatar--32">OH</span><span class="om-avatar om-avatar--32 more">+4</span></span></div>',
        spec: [['Sizes', '<code>24 / 32 / 40 / 48</code> px'], ['Content', 'photo when available, else initials'], ['Group', 'overlap + <code>+N</code> overflow']]
      },
      {
        id: 'card', name: 'Card', desc: 'A surface that groups related content and actions. Optional header and a shaded footer for actions.',
        why: 'The base container for dashboards and detail groupings — one border, one radius, so a grid of cards reads as one system.',
        preview: '<div class="om-card"><div class="om-card__head"><b>Riyadh Central</b><span class="om-tag om-tag--green"><span class="dot"></span>Online</span></div><div class="om-card__body">1,204 SKUs in stock · 18 below reorder point · last sync 2 min ago.</div><div class="om-card__foot"><button class="om-btn om-btn--line om-btn--compact">View</button><button class="om-btn om-btn--plain om-btn--compact">Reorder</button></div></div>',
        spec: [['Radius', '<code>12</code> px'], ['Regions', 'header · body · footer (all optional)'], ['Footer', 'bg2 shade']]
      },
      {
        id: 'accordion', name: 'Accordion', desc: 'Progressively discloses grouped content, keeping long pages scannable. One or many panels open at a time.',
        why: 'For settings and FAQs where showing everything at once overwhelms — the chevron rotates and the panel animates open.',
        preview: '<div class="om-acc" data-acc><div class="om-acc__item is-open"><button class="om-acc__btn">How is the route optimised?' + chevD() + '</button><div class="om-acc__panel"><div>Stops are ordered by distance and time windows, tuned to the vehicle you pick.</div></div></div><div class="om-acc__item"><button class="om-acc__btn">Can I reorder stops manually?' + chevD() + '</button><div class="om-acc__panel"><div>Yes — drag any stop in the plan and the map updates live.</div></div></div><div class="om-acc__item"><button class="om-acc__btn">What happens on a failed delivery?' + chevD() + '</button><div class="om-acc__panel"><div>The stop is flagged, a reason is captured, and it can be rescheduled.</div></div></div></div>',
        spec: [['Motion', 'chevron rotate + height <code>.24s</code>'], ['Mode', 'single or multi-open'], ['Divider', 'between items']]
      },
      {
        id: 'inline-edit', name: 'Inline edit', desc: 'Edits a single value in place without a separate form. Click, type, Enter to save, Esc to cancel.',
        why: 'For one-off field tweaks that don’t deserve an edit mode. The dashed hover border advertises editability without cluttering the resting view.',
        preview: '<div class="om-inline" data-inline><span style="color:var(--om-ink-2);font-size:13px">Hub name:</span><span class="val" tabindex="0">Riyadh Central</span><span class="pencil"><svg viewBox="0 0 16 16" fill="none"><path d="M11.3 2.1a1.4 1.4 0 0 1 2 2L5.6 11.8l-2.8.8.8-2.8 7.7-7.7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></span></div>',
        spec: [['Save', 'Enter / blur'], ['Cancel', 'Esc'], ['Affordance', 'dashed border on hover']]
      }
    ]
  });

  function chevD() { return '<svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
})();

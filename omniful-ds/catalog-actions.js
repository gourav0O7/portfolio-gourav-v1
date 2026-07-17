
/* Omniful DS catalog — Actions + Forms. Pushes onto window.OM_CATALOG. */
(function () {
  window.OM_CATALOG = window.OM_CATALOG || [];

  // shared inline icons
  var I = {
    plus: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 12 12" fill="none"><path d="m2 6.2 2.7 2.6L10 3.4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevD: '<svg viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    x: '<svg viewBox="0 0 16 16" fill="none"><path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    eye: '<svg viewBox="0 0 16 16" fill="none"><path d="M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8Z" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3"/></svg>',
    warn: '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.4"/><path d="m5.5 5.5 5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    upload: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 13V4m0 0L6.5 7.5M10 4l3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 13v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    doc: '<svg viewBox="0 0 16 16" fill="none"><path d="M4 2h5l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" stroke-width="1.3"/><path d="M9 2v3h3" stroke="currentColor" stroke-width="1.3"/></svg>'
  };
  window.OM_I = I;

  var cbBox = '<span class="box">' + I.check + '</span>';

  window.OM_CATALOG.push({
    id: 'actions', group: 'Actions', title: 'Actions',
    eyebrow: 'Components', intro: 'Buttons and action controls. One primary action per view; everything else steps down in weight so the eye always lands on the main task first.',
    components: [
      {
        id: 'button', name: 'Button', desc: 'Triggers an action or event. Comes in four hierarchy levels and three sizes, all driven by tokens so height, radius and font never drift.',
        why: 'Hierarchy is the whole point: <b>primary</b> for the one main action, <b>subtle</b> and <b>outline</b> for secondary paths, <b>plain</b> for low-emphasis inline actions, <b>critical</b> for destructive ones. Only one primary per view.',
        preview: '<button class="om-btn">Create order</button><button class="om-btn om-btn--secondary">Save draft</button><button class="om-btn om-btn--line">Cancel</button><button class="om-btn om-btn--plain">Learn more</button><button class="om-btn om-btn--danger">Delete</button>',
        lblStates: 'States — primary',
        statesCols: 6,
        states: [
          { n: 'Default', h: '<button class="om-btn">Button</button>' },
          { n: 'Hover', h: '<button class="om-btn is-hover">Button</button>' },
          { n: 'Focus', h: '<button class="om-btn is-focus">Button</button>' },
          { n: 'Pressed', h: '<button class="om-btn is-pressed">Button</button>' },
          { n: 'Loading', h: '<button class="om-btn om-btn--loading"><span class="om-spin"></span>Saving</button>' },
          { n: 'Disabled', h: '<button class="om-btn" disabled>Button</button>' }
        ],
        extra: [
          { lbl: 'Hierarchy', cols: 5, states: [
            { n: 'Primary', h: '<button class="om-btn">Button</button>' },
            { n: 'Subtle', h: '<button class="om-btn om-btn--secondary">Button</button>' },
            { n: 'Outline', h: '<button class="om-btn om-btn--line">Button</button>' },
            { n: 'Plain', h: '<button class="om-btn om-btn--plain">Button</button>' },
            { n: 'Critical', h: '<button class="om-btn om-btn--danger">Button</button>' }
          ]},
          { lbl: 'Sizes', cols: 3, states: [
            { n: 'Regular · 40', h: '<button class="om-btn">' + I.plus + 'Add</button>' },
            { n: 'Compact · 36', h: '<button class="om-btn om-btn--compact">' + I.plus + 'Add</button>' },
            { n: 'Compressed · 24', h: '<button class="om-btn om-btn--compressed">' + I.plus + 'Add</button>' }
          ]}
        ],
        spec: [['Height', '<code>40</code> / <code>36</code> / <code>24</code> px'], ['Radius', '<code>8</code> / <code>6</code> / <code>4</code> px'], ['Font size', '<code>14</code> / <code>12</code> / <code>11</code> px'], ['Icon size', '<code>20</code> / <code>16</code> / <code>12</code> px'], ['Padding-x', '<code>16</code> / <code>12</code> / <code>8</code> px'], ['Gap in a row', '<code>12</code> px']],
        guide: {
          do: { demo: '<button class="om-btn">Save</button><button class="om-btn om-btn--line">Cancel</button>', tx: 'Pair one primary with a lower-emphasis secondary so the main action is obvious.' },
          dont: { demo: '<button class="om-btn">Save</button><button class="om-btn">Cancel</button>', tx: 'Don’t use two primary buttons side by side — nothing wins and the choice gets heavier.' }
        }
      },
      {
        id: 'icon-button', name: 'Icon button', desc: 'A compact, icon-only action for toolbars and table rows where a label would crowd the layout. Always give it an accessible label.',
        why: 'Reserved for universally understood icons (edit, delete, close). Anything ambiguous keeps its text label — an icon alone should never carry a risky or unfamiliar action.',
        preview: '<button class="om-iconbtn" aria-label="Edit"><svg viewBox="0 0 16 16" fill="none"><path d="M11.3 2.1a1.4 1.4 0 0 1 2 2L5.6 11.8l-2.8.8.8-2.8 7.7-7.7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></button><button class="om-iconbtn" aria-label="Duplicate"><svg viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M3 11V4a1 1 0 0 1 1-1h7" stroke="currentColor" stroke-width="1.3"/></svg></button><button class="om-iconbtn om-iconbtn--sm" aria-label="Close">' + I.x + '</button>',
        lblStates: 'States',
        statesCols: 5,
        states: [
          { n: 'Default', h: '<button class="om-iconbtn" aria-label="Edit"><svg viewBox="0 0 16 16" fill="none"><path d="M11.3 2.1a1.4 1.4 0 0 1 2 2L5.6 11.8l-2.8.8.8-2.8 7.7-7.7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></button>' },
          { n: 'Hover', h: '<button class="om-iconbtn is-hover" aria-label="Edit"><svg viewBox="0 0 16 16" fill="none"><path d="M11.3 2.1a1.4 1.4 0 0 1 2 2L5.6 11.8l-2.8.8.8-2.8 7.7-7.7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></button>' },
          { n: 'Focus', h: '<button class="om-iconbtn is-focus" aria-label="Edit"><svg viewBox="0 0 16 16" fill="none"><path d="M11.3 2.1a1.4 1.4 0 0 1 2 2L5.6 11.8l-2.8.8.8-2.8 7.7-7.7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></button>' },
          { n: 'Pressed', h: '<button class="om-iconbtn is-pressed" aria-label="Edit"><svg viewBox="0 0 16 16" fill="none"><path d="M11.3 2.1a1.4 1.4 0 0 1 2 2L5.6 11.8l-2.8.8.8-2.8 7.7-7.7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></button>' },
          { n: 'Disabled', h: '<button class="om-iconbtn" disabled aria-label="Edit"><svg viewBox="0 0 16 16" fill="none"><path d="M11.3 2.1a1.4 1.4 0 0 1 2 2L5.6 11.8l-2.8.8.8-2.8 7.7-7.7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></button>' }
        ],
        spec: [['Size', '<code>36</code> / <code>28</code> px'], ['Radius', '<code>8</code> / <code>6</code> px'], ['Icon', '<code>18</code> / <code>14</code> px'], ['A11y', 'requires <code>aria-label</code>']],
        guide: {
          do: { demo: '<button class="om-iconbtn" aria-label="Delete"><svg viewBox="0 0 16 16" fill="none"><path d="M3 5h10M6.5 5V3.5h3V5M5 5v8.5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></button>', tx: 'Use only clear, conventional icons and always attach an accessible label.' },
          dont: { demo: '<button class="om-iconbtn" aria-label="?"><svg viewBox="0 0 16 16" fill="none"><path d="M6 6a2 2 0 1 1 2.6 1.9c-.6.2-.6.6-.6 1.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="8" cy="11.5" r=".7" fill="currentColor"/></svg></button>', tx: 'Don’t hide an unclear or important action behind a lone icon with no label.' }
        }
      },
      {
        id: 'split-button', name: 'Split button', desc: 'A primary action paired with a menu of related alternatives — the common case is one tap, the rest a click away.',
        why: 'Keeps the most-used action a single tap while tucking variants (Export as CSV / PDF) behind the caret, so the toolbar stays quiet.',
        preview: '<span class="om-split"><button class="om-btn">Export</button><button class="om-btn" aria-label="More export options">' + I.chevD + '</button></span><span class="om-split"><button class="om-btn om-btn--line">Save</button><button class="om-btn om-btn--line" aria-label="More save options">' + I.chevD + '</button></span>',
        spec: [['Divider', '<code>1px</code> rgba(255,255,255,.35)'], ['Caret padding', '<code>10</code> px'], ['Radius', 'outer corners only']],
        guide: {
          do: { demo: '<span class="om-split"><button class="om-btn">Export</button><button class="om-btn" aria-label="More">' + I.chevD + '</button></span>', tx: 'Use when one default action dominates and the rest are close variants of it.' },
          dont: { demo: '<span class="om-split"><button class="om-btn">Save</button><button class="om-btn" aria-label="More">' + I.chevD + '</button></span>', tx: 'Don’t hide unrelated actions in the menu — those belong in a separate overflow.' }
        }
      },
      {
        id: 'segmented', name: 'Segmented control', desc: 'Switches between two to four mutually exclusive views. Lighter than tabs, with a raised thumb marking the active choice.',
        why: 'For view or scope switches (List / Board / Map) where tabs would imply separate pages. Above four options, use a dropdown instead.',
        preview: '<div class="om-seg" data-seg><button class="is-on">List</button><button>Board</button><button>Map</button></div>',
        lblStates: 'States',
        statesCols: 3,
        states: [
          { n: 'Selected', h: '<div class="om-seg"><button class="is-on">List</button><button>Board</button></div>' },
          { n: 'Unselected', h: '<div class="om-seg"><button>List</button><button class="is-on">Board</button></div>' },
          { n: 'Four options', h: '<div class="om-seg"><button class="is-on">Day</button><button>Wk</button><button>Mo</button><button>Yr</button></div>' }
        ],
        spec: [['Height', '<code>28</code> px thumb, <code>36</code> track'], ['Radius', '<code>8</code> track / <code>6</code> thumb'], ['Max options', '<code>4</code>']],
        guide: {
          do: { demo: '<div class="om-seg"><button class="is-on">List</button><button>Board</button><button>Map</button></div>', tx: 'Use for 2–4 short, exclusive view options that fit on one line.' },
          dont: { demo: '<div class="om-seg"><button class="is-on">A</button><button>B</button><button>C</button><button>D</button><button>E</button></div>', tx: 'Don’t overflow it with many options — reach for a dropdown past four.' }
        }
      }
    ]
  });
})();

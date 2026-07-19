
/* ============================================================
   PROJECT DATA, single source of truth for case-study pages
   Structure per project follows the case-study framework:
   hero/meta · problem · goals · research · insights · principles
   · ideation · approach (solution) · designSystem · validation
   · outcomes · interviewer · next
   Sections are optional, only what adds signal is included.
   ============================================================ */
window.PROJECTS = {

  "stock-on-wheel": {
    index: "001",
    title: "Stock on Wheel",
    client: "Omniful",
    year: "2025",
    one: "Real-time stock in the driver's hand. An admin console to load and track each van, and a driver app to confirm every drop on the move, one hand, even with no signal.",
    meta: { role: "Lead Product Designer", timeline: "2025 · Ongoing", platform: "Admin Web + Driver App", team: "PM · 3 Eng · Ops" },
    tags: ["Mobile", "Inventory", "End-to-End", "Driver Tooling"],

    challenge: "Once a van left the warehouse, no one knew what was inside it. Both the driver and the office waited until the end of the day to count stock by hand. Small mistakes piled up trip after trip, and by the time anyone caught one, the van was gone. The company was running a fleet of warehouses it couldn't see into.",

    goals: {
      business: [
        "Treat every delivery van as a small warehouse the team can see live",
        "Stop the end-of-day stock count, catch mistakes the moment they happen",
        "Turn the new vehicle and stock pieces into shared parts other Omniful products can reuse"
      ],
      user: [
        "Drivers: confirm a drop in seconds, mid-route, with one hand",
        "Drivers: a screen that still works with gloves on, in bright sun, with no signal",
        "Office team: a live view they can act on now, not a spreadsheet they fix later"
      ],
      metrics: [
        "How long it takes to confirm a drop",
        "The gap between the stock on the van and the stock in the system",
        "Problems fixed on the spot vs. after the route"
      ]
    },

    research: {
      methods: ["Driver ride-alongs", "Ops shadowing", "Existing-workflow audit", "Stakeholder interviews"],
      findings: [
        "Most counting mistakes happen while loading the van, not at the customer's door. The errors are already there before the van moves.",
        "Drivers don't stop to read the screen. When they're busy, they tap the biggest thing and move on.",
        "The office ran the whole fleet from a spreadsheet that was already hours out of date the moment they opened it."
      ]
    },

    insights: {
      lead: "The driver looked like the problem. The real issue came earlier, no one checked the van while it was loaded. The driver was just the last person who could catch a mistake, or pass it on.",
      pains: [
        { h: "No one checks the loading", b: "What goes onto the van isn't checked until hours later. So every later count carries a mistake no one can see." },
        { h: "Too much to do mid-route", b: "Confirming a drop shouldn't mean reading or remembering. Drivers want one tap, not three." },
        { h: "The office sees old data", b: "With no live link between the van and the system, the office can only react after the fact." }
      ]
    },

    principles: [
      { h: "Design for one thumb", b: "Every main action sits within reach of one hand, with buttons big enough to hit with gloves on, in a moving van." },
      { h: "Make the fast way the safe way", b: "The quickest path should also be the correct one. Let people undo a mistake instead of asking them to confirm everything first." },
      { h: "Show status, not menus", b: "The office needs to see what's happening right now, not click through screens to find it. Live status, everywhere." },
      { h: "Treat 'no signal' as normal", b: "Weak signal is the everyday case, not the exception. The app never freezes waiting for the network." }
    ],

    ideation: {
      lead: "We tried three ways to check the van at loading. One won.",
      alts: [
        { h: "Scan every item, in and out", b: "The most accurate, but the slowest. Drivers wouldn't do it in our tests, it added minutes to every load." },
        { h: "Just trust the list", b: "The fastest, with no checking at all. But it pushed every mistake further down the line. Rejected." },
        { h: "Spot-check, then flag problems", b: "Check a sample of items and flag anything odd on the spot. Chosen, fast enough to actually use, accurate enough to trust." }
      ],
      tradeoff: "Spot-checking can miss a little, but it gives us a loading step drivers will actually finish every single time. We took that trade."
    },

    overview: [
      "Stock on Wheel makes every van a warehouse the team can track. I owned both apps, the admin console the office plans from, and the driver app where loading, drops and returns happen on the move, working with one PM, three engineers and ops from research to launch.",
      "It all came down to one moment: a driver mid-route, one hand free, often no signal, confirming a drop and moving on. I built the product around that moment. Every other screen had to earn its place around it."
    ],
    sections: [
      { k: "01", h: "Map the full trip", b: "I mapped the whole loop, load, dispatch, deliver, return, with the office team and drivers, and marked every point where the count could go wrong. Those points became the screens that mattered most." },
      { k: "02", h: "Build for one hand", b: "The driver app is made for one-handed use on the move: big buttons, high contrast, confirm in one tap, and a layout that holds up with gloves, sun glare and weak signal." },
      { k: "03", h: "A live view for the office", b: "On the admin side, a live stock view links every item to a van and a status. The office can fix problems as they happen instead of sorting out spreadsheets after the route ends." }
    ],

    designSystem: {
      lead: "The parts I built for Stock on Wheel moved into Omniful's shared library, so the other products (TMS, WMS, OMS) could reuse the same vehicle and stock pieces.",
      items: [
        "Vehicle card that shows its current state, reused across TMS and Stock on Wheel",
        "Stock-on-van row with a small status dot",
        "Confirm-then-undo pattern for actions that are hard to reverse",
        "Offline / syncing banner used across the whole app"
      ]
    },

    validation: {
      lead: "We tested twice with real drivers in the yard, not in a quiet office.",
      changes: [
        { h: "Three taps became one", b: "We compared a three-step confirm with a one-tap confirm. One tap was faster and just as accurate, so we shipped it, with five seconds to undo." },
        { h: "Fewer, bigger status states", b: "Drivers missed the in-between statuses completely. We cut five status colours down to three and doubled the size of the dot." }
      ]
    },

    outcomes: [
      { n: "Real-time", l: "stock you can see live" },
      { n: "2", l: "apps · office + driver" },
      { n: "1 tap", l: "to confirm a drop" }
    ],
    interviewer: {
      lead: "I owned a two-sided product end to end, and built it around the hardest case I could find, a driver, mid-route, one hand, no signal.",
      points: [
        { h: "My role", b: "Lead designer. Research with the office team and drivers, the full structure, every screen on both apps, prototyping, handoff to engineering, and changes after launch." },
        { h: "The hardest call", b: "One-tap confirm or a three-step confirm. We tested both with real drivers. One tap was faster and just as accurate, so we shipped it with an undo." },
        { h: "Thinking in systems", b: "The parts I built here moved into Omniful's shared library, so the other products could reuse the same vehicle and stock pieces instead of rebuilding them." },
        { h: "If I had more time", b: "I'd take the offline support further, keep the whole trip working without signal, not just the parts I started with, so the app feels the same online or off." }
      ]
    },
    next: "tms-delivery-app"
  },

  "tms-delivery-app": {
    index: "002",
    title: "Delivery Partner App",
    client: "Omniful",
    year: "2024",
    one: "Vehicles, trips, proof of delivery and payments, four separate tools brought into one flow, so a delivery runs end to end without app-switching.",
    meta: { role: "Product Designer 2", timeline: "2024", platform: "Web TMS + Delivery App", team: "PM · 4 Eng · Ops" },
    tags: ["Logistics", "Trips & PoD", "Payments", "Mobile"],
    subProjects: ["dual-payment", "bulk-otp"],

    challenge: "Dispatchers and drivers juggled four separate tools, vehicles, trips, proof of delivery, payments. None talked to each other, so people copied data by hand, status was always stale, and every handoff slowed the delivery down.",

    goals: {
      business: [
        "Bring four separate tools into one continuous flow",
        "Cut the time a driver spends at each doorstep",
        "Make support tickets easy to trace from one shared status"
      ],
      user: [
        "Dispatchers: plan a trip without leaving the screen",
        "Drivers: proof of delivery and payment in one unbroken moment",
        "Both: the same words on web and mobile"
      ],
      metrics: [
        "Time at the doorstep (proof of delivery + payment)",
        "Number of trip handoffs per route",
        "Times the same data gets re-typed each day"
      ]
    },

    research: {
      methods: ["Dispatcher shadowing", "Driver ride-alongs", "Support-ticket audit", "Existing-tool teardown"],
      findings: [
        "Dispatchers always had four tabs open, the real time-waster was switching between them.",
        "Proof of delivery failed most often when payment was a separate app, drivers forgot, or the customer walked off.",
        "Each tool used different words for the same thing (trip vs. route vs. run), which made training and support harder."
      ]
    },

    insights: {
      lead: "The problem wasn't missing features. Each tool worked alone; together they didn't. The split between them was the real problem.",
      pains: [
        { h: "Four tabs to plan one trip", b: "Planning a trip meant four tools and copying data by hand. By the time the status arrived, it was already old." },
        { h: "Proof and payment kept apart", b: "Two separate steps at the door is one too many. Customers leave; drivers move on without collecting." },
        { h: "Different words everywhere", b: "The same idea had a different name on every screen, so people took longer to learn it and support got harder." }
      ]
    },

    principles: [
      { h: "One way of thinking, two screens", b: "Web and mobile share the same words, the same status and the same parts, different screen, same ideas." },
      { h: "Lead with status", b: "Every screen shows the current state first, not a menu. If you know the state, you know what to do next." },
      { h: "The doorstep comes first", b: "The proof-of-delivery and payment moment is the most important screen in the product. Nothing else gets put ahead of it." },
      { h: "Works offline, syncs later", b: "You can capture everything with no signal. The syncing happens quietly in the background." }
    ],

    ideation: {
      lead: "We prototyped two extremes before settling.",
      alts: [
        { h: "Keep proof and payment separate", b: "Lower risk, but it kept the same friction at the door. Rejected, the whole point of the rework was to join this moment up." },
        { h: "Auto-confirm the payment when proof is captured", b: "Fastest, but one mistake turns into a refund call. Checking the entry as it's typed made this safe enough to ship." },
        { h: "Proof + payment together, checked as you go", b: "Chosen, one smooth flow, with clear, instant error messages protecting the join." }
      ],
      tradeoff: "Joining proof and payment raised the cost of any bug, so we put real effort into clear error messages and a 60-second undo to cover it."
    },

    overview: [
      "I led design for Omniful's transport system and its delivery app, vehicles, planning and running trips, proof of delivery, and in-app payment.",
      "The job: turn separate steps into one flow. One place to plan a trip, one flow to run it, and a proof-and-payment moment fast enough to never hold up the next stop."
    ],
    sections: [
      { k: "01", h: "Vehicles & trips, in one place", b: "One shared view of vehicles and trips, where dispatchers assign, order and track without leaving the flow." },
      { k: "02", h: "Proof of delivery", b: "Built for speed and reliability at the door: capture, confirm, move on, with states that still work offline and sync once signal returns." },
      { k: "03", h: "Payment at the last mile", b: "Taking payment on delivery sits inside the same flow, so the driver finishes money and proof in one smooth step." }
    ],

    designSystem: {
      lead: "Shared parts kept the web side (dispatcher) and the mobile side (driver) speaking the same language.",
      items: [
        "Trip / Stop / Status, the same words on every screen",
        "Check-as-you-type pattern for proof + payment",
        "Offline-capture state shared with Stock on Wheel",
        "Status dot + syncing banner across every driver flow"
      ]
    },

    validation: {
      lead: "Tested in the field with three dispatcher teams and a pilot group of drivers.",
      changes: [
        { h: "Show errors in place, not in a popup", b: "Drivers tapped straight past popup errors. We moved the error onto the field that broke, and held the Submit button until it was fixed." },
        { h: "Trip status before the menu", b: "Dispatchers asked for trip status to be the first thing on screen, above the navigation. We rebuilt the page header around it." }
      ]
    },

    outcomes: [
      { n: "4", l: "tools brought into one" },
      { n: "Fewer steps", l: "trip → proof → pay" },
      { n: "Offline", l: "capture that still works" }
    ],
    interviewer: {
      lead: "I brought four separate tools into one flow, vehicles, trips, proof of delivery, payments, without making anyone relearn the product.",
      points: [
        { h: "My role", b: "Product designer leading the design across the web tool and the matching delivery app. Worked with the PM, four engineers and the operations team from framing the problem to launch." },
        { h: "The hardest call", b: "Whether proof of delivery and payment should be one step or two. Joining them cut the time at the door roughly in half, but raised the cost of a mistake, so we built clear, instant error messages." },
        { h: "Same on web and mobile", b: "The same way of thinking on web (dispatcher) and mobile (driver), different screen, same words for trip, stop and status. Training dropped to almost nothing." },
        { h: "If I had more time", b: "Let the dispatcher see exactly what the driver sees on the proof and payment screen, live, so a support call becomes a shared view instead of a guessing game." }
      ]
    },
    next: "demand-forecasting"
  },

  "demand-forecasting": {
    index: "003",
    title: "Demand Forecasting",
    client: "Omniful",
    year: "2024",
    one: "A clear way to see demand coming, and a rebuilt order flow inside the warehouse and order systems, so planning is easy to read and fast to act on.",
    meta: { role: "Product Designer 2", timeline: "2024", platform: "WMS / OMS · Web", team: "PM · 3 Eng · Data" },
    tags: ["Data Viz", "Planning", "WMS / OMS", "Web"],

    challenge: "Planning was guesswork and scattered exports, and creating an order meant a long, error-prone form. Teams needed forecasts they could trust, and a faster way to turn one into an order.",

    goals: {
      business: [
        "Make forecasts clear enough to actually act on",
        "Cut the time to create an order, and the re-typing errors",
        "Bring planning and ordering closer together"
      ],
      user: [
        "Planners: read a forecast in seconds, not minutes",
        "Ops: turn a forecast into an order without re-typing it",
        "Both: see how sure the forecast is, without being overwhelmed"
      ],
      metrics: [
        "Time from seeing a forecast → placing the order",
        "Re-typing errors per order",
        "How much planners trust the forecast (survey + interviews)"
      ]
    },

    research: {
      methods: ["Planner interviews", "Review of the order flow", "Data-team workshop", "Teardown of the old exports"],
      findings: [
        "Planners didn't doubt the data, they doubted how it was shown.",
        "Creating an order took eleven steps, with numbers re-typed from the forecast.",
        "When the 'how sure' range was shown as numbers, people ignored it; shown as a shaded band on the chart, they read it."
      ]
    },

    insights: {
      lead: "A forecast only helps if people believe it and can act on it. The problem wasn't the maths. It was the gap between seeing a forecast and doing something with it.",
      pains: [
        { h: "Numbers with no story", b: "Dense exports made planners decode before they could decide. How sure the forecast was sat as a number in a column, not a clear signal." },
        { h: "Forecast and order kept apart", b: "The forecast was in one place, the order form in another. Re-typing led to errors and chipped away at trust." },
        { h: "A long form", b: "Creating an order was an eleven-step form with repeated fields and no smart defaults." }
      ]
    },

    principles: [
      { h: "Readable in five seconds", b: "The key signal, which way it's going, how big, how sure, should land before the planner scrolls." },
      { h: "The forecast is the form", b: "Acting on a forecast shouldn't mean re-typing it. The order is filled in from the chart you're already looking at." },
      { h: "Be honest about how sure it is", b: "Show a shaded band, not a buried number. Trust you can rely on beats a number that looks too precise." },
      { h: "Cut every dead step", b: "If a field can be filled in for you, fill it. If a step can be worked out, work it out." }
    ],

    ideation: {
      lead: "Three ways to get from forecast to order.",
      alts: [
        { h: "Forecast → export → form", b: "How it already worked. Cheapest to build, hardest to use. Rejected." },
        { h: "Forecast → order made for you", b: "Fully automatic, least effort, but planners said no, it took away too much of their control." },
        { h: "Forecast → order filled in, planner confirms", b: "Chosen, the forecast fills in a draft order the planner checks and submits." }
      ],
      tradeoff: "Keeping the planner in the loop costs a step. We kept it to keep their trust, and made that step a quick check, not data entry."
    },

    overview: [
      "I built the demand-forecasting screens and rebuilt order creation inside Omniful's warehouse and order systems. The goal: make planning easy to read, and turn a forecast into an order in as few steps as possible.",
      "A forecast only helps if people believe it and act on it. So the design leads with clarity, readable trends, an honest sense of how sure it is, and a direct path from forecast to order."
    ],
    sections: [
      { k: "01", h: "Forecasts you can read", b: "Dense data was turned into clear trends and signals, so planners can glance, trust and decide instead of decoding spreadsheets." },
      { k: "02", h: "Forecast → order, directly", b: "The new order flow connects straight to the forecast, cutting steps and removing the re-typing that caused errors." },
      { k: "03", h: "Built for warehouse work", b: "Every choice was checked against how warehouses really run, so the planning side stays in step with how stock actually moves." }
    ],

    designSystem: {
      lead: "The chart and form parts built here became shared planning pieces across the warehouse and order systems.",
      items: [
        "Trend chart with a 'how sure' band",
        "Signal dot, direction and size in one mark",
        "Filled-in draft-order pattern",
        "Smart-default field that shows where its value came from"
      ]
    },

    validation: {
      lead: "Tested with planners across two pilot accounts.",
      changes: [
        { h: "A band, not a range of numbers", b: "Numeric 'how sure' ranges got skipped; shown as a shaded band on the chart, they got read every time. The exact numbers still show on hover." },
        { h: "Confirm, don't edit", b: "Early versions opened the order ready to edit. Planners over-edited and broke their own forecasts. We shipped a read-only confirm with a clear Edit button." }
      ]
    },

    outcomes: [
      { n: "Fewer steps", l: "to create an order" },
      { n: "Clearer", l: "planning signals" },
      { n: "Joined up", l: "forecast → order" }
    ],
    interviewer: {
      lead: "I made the forecast something planners trust, then turned it straight into an order, so they stopped re-typing numbers from a chart into a form.",
      points: [
        { h: "My role", b: "Lead designer for the forecasting screens and the rebuilt order flow inside the warehouse and order systems. Worked with a PM, three engineers and a data team." },
        { h: "The hardest call", b: "How much to show about how sure the forecast is. Hiding it looked cleaner but lost trust; we landed on a tight shaded band plus one clear signal, readable in under five seconds." },
        { h: "Cutting dead steps", b: "The old order flow had eleven steps with re-typing. I removed the repeats, filled in fields from the forecast, and the path got far shorter." },
        { h: "If I had more time", b: "Let planners copy a forecast, change a few inputs, and compare two possible orders side by side before choosing." }
      ]
    },
    next: "route-optimization-bisleri"
  },

  "route-optimization-bisleri": {
    index: "004",
    title: "Edgistify × Bisleri",
    client: "Edgistify · Client: Bisleri",
    year: "2023",
    one: "A planner tool and driver app that turned Bisleri's daily Excel of addresses into checked, vehicle-aware routes, past Google Maps' 10-stop limit.",
    meta: { role: "Product Designer", timeline: "2023", platform: "Admin Web + Driver App", team: "PM · 3 Eng · Ops" },
    tags: ["Logistics", "Maps", "B2B", "Mobile + Web"],

    challenge: "Bisleri delivers water to thousands of buildings a day. We'd get a daily Excel of addresses and plan by hand in Google Maps, capped at ten stops per route, while a third of the rows were wrong, missing or unreachable. By the time a driver reached a building, no one knew if it even had a working lift.",

    goals: {
      business: [
        "Replace the Excel + Google Maps patchwork with one tool that plans the whole day",
        "Catch bad addresses before a driver leaves the warehouse, not at the door",
        "Plan a full day on one route that knows the vehicle, not ten stops at a time"
      ],
      user: [
        "Planners: upload a list and see what's broken before assigning anything",
        "Planners: pick a vehicle, assign a driver, get a planned route, all on one screen",
        "Drivers: see the next stop, its address and anything special (lift / no lift, call ahead) on one card"
      ],
      metrics: [
        "Stops planned per route (vs. Google's limit of 10)",
        "Failed deliveries caused by wrong addresses",
        "Wasted trips up high-rises, driver climbs, no one home"
      ]
    },

    research: {
      methods: ["Planner shadowing at the Bisleri depot", "Driver ride-alongs", "Review of failed Excel rows", "Look at Google Maps' limits"],
      findings: [
        "Google Maps only allows ten stops on a personal route, so planners taped several maps together by hand to cover a day.",
        "About a third of every uploaded list had wrong pincodes, missing landmarks or repeated lines.",
        "High-rise buildings with no lift were the single biggest cause of a failed delivery, the driver climbs, the customer isn't home, the load comes back."
      ]
    },

    insights: {
      lead: "The Excel list, not the routing, was where the day went wrong. By the time addresses hit a map, the damage was done.",
      pains: [
        { h: "Bad addresses, found too late", b: "Wrong pincodes and missing details only showed up once a driver was already lost on the street. The checking had to move to the moment of upload." },
        { h: "The 10-stop limit", b: "Google Maps allows ten stops per route. A full Bisleri day is twenty or more, so planners taped several maps together, and lost the best order at every join." },
        { h: "The lift problem", b: "20-litre jars don't fit in many home lifts, and many older high-rises have no lift at all. The driver found out at the building. The tool needed a way to flag these addresses up front." }
      ]
    },

    principles: [
      { h: "Check at upload, not at the door", b: "Every address is checked the moment the list is uploaded. Bad rows are flagged with their row number so they can be fixed before anything is assigned." },
      { h: "Plan the whole day, not ten stops", b: "The tool plans the full day in one go and knows the type of vehicle, so it isn't stuck behind a map's ten-stop limit." },
      { h: "The driver carries the context, not just the address", b: "Special notes travel with the stop into the driver app: no lift, call ahead, the contact, and why a past drop failed." },
      { h: "One screen per role", b: "Planner does upload → check → vehicle → driver on one screen. Driver runs the whole day from one list. No jumping between tabs on either side." }
    ],

    ideation: {
      lead: "Three ways to run it, before we settled.",
      alts: [
        { h: "Keep Google Maps, build a stitcher", b: "Cheapest. A helper that joins several map windows to get past the ten-stop limit. Rejected, it left the bad-address problem completely untouched." },
        { h: "Assign everything automatically", b: "The tool assigns drivers and vehicles with no human check. Faster, but planners said no, too much they knew about the depot that the tool couldn't see." },
        { h: "Check → plan → planner assigns", b: "Chosen. The tool checks the addresses, plans a route that knows the vehicle, and the planner picks the driver and confirms." }
      ],
      tradeoff: "Keeping the planner in charge of the driver choice costs a step, but it's the step that catches everything the tool doesn't know about the depot or the day."
    },

    overview: [
      "Bisleri's deliveries ran on a daily Excel of addresses. The team copied them into Google Maps ten at a time, Google's limit, and joined routes by hand. Wrong addresses surfaced at the door; no-lift high-rises became wasted trips.",
      "We replaced that with a focused two-part tool: a planner screen that checks the list on upload, plans the full day on one vehicle-aware route, and assigns a driver in one place, and a driver app that runs the route, shows the right note for each stop, and captures a reason on the spot when a drop fails."
    ],
    sections: [
      { k: "01", h: "Check the list on upload", b: "The planner uploads the daily Excel; the screen highlights wrong, missing or repeated addresses with the row number, so they can be fixed and re-uploaded before any route is planned." },
      { k: "02", h: "Plan the whole day, not ten stops", b: "Once the addresses are clean, the planner picks a vehicle type and the tool plans the full route across every stop, no ten-stop limit, no joining maps by hand." },
      { k: "03", h: "The driver app carries the notes", b: "The driver sees stops in order with their notes. No-lift stops prompt a call ahead, and any failed drop captures a reason on the spot so the planner sees why." }
    ],

    validation: {
      lead: "Piloted at one Bisleri depot before rolling out across the network.",
      changes: [
        { h: "A row number on every error", b: "The first version flagged wrong addresses without saying where to look in the list. We added the row number to every error so planners could find and fix the line in seconds." },
        { h: "No-lift as a leading tag", b: "Drivers were missing the no-lift note buried in the address. We moved it to a red tag at the top of the stop card, so it reads before the address itself." }
      ]
    },

    outcomes: [
      { n: "No limit", l: "stops per route (vs. Google's 10)" },
      { n: "At upload", l: "addresses checked early" },
      { n: "No-lift", l: "flagged in the driver app" }
    ],
    interviewer: {
      lead: "I designed a small, focused two-sided tool that replaced the Excel + Google Maps shuffle, and gave the driver the one note that decided whether a drop worked.",
      points: [
        { h: "My role", b: "Product designer working with the Edgistify PM and engineers, straight against Bisleri's real workflow. Owned the planner screen, the driver app and the upload check." },
        { h: "The hardest call", b: "Whether to assign drivers automatically. We kept the planner in charge: the tool suggests a route and vehicle, and the planner picks the driver. That last human step is where depot knowledge lives." },
        { h: "The no-lift tag", b: "The single biggest cause of a failed drop was a 20-litre jar arriving at a no-lift high-rise. A red 'no lift' tag at the top of the stop card tells the driver to call ahead, a tiny UI change, a big win." },
        { h: "If I had more time", b: "An address-quality score on the upload screen, not just right or wrong, but a confidence number with the most likely fix shown right there." }
      ]
    },
    next: "picker-app"
  },

  "picker-app": {
    index: "005",
    title: "Warehouse Picker App",
    client: "Edgistify",
    year: "2023",
    one: "A web app for warehouse pickers that makes picking faster, less walking, fewer mistakes, less waiting, so the team gets more done.",
    meta: { role: "Product Designer 1", timeline: "2023, 2024", platform: "Web-Based App", team: "PM · 2 Eng · Ops" },
    tags: ["Operations", "Productivity", "Warehouse", "Web"],

    challenge: "Pickers moved through the warehouse the slow way, walking back on themselves, grabbing the wrong item, waiting. The picking steps had to be quicker to follow and harder to get wrong.",

    goals: {
      business: [
        "Pick more per hour without longer shifts",
        "Catch wrong picks before they reach packing",
        "Keep the app usable on shared, basic devices"
      ],
      user: [
        "Pickers: always know where to go next, no thinking",
        "Pickers: catch a wrong scan the moment it happens",
        "Supervisors: see who's stuck without standing over them"
      ],
      metrics: [
        "Picks per hour",
        "Wrong picks caught at the confirm step",
        "Time spent waiting between picks"
      ]
    },

    research: {
      methods: ["Watching the floor", "Picker interviews", "Review of where wrong picks came from"],
      findings: [
        "Walking back on themselves, not picking, ate most of the shift.",
        "Wrong picks were almost always caught later, downstream, far too late.",
        "Pickers ignored anything that wasn't the next instruction; extra info was just noise."
      ]
    },

    insights: {
      lead: "The picker needs two things: where to go, and what to grab. Everything else gets in the way.",
      pains: [
        { h: "Walking back by default", b: "Picks were listed in item order, not in the order you'd walk them. So pickers re-walked the same aisles every list." },
        { h: "Mistakes caught too late", b: "The check happened at packing. By then the mistake was expensive to fix." },
        { h: "Too much on screen", b: "Too much information per screen made pickers stop walking just to read it." }
      ]
    },

    principles: [
      { h: "Walking order, not list order", b: "Sort picks by the path through the floor, never by item code." },
      { h: "Two things on screen, no more", b: "Where to go and what to grab. Everything else hides behind a tap." },
      { h: "Check now, not later", b: "Wrong scan caught on the spot. Right scan confirms straight away." },
      { h: "Built for the worst device on the floor", b: "Big buttons, high contrast, no animations that get in the way of typing or scanning." }
    ],

    ideation: {
      lead: "We compared two ways to order the picks.",
      alts: [
        { h: "Pick in list order", b: "Simple and predictable, but it built backtracking into every shift. Rejected." },
        { h: "Pick in walking order", b: "Order picks by the path through the floor, and re-route on the fly when a bin is empty. Chosen." }
      ],
      tradeoff: "Picking in walking order needs better floor-layout data, but it pays that back in walking time saved every shift."
    },

    overview: [
      "I designed a web app for warehouse pickers to make picking faster, focused squarely on what the picker does, moment to moment, on the floor.",
      "Good picking takes the thinking out of the task: tell the picker exactly where to go and what to grab, confirm in a tap, and make mistakes show up before they ship."
    ],
    sections: [
      { k: "01", h: "Guided picking", b: "The app walks the picker through the list step by step, in an efficient order, less walking back, fewer decisions mid-aisle." },
      { k: "02", h: "Hard to get wrong", b: "Clear confirm and check steps catch wrong picks the moment they happen, protecting everything downstream." },
      { k: "03", h: "Built for the floor", b: "High-contrast, big-button screens stay usable at speed, on shared devices, in a busy warehouse." }
    ],

    validation: {
      lead: "Tested with picker teams on the floor across two shifts.",
      changes: [
        { h: "Check in place, don't block", b: "The first version froze the screen on a wrong scan. Pickers swiped past. We swapped the block for an in-place error that keeps their place but won't let Submit through." },
        { h: "Bigger numbers, fewer words", b: "Pickers used the location number as their main anchor. We doubled its size and pushed everything else down." }
      ]
    },

    outcomes: [
      { n: "More done", l: "in the picking flow" },
      { n: "Guided", l: "step-by-step picks" },
      { n: "Fewer errors", l: "caught on the spot" }
    ],
    interviewer: {
      lead: "I designed for someone who can't stop to think, the picker on the floor, and treated mental effort as the thing that mattered most.",
      points: [
        { h: "My role", b: "Product designer, start to finish. Watched picking on the warehouse floor, set the flow, designed every screen, tested with pickers, and shipped with two engineers." },
        { h: "The hardest call", b: "How strict the checking should be. Too strict and pickers fight the app; too loose and mistakes slip through. Catching errors in place, at the moment they happen, was the right balance." },
        { h: "Built for the floor", b: "High contrast, oversized buttons, a set order, made for shared devices, gloves, bad light and speed. It looks busy in a calm office; it reads fast on the floor." },
        { h: "If I had more time", b: "Voice picking on top of the screen, keep the screen as a backup but free the picker's hands and eyes." }
      ]
    },
    next: "edgeos"
  },

  "edgeos": {
    index: "006",
    title: "EdgeOS Platform",
    client: "Edgistify",
    year: "2022, 2024",
    one: "Edgistify's logistics platform. One product served two very different users, operators and customers. I kept it one, instead of splitting it in two.",
    meta: { role: "Product Designer · Exec UI/UX", timeline: "2022, 2024", platform: "SaaS · B2B + B2C", team: "PM · Eng · Clients" },
    tags: ["SaaS", "Lifecycle", "B2B + B2C", "Platform"],

    challenge: "One platform served two worlds that barely overlap. Operators move freight at scale and live in dense tables. Customers just want to place an order and see where it is. Splitting EdgeOS into two products was the obvious move. I argued for the harder one, a single product that doesn't feel stretched thin at either end.",

    goals: {
      business: [
        "One platform that works for business operations and for end customers",
        "Stop the two sides drifting apart and doubling the work",
        "Set patterns the team can build on without deciding everything again"
      ],
      user: [
        "Business users: power and control, without falling back to spreadsheets",
        "Customers: something simple, without losing what the platform can do",
        "Both: it should feel like the same product on either side"
      ],
      metrics: [
        "How much the two sides reuse the same parts",
        "How long it takes to design a new feature",
        "How many people finish setup, on both sides"
      ]
    },

    research: {
      methods: ["Client interviews", "Review of the existing product", "List of all the parts in use", "Cross-team workshops"],
      findings: [
        "Most business and customer needs shared more in common than the old design suggested.",
        "Splitting the look in two doubled the work without making anything clearer.",
        "Business users asked for things the customer side had already solved, and the other way round, the platform wasn't sharing what it learned with itself."
      ]
    },

    insights: {
      lead: "Laid side by side, most of the gap between the two sides wasn't real. It had crept in over time, different people, different sprints, not because operators and customers needed different things. Underneath, the same few objects ran everything: an order, a shipment, a status. The question stopped being 'how do we serve two audiences' and became 'where do these two actually diverge', a short list.",
      pains: [
        { h: "Two faces, one product", b: "The same order looked different to the operator and the customer, even though it was the same record in the same database. Nothing tied the views together but a logo." },
        { h: "Rebuilt every time", b: "With no shared base, each feature re-decided buttons, tables and empty states from scratch. Good work never carried to the next screen." },
        { h: "Intent lost in handoff", b: "By the time a feature reached engineering, the reason behind it had fallen off somewhere. What shipped worked, rarely for the reason it started." }
      ]
    },

    principles: [
      { h: "Shared by default", b: "Parts are shared unless a real need forces them apart." },
      { h: "More detail only when asked", b: "The business side can turn on more detail; the customer side keeps the calmer, simpler default." },
      { h: "Own it from idea to launch", b: "The design intent travels with the feature, from first idea to shipped." },
      { h: "Pattern, not just pixels", b: "Parts carry how they behave, not just how they look. That's what makes them reusable." }
    ],

    overview: [
      "EdgeOS is Edgistify's logistics platform, and the product I grew up on. I joined on visual work and left owning whole flows: the operator console, the customer-facing side, and the path from idea to launch.",
      "The hard part was restraint. Letting the two sides sprawl into separate products would have been easy. Most of my work was quietly holding them together, the same building blocks, the same words for the same things, so a feature on one side didn't mean rebuilding it on the other."
    ],
    sections: [
      { k: "01", h: "The operator console", b: "The B2B side, where the work happens. Built to carry dense information without feeling heavy, and to keep one thing clearly most important on every screen." },
      { k: "02", h: "The customer side", b: "The same platform turned outward. One clear answer per screen, no jargon, nothing that assumes you know logistics." },
      { k: "03", h: "Idea to launch", b: "I stayed with features end to end, from client conversations to PM and engineering, so the reason a thing existed survived the trip to shipped." }
    ],

    designSystem: {
      lead: "The shared base of parts is what let EdgeOS grow without splitting in two.",
      items: [
        "Shared core parts with business and customer versions",
        "A 'detail' setting, calm by default, more detail when needed",
        "The same words for status and state on both sides",
        "A handover pattern that travels with the feature, not the team"
      ]
    },

    outcomes: [
      { n: "Business + customer", l: "one joined-up platform" },
      { n: "Idea → launch", l: "owned end to end" },
      { n: "Flagship", l: "Edgistify's main product" }
    ],
    interviewer: {
      lead: "EdgeOS is where I learned to design at platform scale, holding an operator and an everyday customer inside one product, without it feeling like two.",
      points: [
        { h: "My role", b: "Three roles over time, UI intern, then UI/UX, then Product Designer, on EdgeOS throughout, with growing ownership of the operator console and the customer features." },
        { h: "The hardest call", b: "Not splitting the product in two. Two separate looks would have been easier; the better answer was one shared language, with small, deliberate differences only where a real need called for them." },
        { h: "Idea to launch", b: "I guided each feature from first idea to launch, keeping client needs and design intent aligned across PM, engineering and the clients themselves." },
        { h: "If I had more time", b: "A proper set of design tokens, so the two sides share the same theming base, not just the same look." }
      ]
    },
    next: "dual-payment"
  },

  "dual-payment": {
    index: "007",
    title: "Dual Payment Collection",
    client: "Omniful",
    year: "2025",
    one: "In Saudi Arabia, one bill often gets paid two ways at the door: some cash, the rest by card. I designed the flow that lets a delivery partner record both on a single order. They type one amount, the app works out the rest, and proof gets captured when the seller wants it.",
    meta: { role: "Product Designer", timeline: "2025", platform: "Delivery Partner App \u00B7 iOS + Android", team: "PM \u00B7 Eng \u00B7 Me (Design)" },
    tags: ["Payments", "Mobile", "Last-mile", "Fintech UX"],

    challenge: "The app could record one payment method per order. The doorstep had other plans. Customers would hand over 300 in cash and want to put the rest on a card, and the partner had no way to enter that. Deliveries were failing over a few riyals, and when a dispute came up, sellers had no record of how the money actually arrived.",

    goals: {
      business: [
        "Match the app to how people in Saudi Arabia actually pay",
        "Stop losing completed deliveries to a payment technicality",
        "Give sellers a record of how each order was settled"
      ],
      user: [
        "Partners: take two payments on one order without doing math at the door",
        "Partners: never fail a delivery because the customer is short on one method",
        "Sellers: decide for themselves whether proof of payment is required"
      ],
      metrics: [
        "Deliveries failed for payment reasons",
        "Share of orders settled across two methods",
        "Proof captured when a seller requires it"
      ]
    },

    research: {
      methods: ["Delivery-partner interviews", "Seller (merchant) interviews", "Review of the single-payment flow", "Mapping regional payment habits"],
      findings: [
        "Split payments were not an edge case. For a real share of Saudi orders, paying one bill two ways is simply how it goes.",
        "A delivery that failed over a small shortfall cost far more than the shortfall: a wasted trip, a re-attempt, an annoyed customer.",
        "Sellers disagreed with each other. Some wanted a photo of every cash handover. Others considered any extra step a tax on their drivers."
      ]
    },

    insights: {
      lead: "Nothing in the flow was broken. It was built on a wrong assumption: one customer, one method. At a Saudi doorstep it is one customer, two methods, and the app had no answer for that.",
      pains: [
        { h: "One method, two realities", b: "The partner had to book the full amount against a single method. A customer paying part cash, part card could not be served at all." },
        { h: "Failing over pocket change", b: "If the customer came up short on their first method there was no second one to fall back on. The whole delivery failed over the balance." },
        { h: "No record, no defence", b: "Sellers could not see how an order was paid. Every dispute turned into one person's word against another's." },
        { h: "One process forced on every seller", b: "Some sellers wanted strict checks, others wanted speed. The flow gave everyone the same thing and satisfied neither." }
      ]
    },

    principles: [
      { h: "Match the market, don't fight it", b: "Design for how people here actually pay. The split is normal. Treat it that way." },
      { h: "The app does the math", b: "The partner types what they collected. The app works out what remains. Nobody calculates anything standing at a door." },
      { h: "Proof is a setting, not a step", b: "Proof capture turns on per seller. Where it's off, partners never see it. Where it's on, it can't be skipped." },
      { h: "Proof stays with the order", b: "The photo is taken inside the flow and attached to the order record. Nothing lives in a chat thread." }
    ],

    ideation: {
      lead: "The real decision was how many methods to allow and how much typing to trust.",
      alts: [
        { h: "Any number of methods, all typed", b: "The flexible version. Also the slowest and the easiest to get wrong. It solved a three-way split that almost never happens. Rejected." },
        { h: "Two methods, both amounts typed", b: "Capped and simpler, but two hand-typed numbers can still disagree with the bill. Rejected on entry errors." },
        { h: "Two methods, one typed, one computed", b: "The partner types the first amount, the app fills the balance, and the only question left is which method covers it. The totals cannot disagree. Chosen." }
      ],
      tradeoff: "Capping at two gives up the rare three-way split. In exchange, a whole class of arithmetic mistakes stops existing, and the doorstep stays at a few taps."
    },

    overview: [
      "The partner records what they took on the first method. The app shows what remains and carries it to the second. Enter, confirm, done.",
      "Each seller decides whether proof is required. When it is, the partner photographs the cash or the payment confirmation inside the flow, and the order will not close without it. The same flow serves the strict seller and the quick one."
    ],
    sections: [
      { k: "01", h: "Split into two methods", b: "The partner opens collection, records the first method and its amount, and the order splits cleanly in two. Cash plus card, cash plus digital, whichever pair the customer wants." },
      { k: "02", h: "The app works out the balance", b: "The moment the first amount lands, the app shows exactly what is left and assigns it to the second method. The partner confirms it. They never calculate it." },
      { k: "03", h: "Proof, only where it's needed", b: "If the seller requires proof, the capture step is part of the flow: a guided photo of the cash or the confirmation screen. The order cannot complete until it's attached." }
    ],

    designSystem: {
      lead: "Everything was built from the delivery app's existing library so it shipped without a new visual language.",
      items: [
        "Split-payment summary row: method, amount, running balance",
        "Auto-balance field, read-only, filled by the app",
        "Method picker reused from the single-payment flow",
        "Proof-capture step, switched on by a seller setting"
      ]
    },

    validation: {
      lead: "Tested with delivery partners and a sample of sellers, with proof both on and off.",
      changes: [
        { h: "Balance before method", b: "Partners kept picking the second method before they knew what was left on the bill. We flipped the order. See the balance first, then choose what covers it." },
        { h: "Proof you satisfy, not skip", b: "Where proof was required, partners looked for ways around it. We removed the ways around it. Complete stays disabled until proof is attached, with the reason stated right there." }
      ]
    },

    outcomes: [
      { n: "2 methods", l: "on one order" },
      { n: "Auto", l: "balance computed, never typed" },
      { n: "Per seller", l: "proof on or off" }
    ],
    next: "bulk-otp"
  },

  "bulk-otp": {
    index: "008",
    title: "Bulk OTP Verification",
    client: "Omniful",
    year: "2025",
    one: "When one customer orders five packages, the app used to demand five separate codes at the door. I changed it to one. Pick the parcels, send a single OTP, and every box in the set clears at once.",
    meta: { role: "Product Designer", timeline: "2025", platform: "Delivery Partner App \u00B7 iOS + Android", team: "PM \u00B7 Eng \u00B7 Me (Design)" },
    tags: ["Mobile", "Last-mile", "Verification UX", "Delivery"],

    challenge: "Every package needed its own OTP, even when all of them were going to the same person at the same address. Send a code, ask for it, type it, deliver, and then do the whole thing again for the next box. A security step that should take seconds was quietly becoming the slowest part of the stop.",

    goals: {
      business: [
        "Cut the time partners spend on verification at each stop",
        "Stop asking one customer for the same thing five times",
        "Keep the security exactly as strong, with fewer steps"
      ],
      user: [
        "Partners: verify a customer's whole set of packages in one action",
        "Partners: still choose exactly which packages get handed over",
        "Customers: share one code, not one per box"
      ],
      metrics: [
        "Codes requested at a multi-package stop",
        "Time spent on verification at the door",
        "Verifications that fail or get abandoned midway"
      ]
    },

    research: {
      methods: ["Walkthrough of the existing flow", "Delivery-partner shadowing", "Working sessions with the PM", "Failure analysis on repeated codes"],
      findings: [
        "The repetition bought nothing. After the first code, every further one asked the same person to prove the same thing again.",
        "Each extra code was another chance to fail: a mistyped digit, a delayed SMS, a customer who wandered off between boxes.",
        "Partners already talked about 'this customer's packages' as one thing. Only the app insisted on treating each box as a stranger."
      ]
    },

    insights: {
      lead: "The check itself was fine. It just ran too many times. What the code actually verifies is the customer, not the cardboard, and one customer only needs verifying once.",
      pains: [
        { h: "Verification on repeat", b: "Send, ask, type, deliver. Then again. Then again. The same ritual for every box in the order." },
        { h: "More codes, more ways to fail", b: "A slow text or one wrong digit could stall the delivery, and the flow multiplied those chances by the number of packages." },
        { h: "Minutes where seconds should be", b: "A customer with five parcels turned a moment of security into a small ceremony, with both people waiting on their phones." }
      ]
    },

    principles: [
      { h: "One customer, one check", b: "Group the packages that belong to the same person and verify them together. Trust attaches to the customer, not the box." },
      { h: "Fewer steps, never fewer safeguards", b: "The code stays. What goes is asking for it more times than security actually needs." },
      { h: "The partner keeps control of the set", b: "One code can clear many packages, but the partner decides exactly which ones are in the set before it's sent." },
      { h: "Status per package, always", b: "After the check, each box carries its own Verified state, so nobody hands over the wrong one." }
    ],

    ideation: {
      lead: "Grouping was obviously right. The question was how much control to keep while doing it.",
      alts: [
        { h: "Leave it one at a time", b: "Familiar, safe, and it preserved all the waste. Rejected." },
        { h: "Auto-clear the whole stop", b: "One code silently clears everything at the address. Fastest on paper, but it takes the handover decision away from the partner. Rejected." },
        { h: "Pick the set, verify once", b: "The partner selects the packages, one code verifies the selection, and each package gets its own status. Nearly as fast, and the partner stays in charge. Chosen." }
      ],
      tradeoff: "The selection step costs one tap. That tap is what lets a partner hand over three boxes now and keep two for later, so it stays."
    },

    overview: [
      "The partner picks every package for the customer, or taps Select all, and sends one code. When it checks out, the picked boxes flip to Verified and the rest stay pending.",
      "Nothing about the security changed. Same code, same customer confirmation. The app just stopped asking for it once per box."
    ],
    sections: [
      { k: "01", h: "Pick the packages", b: "Selection comes first, so the code covers exactly the right set. All of them by default, fewer if the partner is holding something back." },
      { k: "02", h: "One code for the set", b: "A single OTP is sent and entered once, whether the set is two packages or six. The box-by-box ritual is gone." },
      { k: "03", h: "Status, then handover", b: "Each verified package shows its own state. Hand over the whole set, or some now and the rest on a later attempt. Partial deliveries survive." }
    ],

    designSystem: {
      lead: "Built from the delivery app's existing parts, so it dropped in without a new look.",
      items: [
        "Selectable package card with a per-package Verified state",
        "Count-aware action bar: 'Verify 4', 'Deliver 2 of 3'",
        "Single-code sheet scoped to the current selection",
        "Status tag per package, Pending to Verified"
      ]
    },

    validation: {
      lead: "Tested against the old one-at-a-time flow with delivery partners.",
      changes: [
        { h: "Show what the code covers", b: "Partners couldn't always tell which packages one code was about to clear, so the selected set is now listed inside the code sheet itself. You see what you're confirming before you confirm it." },
        { h: "Make the check final, visibly", b: "A verified set can't be un-verified. Rather than warn people after the fact, the sheet says so up front, in place, before the commit." }
      ]
    },

    outcomes: [
      { n: "1 code", l: "for the whole customer" },
      { n: "0 repeats", l: "no box-by-box ritual" },
      { n: "Partial", l: "hand over some, keep the rest" }
    ],
    interviewer: {
      lead: "I found a small everyday waste hiding inside a 'finished' flow and removed it without touching the security it exists for.",
      points: [
        { h: "My role", b: "Only designer on the feature, working directly with the PM from the first walkthrough to the shipped design." },
        { h: "The hardest call", b: "How much to automate. Auto-clearing the whole stop was fastest, but it silently decided the handover for the partner. I kept the selection step so speed never costs control." },
        { h: "Security, untouched", b: "The brief was never to remove the code. It was to stop asking for it more times than the check is worth. Same safeguard, one round trip." },
        { h: "If I had more time", b: "Pre-group the packages by customer when the partner arrives at a stop, so the set is already selected and they just confirm it." }
      ]
    },
    next: "app-builder-shopify"
  },

  "app-builder-shopify": {
    index: "009",
    title: "App Builder, Shopify-aligned",
    client: "Omniful · Shopify App Store",
    year: "2025",
    one: "We rebuilt our no-code App Builder to match Shopify's design language (Polaris), so a product that lives inside Shopify finally looks like it belongs there.",
    meta: { role: "Product / UI Designer", timeline: "2025 · 10 days", platform: "Web · Shopify Embedded App", team: "PM · Designer (Me) · Eng" },
    tags: ["Design System", "Polaris", "No-Code", "Web"],
    heroImage: "screens-img/theme-library.png",
    heroImageLabel: "App Builder · Theme library",
    heroUrl: "apps.shopify.com/omniful",

    challenge: "Our no-code App Builder is on the Shopify App Store, but it grew with no single design language. Screens built at different times looked and behaved differently, what mattered on a screen wasn't always clear, and the whole thing felt disconnected from Shopify, putting the app's quality, ranking and visibility at risk.",

    goals: {
      business: [
        "Follow Shopify's design guidelines",
        "Raise the app's quality, and its ranking and visibility in the store",
        "Build a base that can grow with future features"
      ],
      user: [
        "Give sellers an interface that feels at home in Shopify",
        "Make every screen behave the same, predictable way",
        "Make each section take less effort to understand"
      ],
      metrics: [
        "How much the same parts get reused across screens",
        "Time to hand a design over to engineering",
        "How consistent the parts are across the app"
      ]
    },

    research: {
      methods: ["Review of the existing screens", "Read of Shopify's Polaris guidelines", "List of all the parts in use", "Lining up with stakeholders"],
      findings: [
        "Screens built at different times followed different styles, same action, different look.",
        "Parts were inconsistent across the app, so every new screen re-decided the basics.",
        "Shopify recommends Polaris for apps that live inside it; matching it is tied to the app's quality and visibility."
      ]
    },

    insights: {
      lead: "The product wasn't missing features. It was missing a system. The real problem was inconsistency, not capability.",
      pains: [
        { h: "Many screens, no shared style", b: "Layouts and parts were different across the app. Sellers had to relearn each section instead of carrying one way of thinking through it." },
        { h: "Unclear what matters", b: "Information and actions weren't grouped in a predictable way, so people spent extra effort working out each screen before they could act." },
        { h: "Disconnected from Shopify", b: "Living inside Shopify but not matching its style made the app feel foreign, and left quality and visibility on the table." }
      ]
    },

    principles: [
      { h: "Use Shopify's style", b: "Use familiar Polaris patterns so sellers learn the product faster and it feels at home in Shopify." },
      { h: "Consistency over looks", b: "The goal wasn't a prettier coat of paint. It was one consistent system that grows with the product." },
      { h: "Reuse before reinventing", b: "Make common actions and layouts standard instead of adding new complexity for every screen." },
      { h: "Order you can scan", b: "Group content and actions in a predictable way, so each screen reads in seconds, not minutes." }
    ],

    overview: [
      "I rebuilt the App Builder on Shopify's design language and a set of reusable parts. Because the product lives on the Shopify App Store, matching Polaris lifts quality, feels familiar to sellers, and improves ranking and visibility inside Shopify.",
      "The new version brought consistent layouts, a clearer sense of what matters per screen, standard parts, and tighter structure, a base that can grow, not a coat of paint."
    ],
    sections: [
      { k: "01", h: "Shopify-style parts", b: "Brought in parts and patterns based on Polaris, consistent buttons and forms, standard cards and layouts, and reusable patterns across screens, replacing the mix of styles that had built up over time." },
      { k: "02", h: "Clearer order on each screen", b: "Reorganised content and actions into a clearer structure with better spacing and grouping, so people stop spending effort just to find where things are." },
      { k: "03", h: "A base that can grow", b: "Made reusable patterns that support future features, faster to design, easier to build, and more consistent from one release to the next." }
    ],

    designSystem: {
      lead: "This is a system, not a set of screens, Polaris-style parts that drop into any section and keep the app speaking one language.",
      items: [
        "Polaris-style buttons, inputs and form patterns",
        "Standard cards, banners and pop-ups",
        "Shopify admin frame, top bar + left menu",
        "A reusable builder for grids, strips and carousels",
        "Consistent spacing, order, and empty/loading states"
      ]
    },

    validation: {
      lead: "The key decisions that kept the rebuild true to its goal.",
      changes: [
        { h: "Used Shopify's design style", b: "Since the product lives inside Shopify, familiar patterns help sellers learn faster and feel more at home." },
        { h: "Chose consistency over new looks", b: "The point wasn't looks for their own sake. It was a system that can grow with the product." },
        { h: "Reused existing patterns wherever we could", b: "Instead of adding complexity, I made common actions and layouts standard, so the app gets easier to maintain, not harder." }
      ]
    },

    outcomes: [
      { n: "1 system", l: "consistent across the App Builder" },
      { n: "Polaris", l: "matched to Shopify's style" },
      { n: "Can grow", l: "a base for future features" }
    ],
    next: "vehicle-maintenance"
  },

  "vehicle-maintenance": {
    index: "010",
    title: "Vehicle Maintenance",
    client: "Omniful · TMS",
    year: "2025",
    one: "A vehicle-servicing tool inside the Omniful transport system, service plans, reminders and full service history that keep a fleet on the road without anyone remembering when the next service is due.",
    meta: { role: "Product Designer", timeline: "2025", platform: "TMS · Web", team: "PM · 3 Eng · Fleet Ops" },
    tags: ["TMS", "Fleet", "Web", "Data Tables"],
    heroImage: "screens-img/veh-reminders-all.png",
    heroImageLabel: "Vehicle Maintenance · Reminders",
    heroUrl: "app.omniful.com/maintenance/reminders",

    challenge: "Fleet teams tracked servicing in spreadsheets and from memory. There was no single place to see what was due, overdue, or done, so services slipped, vehicles broke down out of the blue, and nothing could be proven. The transport system ran the trips but knew nothing about the health of the vehicles running them.",

    goals: {
      business: [
        "Make fleet servicing a tracked process you can prove, inside the transport system",
        "Cut surprise breakdowns from missed or late servicing",
        "Reuse the existing Omniful table, form and pop-up parts"
      ],
      user: [
        "See at a glance what's due, due soon, and overdue",
        "Set a reminder once and stop tracking it by hand",
        "Log a finished service, with proof, in seconds"
      ],
      metrics: [
        "Reminders acted on before the due date",
        "Overdue services as a share of the fleet",
        "Time to log a finished service"
      ]
    },

    research: {
      methods: ["Fleet-team interviews", "Review of the current workflow", "List of transport-system parts in use", "Lining up with stakeholders"],
      findings: [
        "Servicing lived completely outside the system, in spreadsheets, WhatsApp and people's heads.",
        "Teams didn't want another dashboard; they wanted to be told what needed attention and when.",
        "The same vehicle list, table and side-panel parts already existed elsewhere in the system, so this should feel native, not new."
      ]
    },

    insights: {
      lead: "The job isn't tracking, it's being reminded. Teams don't want to watch a fleet's health; they want the system to surface the one thing that needs doing today.",
      pains: [
        { h: "No single source of truth", b: "Service records were scattered, so no one could trust the answer to 'is this vehicle due for anything?' without digging." },
        { h: "Remembered, not prompted", b: "Servicing was something people had to remember, not something the system flagged. By the time someone noticed, the vehicle was already overdue." },
        { h: "No proof, no history", b: "Finished services left no record in the system, so you couldn't prove the servicing or show it at resale." }
      ]
    },

    principles: [
      { h: "Open on what's overdue, not everything", b: "Teams check this between trips, not at a desk. So the table opens on what's slipping, overdue and due-soon at the top, instead of making them filter a full list to find the one vehicle that needs them today." },
      { h: "Make status clear at a glance", b: "I used colour and a plain 'time left' column so someone can scan a row and know where it stands without reading every field. The status had to survive a quick glance on a busy screen." },
      { h: "Reuse what the system already had", b: "This sits next to trips and vehicles people already use every day, so I built it from the same tables, side-panels and pop-ups. A new pattern for servicing would've been friction no one asked for." },
      { h: "Slow down the actions that bite", b: "Deleting a reminder or closing out a service is hard to undo, so those ask for a clear confirm. Everything else stays one tap, I only added friction where a wrong click actually costs something." }
    ],

    overview: [
      "Omniful's transport system could plan a trip but knew nothing about the vans running them. I picked up the maintenance module to close that gap, the place a fleet team goes to stay ahead of servicing instead of reacting to a breakdown.",
      "I built it around the Reminders table, because that's the screen a team actually opens between trips. Everything else, service plans, vehicle history, proof of work, feeds that one view, and all of it reuses tables and panels the transport system already has, so it never feels like a separate product bolted on."
    ],
    sections: [
      { k: "01", h: "Reminders that lead with what's urgent", b: "The reminders table is split into All, Due soon and Overdue, with colour-coded status and a time-left column, so the work that matters today is the first thing you see." },
      { k: "02", h: "Set a plan, attach vehicles", b: "A service plan groups repeating tasks once and applies them across selected vehicles, so a reminder is set up a single time instead of vehicle by vehicle." },
      { k: "03", h: "Done, logged and proven", b: "Marking a service done writes it to the vehicle's history with cost, notes and uploaded proof, turning the module into a record you can prove, not just a list of alerts." }
    ],

    designSystem: {
      lead: "Built entirely from the existing Omniful transport-system parts, the servicing module added behaviour, not a new look.",
      items: [
        "Data table with colour-coded rows + a time-left column",
        "Add-reminder and add-service-history side panels",
        "Confirm pop-ups for delete (single + bulk) and mark-done",
        "Service-plan builder that groups repeating tasks",
        "Reusable filters, search, tags and paging"
      ]
    },

    validation: {
      lead: "Decisions that kept the module true to how fleet teams actually work.",
      changes: [
        { h: "Lead with due soon + overdue", b: "Early versions opened on a full archive of reminders. Teams ignored it. Opening on what's urgent first made the table something they checked every day." },
        { h: "History needs proof", b: "Logging a service with no evidence left the same trust gap as the spreadsheet. We built proof-of-service upload into the 'mark done' step itself." },
        { h: "Bulk, but guarded", b: "Teams clear out many stale reminders at once, so bulk delete shipped, behind a clear confirm, so no one wipes live reminders by accident." }
      ]
    },

    outcomes: [
      { n: "1 screen", l: "for the whole fleet's servicing" },
      { n: "Due / overdue", l: "urgent reminders first" },
      { n: "Proven", l: "service history with proof" }
    ],
    interviewer: {
      lead: "The real work here was restraint. This could have grown into a whole maintenance product; what the team needed was one screen they trusted, not another system to learn.",
      points: [
        { h: "My role", b: "I owned the module end to end, from sitting with fleet ops through shipping it with one PM and three engineers, reusing the transport system's existing tables, side-panels and pop-ups." },
        { h: "The hardest call", b: "Deciding what to leave out. I dropped the dashboard and the charts people half-expected, and spent that room making the reminders table honest at a glance instead, colour, time-left, and actions on the row." },
        { h: "If I had more time", b: "I'd wire servicing back into trip planning, so a van that's overdue quietly drops out of tomorrow's assignable list instead of waiting for someone to catch it." }
      ]
    },
    next: "edgistify-website"
  },

  "edgistify-website": {
    index: "011",
    title: "Edgistify Website",
    client: "Edgistify · Marketing Site",
    year: "2023",
    one: "A ground-up redesign of Edgistify's marketing site, from a dated, all-green page with no identity into a modern, confident brand that matched the company it had grown into.",    meta: { role: "Product / Brand Designer", timeline: "2023", platform: "Marketing Website", team: "Founder · Marketing · 2 Eng" },
    tags: ["Website", "Brand", "Marketing", "Responsive"],
    heroImage: "screens-img/edge-home-hero.png",
    heroImageLabel: "Edgistify · Home",
    heroUrl: "edgistify.com",

    challenge: "Edgistify had outgrown its website. It had added warehousing, same-day delivery, transport and its own platform, but the site still read like a single-service startup: flat, all-green, text-heavy, no identity. It looked dated next to the supply-chain partner Edgistify had become, and wasn't winning trust from the brands it wanted to sign.",

    goals: {
      business: [
        "Present Edgistify as a modern, trustworthy supply-chain partner",
        "Show the full range of services, not just warehousing",
        "Win trust with growing brands choosing a partner"
      ],
      user: [
        "Understand what Edgistify does in the first scroll",
        "Find the service that fits them without hunting",
        "Reach a person, book a call, from anywhere on the page"
      ],
      metrics: [
        "Demo / call requests from the site",
        "Time on page and how far people scroll",
        "Bounce rate on the homepage"
      ]
    },

    research: {
      methods: ["Teardown of the old site", "Look at competitors in the category", "Founder & sales interviews", "List of all the content"],
      findings: [
        "The all-green colour and flat layout made a serious B2B company look small and dated.",
        "Sales kept re-explaining services the site never made clear, the range was invisible.",
        "Every strong competitor led with results and proof; Edgistify led with a wall of green text."
      ]
    },

    insights: {
      lead: "The site wasn't missing information. It was missing a point of view. It listed what Edgistify did without ever making you feel they were the modern partner they'd become.",
      pains: [
        { h: "No identity to hold on to", b: "One flat green, one weight of text. Nothing said brand, showed what mattered most, or pointed you where to look first." },
        { h: "Services buried", b: "Warehousing, delivery, transport and the tech platform all read at the same level, so the range never landed." },
        { h: "No proof, no momentum", b: "The numbers that make a logistics partner credible, orders, warehouses, cities, were nowhere near the top." }
      ]
    },

    principles: [
      { h: "Lead with the outcome", b: "The first screen had to answer ‘can they actually deliver for me?’ before any scroll. So the hero leads with same-day, Pan-India, the promise that sells, and the proof numbers sit right behind it." },
      { h: "Give the green a structure", b: "The brand teal stays, it's theirs, but I built a confident near-black system around it and used it deliberately, so it reads modern and intentional instead of the old flat wash of green." },
      { h: "Make the range scannable", b: "Each service gets its own card or tab with a hard number, so the breadth Edgistify had grown into is something you scan in seconds, not something sales has to keep explaining." },
      { h: "One action, everywhere", b: "‘Schedule a call’ rides the whole page, nav included, the site's job is to start a conversation, so that action is never more than a glance away." }
    ],

    overview: [
      "I rebuilt the Edgistify homepage from scratch, new structure, new look, new order, to present the established partner the company had become. It keeps Edgistify's teal but rebuilds around it: a confident near-black canvas, one large serif moment, and a clear hierarchy the old single-weight, all-green site never had.",
      "The page opens on one promise, same-day delivery, Pan-India, and the proof behind it: daily orders, warehouses, cities. From there it walks the full service range, the industries served, why Edgistify, and the network, before resolving on a clear invitation to talk. Every section points back to one action: schedule a call."
    ],
    sections: [
      { k: "01", h: "A hero that states the promise", b: "One headline leads with the outcome that sells, same-day delivery, Pan-India, with the proof numbers a scroll away, so credibility lands before the fold does." },
      { k: "02", h: "A standout brand moment", b: "A full-width teal break with a serif ‘Design your supply chain’ line, the brand voice the old site never had, giving the eye a rest between dense sections." },
      { k: "03", h: "The full range, made scannable", b: "Warehousing, same-day delivery, technology, transportation, consulting, each its own card or tab with a hard number, so the breadth is obvious at a glance." }
    ],

    designSystem: {
      lead: "A small, deliberate system, built so the brand teal finally has structure around it.",
      items: [
        "Brand teal anchored on a confident near-black canvas",
        "Outfit for UI + Noto Serif for the one editorial display moment",
        "Clear order of headings and text the old single-weight page never had",
        "Reusable stat, service, industry and pillar cards",
        "Persistent ‘Schedule a call’ across nav, hero and CTA band"
      ]
    },

    validation: {
      lead: "Calls that shaped the redesign as it came together.",
      changes: [
        { h: "Keep the green, lose the flatness", b: "Dropping the brand green entirely felt like a different company. The fix was keeping it but giving it a darker system and a gradient, so it reads modern without losing recognition." },
        { h: "Proof above the fold", b: "The credibility numbers started lower down. Pulling daily-orders / warehouses / cities up near the hero made the page feel substantiated immediately." },
        { h: "Services as cards, not a list", b: "A bulleted list hid the range. Breaking each service into a card with an icon is what finally made the breadth read at a glance." }
      ]
    },

    outcomes: [
      { n: "New identity", l: "modern, not all-green" },
      { n: "Full range", l: "every service made clear" },
      { n: "1 action", l: "schedule a call, everywhere" }
    ],
    next: "stock-on-wheel"
  },

  "omniful-ds": {
    index: "012",
    title: "Omniful Design System",
    client: "Omniful",
    year: "2024–25",
    one: "The component language behind Omniful's WMS, OMS and delivery products — 55 tokens, 230 custom icons and 30+ components, built so every new screen ships looking like it was always there.",
    meta: { role: "Product Designer · DS Owner", timeline: "2024–25 · ongoing", platform: "Web · Figma library", team: "Me (Design) · Frontend leads" },
    tags: ["Design System", "Foundations", "Components", "Web"],
    heroUrl: "omniful.com/design",

    challenge: "Omniful ships fast across three products — WMS, OMS, TMS — and every squad was redrawing the same buttons, tables and dropdowns slightly differently. Blues drifted, radii wobbled, disabled states meant different things on different screens. The cost wasn't just visual: engineers rebuilt components that already existed, and every review argued about pixels instead of flows.",

    goals: {
      business: [
        "Stop paying for the same component twice — design once, reuse everywhere",
        "Make three products feel like one platform",
        "Cut review time spent on visual nitpicks to near zero"
      ],
      user: [
        "Designers: never redraw a checkbox again — grab it, drop it, ship",
        "Engineers: one source of truth for values, states and behavior",
        "Operators: identical patterns on every screen, so learning transfers"
      ],
      metrics: [
        "Component reuse rate across new screens",
        "Time from wireframe to dev-ready design",
        "Visual-inconsistency comments in review"
      ]
    },

    research: {
      methods: ["Audit of every live screen across WMS / OMS / TMS", "Inventory of duplicated components", "Sessions with frontend leads", "Benchmark against Polaris, Carbon and Ant"],
      findings: [
        "The audit found 9 button variants that should have been 3, and 5 different greys doing the job of one border color.",
        "Dense tables were the real product — an 8-point spacing grid couldn't handle them; rows needed 2 and 4px steps.",
        "Generic icon packs kept failing the domain. There's no off-the-shelf glyph for a picking wave or a return gate entry."
      ]
    },

    insights: {
      lead: "Ops software earns trust through sameness. The system's job wasn't to be beautiful — it was to make every screen boringly predictable, so the operator's eye learns once and reads forever.",
      pains: [
        { h: "Color meant nothing", b: "Blue was sometimes a link, sometimes a status, sometimes decoration. Nobody could read a screen by color alone." },
        { h: "Every squad had a private system", b: "Three products, three sets of near-identical components, all maintained separately and drifting further apart with every sprint." },
        { h: "Density fought the grid", b: "8-point spacing looked tidy in mockups and wasteful in a 50-column table an operator scans eight hours a day." }
      ]
    },

    principles: [
      { h: "Blue is interactive, color is status", b: "One primary (#5468FA) carries every clickable affordance. Six accent hues exist only inside status tags. If it's colored, it means something." },
      { h: "Rhythm by rule, not by eye", b: "Line-height is always font-size × 1.5. Spacing runs a fixed 12-step scale with a tight low end for tables. No per-screen eyeballing." },
      { h: "Size is a token, never a decision", b: "Buttons come in exactly three sizes — 40/36/24 with paired radii and icon sizes. You pick a size, not a height." },
      { h: "Speak warehouse", b: "230 custom icons drawn for the domain — Hub, Picking Wave, Manifest — because an operator shouldn't decode a metaphor mid-shift." }
    ],

    ideation: {
      lead: "The real decisions were about discipline: how strict the system should be, and where flexibility was worth its cost.",
      alts: [
        { h: "Adopt an open-source system", b: "Polaris or Ant would be fast, but they're built for commerce admin, not warehouse density — and the products would forever look like someone else's. Rejected." },
        { h: "Tokens only, no components", b: "Just publish colors and spacing, let squads build. Cheaper, but the audit proved squads diverge the moment they build alone. Rejected." },
        { h: "Full system: tokens + components + rules", b: "Foundations, 30+ interactive components, and written usage rules (one primary CTA per area, toggles never in forms). Slower to build, but it's the only version that actually stops drift. Chosen." }
      ],
      tradeoff: "A strict system costs expressiveness — some screens want a fourth button size and don't get one. That's the point: the friction of requesting a new variant is what keeps the system meaning something."
    },

    overview: [
      "The system covers foundations (color, type, spacing, radius, icons), core inputs, navigation, feedback and data display — every component with real hover, focus, disabled and error states, documented with the reasoning behind it.",
      "It ships as a Figma library for design and a token sheet for engineering, so the same 55 values drive both sides. Explore the whole thing live below."
    ],
    sections: [
      { k: "01", h: "Foundations that do the deciding", b: "One primary, a disciplined grey ramp, Poppins with mathematical line-heights, and a spacing scale built for dense tables. Most layout decisions are already made before a screen starts." },
      { k: "02", h: "Components with every state", b: "Buttons, inputs, dropdowns, tables, sheets, modals, toasts — each with hover, focus, error, disabled and loading designed, so engineers never invent an edge state." },
      { k: "03", h: "Rules that travel", b: "One primary CTA per area. Toggles never inside forms. Color only for status. Written rules mean the system survives contact with deadlines." }
    ],

    designSystem: {
      lead: "The numbers behind the library — explore all of it, live and interactive.",
      items: [
        "55 design tokens: spacing, radius, CTA sizes, strokes",
        "230 domain icons on a 16×16 currentColor grid",
        "30+ components across inputs, navigation, feedback and data",
        "6 status hues, reserved exclusively for tags",
        "3 button sizes — 40/36/24 — with paired radii and icon sizes"
      ]
    },

    validation: {
      lead: "Tested the way a system should be: by building real screens with it.",
      changes: [
        { h: "The table needed a smaller checkbox", b: "The 18px form checkbox crowded 44px rows. Rather than let squads shrink it ad hoc, a 14px table variant became part of the system — one sanctioned size instead of five improvised ones." },
        { h: "Search stopped looking like an input", b: "Operators kept missing the search field among form inputs. Giving search its own grey (#FAFAFA) made 'type to filter' visually distinct from 'fill this form'." }
      ]
    },

    outcomes: [
      { n: "1 source", l: "of truth for 3 products" },
      { n: "230 icons", l: "drawn for the domain" },
      { n: "0 redraws", l: "grab, drop, ship" }
    ],
    interviewer: {
      lead: "I built and own the design system that three product squads ship on — from the audit that justified it to the tokens engineers consume.",
      points: [
        { h: "My role", b: "Sole designer on the system: the audit, the foundations, every component, the usage rules, and the ongoing governance of what gets in." },
        { h: "The hardest call", b: "Saying no. Every squad wants one custom variant, and each one is reasonable alone. The system only works because the default answer is the existing component." },
        { h: "Built for density", b: "Most systems are built for marketing pages and fall apart in a 50-column table. This one starts from the table and works outward." },
        { h: "If I had more time", b: "Dark mode tokens and a proper Figma-variable pipeline so token changes propagate to code without a handoff step." }
      ]
    },
    next: "stock-on-wheel"
  }
};

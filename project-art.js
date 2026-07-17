/* ============================================================
   PROJECT ART — isometric SVG illustrations per case study
   Wireframe amber-on-black; viewBox 0 0 800 500; designed to
   render inside .p-visual (hero) and .pcard__thumb (homepage card).
   ============================================================ */
(function () {
  'use strict';

  // shared svg defs (filter + grid backdrop). Inlined once per SVG to keep
  // each illustration self-contained for any consumer.
  function shell(inner, id) {
    return `
<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" class="iso iso--${id}" role="img" aria-label="${id}">
  <defs>
    <filter id="g-${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="lg-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ff5b2e" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#ff5b2e" stop-opacity="0"/>
    </linearGradient>
    <pattern id="dots-${id}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
      <circle cx="1" cy="1" r="1" fill="#ff5b2e" opacity="0.18"/>
    </pattern>
  </defs>
  <!-- isometric floor grid -->
  <g stroke="rgba(255,91,46,0.18)" stroke-width="0.6" fill="none">
    ${isoFloor()}
  </g>
  ${inner}
</svg>`;
  }

  function isoFloor() {
    // diamond floor of iso lines
    const cx = 400, cy = 380, w = 30, h = 15, n = 12;
    let s = '';
    for (let i = -n; i <= n; i++) {
      s += `<line x1="${cx + i * w}" y1="${cy - n * h}" x2="${cx + i * w + n * w}" y2="${cy}"/>`;
      s += `<line x1="${cx + i * w}" y1="${cy - n * h}" x2="${cx + i * w - n * w}" y2="${cy}"/>`;
    }
    return s;
  }

  // ---------- 1) Stock on Wheel — iso box truck + stacked crates ----------
  const stockOnWheel = shell(`
    <!-- ground shadow -->
    <ellipse cx="400" cy="430" rx="220" ry="22" fill="url(#lg-sow)" opacity="0.6"/>
    <!-- stacked crates (left) -->
    <g stroke="#ff5b2e" stroke-width="1.4" fill="rgba(255,91,46,0.06)">
      <!-- crate 1 -->
      <path d="M150,330 L210,300 L210,360 L150,390 Z"/>
      <path d="M210,300 L270,330 L270,390 L210,360 Z" fill="rgba(255,91,46,0.12)"/>
      <path d="M150,330 L210,300 L270,330 L210,360 Z" fill="rgba(255,91,46,0.18)"/>
      <line x1="180" y1="315" x2="180" y2="375" stroke-dasharray="2 3"/>
      <line x1="240" y1="345" x2="240" y2="375" stroke-dasharray="2 3"/>
      <!-- crate 2 (smaller, on top) -->
      <path d="M190,275 L230,255 L230,295 L190,315 Z"/>
      <path d="M230,255 L270,275 L270,315 L230,295 Z" fill="rgba(255,91,46,0.12)"/>
      <path d="M190,275 L230,255 L270,275 L230,295 Z" fill="rgba(255,91,46,0.2)"/>
    </g>
    <!-- box truck (right) -->
    <g stroke="#ff5b2e" stroke-width="1.6" fill="rgba(255,91,46,0.05)">
      <!-- cargo box -->
      <path d="M340,250 L500,170 L640,240 L480,320 Z" fill="rgba(255,91,46,0.1)"/>
      <path d="M340,250 L340,360 L480,430 L480,320 Z" fill="rgba(255,91,46,0.18)"/>
      <path d="M480,320 L640,240 L640,350 L480,430 Z" fill="rgba(255,91,46,0.08)"/>
      <!-- door lines -->
      <line x1="380" y1="270" x2="380" y2="378" stroke-dasharray="3 4"/>
      <line x1="440" y1="300" x2="440" y2="408" stroke-dasharray="3 4"/>
      <!-- cab -->
      <path d="M620,250 L700,290 L700,330 L640,360 L640,310 Z" fill="rgba(255,91,46,0.14)"/>
      <path d="M640,310 L700,290" />
      <!-- wheels -->
      <ellipse cx="395" cy="395" rx="14" ry="7" fill="#0a0c11" stroke="#ff5b2e"/>
      <ellipse cx="455" cy="425" rx="14" ry="7" fill="#0a0c11" stroke="#ff5b2e"/>
      <ellipse cx="665" cy="345" rx="14" ry="7" fill="#0a0c11" stroke="#ff5b2e"/>
    </g>
    <!-- signal dot on truck -->
    <circle cx="500" cy="195" r="4" fill="#ff5b2e">
      <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite"/>
    </circle>
    <circle cx="500" cy="195" r="10" fill="none" stroke="#ff5b2e" opacity="0.5">
      <animate attributeName="r" values="6;22;6" dur="2.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.7;0;0.7" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <!-- readout label -->
    <g font-family="ui-monospace, monospace" font-size="11" fill="#ff5b2e" letter-spacing="2">
      <text x="60" y="58">STOCK.ON.WHEEL // LIVE</text>
      <text x="60" y="78" fill="#9a978f">UNIT-082 · TRACKING</text>
    </g>
  `, 'sow');

  // ---------- 2) TMS & Delivery — iso route w/ nodes + vehicle ----------
  const tmsDelivery = shell(`
    <g stroke="#ff5b2e" stroke-width="1.4" fill="none">
      <!-- route line (iso path) -->
      <path d="M140,360 L230,310 L310,340 L400,290 L500,320 L580,270 L680,300"
            stroke-dasharray="6 5" stroke-width="2"/>
      <!-- nodes -->
      ${[[140,360],[230,310],[310,340],[400,290],[500,320],[580,270],[680,300]].map(([x,y])=>`
        <circle cx="${x}" cy="${y}" r="6" fill="rgba(255,91,46,0.2)" stroke="#ff5b2e"/>
        <circle cx="${x}" cy="${y}" r="14" stroke="rgba(255,91,46,0.4)" stroke-dasharray="2 3"/>
      `).join('')}
    </g>
    <!-- vehicle (iso van mid-route) -->
    <g stroke="#ff5b2e" stroke-width="1.4">
      <path d="M380,250 L440,222 L500,250 L500,295 L440,323 L380,295 Z" fill="rgba(255,91,46,0.16)"/>
      <path d="M440,222 L440,323" stroke-dasharray="2 2"/>
      <path d="M500,250 L500,295" stroke-dasharray="2 2"/>
      <ellipse cx="395" cy="305" rx="9" ry="4" fill="#0a0c11"/>
      <ellipse cx="485" cy="305" rx="9" ry="4" fill="#0a0c11"/>
    </g>
    <!-- payment pop on a node -->
    <g transform="translate(580 200)">
      <rect x="0" y="0" width="78" height="44" fill="rgba(255,91,46,0.08)" stroke="#ff5b2e" stroke-width="1.2"/>
      <text x="8" y="17" font-family="ui-monospace,monospace" font-size="9" fill="#ff5b2e" letter-spacing="1.4">PoD + PAY</text>
      <text x="8" y="33" font-family="ui-monospace,monospace" font-size="10" fill="#e9e7e2">₹ 2,480.00</text>
      <path d="M58 44 L62 58 L70 50" stroke="#ff5b2e" stroke-width="1.2" fill="none"/>
    </g>
    <!-- readout -->
    <g font-family="ui-monospace, monospace" font-size="11" fill="#ff5b2e" letter-spacing="2">
      <text x="60" y="58">TRIP // 0412-K</text>
      <text x="60" y="78" fill="#9a978f">7 STOPS · 38KM · 4H 12M</text>
    </g>
  `, 'tms');

  // ---------- 3) Demand Forecasting — iso bars + trend ----------
  const demandForecasting = shell(`
    <!-- bar chart cluster -->
    <g stroke="#ff5b2e" stroke-width="1.4">
      ${[80,140,90,180,150,220,170,260,230,300].map((h,i)=>{
        const x = 200 + i*44;
        const y = 380 - h;
        const d = 18; // depth
        const w = 28;
        const fill = i === 9 ? 0.32 : 0.12 + i*0.018;
        return `
          <path d="M${x},${y} L${x+w},${y-d} L${x+w},${380-d} L${x},380 Z" fill="rgba(255,91,46,${fill})"/>
          <path d="M${x+w},${y-d} L${x+w+d*0.6},${y-d*0.4} L${x+w+d*0.6},${380-d*0.4} L${x+w},${380-d} Z" fill="rgba(255,91,46,${fill+0.06})"/>
          <path d="M${x},${y} L${x+w},${y-d} L${x+w+d*0.6},${y-d*0.4} L${x+d*0.6},${y+d*0.6}  Z" fill="rgba(255,91,46,${fill+0.12})"/>
        `;
      }).join('')}
    </g>
    <!-- forecast trend line (above bars) -->
    <path d="M214,300 Q280,260 320,240 T440,180 T580,130 T700,90" fill="none" stroke="#ff5b2e" stroke-width="2" stroke-dasharray="4 4"/>
    <!-- forecast endpoint -->
    <circle cx="700" cy="90" r="6" fill="#ff5b2e"/>
    <circle cx="700" cy="90" r="14" fill="none" stroke="#ff5b2e" opacity="0.5">
      <animate attributeName="r" values="8;24;8" dur="2.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite"/>
    </circle>
    <!-- axis ticks -->
    <g stroke="rgba(255,91,46,0.3)" stroke-width="0.6">
      <line x1="200" y1="380" x2="700" y2="380"/>
      <line x1="200" y1="380" x2="200" y2="80"/>
    </g>
    <g font-family="ui-monospace, monospace" font-size="11" fill="#ff5b2e" letter-spacing="2">
      <text x="60" y="58">DEMAND.FORECAST</text>
      <text x="60" y="78" fill="#9a978f">+24.6% Δ · 90D OUTLOOK</text>
    </g>
  `, 'df');

  // ---------- 4) Route Optimization — iso map grid + pins ----------
  const routeOpt = shell(`
    <!-- iso map blocks -->
    <g stroke="#ff5b2e" stroke-width="0.9" fill="rgba(255,91,46,0.05)">
      ${(()=> {
        let s='';
        for (let r=0; r<5; r++) for (let c=0; c<6; c++) {
          const x = 220 + c*70 + r*14;
          const y = 200 + r*32 - c*0;
          s += `<path d="M${x},${y} L${x+50},${y-12} L${x+50},${y+18} L${x},${y+30} Z" fill="rgba(255,91,46,${0.04 + (r*c)%3 * 0.05})"/>`;
        }
        return s;
      })()}
    </g>
    <!-- main route (iso) -->
    <path d="M260,230 Q320,300 380,260 T520,300 T650,250" fill="none" stroke="#ff5b2e" stroke-width="2.4"/>
    <path d="M260,230 Q320,300 380,260 T520,300 T650,250" fill="none" stroke="#ff5b2e" stroke-width="6" opacity="0.18"/>
    <!-- pins -->
    ${[[260,230],[380,260],[520,300],[650,250]].map(([x,y],i)=>`
      <g transform="translate(${x} ${y})">
        <path d="M0,-22 C-10,-22 -14,-12 0,4 C14,-12 10,-22 0,-22 Z" fill="rgba(255,91,46,0.4)" stroke="#ff5b2e" stroke-width="1.4"/>
        <circle cx="0" cy="-14" r="3" fill="#0a0c11"/>
        <text x="6" y="-24" font-family="ui-monospace,monospace" font-size="9" fill="#ff5b2e">${String.fromCharCode(65+i)}</text>
      </g>
    `).join('')}
    <g font-family="ui-monospace, monospace" font-size="11" fill="#ff5b2e" letter-spacing="2">
      <text x="60" y="58">ROUTE.OPTIMIZE // RUN-09</text>
      <text x="60" y="78" fill="#9a978f">4 STOPS · −18% DISTANCE</text>
    </g>
  `, 'route');

  // ---------- 5) Picker App — iso shelves + path ----------
  const pickerApp = shell(`
    <g stroke="#ff5b2e" stroke-width="1.4">
      ${[0,1,2,3].map(i => {
        const x = 200 + i*100;
        const y = 200;
        return `
          <g transform="translate(${x} ${y})">
            <path d="M0,0 L70,-20 L70,140 L0,160 Z" fill="rgba(255,91,46,0.08)"/>
            <path d="M70,-20 L90,-10 L90,150 L70,140 Z" fill="rgba(255,91,46,0.14)"/>
            <path d="M0,0 L70,-20 L90,-10 L20,10 Z" fill="rgba(255,91,46,0.2)"/>
            <line x1="0" y1="40" x2="70" y2="20" stroke-dasharray="2 3"/>
            <line x1="0" y1="80" x2="70" y2="60" stroke-dasharray="2 3"/>
            <line x1="0" y1="120" x2="70" y2="100" stroke-dasharray="2 3"/>
          </g>
        `;
      }).join('')}
    </g>
    <!-- path through aisles -->
    <path d="M180,330 L280,310 L295,210 L375,195 L390,295 L470,275 L485,180 L565,165 L580,265 L660,245"
          fill="none" stroke="#ff5b2e" stroke-width="2.2" stroke-dasharray="5 4">
      <animate attributeName="stroke-dashoffset" values="0;-90" dur="3s" repeatCount="indefinite"/>
    </path>
    <!-- picker dot -->
    <circle cx="295" cy="210" r="6" fill="#ff5b2e"/>
    <circle cx="295" cy="210" r="14" fill="none" stroke="#ff5b2e" opacity="0.5">
      <animate attributeName="r" values="8;22;8" dur="1.8s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.7;0;0.7" dur="1.8s" repeatCount="indefinite"/>
    </circle>
    <g font-family="ui-monospace, monospace" font-size="11" fill="#ff5b2e" letter-spacing="2">
      <text x="60" y="58">PICK.LIST // 24 SKU</text>
      <text x="60" y="78" fill="#9a978f">AISLE B · BAY 04</text>
    </g>
  `, 'pick');

  // ---------- 6) EdgeOS — iso server / dashboard stack ----------
  const edgeOs = shell(`
    <!-- iso slab stack -->
    <g stroke="#ff5b2e" stroke-width="1.4">
      ${[0,1,2,3].map(i => {
        const y = 360 - i*44;
        const opa = 0.08 + i*0.05;
        return `
          <g>
            <path d="M260,${y} L500,${y-60} L660,${y-20} L420,${y+40} Z" fill="rgba(255,91,46,${opa})"/>
            <path d="M260,${y} L260,${y+18} L420,${y+58} L420,${y+40} Z" fill="rgba(255,91,46,${opa+0.06})"/>
            <path d="M420,${y+40} L420,${y+58} L660,${y-2} L660,${y-20} Z" fill="rgba(255,91,46,${opa+0.04})"/>
            ${i === 1 ? `<text x="290" y="${y+10}" font-family="ui-monospace,monospace" font-size="9" fill="#ff5b2e" letter-spacing="2">B2C ▸</text>` : ''}
            ${i === 2 ? `<text x="290" y="${y+10}" font-family="ui-monospace,monospace" font-size="9" fill="#ff5b2e" letter-spacing="2">B2B ▸</text>` : ''}
            ${i === 3 ? `<text x="290" y="${y+10}" font-family="ui-monospace,monospace" font-size="9" fill="#ff5b2e" letter-spacing="2">CORE ▸</text>` : ''}
          </g>
        `;
      }).join('')}
    </g>
    <!-- floating UI cards over the stack -->
    <g stroke="#ff5b2e" stroke-width="1.2" fill="rgba(7,8,11,0.85)">
      <rect x="490" y="100" width="170" height="60"/>
      <line x1="490" y1="118" x2="660" y2="118"/>
      <text x="500" y="113" font-family="ui-monospace,monospace" font-size="9" fill="#ff5b2e">DASHBOARD</text>
      <rect x="500" y="125" width="34" height="6" fill="rgba(255,91,46,0.6)"/>
      <rect x="540" y="125" width="60" height="6" fill="rgba(255,91,46,0.3)"/>
      <rect x="500" y="138" width="80" height="6" fill="rgba(255,91,46,0.5)"/>
      <rect x="500" y="148" width="40" height="6" fill="rgba(255,91,46,0.2)"/>
    </g>
    <g font-family="ui-monospace, monospace" font-size="11" fill="#ff5b2e" letter-spacing="2">
      <text x="60" y="58">EDGE.OS // PLATFORM</text>
      <text x="60" y="78" fill="#9a978f">B2B + B2C · UNIFIED</text>
    </g>
  `, 'edge');

  // ---------- 7) Dual Payment — iso split receipt: cash + card → total ----------
  const dualPayment = shell(`
    <!-- ground shadow -->
    <ellipse cx="400" cy="430" rx="230" ry="22" fill="url(#lg-pay)" opacity="0.6"/>
    <!-- central order slab (the bill) -->
    <g stroke="#ff5b2e" stroke-width="1.6">
      <path d="M330,150 L470,90 L590,150 L450,210 Z" fill="rgba(255,91,46,0.12)"/>
      <path d="M330,150 L330,196 L450,256 L450,210 Z" fill="rgba(255,91,46,0.2)"/>
      <path d="M450,210 L590,150 L590,196 L450,256 Z" fill="rgba(255,91,46,0.08)"/>
      <text x="352" y="176" font-family="ui-monospace,monospace" font-size="10" fill="#ff5b2e" letter-spacing="1">TOTAL</text>
      <text x="352" y="198" font-family="ui-monospace,monospace" font-size="13" fill="#e9e7e2">AED 500.00</text>
    </g>
    <!-- split fork: two branches down to two payment tiles -->
    <g stroke="#ff5b2e" stroke-width="1.4" fill="none" stroke-dasharray="5 4">
      <path d="M390,235 L250,300"/>
      <path d="M470,250 L600,310"/>
    </g>
    <!-- LEFT tile: CASH -->
    <g stroke="#ff5b2e" stroke-width="1.5">
      <path d="M150,300 L250,258 L330,298 L230,340 Z" fill="rgba(255,91,46,0.16)"/>
      <path d="M150,300 L150,346 L230,386 L230,340 Z" fill="rgba(255,91,46,0.24)"/>
      <path d="M230,340 L330,298 L330,344 L230,386 Z" fill="rgba(255,91,46,0.1)"/>
      <text x="168" y="330" font-family="ui-monospace,monospace" font-size="9" fill="#ff5b2e" letter-spacing="1">CASH</text>
      <text x="166" y="366" font-family="ui-monospace,monospace" font-size="11" fill="#e9e7e2">300.00</text>
    </g>
    <!-- RIGHT tile: CARD -->
    <g stroke="#ff5b2e" stroke-width="1.5">
      <path d="M480,310 L580,268 L660,308 L560,350 Z" fill="rgba(255,91,46,0.12)"/>
      <path d="M480,310 L480,356 L560,396 L560,350 Z" fill="rgba(255,91,46,0.2)"/>
      <path d="M560,350 L660,308 L660,354 L560,396 Z" fill="rgba(255,91,46,0.08)"/>
      <rect x="498" y="330" width="30" height="8" fill="rgba(255,91,46,0.5)"/>
      <text x="498" y="372" font-family="ui-monospace,monospace" font-size="9" fill="#ff5b2e" letter-spacing="1">CARD</text>
      <text x="536" y="372" font-family="ui-monospace,monospace" font-size="11" fill="#e9e7e2">200.00</text>
    </g>
    <!-- split node pulse on the bill -->
    <circle cx="430" cy="230" r="4" fill="#ff5b2e">
      <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="430" cy="230" r="12" fill="none" stroke="#ff5b2e" opacity="0.5">
      <animate attributeName="r" values="6;22;6" dur="2.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.7;0;0.7" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <g font-family="ui-monospace, monospace" font-size="11" fill="#ff5b2e" letter-spacing="2">
      <text x="60" y="58">SPLIT.PAYMENT // UAE</text>
      <text x="60" y="78" fill="#9a978f">CASH 300 + CARD 200 = 500</text>
    </g>
  `, 'pay');

  // ---------- 8) Bulk OTP — three iso packages grouped into one OTP ----------
  const bulkOtp = shell(`
    <!-- ground shadow -->
    <ellipse cx="360" cy="430" rx="240" ry="22" fill="url(#lg-otp)" opacity="0.6"/>
    <!-- three package boxes (the multi-package set for one customer) -->
    <g stroke="#ff5b2e" stroke-width="1.5">
      ${[0,1,2].map(i => {
        const x = 180 + i*120; const y = 258 + (i === 1 ? -16 : 0);
        return `
          <g transform="translate(${x} ${y})">
            <path d="M0,30 L60,0 L120,30 L60,60 Z" fill="rgba(255,91,46,0.16)"/>
            <path d="M0,30 L0,94 L60,124 L60,60 Z" fill="rgba(255,91,46,0.24)"/>
            <path d="M60,60 L120,30 L120,94 L60,124 Z" fill="rgba(255,91,46,0.10)"/>
            <path d="M30,15 L90,45 L90,52 L30,22 Z" fill="rgba(255,91,46,0.30)"/>
            <text x="14" y="92" font-family="ui-monospace,monospace" font-size="9" fill="#ff5b2e" letter-spacing="1">PKG ${i+1}</text>
          </g>`;
      }).join('')}
    </g>
    <!-- grouping lines converging to a single OTP node -->
    <g stroke="#ff5b2e" stroke-width="1.4" fill="none" stroke-dasharray="5 4">
      <path d="M250,260 L400,180"/>
      <path d="M360,244 L400,180"/>
      <path d="M470,260 L400,180"/>
    </g>
    <!-- single OTP card: one code for the whole selection -->
    <g stroke="#ff5b2e" stroke-width="1.2" fill="rgba(7,8,11,0.85)">
      <rect x="300" y="104" width="200" height="78" rx="6"/>
      <text x="316" y="128" font-family="ui-monospace,monospace" font-size="10" fill="#ff5b2e" letter-spacing="1">ONE OTP</text>
      ${[4,8,1,9].map((d,i) => `
        <rect x="${316 + i*44}" y="138" width="34" height="30" rx="3" fill="rgba(255,91,46,0.10)" stroke="#ff5b2e"/>
        <text x="${328 + i*44}" y="159" font-family="ui-monospace,monospace" font-size="14" fill="#e9e7e2">${d}</text>`).join('')}
    </g>
    <!-- pulse node where the packages converge -->
    <circle cx="400" cy="182" r="4" fill="#ff5b2e">
      <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="400" cy="182" r="12" fill="none" stroke="#ff5b2e" opacity="0.5">
      <animate attributeName="r" values="6;22;6" dur="2.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.7;0;0.7" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <g font-family="ui-monospace, monospace" font-size="11" fill="#ff5b2e" letter-spacing="2">
      <text x="60" y="58">VERIFY.BULK // 3 \u2192 1</text>
      <text x="60" y="78" fill="#9a978f">ONE OTP \u00b7 3 PACKAGES</text>
    </g>
  `, 'otp');

  window.PROJECT_ART = {
    "stock-on-wheel":              stockOnWheel,
    "tms-delivery-app":            tmsDelivery,
    "demand-forecasting":          demandForecasting,
    "route-optimization-bisleri":  routeOpt,
    "picker-app":                  pickerApp,
    "edgeos":                      edgeOs,
    "dual-payment":                dualPayment,
    "bulk-otp":                    bulkOtp
  };
})();

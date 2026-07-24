// Full-width playable piano. Hover to sound notes on desktop; tap/drag on touch.
(function () {
  var root = document.getElementById('pianoKeys');
  if (!root) return;

  var NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  // MIDI -> frequency
  function freq(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function isBlack(m) { var s = ((m % 12) + 12) % 12; return [1, 3, 6, 8, 10].indexOf(s) !== -1; }

  // Build from C3 (48) up to C6 (84) — 3 octaves, professional span.
  var START = 48, END = 84;

  var AC = null;
  function ctx() {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    return AC;
  }
  function play(m) {
    var ac = ctx(), t = ac.currentTime;
    var osc = ac.createOscillator(), g = ac.createGain(), lp = ac.createBiquadFilter();
    osc.type = 'triangle';
    osc.frequency.value = freq(m);
    lp.type = 'lowpass'; lp.frequency.value = 2600;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    osc.connect(lp); lp.connect(g); g.connect(ac.destination);
    osc.start(t); osc.stop(t + 1.15);
  }

  var isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
  var pressed = false;
  window.addEventListener('pointerup', function () { pressed = false; });
  window.addEventListener('pointercancel', function () { pressed = false; });

  function wire(el, m) {
    var label = NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
    el.setAttribute('data-note', label);
    function on() { el.classList.add('is-on'); play(m); }
    function off() { el.classList.remove('is-on'); }
    if (isTouch) {
      el.addEventListener('pointerdown', function (e) { e.preventDefault(); pressed = true; on(); });
      el.addEventListener('pointerenter', function () { if (pressed) on(); });
      el.addEventListener('pointerup', off);
      el.addEventListener('pointerleave', off);
    } else {
      el.addEventListener('pointerenter', on);
      el.addEventListener('pointerleave', off);
    }
  }

  // First pass: white keys (they define the layout width).
  var whites = [];
  for (var m = START; m <= END; m++) if (!isBlack(m)) whites.push(m);
  var wIndex = {};
  whites.forEach(function (m, i) { wIndex[m] = i; });

  whites.forEach(function (m) {
    var key = document.createElement('div');
    key.className = 'pkey';
    key.innerHTML = '<span class="pkey__note">' + NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1) + '</span>';
    wire(key, m);
    root.appendChild(key);
  });

  // Second pass: black keys, positioned between the whites they sit over.
  var wCount = whites.length;
  for (var b = START; b <= END; b++) {
    if (!isBlack(b)) continue;
    var leftWhite = b - 1; // the white key immediately to the left
    if (wIndex[leftWhite] === undefined) continue;
    var blk = document.createElement('div');
    blk.className = 'pkey__blk';
    // center the black key on the boundary between two whites
    blk.style.left = ((wIndex[leftWhite] + 1) / wCount * 100) + '%';
    blk.style.width = (100 / wCount * 0.62) + '%';
    wire(blk, b);
    root.appendChild(blk);
  }
})();

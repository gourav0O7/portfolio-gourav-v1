
/* ============================================================
   net-quality.js — adaptive loading gate  (load FIRST, in <head>)
   ------------------------------------------------------------
   Reads the Network Information API to decide whether this is a
   slow / data-saver connection. On a "lite" connection we set
   <html class="lite"> and publish window.__lite = true so the
   rest of the site can skip the heavy stuff entirely:
     • the Three.js Commodore-64 hero (never even downloads THREE)
     • the hero video reel (hero-reel.mp4)
     • the footer / about 3D models (.glb + model-viewer lib)
   Everything degrades to the static fallbacks that already exist.

   Decision runs synchronously so the gate is set before any
   deferred/end-of-body script reads it — no flash of heavy load.

   Manual override for testing / user choice:
     ?net=lite  or  ?net=fast   (persisted to localStorage)
   ============================================================ */
(function () {
  'use strict';

  var de = document.documentElement;

  function readOverride() {
    var v = null;
    try {
      var q = new URLSearchParams(location.search).get('net');
      if (q === 'lite' || q === 'fast') { localStorage.setItem('netMode', q); v = q; }
      else { v = localStorage.getItem('netMode'); }
    } catch (e) { /* private mode / no storage — ignore */ }
    return v; // 'lite' | 'fast' | null
  }

  function detect() {
    var override = readOverride();
    if (override === 'lite') return true;
    if (override === 'fast') return false;

    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) {
      // Network Information API is unsupported on the entire Safari family
      // (desktop AND mobile) — every Safari visit was silently defaulting
      // to "fast" here and paying the full ~30MB homepage boot cost
      // (commodore64.glb + hero-reel.mp4) regardless of actual connection
      // speed. We can't measure real throughput without the API, but a
      // touch-primary device with no fine pointer (no mouse/trackpad) is a
      // reasonable proxy for "phone, possibly on cellular" — the group most
      // likely to actually be on a slow/metered connection. Desktop Safari
      // (Mac, presumably wifi/broadband) is left as "fast", same as before.
      var touchPrimary = window.matchMedia &&
        window.matchMedia('(pointer: coarse)').matches &&
        window.matchMedia('(hover: none)').matches;
      return !!touchPrimary;
    }

    if (c.saveData === true) return true;       // explicit Data Saver / Lite mode
    // effectiveType is one of: 'slow-2g' | '2g' | '3g' | '4g'
    if (/^(slow-2g|2g|3g)$/.test(c.effectiveType || '')) return true;
    // very low throughput even if labelled 4g
    if (typeof c.downlink === 'number' && c.downlink > 0 && c.downlink < 1.2) return true;

    return false;
  }

  var lite = false;
  try { lite = detect(); } catch (e) { lite = false; }

  window.__lite = lite;
  de.classList.add(lite ? 'lite' : 'full');
  if (lite) {
    // pre-empt the 3D hero so the static version paints immediately and
    // c64-hero.js (loaded conditionally) is never injected.
    de.classList.add('c64-failed');
  }

  // expose a tiny helper so other scripts don't re-implement the check
  window.__shouldLoadHeavy = function () { return !window.__lite; };
})();

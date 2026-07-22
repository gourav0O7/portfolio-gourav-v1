/* ============================================================
   NDA GATE — Cloudflare Worker
   Sits in front of the protected paths and refuses to even fetch
   them from origin unless the visitor has proven they know the
   passphrase. This is real enforcement (runs at Cloudflare's edge,
   before the request ever reaches GitHub Pages) — unlike the
   client-side case-gate.js, which only hides content that has
   already been sent to the browser.

   How it works:
     - GET on a protected path with no valid cookie -> a small
       password page, served by the Worker itself (not GitHub Pages).
     - POST from that page with the right hash -> sets a signed
       cookie, redirects back to the original URL.
     - Any request with a valid cookie -> passed straight through
       to origin (GitHub Pages / gouravsharma.net).
     - Everything NOT under a protected path passes through
       untouched, always.
   ============================================================ */

const PROTECTED_PREFIXES = [
  '/otp-live/',
  '/demand-live/',
  '/app-builder-live/',
  '/prototype/',
  '/prototype-',
  '/screens-img/',
  '/assets/otp-',
  '/project-screens-',   // per-project screen replica DATA (the NDA copy)
];

// Exact files that carry NDA content but don't fit a prefix.
const PROTECTED_EXACT = [
  '/projects-data.js',   // all case-study copy lives here
];

const COOKIE_NAME = 'gs_nda_ok';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function isProtected(pathname) {
  if (PROTECTED_EXACT.includes(pathname)) return true;
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  // Case-study pages themselves: /project-<name>.html (but NOT the shared
  // rendering machinery like /project.js, /project.css, /project-art.js —
  // those carry no NDA copy and stay public so nothing else breaks).
  if (/^\/project-[^/]+\.html$/.test(pathname)) return true;
  return false;
}

async function sha256Hex(str) {
  const data = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// HMAC-signs the cookie value so it can't just be guessed/forged from
// outside — the signing key (COOKIE_SECRET) only exists as a Worker secret.
async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  const match = header.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function gatePage(opts) {
  const err = opts && opts.error ? '<div class="err">✗ ACCESS DENIED — incorrect passphrase</div>' : '';
  const redirect = (opts && opts.redirect) || '/';
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Protected — Gourav Sharma</title>
<style>
  :root{color-scheme:dark}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0c11;
    font-family:ui-monospace,"JetBrains Mono",monospace;color:#e9eaf0;padding:20px}
  .panel{width:100%;max-width:420px;border:1px solid #ff5b2e;background:linear-gradient(180deg,#14161d,#0a0c11);padding:26px}
  .bar{display:flex;justify-content:space-between;color:#ff5b2e;font-size:11px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:18px}
  h1{font-family:system-ui,sans-serif;font-size:19px;margin:0 0 10px}
  p{font-size:13px;line-height:1.6;color:#a9adb8;margin:0 0 20px}
  form{display:flex;gap:8px}
  input{flex:1;background:#0a0c11;border:1px solid #33363f;color:#e9eaf0;padding:12px;font:inherit;letter-spacing:.12em}
  input:focus{outline:none;border-color:#ff5b2e;box-shadow:0 0 0 3px rgba(255,91,46,.14)}
  button{background:#ff5b2e;color:#0a0c11;border:0;padding:0 18px;font:inherit;font-weight:700;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
  .err{color:#ff5b2e;font-size:12px;margin-top:14px}
</style></head>
<body>
  <div class="panel">
    <div class="bar"><span>&#9679; ENCRYPTED PATH</span><span>AES // NDA</span></div>
    <h1>This content is under NDA.</h1>
    <p>Enter the passphrase to continue — it's included in my CV &amp; outreach emails.</p>
    <form method="POST">
      <input type="hidden" name="redirect" value="${redirect.replace(/"/g, '&quot;')}" />
      <input type="password" name="pass" placeholder="PASSPHRASE" autocomplete="off" autofocus />
      <button type="submit">Decrypt</button>
    </form>
    ${err}
  </div>
</body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (!isProtected(url.pathname)) {
      return fetch(request); // untouched pass-through for everything else
    }

    const cookie = getCookie(request, COOKIE_NAME);
    const expectedSig = cookie ? await sign('ok', env.COOKIE_SECRET) : null;
    const authed = cookie && cookie === expectedSig;

    if (request.method === 'POST') {
      const form = await request.formData();
      const pass = (form.get('pass') || '').toString().trim().toLowerCase();
      const redirect = (form.get('redirect') || url.pathname).toString();
      const hash = await sha256Hex(pass);

      if (hash === env.PASSPHRASE_HASH) {
        const sig = await sign('ok', env.COOKIE_SECRET);
        const headers = new Headers({ Location: redirect });
        headers.append('Set-Cookie', `${COOKIE_NAME}=${sig}; Path=/; Max-Age=${COOKIE_MAX_AGE}; Secure; HttpOnly; SameSite=Lax`);
        return new Response(null, { status: 302, headers });
      }
      return new Response(gatePage({ error: true, redirect }), { status: 401, headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }

    if (!authed) {
      return new Response(gatePage({ redirect: url.pathname + url.search }), { status: 401, headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }

    return fetch(request); // cookie checks out — let origin serve the real file
  },
};

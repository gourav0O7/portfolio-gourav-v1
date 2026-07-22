# NDA gate — Cloudflare Worker

Real, server-side access control for the live-prototype paths and a few
screenshot folders that `case-gate.js` (the in-page passphrase panel)
can't actually protect — it runs *before* Cloudflare forwards the
request to GitHub Pages, so an unauthenticated request never even
reaches origin. Case-gate.js, by contrast, only hides content that
has already been sent to the browser.

Protected path prefixes (edit in `wrangler.toml`'s `routes`):
- `/otp-live/*`
- `/demand-live/*`
- `/app-builder-live/*`
- `/prototype/*`, `/prototype-*`
- `/screens-img/*`
- `/assets/otp-*`

Everything else on the domain passes through untouched.

## Redeploying after an edit

```
cd cf-worker
wrangler deploy
```

(needs `wrangler login` once per machine — see the main portfolio's git
history for how that was installed, if it's not already on your PATH)

## Changing the passphrase

It's stored as a Worker secret (`PASSPHRASE_HASH`), not in this file —
keep it in sync with `case-gate.js`'s `PASSPHRASE_HASH`, which has its
own instructions for generating the hash. Then:

```
echo -n "<new sha256 hash>" | wrangler secret put PASSPHRASE_HASH
```

## Adding a new protected path

Add a `routes` entry in `wrangler.toml` and a matching prefix to
`PROTECTED_PREFIXES` in `worker.js`, then `wrangler deploy`.

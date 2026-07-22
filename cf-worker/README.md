# NDA gate — Cloudflare Worker (NOT currently deployed)

This Worker provided real, server-side access control for the case-study
pages and live-prototype paths. **It has been removed / undeployed** — the
NDA case studies are back to their original client-side experience
(`case-gate.js`: on-page scramble that decodes when the visitor enters the
passphrase). Nothing is gated at the edge right now.

The code is kept here in case server-side gating is ever wanted again.

## To re-enable

1. `wrangler login` (once per machine).
2. Re-add the route patterns in `wrangler.toml` (see git history for the
   full set: `/otp-live/*`, `/demand-live/*`, `/app-builder-live/*`,
   `/prototype/*`, `/prototype-*`, `/screens-img/*`, `/assets/otp-*`,
   `/project-*`, `/projects-data.js*`).
3. Set the secrets again:
   ```
   echo -n "<sha256 of passphrase>" | wrangler secret put PASSPHRASE_HASH
   echo -n "<random hex>"           | wrangler secret put COOKIE_SECRET
   ```
4. `wrangler deploy`.

Note: gating the case-study *pages* also gates the live-prototype iframes
they embed, so if you re-enable it, wire the passphrase entry to also set
the Worker cookie (see the old `syncWorkerGate` in git history) or the
embeds will show the edge login page after unlock.

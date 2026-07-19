
# Project memory — Portfolio: Gourav V1

## Design systems (IMPORTANT)
Gourav has worked at **two companies, each with its own design system**:
- **Omniful** — its own design system.
- **Edgistify** — its own design system.

Whenever asked to design mockups / screens / a product, the work MUST follow
**one of these two design systems** — never a generic/invented style. Always
design in either the Edgistify DS or the Omniful DS.

### How to pick which one
- Gourav will **name the company with each project** — use that company's DS.
- If a request omits the company, infer it from the **About page** info in
  this project (his work history maps projects → company), then design in
  that company's design system.
- Only ask if it's still genuinely ambiguous after checking both.

(TODO: capture where each design system's source/specs live — files, Figma,
or reference screens — so it can be applied faithfully.)

## Omniful DS is mandatory for Omniful product work
The Omniful design system now lives in `omniful-ds/` (tokens + `components.css` + icons).
EVERY Omniful product case study — existing (Bulk OTP, Dual Payment, Demand Forecasting)
and all future ones — must be built with these components: #5468FA primary, Poppins,
om-* classes, status hues only in tags. Do not invent one-off styles for Omniful screens.
(Outstanding: restyle prototype-bulk-otp, prototype-collect-payment, demand-forecast
screens to the DS — todo 73.)

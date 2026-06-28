# Integration Guide — Payments, Paywall, Email Digest

This maps the three systems you want to wire up onto concrete touchpoints in the prototype
(`src/GoodNewsBadNews.dc.html`). The prototype fakes these with `localStorage`; in production you
replace each fake with a real API call. Function/prop names below are searchable strings in the source.

---

## 0. Environment variables (Vercel → Project → Settings → Environment Variables)

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_SUBMISSION=        # one-time price for a paid submission (the $0.50 anti-spam fee)
STRIPE_PRICE_DIGEST_MONTHLY=    # recurring price for digest / supporter subscription

RESEND_API_KEY=                 # or POSTMARK_SERVER_TOKEN
DIGEST_FROM_EMAIL=
CRON_SECRET=                    # protects the weekly digest cron route

BLOB_READ_WRITE_TOKEN=          # Vercel Blob, for resident photo uploads
```

---

## 1. Payment portal (Stripe)

### Touchpoint in the prototype
- Prop **`paidModel`** (boolean, defined in the `data-props` block). When `true` the UI already shows:
  - submit intro line → `submitFeeLine`: *"Submitting a signal costs $0.50 to reduce spam."*
  - the final button → `submitButtonLabel`: *"Pay $0.50 & submit for review"*
  - the note → `submitButtonNote`: *"In the live product this opens checkout, then the signal enters moderation."*
- Handler **`doSubmit()`** — in the prototype this just pushes the signal into a local queue.

### What to build
Turn the submit flow into: **build signal → Stripe Checkout (one-time) → on payment success, persist
the signal in `workflowState='new'`.**

1. Create a one-time Price in Stripe (`STRIPE_PRICE_SUBMISSION`).
2. Server route `POST /api/submit/checkout` → creates a Checkout Session
   (`mode: 'payment'`, `line_items: [{ price: STRIPE_PRICE_SUBMISSION, quantity: 1 }]`), stashing the
   draft signal in metadata or a `pending_submission` row keyed by the session id.
3. Redirect the browser to `session.url` (this replaces the prototype's `doSubmit()` body when
   `paidModel` is on).
4. Webhook `POST /api/stripe/webhook` on `checkout.session.completed` → move the draft into the real
   `signals` table as `new`, show the success screen the prototype already renders (`submitted` state).

> Keep `paidModel=false` as a supported mode — free submissions go straight to moderation, exactly as
> the prototype does today. The flag is your launch switch.

---

## 2. Paywall access

There are two distinct money flows; decide which you want (you can do both):

### (a) Per-submission fee — anti-spam
Already covered by §1 (`paidModel`). It's a gate on *writing*, not reading.

### (b) Subscription paywall — gate *reading* premium content
Use Stripe **Billing** (recurring `STRIPE_PRICE_DIGEST_MONTHLY`) to unlock things like: the full
archive, pattern reports before they're public, or the emailed digest.

**Where to gate in the design:**
- Public feed cards (`#/latest`, `#/good`, `#/bad`, `#/both`) — show teasers; gate full post detail
  (`#/post/:id`) body behind an active subscription.
- Pattern reports (`category='pattern'`) make a natural "members" tier.
- The Digest screen (`#/digest`) subscribe box becomes the paywall entry point.

**How:**
1. `subscriptionStatus` lives on the user (Auth.js session) or `Subscriber` row, synced from Stripe
   webhooks (`customer.subscription.created/updated/deleted`).
2. Server-render gated content only when `status==='active'`; otherwise return the teaser + a
   "Become a member" CTA styled like the existing dark CTA band.
3. Use Stripe **Customer Portal** for manage/cancel — link it from a member settings page.

---

## 3. Email digest (the Saturday briefing)

### Touchpoint in the prototype
- Screen `#/digest`. Handler **`subscribe()`** (fakes it with `localStorage.gnbn_sub_v1`).
- Preference options (`digestOptions`): **Good Signals Only / Warning Signals Only / Opportunity
  Signals Only / All Signals** — store this as `Subscriber.preference`.
- Per-city: the digest is scoped to the selected city (`Subscriber.city`). The prototype's Issue-01
  preview block shows the intended format: *3 wins · 3 concerns · 1 complicated story · 1 question.*

### What to build
1. `POST /api/digest/subscribe` → upsert `Subscriber {email, city, preference}` (double opt-in
   recommended: send a confirm link via Resend/Postmark).
2. **Weekly send** via **Vercel Cron** (`vercel.json` → `crons`): a route `GET /api/cron/digest`
   that runs Saturday morning, protected by `CRON_SECRET`.
   - For each city, query that week's published signals, bucket them by category to fill the
     *3 wins / 3 concerns / 1 both / 1 question* template, render an email (React Email + Resend works
     well), and send to subscribers filtered by `city` + `preference`.
3. Honor `preference`: "Good Signals Only" → only `category='good'`, etc. "All Signals" → the full
   briefing.

Example `vercel.json` cron entry:
```json
{ "crons": [ { "path": "/api/cron/digest", "schedule": "0 14 * * 6" } ] }
```
(`0 14 * * 6` = 14:00 UTC every Saturday — adjust per city timezone; Honolulu is UTC-10, Spokane UTC-7/8.)

---

## 4. Moderation (build before public launch)

### Touchpoint in the prototype
- Screen `#/admin` (toggled by prop `showAdmin`). A 4-column board: **New → Human review → Verified →
  Published**, driven by `setWf()`, `publishItem()`, `rejectItem()`.
- Each card shows an **automated safety scan** (`scan()` in the prototype) — a heuristic that flags
  phone numbers, street addresses, personal accusations, named individuals/minors, emails, and private
  disputes. In production, keep a deterministic regex pass *and* consider an LLM moderation step;
  `requireSafetyCheck` (prop) gates the resident-side self-attestation checkboxes.

### What to build
- `signals.workflowState` transitions guarded by an admin role (Auth.js).
- `publishItem()` → flips state to `published`, sets it live to the public feed + map.
- Protect `/admin` routes server-side; never trust the client `showAdmin` flag for access control.

---

## 5. Interactive map data

The Map screen (`#/map`) uses **Leaflet + CARTO light tiles** (already wired, needs internet for the
basemap). Pins are **color-coded by category** and clustered by neighborhood.

- Each signal needs `lat`/`lng`. The prototype derives them from a neighborhood centroid + a
  deterministic jitter (`coordFor()`); in production, geocode the submitted cross-streets/neighborhood
  (e.g. Mapbox/Google geocoding) or keep the centroid+jitter approach for privacy.
- Category → color map (keep these exact hexes): good `#19734a`, bad `#a33429`, both `#c99a2e`,
  opportunity `#285d83`, signal `#5a564d`, pattern `#6b3fa0`.
- The legend filters by category; the side list and map share one filtered dataset.

---

## 6. Adding the third+ city later

Cities are data, not code. The prototype's `CITIES` object (`{ key, name, region, center, zoom,
neighborhoods[] }`) becomes a `cities` table. Add a row, seed its neighborhoods, point the header
switcher at the new list — every screen (feed, map, submit, digest, admin) is already city-scoped.

---

## Suggested build order

1. Next.js app + DB + Auth, recreate the **public screens** statically from `DESIGN_REFERENCE.md`.
2. **Submit flow** → moderation board → publish (no payments yet; `paidModel=false`).
3. **Stripe** one-time submission fee (`paidModel=true`).
4. **Email digest** subscribe + Vercel Cron send.
5. **Subscription paywall** for premium reads.
6. Map geocoding + photo uploads.

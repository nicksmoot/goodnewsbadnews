# Good News Bad News — Developer Handoff

A civic signal platform launching in **two cities (Spokane, WA and Honolulu, HI)**. Residents
submit local wins/concerns/patterns/opportunities; submissions are moderated, then published to a
public feed, an interactive signal map, and a weekly email digest. This package is what you deploy
and build the real backend around.

---

## ⚠️ Read this first: what these files are

The files in `src/` are a **design reference built as a single self-contained HTML prototype** — a
high-fidelity mockup of the intended look, copy, and interaction. They are **not** the production
codebase. The prototype runs entirely in the browser with `localStorage` standing in for a database.

**Your job:** recreate this design in a real app (recommended: **Next.js on Vercel**) using its own
data layer, auth, payments, and email — wiring up the integrations described in `INTEGRATION.md`.
The prototype tells you *exactly* what to build and where each hook goes.

Fidelity: **high-fidelity.** Colors, type, spacing, and copy are final. Match them.

---

## What's in this package

```
design_handoff_gnbn/
├── README.md            ← you are here
├── INTEGRATION.md       ← Stripe payments, paywall, email digest, moderation, map data
├── DESIGN_REFERENCE.md  ← screens, design tokens, typography, component specs
├── demo/
│   └── index.html       ← self-contained live demo (deploy to Vercel as-is for a preview)
└── src/
    ├── GoodNewsBadNews.dc.html   ← the design prototype (source)
    └── support.js               ← runtime the prototype needs to render
```

---

## Two deployment paths

### Path A — Ship the live demo right now (static, no backend)
The bundled `demo/index.html` is fully self-contained and works offline. Drop it on Vercel for an
instant, shareable preview (no payments/email — `localStorage` only).

```bash
cd design_handoff_gnbn/demo
vercel deploy        # or: drag the folder into vercel.com/new
```
A `vercel.json` is included that serves `index.html` statically.

### Path B — Build the real product (recommended)
Stand up a Next.js app and recreate the screens from `src/` + `DESIGN_REFERENCE.md`, then wire the
integrations in `INTEGRATION.md`. Suggested stack (all first-class on Vercel):

| Concern            | Suggested tool                                              |
|--------------------|------------------------------------------------------------|
| Framework          | Next.js (App Router) on Vercel                              |
| Database           | Vercel Postgres / Neon (or Supabase)                       |
| Auth               | Auth.js (NextAuth) or Clerk                                 |
| Payments + paywall | **Stripe** (Checkout + Billing/subscriptions + webhooks)   |
| Email digest       | **Resend** or Postmark + Vercel Cron for the weekly send    |
| Map                | Leaflet + CARTO/OSM tiles (already used in the prototype)   |
| Image uploads      | Vercel Blob / S3 (resident photos)                          |

---

## The core data model (already implied by the prototype)

**Signal** (a submission → published post): `id, city, category(good|bad|both|opportunity|signal|pattern),
title, summary, body[], topics[], neighborhood, lat, lng, status, photoUrl, helpfulCount, createdAt,
workflowState(new|review|verified|published)`.

**City**: `key(spokane|honolulu), name, region, center[lat,lng], zoom, neighborhoods[]`. Adding a third
launch city = one new row.

**Subscriber** (digest): `email, city, preference(All|Good|Warning|Opportunity), stripeCustomerId?,
subscriptionStatus`.

**Partner** (newsroom): `org, city, email, note, status`.

See `INTEGRATION.md` for how payments, the paywall, and the digest attach to these.

---

## Where the requested integrations live in the prototype

Every hook you asked about already has a visible touchpoint in `src/GoodNewsBadNews.dc.html`:

- **Payment portal** → the `paidModel` prop + `doSubmit()` + the "Submit for review" button.
- **Paywall access** → the same `paidModel` flag (per-submission fee) and the digest subscribe flow
  (recurring). Gate published-feed / digest content behind subscription status.
- **Email digest** → the Digest screen `subscribe()` + preference options.
- **Moderation** (you'll want this before any public launch) → the `#/admin` board and `publishItem()`.

Exact line-level pointers and replacement code are in **`INTEGRATION.md`**.

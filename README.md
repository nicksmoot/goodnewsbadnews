# Good News Bad News

A civic signal platform where residents submit the wins, concerns, patterns, and
opportunities they're seeing around them. Submissions are reviewed and organized so a
community can see what's working, what needs attention, and where to act next.
**Now live in two cities: Spokane, WA and Honolulu, HI.**

This is the production implementation of the Claude Design prototype. It's a
**Next.js 14 (App Router) + React + TypeScript** app that recreates the design
pixel-for-pixel with full feature parity.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # production build
```

The map basemap (CARTO/OpenStreetMap tiles) and the Google Fonts need network access;
everything else works offline. Demo content persists to the browser via `localStorage`.

## What's implemented

| Route | Screen |
|---|---|
| `/` | Home — pitch, two-city launch cards, headline ticker, how-it-works, category cards, latest signals, submit CTA |
| `/latest` `/good` `/bad` `/both` | Feed — search + topic + neighborhood + sort filters; category chips on Latest |
| `/map` | Signal Map — Leaflet, color-coded pins by category, clickable legend filter + synced side list |
| `/post/[id]` | Post detail — body, "what happens next", *I've seen this too / I can help / Follow* actions |
| `/submit` | 3-step submit flow (Story → Safety → Review) with photo upload + automated safety scan |
| `/digest` | Weekly digest signup with preference + Issue-01 preview |
| `/partners` | Newsroom partnership pitch + inquiry form |
| `/about` `/standards` | Mission + community standards |
| `/admin` | Moderation board — New → Human review → Verified → Published |

**Working loops:** the submit form runs a deterministic safety scan (flags phone numbers,
addresses, accusatory language, named individuals, emails, private disputes), drops the
signal into the moderation queue, where an admin advances it New → Review → Verified →
Publish; published items appear in the public feed and on the map. Everything is
**city-scoped** — the header switcher re-filters the feed, map, submit defaults, digest,
and admin queue, each city with its own dataset.

## Project structure

```
app/                 # routes (App Router) — one folder per screen
components/           # Header, Footer, Feed, SignalMap, cards
lib/
  data.ts            # types, design tokens, seed data (both cities), scan(), decorate()
  store.tsx          # client store + localStorage persistence (React context)
  selectors.ts       # city scoping + feed filtering
  config.ts          # product flags (see below)
project/  chats/      # original Claude Design bundle: prototype source + transcripts
```

## Configurable flags (`lib/config.ts`)

Ported from the prototype's `data-props`:

- **`paidModel`** (`false`) — turn on the paid-submission flow (Stripe one-time $0.50 anti-spam fee).
- **`showAdmin`** (`true`) — show the Moderation link. *Client convenience only — enforce admin access server-side.*
- **`requireSafetyCheck`** (`true`) — require the three resident safety attestations before a submission can advance.

## Wiring up the backend

The demo fakes payments, the digest, and moderation persistence with `localStorage`.
`project/design_handoff_gnbn/INTEGRATION.md` maps every touchpoint to a concrete
production hook (Stripe Checkout + Billing, Resend/Postmark + Vercel Cron for the digest,
admin role gating, map geocoding, photo uploads). The seams in this codebase that those
docs reference: `submitSignal()` / `publishItem()` / `setWf()` in `lib/store.tsx`, the
`/admin` route, and the `config` flags above.

`project/design_handoff_gnbn/DESIGN_REFERENCE.md` is the single source of truth for colors,
type, spacing, and per-screen specs.

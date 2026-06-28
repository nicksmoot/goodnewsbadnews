# Design Reference — Good News Bad News

High-fidelity. Recreate these values exactly. Single source of truth:
`src/GoodNewsBadNews.dc.html`.

---

## Design tokens

### Color
| Token | Hex | Use |
|---|---|---|
| Paper / page bg | `#f4ecdd` | app background |
| Card bg | `#fffaf1` | cards, panels |
| Input/raised bg | `#fffdf8` | inputs, secondary surfaces |
| Warm panel bg | `#fbf4e6` | filter bars, callouts |
| Ink (text) | `#161616` | headings, primary text |
| Body text | `#3a362e` / `#5a564d` | paragraphs |
| Muted text | `#6b675e` / `#8a857a` | meta, captions |
| Border | `#d8cab2` | hairlines, card borders |
| Border (soft) | `#e4d8c2` / `#ece1cd` | inner dividers |
| **Good (green)** | `#19734a` | good news, primary actions |
| **Bad (red)** | `#a33429` | bad news, destructive |
| **Both (gold)** | `#c99a2e` (text `#9a6a12` / `#8a5e0f`) | "both", accents, kickers |
| **Opportunity (blue)** | `#285d83` | opportunities, "I can help" |
| **Signal (grey)** | `#5a564d` | generic signal |
| **Pattern (purple)** | `#6b3fa0` | pattern reports |
| Dark band | `#161616` (text `#e7e1d4` / `#cfc8b9`) | CTA / digest preview |

Category badge pattern: text in the category color, background = color at ~8% (`#19734a14`), border =
color at ~35% (`#19734a59`).

### Typography
Google Fonts: **Spectral** (serif), **Public Sans** (sans), **IBM Plex Mono** (mono).
```
<link href="https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600;700;800&family=Public+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet">
```
- **Spectral** — all display headings & long-form post body. Weights 700/800. Tight tracking on
  big heads: `letter-spacing:-2.5px` at hero scale, scaling down with size.
- **Public Sans** — UI, body copy, buttons, forms. Weights 400–800.
- **IBM Plex Mono** — kickers, labels, meta, badges, ticker. 10–13px, uppercase, `letter-spacing`
  1–2px, weight 600.

Hero H1: `clamp(46px, 7vw, 88px)`, weight 800, `line-height:0.93`.
Section H1: `clamp(38px, 5vw, 60px)`. Card titles: 20–24px Spectral 700.

### Radius & shadow
Radii: pills `999px`; cards `16–20px`; big panels `24px`; inputs `10–11px`.
Card shadow: `0 10px 34px rgba(0,0,0,0.05)`. Header blur: `backdrop-filter: blur(10px)` over
`rgba(248,242,231,0.92)`.

### Layout
Max content width `1240px`, side padding `24px`. Card grids mostly 3- or 4-up with `gap:18px`.
Sticky translucent header. Selection color: green bg `#19734a` / white text.

---

## Screens (routes are hash-based in the prototype)

| Route | Screen | Purpose |
|---|---|---|
| `#/` | **Home** | Platform pitch ("Every city has two stories"), two-city launch cards, ticker, how-it-works, category cards, latest signals, submit CTA. |
| `#/latest` `#/good` `#/bad` `#/both` | **Feed** | Filterable signal grid (search, topic, neighborhood, sort; category chips on Latest). Cards show category + verification status badges. |
| `#/map` | **Signal Map** | Leaflet map, color-coded pins by category, clickable legend filter + synced side list. City-scoped. |
| `#/post/:id` | **Post detail** | Full signal: badges, body, "what happens next", "I've seen this too / I can help / Follow" actions. |
| `#/submit` | **Submit** | 3-step flow: Story → Safety self-check → Review → submit. Photo upload. Honors `paidModel`. |
| `#/digest` | **Digest** | Weekly email signup with preference (Good/Warning/Opportunity/All), issue-01 preview. |
| `#/partners` | **Partners** | Newsroom partnership pitch + how-it-works + "what partners get" + inquiry form. |
| `#/about` `#/standards` | **About / Standards** | Mission + community standards (allowed vs not allowed, safer-language pattern). |
| `#/admin` | **Moderation** | Internal board: New → Review → Verified → Published, with automated safety-scan notes. Gated by `showAdmin`. |

### Header
Brand wordmark ("**Good News** Bad News" — green + red) + **city switcher `<select>`** (Spokane, WA /
Honolulu, HI). Nav: Latest · Good · Bad · Both · Map · Digest · About · Standards · Partners ·
[Moderation] · **Submit a Signal** (black pill). Active link = ink, inactive = muted.

### Two-city behavior
Everything is city-scoped. The switcher sets the active city; feed, map, submit defaults, digest, and
admin all re-filter. Per-city data: name, region, map center/zoom, neighborhood list, and its own
signal set. Spokane and Honolulu ship at launch; more cities are additive.

---

## Configurable props (the prototype's `data-props`)
| Prop | Type | Meaning in production |
|---|---|---|
| `paidModel` | boolean | Turn on the paid-submission flow (Stripe one-time). |
| `showAdmin` | boolean | Client convenience only — **enforce admin access server-side**. |
| `requireSafetyCheck` | boolean | Require the 3 resident safety attestations before submit. |

---

## Assets
- **Fonts:** Google Fonts (links above).
- **Map tiles:** CARTO "light_all" basemap over OpenStreetMap data (needs network).
- **Photos in the prototype:** placeholder images from `picsum.photos` — replace with real
  resident-uploaded images (Vercel Blob/S3). No proprietary brand assets are used.
- **Icons:** none — the design is type-and-color driven (no icon font dependency).

---

## Interaction notes
- Card hover/active: cards are clickable (`cursor:pointer`); keep a subtle lift/border on hover.
- Ticker: continuous marquee (`@keyframes`, ~46s) of recent city headlines.
- Submit: stepper with safety gate; success state shows an automated-scan result message.
- Map: `scrollWheelZoom` is off by default; pins bind popups linking to the post; legend toggles a
  category filter shared with the side list.
- Persisted state in the prototype uses `localStorage` keys `gnbn_posts_v3`, `gnbn_queue_v3`,
  `gnbn_city`, `gnbn_digest_v1`, `gnbn_sub_v1` — all replaced by your DB/session in production.

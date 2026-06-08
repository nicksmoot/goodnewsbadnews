# Good News Bad News

**Good News Bad News — What residents are seeing.**

A production-ready civic media MVP for Spokane, Washington. The product organizes resident reports into verified community signals:

- Good News
- Warning Signals
- Opportunity Signals

The operating loop is: **Signal → Verification → Pattern → Response Requested → Community Action → Resolution**.

## Look and feel

The interface is designed to feel like a New York Times local section with a Front Porch Forum trust layer, Nextdoor neighborhood utility, and a modern civic technology dashboard. It uses a newspaper-style masthead, serif headlines, warm paper background, strong black typography, and restrained signal colors.

## Tech stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase
- Stripe
- Resend
- Vercel

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Routes

- `/` landing page
- `/spokane` Spokane feed
- `/spokane/downtown`, `/spokane/north-side`, `/spokane/south-hill`, `/spokane-valley` neighborhood feeds
- `/terms`, `/privacy`, `/community-standards`, `/corrections`, `/right-of-reply` trust and legal pages

## Environment variables

Copy `.env.example` to `.env.local` and fill in credentials. For public launch readiness, complete `GO_LIVE_CHECKLIST.md` before sending real traffic to the site.

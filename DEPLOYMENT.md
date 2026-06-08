# Deployment

## Launch status

This codebase is deployable to Vercel, but it is **not ready for public go-live** until the payment, auth, moderation, webhook, RLS, and email items in `GO_LIVE_CHECKLIST.md` are completed.

## Vercel

1. Import `nicksmoot/goodnewsbadnews` into Vercel.
2. Set the framework preset to Next.js.
3. Add the environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
5. Deploy from the production branch.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Enable email auth for MVP sign-up.
4. Add row-level security policies before public launch; moderators should be the only users allowed to publish or reject signals.

## Stripe

Create products and prices:

- Signal Submission: one-time `$0.50`
- Subscription: recurring `$5/month`

The UI now posts to `/api/stripe/checkout`. Configure either Stripe-hosted Payment Links or Checkout Price IDs:

- Payment Links: `STRIPE_SIGNAL_SUBMISSION_PAYMENT_LINK`, `STRIPE_SUBSCRIPTION_PAYMENT_LINK`
- Checkout Price IDs: `STRIPE_SIGNAL_SUBMISSION_PRICE_ID`, `STRIPE_SUBSCRIPTION_PRICE_ID`

Payment Links are fastest for a manual launch. Checkout Price IDs are better when the app needs richer session metadata and webhook-driven subscription records.

Configure the webhook endpoint at `/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET` in Vercel.

## Resend

1. Verify the sending domain.
2. Set `RESEND_API_KEY` and `DIGEST_FROM_EMAIL`.
3. Schedule a Vercel Cron POST to `/api/digest/saturday` with `Authorization: Bearer $CRON_SECRET`.

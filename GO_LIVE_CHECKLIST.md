# Go-Live Checklist

The MVP is **not ready for public launch** until each item below is complete in production.

## Payments

- Create a Stripe one-time Price for **Signal Submission** at `$0.50`.
- Create a Stripe recurring monthly Price for **Good News Bad News Membership** at `$5/month`.
- Set either hosted Stripe Payment Links:
  - `STRIPE_SIGNAL_SUBMISSION_PAYMENT_LINK`
  - `STRIPE_SUBSCRIPTION_PAYMENT_LINK`
- Or set Stripe Checkout Price IDs:
  - `STRIPE_SIGNAL_SUBMISSION_PRICE_ID`
  - `STRIPE_SUBSCRIPTION_PRICE_ID`
- Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel.
- Configure the Stripe webhook endpoint at `/api/stripe/webhook`.
- Confirm `ALLOW_DEMO_MODE=false` in production.
- Verify `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted` events update Supabase subscription records.
- Verify checkout success and cancel redirects in production.

## Accounts and permissions

- Enable Supabase Auth sign-up and email confirmation.
- Add row-level security policies for all public tables.
- Set `ADMIN_API_TOKEN` in Vercel before using moderation endpoints.
- Restrict publish/reject/resolve moderation actions to moderator/admin roles before replacing the token-gated MVP route.
- Confirm Stripe checkout sessions create or update Supabase users and subscriptions.

## Editorial safety

- Staff the Submitted → AI Review → Human Review → Published queue.
- Confirm safety review blocks doxxing, minor names, private medical information, unverified allegations, threats, and harassment.
- Publish correction and right-of-reply operating procedures.

## Email digest

- Verify the Resend sending domain.
- Set `RESEND_API_KEY`, `DIGEST_FROM_EMAIL`, and `CRON_SECRET`.
- Schedule the Saturday digest job.
- Test Good Only, Warning Only, Opportunity Only, and All Signals preferences.

## Launch verification

- Run `npm run lint`.
- Run `npm run build`.
- Smoke test `/`, `/spokane`, every neighborhood route, legal pages, checkout links, webhook receipt, and digest delivery on the production URL.

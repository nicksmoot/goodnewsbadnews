# Stripe setup — membership checkout, webhook, portal

The code ships inert: until the env vars below exist, every payment surface
degrades gracefully ("Payments aren't configured yet"). Do this in **Test
mode** first (toggle top-right in the Stripe Dashboard), confirm with a test
card, then repeat the same steps with Live mode values.

## 1. Create the membership product

1. Stripe Dashboard → **Product catalog → Add product**
   - Name: `GNBN Membership`
   - Price: **$5.00 USD, Recurring, Monthly**
2. Save, then copy the **Price ID** (`price_...`).

## 2. Grab your API keys

Dashboard → **Developers → API keys**: copy the **Secret key** (`sk_test_...`).

## 3. Add env vars in Vercel (Settings → Environment Variables)

```
STRIPE_SECRET_KEY        = sk_test_...
STRIPE_PRICE_MEMBERSHIP  = price_...        (from step 1)
NEXT_PUBLIC_SITE_URL     = https://goodnewsbadnews.vercel.app
```

(`NEXT_PUBLIC_SITE_URL` must be set - Stripe redirects back to it after
checkout.)

## 4. Deploy, then register the webhook

The webhook tells the site "this person paid" - without it memberships never
activate.

1. Push/redeploy so `/api/stripe/webhook` exists in production.
2. Dashboard → **Developers → Webhooks → Add endpoint**
   - Endpoint URL: `https://goodnewsbadnews.vercel.app/api/stripe/webhook`
   - Events to send:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
3. After creating it, reveal the **Signing secret** (`whsec_...`) and add it
   in Vercel:
   ```
   STRIPE_WEBHOOK_SECRET = whsec_...
   ```
4. Redeploy once more so the secret is live.

## 5. Customer portal (manage/cancel button)

Dashboard → **Settings → Billing → Customer portal** → click **Activate**
(defaults are fine). The site's "Manage subscription" button uses it.

## 6. Test the loop (Test mode)

1. On the live site, sign in → Account → **Become a member - $5/month**.
2. Pay with card `4242 4242 4242 4242`, any future expiry, any CVC/ZIP.
3. You land back on `/account?welcome=member` - within a few seconds the
   webhook flips you to **Member - full access** (the story paywall unlocks
   on your next page load, at most ~1 minute).
4. Open any story: no gate, full article. "Manage subscription" opens the
   Stripe portal; cancel there and the webhook downgrades you.

## Apple Pay

Stripe Checkout shows Apple Pay automatically on Safari/iOS once your domain
is registered: Dashboard → **Settings → Payments → Payment method domains** →
add `goodnewsbadnews.vercel.app`. Cards work everywhere regardless.

## The $0.50-per-post switch (optional, off by default)

`lib/config.ts` → `paidModel: false` is the launch stance (free submissions,
maximum signal). To charge $0.50 per post (members get 15/month included):

1. Create a second product: `Signal submission`, **$0.50 one-time**.
2. Add `STRIPE_PRICE_SUBMISSION = price_...` in Vercel.
3. Set `paidModel: true` in `lib/config.ts` and deploy.

Posting then requires sign-in; non-members (and members past 15 posts) are
sent through a $0.50 checkout, and the signal enters moderation only after
payment (webhook-confirmed).

## Per-story reading unlocks ($0.50 to read one story)

The same `STRIPE_PRICE_SUBMISSION` ($0.50) price also powers per-story reading:
a signed-in reader who isn't a member can pay $0.50 to unlock a single story
instead of subscribing. No extra product or env var is needed. The unlock is
tied to their account (table `StoryUnlock`) and persists across devices.

It is confirmed two ways for robustness: synchronously the moment the reader
returns from Checkout (`/api/billing/unlock/confirm` verifies the paid session),
and via the `checkout.session.completed` webhook as a backstop. Both are already
covered by the webhook events you set up above, so there is nothing extra to
configure. If `STRIPE_PRICE_SUBMISSION` is unset, the per-story unlock button is
simply unavailable and readers are offered membership only.

## Going live

Repeat steps 1-5 with **Live mode** keys (`sk_live_...`, live price IDs, a
live-mode webhook + its own `whsec_...`), replacing the test values in Vercel.

# Backend setup — Stage 1: accounts + database

This wires the app to a real Postgres database with email/password accounts
(Auth.js). Do the Vercel setup **before** deploying, or the build will fail
(it runs database migrations during the build).

## 1. Create the database (Vercel Postgres)

1. Vercel → your project → **Storage** tab → **Create Database** → **Postgres**.
2. Accept the defaults and **connect it to the `goodnewsbadnews` project**
   (all environments: Production, Preview, Development).
3. This automatically adds the DB connection env vars to the project. The
   Neon integration provides `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED`
   (direct), which is what `prisma/schema.prisma` uses. **Leave the "Custom
   Prefix" field blank** when connecting, so the variable names aren't renamed.

## 2. Add the auth secret

1. Generate a secret locally:
   ```bash
   openssl rand -base64 33
   ```
2. Vercel → **Settings → Environment Variables** → add
   `AUTH_SECRET` = the value you just generated (all environments).

## 3. Deploy

Push (or redeploy). The build command runs:
```
prisma generate && prisma migrate deploy && next build
```
`prisma migrate deploy` creates the `User` table from `prisma/migrations`.
When it goes green you'll have:

- `/signin` — create an account or sign in (email + password)
- `/account` — membership status, monthly post quota, sign out
- A **Sign in / Account** link in the header

## What's stored

The `User` table holds email, hashed password (bcrypt), name, and
membership/billing fields (`plan`, `stripeCustomerId`, `subscriptionStatus`,
`currentPeriodEnd`, `postsThisPeriod`) that Stage 2 (Stripe) will populate.
Passwords are hashed — never stored in plain text.

## Local development (optional)

```bash
cp .env.example .env      # fill in a local Postgres URL + AUTH_SECRET
npx prisma migrate dev    # create the schema locally
npm run dev
```

## Next stages

- **Stage 2 — Stripe:** `$5/mo` membership via Stripe Checkout (Apple Pay +
  cards), webhook to sync `subscriptionStatus`, and gate full stories (teasers
  for non-members).
- **Stage 3 — posting:** move submissions into the DB, enforce the
  15-posts/month member quota, and charge `$0.50` per post beyond it.

## Making yourself an admin (moderation access)

The moderation board (`/admin`) and its APIs are now gated by a `role` column
on the `User` table. After creating your own account on the site:

1. Vercel → **Storage** → your Neon database → **Open in Neon Console** →
   **SQL Editor**.
2. Run (with your real email):
   ```sql
   UPDATE "User" SET role = 'admin' WHERE email = 'you@example.com';
   ```
3. Sign out and back in on the site (the role rides in the session token).

## What's real now (no Stripe required)

- **Submissions** are stored in Postgres: anyone can submit (signed-in users
  get their byline), admins moderate at `/admin`, and publishing pushes the
  story live to every visitor's feed, map, and story pages.
- **Digest signups** are stored in `DigestSubscriber` (email, city,
  preference) - your launch audience list. Sending comes later via Resend.
- **Partner inquiries** are stored in `PartnerInquiry` (org, interest, email,
  note) - your newsroom sales pipeline. Query both tables in the Neon SQL
  editor anytime.

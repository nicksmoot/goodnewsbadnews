# Email setup: the Saturday Digest

The digest sending pipeline is fully wired. Until you add a Resend API key it
simply no-ops (nothing sends, nothing breaks). Turning it on is one account and
three env vars.

## What's already built

- `lib/email.ts` sends via Resend's HTTP API (no SDK). No key set means it
  safely skips.
- `lib/digest.ts` builds each issue: subject, HTML, and text, in two tiers.
  Free subscribers get the teaser (headlines that link into stories); members
  get the full edition (every story written out). Tier is decided per
  subscriber by matching their email to a member account.
- `app/api/digest/send` sends it:
  - `GET` is the Vercel Cron entry point (secured by `CRON_SECRET`).
  - `POST` is the manual/admin trigger, with options.
- `vercel.json` schedules the cron for Saturday 15:00 UTC (about 8am Pacific /
  11am Eastern). Adjust the cron string if you want a different time.

## Turn it on

1. Create a free account at resend.com.
2. Add and verify your sending domain (gnbnmedia.com). Resend shows the DNS
   records to add at GoDaddy (SPF/DKIM). This is what lets mail actually land.
3. Create an API key, then in Vercel (Settings -> Environment Variables,
   Production) set:
   ```
   RESEND_API_KEY = re_...
   DIGEST_FROM    = Good News Bad News <digest@gnbnmedia.com>
   CRON_SECRET    = <any long random string>
   ```
   `CRON_SECRET` is what Vercel Cron sends in the Authorization header so a
   stranger can't trigger a blast. Generate one with `openssl rand -hex 24`.
4. Redeploy.

## Verify before the first real send

Everything below works from your terminal (swap in your domain and secret).

- **Dry run** (counts who would get full vs teaser, sends nothing, returns a
  sample issue). Run it signed in as an admin, or with the cron secret:
  ```
  curl -s -X POST https://www.gnbnmedia.com/api/digest/send \
    -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" \
    -d '{"dryRun":true}'
  ```
- **Test send** to one address (tier reflects whether that email is a member):
  ```
  curl -s -X POST https://www.gnbnmedia.com/api/digest/send \
    -H "Authorization: Bearer $CRON_SECRET" -H "Content-Type: application/json" \
    -d '{"test":"you@youremail.com","city":"spokane"}'
  ```
- The weekly cron runs automatically once deployed. To fire it by hand:
  ```
  curl -s https://www.gnbnmedia.com/api/digest/send \
    -H "Authorization: Bearer $CRON_SECRET"
  ```

## Notes

- Content is built from published resident stories for each subscriber's city,
  enriched with the seed set so early issues are never empty.
- Membership is read live at send time, so upgrades and cancellations are always
  reflected without touching the subscriber list.
- Vercel Cron is available on Pro. On Hobby you can trigger the same GET endpoint
  from any external scheduler (cron-job.org, GitHub Actions) with the secret.

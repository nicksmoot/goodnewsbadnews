import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { seedPosts, CityKey, CITIES } from "@/lib/data";
import { submissionToPost } from "@/lib/submissions";
import { buildIssue, DigestPost, Tier } from "@/lib/digest";
import { emailConfigured, sendEmail } from "@/lib/email";
import { siteUrl } from "@/lib/site";
import { unsubscribeUrl, unsubscribeApiUrl } from "@/lib/unsub";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Sends the tiered Saturday Digest.
//  - GET  : the Vercel Cron entry point (secured with CRON_SECRET). Live send.
//  - POST : manual / admin trigger. Body: { dryRun?, test?, city?, limit? }.
//      dryRun -> count who would get what, send nothing (also returns a sample).
//      test   -> send one issue to that address only.
//
// Gracefully reports (does not crash) when RESEND_API_KEY is not configured.

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function issueLabel(): string {
  const d = new Date();
  return `Week of ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function toDigestPost(p: { id: string; cat: string; title: string; summary: string; hood: string; by: string; seeded?: boolean }): DigestPost {
  return { id: p.id, cat: p.cat, title: p.title, summary: p.summary, hood: p.hood, by: p.by, seeded: p.seeded };
}

// Published resident stories (recent first) enriched with the seed set, deduped
// by title, for one city.
async function postsForCity(city: CityKey): Promise<DigestPost[]> {
  const rows = await prisma.submission.findMany({
    where: { wf: "Published", city },
    orderBy: { publishedAt: "desc" },
    take: 60,
  });
  const published = rows.map(submissionToPost).map(toDigestPost);
  const seeds = seedPosts().filter((p) => p.city === city).map(toDigestPost);
  const seen = new Set<string>();
  const out: DigestPost[] = [];
  for (const p of [...published, ...seeds]) {
    const key = p.title.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

interface RunOpts { dryRun?: boolean; test?: string; city?: CityKey; limit?: number }

async function run(opts: RunOpts) {
  const base = siteUrl();
  const label = issueLabel();
  const configured = emailConfigured();

  // Cache posts per city so we build each city's set once.
  const postCache: Partial<Record<CityKey, DigestPost[]>> = {};
  const postsFor = async (c: CityKey) => (postCache[c] ??= await postsForCity(c));

  // Everyone with an active membership gets the full edition.
  const members = await prisma.user.findMany({ where: { plan: "member" }, select: { email: true } });
  const memberEmails = new Set(members.map((m) => m.email.toLowerCase()));
  const tierFor = (email: string): Tier => (memberEmails.has(email.toLowerCase()) ? "full" : "teaser");

  // Test mode: one issue to one address.
  if (opts.test) {
    const city = opts.city || "spokane";
    const posts = await postsFor(city);
    const tier = tierFor(opts.test);
    const issue = buildIssue({ cityName: CITIES[city].name, tier, preference: "All Signals", posts, baseUrl: base, issueLabel: label });
    const result = configured ? await sendEmail({ to: opts.test, subject: issue.subject, html: issue.html, text: issue.text }) : { ok: false, skipped: true };
    return { mode: "test", configured, to: opts.test, tier, city, result };
  }

  const subscribers = await prisma.digestSubscriber.findMany({
    where: opts.city ? { city: opts.city } : undefined,
    orderBy: { createdAt: "asc" },
    ...(opts.limit ? { take: opts.limit } : {}),
  });

  const report = { mode: opts.dryRun ? "dryRun" : "send", configured, total: subscribers.length, full: 0, teaser: 0, sent: 0, skipped: 0, failed: 0, errors: [] as string[] };

  for (const sub of subscribers) {
    const tier = tierFor(sub.email);
    report[tier] += 1;
    if (opts.dryRun) continue;
    if (!configured) { report.skipped += 1; continue; }
    const city = (sub.city as CityKey) in CITIES ? (sub.city as CityKey) : "spokane";
    const posts = await postsFor(city);
    const issue = buildIssue({ cityName: CITIES[city].name, tier, preference: sub.preference || "All Signals", posts, baseUrl: base, issueLabel: label, unsubscribeUrl: unsubscribeUrl(sub.email) });
    const r = await sendEmail({
      to: sub.email, subject: issue.subject, html: issue.html, text: issue.text,
      headers: {
        "List-Unsubscribe": `<${unsubscribeApiUrl(sub.email)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    if (r.ok) report.sent += 1;
    else { report.failed += 1; if (r.error && report.errors.length < 10) report.errors.push(`${sub.email}: ${r.error}`); }
  }

  // In a dry run, include a sample teaser so you can eyeball the issue.
  let sample: string | undefined;
  if (opts.dryRun) {
    const city = opts.city || "spokane";
    const posts = await postsFor(city);
    sample = buildIssue({ cityName: CITIES[city].name, tier: "teaser", preference: "All Signals", posts, baseUrl: base, issueLabel: label }).html;
  }

  return { ...report, sample };
}

function cronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

// Vercel Cron hits this (GET) on schedule; secured by CRON_SECRET.
export async function GET(req: Request) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const result = await run({});
  return NextResponse.json(result);
}

// Manual / admin trigger with options.
export async function POST(req: Request) {
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  if (!isAdmin && !cronAuthorized(req)) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  let body: RunOpts = {};
  try {
    body = (await req.json()) as RunOpts;
  } catch {
    /* empty body is fine */
  }
  const result = await run({
    dryRun: !!body.dryRun,
    test: typeof body.test === "string" ? body.test : undefined,
    city: body.city && body.city in CITIES ? body.city : undefined,
    limit: typeof body.limit === "number" ? body.limit : undefined,
  });
  return NextResponse.json(result);
}

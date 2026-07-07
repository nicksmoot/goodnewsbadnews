import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { scan, typeToCat, coordFor, CityKey } from "@/lib/data";
import { config } from "@/lib/config";
import { stripe, stripeConfigured, SUBMISSION_PRICE } from "@/lib/stripe";
import { siteUrl } from "@/lib/site";

// Anyone can submit a signal (anonymous participation is part of the brief);
// signed-in users get their byline. When config.paidModel is on, posting costs
// $0.50 unless you're a member with included posts left (15/month).
const schema = z.object({
  title: z.string().trim().min(8).max(200),
  type: z.string().max(40),
  topic: z.string().max(60),
  neighborhood: z.string().max(80),
  cross: z.string().max(120).optional().default(""),
  body: z.string().trim().min(300).max(20000),
  tags: z.string().max(300).optional().default(""),
  photo: z.string().max(3_000_000).optional().default(""),
  city: z.enum(["spokane", "honolulu"]),
});

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Give your signal a real headline (8+ characters) and a story with substance (300+ characters)." },
      { status: 400 }
    );
  }
  const d = parsed.data;
  if (d.photo && !d.photo.startsWith("data:image/")) {
    return NextResponse.json({ error: "Photo must be an image." }, { status: 400 });
  }

  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;

  const isMember = user?.plan === "member" && user?.subscriptionStatus === "active";
  const hasIncludedPost = isMember && (user?.postsThisPeriod ?? 0) < 15;
  const mustPay = config.paidModel && !hasIncludedPost;

  if (mustPay && !user) {
    return NextResponse.json(
      { error: "Sign in to submit - posting costs $0.50 (free for members with included posts)." },
      { status: 401 }
    );
  }
  if (mustPay && (!stripeConfigured() || !SUBMISSION_PRICE())) {
    return NextResponse.json({ error: "Paid submissions aren't configured yet." }, { status: 503 });
  }

  const result = scan(d.title + " " + d.body);
  const cat = typeToCat(d.type);
  const coords = coordFor(d.city as CityKey, d.neighborhood, d.title + Math.random().toString(36).slice(2));
  const by = user?.name?.trim() || "Resident";

  const sub = await prisma.submission.create({
    data: {
      userId: user?.id || null,
      title: d.title,
      cat,
      topic: d.topic,
      hood: d.neighborhood,
      cross: d.cross,
      body: d.body,
      tags: (d.tags || "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5).join(","),
      photo: d.photo || "",
      by,
      city: d.city,
      lat: coords.lat,
      lng: coords.lng,
      scanLevel: result.level,
      scanMsg: result.msg,
      wf: mustPay ? "PendingPayment" : "New",
    },
  });

  if (mustPay && user) {
    try {
      const base = siteUrl();
      const checkout = await stripe().checkout.sessions.create({
        mode: "payment",
        customer: user.stripeCustomerId ?? undefined,
        customer_email: user.stripeCustomerId ? undefined : user.email,
        line_items: [{ price: SUBMISSION_PRICE(), quantity: 1 }],
        success_url: `${base}/submit?paid=1`,
        cancel_url: `${base}/submit?canceled=1`,
        metadata: { submissionId: sub.id, userId: user.id },
      });
      await prisma.submission.update({ where: { id: sub.id }, data: { stripeSessionId: checkout.id } });
      return NextResponse.json({ ok: true, id: sub.id, payUrl: checkout.url, scanMessage: result.msg });
    } catch (e) {
      console.error("submission checkout error", e);
      await prisma.submission.delete({ where: { id: sub.id } }).catch(() => null);
      return NextResponse.json({ error: "Could not start the $0.50 checkout. Please try again." }, { status: 502 });
    }
  }

  // Count this post against a member's monthly included quota.
  if (isMember && user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { postsThisPeriod: { increment: 1 } },
    }).catch(() => null);
  }

  return NextResponse.json({ ok: true, id: sub.id, scanMessage: result.msg });
}

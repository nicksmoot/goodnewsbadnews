import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { stripe, stripeConfigured, SUBMISSION_PRICE } from "@/lib/stripe";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

// Does the signed-in reader already have access to this story?
// Members read everything; otherwise we look for a paid unlock.
export async function GET(req: Request) {
  const session = await auth();
  const postId = new URL(req.url).searchParams.get("postId") || "";
  if (!session?.user?.id || !postId) {
    return NextResponse.json({ unlocked: false, isMember: false });
  }
  const isMember = session.user.plan === "member";
  if (isMember) return NextResponse.json({ unlocked: true, isMember: true });

  const hit = await prisma.storyUnlock.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
    select: { id: true },
  });
  return NextResponse.json({ unlocked: !!hit, isMember: false });
}

// Start a $0.50 Checkout to unlock a single story (micro-payment to read).
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to unlock this story." }, { status: 401 });
  }

  let postId = "";
  try {
    postId = (await req.json())?.postId || "";
  } catch {
    /* ignore */
  }
  if (!postId) return NextResponse.json({ error: "Missing story." }, { status: 400 });

  // Members and prior buyers don't pay again.
  if (session.user.plan === "member") return NextResponse.json({ unlocked: true });
  const existing = await prisma.storyUnlock.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
    select: { id: true },
  });
  if (existing) return NextResponse.json({ unlocked: true });

  if (!stripeConfigured() || !SUBMISSION_PRICE()) {
    return NextResponse.json(
      { error: "Per-story unlock isn't available yet. Set STRIPE_SECRET_KEY and STRIPE_PRICE_SUBMISSION." },
      { status: 503 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  try {
    const base = siteUrl();
    const back = `${base}/post/${encodeURIComponent(postId)}`;
    const checkout = await stripe().checkout.sessions.create({
      mode: "payment",
      customer: user.stripeCustomerId ?? undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      line_items: [{ price: SUBMISSION_PRICE(), quantity: 1 }],
      success_url: `${back}?unlock={CHECKOUT_SESSION_ID}`,
      cancel_url: back,
      metadata: { kind: "unlock", userId: user.id, postId },
    });
    return NextResponse.json({ url: checkout.url });
  } catch (e) {
    console.error("unlock checkout error", e);
    return NextResponse.json({ error: "Could not start the $0.50 checkout. Please try again." }, { status: 502 });
  }
}

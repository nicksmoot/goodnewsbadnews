import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { recordUnlock } from "@/lib/billing";

export const dynamic = "force-dynamic";

// Confirm a paid unlock the moment the reader returns from Checkout, so the
// story opens immediately without waiting on the webhook. Verifies the session
// really was paid and belongs to this reader, then records it (idempotent).
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ unlocked: false }, { status: 401 });
  }
  if (!stripeConfigured()) {
    return NextResponse.json({ unlocked: false }, { status: 503 });
  }

  let sessionId = "";
  try {
    sessionId = (await req.json())?.sessionId || "";
  } catch {
    /* ignore */
  }
  if (!sessionId) return NextResponse.json({ unlocked: false }, { status: 400 });

  try {
    const cs = await stripe().checkout.sessions.retrieve(sessionId);
    const paid = cs.payment_status === "paid";
    const meta = cs.metadata || {};
    const mine = meta.userId === session.user.id;
    const postId = meta.postId || "";
    if (paid && mine && meta.kind === "unlock" && postId) {
      await recordUnlock(session.user.id, postId);
      return NextResponse.json({ unlocked: true });
    }
    return NextResponse.json({ unlocked: false });
  } catch (e) {
    console.error("unlock confirm error", e);
    return NextResponse.json({ unlocked: false }, { status: 502 });
  }
}

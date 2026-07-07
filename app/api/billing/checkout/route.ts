import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { stripe, stripeConfigured, MEMBERSHIP_PRICE } from "@/lib/stripe";
import { siteUrl } from "@/lib/site";

// Start a $5/month membership checkout (Stripe-hosted; Apple Pay + cards).
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to become a member." }, { status: 401 });
  }
  if (!stripeConfigured() || !MEMBERSHIP_PRICE()) {
    return NextResponse.json(
      { error: "Payments aren't configured yet. Set STRIPE_SECRET_KEY and STRIPE_PRICE_MEMBERSHIP." },
      { status: 503 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });

  try {
    // Reuse the Stripe customer if we have one; create it otherwise.
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe().customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const base = siteUrl();
    const checkout = await stripe().checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: MEMBERSHIP_PRICE(), quantity: 1 }],
      success_url: `${base}/account?welcome=member`,
      cancel_url: `${base}/account`,
      allow_promotion_codes: true,
      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (e) {
    console.error("checkout error", e);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 502 });
  }
}

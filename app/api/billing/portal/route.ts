import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { siteUrl } from "@/lib/site";

// Open the Stripe customer portal (manage / cancel the membership).
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (!stripeConfigured()) return NextResponse.json({ error: "Payments aren't configured yet." }, { status: 503 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing profile yet - become a member first." }, { status: 400 });
  }

  try {
    const portal = await stripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${siteUrl()}/account`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (e) {
    console.error("portal error", e);
    return NextResponse.json({ error: "Could not open the billing portal." }, { status: 502 });
  }
}

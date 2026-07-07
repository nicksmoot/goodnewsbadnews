import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { applyStripeEvent } from "@/lib/billing";

// Stripe calls this endpoint; signature verification proves it's really Stripe.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeConfigured() || !secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = stripe().webhooks.constructEvent(payload, signature, secret);
  } catch (e) {
    console.error("webhook signature verification failed", e);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    const result = await applyStripeEvent(event);
    return NextResponse.json({ received: true, result });
  } catch (e) {
    console.error("webhook handling failed", event.type, e);
    // 500 makes Stripe retry, which is what we want for transient DB issues.
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }
}

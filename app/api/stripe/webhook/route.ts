import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { isDemoModeEnabled } from "@/lib/demo";
import { stripe } from "@/lib/stripe";
import { createSupabaseServiceClient } from "@/lib/supabase";

async function upsertSubscription(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  const stripeSubscriptionId =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

  if (!email || !stripeCustomerId || !stripeSubscriptionId) {
    throw new Error("Checkout session is missing email, customer, or subscription id");
  }

  const supabase = createSupabaseServiceClient();
  const { data: user, error: userError } = await supabase
    .from("users")
    .upsert({ email }, { onConflict: "email" })
    .select("id")
    .single();

  if (userError) throw userError;

  const subscriptionPayload = {
    user_id: user.id,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: stripeSubscriptionId,
    plan: "GOOD_NEWS_BAD_NEWS_MONTHLY",
    status: "active"
  };

  const { data: existing, error: existingError } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .maybeSingle();

  if (existingError) throw existingError;

  const result = existing
    ? await supabase.from("subscriptions").update(subscriptionPayload).eq("id", existing.id)
    : await supabase.from("subscriptions").insert(subscriptionPayload);

  if (result.error) throw result.error;
}

async function updateSubscriptionStatus(subscription: Stripe.Subscription) {
  const supabase = createSupabaseServiceClient();
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: subscription.status })
    .eq("stripe_subscription_id", subscription.id);

  if (error) throw error;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) {
    if (isDemoModeEnabled()) return NextResponse.json({ received: true, demo: true });
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 503 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      if (isDemoModeEnabled()) return NextResponse.json({ received: true, type: event.type, demo: true });
      return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.mode === "subscription") await upsertSubscription(session);
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await updateSubscriptionStatus(event.data.object);
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import Stripe from "stripe";

// Lazy singleton so builds without STRIPE_SECRET_KEY don't crash at import time.
let client: Stripe | null = null;

export function stripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function stripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    client = new Stripe(key, { apiVersion: "2024-12-18.acacia" });
  }
  return client;
}

export const MEMBERSHIP_PRICE = () => process.env.STRIPE_PRICE_MEMBERSHIP || "";
export const SUBMISSION_PRICE = () => process.env.STRIPE_PRICE_SUBMISSION || "";

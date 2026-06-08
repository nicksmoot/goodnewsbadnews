import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia"
});

export const stripeProducts = {
  signalSubmission: { name: "Signal Submission", amount: 50, currency: "usd" },
  subscription: { name: "Good News Bad News Membership", amount: 500, interval: "month" as const, currency: "usd" }
};

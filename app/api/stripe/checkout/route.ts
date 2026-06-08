import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/urls";
import { stripe, stripeProducts } from "@/lib/stripe";

type CheckoutType = "signal_submission" | "subscription";

const paymentLinks: Record<CheckoutType, string | undefined> = {
  signal_submission: process.env.STRIPE_SIGNAL_SUBMISSION_PAYMENT_LINK,
  subscription: process.env.STRIPE_SUBSCRIPTION_PAYMENT_LINK
};

const priceIds: Record<CheckoutType, string | undefined> = {
  signal_submission: process.env.STRIPE_SIGNAL_SUBMISSION_PRICE_ID,
  subscription: process.env.STRIPE_SUBSCRIPTION_PRICE_ID
};

function isCheckoutType(value: FormDataEntryValue | null): value is CheckoutType {
  return value === "signal_submission" || value === "subscription";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const checkoutType = formData.get("checkoutType");
  const email = formData.get("email");

  if (!isCheckoutType(checkoutType)) {
    return NextResponse.json({ error: "checkoutType must be signal_submission or subscription" }, { status: 400 });
  }

  const configuredPaymentLink = paymentLinks[checkoutType];
  if (configuredPaymentLink) {
    return NextResponse.redirect(configuredPaymentLink, { status: 303 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured. Add a Payment Link or STRIPE_SECRET_KEY with Price IDs before launch." }, { status: 503 });
  }

  const siteUrl = getSiteUrl();
  const isSubscription = checkoutType === "subscription";
  const product = isSubscription ? stripeProducts.subscription : stripeProducts.signalSubmission;
  const configuredPrice = priceIds[checkoutType];

  const session = await stripe.checkout.sessions.create({
    mode: isSubscription ? "subscription" : "payment",
    customer_email: typeof email === "string" && email.includes("@") ? email : undefined,
    line_items: [
      configuredPrice
        ? { price: configuredPrice, quantity: 1 }
        : {
            price_data: {
              currency: product.currency,
              product_data: { name: product.name },
              unit_amount: product.amount,
              ...(isSubscription ? { recurring: { interval: stripeProducts.subscription.interval } } : {})
            },
            quantity: 1
          }
    ],
    allow_promotion_codes: isSubscription,
    success_url: `${siteUrl}/payment/success?checkout=${checkoutType}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/payment/cancel?checkout=${checkoutType}`,
    metadata: { checkoutType }
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a Checkout URL" }, { status: 502 });
  }

  return NextResponse.redirect(session.url, { status: 303 });
}

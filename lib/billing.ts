import type Stripe from "stripe";
import { prisma } from "./db";

// Pure-ish event application, separated from signature verification so the
// business logic is testable without Stripe's servers.
//
// Events we act on:
//  - checkout.session.completed (subscription) -> user becomes a member
//  - checkout.session.completed (payment)      -> paid submission enters the queue
//  - customer.subscription.updated/deleted     -> sync status; downgrade on cancel
//  - invoice.paid                              -> new billing period: reset post quota

function tsToDate(ts: number | null | undefined): Date | null {
  return ts ? new Date(ts * 1000) : null;
}

// Idempotently grant a reader access to one story. Shared by the webhook and
// the synchronous confirm-on-return path so an unlock lands even if the
// webhook is slow or not configured.
export async function recordUnlock(userId: string, postId: string): Promise<void> {
  await prisma.storyUnlock
    .upsert({
      where: { userId_postId: { userId, postId } },
      create: { userId, postId },
      update: {},
    })
    .catch(() => null);
}

export async function applyStripeEvent(event: Stripe.Event): Promise<string> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription") {
        const userId = session.metadata?.userId;
        if (!userId) return "no userId metadata";
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "member",
            subscriptionStatus: "active",
            stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
            postsThisPeriod: 0,
            periodStart: new Date(),
          },
        }).catch(() => null);
        return "membership activated";
      }
      if (session.mode === "payment") {
        // A $0.50 story unlock: grant the reader permanent access to one story.
        if (session.metadata?.kind === "unlock") {
          const userId = session.metadata?.userId;
          const postId = session.metadata?.postId;
          if (userId && postId) await recordUnlock(userId, postId);
          return "story unlocked";
        }
        // A paid signal: release it from PendingPayment into the moderation queue.
        await prisma.submission.updateMany({
          where: { stripeSessionId: session.id, wf: "PendingPayment" },
          data: { wf: "New", status: "Submitted" },
        });
        return "paid submission released";
      }
      return "ignored checkout mode";
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
      if (!customerId) return "no customer";
      const active = sub.status === "active" || sub.status === "trialing";
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          subscriptionStatus: sub.status,
          plan: active ? "member" : "free",
          currentPeriodEnd: tsToDate(sub.current_period_end),
        },
      });
      return active ? "subscription synced (active)" : "subscription downgraded";
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
      if (!customerId) return "no customer";
      // A fresh billing period starts: reset the monthly included-post counter.
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { postsThisPeriod: 0, periodStart: new Date(), subscriptionStatus: "active", plan: "member" },
      });
      return "period reset";
    }

    default:
      return "ignored";
  }
}

import Link from "next/link";

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const params = await searchParams;
  const isSubmission = params.checkout === "signal_submission";
  return (
    <div className="civic-container max-w-3xl py-16">
      <p className="kicker">Payment confirmed</p>
      <h1 className="mt-3 font-serif text-6xl font-black">Thank you.</h1>
      <p className="mt-6 text-xl leading-8 text-ink/75">
        {isSubmission
          ? "Your Signal Submission payment was received. The next production step is to attach this checkout session to the submitted signal record before moderation."
          : "Your membership checkout was completed. The next production step is to sync this Stripe subscription to your Supabase user record through the webhook."}
      </p>
      <Link href="/spokane" className="mt-8 inline-block bg-ink px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-paper">Return to Spokane</Link>
    </div>
  );
}

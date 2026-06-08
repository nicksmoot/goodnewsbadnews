export function SubscribeModal() {
  return (
    <section className="editorial-card p-6">
      <p className="kicker">Membership</p>
      <h2 className="mt-2 font-serif text-3xl font-black">Subscribe for $5/month</h2>
      <ul className="mt-4 grid gap-2 text-sm text-ink/80">
        <li>• Full feed and neighborhood feeds</li><li>• Saturday briefing by Resend</li><li>• Correction log and response requested queue</li><li>• Contributor leaderboard</li>
      </ul>
      <form action="/api/stripe/checkout" method="post" className="mt-5">
        <input type="hidden" name="checkoutType" value="subscription" />
        <button className="w-full bg-ink px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-paper" type="submit">Subscribe with Stripe</button>
      </form>
    </section>
  );
}

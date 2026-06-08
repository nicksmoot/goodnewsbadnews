const guardrails = ["No doxxing or private addresses", "No minor names", "No private medical information", "No unverified allegations", "No threats, harassment, or rumor chains"];

export function SignalSubmissionWizard() {
  return (
    <section id="submit" className="editorial-card p-6 md:p-8">
      <p className="kicker">Careful Submission Flow</p>
      <h2 className="mt-3 font-serif text-4xl font-black">Submit a community signal</h2>
      <p className="mt-3 max-w-3xl text-ink/75">Submissions enter Submitted → AI Review → Human Review → Published. A $0.50 Stripe Signal Submission fee discourages spam while preserving access.</p>
      <form action="/api/stripe/checkout" method="post" className="mt-6 grid gap-4 md:grid-cols-2">
        <input type="hidden" name="checkoutType" value="signal_submission" />
        <label className="grid gap-2 text-sm font-bold">Signal type<select className="border border-rule bg-paper p-3"><option>GOOD</option><option>WARNING</option><option>OPPORTUNITY</option></select></label>
        <label className="grid gap-2 text-sm font-bold">Neighborhood<select className="border border-rule bg-paper p-3"><option>Downtown</option><option>North Side</option><option>South Hill</option><option>Spokane Valley</option></select></label>
        <label className="grid gap-2 text-sm font-bold md:col-span-2">Headline<input className="border border-rule bg-paper p-3" placeholder="What are residents seeing?" /></label>
        <label className="grid gap-2 text-sm font-bold md:col-span-2">Verification notes<textarea className="min-h-32 border border-rule bg-paper p-3" placeholder="Dates, places, public records, photos, witnesses, or organizations that can verify this signal." /></label>
        <div className="md:col-span-2 rounded-none border border-warning/40 bg-warning/5 p-4"><p className="font-bold text-warning">Safety screen before payment</p><ul className="mt-2 grid gap-1 text-sm text-ink/75">{guardrails.map((rule) => <li key={rule}>• {rule}</li>)}</ul></div>
        <button className="bg-ink px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-paper md:w-fit" type="submit">Pay $0.50 and continue</button>
      </form>
    </section>
  );
}

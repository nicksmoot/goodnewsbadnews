import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="civic-container max-w-3xl py-16">
      <p className="kicker">Checkout canceled</p>
      <h1 className="mt-3 font-serif text-6xl font-black">No payment was collected.</h1>
      <p className="mt-6 text-xl leading-8 text-ink/75">You can return to the Spokane edition and restart the signal submission or membership checkout when ready.</p>
      <Link href="/spokane" className="mt-8 inline-block border border-ink px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Return to Spokane</Link>
    </div>
  );
}

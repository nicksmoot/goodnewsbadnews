import Link from "next/link";
import { signals } from "@/lib/data";
import { SignalCard } from "./SignalCard";

export function Hero() {
  return (
    <section className="civic-container py-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        <div className="editorial-card p-6 md:p-8">
          <p className="kicker">Spokane City Edition</p>
          <h1 className="mt-4 font-serif text-5xl font-black leading-[0.95] md:text-7xl">See it. Verify it. Solve it.</h1>
          <p className="mt-6 text-xl leading-8 text-ink/80">A production-ready civic media platform for Good News, Warning Signals, and Opportunity Signals.</p>
          <p className="mt-5 border-l-4 border-ink pl-4 font-semibold">We do not publish rumors. We publish verified community signals that help a city see itself clearly and act faster.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/spokane" className="bg-ink px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-paper">Read Spokane</Link>
            <a href="#submit" className="border border-ink px-5 py-3 text-sm font-black uppercase tracking-[0.18em]">Submit Signal</a>
          </div>
        </div>
        <SignalCard signal={signals[0]} featured />
      </div>
    </section>
  );
}

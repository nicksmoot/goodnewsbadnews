import { signals } from "@/lib/data";
import { SignalCard } from "./SignalCard";
import { SignalFilters } from "./SignalFilters";

export function SignalFeed({ neighborhood }: { neighborhood?: string }) {
  const filtered = neighborhood ? signals.filter((signal) => signal.neighborhood.toLowerCase().replaceAll(" ", "-") === neighborhood) : signals;
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><p className="kicker">Verified Feed</p><h2 className="font-serif text-4xl font-black">Signals residents can act on</h2></div>
        <SignalFilters />
      </div>
      <div className="grid gap-5">{filtered.map((signal) => <SignalCard key={signal.id} signal={signal} />)}</div>
    </section>
  );
}

import { ContributorLeaderboard } from "@/components/ContributorLeaderboard";
import { CorrectionLog } from "@/components/CorrectionLog";
import { NeighborhoodGrid } from "@/components/NeighborhoodGrid";
import { ResolvedSignals } from "@/components/ResolvedSignals";
import { ResponseRequested } from "@/components/ResponseRequested";
import { SignalFeed } from "@/components/SignalFeed";

export default function SpokanePage() {
  return <div className="civic-container space-y-10 py-10"><section className="border-b border-ink pb-8"><p className="kicker">City Edition</p><h1 className="font-serif text-6xl font-black">Spokane, Washington</h1><p className="mt-4 max-w-3xl text-xl text-ink/75">Good News, Warning Signals, and Opportunity Signals verified for civic action.</p></section><SignalFeed /><div className="grid gap-6 lg:grid-cols-3"><ResponseRequested /><ResolvedSignals /><CorrectionLog /></div><ContributorLeaderboard /><NeighborhoodGrid /></div>;
}

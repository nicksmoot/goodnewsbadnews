import { ContributorLeaderboard } from "@/components/ContributorLeaderboard";
import { CorrectionLog } from "@/components/CorrectionLog";
import { Hero } from "@/components/Hero";
import { NeighborhoodGrid } from "@/components/NeighborhoodGrid";
import { ResolvedSignals } from "@/components/ResolvedSignals";
import { ResponseRequested } from "@/components/ResponseRequested";
import { SignalFeed } from "@/components/SignalFeed";
import { SignalSubmissionWizard } from "@/components/SignalSubmissionWizard";
import { SubscribeModal } from "@/components/SubscribeModal";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="civic-container grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section className="border-y border-ink py-6"><p className="kicker">Editor&apos;s Note</p><p className="mt-3 font-serif text-3xl font-bold leading-tight">Spokane is the first edition: an editorial civic layer for signals, verification, response, action, and resolution.</p></section>
          <SignalFeed />
          <SignalSubmissionWizard />
          <NeighborhoodGrid />
          <ContributorLeaderboard />
        </div>
        <aside className="space-y-6"><SubscribeModal /><ResponseRequested /><ResolvedSignals /><CorrectionLog /></aside>
      </div>
    </>
  );
}

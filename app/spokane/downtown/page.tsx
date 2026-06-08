import { SignalFeed } from "@/components/SignalFeed";
import { SignalSubmissionWizard } from "@/components/SignalSubmissionWizard";

export default function NeighborhoodPage() {
  const name = "downtown".split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
  return <div className="civic-container space-y-10 py-10"><section className="border-b border-ink pb-8"><p className="kicker">Spokane Neighborhood Edition</p><h1 className="font-serif text-6xl font-black">{name}</h1><p className="mt-4 max-w-3xl text-xl text-ink/75">Structured neighborhood signals without social-network noise.</p></section><SignalFeed neighborhood="downtown" /><SignalSubmissionWizard /></div>;
}

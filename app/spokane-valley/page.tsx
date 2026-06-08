import { SignalFeed } from "@/components/SignalFeed";
import { SignalSubmissionWizard } from "@/components/SignalSubmissionWizard";

export default function SpokaneValleyPage() {
  return <div className="civic-container space-y-10 py-10"><section className="border-b border-ink pb-8"><p className="kicker">Regional Edition</p><h1 className="font-serif text-6xl font-black">Spokane Valley</h1><p className="mt-4 max-w-3xl text-xl text-ink/75">Regional growth, infrastructure, and service-request signals.</p></section><SignalFeed neighborhood="spokane-valley" /><SignalSubmissionWizard /></div>;
}

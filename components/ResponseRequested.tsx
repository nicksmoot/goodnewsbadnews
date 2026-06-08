import { signals } from "@/lib/data";
export function ResponseRequested() {
  const requested = signals.filter((s) => s.responseRequested);
  return <section className="editorial-card p-6"><p className="kicker">Response Requested</p><h2 className="mt-2 font-serif text-3xl font-black">Organizations asked to answer</h2><div className="mt-4 grid gap-3">{requested.map((signal) => <article key={signal.id} className="border-t border-rule pt-3"><p className="font-bold">{signal.title}</p><p className="text-sm text-muted">Requested from {signal.responseRequested}</p></article>)}</div></section>;
}

import { signals } from "@/lib/data";
export function ResolvedSignals() {
  return <section className="editorial-card p-6"><p className="kicker">Resolved This Week</p><h2 className="mt-2 font-serif text-3xl font-black">Community action with closure</h2><div className="mt-4 grid gap-3">{signals.filter((s) => s.status === "RESOLVED").map((s) => <div key={s.id} className="border-t border-rule pt-3"><p className="font-bold">{s.title}</p><p className="text-sm text-muted">{s.neighborhood} · {s.sourceNote}</p></div>)}</div></section>;
}

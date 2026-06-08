import { corrections } from "@/lib/data";
export function CorrectionLog() {
  return <section className="editorial-card p-6"><p className="kicker">Correction Log</p><h2 className="mt-2 font-serif text-3xl font-black">Transparent changes</h2><div className="mt-4 grid gap-3">{corrections.map((correction) => <article key={correction.signal} className="border-t border-rule pt-3"><p className="font-bold">{correction.signal}</p><p className="text-sm text-muted">{correction.status}: {correction.note}</p></article>)}</div></section>;
}

import { CivicSignalScore } from "./CivicSignalScore";
import type { Signal } from "@/lib/types";

const tone = {
  GOOD: "border-good text-good",
  WARNING: "border-warning text-warning",
  OPPORTUNITY: "border-opportunity text-opportunity"
};

export function SignalCard({ signal, featured = false }: { signal: Signal; featured?: boolean }) {
  return (
    <article className={`editorial-card p-5 ${featured ? "md:p-8" : ""}`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`border px-2 py-1 text-xs font-black uppercase tracking-[0.18em] ${tone[signal.signalType]}`}>{signal.signalType} Signal</span>
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-verified">{signal.confidenceLevel}</span>
        <span className="text-xs text-muted">{signal.neighborhood} · {signal.createdAt}</span>
      </div>
      <h2 className={`mt-4 font-serif font-black leading-tight ${featured ? "text-4xl md:text-5xl" : "text-2xl"}`}>{signal.title}</h2>
      <p className="mt-4 leading-7 text-ink/80">{signal.body}</p>
      {signal.responseRequested && (
        <p className="mt-4 border-l-4 border-verified pl-4 text-sm font-semibold">Response requested from: {signal.responseRequested}</p>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4 text-sm text-muted">
        <span>{signal.sourceNote}</span>
        <CivicSignalScore score={signal.civicScore} />
      </div>
    </article>
  );
}

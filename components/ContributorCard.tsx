import type { Contributor } from "@/lib/types";
import { CivicSignalScore } from "./CivicSignalScore";
export function ContributorCard({ contributor }: { contributor: Contributor }) {
  return <article className="border border-rule bg-paper p-4"><p className="font-serif text-2xl font-black">{contributor.name}</p><p className="text-sm text-muted">{contributor.role} · {contributor.neighborhood}</p><div className="mt-4 flex items-center justify-between gap-3"><span className="text-sm font-semibold">{contributor.verifiedSignals} verified signals</span><CivicSignalScore score={contributor.civicScore} /></div></article>;
}

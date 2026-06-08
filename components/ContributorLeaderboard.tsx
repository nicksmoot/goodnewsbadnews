import { contributors } from "@/lib/data";
import { ContributorCard } from "./ContributorCard";
export function ContributorLeaderboard() {
  return <section className="space-y-4"><div><p className="kicker">Top Contributors</p><h2 className="font-serif text-4xl font-black">Trusted local observers</h2></div><div className="grid gap-4 md:grid-cols-3">{contributors.map((contributor) => <ContributorCard key={contributor.name} contributor={contributor} />)}</div></section>;
}

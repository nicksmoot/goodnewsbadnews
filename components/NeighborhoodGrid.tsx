import Link from "next/link";
import { neighborhoods } from "@/lib/data";
export function NeighborhoodGrid() {
  return <section className="space-y-4"><div><p className="kicker">Neighborhood Pages</p><h2 className="font-serif text-4xl font-black">Choose your local signal layer</h2></div><div className="grid gap-4 md:grid-cols-4">{neighborhoods.map((n) => <Link key={n.slug} href={n.slug === "spokane-valley" ? "/spokane-valley" : `/spokane/${n.slug}`} className="editorial-card p-5 hover:border-ink"><h3 className="font-serif text-2xl font-black">{n.name}</h3><p className="mt-3 text-sm leading-6 text-ink/70">{n.summary}</p></Link>)}</div></section>;
}

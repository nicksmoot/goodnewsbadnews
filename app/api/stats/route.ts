import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { config } from "@/lib/config";
import { CITIES, CityKey } from "@/lib/data";

export const dynamic = "force-dynamic";

// Public counters for the home aside (counts only, no content). Also reports
// the seed phase: while a city has fewer than config.freeSeedStories published
// stories, posting and reading there are free. Iterates CITIES so new markets
// are covered automatically.
export async function GET() {
  const keys = Object.keys(CITIES) as CityKey[];
  const N = config.freeSeedStories;
  const entries = await Promise.all(
    keys.map(async (city) => {
      const [queue, published] = await Promise.all([
        prisma.submission.count({ where: { city, wf: { in: ["New", "Review", "Verified"] } } }),
        prisma.submission.count({ where: { city, wf: "Published" } }),
      ]);
      return [city, { queue, published, freePosting: published < N, freeRemaining: Math.max(0, N - published) }];
    })
  );
  return NextResponse.json({ freeSeedStories: N, ...Object.fromEntries(entries) });
}

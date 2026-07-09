import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { submissionToPost } from "@/lib/submissions";
import { config } from "@/lib/config";
import { CITIES, CityKey } from "@/lib/data";

export const dynamic = "force-dynamic";

// Public: published resident stories (merged client-side with the seed set).
// Launch mechanic: the earliest `config.freeSeedStories` published stories in
// each city are marked freeSeed, so everyone can read them in full. The paywall
// only engages once a city has more than that many published stories.
export async function GET() {
  const rows = await prisma.submission.findMany({
    where: { wf: "Published" },
    orderBy: { publishedAt: "desc" },
    take: 200,
  });

  // The set of "seed" story ids: the oldest N published per city.
  const freeIds = new Set<string>();
  const N = config.freeSeedStories;
  if (N > 0) {
    await Promise.all(
      (Object.keys(CITIES) as CityKey[]).map(async (city) => {
        const early = await prisma.submission.findMany({
          where: { wf: "Published", city },
          orderBy: { publishedAt: "asc" },
          take: N,
          select: { id: true },
        });
        early.forEach((r) => freeIds.add(r.id));
      })
    );
  }

  const posts = rows.map((r) => ({ ...submissionToPost(r), freeSeed: freeIds.has(r.id) }));
  return NextResponse.json({ posts });
}

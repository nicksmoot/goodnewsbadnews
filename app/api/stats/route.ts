import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { config } from "@/lib/config";

export const dynamic = "force-dynamic";

// Public counters for the home aside (counts only, no content). Also reports
// the seed phase: while a city has fewer than config.freeSeedStories published
// stories, posting and reading there are free.
export async function GET() {
  const [spokaneQueue, honoluluQueue, spokanePublished, honoluluPublished] = await Promise.all([
    prisma.submission.count({ where: { city: "spokane", wf: { in: ["New", "Review", "Verified"] } } }),
    prisma.submission.count({ where: { city: "honolulu", wf: { in: ["New", "Review", "Verified"] } } }),
    prisma.submission.count({ where: { city: "spokane", wf: "Published" } }),
    prisma.submission.count({ where: { city: "honolulu", wf: "Published" } }),
  ]);
  const N = config.freeSeedStories;
  const forCity = (published: number, queue: number) => ({
    queue,
    published,
    freePosting: published < N,
    freeRemaining: Math.max(0, N - published),
  });
  return NextResponse.json({
    freeSeedStories: N,
    spokane: forCity(spokanePublished, spokaneQueue),
    honolulu: forCity(honoluluPublished, honoluluQueue),
  });
}

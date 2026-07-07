import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Public counters for the home aside (counts only, no content).
export async function GET() {
  const [spokaneQueue, honoluluQueue, spokanePublished, honoluluPublished] = await Promise.all([
    prisma.submission.count({ where: { city: "spokane", wf: { not: "Published" } } }),
    prisma.submission.count({ where: { city: "honolulu", wf: { not: "Published" } } }),
    prisma.submission.count({ where: { city: "spokane", wf: "Published" } }),
    prisma.submission.count({ where: { city: "honolulu", wf: "Published" } }),
  ]);
  return NextResponse.json({
    spokane: { queue: spokaneQueue, published: spokanePublished },
    honolulu: { queue: honoluluQueue, published: honoluluPublished },
  });
}

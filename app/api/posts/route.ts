import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { submissionToPost } from "@/lib/submissions";

export const dynamic = "force-dynamic";

// Public: published resident stories (merged client-side with the seed set).
export async function GET() {
  const rows = await prisma.submission.findMany({
    where: { wf: "Published" },
    orderBy: { publishedAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ posts: rows.map(submissionToPost) });
}

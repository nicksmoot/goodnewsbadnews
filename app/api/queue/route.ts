import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { submissionToQueueItem } from "@/lib/submissions";

export const dynamic = "force-dynamic";

// Admin: the moderation queue (all workflow states).
export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const rows = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return NextResponse.json({ queue: rows.map(submissionToQueueItem) });
}

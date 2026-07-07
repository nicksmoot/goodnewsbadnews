import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { coordFor, CityKey } from "@/lib/data";
import { DEMO_QUEUE } from "@/lib/demoQueue";

// Admin-only, idempotent: fills the moderation board with demo entries that
// mirror the feed's "Under Review"/"Submitted" stories. Existing titles are
// skipped, so clicking twice never duplicates.
export async function POST() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  let created = 0;
  for (const item of DEMO_QUEUE) {
    const exists = await prisma.submission.findFirst({
      where: { title: item.title, city: item.city },
      select: { id: true },
    });
    if (exists) continue;
    const coords = coordFor(item.city as CityKey, item.hood, item.title);
    await prisma.submission.create({
      data: {
        title: item.title,
        cat: item.cat,
        topic: item.topic,
        hood: item.hood,
        body: item.body,
        by: item.by,
        city: item.city,
        lat: coords.lat,
        lng: coords.lng,
        wf: item.wf,
        status: item.status,
        scanLevel: item.scanLevel,
        scanMsg: item.scanMsg,
      },
    });
    created++;
  }

  return NextResponse.json({ ok: true, created, total: DEMO_QUEUE.length });
}

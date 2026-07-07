import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Public, city-scoped contributor rankings. Only signed-in bylines count:
// anonymous signals are welcome, but the ledger only remembers names.
export async function GET() {
  const grouped = await prisma.submission.groupBy({
    by: ["userId", "city"],
    where: { wf: "Published", userId: { not: null } },
    _count: { _all: true },
  });

  const userIds = Array.from(new Set(grouped.map((g) => g.userId).filter(Boolean))) as string[];
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, createdAt: true } })
    : [];
  const userById = new Map(users.map((u) => [u.id, u]));

  // Latest published headline per contributor+city, for flavor.
  const latest = await prisma.submission.findMany({
    where: { wf: "Published", userId: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: { userId: true, city: true, title: true, id: true },
    take: 500,
  });
  const latestKeyed = new Map<string, { title: string; id: string }>();
  for (const s of latest) {
    const k = s.userId + "|" + s.city;
    if (!latestKeyed.has(k)) latestKeyed.set(k, { title: s.title, id: s.id });
  }

  // Founding cutoff: the first 250 accounts sitewide.
  const founders = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    take: 250,
    select: { id: true },
  });
  const founderIds = new Set(founders.map((f) => f.id));

  const build = (city: string) =>
    grouped
      .filter((g) => g.city === city && g.userId)
      .map((g) => {
        const u = userById.get(g.userId as string);
        const last = latestKeyed.get(g.userId + "|" + city);
        return {
          name: u?.name?.trim() || "Unnamed contributor",
          published: g._count._all,
          founding: founderIds.has(g.userId as string),
          latestTitle: last?.title || null,
          latestId: last ? "p-" + last.id : null,
        };
      })
      .sort((a, b) => b.published - a.published)
      .slice(0, 20);

  return NextResponse.json({ spokane: build("spokane"), honolulu: build("honolulu") });
}

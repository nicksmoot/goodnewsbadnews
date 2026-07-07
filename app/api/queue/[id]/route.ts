import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  action: z.enum(["toNew", "toReview", "toVerified", "publish", "reject"]),
});

const WF: Record<string, { wf: string; status: string }> = {
  toNew: { wf: "New", status: "Submitted" },
  toReview: { wf: "Review", status: "Under Review" },
  toVerified: { wf: "Verified", status: "Verified" },
};

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Unknown action." }, { status: 400 });

  const id = params.id;
  const action = parsed.data.action;

  if (action === "reject") {
    await prisma.submission.delete({ where: { id } }).catch(() => null);
    return NextResponse.json({ ok: true });
  }
  if (action === "publish") {
    await prisma.submission.update({
      where: { id },
      data: { wf: "Published", status: "Verified", publishedAt: new Date() },
    });
    return NextResponse.json({ ok: true });
  }
  const t = WF[action];
  await prisma.submission.update({ where: { id }, data: { wf: t.wf, status: t.status } });
  return NextResponse.json({ ok: true });
}

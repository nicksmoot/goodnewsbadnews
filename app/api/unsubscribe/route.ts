import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyUnsub } from "@/lib/unsub";

export const dynamic = "force-dynamic";

async function unsubscribe(email: string | null, token: string | null): Promise<boolean> {
  if (!email || !token || !verifyUnsub(email, token)) return false;
  await prisma.digestSubscriber
    .deleteMany({ where: { email: email.toLowerCase().trim() } })
    .catch(() => null);
  return true;
}

// One-click (RFC 8058): mail clients POST here directly. Params ride in the URL.
export async function POST(req: Request) {
  const u = new URL(req.url);
  const ok = await unsubscribe(u.searchParams.get("e"), u.searchParams.get("t"));
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}

// A human clicking the link lands here; send them to the friendly page.
export async function GET(req: Request) {
  const u = new URL(req.url);
  await unsubscribe(u.searchParams.get("e"), u.searchParams.get("t"));
  const e = u.searchParams.get("e") || "";
  const t = u.searchParams.get("t") || "";
  return NextResponse.redirect(new URL(`/unsubscribe?e=${encodeURIComponent(e)}&t=${encodeURIComponent(t)}&done=1`, u.origin));
}

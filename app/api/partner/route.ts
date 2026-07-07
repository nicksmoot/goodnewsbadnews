import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  org: z.string().trim().min(2).max(160),
  city: z.string().max(60),
  interest: z.string().max(80),
  email: z.string().email(),
  note: z.string().max(4000).optional().default(""),
});

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Add your newsroom name and a valid work email." }, { status: 400 });
  }
  await prisma.partnerInquiry.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  city: z.enum(["spokane", "honolulu"]),
  preference: z.string().max(60).default("All Signals"),
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
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  const { email, city, preference } = parsed.data;
  await prisma.digestSubscriber.upsert({
    where: { email: email.toLowerCase().trim() },
    create: { email: email.toLowerCase().trim(), city, preference },
    update: { city, preference },
  });
  return NextResponse.json({ ok: true });
}

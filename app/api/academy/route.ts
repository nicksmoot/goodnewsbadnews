import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

// A resident applying to the journalism training program.
const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  city: z.string().max(60),
  experience: z.string().max(80).default("New to this"),
  interest: z.string().max(80).default("Reporting"),
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
    return NextResponse.json({ error: "Add your name and a valid email address." }, { status: 400 });
  }
  const d = parsed.data;
  await prisma.trainingApplicant.create({
    data: { ...d, email: d.email.toLowerCase().trim() },
  });
  return NextResponse.json({ ok: true });
}

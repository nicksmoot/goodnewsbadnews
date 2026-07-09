import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/txnEmails";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().trim().max(80).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const name = parsed.data.name || null;
  await prisma.user.create({
    data: { email, passwordHash, name },
  });

  // Fire-and-forget: a failed welcome must never fail the signup.
  const mail = welcomeEmail(name);
  sendEmail({ to: email, subject: mail.subject, html: mail.html, text: mail.text }).catch(() => null);

  return NextResponse.json({ ok: true });
}

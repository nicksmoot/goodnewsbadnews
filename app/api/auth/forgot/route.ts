import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/txnEmails";
import { siteUrl } from "@/lib/site";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

const schema = z.object({ email: z.string().email() });

// Always responds ok, whether or not the email exists, so it can't be used to
// discover which addresses have accounts.
export async function POST(req: Request) {
  const rl = rateLimit(`forgot:${clientIp(req)}`, 5, 600_000);
  if (!rl.ok) return NextResponse.json(tooMany(rl.retryAfter), { status: 429 });

  let raw: unknown;
  try { raw = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });

  if (user) {
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
    });
    const url = `${siteUrl()}/reset?token=${rawToken}`;
    const mail = passwordResetEmail(url);
    // Best-effort; the response stays generic either way.
    await sendEmail({ to: email, subject: mail.subject, html: mail.html, text: mail.text }).catch(() => null);
  }

  return NextResponse.json({ ok: true });
}

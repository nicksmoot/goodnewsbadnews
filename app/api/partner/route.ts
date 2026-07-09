import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { partnerNotifyEmail, partnerAckEmail } from "@/lib/txnEmails";
import { rateLimit, clientIp, tooMany } from "@/lib/ratelimit";

const schema = z.object({
  org: z.string().trim().min(2).max(160),
  city: z.string().max(60),
  interest: z.string().max(80),
  email: z.string().email(),
  note: z.string().max(4000).optional().default(""),
});

export async function POST(req: Request) {
  const rl = rateLimit(`partner:${clientIp(req)}`, 5, 600_000);
  if (!rl.ok) return NextResponse.json(tooMany(rl.retryAfter), { status: 429 });

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
  const inq = parsed.data;
  await prisma.partnerInquiry.create({ data: inq });

  // Route the lead to the desk inbox, and acknowledge the newsroom. Best-effort.
  const inbox = process.env.PARTNER_INBOX;
  if (inbox) {
    const n = partnerNotifyEmail(inq);
    sendEmail({ to: inbox, subject: n.subject, html: n.html, text: n.text }).catch(() => null);
  }
  const ack = partnerAckEmail(inq.org);
  sendEmail({ to: inq.email, subject: ack.subject, html: ack.html, text: ack.text }).catch(() => null);

  return NextResponse.json({ ok: true });
}

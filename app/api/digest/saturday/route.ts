import { NextResponse } from "next/server";
import { renderSaturdayDigest, resend } from "@/lib/resend";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const digest = renderSaturdayDigest("ALL");
  if (!process.env.RESEND_API_KEY) return NextResponse.json({ ...digest, demo: true });
  const response = await resend.emails.send({ from: process.env.DIGEST_FROM_EMAIL ?? "briefing@goodnewsbadnews.local", to: process.env.DIGEST_TEST_EMAIL ?? "test@example.com", subject: digest.subject, html: digest.html });
  return NextResponse.json(response);
}

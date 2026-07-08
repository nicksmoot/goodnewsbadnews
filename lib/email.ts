// Transactional email via Resend's HTTP API (no SDK dependency, just fetch).
// Gracefully no-ops when RESEND_API_KEY is unset, so the whole app runs fine
// before email is configured. Add the key in Vercel and sending turns on.

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// The verified sender. Set DIGEST_FROM once your domain is verified in Resend.
export function digestFrom(): string {
  return process.env.DIGEST_FROM || "Good News Bad News <digest@gnbnmedia.com>";
}

export interface SendResult {
  ok: boolean;
  id?: string;
  error?: string;
  skipped?: boolean; // true when email isn't configured yet
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, skipped: true, error: "RESEND_API_KEY not set" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: from || digestFrom(), to, subject, html, text }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: data.id };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

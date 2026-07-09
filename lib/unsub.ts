import { createHmac, timingSafeEqual } from "crypto";
import { siteUrl } from "./site";

// Stateless one-click unsubscribe tokens: an HMAC of the email, so every digest
// can carry a valid unsubscribe link with no per-subscriber token stored. Signed
// with AUTH_SECRET (already required for auth), falling back to a build-safe
// constant so preview builds don't crash.
function secret(): string {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "gnbn-unsub-fallback";
}

export function unsubToken(email: string): string {
  return createHmac("sha256", secret()).update(email.toLowerCase().trim()).digest("hex").slice(0, 32);
}

export function verifyUnsub(email: string, token: string): boolean {
  const expected = unsubToken(email);
  if (!token || token.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}

// The human-facing page link that appears in the email footer.
export function unsubscribeUrl(email: string): string {
  const e = encodeURIComponent(email);
  return `${siteUrl()}/unsubscribe?e=${e}&t=${unsubToken(email)}`;
}

// The machine endpoint for RFC 8058 one-click (List-Unsubscribe-Post).
export function unsubscribeApiUrl(email: string): string {
  const e = encodeURIComponent(email);
  return `${siteUrl()}/api/unsubscribe?e=${e}&t=${unsubToken(email)}`;
}

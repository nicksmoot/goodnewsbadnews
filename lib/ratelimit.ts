// Best-effort in-memory rate limiter for public POST endpoints. On serverless
// this limits per warm instance, which is enough to blunt naive floods and
// accidental double-submits. For hard, multi-instance limits, back it with
// Upstash/Redis later (swap the Map for a Redis INCR + EXPIRE).

interface Bucket { count: number; resetAt: number; }
const buckets = new Map<string, Bucket>();

// Occasionally evict stale buckets so the Map can't grow unbounded.
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [k, b] of buckets) if (now > b.resetAt) buckets.delete(k);
}

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (b.count >= limit) return { ok: false, retryAfter: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  b.count += 1;
  return { ok: true, retryAfter: 0 };
}

// Best-guess client IP behind Vercel's proxy.
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// Standard 429 body for a limited request.
export function tooMany(retryAfter: number) {
  return { error: "Too many requests. Please wait a moment and try again.", retryAfter };
}

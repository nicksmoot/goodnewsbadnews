// Central site config. Set NEXT_PUBLIC_SITE_URL in production (e.g. your custom
// domain); falls back to the Vercel deployment URL, then localhost.
export const SITE = {
  name: "Good News Bad News",
  tagline: "A civic signal platform",
  description:
    "A civic signal platform where residents submit the wins, concerns, patterns, and opportunities they're seeing. Reviewed, organized, and mapped. Now live in Spokane and Honolulu.",
  cities: "Spokane & Honolulu",
};

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

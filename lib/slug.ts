import { TOPICS, CITIES } from "./data";

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ALL_HOODS = Object.values(CITIES)
  .flatMap((c) => c.hoods)
  .filter((h, i, a) => a.indexOf(h) === i);

const topicBySlug = new Map(TOPICS.map((t) => [slugify(t), t]));
const hoodBySlug = new Map(ALL_HOODS.map((h) => [slugify(h), h]));

export function topicFromSlug(slug: string): string | null {
  return topicBySlug.get(slug) ?? null;
}
export function hoodFromSlug(slug: string): string | null {
  return hoodBySlug.get(slug) ?? null;
}
export function allTopicSlugs(): string[] {
  return TOPICS.map(slugify);
}
export function allHoodSlugs(): string[] {
  return ALL_HOODS.map(slugify);
}
export { ALL_HOODS };

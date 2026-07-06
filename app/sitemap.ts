import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { seedPosts, TOPICS } from "@/lib/data";
import { slugify, ALL_HOODS } from "@/lib/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const staticRoutes = [
    "", "/latest", "/good", "/bad", "/both", "/map", "/submit",
    "/digest", "/partners", "/about", "/standards",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: (path === "" || path === "/latest" ? "daily" : "weekly") as "daily" | "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const storyRoutes = seedPosts().map((p) => ({
    url: `${base}/post/${p.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const topicRoutes = TOPICS.map((t) => ({
    url: `${base}/topic/${slugify(t)}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const hoodRoutes = ALL_HOODS.map((h) => ({
    url: `${base}/neighborhood/${slugify(h)}`,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [...staticRoutes, ...storyRoutes, ...topicRoutes, ...hoodRoutes];
}

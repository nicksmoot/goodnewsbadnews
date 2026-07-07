import type { Submission } from "@prisma/client";
import { CatKey, CityKey, Post } from "./data";

const DAY = 24 * 60 * 60 * 1000;

/** Shape a published Submission row like a feed Post so it merges with seeds. */
export function submissionToPost(s: Submission): Post {
  const tags = (s.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
  const paras = (s.body || "").split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean);
  const age = Math.max(0, Math.floor((Date.now() - new Date(s.publishedAt ?? s.createdAt).getTime()) / DAY));
  return {
    id: "p-" + s.id,
    cat: (s.cat as CatKey) || "signal",
    title: s.title,
    summary: paras[0] ? (paras[0].length > 220 ? paras[0].slice(0, 217) + "…" : paras[0]) : s.title,
    topics: [s.topic, ...tags].filter(Boolean).slice(0, 5),
    hood: s.hood,
    status: "Verified",
    by: s.by || "Resident",
    helpful: 0,
    age,
    photo: s.photo || "",
    body: paras.length ? paras : [s.title],
    next: "Published from a resident submission after review. Residents can add more detail.",
    city: (s.city as CityKey) || "spokane",
    lat: s.lat,
    lng: s.lng,
  };
}

/** Queue-item shape for the moderation board (admin only). */
export function submissionToQueueItem(s: Submission) {
  return {
    id: s.id,
    wf: s.wf,
    cat: s.cat,
    title: s.title,
    topic: s.topic,
    hood: s.hood,
    by: s.by,
    city: s.city,
    status: s.status,
    scan: { level: s.scanLevel, msg: s.scanMsg },
    createdAt: s.createdAt,
  };
}

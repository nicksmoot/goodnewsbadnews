import { CatKey, CityKey, DecoratedPost, Post, QueueItem, decorate } from "./data";

export function cityPosts(posts: Post[], city: CityKey): Post[] {
  return posts.filter((p) => p.city === city);
}

export function cityQueue(queue: QueueItem[], city: CityKey): QueueItem[] {
  return queue.filter((q) => q.city === city);
}

export interface FeedFilters {
  fCat: string; // category chip ('all' or a CatKey), only used on /latest
  fTopic: string;
  fHood: string;
  fSearch: string;
  fSort: string;
}

export function filterPosts(
  posts: Post[],
  city: CityKey,
  routeCat: CatKey | null,
  f: FeedFilters
): Post[] {
  const cat = routeCat || f.fCat;
  let list = posts.filter((p) => p.city === city);
  if (cat && cat !== "all") list = list.filter((p) => p.cat === cat);
  if (f.fTopic && f.fTopic !== "All topics") list = list.filter((p) => (p.topics || []).includes(f.fTopic));
  if (f.fHood && f.fHood !== "All neighborhoods") list = list.filter((p) => p.hood === f.fHood);
  if (f.fSearch && f.fSearch.trim()) {
    const q = f.fSearch.toLowerCase();
    list = list.filter((p) => (p.title + " " + p.summary + " " + (p.topics || []).join(" ")).toLowerCase().includes(q));
  }
  list = [...list];
  if (f.fSort === "helpful") list.sort((a, b) => b.helpful - a.helpful);
  else list.sort((a, b) => a.age - b.age);
  return list;
}

export function decorateList(posts: Post[], seenLocal: Record<string, boolean>): DecoratedPost[] {
  return posts.map((p) => decorate(p, seenLocal));
}

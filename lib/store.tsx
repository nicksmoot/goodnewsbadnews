"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  CatKey, CityKey, Post, QueueItem, WorkflowState,
  seedPosts, seedQueue, scan, typeToCat, coordFor,
} from "./data";

// v4: seed stories carry full article bodies (bump forces a reseed).
const K_POSTS = "gnbn_posts_v4";
const K_QUEUE = "gnbn_queue_v4";
const K_CITY = "gnbn_city";
const K_DIGEST = "gnbn_digest_v1";
const K_SEEN = "gnbn_seen_v1";
const K_FOLLOW = "gnbn_follow_v1";
const K_SUB = "gnbn_sub_v1";

export interface SubmitForm {
  title: string;
  type: string;
  topic: string;
  neighborhood: string;
  cross: string;
  body: string;
  tags: string;
  photo: string;
  photoName: string;
  c0: boolean;
  c1: boolean;
  c2: boolean;
}

export interface SubmitResult {
  scanMessage: string;
}

interface StoreValue {
  ready: boolean;
  posts: Post[];
  queue: QueueItem[];
  city: CityKey;
  seenLocal: Record<string, boolean>;
  followed: Record<string, boolean>;
  digestPref: string;
  subscribed: boolean;

  setCity: (c: CityKey) => void;
  markSeen: (id: string) => void;
  toggleFollow: (id: string) => void;
  setDigestPref: (pref: string) => void;
  subscribe: () => void;

  submitSignal: (form: SubmitForm) => SubmitResult;
  setWf: (id: string, wf: WorkflowState) => void;
  publishItem: (id: string) => void;
  rejectItem: (id: string) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function readCity(): CityKey {
  if (typeof localStorage === "undefined") return "spokane";
  return localStorage.getItem(K_CITY) === "honolulu" ? "honolulu" : "spokane";
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [city, setCityState] = useState<CityKey>("spokane");
  const [seenLocal, setSeenLocal] = useState<Record<string, boolean>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const [digestPref, setDigestPrefState] = useState("All Signals");
  const [subscribed, setSubscribed] = useState(false);

  // Hydrate from localStorage once on mount (client only).
  useEffect(() => {
    let p: Post[] | null = null;
    let q: QueueItem[] | null = null;
    let digest: string | null = null;
    let sub = false;
    try {
      p = JSON.parse(localStorage.getItem(K_POSTS) || "null");
      q = JSON.parse(localStorage.getItem(K_QUEUE) || "null");
      digest = localStorage.getItem(K_DIGEST);
      sub = localStorage.getItem(K_SUB) === "1";
      setSeenLocal(JSON.parse(localStorage.getItem(K_SEEN) || "{}"));
      setFollowed(JSON.parse(localStorage.getItem(K_FOLLOW) || "{}"));
    } catch {}
    let seeded = false;
    if (!p) { p = seedPosts(); seeded = true; }
    if (!q) { q = seedQueue(); seeded = true; }
    if (seeded) {
      try {
        localStorage.setItem(K_POSTS, JSON.stringify(p));
        localStorage.setItem(K_QUEUE, JSON.stringify(q));
      } catch {}
    }
    setPosts(p);
    setQueue(q);
    setCityState(readCity());
    setDigestPrefState(digest || "All Signals");
    setSubscribed(sub);
    setReady(true);
  }, []);

  const persist = (nextPosts?: Post[] | null, nextQueue?: QueueItem[] | null) => {
    try {
      localStorage.setItem(K_POSTS, JSON.stringify(nextPosts ?? posts));
      localStorage.setItem(K_QUEUE, JSON.stringify(nextQueue ?? queue));
    } catch {}
  };

  const setCity = (c: CityKey) => {
    if (c !== "spokane" && c !== "honolulu") return;
    try { localStorage.setItem(K_CITY, c); } catch {}
    setCityState(c);
  };

  const markSeen = (id: string) =>
    setSeenLocal((s) => {
      const next = { ...s, [id]: !s[id] };
      try { localStorage.setItem(K_SEEN, JSON.stringify(next)); } catch {}
      return next;
    });

  const toggleFollow = (id: string) =>
    setFollowed((s) => {
      const next = { ...s, [id]: !s[id] };
      try { localStorage.setItem(K_FOLLOW, JSON.stringify(next)); } catch {}
      return next;
    });

  const setDigestPref = (pref: string) => {
    try { localStorage.setItem(K_DIGEST, pref); } catch {}
    setDigestPrefState(pref);
  };

  const subscribe = () => {
    try { localStorage.setItem(K_SUB, "1"); } catch {}
    setSubscribed(true);
  };

  const submitSignal = (f: SubmitForm): SubmitResult => {
    const result = scan(f.title + " " + f.body);
    const cat: CatKey = typeToCat(f.type);
    const tags = (f.tags || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 5);
    const id = "q" + Date.now();
    const item: QueueItem = {
      id, wf: "New", cat, title: f.title || "(untitled signal)",
      topic: f.topic, hood: f.neighborhood, by: "Resident", age: 0, tags,
      photo: f.photo || "", body: [f.body || ""], status: "Submitted",
      scan: result, city,
      ...coordFor(city, f.neighborhood, id),
    };
    const nextQueue = [item, ...queue];
    setQueue(nextQueue);
    persist(null, nextQueue);
    return { scanMessage: result.msg };
  };

  const setWf = (id: string, wf: WorkflowState) => {
    const nextQueue = queue.map((q) => (q.id === id ? { ...q, wf } : q));
    setQueue(nextQueue);
    persist(null, nextQueue);
  };

  const publishItem = (id: string) => {
    const q = queue.find((x) => x.id === id);
    if (!q) return;
    const post: Post = {
      id: "p-" + id, cat: q.cat, title: q.title,
      summary: q.body && q.body[0] ? q.body[0] : q.title,
      topics: [q.topic, ...(q.tags || [])].filter(Boolean),
      hood: q.hood, status: "Verified", by: q.by, helpful: 0, age: 0,
      photo: q.photo || "",
      body: q.body && q.body.length ? q.body : [q.title],
      next: "Published from a resident submission after review. Residents can add more detail.",
      city: q.city || "spokane",
      ...coordFor(q.city || "spokane", q.hood, q.id),
    };
    const nextPosts = [post, ...posts];
    const nextQueue = queue.map((x) => (x.id === id ? { ...x, wf: "Published" as WorkflowState } : x));
    setPosts(nextPosts);
    setQueue(nextQueue);
    persist(nextPosts, nextQueue);
  };

  const rejectItem = (id: string) => {
    const nextQueue = queue.filter((x) => x.id !== id);
    setQueue(nextQueue);
    persist(null, nextQueue);
  };

  const resetDemo = () => {
    const p = seedPosts();
    const q = seedQueue();
    setPosts(p);
    setQueue(q);
    setSeenLocal({});
    setFollowed({});
    persist(p, q);
  };

  const value = useMemo<StoreValue>(
    () => ({
      ready, posts, queue, city, seenLocal, followed, digestPref, subscribed,
      setCity, markSeen, toggleFollow, setDigestPref, subscribe,
      submitSignal, setWf, publishItem, rejectItem, resetDemo,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, posts, queue, city, seenLocal, followed, digestPref, subscribed]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/** Run a callback whenever the active city changes (skips the first run). */
export function useCityEffect(city: CityKey, fn: () => void) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);
}

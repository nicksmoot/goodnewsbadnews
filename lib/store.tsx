"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CityKey, Post, seedPosts, CITIES } from "./data";

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

export interface CityStats {
  queue: number;
  published: number;
  // Founding window: while a city is under config.freeSeedStories published,
  // posting (and the early stories) are free. Supplied by /api/stats.
  freePosting?: boolean;
  freeRemaining?: number;
}

interface StoreValue {
  ready: boolean;
  posts: Post[]; // seed stories + published resident submissions (all cities)
  city: CityKey;
  stats: Record<CityKey, CityStats>;
  seenLocal: Record<string, boolean>;
  followed: Record<string, boolean>;
  digestPref: string;
  subscribed: boolean;

  setCity: (c: CityKey) => void;
  markSeen: (id: string) => void;
  toggleFollow: (id: string) => void;
  setDigestPref: (pref: string) => void;
  markSubscribed: () => void;
  refreshPosts: () => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

function readCity(): CityKey {
  if (typeof localStorage === "undefined") return "spokane";
  const c = localStorage.getItem(K_CITY);
  return c && c in CITIES ? (c as CityKey) : "spokane";
}

const EMPTY_STATS: Record<CityKey, CityStats> = {
  spokane: { queue: 0, published: 0 },
  honolulu: { queue: 0, published: 0 },
  postfalls: { queue: 0, published: 0 },
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Record<CityKey, CityStats>>(EMPTY_STATS);
  const [city, setCityState] = useState<CityKey>("spokane");
  const [seenLocal, setSeenLocal] = useState<Record<string, boolean>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const [digestPref, setDigestPrefState] = useState("All Signals");
  const [subscribed, setSubscribed] = useState(false);

  const loadPublished = async (): Promise<Post[]> => {
    try {
      const res = await fetch("/api/posts", { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data.posts) ? data.posts : [];
    } catch {
      return [];
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.spokane && data.honolulu) setStats({ ...EMPTY_STATS, ...data });
    } catch {}
  };

  // Hydrate local prefs + fetch shared content once on mount.
  useEffect(() => {
    try {
      setSeenLocal(JSON.parse(localStorage.getItem(K_SEEN) || "{}"));
      setFollowed(JSON.parse(localStorage.getItem(K_FOLLOW) || "{}"));
      setDigestPrefState(localStorage.getItem(K_DIGEST) || "All Signals");
      setSubscribed(localStorage.getItem(K_SUB) === "1");
    } catch {}
    setCityState(readCity());
    // Seeds render immediately; published resident stories stream in.
    setPosts(seedPosts());
    setReady(true);
    (async () => {
      const published = await loadPublished();
      if (published.length) setPosts([...published, ...seedPosts()]);
      loadStats();
    })();
  }, []);

  const refreshPosts = async () => {
    const published = await loadPublished();
    setPosts([...published, ...seedPosts()]);
    loadStats();
  };

  const setCity = (c: CityKey) => {
    if (!(c in CITIES)) return;
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

  const markSubscribed = () => {
    try { localStorage.setItem(K_SUB, "1"); } catch {}
    setSubscribed(true);
  };

  const value = useMemo<StoreValue>(
    () => ({
      ready, posts, city, stats, seenLocal, followed, digestPref, subscribed,
      setCity, markSeen, toggleFollow, setDigestPref, markSubscribed, refreshPosts,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, posts, city, stats, seenLocal, followed, digestPref, subscribed]
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

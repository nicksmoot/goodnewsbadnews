"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/lib/store";
import { CAT, CatKey } from "@/lib/data";

interface QueueItem {
  id: string;
  wf: string;
  cat: string;
  title: string;
  topic: string;
  hood: string;
  by: string;
  city: string;
  status: string;
  scan: { level: string; msg: string };
}

const colBox: React.CSSProperties = {
  background: "#fbf4e6", border: "1px solid #d8cab2", borderRadius: 16, padding: 14, minHeight: 200,
};
const colHeader: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.2px", textTransform: "uppercase",
  color: "#6b675e", marginBottom: 12, display: "flex", justifyContent: "space-between",
};
const smallBtn: React.CSSProperties = {
  borderRadius: 8, padding: "6px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer",
};
const cardTitle: React.CSSProperties = { fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 15, lineHeight: 1.2, margin: "9px 0 6px" };
const metaLineStyle: React.CSSProperties = { fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: "#8a857a" };

function Badge({ cat }: { cat: string }) {
  const c = CAT[cat as CatKey] || CAT.signal;
  return (
    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "0.8px", fontSize: 10, textTransform: "uppercase", padding: "3px 7px", borderRadius: 999, color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      {c.label}
    </span>
  );
}

export default function AdminPage() {
  const { city, refreshPosts } = useStore();
  const { status: authStatus } = useSession();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [state, setState] = useState<"loading" | "denied" | "ready">("loading");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/queue", { cache: "no-store" });
      if (res.status === 403) { setState("denied"); return; }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQueue(Array.isArray(data.queue) ? data.queue : []);
      setState("ready");
    } catch {
      setState("denied");
    }
  }, []);

  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "unauthenticated") { setState("denied"); return; }
    load();
  }, [authStatus, load]);

  const act = async (id: string, action: string) => {
    await fetch(`/api/queue/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await load();
    if (action === "publish") refreshPosts();
  };

  if (state === "loading") {
    return <section style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px 80px", color: "#8a857a" }}>Loading the moderation board…</section>;
  }

  if (state === "denied") {
    return (
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 12 }}>Moderation · Internal</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 34, letterSpacing: "-1px", margin: "0 0 12px" }}>Admin access required.</h1>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "#5a564d", margin: "0 0 18px" }}>
          The moderation board is limited to editors. Sign in with an admin account to review the queue.
        </p>
        <Link href="/signin?callbackUrl=/admin" style={{ textDecoration: "none", background: "#161616", color: "#fff", borderRadius: 999, padding: "12px 22px", fontWeight: 700, fontSize: 14.5 }}>Sign in</Link>
      </section>
    );
  }

  const q = queue.filter((x) => x.city === city);
  const meta = (item: QueueItem) => `${item.hood} · ${item.topic} · ${item.by}`;
  const colNew = q.filter((x) => x.wf === "New");
  const colReview = q.filter((x) => x.wf === "Review");
  const colVerified = q.filter((x) => x.wf === "Verified");
  const colPublished = q.filter((x) => x.wf === "Published");
  const statQueue = q.filter((x) => x.wf !== "Published").length;
  const statFlagged = q.filter((x) => x.scan?.level === "flag" && x.wf !== "Published").length;

  return (
    <div>
      <section style={{ maxWidth: 1340, margin: "0 auto", padding: "44px 24px 70px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, borderBottom: "1px solid #d8cab2", paddingBottom: 18, marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 10 }}>Moderation · Internal · Live database</div>
            <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(30px,3.8vw,44px)", lineHeight: 1, letterSpacing: "-1.4px", margin: 0 }}>Submission review board</h1>
          </div>
          <div style={{ display: "flex", gap: 18, fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: "#6b675e" }}>
            <span>Queue <strong style={{ color: "#161616", fontSize: 16 }}>{statQueue}</strong></span>
            <span>Published <strong style={{ color: "#161616", fontSize: 16 }}>{colPublished.length}</strong></span>
            <span>Flagged <strong style={{ color: "#a33429", fontSize: 16 }}>{statFlagged}</strong></span>
          </div>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.5, color: "#5a564d", maxWidth: 760, margin: "0 0 26px" }}>
          Real resident submissions for the selected city (switch cities in the header). Move a card right to advance it; publish pushes it live to the public feed and map for everyone.
        </p>

        {q.length === 0 && (
          <div style={{ background: "#fbf4e6", border: "1px solid #d8cab2", borderRadius: 16, padding: 28, color: "#6b675e", fontSize: 15 }}>
            No submissions yet for this city. When residents submit signals, they land here for review.
          </div>
        )}

        {q.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, alignItems: "start" }}>
            <div style={colBox}>
              <div style={colHeader}><span>New</span><span>{colNew.length}</span></div>
              {colNew.map((item) => {
                const flag = item.scan?.level === "flag";
                return (
                  <div key={item.id} style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 12, padding: 13, marginBottom: 10 }}>
                    <Badge cat={item.cat} />
                    <h4 style={cardTitle}>{item.title}</h4>
                    <div style={{ ...metaLineStyle, marginBottom: 8 }}>{meta(item)}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.4, color: flag ? "#a33429" : "#19734a", background: flag ? "#a3342910" : "#19734a10", borderRadius: 8, padding: 8, marginBottom: 10 }}>{item.scan?.msg}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button onClick={() => act(item.id, "toReview")} style={{ ...smallBtn, border: "1px solid #d8cab2", background: "#fffdf8", color: "#161616" }}>Send to review &rarr;</button>
                      <button onClick={() => act(item.id, "reject")} style={{ ...smallBtn, border: "1px solid #a3342959", background: "#a3342914", color: "#a33429" }}>Reject</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={colBox}>
              <div style={colHeader}><span>Human review</span><span>{colReview.length}</span></div>
              {colReview.map((item) => (
                <div key={item.id} style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 12, padding: 13, marginBottom: 10 }}>
                  <Badge cat={item.cat} />
                  <h4 style={cardTitle}>{item.title}</h4>
                  <div style={{ ...metaLineStyle, marginBottom: 10 }}>{meta(item)}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => act(item.id, "toVerified")} style={{ ...smallBtn, border: "1px solid #19734a59", background: "#19734a14", color: "#19734a" }}>Mark verified &rarr;</button>
                    <button onClick={() => act(item.id, "toNew")} style={{ ...smallBtn, border: "1px solid #d8cab2", background: "#fffdf8", color: "#6b675e" }}>&larr; Back</button>
                    <button onClick={() => act(item.id, "reject")} style={{ ...smallBtn, border: "1px solid #a3342959", background: "#a3342914", color: "#a33429" }}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={colBox}>
              <div style={colHeader}><span>Verified</span><span>{colVerified.length}</span></div>
              {colVerified.map((item) => (
                <div key={item.id} style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 12, padding: 13, marginBottom: 10 }}>
                  <Badge cat={item.cat} />
                  <h4 style={cardTitle}>{item.title}</h4>
                  <div style={{ ...metaLineStyle, marginBottom: 10 }}>{meta(item)}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => act(item.id, "publish")} style={{ ...smallBtn, border: "none", background: "#19734a", color: "#fff", padding: "6px 10px" }}>Publish to feed</button>
                    <button onClick={() => act(item.id, "toReview")} style={{ ...smallBtn, border: "1px solid #d8cab2", background: "#fffdf8", color: "#6b675e" }}>&larr; Back</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={colBox}>
              <div style={colHeader}><span>Published</span><span>{colPublished.length}</span></div>
              {colPublished.map((item) => (
                <div key={item.id} style={{ background: "#fffaf1", border: "1px solid #19734a40", borderRadius: 12, padding: 13, marginBottom: 10 }}>
                  <Badge cat={item.cat} />
                  <h4 style={cardTitle}>{item.title}</h4>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: "#19734a", marginBottom: 8 }}>Live · {item.status}</div>
                  <Link href={`/post/p-${item.id}`} style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#285d83", fontWeight: 600, textDecoration: "none" }}>View in feed &rarr;</Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

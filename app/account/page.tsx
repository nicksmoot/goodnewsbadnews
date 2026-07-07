import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import SignOutButton from "@/components/SignOutButton";
import ActivityPanel from "@/components/ActivityPanel";

export const dynamic = "force-dynamic";

const WF_COLOR: Record<string, string> = {
  New: "#8a857a", Review: "#9a6a12", Verified: "#285d83", Published: "#19734a",
};
const WF_LABEL: Record<string, string> = {
  New: "Submitted", Review: "In review", Verified: "Verified", Published: "Published",
};

async function YourStories({ userId }: { userId: string }) {
  const subs = await prisma.submission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 25,
  });
  return (
    <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18, padding: 24, marginTop: 22 }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "#9a6a12", marginBottom: 14 }}>Your stories</div>
      {subs.length === 0 ? (
        <p style={{ fontSize: 14, color: "#8a857a", margin: 0 }}>
          You haven&apos;t submitted a signal yet. When you do, it shows up here with its live moderation status - and once newsroom licensing launches, your payouts will too.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {subs.map((s) => {
            const color = WF_COLOR[s.wf] || "#8a857a";
            const inner = (
              <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 15, lineHeight: 1.25, color: "#161616" }}>{s.title}</span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, letterSpacing: "0.6px", fontSize: 10.5, textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, color, border: `1px solid ${color}55`, whiteSpace: "nowrap" }}>{WF_LABEL[s.wf] || s.wf}</span>
              </span>
            );
            return s.wf === "Published" ? (
              <Link key={s.id} href={`/post/p-${s.id}`} style={{ textDecoration: "none", background: "#fffdf8", border: "1px solid #e4d8c2", borderRadius: 12, padding: "11px 13px" }}>{inner}</Link>
            ) : (
              <div key={s.id} style={{ background: "#fffdf8", border: "1px solid #e4d8c2", borderRadius: 12, padding: "11px 13px" }}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/account");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/signin");

  const isMember = user.plan === "member" && user.subscriptionStatus === "active";
  const postsLeft = isMember ? Math.max(0, 15 - user.postsThisPeriod) : 0;
  const memberNo = await prisma.user.count({ where: { createdAt: { lte: user.createdAt } } });
  const isFounding = memberNo <= 250;

  const row = (label: string, value: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e4d8c2", padding: "13px 0", fontSize: 14.5 }}>
      <span style={{ color: "#5a564d" }}>{label}</span>
      <strong style={{ fontFamily: "'Spectral',serif", fontSize: 16 }}>{value}</strong>
    </div>
  );

  return (
    <section style={{ maxWidth: 640, margin: "0 auto", padding: "56px 24px 80px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>Your account</div>
      <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(32px,4.4vw,46px)", lineHeight: 1.03, letterSpacing: "-1.4px", margin: "0 0 14px" }}>
        {user.name ? `Hello, ${user.name}.` : "Your account."}
      </h1>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 22 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#161616", border: "1px solid #d8cab2", background: "#fffaf1", borderRadius: 999, padding: "6px 12px" }}>
          Member No. {memberNo}
        </span>
        {isFounding && (
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#8a5e0f", border: "1px solid #c99a2e80", background: "#c99a2e21", borderRadius: 999, padding: "6px 12px" }}>
          ★ Founding contributor
          </span>
        )}
      </div>

      <div style={{ background: "#fffaf1", border: "1px solid #d8cab2", borderRadius: 18, padding: 26, boxShadow: "0 10px 34px rgba(0,0,0,0.05)" }}>
        {row("Email", user.email)}
        {row("Membership", isMember ? "Member — full access" : "Free — teasers only")}
        {row("Posts left this month", isMember ? String(postsLeft) : "Pay $0.50 per post")}
        {row("Member since", new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(user.createdAt))}
      </div>

      {!isMember && (
        <div className="gnbn-dark-panel" style={{ background: "#161616", color: "#fff", borderRadius: 20, padding: 28, marginTop: 22 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: "#c99a2e", marginBottom: 12 }}>Become a member</div>
          <h2 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 26, lineHeight: 1.1, margin: "0 0 10px" }}>Read the full feed for $5/month.</h2>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: "#cfc8b9", margin: "0 0 18px" }}>
            Members unlock every full story and pattern report, and get <strong>15 signal submissions a month</strong> included (then $0.50 each).
          </p>
          <button disabled style={{ border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.08)", color: "#e7e1d4", borderRadius: 999, padding: "12px 22px", fontWeight: 700, fontSize: 15, cursor: "not-allowed" }}>
            Membership checkout — coming soon
          </button>
        </div>
      )}

      <YourStories userId={user.id} />

      <ActivityPanel />

      <div style={{ marginTop: 26, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <SignOutButton />
        <Link href="/submit" style={{ textDecoration: "none", color: "#19734a", fontWeight: 700, fontSize: 14 }}>Submit a signal &rarr;</Link>
      </div>
    </section>
  );
}

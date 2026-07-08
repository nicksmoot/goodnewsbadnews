import type { Metadata } from "next";
import Link from "next/link";
import Pricing from "@/components/Pricing";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pay 50 cents to read a single story or post a single signal, or become a member for $5 a month to read everything and post 15 signals a month.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <section style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 24px 80px" }}>
      <Pricing />

      <div style={{ marginTop: 44, borderTop: "1px solid #d8cab2", paddingTop: 30 }}>
        <h3 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 22, letterSpacing: "-0.4px", margin: "0 0 14px" }}>Common questions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 40px" }}>
          {[
            ["Do I need a subscription to read one story?", "No. Any story can be unlocked on its own for $0.50. Open a locked story and tap Unlock this story. It stays open on your account for good."],
            ["What does the $5 membership include?", "Every full story and pattern report across your city, plus 15 signal submissions a month. After 15, each additional post is $0.50."],
            ["What does it cost to post?", "Members get 15 posts a month included. Without a membership, a single signal is $0.50, which also keeps the feed free of spam."],
            ["Do writers get paid?", "Yes. When a partner newsroom licenses your story, you are paid, with your byline on it. Reporting here can become income, not just a hobby."],
          ].map(([q, a]) => (
            <div key={q}>
              <div style={{ fontFamily: "'Spectral',serif", fontWeight: 700, fontSize: 16.5, margin: "0 0 6px" }}>{q}</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "#5a564d", margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14.5, color: "#5a564d", lineHeight: 1.6, marginTop: 28 }}>
          Are you a newsroom? See the <Link href="/partners" style={{ color: "#285d83", fontWeight: 600 }}>partner program</Link> for licensing and hiring, or the <Link href="/academy" style={{ color: "#19734a", fontWeight: 600 }}>Academy</Link> if you want to be trained as a reporter.
        </p>
      </div>
      <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#9a857a", textAlign: "center", marginTop: 36 }}>{SITE.name}</p>
    </section>
  );
}

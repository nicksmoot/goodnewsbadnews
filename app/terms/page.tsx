import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "The terms for using Good News Bad News.",
};

const h2: React.CSSProperties = { fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px", margin: "34px 0 10px" };
const p: React.CSSProperties = { fontSize: 16, lineHeight: 1.65, color: "#3a362e", margin: "0 0 14px" };
const li: React.CSSProperties = { fontSize: 16, lineHeight: 1.6, color: "#3a362e", marginBottom: 8 };

export default function TermsPage() {
  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 90px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>Terms of Service</div>
      <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(34px,4.6vw,52px)", lineHeight: 1.02, letterSpacing: "-1.6px", margin: "0 0 12px" }}>The deal between us.</h1>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5, color: "#8a857a", marginBottom: 28 }}>Last updated July 9, 2026</div>

      <p style={p}>By using Good News Bad News (&ldquo;the platform&rdquo;), you agree to these terms. If you don&apos;t agree, please don&apos;t use it.</p>

      <h2 style={h2}>Your account</h2>
      <p style={p}>You need an account to post. Use accurate information, keep your password secure, and don&apos;t share your account. You&apos;re responsible for activity under it. One account per person.</p>

      <h2 style={h2}>Being local</h2>
      <p style={p}>Good News Bad News is reported by the people who live it. When you post, you confirm you&apos;re in the city you&apos;re posting to, including a one-time location check. Misrepresenting where you are is a violation of these terms.</p>

      <h2 style={h2}>Your content, and the rights you grant</h2>
      <p style={p}>You keep ownership of what you submit. To operate the platform and its business model, you grant us a worldwide, royalty-free license to review, edit for clarity and safety, publish, distribute, and <strong>license your story to partner newsrooms</strong>. When a story you submitted is licensed to a newsroom, you may be compensated under our contributor terms. You confirm that what you post is your own firsthand contribution, is accurate to the best of your knowledge, and follows our <Link href="/standards" style={{ color: "#19734a", fontWeight: 700 }}>Community Standards</Link>.</p>

      <h2 style={h2}>Moderation</h2>
      <p style={p}>Every submission is reviewed before anything is published. We may edit, decline, or remove content, and not every submission becomes a public story. Paying to submit covers review; it does not guarantee publication.</p>

      <h2 style={h2}>Payments</h2>
      <ul style={{ paddingLeft: 20, margin: "0 0 14px" }}>
        <li style={li}><strong>Membership</strong> is $5/month, billed through Stripe and recurring until you cancel. Cancel anytime from your <Link href="/account" style={{ color: "#19734a", fontWeight: 700 }}>account</Link>; access continues through the paid period.</li>
        <li style={li}><strong>Per-story fees</strong> ($0.50 to post or to unlock a single story) are one-time charges. Founding-window cities may post for free until they reach the story threshold.</li>
        <li style={li}><strong>Partner and licensing fees</strong> are governed by separate newsroom agreements.</li>
        <li style={li}>Fees are non-refundable except where required by law.</li>
      </ul>

      <h2 style={h2}>Acceptable use</h2>
      <p style={p}>No doxxing, harassment, threats, hate speech, unverified accusations against private individuals, or anything else our <Link href="/standards" style={{ color: "#19734a", fontWeight: 700 }}>Community Standards</Link> prohibit. Don&apos;t scrape, attack, or abuse the platform, and don&apos;t use it for anything unlawful.</p>

      <h2 style={h2}>No guarantees</h2>
      <p style={p}>Content is community-sourced and reviewed, but we can&apos;t guarantee it is complete or error-free, and it isn&apos;t legal, medical, or professional advice. The platform is provided &ldquo;as is.&rdquo; To the fullest extent permitted by law, we aren&apos;t liable for indirect or consequential damages arising from your use of it.</p>

      <h2 style={h2}>Termination</h2>
      <p style={p}>You can stop using the platform anytime. We may suspend or close accounts that violate these terms or our standards.</p>

      <h2 style={h2}>Changes and contact</h2>
      <p style={p}>We may update these terms as the platform grows; the &ldquo;last updated&rdquo; date will change when we do. Questions: <a href="mailto:nick@innovationcollective.co" style={{ color: "#19734a", fontWeight: 700 }}>nick@innovationcollective.co</a>.</p>
    </section>
  );
}

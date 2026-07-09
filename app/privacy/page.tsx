import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "How Good News Bad News collects, uses, and protects your information.",
};

const h2: React.CSSProperties = { fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: 24, letterSpacing: "-0.5px", margin: "34px 0 10px" };
const p: React.CSSProperties = { fontSize: 16, lineHeight: 1.65, color: "#3a362e", margin: "0 0 14px" };
const li: React.CSSProperties = { fontSize: 16, lineHeight: 1.6, color: "#3a362e", marginBottom: 8 };

export default function PrivacyPage() {
  return (
    <section style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 90px" }}>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>Privacy Policy</div>
      <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(34px,4.6vw,52px)", lineHeight: 1.02, letterSpacing: "-1.6px", margin: "0 0 12px" }}>Your information, and what we do with it.</h1>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12.5, color: "#8a857a", marginBottom: 28 }}>Last updated July 9, 2026</div>

      <p style={p}>Good News Bad News (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is a civic news platform where residents report on the public life of their city. We collect as little as we can, and we never sell your personal information. This policy explains what we collect, why, and the choices you have.</p>

      <h2 style={h2}>What we collect</h2>
      <ul style={{ paddingLeft: 20, margin: "0 0 14px" }}>
        <li style={li}><strong>Account details.</strong> Your name (optional), email address, and a securely hashed password. We never store your password in readable form.</li>
        <li style={li}><strong>Location, once.</strong> To confirm you&apos;re a local before you post, we ask your browser for your location a single time and check whether it falls within the city you&apos;re posting to. We store only the fact that you verified and which city, not your precise coordinates, and we do not track your location on an ongoing basis.</li>
        <li style={li}><strong>Payment information.</strong> Memberships and payments are processed by Stripe. Stripe handles your card details directly; we never see or store your full card number.</li>
        <li style={li}><strong>What you submit.</strong> The stories, signals, photos, and details you choose to post, along with the byline you select.</li>
        <li style={li}><strong>Email preferences.</strong> If you subscribe to the Saturday Digest, we store your email, city, and preferences.</li>
        <li style={li}><strong>Basic usage analytics.</strong> Privacy-friendly, aggregate analytics about how the site is used, to help us improve it.</li>
      </ul>

      <h2 style={h2}>How we use it</h2>
      <p style={p}>To run your account, verify that contributors are local, process payments, publish and moderate submissions, send the digest and essential account emails, and keep the platform safe and working. That&apos;s it.</p>

      <h2 style={h2}>Who we share it with</h2>
      <p style={p}>Only the service providers that make the platform run: Stripe (payments), Resend (email delivery), and our hosting and database providers. When a partner newsroom licenses a story, we share the <em>published story and the byline you chose</em>, not your account details. We do not sell your personal information to anyone.</p>

      <h2 style={h2}>Your choices</h2>
      <ul style={{ paddingLeft: 20, margin: "0 0 14px" }}>
        <li style={li}>Unsubscribe from the digest at any time using the link in every issue.</li>
        <li style={li}>Manage or cancel a membership from your <Link href="/account" style={{ color: "#19734a", fontWeight: 700 }}>account</Link>.</li>
        <li style={li}>Request a copy of your data, or deletion of your account, by emailing us.</li>
      </ul>

      <h2 style={h2}>Cookies</h2>
      <p style={p}>We use a single sign-in cookie to keep you logged in. We do not use advertising or cross-site tracking cookies.</p>

      <h2 style={h2}>Children</h2>
      <p style={p}>Good News Bad News is not directed to children under 13, and we do not knowingly collect their information.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>Questions, data requests, or deletion requests: <a href="mailto:nick@innovationcollective.co" style={{ color: "#19734a", fontWeight: 700 }}>nick@innovationcollective.co</a>.</p>

      <p style={{ ...p, color: "#8a857a", fontSize: 14, marginTop: 28 }}>We may update this policy as the platform grows. Material changes will be reflected in the &ldquo;last updated&rdquo; date above.</p>
    </section>
  );
}

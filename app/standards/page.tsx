export default function StandardsPage() {
  return (
    <div>
      <section style={{ maxWidth: 820, margin: "0 auto", padding: "56px 24px 70px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase", letterSpacing: "1.6px", fontSize: 12, color: "#6b675e", marginBottom: 14 }}>Community Standards</div>
        <h1 style={{ fontFamily: "'Spectral',serif", fontWeight: 800, fontSize: "clamp(34px,4.6vw,52px)", lineHeight: 1.02, letterSpacing: "-1.6px", margin: "0 0 20px" }}>Built for civic signal, not gossip.</h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: "#3a362e", margin: "0 0 36px" }}>We publish stories, patterns, concerns, and opportunities that help the community understand itself and respond. We do not publish doxxing, threats, personal attacks, unsupported accusations, private information, or content designed to shame individuals.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div style={{ background: "#fffaf1", border: "1px solid #a3342959", borderRadius: 16, padding: 22 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "#a33429", marginBottom: 12 }}>Not allowed</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.8, color: "#3a362e" }}>
              <li>Doxxing or private addresses</li>
              <li>Phone numbers / private emails</li>
              <li>Unverified accusations against private individuals</li>
              <li>Medical or private personal information</li>
              <li>Threats, harassment, hate speech</li>
              <li>Naming minors in sensitive contexts</li>
              <li>Legal allegations without documentation</li>
              <li>Unverified rumors</li>
            </ul>
          </div>
          <div style={{ background: "#fffaf1", border: "1px solid #19734a59", borderRadius: 16, padding: 22 }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "#19734a", marginBottom: 12 }}>Allowed</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.8, color: "#3a362e" }}>
              <li>Firsthand observations</li>
              <li>Concerns about places, systems &amp; policies</li>
              <li>Documented facts</li>
              <li>Photos of public conditions</li>
              <li>Constructive complaints</li>
              <li>Community wins &amp; resident experiences</li>
              <li>Public meeting notes</li>
              <li>Patterns noticed by multiple residents</li>
            </ul>
          </div>
        </div>
        <div style={{ background: "#fbf4e6", border: "1px solid #d8cab2", borderRadius: 16, padding: 24, marginTop: 24 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, letterSpacing: "1.4px", textTransform: "uppercase", color: "#9a6a12", marginBottom: 12 }}>Safer language pattern</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#a33429", marginBottom: 6 }}>Instead of</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#5a564d", margin: 0, fontStyle: "italic" }}>&quot;This camp is full of criminals.&quot;</p>
            </div>
            <div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "#19734a", marginBottom: 6 }}>We publish</div>
              <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "#2b2820", margin: 0 }}>&quot;Residents near the area reported safety and sanitation concerns. The submission is under review and may be combined with other reports into a broader pattern report.&quot;</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from "react";

const GREEN = "#19734a";
const RED = "#a33429";

// The brand wordmark: "Good News / Bad News". Good News stays green, Bad News
// stays red, and the slash between them is a two-tone diagonal — green on top,
// red on the bottom — echoing the good/bad split. Used everywhere the logo
// appears (header, footer, partners hero) so the mark stays identical.
export default function Wordmark({
  size = 25,
  style,
  className,
}: {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "'Spectral',serif",
        fontWeight: 800,
        letterSpacing: "-0.6px",
        lineHeight: 1,
        whiteSpace: "nowrap",
        fontSize: size,
        ...style,
      }}
    >
      <span style={{ color: GREEN }}>Good News</span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          padding: "0 0.14em",
          fontWeight: 800,
          backgroundImage: `linear-gradient(to bottom, ${GREEN} 0%, ${GREEN} 50%, ${RED} 50%, ${RED} 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
        }}
      >
        /
      </span>
      <span style={{ color: RED }}>Bad News</span>
    </span>
  );
}

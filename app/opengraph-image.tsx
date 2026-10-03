import { ImageResponse } from "next/og";

export const alt = "Founder Scorecard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07080c",
          color: "#f3efe4",
          padding: "64px",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#f0b429",
          }}
        >
          Free founder scorecard
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 980 }}>
            Fund it, fix it, or flee it?
          </div>
          <div style={{ fontSize: 28, color: "#9b9588", maxWidth: 900, lineHeight: 1.35 }}>
            Score your business idea, find your price headroom, and see if customers fund your growth.
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 22, color: "#9b9588" }}>
          <span style={{ color: "#fda4af" }}>FLEE IT</span>
          <span style={{ color: "#f0b429" }}>FIX IT</span>
          <span style={{ color: "#99f6e4" }}>FUND IT</span>
          <span>No login · 4 checks · free</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

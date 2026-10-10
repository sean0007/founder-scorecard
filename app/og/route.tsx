import { ImageResponse } from "next/og";
import { moat } from "@/lib/calc";
import { EXAMPLE_INPUTS, VERDICT_LINE, parseResultParams } from "@/lib/share";

const COLOR = { "FUND IT": "#99f6e4", "FIX IT": "#f0b429", "FLEE IT": "#fda4af" } as const;

export async function GET(req: Request) {
  const inputs = parseResultParams(new URL(req.url).searchParams) ?? EXAMPLE_INPUTS;
  const r = moat(inputs);
  const parts = Object.entries(r.parts) as [string, number][];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#07080c", color: "#f3efe4", padding: "56px 64px", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: "0.24em", textTransform: "uppercase", color: "#f0b429" }}>Fund it, fix it, or flee it</div>
          <div style={{ display: "flex", fontSize: 22, color: "#9b9588" }}>{`MOAT score ${r.total} / 40`}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 140, fontWeight: 800, letterSpacing: "-0.04em", color: COLOR[r.verdict], lineHeight: 1 }}>{r.verdict}</span>
          <div style={{ display: "flex", fontSize: 32, color: "#c9c3b6", marginTop: 14 }}>{`${VERDICT_LINE[r.verdict]} Weakest: ${r.weakest}.`}</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {parts.map(([label, value]) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", flex: 1, border: `2px solid ${label === r.weakest ? "#f0b429" : "#23252c"}`, borderRadius: 24, padding: "14px 20px", background: "#101218" }}>
              <span style={{ fontSize: 44, fontWeight: 700, color: "#f3efe4" }}>{`${value}/10`}</span>
              <span style={{ fontSize: 22, color: "#9b9588" }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#6f6a60" }}>
          <span>fund-fix-flee.vercel.app · free, no login</span>
          <span>Rules of thumb only. Not financial, legal, or business advice.</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" } },
  );
}

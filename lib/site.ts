export const SITE_NAME = "Founder Scorecard";

export const SITE_TAGLINE =
  "Four free checks for any business idea: the MOAT score, price headroom from your close rate, whether customers fund growth, and what an old email list is worth.";

export const DISCLAIMER_SHORT = "Educational rules of thumb only. Not financial, legal, or business advice.";

export const HONESTY =
  "Based on frameworks Codie Sanchez, Alex Hormozi, and Daniel Priestley shared on The Diary of a CEO. Not affiliated with or endorsed by any of them. Uses only the numbers you enter.";

export const SIBLING_TOOLS = [
  { href: "https://japan-trip-brain.vercel.app", label: "Japan Trip Brain" },
  { href: "https://hotel-ota-calculator.vercel.app", label: "Hotel OTA Calculator" },
  { href: "https://saas-bill-cutter.vercel.app", label: "SaaS Bill Cutter" },
  { href: "https://ads-risk-check.vercel.app", label: "Ads Risk Check" },
  { href: "https://faceless-yt-risk-check.vercel.app", label: "Faceless YT Reality Check" },
  { href: "https://appgate-pack.vercel.app/check", label: "AppGate Pack" },
  { href: "https://ai-bottleneck-map.vercel.app", label: "AI Bottleneck Map" },
  { href: "https://viral-attention-map.vercel.app", label: "Viral Attention Map" },
] as const;

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "https://fund-fix-flee.vercel.app";
}

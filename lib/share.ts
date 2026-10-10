import { moat, type MoatInputs } from "./calc";
import { PUBLIC_URL } from "./site";

export { PUBLIC_URL };

/** Share links cover check 1 (MOAT idea score). Same parameter names and defaults as /api/moat. */
export const SCORE_KEYS = ["margin", "operations", "advantage", "tam"] as const;
export const CHECK_KEYS = ["pain", "money", "suffer"] as const;

/** Example used in the sitemap, llms.txt, and the canary. Same as the /api/moat example. */
export const EXAMPLE_INPUTS: MoatInputs = { margin: 7, operations: 4, advantage: 6, tam: 8, pain: true, money: true, suffer: true };

type Params = URLSearchParams | Record<string, string | string[] | undefined>;

function get(p: Params, key: string): string | undefined {
  if (p instanceof URLSearchParams) return p.get(key) ?? undefined;
  const v = p[key];
  return Array.isArray(v) ? v[0] : v;
}

/** Whole numbers 1-10, like the sliders. Missing or bad values return null. */
function score(raw: string | undefined): number | null {
  if (raw === undefined || raw.trim() === "") return null;
  const n = Number(raw.trim());
  if (!Number.isFinite(n)) return null;
  return Math.min(10, Math.max(1, Math.round(n)));
}

/** Same rule as the API: missing or empty = true (the default); otherwise only 1/true/yes/y/on are true. */
function flag(raw: string | undefined): boolean {
  if (raw === undefined || raw.trim() === "") return true;
  return /^(1|true|yes|y|on)$/i.test(raw.trim());
}

/** Reads a share link. Returns null unless all four scores are present (an empty /r goes home). */
export function parseResultParams(p: Params): MoatInputs | null {
  const scores = SCORE_KEYS.map((k) => score(get(p, k)));
  if (scores.some((n) => n === null)) return null;
  const [margin, operations, advantage, tam] = scores as number[];
  return { margin, operations, advantage, tam, pain: flag(get(p, "pain")), money: flag(get(p, "money")), suffer: flag(get(p, "suffer")) };
}

export function resultQuery(i: MoatInputs): string {
  const q = new URLSearchParams();
  for (const k of SCORE_KEYS) q.set(k, String(score(String(i[k])) ?? 1));
  for (const k of CHECK_KEYS) q.set(k, i[k] ? "true" : "false");
  return q.toString();
}

export const resultPath = (i: MoatInputs) => `/r?${resultQuery(i)}`;
export const ogPath = (i: MoatInputs) => `/og?${resultQuery(i)}`;
export const isExample = (i: MoatInputs) => resultQuery(i) === resultQuery(EXAMPLE_INPUTS);

export const VERDICT_LINE = {
  "FUND IT": "Strong enough to put time and money in.",
  "FIX IT": "Worth it only if you fix the weak spot first.",
  "FLEE IT": "Walk away or rethink it from scratch.",
} as const;

/** Headline for <title>, H1, and share text, built only from the calculator's own result. */
export function resultHeadline(r: ReturnType<typeof moat>): string {
  return `${r.verdict}: MOAT score ${r.total}/40, weakest ${r.weakest}`;
}

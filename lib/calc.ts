// Four business checks based on frameworks discussed publicly by Codie Sanchez,
// Alex Hormozi, and Daniel Priestley. Rules of thumb, not guarantees.

const clamp = (n: number, lo: number, hi: number) => (Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo);

/* 1. MOAT idea score: Margin, Operations, Advantage, TAM, each 1-10. */
export type MoatInputs = { margin: number; operations: number; advantage: number; tam: number; pain: boolean; money: boolean; suffer: boolean };
export type MoatVerdict = "FUND IT" | "FIX IT" | "FLEE IT";
export function moat(i: MoatInputs) {
  const parts = { Margin: clamp(i.margin, 1, 10), Operations: clamp(i.operations, 1, 10), Advantage: clamp(i.advantage, 1, 10), TAM: clamp(i.tam, 1, 10) };
  const total = Object.values(parts).reduce((a, b) => a + b, 0);
  const verdict: MoatVerdict = total >= 30 ? "FUND IT" : total >= 20 ? "FIX IT" : "FLEE IT";
  const weakest = (Object.entries(parts) as [keyof typeof parts, number][]).sort((a, b) => a[1] - b[1])[0][0];
  const fixes: Record<keyof typeof parts, string> = {
    Margin: "Raise prices or cut delivery cost until net margin is at least about 15%.",
    Operations: "Make it run without you: write the process down, then productize the service, then automate it.",
    Advantage: "Find an edge others can't copy fast: distribution, years in the industry, logistics, or proprietary data.",
    TAM: "Check enough people actually buy this. Search volume, competitors making money, and real spending are good signs.",
  };
  const flags: string[] = [];
  if (!i.pain) flags.push("No measurable pain. People pay to move a number they care about.");
  if (!i.money) flags.push("Buyers may not have money. Business owners, executives, and affluent niches spend more and haggle less.");
  if (!i.suffer) flags.push("Low willingness to suffer. Most businesses take longer than planned, so make sure you'll push through.");
  return { parts, total, verdict, weakest, fix: fixes[weakest], flags };
}

/* 2. Price headroom from close rate, and profit impact of a price rise. */
export type PriceInputs = { closeRate: number; price: number; netMargin: number; newPriceMultiple: number; customersLost: number };
export function price(i: PriceInputs) {
  const close = clamp(i.closeRate, 0, 100);
  const m = clamp(i.netMargin, 0.1, 99) / 100;
  const k = clamp(i.newPriceMultiple, 0.1, 10);
  const lost = clamp(i.customersLost, 0, 100) / 100;
  let band: { label: string; low: number; high: number; note: string };
  if (close >= 80) band = { label: "Way underpriced", low: 2, high: 3, note: "At 80%+ close rates, prices can often double or triple." };
  else if (close >= 60) band = { label: "Underpriced", low: 1.5, high: 2, note: "At 60–79%, there's often a 1.5x to 2x price rise available." };
  else if (close >= 40) band = { label: "Room to raise", low: 1.3, high: 1.5, note: "At 40–59%, a raise of about 30–50% is common." };
  else if (close >= 25) band = { label: "Priced about right", low: 1, high: 1.1, note: "Around 30% close rate (7 of 10 say no) usually means fair pricing." };
  else band = { label: "Sales problem", low: 1, high: 1, note: "Under about 25%, work on selling and offer before touching price." };
  // Costs scale with customers: profit per old revenue = r*k - r*(1-m).
  const r = 1 - lost;
  const oldProfit = m;
  const newProfit = r * (k - (1 - m));
  const profitMultiple = newProfit / oldProfit;
  const breakEvenLoss = k > 1 ? 1 - m / (k - (1 - m)) : 0;
  return {
    band,
    suggestedLow: i.price * band.low,
    suggestedHigh: i.price * band.high,
    profitMultiple,
    breakEvenLossPct: Math.max(0, breakEvenLoss * 100),
  };
}

/* 3. 30-day cash: do customers fund the next customer? */
export type CashInputs = { cash30: number; cac: number; cogs30: number };
export function cash(i: CashInputs) {
  const cost = Math.max(0, i.cac) + Math.max(0, i.cogs30);
  const ratio = cost > 0 ? Math.max(0, i.cash30) / cost : 0;
  const level = ratio >= 2 ? "SELF-FUNDING" : ratio >= 1 ? "BREAK-EVEN" : "CASH-HUNGRY";
  const gapTo2x = Math.max(0, 2 * cost - Math.max(0, i.cash30));
  const tips =
    level === "SELF-FUNDING"
      ? ["Each customer pays for the next two. Growth is limited by delivery and hiring, not cash.", "Protect it: don't discount the upfront offer to chase volume."]
      : [
          "Add a paid setup or onboarding fee collected on day one.",
          "Offer an upsell or add-on in the first 30 days.",
          "Offer an annual or 3-month prepay with a bonus instead of a discount.",
          "Lower acquisition cost with referrals and content instead of only ads.",
        ];
  return { cost, ratio, level, gapTo2x, tips };
}

/* 4. Old email list: what a reactivation campaign might bring in. */
export type ListInputs = { contacts: number; reachable: number; buyRate: number; orderValue: number; partnerShare: number };
export function list(i: ListInputs) {
  const reach = Math.max(0, i.contacts) * (clamp(i.reachable, 0, 100) / 100);
  const rate = clamp(i.buyRate, 0, 100) / 100;
  const scenario = (mult: number) => {
    const buyers = reach * rate * mult;
    return { buyers, revenue: buyers * Math.max(0, i.orderValue) };
  };
  const low = scenario(0.5), mid = scenario(1), high = scenario(2);
  const share = clamp(i.partnerShare, 0, 100) / 100;
  return { reach, low, mid, high, partnerFeeMid: mid.revenue * share, ownerKeepsMid: mid.revenue * (1 - share) };
}

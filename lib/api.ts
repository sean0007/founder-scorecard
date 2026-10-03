import { cash, list, moat, price } from "./calc";
import { bool, num, type Endpoint } from "./agent-api";
import { DISCLAIMER_SHORT, HONESTY, SITE_NAME, SITE_TAGLINE } from "./site";

export const PUBLIC_URL = "https://fund-fix-flee.vercel.app";
export const API_DISCLAIMER = `${DISCLAIMER_SHORT} ${HONESTY}`;
export const API_INFO = { title: `${SITE_NAME} API`, description: SITE_TAGLINE };

const r2 = (n: number) => Math.round(n * 100) / 100;

export const ENDPOINTS: Record<"moat" | "price" | "cash" | "emailList", Endpoint> = {
  moat: {
    path: "/api/moat",
    operationId: "moatIdeaScore",
    summary: "Score a business idea with MOAT (Margin, Operations, Advantage, TAM): fund it, fix it, or flee it",
    description:
      "Rate four factors from 1 to 10. Total 30+ = FUND IT, 20-29 = FIX IT, under 20 = FLEE IT. Returns the weakest factor, how to fix it, and red flags from three yes/no questions (real pain, buyers have money, founder willing to suffer).",
    params: [
      { name: "margin", type: "number", required: true, minimum: 1, maximum: 10, description: "Net margin potential, 1-10 (10 = very high margin)." },
      { name: "operations", type: "number", required: true, minimum: 1, maximum: 10, description: "How easily it runs without the founder, 1-10." },
      { name: "advantage", type: "number", required: true, minimum: 1, maximum: 10, description: "Hard-to-copy edge (distribution, data, expertise), 1-10." },
      { name: "tam", type: "number", required: true, minimum: 1, maximum: 10, description: "Market size / proof that people buy, 1-10." },
      { name: "pain", type: "boolean", default: true, description: "Does it fix a measurable pain?" },
      { name: "money", type: "boolean", default: true, description: "Do buyers have money to spend?" },
      { name: "suffer", type: "boolean", default: true, description: "Is the founder willing to push through a long, hard build?" },
    ],
    example: "/api/moat?margin=7&operations=4&advantage=6&tam=8&pain=true&money=true&suffer=true",
    compute: (i) => {
      const input = { margin: num(i, "margin"), operations: num(i, "operations"), advantage: num(i, "advantage"), tam: num(i, "tam"), pain: bool(i, "pain", true), money: bool(i, "money", true), suffer: bool(i, "suffer", true) };
      return { check: "moat", input, result: moat(input) };
    },
  },
  price: {
    path: "/api/price",
    operationId: "priceHeadroom",
    summary: "Estimate price headroom from sales close rate, and the profit effect of a price rise",
    description:
      "Uses the close-rate rule of thumb (80%+ close = way underpriced, ~30% = about right, under 25% = sales problem). Returns a suggested price range, the profit multiple after a rise with some customers lost, and the break-even customer loss percentage.",
    params: [
      { name: "closeRate", type: "number", required: true, minimum: 0, maximum: 100, description: "Percent of sales calls or proposals that close, 0-100." },
      { name: "price", type: "number", required: true, minimum: 0, description: "Current price, any currency." },
      { name: "netMargin", type: "number", default: 15, minimum: 0.1, maximum: 99, description: "Net profit margin percent today." },
      { name: "newPriceMultiple", type: "number", default: 1.5, minimum: 0.1, maximum: 10, description: "New price as a multiple of the current price (1.5 = +50%)." },
      { name: "customersLost", type: "number", default: 20, minimum: 0, maximum: 100, description: "Percent of customers you expect to lose after the rise." },
    ],
    example: "/api/price?closeRate=70&price=500&netMargin=15&newPriceMultiple=1.5&customersLost=20",
    compute: (i) => {
      const input = { closeRate: num(i, "closeRate"), price: num(i, "price"), netMargin: num(i, "netMargin", 15), newPriceMultiple: num(i, "newPriceMultiple", 1.5), customersLost: num(i, "customersLost", 20) };
      const r = price(input);
      return { check: "price", input, result: { ...r, suggestedLow: r2(r.suggestedLow), suggestedHigh: r2(r.suggestedHigh), profitMultiple: r2(r.profitMultiple), breakEvenLossPct: r2(r.breakEvenLossPct) } };
    },
  },
  cash: {
    path: "/api/cash",
    operationId: "thirtyDayCashCheck",
    summary: "Check whether a new customer's first 30 days of cash pays for acquiring and serving them (2x rule)",
    description: "Ratio of cash collected in a customer's first 30 days to acquisition cost plus 30-day cost to serve. 2x+ = SELF-FUNDING, 1-2x = BREAK-EVEN, under 1x = CASH-HUNGRY. Returns the gap to 2x and tips.",
    params: [
      { name: "cash30", type: "number", required: true, minimum: 0, description: "Cash collected from a new customer in their first 30 days." },
      { name: "cac", type: "number", required: true, minimum: 0, description: "Cost to acquire one customer." },
      { name: "cogs30", type: "number", default: 0, minimum: 0, description: "Cost to serve that customer for their first 30 days." },
    ],
    example: "/api/cash?cash30=400&cac=250&cogs30=100",
    compute: (i) => {
      const input = { cash30: num(i, "cash30"), cac: num(i, "cac"), cogs30: num(i, "cogs30", 0) };
      const r = cash(input);
      return { check: "cash", input, result: { ...r, ratio: r2(r.ratio) } };
    },
  },
  emailList: {
    path: "/api/email-list",
    operationId: "oldEmailListValue",
    summary: "Estimate what one reactivation offer to an old customer or email list might bring in",
    description: "Low / mid / high scenarios (0.5x, 1x, 2x the buy rate) for buyers and revenue, plus an optional partner revenue-share split.",
    params: [
      { name: "contacts", type: "number", required: true, minimum: 0, description: "Number of past contacts on the list." },
      { name: "orderValue", type: "number", required: true, minimum: 0, description: "Average order value of the offer." },
      { name: "reachable", type: "number", default: 70, minimum: 0, maximum: 100, description: "Percent of contacts still reachable." },
      { name: "buyRate", type: "number", default: 1, minimum: 0, maximum: 100, description: "Expected percent of reached contacts who buy." },
      { name: "partnerShare", type: "number", default: 0, minimum: 0, maximum: 100, description: "Optional partner revenue share percent." },
    ],
    example: "/api/email-list?contacts=3000&orderValue=80&reachable=70&buyRate=1&partnerShare=20",
    compute: (i) => {
      const input = { contacts: num(i, "contacts"), orderValue: num(i, "orderValue"), reachable: num(i, "reachable", 70), buyRate: num(i, "buyRate", 1), partnerShare: num(i, "partnerShare", 0) };
      const r = list(input);
      const s = (x: { buyers: number; revenue: number }) => ({ buyers: r2(x.buyers), revenue: r2(x.revenue) });
      return { check: "email-list", input, result: { reach: r2(r.reach), low: s(r.low), mid: s(r.mid), high: s(r.high), partnerFeeMid: r2(r.partnerFeeMid), ownerKeepsMid: r2(r.ownerKeepsMid) } };
    },
  },
};

export const PLUGIN = {
  name: SITE_NAME,
  nameForModel: "founder_scorecard",
  descriptionForHuman: "Score a business idea (MOAT), price headroom, 30-day cash, and old email list value.",
  descriptionForModel:
    "Use when a user asks whether a business idea is worth pursuing, whether they are underpriced, whether customers fund growth, or what an old customer list could earn. Deterministic rules of thumb from the numbers given. Always relay the disclaimer: educational only, not financial advice.",
  logo: "/icon.svg",
};

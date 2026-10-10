"use client";

import { useState } from "react";
import { moat, price, cash, list, type MoatInputs } from "@/lib/calc";
import { CardDisclaimer } from "@/components/card-disclaimer";
import { ShareBar } from "@/components/share-bar";
import { PUBLIC_URL, VERDICT_LINE, resultHeadline, resultPath } from "@/lib/share";

const fmt = (n: number) => (Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : "0");
const fx = (n: number) => (Number.isFinite(n) ? n.toFixed(1) : "0.0");
const num = (s: string) => Number(s) || 0;

const tabs = [
  { id: "moat", label: "1 · Idea score" },
  { id: "price", label: "2 · Price headroom" },
  { id: "cash", label: "3 · 30-day cash" },
  { id: "list", label: "4 · Old email list" },
] as const;
type Tab = (typeof tabs)[number]["id"];

function NumField({ id, label, help, value, onChange, suffix }: { id: string; label: string; help: string; value: string; onChange: (v: string) => void; suffix?: string }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3">
      <label htmlFor={id} className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="block text-xs text-muted">{help}</span>
      </label>
      <div className="flex items-center gap-1 text-muted">
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
          className="w-24 rounded-xl border border-line bg-black/40 px-3 py-2 text-right font-mono text-sm text-foreground focus:border-amber"
        />
        <span className="w-4 font-mono text-sm">{suffix ?? ""}</span>
      </div>
    </li>
  );
}

function Panel({ title, children, note }: { title: string; children: React.ReactNode; note?: string }) {
  return (
    <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
      <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">{title}</p>
      <ul className="mt-4 divide-y divide-line">{children}</ul>
      {note && <p className="mt-3 text-xs text-muted">{note}</p>}
    </div>
  );
}

function Result({ kicker, big, color, headline, children, share }: { kicker: string; big: string; color: string; headline: string; children: React.ReactNode; share?: React.ReactNode }) {
  return (
    <article data-testid="result-card" className="relative flex flex-col overflow-hidden rounded-3xl border border-line bg-black/50 lg:sticky lg:top-16 lg:self-start">
      <div className="p-5 sm:p-7">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">{kicker}</p>
        <h2 className={`mt-2 font-display text-5xl ${color}`}>{big}</h2>
        <p className="mt-3 text-lg font-medium text-foreground">{headline}</p>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
        {share}
      </div>
      <CardDisclaimer />
    </article>
  );
}

const moatAnchors = {
  margin: { label: "Margin", help: "1 = thin or negative · 5 = about 15% net · 10 = 40%+ net" },
  operations: { label: "Operations", help: "1 = it's a job, you do everything · 10 = runs without you" },
  advantage: { label: "Advantage", help: "1 = anyone can copy it tomorrow · 10 = edge others can't buy" },
  tam: { label: "TAM (market size)", help: "1 = tiny or shrinking · 10 = large, growing, already spending" },
} as const;

export function MoatTool({ initial }: { initial?: MoatInputs }) {
  const [s, setS] = useState(
    initial
      ? { margin: initial.margin, operations: initial.operations, advantage: initial.advantage, tam: initial.tam }
      : { margin: 5, operations: 5, advantage: 5, tam: 5 },
  );
  const [c, setC] = useState(initial ? { pain: initial.pain, money: initial.money, suffer: initial.suffer } : { pain: true, money: true, suffer: true });
  const r = moat({ ...s, ...c });
  const path = resultPath({ ...s, ...c });
  const color = r.verdict === "FUND IT" ? "text-teal-200" : r.verdict === "FIX IT" ? "text-amber" : "text-rose-300";
  const checks = [
    { k: "pain", label: "Measurable pain", help: "Buyers can point to a number this improves" },
    { k: "money", label: "Buyers with money", help: "Businesses or affluent customers, not the broke and busy" },
    { k: "suffer", label: "You'd suffer for it", help: "You'd keep going through 2 hard years" },
  ] as const;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl border border-line bg-panel/60 p-5 sm:p-6">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Score your idea 1–10</p>
        <ul className="mt-4 divide-y divide-line">
          {(Object.keys(moatAnchors) as (keyof typeof moatAnchors)[]).map((k) => (
            <li key={k} className="py-3">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`m-${k}`} className="text-sm font-medium text-foreground">{moatAnchors[k].label}</label>
                <span className="font-mono text-amber">{s[k]}</span>
              </div>
              <input id={`m-${k}`} type="range" min={1} max={10} value={s[k]} onChange={(e) => setS((x) => ({ ...x, [k]: Number(e.target.value) }))} className="mt-2 w-full accent-amber-400" />
              <p className="text-xs text-muted">{moatAnchors[k].help}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-[11px] tracking-[0.22em] text-muted uppercase">Three quick checks</p>
        <ul className="mt-2 divide-y divide-line">
          {checks.map((x) => (
            <li key={x.k} className="flex items-center justify-between gap-4 py-3">
              <label htmlFor={`c-${x.k}`} className="min-w-0">
                <span className="block text-sm font-medium text-foreground">{x.label}</span>
                <span className="block text-xs text-muted">{x.help}</span>
              </label>
              <input id={`c-${x.k}`} type="checkbox" checked={c[x.k]} onChange={(e) => setC((y) => ({ ...y, [x.k]: e.target.checked }))} className="h-5 w-5 accent-amber-400" />
            </li>
          ))}
        </ul>
      </div>
      <Result
        kicker={`MOAT score ${r.total} / 40`}
        big={r.verdict}
        color={color}
        headline={VERDICT_LINE[r.verdict]}
        share={
          <div className="mt-6 border-t border-line pt-4" data-testid="share-result">
            <p className="text-xs text-muted">
              Share this score. The link carries your four scores and three checks, so anyone who opens it sees the same verdict. Nothing is stored.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ShareBar url={`${PUBLIC_URL}${path}`} text={`My business idea: ${resultHeadline(r)}. Free scorecard:`} />
              {initial ? null : (
                <a href={path} className="text-sm text-muted underline underline-offset-2 hover:text-foreground">
                  Open result page
                </a>
              )}
            </div>
          </div>
        }
      >
        <p>
          Margin {r.parts.Margin} · Operations {r.parts.Operations} · Advantage {r.parts.Advantage} · TAM {r.parts.TAM}. 30 or more is fund it, 20 to 29 is fix it, under 20 is flee it.
        </p>
        <p className="rounded-2xl border border-amber/30 bg-amber/5 p-4 text-foreground">
          <span className="font-semibold">Weakest: {r.weakest}.</span> {r.fix}
        </p>
        {r.flags.map((f) => (
          <p key={f} className="text-rose-200">{f}</p>
        ))}
      </Result>
    </div>
  );
}

function PriceTool() {
  const [v, setV] = useState({ closeRate: "60", price: "500", netMargin: "15", mult: "1.5", lost: "20" });
  const set = (k: keyof typeof v) => (x: string) => setV((s) => ({ ...s, [k]: x }));
  const r = price({ closeRate: num(v.closeRate), price: num(v.price), netMargin: num(v.netMargin), newPriceMultiple: num(v.mult), customersLost: num(v.lost) });
  const color = r.band.low >= 1.5 ? "text-teal-200" : r.band.low > 1 ? "text-amber" : "text-rose-300";
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Panel title="Your sales" note="Example numbers. Close rate means qualified prospects who hear your price and buy.">
        <NumField id="p-close" label="Close rate" help="Out of 10 qualified prospects, how many buy?" value={v.closeRate} onChange={set("closeRate")} suffix="%" />
        <NumField id="p-price" label="Current price" help="Any currency" value={v.price} onChange={set("price")} />
        <NumField id="p-margin" label="Net margin" help="Profit after all costs, as % of revenue" value={v.netMargin} onChange={set("netMargin")} suffix="%" />
        <NumField id="p-mult" label="Test a new price at" help="1.5 means 50% higher" value={v.mult} onChange={set("mult")} suffix="×" />
        <NumField id="p-lost" label="Customers you'd lose" help="Your honest guess at the higher price" value={v.lost} onChange={set("lost")} suffix="%" />
      </Panel>
      <Result kicker={`Close rate ${fmt(num(v.closeRate))}%`} big={r.band.label} color={color} headline={r.band.low > 1 ? `Try ${fmt(r.suggestedLow)} to ${fmt(r.suggestedHigh)}.` : "Keep the price for now."}>
        <p>{r.band.note}</p>
        <p className="rounded-2xl border border-amber/30 bg-amber/5 p-4 text-foreground">
          At {fx(num(v.mult))}× the price and {fmt(num(v.lost))}% fewer customers, profit becomes about <span className="font-semibold">{fx(r.profitMultiple)}×</span> what it is now.
          {num(v.mult) > 1 && <> You&apos;d have to lose more than {fmt(r.breakEvenLossPct)}% of customers before profit drops.</>}
        </p>
        <p>This assumes your costs scale with customers. Thin margins make price the biggest lever: at 15% net, doubling price with no lost customers is about 7.7× the profit.</p>
      </Result>
    </div>
  );
}

function CashTool() {
  const [v, setV] = useState({ cash30: "400", cac: "250", cogs: "100" });
  const set = (k: keyof typeof v) => (x: string) => setV((s) => ({ ...s, [k]: x }));
  const r = cash({ cash30: num(v.cash30), cac: num(v.cac), cogs30: num(v.cogs) });
  const color = r.level === "SELF-FUNDING" ? "text-teal-200" : r.level === "BREAK-EVEN" ? "text-amber" : "text-rose-300";
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Panel title="One new customer, first 30 days" note="Example numbers. Use averages per customer.">
        <NumField id="c-cash" label="Cash collected in 30 days" help="Upfront price, setup fees, first payments, upsells" value={v.cash30} onChange={set("cash30")} />
        <NumField id="c-cac" label="Cost to get the customer" help="Ads, sales commissions, and so on, per customer" value={v.cac} onChange={set("cac")} />
        <NumField id="c-cogs" label="Cost to serve them for 30 days" help="Delivery, tools, labor, fees" value={v.cogs} onChange={set("cogs")} />
      </Panel>
      <Result kicker={`${fx(r.ratio)}× your acquisition + delivery cost`} big={r.level} color={color} headline={r.level === "SELF-FUNDING" ? "Each customer pays for the next two." : r.level === "BREAK-EVEN" ? "Customers pay back, but slowly fund growth." : "Every new customer drains cash at first."}>
        <p>The goal is cash collected in 30 days of at least 2× what it cost to get and serve that customer, so growth funds itself.</p>
        {r.gapTo2x > 0 && (
          <p className="rounded-2xl border border-amber/30 bg-amber/5 p-4 text-foreground">You need about <span className="font-semibold">{fmt(r.gapTo2x)}</span> more per customer in the first 30 days to hit 2×.</p>
        )}
        <ul className="list-disc space-y-1 pl-5">
          {r.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Result>
    </div>
  );
}

function ListTool() {
  const [v, setV] = useState({ contacts: "3000", reachable: "70", buyRate: "1", aov: "80", share: "20" });
  const set = (k: keyof typeof v) => (x: string) => setV((s) => ({ ...s, [k]: x }));
  const r = list({ contacts: num(v.contacts), reachable: num(v.reachable), buyRate: num(v.buyRate), orderValue: num(v.aov), partnerShare: num(v.share) });
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Panel title="Past customers and leads" note="The buy rate is an example assumption, not data. Test with a small send first, and only email people who agreed to hear from you.">
        <NumField id="l-contacts" label="Contacts on the list" help="Past customers, old leads, inquiries" value={v.contacts} onChange={set("contacts")} />
        <NumField id="l-reach" label="Still reachable" help="Valid emails or phone numbers" value={v.reachable} onChange={set("reachable")} suffix="%" />
        <NumField id="l-buy" label="Buy rate (your guess)" help="Of reachable people, how many buy from one offer" value={v.buyRate} onChange={set("buyRate")} suffix="%" />
        <NumField id="l-aov" label="Average order value" help="Any currency" value={v.aov} onChange={set("aov")} />
        <NumField id="l-share" label="Partner revenue share" help="If someone runs it for you on a % of sales" value={v.share} onChange={set("share")} suffix="%" />
      </Panel>
      <Result kicker={`${fmt(r.reach)} people you can reach`} big={fmt(r.mid.revenue)} color="text-teal-200" headline="Possible revenue from one reactivation offer.">
        <p>
          At half your buy rate it&apos;s about {fmt(r.low.revenue)}; at double it&apos;s about {fmt(r.high.revenue)}. Middle case: about {fmt(r.mid.buyers)} buyers.
        </p>
        <p className="rounded-2xl border border-amber/30 bg-amber/5 p-4 text-foreground">
          With a {fmt(num(v.share))}% partner share, the partner earns about {fmt(r.partnerFeeMid)} and the business keeps about {fmt(r.ownerKeepsMid)} in the middle case.
        </p>
        <p>Works best with a short, specific offer and a deadline, such as a returning-customer bonus that ends Friday.</p>
      </Result>
    </div>
  );
}

export function Scorecard() {
  const [tab, setTab] = useState<Tab>("moat");
  return (
    <div>
      <div role="tablist" aria-label="Checks" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-4 py-2 text-sm ${tab === t.id ? "border-amber bg-amber text-black font-semibold" : "border-line text-muted hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "moat" && <MoatTool />}
      {tab === "price" && <PriceTool />}
      {tab === "cash" && <CashTool />}
      {tab === "list" && <ListTool />}
    </div>
  );
}

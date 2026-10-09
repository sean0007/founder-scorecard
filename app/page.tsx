import type { Metadata } from "next";
import { FaqSection, type FaqItem } from "@/components/faq-section";
import { Scorecard } from "@/components/scorecard";
import { RATE_LIMIT } from "@/lib/agent-api";
import { DISCLAIMER_SHORT, HONESTY, PUBLIC_URL, SITE_NAME } from "@/lib/site";

const title = "Fund it, fix it, or flee it: free MOAT score for your business idea";
const description =
  "Free founder scorecard: score any business idea with MOAT (Margin, Operations, Advantage, TAM), check price headroom from your close rate, see if customers fund growth in 30 days, and estimate what an old email list could bring in. No login.";

export const metadata: Metadata = {
  title: { absolute: `${title} · ${SITE_NAME}` },
  description,
  alternates: { canonical: `${PUBLIC_URL}/` },
  openGraph: {
    title,
    description,
    type: "website",
    url: `${PUBLIC_URL}/`,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: `${PUBLIC_URL}/`,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any (web browser)",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description,
};

const lessons = [
  { title: "Sell to people with money", text: "A small slice of buyers holds most of the spending. Businesses and affluent niches pay more, complain less, and decide faster." },
  { title: "Proof beats promise", text: "Get your first 5 to 10 results, even for free, then sell with real before-and-after stories instead of claims." },
  { title: "Build assets, not just income", text: "Code, content, data, and an email list keep working after you stop. Turn the income you earn now into those." },
  { title: "Keep supply below demand", text: "Profit lives where people want more than you can deliver. A waitlist and a higher price beat discounting." },
];

const faq: FaqItem[] = [
  {
    q: "How do I know if my business idea is good?",
    a: "Use the free MOAT idea score on this page: rate Margin, Operations, Advantage, and Market size (TAM) from 1 to 10 each. The four scores add up to 40. 30 or more is FUND IT, 20 to 29 is FIX IT, under 20 is FLEE IT. It also flags three yes/no checks (real pain, buyers with money, willingness to stick with it) and points at the weakest letter with a fix. Everything runs in your browser with no login.",
  },
  {
    q: "What does fund it, fix it, or flee it mean?",
    a: "Those are the three MOAT verdicts. FUND IT (30–40): strong enough to put time and money in. FIX IT (20–29): worth it only if you fix the weak spot first. FLEE IT (under 20): walk away or rethink it from scratch. The verdict is a rule of thumb from the numbers you enter, not a prediction that anyone will fund or buy.",
  },
  {
    q: "What is the MOAT score?",
    a: "MOAT stands for Margin, Operations, Advantage, and TAM (market size). Each is scored 1 to 10. The tool names the weakest factor and suggests a fix (for example raise prices until net margin is about 15%, write the process down so it runs without you, find a hard-to-copy edge, or check that enough people actually buy). Attribution: Codie Sanchez's MOAT framing as discussed on The Diary of a CEO.",
  },
  {
    q: "How does the price headroom check work?",
    a: "From your close rate, current price, and net margin, it shows what a price raise would do to profit and how many customers you could lose before you are worse off. Close rates of 80% or more suggest 2 to 3× headroom, 60% to 79% suggest 1.5 to 2×, 40% to 59% about 30% to 50% more, around 30% is priced about right, and under about 25% is usually a sales problem first. Based on Alex Hormozi's close-rate rule of thumb as shared on The Diary of a CEO.",
  },
  {
    q: "What is the 30-day cash check?",
    a: "Cash collected in a customer's first 30 days divided by the cost to get and serve them. 2× or more is SELF-FUNDING (each customer can fund the next), 1× to under 2× is BREAK-EVEN, under 1× is CASH-HUNGRY. The result shows the gap to 2× and tips such as a paid setup fee, an early upsell, or prepay instead of only ads.",
  },
  {
    q: "What does the old email list estimate do?",
    a: "Contacts × reachable % × your buy rate × average order value, shown at half and double your buy rate (low / mid / high). Optional partner revenue-share splits the mid scenario into partner fee and what you keep. It is an estimate from the numbers you enter, not a forecast of a real campaign.",
  },
  {
    q: "Whose frameworks is this based on?",
    a: `Built on frameworks Codie Sanchez (MOAT), Alex Hormozi (close-rate pricing and 30-day cash), and Daniel Priestley (pain, money, passion) shared on The Diary of a CEO. ${HONESTY}`,
  },
  {
    q: "Is there an API for AI agents?",
    a: `Yes, free and keyless, with CORS open. Endpoints: GET ${PUBLIC_URL}/api/moat, /api/price, /api/cash, and /api/email-list (same fields as POST JSON). Every response includes a disclaimer field. Fair use is about ${RATE_LIMIT} requests per minute per IP. OpenAPI: ${PUBLIC_URL}/openapi.json.`,
  },
  {
    q: "Can my AI assistant score an idea through MCP?",
    a: "Yes. Tools score_business_idea_moat, price_headroom_check, thirty_day_cash_check, and email_list_reactivation_value are on the free remote MCP server at https://free-agent-tools.vercel.app/mcp (streamable HTTP, no auth). Add that URL to Claude, Cursor, ChatGPT, or another MCP client.",
  },
  {
    q: "Is a FUND IT score investment or business advice?",
    a: `No. ${DISCLAIMER_SHORT} A score does not predict whether anyone will fund, buy, or use your product. Uses only the numbers you enter; nothing is stored.`,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Free founder scorecard · no login</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Fund it, fix it, or flee it?</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Four quick checks for a business or idea: score it on margin, operations, advantage, and market size, find out
          whether your close rate says you&apos;re underpriced, see if each customer funds the next, and estimate what an
          old customer list could bring in. Everything runs in your browser.
        </p>
      </section>

      <section className="mt-8">
        <Scorecard />
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Four ideas behind the numbers</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {lessons.map((m, i) => (
            <article key={m.title} className="rounded-3xl border border-line bg-panel/60 p-5">
              <span className="font-mono text-amber">0{i + 1}</span>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">How the math works</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted sm:text-base">
          <p><span className="text-foreground">Idea score:</span> the four MOAT scores add up to 40. 30 or more is fund it, 20 to 29 is fix it, under 20 is flee it.</p>
          <p><span className="text-foreground">Price headroom:</span> close rates of 80% or more suggest 2 to 3× headroom, 60% to 79% suggest 1.5 to 2×, 40% to 59% about 30% to 50% more, and around 30% is priced about right. New profit compares (kept customers × (new price − cost)) to today&apos;s profit, with costs scaling per customer.</p>
          <p><span className="text-foreground">30-day cash:</span> cash collected in a customer&apos;s first 30 days divided by the cost to get and serve them. 2× or more is self-funding.</p>
          <p><span className="text-foreground">Old list:</span> contacts × reachable % × your buy rate × average order, shown at half and double your buy rate.</p>
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-line bg-panel/50 p-6">
        <h2 className="font-display text-3xl tracking-tight">Credits</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Built on frameworks Codie Sanchez (MOAT), Alex Hormozi (close-rate pricing and 30-day cash), and Daniel Priestley
          (pain, money, passion) shared on{" "}
          <a className="text-amber underline-offset-2 hover:underline" href="https://www.youtube.com/watch?v=hVlAOIUA71Y" target="_blank" rel="noopener noreferrer">The Diary of a CEO</a>.
          Not affiliated with or endorsed by them or the show. Nothing you type is stored.
        </p>
      </section>

      <FaqSection items={faq} heading="Founder scorecard questions" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}

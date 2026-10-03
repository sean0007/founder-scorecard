import { Scorecard } from "@/components/scorecard";

const lessons = [
  { title: "Sell to people with money", text: "A small slice of buyers holds most of the spending. Businesses and affluent niches pay more, complain less, and decide faster." },
  { title: "Proof beats promise", text: "Get your first 5 to 10 results, even for free, then sell with real before-and-after stories instead of claims." },
  { title: "Build assets, not just income", text: "Code, content, data, and an email list keep working after you stop. Turn the income you earn now into those." },
  { title: "Keep supply below demand", text: "Profit lives where people want more than you can deliver. A waitlist and a higher price beat discounting." },
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
    </div>
  );
}

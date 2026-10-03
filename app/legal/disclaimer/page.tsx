import type { Metadata } from "next";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

export const metadata: Metadata = { title: "Disclaimer", description: DISCLAIMER_SHORT };

export default function DisclaimerPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Read this</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">Disclaimer</h1>
      <p className="mt-4 text-lg text-foreground">{DISCLAIMER_SHORT}</p>
      <p className="mt-2 text-muted">{HONESTY}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-base font-semibold text-foreground">What this is</h2>
          <p className="mt-2">
            Four free checks. Fixed formulas in your browser turn the scores and numbers you enter
            into rough verdicts based on rules of thumb shared publicly by business authors.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">What it is not</h2>
          <p className="mt-2">
            It is not financial, accounting, legal, or business advice, and no result predicts what
            your business will earn. The email-list buy rates are example assumptions, not data. Only
            email people who agreed to hear from you, and follow anti-spam law where you live.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Credits</h2>
          <p className="mt-2">
            The frameworks are credited to Codie Sanchez, Alex Hormozi, and Daniel Priestley from their
            appearance on The Diary of a CEO. This site is not affiliated with or endorsed by them or
            the show. Names are used only to credit ideas.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-foreground">Your data</h2>
          <p className="mt-2">Numbers you type stay in your browser. No login, database, or tracking.</p>
        </section>
      </div>
    </div>
  );
}

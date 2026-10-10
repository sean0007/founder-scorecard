import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MoatTool } from "@/components/scorecard";
import { moat } from "@/lib/calc";
import { PUBLIC_URL, VERDICT_LINE, isExample, ogPath, parseResultParams, resultHeadline, resultPath } from "@/lib/share";
import { DISCLAIMER_SHORT, HONESTY } from "@/lib/site";

type SP = Promise<Record<string, string | string[] | undefined>>;

const verdictColor = { "FUND IT": "text-teal-200", "FIX IT": "text-amber", "FLEE IT": "text-rose-300" } as const;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const inputs = parseResultParams(await searchParams);
  if (!inputs) return { title: "Your result", robots: { index: false, follow: true } };
  const r = moat(inputs);
  const title = resultHeadline(r);
  const description = `Margin ${r.parts.Margin}, Operations ${r.parts.Operations}, Advantage ${r.parts.Advantage}, TAM ${r.parts.TAM}: ${r.total}/40, ${r.verdict}. ${VERDICT_LINE[r.verdict]} Weakest: ${r.weakest}. ${r.fix} ${DISCLAIMER_SHORT}`;
  const url = `${PUBLIC_URL}${resultPath(inputs)}`;
  const image = ogPath(inputs);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: isExample(inputs) ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: `Fund it, fix it, or flee it · ${title}`,
      description,
      type: "website",
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title: `Fund it, fix it, or flee it · ${title}`, description, images: [image] },
  };
}

export default async function ResultPage({ searchParams }: { searchParams: SP }) {
  const inputs = parseResultParams(await searchParams);
  if (!inputs) redirect("/");
  const r = moat(inputs);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
      <section className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.28em] text-amber uppercase">Shared result · Fund it, fix it, or flee it</p>
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          <span className={verdictColor[r.verdict]}>{r.verdict}</span>: MOAT score {r.total}/40
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {VERDICT_LINE[r.verdict]} Weakest: {r.weakest}. {r.fix}
        </p>
        <p className="mt-3 text-sm text-muted">
          Margin {r.parts.Margin} · Operations {r.parts.Operations} · Advantage {r.parts.Advantage} · TAM {r.parts.TAM} · measurable pain{" "}
          {inputs.pain ? "yes" : "no"} · buyers with money {inputs.money ? "yes" : "no"} · willing to suffer {inputs.suffer ? "yes" : "no"}
        </p>
        <p className="mt-3 text-sm text-muted">Scored from the numbers in this link. Move the sliders to score your own idea.</p>
        <p className="mt-4 text-sm">
          <Link href="/" className="text-muted underline underline-offset-2 hover:text-foreground">
            ← All four checks
          </Link>
        </p>
      </section>
      <section className="mt-8">
        <MoatTool initial={inputs} />
      </section>
      <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted">
        {DISCLAIMER_SHORT} {HONESTY}
      </p>
    </div>
  );
}

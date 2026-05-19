import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GridBackground from "@/components/shared/GridBackground";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

interface VsHeroProps {
  competitor: string;
  /** Optional ALL-CAPS / mono variant (e.g. "TRYHACKME"). Defaults to upper. */
  competitorMono?: string;
  /** One-sentence positioning, e.g. "An honest, side-by-side look." */
  sub: string;
}

export default function VsHero({ competitor, competitorMono, sub }: VsHeroProps) {
  const mono = competitorMono ?? competitor.toUpperCase();
  return (
    <section
      aria-labelledby="vs-hero-heading"
      className="relative overflow-hidden border-b border-htb-border pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20"
    >
      <GridBackground variant="neon" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
        <TerminalEyebrow className="justify-center inline-flex">
          compare.platforms
        </TerminalEyebrow>

        <h1
          id="vs-hero-heading"
          className="heading-display text-3xl sm:text-5xl lg:text-6xl text-htb-text mt-4"
        >
          <span className="text-neon">Violethat</span>{" "}
          <span className="text-htb-text-dim">vs</span> {competitor}
        </h1>

        <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-5 max-w-2xl mx-auto">
          {sub}
        </p>

        <div className="flex items-center justify-center gap-3 mt-4 text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
          <span>vs {mono}</span>
          <span aria-hidden>·</span>
          <span>Reviewed {new Date().getFullYear()}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-md bg-neon text-white hover:bg-neon-green-dim hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold"
          >
            Try Violethat free
            <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
          </Link>
          <Link
            href="/billing"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
          >
            See pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

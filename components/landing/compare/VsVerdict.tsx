import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

interface VerdictBlock {
  heading: string;
  body: string;
}

interface VsVerdictProps {
  competitor: string;
  whenViolethat: VerdictBlock[];
  whenCompetitor: VerdictBlock[];
}

/**
 * "When to pick which" section for a /vs/* page.
 * Two-column honest summary — competitor and Violethat each get
 * their own panel of legitimate use-cases.
 */
export default function VsVerdict({
  competitor,
  whenViolethat,
  whenCompetitor,
}: VsVerdictProps) {
  return (
    <section
      aria-labelledby="vs-verdict-heading"
      className="relative border-b border-htb-border bg-htb-bg py-16 sm:py-20"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-10">
          <TerminalEyebrow className="justify-center inline-flex">
            when.to.pick
          </TerminalEyebrow>
          <h2
            id="vs-verdict-heading"
            className="heading-display text-2xl sm:text-3xl lg:text-4xl text-htb-text mt-3"
          >
            Which one is right for you?
          </h2>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-4">
            Honest answers from people who have used both.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {/* Violethat column */}
          <div className="panel panel-hover p-6 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-neon/40 bg-neon/10 text-neon font-mono text-xs font-bold">
                V
              </span>
              <h3 className="text-lg font-bold text-htb-text">
                Pick <span className="text-neon">Violethat</span> when…
              </h3>
            </div>
            <ul className="space-y-4">
              {whenViolethat.map((b) => (
                <li key={b.heading}>
                  <div className="font-semibold text-htb-text text-sm">
                    {b.heading}
                  </div>
                  <p className="text-sm text-htb-muted leading-relaxed mt-1">
                    {b.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitor column */}
          <div className="panel p-6 sm:p-7 border-htb-border">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-htb-border bg-htb-panel-2 text-htb-muted font-mono text-xs font-bold">
                {competitor.charAt(0)}
              </span>
              <h3 className="text-lg font-bold text-htb-text">
                Pick {competitor} when…
              </h3>
            </div>
            <ul className="space-y-4">
              {whenCompetitor.map((b) => (
                <li key={b.heading}>
                  <div className="font-semibold text-htb-text text-sm">
                    {b.heading}
                  </div>
                  <p className="text-sm text-htb-muted leading-relaxed mt-1">
                    {b.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 px-5 py-3 rounded-md bg-neon text-white hover:bg-neon-green-dim hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold"
          >
            Try Violethat free
            <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}

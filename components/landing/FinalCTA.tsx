import Link from "next/link";
import { ArrowRight, Flag } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

/**
 * Section 15 — Final CTA band.
 *
 * Full-width purple radial glow. Captures deep scrollers with two CTAs:
 *   - Primary: Create free account
 *   - Secondary: Book a team demo
 *
 * Server Component. Background uses CSS gradients + a static repeating
 * ASCII pattern at low opacity (no animation, no images).
 */

export default function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden border-b border-htb-border bg-htb-bg-deep py-20 sm:py-28 lg:py-32"
    >
      {/* Centered radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(168,85,247,0.18), transparent 70%)",
        }}
      />
      {/* Ambient corner blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-purple-600/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-fuchsia-600/10 blur-3xl"
      />
      {/* Faint ASCII-style background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 section-grid-bg opacity-40"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-10 text-center">
        <TerminalEyebrow className="justify-center inline-flex">
          ready.to.run
        </TerminalEyebrow>

        <h2
          id="final-cta-heading"
          className="heading-display text-4xl sm:text-5xl lg:text-6xl text-htb-text mt-4"
        >
          Capture your{" "}
          <span className="text-neon">first flag</span> today.
        </h2>

        <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-5 max-w-xl mx-auto">
          No setup. No VM. No install. Sign up free and write your first
          exploit in the next two minutes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-neon text-white hover:bg-neon-green-dim hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Create free account</span>
            <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
          </Link>
          <Link
            href="mailto:violethat@violethat.com?subject=Teams%20demo%20request"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md border border-htb-border bg-htb-panel/60 backdrop-blur-sm text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
          >
            Book a team demo
          </Link>
        </div>

        {/* Reassurance line */}
        <p className="text-[11px] font-mono uppercase tracking-widest text-htb-text-dim mt-6">
          No card required · 20+ free challenges · Cancel anytime
        </p>
      </div>
    </section>
  );
}

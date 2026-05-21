import { ShieldCheck, Workflow, Target, Briefcase } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

/**
 * "Why Violethat?" — ported from the legacy violethat.com benefits grid.
 *
 * 4 cards, dark-themed to match the rest of the landing.
 * Server Component, zero client JS.
 */

const benefits = [
  {
    icon: ShieldCheck,
    title: "Built for detection engineers",
    body: "Violethat is designed specifically for practitioners focused on endpoint detection engineering — not generic cybersecurity training.",
    accent: "01",
  },
  {
    icon: Workflow,
    title: "Practice beyond traditional tools",
    body: "The platform emphasizes engineered telemetry and behavioral detection approaches that go deeper than standard SIEM rule-writing workflows.",
    accent: "02",
  },
  {
    icon: Target,
    title: "Realistic, threat-focused learning",
    body: "Every challenge and dataset is created to reflect real-world attacker behavior, helping defenders think and act practically.",
    accent: "03",
  },
  {
    icon: Briefcase,
    title: "Career-relevant, hands-on experience",
    body: "Users gain practical exposure and applied skills that directly translate to modern detection and blue-team roles.",
    accent: "04",
  },
];

export default function WhyViolethat() {
  return (
    <section
      id="why-violethat"
      aria-labelledby="why-heading"
      className="relative border-b border-htb-border bg-htb-bg py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <TerminalEyebrow className="justify-center inline-flex">
            why.violethat
          </TerminalEyebrow>
          <h2
            id="why-heading"
            className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text mt-3"
          >
            Why{" "}
            <span className="text-htb-text">
              Vio<span className="text-neon">_</span>ethat
            </span>
            ?
          </h2>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-4">
            Built by practitioners, for practitioners. Four reasons defenders
            keep coming back.
          </p>
        </div>

        {/* Benefit grid — 1 col mobile, 2 col tablet, 4 col desktop */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {benefits.map((benefit) => (
            <li key={benefit.title}>
              <article className="group relative h-full panel panel-hover p-6 flex flex-col transition-all duration-300 overflow-hidden">
                {/* Decorative top accent on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Top row: icon + numeric accent */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center justify-center w-11 h-11 rounded-md border border-neon/30 bg-neon/10 text-neon group-hover:shadow-neon-sm transition-shadow">
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-htb-text-dim">
                    {benefit.accent}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold text-htb-text leading-snug group-hover:text-neon transition-colors">
                  {benefit.title}
                </h3>

                {/* Body */}
                <p className="text-sm text-htb-muted leading-relaxed mt-3 flex-1">
                  {benefit.body}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

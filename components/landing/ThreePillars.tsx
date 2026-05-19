import Link from "next/link";
import { Terminal, Cpu, ShieldAlert, ArrowRight } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

const pillars = [
  {
    icon: ShieldAlert,
    eyebrow: "01 · adversary.simulation",
    title: "Real adversary techniques. Real detection logic.",
    body: "Practice against the same TTPs your SOC sees in production — Windows hooking, payload decoding, evasion chains. Build detections that hold up in the real world.",
    href: "/challenges",
    cta: "Explore challenges",
  },
  {
    icon: Terminal,
    eyebrow: "02 · zero.setup",
    title: "In-browser IDE. Zero setup.",
    body: "Monaco editor, C/C++ tooling, syntax highlighting, multi-file support. Open a challenge and start writing — no VMs, no Docker, no VPN gymnastics.",
    href: "/challenges",
    cta: "Open the IDE",
  },
  {
    icon: Cpu,
    eyebrow: "03 · live.telemetry",
    title: "Live agent runner. Real-time logs.",
    body: "Compile, hit Run, watch your code execute against the target. Every hook, syscall, and payload streamed back to you with a websocket — flags drop in seconds.",
    href: "/challenges",
    cta: "See the agent",
  },
];

export default function ThreePillars() {
  return (
    <section
      id="platform"
      aria-labelledby="pillars-heading"
      className="relative border-b border-htb-border bg-htb-bg py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <TerminalEyebrow className="justify-center inline-flex">
            platform.pillars
          </TerminalEyebrow>
          <h2
            id="pillars-heading"
            className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text mt-3"
          >
            Built for the work, not the demo.
          </h2>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-4">
            Three pieces that turn a browser tab into a working offensive +
            defensive lab.
          </p>
        </div>

        {/* Pillar grid */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {pillars.map((pillar) => (
            <li key={pillar.title}>
              <article className="group h-full panel panel-hover p-6 sm:p-7 flex flex-col transition-all duration-300">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-md border border-neon/30 bg-neon/10 text-neon group-hover:shadow-neon-sm transition-shadow mb-5">
                  <pillar.icon className="w-5 h-5" />
                </div>

                {/* Eyebrow + title */}
                <span className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim mb-2">
                  {pillar.eyebrow}
                </span>
                <h3 className="text-lg sm:text-xl font-semibold text-htb-text leading-snug group-hover:text-neon transition-colors">
                  {pillar.title}
                </h3>

                {/* Body */}
                <p className="mt-3 text-sm text-htb-muted leading-relaxed flex-1">
                  {pillar.body}
                </p>

                {/* CTA */}
                <Link
                  href={pillar.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted hover:text-neon transition-colors"
                >
                  {pillar.cta}
                  <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

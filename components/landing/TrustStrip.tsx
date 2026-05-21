import { ShieldCheck, Award, Cpu, Database, Globe2 } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

const badges = [
  { icon: ShieldCheck, label: "DPIIT Recognized" },
  { icon: Cpu, label: "Browser-native IDE" },
  // { icon: Database, label: "Powered by Detect-DB" },
  { icon: Award, label: "Built by practitioners" },
  { icon: Globe2, label: "Trusted globally" },
];

export default function TrustStrip() {
  return (
    <section
      aria-labelledby="trust-eyebrow"
      className="relative border-b border-htb-border bg-htb-bg-deep"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 sm:py-12">
        <div className="flex flex-col items-center gap-5">
          <TerminalEyebrow>
            <span id="trust-eyebrow">trusted.by.operators.worldwide</span>
          </TerminalEyebrow>

          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 sm:gap-x-12">
            {badges.map((badge) => (
              <li
                key={badge.label}
                className="flex items-center gap-2 text-htb-muted hover:text-htb-text transition-colors"
              >
                <badge.icon className="w-4 h-4 text-neon shrink-0" />
                <span className="text-xs sm:text-sm font-mono uppercase tracking-widest">
                  {badge.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

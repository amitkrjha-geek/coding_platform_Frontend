import Link from "next/link";
import {
  Play,
  ArrowRight,
  ShieldCheck,
  Code2,
  Flag,
  Sparkles,
} from "lucide-react";
import GridBackground from "@/components/shared/GridBackground";
import HeroTerminal from "./HeroTerminal";

const trustBadges = [
  { icon: ShieldCheck, label: "DPIIT Recognized" },
  { icon: Code2, label: "Browser-native IDE" },
  { icon: Flag, label: "Real flag capture" },
];

const stats = [
  { value: "850+", label: "Challenges" },
  { value: "120K+", label: "Operators" },
  { value: "4.2M+", label: "Flags captured" },
];

export default function HeroSplitTerminal() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-headline"
      className="relative overflow-hidden border-b border-htb-border pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20"
    >
      <GridBackground variant="neon" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: copy + CTAs (6/12) */}
          <div className="lg:col-span-6 space-y-6">
            {/* New: small "first-of-its-kind" badge anchors the boast */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-neon/30 bg-neon/5 font-mono text-[10px] font-semibold uppercase tracking-widest text-neon">
              <Sparkles className="w-3 h-3" />
              <span>First-of-its-kind for blue teams</span>
            </div>

            <h1
              id="hero-headline"
              className="font-bold text-htb-text tracking-tight text-[40px] sm:text-[52px] lg:text-[60px] leading-[1.05]"
            >
              Where Blue Teams finally get to{" "}
              <span className="relative inline-block text-neon">
                play with hooks
                {/* underline accent */}
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-1.5 h-[3px] bg-gradient-to-r from-neon/60 via-fuchsia-400/60 to-transparent rounded-full"
                />
              </span>
              .
            </h1>

            <p className="text-htb-muted text-base sm:text-lg leading-relaxed max-w-xl">
              A hands-on playground for detection engineers, blue teamers, and
              security researchers — write C/C++, run the agent, and watch
              every hook fire in real time.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-md bg-neon text-white hover:bg-neon-green-dim hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold"
              >
                Start Free
                <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              </Link>
              <Link
                href="#ide-demo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-htb-border bg-htb-panel/60 backdrop-blur-sm text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
              >
                <Play className="w-3.5 h-3.5" />
                Watch the demo
              </Link>
            </div>

            {/* Trust badges */}
            {/* <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
              {trustBadges.map((badge) => (
                <li
                  key={badge.label}
                  className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-htb-text-dim"
                >
                  <badge.icon className="w-3.5 h-3.5 text-neon" />
                  <span>{badge.label}</span>
                </li>
              ))}
            </ul> */}

            {/* Stat strip — establishes scale above the fold */}
            {/* <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-htb-border bg-htb-border max-w-xl mt-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-htb-panel/70 backdrop-blur-sm px-4 py-3 text-center"
                >
                  <dt className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
                    {stat.label}
                  </dt>
                  <dd className="font-mono text-lg sm:text-xl font-bold text-neon tabular-nums mt-0.5">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl> */}
          </div>

          {/* Right: terminal mockup (6/12) */}
          <div className="lg:col-span-6 relative">
            {/* Tilt + lift on desktop only, flat on mobile */}
            <div className="lg:rotate-[1deg] lg:hover:rotate-0 transition-transform duration-500">
              <HeroTerminal />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

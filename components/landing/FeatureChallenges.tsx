import Link from "next/link";
import { ArrowRight, Users, Crown, Lock } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

/**
 * Section 6 — Feature deep-dive #1: Challenges & Tracks
 *
 * Left 60%: copy + benefits + CTA
 * Right 40%: mock challenge card grid (6 cards, one premium with the glow)
 * Server Component, zero client JS.
 */

interface MockChallenge {
  title: string;
  difficulty: "easy" | "medium" | "hard" | "insane";
  category: string;
  points: number;
  solved: number;
  isPremium?: boolean;
}

const mockChallenges: MockChallenge[] = [
  {
    title: "Hook CreateFileW",
    difficulty: "easy",
    category: "Detection",
    points: 50,
    solved: 1247,
  },
  {
    title: "Decode the Payload",
    difficulty: "medium",
    category: "Malware",
    points: 150,
    solved: 832,
  },
  {
    title: "Bypass the Sandbox",
    difficulty: "hard",
    category: "Evasion",
    points: 300,
    solved: 214,
    isPremium: true,
  },
  {
    title: "AD Recon via LDAP",
    difficulty: "medium",
    category: "Active Directory",
    points: 150,
    solved: 601,
  },
  {
    title: "Heap Spray 101",
    difficulty: "easy",
    category: "Pwn",
    points: 50,
    solved: 1893,
  },
  {
    title: "Kernel Callback Hide",
    difficulty: "insane",
    category: "Rootkit",
    points: 500,
    solved: 47,
  },
];

const difficultyConfig = {
  easy: {
    label: "Easy",
    text: "text-neon",
    bg: "bg-neon/10",
    border: "border-neon/30",
    dot: "bg-neon",
  },
  medium: {
    label: "Medium",
    text: "text-warn",
    bg: "bg-warn/10",
    border: "border-warn/30",
    dot: "bg-warn",
  },
  hard: {
    label: "Hard",
    text: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    dot: "bg-danger",
  },
  insane: {
    label: "Insane",
    text: "text-fuchsia-300",
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-400/40",
    dot: "bg-fuchsia-400",
  },
} as const;

function MockChallengeCard({ challenge }: { challenge: MockChallenge }) {
  const diff = difficultyConfig[challenge.difficulty];
  const premium = challenge.isPremium;

  return (
    <article
      className={`group relative overflow-hidden rounded-md border p-4 transition-all duration-300 ${
        premium
          ? "border-purple-500/30 bg-gradient-to-br from-htb-panel via-htb-panel to-purple-950/30 shadow-[0_0_0_1px_rgba(168,85,247,0.3),0_0_24px_rgba(168,85,247,0.12)]"
          : "border-htb-border bg-htb-panel hover:border-neon/30"
      }`}
    >
      {premium && (
        <>
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-purple-600 via-fuchsia-400 to-purple-600 opacity-80" />
          <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
        </>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold uppercase tracking-widest border ${diff.text} ${diff.bg} ${diff.border}`}
          >
            <span className={`block w-1 h-1 rounded-full ${diff.dot}`} />
            {diff.label}
          </span>
          {premium && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold uppercase tracking-widest border border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200">
              <Crown className="w-2 h-2" />
              Pro
            </span>
          )}
        </div>
        {premium && (
          <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded border border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200">
            <Lock className="w-3 h-3" />
          </div>
        )}
      </div>

      <h3
        className={`text-sm font-semibold leading-snug truncate ${
          premium ? "text-htb-text" : "text-htb-text"
        }`}
      >
        {challenge.title}
      </h3>
      <p className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim mt-0.5">
        {challenge.category}
      </p>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-htb-border">
        <div className="flex items-center gap-1 text-[10px] font-mono text-htb-text-dim">
          <Users className="w-3 h-3" />
          <span className="tabular-nums">
            {challenge.solved.toLocaleString()} solved
          </span>
        </div>
        <span
          className={`font-mono text-xs font-bold tabular-nums ${
            premium ? "text-fuchsia-200" : "text-neon"
          }`}
        >
          {challenge.points} pts
        </span>
      </div>
    </article>
  );
}

const benefits = [
  "5+ categories: Detection, Malware, Pwn, Crypto, AD",
  "4 difficulty tiers from Easy to Insane",
  "Premium tracks with full writeups + reference solutions",
  "New challenges added every month",
];

export default function FeatureChallenges() {
  return (
    <section
      id="challenges-feature"
      aria-labelledby="challenges-feature-heading"
      className="relative border-b border-htb-border bg-htb-bg-deep py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          {/* Left: copy (3/5) */}
          <div className="lg:col-span-3 space-y-5">
            <TerminalEyebrow>challenges.catalog</TerminalEyebrow>
            <h2
              id="challenges-feature-heading"
              className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text"
            >
              From script-kiddie to{" "}
              <span className="text-neon">OSCP-ready</span> in 12 weeks.
            </h2>
            <p className="text-htb-muted text-base sm:text-lg leading-relaxed max-w-xl">
              A curated catalog of hands-on challenges across detection,
              malware, exploitation, and AD — paced from your first hook to
              your first rootkit.
            </p>

            <ul className="space-y-2.5 pt-2">
              {benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 text-sm text-htb-muted"
                >
                  <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-neon shrink-0 shadow-neon-sm" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/challenges"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-md bg-neon text-white hover:bg-neon-green-dim hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold"
              >
                Browse the catalog
                <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              </Link>
            </div>
          </div>

          {/* Right: mock card grid (2/5) */}
          <div className="lg:col-span-2 relative">
            <div
              aria-hidden
              className="absolute -inset-4 bg-radial-glow opacity-40 pointer-events-none"
            />
            <div className="relative grid grid-cols-2 gap-3">
              {mockChallenges.map((c) => (
                <MockChallengeCard key={c.title} challenge={c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

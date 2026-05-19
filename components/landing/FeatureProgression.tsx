import { Trophy, Flame } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";
import RankLadder from "./RankLadder";

/**
 * Section 8 — Feature deep-dive #3: Progression / Leaderboard
 *
 * Two-column inside a centered section header:
 *  - Left:  RankLadder
 *  - Right: mock live leaderboard (top 5 operators by flag count)
 * Server Component.
 */

interface LeaderboardRow {
  rank: number;
  handle: string;
  flags: number;
  streakDays: number;
  isYou?: boolean;
}

const leaderboard: LeaderboardRow[] = [
  { rank: 1, handle: "n0x_falcon", flags: 142, streakDays: 87 },
  { rank: 2, handle: "blue_yeti", flags: 128, streakDays: 64 },
  { rank: 3, handle: "syscall_jess", flags: 119, streakDays: 41 },
  { rank: 4, handle: "you", flags: 96, streakDays: 12, isYou: true },
  { rank: 5, handle: "hex_witch", flags: 91, streakDays: 33 },
];

function rankStyle(rank: number) {
  if (rank === 1) return "text-warn"; // gold
  if (rank === 2) return "text-htb-muted"; // silver-ish
  if (rank === 3) return "text-orange-400"; // bronze
  return "text-htb-text-dim";
}

export default function FeatureProgression() {
  return (
    <section
      id="progression"
      aria-labelledby="progression-heading"
      className="relative border-b border-htb-border bg-htb-bg-deep py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header — centered */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <TerminalEyebrow className="justify-center inline-flex">
            progression.ladder
          </TerminalEyebrow>
          <h2
            id="progression-heading"
            className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text mt-3"
          >
            Rank up. <span className="text-neon">Stay accountable.</span>
          </h2>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-4">
            Every flag earns points. Every streak builds momentum. Climb the
            ladder, hold your spot on the board — the practice compounds.
          </p>
        </div>

        {/* Two-column visual */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
          {/* Left: Rank ladder card */}
          <div className="panel p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-md border border-neon/30 bg-neon/10 text-neon">
                  <Trophy className="w-4 h-4" />
                </div>
                <span className="terminal-eyebrow">your.rank</span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-htb-text-dim">
                7 tiers · 5000+ pts
              </span>
            </div>

            <RankLadder />
          </div>

          {/* Right: Mock leaderboard */}
          <div className="panel p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-md border border-neon/30 bg-neon/10 text-neon">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="terminal-eyebrow">leaderboard.weekly</span>
              </div>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-neon">
                <span className="block w-1.5 h-1.5 rounded-full bg-neon shadow-neon-sm animate-glow-pulse" />
                live
              </span>
            </div>

            <ol className="space-y-2">
              {leaderboard.map((row) => (
                <li
                  key={row.handle}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-md border transition-colors ${
                    row.isYou
                      ? "border-neon/40 bg-neon/5 shadow-[0_0_0_1px_rgba(168,85,247,0.25)]"
                      : "border-htb-border bg-htb-bg/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`shrink-0 font-mono text-sm font-bold tabular-nums w-5 text-right ${rankStyle(
                        row.rank,
                      )}`}
                    >
                      {row.rank}
                    </span>
                    <div className="flex items-center justify-center w-7 h-7 rounded-full border border-neon/30 bg-neon/10 text-neon font-mono text-[11px] font-semibold shrink-0">
                      {row.handle.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className={`text-sm font-mono truncate ${
                        row.isYou ? "text-neon font-semibold" : "text-htb-text"
                      }`}
                    >
                      {row.handle}
                      {row.isYou && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold uppercase tracking-widest border border-neon/40 bg-neon/10 text-neon">
                          You
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5 text-htb-muted">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-htb-text-dim">
                        flags
                      </span>
                      <span className="font-mono text-sm font-bold text-htb-text tabular-nums">
                        {row.flags}
                      </span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-htb-muted">
                      <Flame className="w-3 h-3 text-warn" />
                      <span className="font-mono text-sm font-bold text-htb-text tabular-nums">
                        {row.streakDays}d
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

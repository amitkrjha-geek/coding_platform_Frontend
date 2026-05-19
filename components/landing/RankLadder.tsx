import { cn } from "@/lib/utils";

/**
 * Rank progression ladder visual.
 * Uses Violethat-themed rank names (not HTB's verbatim).
 * Server Component. The "current" rank gets a purple glow.
 */

interface Rank {
  name: string;
  range: string;
  current?: boolean;
}

const ranks: Rank[] = [
  { name: "Initiate", range: "0–99 pts" },
  { name: "Analyst", range: "100–299 pts" },
  { name: "Operator", range: "300–699 pts", current: true },
  { name: "Hunter", range: "700–1499 pts" },
  { name: "Adversary", range: "1500–2999 pts" },
  { name: "Phantom", range: "3000–4999 pts" },
  { name: "Architect", range: "5000+ pts" },
];

export default function RankLadder({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Connecting line (desktop only) */}
      <div
        aria-hidden
        className="hidden sm:block absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-htb-border via-neon/40 to-htb-border"
      />

      <ol className="space-y-3">
        {ranks.map((rank, i) => (
          <li
            key={rank.name}
            className="relative flex items-center gap-4 group"
          >
            {/* Dot / badge */}
            <div
              className={cn(
                "shrink-0 relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 font-mono text-[10px] font-bold tabular-nums transition-all",
                rank.current
                  ? "border-neon bg-neon text-white shadow-neon-sm"
                  : "border-htb-border bg-htb-panel text-htb-text-dim group-hover:border-htb-border-hover",
              )}
            >
              {i + 1}
            </div>

            {/* Label */}
            <div
              className={cn(
                "flex items-baseline justify-between gap-3 flex-1 px-3 py-2 rounded-md border transition-all",
                rank.current
                  ? "border-neon/40 bg-neon/5 shadow-[0_0_0_1px_rgba(168,85,247,0.3)]"
                  : "border-htb-border bg-htb-panel/40 group-hover:border-htb-border-hover",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "font-semibold text-sm",
                    rank.current ? "text-neon" : "text-htb-text",
                  )}
                >
                  {rank.name}
                </span>
                {rank.current && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[9px] font-semibold uppercase tracking-widest border border-neon/40 bg-neon/10 text-neon">
                    You
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-htb-text-dim tabular-nums">
                {rank.range}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

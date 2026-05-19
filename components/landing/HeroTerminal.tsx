import { cn } from "@/lib/utils";

interface HeroTerminalProps {
  className?: string;
}

/**
 * Static, decorative terminal card for the hero.
 * No JS-driven animation — pure CSS keyframes only (caret blink).
 * Lives in the LCP region: kept Server-renderable, zero hydration cost.
 */
export default function HeroTerminal({ className }: HeroTerminalProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full max-w-[560px] mx-auto",
        className
      )}
    >
      {/* Outer purple glow halo (decorative, behind the card) */}
      <div className="absolute -inset-8 bg-radial-glow opacity-80 pointer-events-none" />

      {/* Terminal card */}
      <div className="relative panel shadow-panel-lg overflow-hidden">
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent" />

        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-htb-border bg-htb-bg/40">
          <span className="block w-2.5 h-2.5 rounded-full bg-danger/70" />
          <span className="block w-2.5 h-2.5 rounded-full bg-warn/70" />
          <span className="block w-2.5 h-2.5 rounded-full bg-neon/70" />
          <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-htb-text-dim">
            ~/violethat/challenge-042
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-neon/30 bg-neon/10 font-mono text-[9px] font-semibold uppercase tracking-widest text-neon">
            <span className="block w-1.5 h-1.5 rounded-full bg-neon shadow-neon-sm" />
            Agent Live
          </span>
        </div>

        {/* Terminal body */}
        <div className="px-5 py-5 font-mono text-xs sm:text-sm leading-relaxed bg-htb-bg-deep min-h-[260px]">
          <div className="flex gap-2">
            <span className="text-htb-text-dim">$</span>
            <span className="text-htb-text">
              gcc <span className="text-neon">exploit.c</span> -o exploit
            </span>
          </div>
          <div className="text-htb-text-dim pl-4 mt-1">
            ✓ Compiled successfully
          </div>

          <div className="flex gap-2 mt-3">
            <span className="text-htb-text-dim">$</span>
            <span className="text-htb-text">./agent --run exploit</span>
          </div>
          <div className="text-htb-muted pl-4 mt-1 space-y-0.5">
            <div>
              <span className="text-neon">[+]</span> hooking CreateFileW...
              <span className="text-htb-text">ok</span>
            </div>
            <div>
              <span className="text-neon">[+]</span> payload decoded —{" "}
              <span className="text-htb-text">128 bytes</span>
            </div>
            <div>
              <span className="text-neon">[+]</span> flag candidate found
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 px-2.5 py-1 rounded border border-neon/30 bg-neon/10 text-neon font-mono text-[11px] uppercase tracking-widest font-semibold shadow-neon-sm">
            <span>✓ Flag captured</span>
            <span className="text-htb-text">VHCTF&#123;...&#125;</span>
          </div>

          {/* Prompt + caret */}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-htb-text-dim">$</span>
            <span
              aria-hidden
              className="inline-block w-[7px] h-[14px] bg-neon align-middle animate-terminal-blink"
            />
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />
      </div>
    </div>
  );
}

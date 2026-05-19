import { cn } from "@/lib/utils";

/**
 * Reusable agent-log stream panel used in section 7 (FeatureAgentRunner).
 * Server Component — pure CSS keyframes via inline <style>, no JS loop.
 * Staggered fade-in runs once on mount, then sits on final frame.
 * Respects prefers-reduced-motion via global media query in globals.css.
 */

interface LogLine {
  prefix?: "+" | "-" | "*" | "$" | "→";
  tone?: "neon" | "muted" | "warn" | "danger";
  text: string;
  highlight?: string;
}

const defaultLog: LogLine[] = [
  { prefix: "$", text: "./agent --target challenge-042", tone: "muted" },
  { prefix: "+", tone: "neon", text: "agent bootstrapped" },
  { prefix: "+", tone: "neon", text: "loading hooks from", highlight: "exploit.dll" },
  { prefix: "+", tone: "neon", text: "HOOK SUCCESS: CreateFileW intercepted" },
  { prefix: "+", tone: "neon", text: "HOOK SUCCESS: RegOpenKeyExW intercepted" },
  { prefix: "→", tone: "muted", text: "intercepted:", highlight: "C:\\Users\\...\\flag.txt" },
  { prefix: "+", tone: "neon", text: "payload decoded —", highlight: "128 bytes" },
  { prefix: "+", tone: "neon", text: "flag candidate found" },
  { prefix: "+", tone: "neon", text: "verifying with server..." },
  { prefix: "*", tone: "neon", text: "✓ FLAG CAPTURED", highlight: "VHCTF{hook_w1n_2024}" },
];

const toneClass: Record<NonNullable<LogLine["tone"]>, string> = {
  neon: "text-neon",
  muted: "text-htb-text-dim",
  warn: "text-warn",
  danger: "text-danger",
};

interface AgentLogStreamProps {
  className?: string;
  /** Override the default scripted log if needed */
  lines?: LogLine[];
  /** Title bar label */
  label?: string;
}

export default function AgentLogStream({
  className,
  lines = defaultLog,
  label = "agent.log",
}: AgentLogStreamProps) {
  return (
    <div
      className={cn(
        "relative panel shadow-panel-lg overflow-hidden",
        className,
      )}
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent" />

      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-htb-border bg-htb-bg/40">
        <div className="flex items-center gap-2">
          <span className="block w-2.5 h-2.5 rounded-full bg-danger/70" />
          <span className="block w-2.5 h-2.5 rounded-full bg-warn/70" />
          <span className="block w-2.5 h-2.5 rounded-full bg-neon/70" />
          <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-htb-text-dim">
            {label}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-neon/30 bg-neon/10 font-mono text-[9px] font-semibold uppercase tracking-widest text-neon">
          <span className="block w-1.5 h-1.5 rounded-full bg-neon shadow-neon-sm animate-glow-pulse" />
          Agent Live
        </span>
      </div>

      {/* Log body */}
      <div className="bg-htb-bg-deep px-5 py-5 font-mono text-[11px] sm:text-xs leading-relaxed min-h-[300px] space-y-1">
        {lines.map((line, i) => {
          const delay = 0.1 + i * 0.18;
          const isFinal = i === lines.length - 1;
          return (
            <div
              key={i}
              className={cn(
                "opacity-0 flex gap-2",
                isFinal && "mt-2",
              )}
              style={{
                animation: `agent-line-in 0.3s ease-out ${delay}s both`,
              }}
            >
              {line.prefix && (
                <span
                  className={cn(
                    "shrink-0",
                    line.prefix === "$"
                      ? "text-htb-text-dim"
                      : toneClass[line.tone ?? "muted"],
                  )}
                >
                  {line.prefix === "$" ? "$" : `[${line.prefix}]`}
                </span>
              )}
              <span className={cn("flex-1", toneClass[line.tone ?? "muted"])}>
                {isFinal ? (
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-neon/40 bg-neon/10 text-neon shadow-neon-sm font-semibold uppercase tracking-widest">
                    <span>{line.text}</span>
                    {line.highlight && (
                      <span className="text-htb-text normal-case tracking-normal">
                        {line.highlight}
                      </span>
                    )}
                  </span>
                ) : (
                  <>
                    {line.text}
                    {line.highlight && (
                      <>
                        {" "}
                        <span className="text-htb-text">{line.highlight}</span>
                      </>
                    )}
                  </>
                )}
              </span>
            </div>
          );
        })}

        {/* Prompt + blinking caret */}
        <div
          className="flex items-center gap-2 mt-3 opacity-0"
          style={{
            animation: `agent-line-in 0.3s ease-out ${
              0.1 + lines.length * 0.18 + 0.2
            }s both`,
          }}
        >
          <span className="text-htb-text-dim">$</span>
          <span
            aria-hidden
            className="inline-block w-[7px] h-[14px] bg-neon align-middle animate-terminal-blink"
          />
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />

      {/* Inline keyframes — scoped to this component */}
      <style>{`
        @keyframes agent-line-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="agent-line-in"] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}

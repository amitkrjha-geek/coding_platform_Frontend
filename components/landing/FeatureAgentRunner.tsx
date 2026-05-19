import Link from "next/link";
import { ArrowRight, Activity, Eye, Zap } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";
import AgentLogStream from "./AgentLogStream";

/**
 * Section 7 — Feature deep-dive #2: Agent Runner & Live Logs
 *
 * Reverse split: visual LEFT, text RIGHT.
 * Server Component — no client JS.
 */

const benefits = [
  {
    icon: Activity,
    title: "Real-time streaming",
    body: "WebSocket-streamed logs — every hook, syscall, and payload visible the instant it fires.",
  },
  {
    icon: Eye,
    title: "Total visibility",
    body: "Inspect agent state, intercepted args, decoded buffers, and verification results without leaving the page.",
  },
  {
    icon: Zap,
    title: "Flags drop in seconds",
    body: "Hit Run, watch the log, see VHCTF{...} surface. Verification is built in — no manual flag submission.",
  },
];

export default function FeatureAgentRunner() {
  return (
    <section
      id="agent-runner"
      aria-labelledby="agent-runner-heading"
      className="relative border-b border-htb-border bg-htb-bg py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
          {/* Left: visual (2/5) */}
          {/* <div className="lg:col-span-2 order-2 lg:order-1 relative">
            <div
              aria-hidden
              className="absolute -inset-6 bg-radial-glow opacity-50 pointer-events-none"
            />
            <div className="relative">
              <span className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border border-neon/40 bg-htb-panel text-neon">
                <span className="block w-1.5 h-1.5 rounded-full bg-neon shadow-neon-sm animate-glow-pulse" />
                Interactive demo
              </span>
              <AgentLogStream label="violethat — agent.log" />
            </div>
          </div> */}

          {/* Right: copy (3/5) */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-5">
            <TerminalEyebrow>agent.runner</TerminalEyebrow>
            <h2
              id="agent-runner-heading"
              className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text"
            >
              See every keystroke and every{" "}
              <span className="text-neon">syscall</span> as your code runs.
            </h2>
            <p className="text-htb-muted text-base sm:text-lg leading-relaxed max-w-xl">
              Compile in the browser, hit Run, and our agent executes your code
              against the target, streaming hooks, payloads, and verification
              back to you in real time over a websocket. No black box.
            </p>

            <ul className="space-y-4 pt-2">
              {benefits.map((b) => (
                <li key={b.title} className="flex gap-3">
                  <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-md border border-neon/30 bg-neon/10 text-neon">
                    <b.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-htb-text text-sm">
                      {b.title}
                    </div>
                    <p className="text-sm text-htb-muted leading-relaxed mt-0.5">
                      {b.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-md border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
              >
                Browse the catalog
                <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

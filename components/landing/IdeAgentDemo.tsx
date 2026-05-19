import {
  FileCode,
  Folder,
  ChevronRight,
  Play,
  CheckCircle2,
  Flag,
} from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";
import GridBackground from "@/components/shared/GridBackground";

/**
 * Section 4 — "Capture your first flag in 60 seconds"
 *
 * Static, Server-Component faux IDE. Three panes:
 *  - Left: challenge tree
 *  - Center: Monaco-style editor with C code
 *  - Right: agent log stream + Flag-captured toast
 *
 * Animation is pure CSS keyframes (defined inline via <style>) staggered
 * by `animation-delay`. No JS loop, no IntersectionObserver in this version
 * (the section is far below the LCP and the keyframe runs once on mount,
 * then sits on the final frame). Honors prefers-reduced-motion automatically
 * via the global media query in globals.css.
 */
export default function IdeAgentDemo() {
  return (
    <section
      id="ide-demo"
      aria-labelledby="ide-demo-heading"
      className="relative overflow-hidden border-b border-htb-border bg-htb-bg-deep py-20 sm:py-28 lg:py-32"
    >
      <GridBackground variant="neon" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <TerminalEyebrow className="justify-center inline-flex">
            ide.live.demo
          </TerminalEyebrow>
          <h2
            id="ide-demo-heading"
            className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text mt-3"
          >
            Capture your first flag in{" "}
            <span className="text-neon">60 seconds.</span>
          </h2>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-4">
            No setup. No VM. No install. Write C/C++ in the browser, run the
            agent, watch the logs.
          </p>
        </div>

        {/* IDE mock */}
        <div className="relative">
          {/* Decorative glow */}
          <div
            aria-hidden
            className="absolute -inset-8 bg-radial-glow opacity-60 pointer-events-none"
          />

          <div className="relative panel shadow-panel-lg overflow-hidden">
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent" />

            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-htb-border bg-htb-bg/40">
              <span className="block w-2.5 h-2.5 rounded-full bg-danger/70" />
              <span className="block w-2.5 h-2.5 rounded-full bg-warn/70" />
              <span className="block w-2.5 h-2.5 rounded-full bg-neon/70" />
              <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-htb-text-dim">
                violethat — challenge-042 / hook-detection
              </span>
              <span
                className="ml-auto inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-neon/30 bg-neon/10 font-mono text-[9px] font-semibold uppercase tracking-widest text-neon"
                style={{
                  animation:
                    "ide-agent-pill 0.4s ease-out 1.2s both",
                }}
              >
                <span className="block w-1.5 h-1.5 rounded-full bg-neon shadow-neon-sm animate-glow-pulse" />
                Agent Live
              </span>
            </div>

            {/* 3-pane layout */}
            <div className="grid grid-cols-12 min-h-[460px]">
              {/* Left pane: challenge tree */}
              <aside
                aria-hidden
                className="hidden md:block md:col-span-3 border-r border-htb-border bg-htb-bg/30 p-3 font-mono text-[11px] text-htb-muted"
              >
                <div className="flex items-center gap-1.5 text-htb-text-dim uppercase tracking-widest text-[10px] mb-2">
                  Explorer
                </div>
                <ul className="space-y-1">
                  <li className="flex items-center gap-1.5 text-htb-text">
                    <ChevronRight className="w-3 h-3 rotate-90" />
                    <Folder className="w-3 h-3 text-neon" />
                    <span>challenge-042</span>
                  </li>
                  <li className="flex items-center gap-1.5 pl-5">
                    <FileCode className="w-3 h-3 text-htb-text-dim" />
                    <span>README.md</span>
                  </li>
                  <li className="flex items-center gap-1.5 pl-5 text-neon">
                    <FileCode className="w-3 h-3" />
                    <span>exploit.c</span>
                  </li>
                  <li className="flex items-center gap-1.5 pl-5">
                    <FileCode className="w-3 h-3 text-htb-text-dim" />
                    <span>Makefile</span>
                  </li>
                  <li className="flex items-center gap-1.5 mt-3">
                    <ChevronRight className="w-3 h-3" />
                    <Folder className="w-3 h-3 text-htb-text-dim" />
                    <span>solutions/</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ChevronRight className="w-3 h-3" />
                    <Folder className="w-3 h-3 text-htb-text-dim" />
                    <span>artifacts/</span>
                  </li>
                </ul>
              </aside>

              {/* Center pane: Monaco-style editor */}
              <div className="col-span-12 md:col-span-5 border-r border-htb-border">
                {/* Editor tab bar */}
                <div className="flex items-center border-b border-htb-border bg-htb-bg/40">
                  <div className="px-4 py-2 border-r border-htb-border bg-htb-bg-deep font-mono text-[11px] text-neon flex items-center gap-1.5">
                    <FileCode className="w-3 h-3" />
                    exploit.c
                  </div>
                </div>

                {/* Editor body */}
                <pre className="px-4 py-4 font-mono text-[11px] sm:text-xs leading-relaxed text-htb-text overflow-x-auto bg-htb-bg-deep">
                  <code>
                    <span className="text-htb-text-dim">{`// challenge-042 — hook CreateFileW`}</span>
                    {"\n"}
                    <span className="text-purple-300">#include</span>{" "}
                    <span className="text-neon">{'<windows.h>'}</span>
                    {"\n"}
                    <span className="text-purple-300">#include</span>{" "}
                    <span className="text-neon">{'"MinHook.h"'}</span>
                    {"\n\n"}
                    <span className="text-purple-300">typedef</span>{" "}
                    <span className="text-sky-300">HANDLE</span>
                    {"("}
                    <span className="text-sky-300">WINAPI</span>{"* "}
                    <span className="text-neon">CreateFileW_t</span>
                    {")("}
                    <span className="text-sky-300">LPCWSTR</span>, ...{");"}
                    {"\n"}
                    <span className="text-neon">CreateFileW_t</span>{" "}
                    OrigCreateFileW = <span className="text-purple-300">nullptr</span>;
                    {"\n\n"}
                    <span className="text-sky-300">HANDLE</span>{" "}
                    <span className="text-sky-300">WINAPI</span>{" "}
                    <span className="text-neon">HookedCreateFileW</span>
                    {"("}<span className="text-sky-300">LPCWSTR</span> path, ...{")"}
                    {" {"}
                    {"\n  "}
                    <span className="text-purple-300">Logger</span>
                    {"::Log("}
                    <span className="text-neon">{'"intercepted: %ls"'}</span>
                    {", path);"}
                    {"\n  "}
                    <span className="text-purple-300">return</span>{" "}
                    OrigCreateFileW(path, ...);
                    {"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>

              {/* Right pane: agent log stream + flag toast */}
              <div className="col-span-12 md:col-span-4 bg-htb-bg-deep flex flex-col">
                {/* Log header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-htb-border bg-htb-bg/40">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-htb-text-dim">
                    Agent Output
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neon">
                    <Play className="w-2.5 h-2.5" />
                    running
                  </span>
                </div>

                {/* Log stream */}
                <div className="flex-1 px-3 py-3 font-mono text-[11px] leading-relaxed space-y-1">
                  <div
                    className="text-htb-muted opacity-0"
                    style={{ animation: "ide-line-in 0.3s ease-out 0.1s both" }}
                  >
                    <span className="text-htb-text-dim">$</span> gcc{" "}
                    <span className="text-neon">exploit.c</span> -o exploit
                  </div>
                  <div
                    className="text-htb-muted opacity-0"
                    style={{ animation: "ide-line-in 0.3s ease-out 0.3s both" }}
                  >
                    <CheckCircle2 className="w-3 h-3 text-neon inline-block mr-1 align-text-bottom" />
                    Compiled successfully
                  </div>
                  <div
                    className="text-htb-muted opacity-0 pt-2"
                    style={{ animation: "ide-line-in 0.3s ease-out 0.55s both" }}
                  >
                    <span className="text-htb-text-dim">$</span>{" "}
                    ./agent --run exploit
                  </div>
                  <div
                    className="text-htb-muted opacity-0"
                    style={{ animation: "ide-line-in 0.3s ease-out 0.75s both" }}
                  >
                    <span className="text-neon">[+]</span> hooking
                    CreateFileW... <span className="text-htb-text">ok</span>
                  </div>
                  <div
                    className="text-htb-muted opacity-0"
                    style={{ animation: "ide-line-in 0.3s ease-out 0.9s both" }}
                  >
                    <span className="text-neon">[+]</span> payload decoded —{" "}
                    <span className="text-htb-text">128 bytes</span>
                  </div>
                  <div
                    className="text-htb-muted opacity-0"
                    style={{ animation: "ide-line-in 0.3s ease-out 1.05s both" }}
                  >
                    <span className="text-neon">[+]</span> flag candidate found
                  </div>
                  <div
                    className="text-htb-muted opacity-0"
                    style={{ animation: "ide-line-in 0.3s ease-out 1.2s both" }}
                  >
                    <span className="text-neon">[+]</span> verifying with
                    server...
                  </div>

                  {/* Flag captured toast */}
                  <div
                    className="opacity-0 mt-4"
                    style={{
                      animation: "ide-flag-in 0.4s ease-out 1.5s both",
                    }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neon/40 bg-neon/10 text-neon shadow-neon-sm font-mono text-[11px] uppercase tracking-widest font-semibold">
                      <Flag className="w-3.5 h-3.5" />
                      <span>Flag captured</span>
                      <span className="text-htb-text normal-case tracking-normal">
                        VHCTF&#123;hook_w1n_2024&#125;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />
          </div>
        </div>

        {/* Inline keyframes — scoped via <style> (no client component needed) */}
        <style>{`
          @keyframes ide-line-in {
            from { opacity: 0; transform: translateY(4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes ide-flag-in {
            0%   { opacity: 0; transform: translateY(6px) scale(0.96); }
            60%  { opacity: 1; transform: translateY(0) scale(1.02); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes ide-agent-pill {
            from { opacity: 0; transform: translateX(6px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            [style*="ide-line-in"],
            [style*="ide-flag-in"],
            [style*="ide-agent-pill"] {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

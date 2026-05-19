import { Check, X, Minus } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

/**
 * Section 10 — Comparison table (vs HackTheBox / TryHackMe).
 *
 * Rendered as a real <table> with <th scope="col"> headers so it's
 * citable by Perplexity / ChatGPT / Google AI Overviews.
 * Server Component, zero JS.
 *
 * NOTE: Be factually accurate — competitors will read this. Values reflect
 * publicly-documented features as of writing; revalidate before launch.
 */

type Cell = "yes" | "no" | "partial" | string;

interface Row {
  feature: string;
  violethat: Cell;
  htb: Cell;
  thm: Cell;
  emphasis?: boolean;
}

const rows: Row[] = [
  {
    feature: "Free tier",
    violethat: "yes",
    htb: "partial",
    thm: "yes",
  },
  {
    feature: "Starting paid price",
    violethat: "₹ per challenge / monthly",
    htb: "$20 / mo",
    thm: "$14 / mo",
  },
  {
    feature: "In-browser IDE (C/C++)",
    violethat: "yes",
    htb: "no",
    thm: "no",
    emphasis: true,
  },
  {
    feature: "Live agent runner + streaming logs",
    violethat: "yes",
    htb: "no",
    thm: "no",
    emphasis: true,
  },
  {
    feature: "Detection-engineering focus",
    violethat: "yes",
    htb: "partial",
    thm: "partial",
    emphasis: true,
  },
  {
    feature: "Malware analysis / C-level labs",
    violethat: "yes",
    htb: "partial",
    thm: "partial",
  },
  {
    feature: "Beginner-friendly tracks",
    violethat: "yes",
    htb: "partial",
    thm: "yes",
  },
  {
    feature: "OSCP / CPTS prep tracks",
    violethat: "yes",
    htb: "yes",
    thm: "yes",
  },
  {
    feature: "Team / enterprise plans",
    violethat: "yes",
    htb: "yes",
    thm: "yes",
  },
  {
    feature: "Zero-install (no VPN, no VM)",
    violethat: "yes",
    htb: "no",
    thm: "partial",
    emphasis: true,
  },
];

function renderCell(value: Cell, ours: boolean) {
  if (value === "yes") {
    return (
      <span
        className={`inline-flex items-center justify-center w-7 h-7 rounded-full border ${
          ours
            ? "border-neon/40 bg-neon/10 text-neon"
            : "border-htb-border bg-htb-bg/40 text-htb-muted"
        }`}
        aria-label="Yes"
      >
        <Check className="w-4 h-4" />
      </span>
    );
  }
  if (value === "no") {
    return (
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-htb-border bg-htb-bg/40 text-htb-text-dim"
        aria-label="No"
      >
        <X className="w-4 h-4" />
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-warn/30 bg-warn/10 text-warn"
        aria-label="Partial"
      >
        <Minus className="w-4 h-4" />
      </span>
    );
  }
  // string value
  return (
    <span
      className={`font-mono text-xs sm:text-sm ${
        ours ? "text-neon font-semibold" : "text-htb-muted"
      }`}
    >
      {value}
    </span>
  );
}

export default function ComparisonTable() {
  return (
    <section
      id="compare"
      aria-labelledby="compare-heading"
      className="relative border-b border-htb-border bg-htb-bg py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <TerminalEyebrow className="justify-center inline-flex">
            compare.platforms
          </TerminalEyebrow>
          <h2
            id="compare-heading"
            className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text mt-3"
          >
            How does Violethat compare?
          </h2>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-4">
            Honest, side-by-side. Reviewed against the publicly-documented
            features of each platform at the time of writing.
          </p>
        </div>

        {/* Table */}
        <div className="panel overflow-hidden">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <caption className="sr-only">
                Feature comparison between Violethat, HackTheBox, and
                TryHackMe.
              </caption>
              <thead>
                <tr className="border-b border-htb-border bg-htb-bg/40">
                  <th
                    scope="col"
                    className="text-left px-4 sm:px-6 py-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="text-center px-4 sm:px-6 py-4 text-[11px] font-mono font-semibold uppercase tracking-widest text-neon"
                  >
                    Violethat
                  </th>
                  <th
                    scope="col"
                    className="text-center px-4 sm:px-6 py-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest"
                  >
                    HackTheBox
                  </th>
                  <th
                    scope="col"
                    className="text-center px-4 sm:px-6 py-4 text-[10px] font-mono font-semibold text-htb-muted uppercase tracking-widest"
                  >
                    TryHackMe
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.feature}
                    className={`border-t border-htb-border transition-colors hover:bg-neon/5 ${
                      row.emphasis ? "bg-neon/[0.03]" : ""
                    }`}
                  >
                    <th
                      scope="row"
                      className={`text-left px-4 sm:px-6 py-4 text-sm font-medium ${
                        row.emphasis ? "text-htb-text" : "text-htb-muted"
                      }`}
                    >
                      {row.feature}
                    </th>
                    <td className="text-center px-4 sm:px-6 py-4 bg-neon/[0.03]">
                      <div className="inline-flex items-center justify-center">
                        {renderCell(row.violethat, true)}
                      </div>
                    </td>
                    <td className="text-center px-4 sm:px-6 py-4">
                      <div className="inline-flex items-center justify-center">
                        {renderCell(row.htb, false)}
                      </div>
                    </td>
                    <td className="text-center px-4 sm:px-6 py-4">
                      <div className="inline-flex items-center justify-center">
                        {renderCell(row.thm, false)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom accent */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
        </div>

        {/* Legend + footnote */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <ul className="flex flex-wrap items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
            <li className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-neon/40 bg-neon/10 text-neon">
                <Check className="w-2.5 h-2.5" />
              </span>
              Yes
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-warn/30 bg-warn/10 text-warn">
                <Minus className="w-2.5 h-2.5" />
              </span>
              Partial
            </li>
            <li className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-htb-border bg-htb-bg/40 text-htb-text-dim">
                <X className="w-2.5 h-2.5" />
              </span>
              No
            </li>
          </ul>

          <p className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
            Reviewed {new Date().getFullYear()} · open a PR if anything looks
            wrong
          </p>
        </div>
      </div>
    </section>
  );
}

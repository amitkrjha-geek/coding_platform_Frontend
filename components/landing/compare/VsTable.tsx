import { Check, X, Minus } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

export type Cell = "yes" | "no" | "partial" | string;

export interface VsRow {
  feature: string;
  ours: Cell;
  theirs: Cell;
  emphasis?: boolean;
}

interface VsTableProps {
  competitor: string;
  rows: VsRow[];
  /** Optional eyebrow text (defaults to "feature.matrix") */
  eyebrow?: string;
  /** Optional heading (defaults to "Feature comparison") */
  heading?: string;
}

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

export default function VsTable({
  competitor,
  rows,
  eyebrow = "feature.matrix",
  heading = "Feature comparison",
}: VsTableProps) {
  return (
    <section
      aria-labelledby="vs-table-heading"
      className="relative border-b border-htb-border bg-htb-bg-deep py-16 sm:py-20"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-10">
          <TerminalEyebrow className="justify-center inline-flex">
            {eyebrow}
          </TerminalEyebrow>
          <h2
            id="vs-table-heading"
            className="heading-display text-2xl sm:text-3xl lg:text-4xl text-htb-text mt-3"
          >
            {heading}
          </h2>
        </div>

        <div className="panel overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <caption className="sr-only">
                Feature comparison between Violethat and {competitor}.
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
                    {competitor}
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
                        {renderCell(row.ours, true)}
                      </div>
                    </td>
                    <td className="text-center px-4 sm:px-6 py-4">
                      <div className="inline-flex items-center justify-center">
                        {renderCell(row.theirs, false)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
        </div>

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

import Link from "next/link";
import {
  Check,
  ShieldCheck,
  Building2,
  KeyRound,
  FileBarChart2,
  Users,
} from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

/**
 * Section 11 — For Teams / Enterprise band.
 * B2B conversion lane for team leads, hiring managers, CISOs.
 * Server Component, zero JS.
 */

const bullets = [
  {
    icon: KeyRound,
    title: "SSO & SCIM provisioning",
    body: "Okta, Azure AD, Google Workspace. Onboard and offboard with one click.",
  },
  {
    icon: Building2,
    title: "Custom private challenges",
    body: "Ship internal labs and scenarios your team will actually face — without exposing them publicly.",
  },
  {
    icon: FileBarChart2,
    title: "Compliance reporting",
    body: "Audit-ready exports of training completion, skill matrices, and time-on-task.",
  },
  {
    icon: Users,
    title: "Cohorts & assignments",
    body: "Group operators into squads, assign tracks, and benchmark progress against your hiring bar.",
  },
];

const trustBadges = [
  "SOC 2 in progress",
  "GDPR ready",
  "DPIIT Recognized",
  "EU data residency available",
];

export default function ForTeamsBand() {
  return (
    <section
      id="for-teams"
      aria-labelledby="for-teams-heading"
      className="relative border-b border-htb-border bg-htb-bg-deep py-20 sm:py-24 lg:py-28 overflow-hidden"
    >
      {/* Decorative corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-purple-600/10 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: pitch + bullets + CTA (7/12) */}
          <div className="lg:col-span-7 space-y-6">
            <TerminalEyebrow>for.teams</TerminalEyebrow>
            <h2
              id="for-teams-heading"
              className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text"
            >
              Build the cyber workforce your{" "}
              <span className="text-neon">CISO actually trusts.</span>
            </h2>
            <p className="text-htb-muted text-base sm:text-lg leading-relaxed max-w-2xl">
              Roll out a continuous training program for your SOC, detection,
              and IR teams — measurable, auditable, and aligned with the
              attacks you actually see.
            </p>

            <ul className="grid sm:grid-cols-2 gap-4 pt-2">
              {bullets.map((b) => (
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

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="mailto:violethat@violethat.com?subject=Teams%20demo%20request"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-neon text-white hover:bg-neon-green-dim hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold"
              >
                Talk to Sales
              </Link>
              <Link
                href="/billing"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
              >
                See team pricing
              </Link>
            </div>
          </div>

          {/* Right: trust card (5/12) */}
          <div className="lg:col-span-5">
            <div className="relative panel p-6 sm:p-7 shadow-panel-lg overflow-hidden">
              {/* Top accent */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />

              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md border border-neon/30 bg-neon/10 text-neon">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="terminal-eyebrow">trust.compliance</span>
                  <h3 className="text-base font-bold text-htb-text mt-0.5">
                    Built for procurement
                  </h3>
                </div>
              </div>

              <ul className="space-y-3 mb-5">
                {trustBadges.map((badge) => (
                  <li
                    key={badge}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-htb-border bg-htb-bg/40"
                  >
                    <Check className="w-4 h-4 text-neon shrink-0" />
                    <span className="text-sm text-htb-text font-mono uppercase tracking-wider">
                      {badge}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="rounded-md border border-neon/20 bg-neon/5 p-4">
                <div className="text-[10px] font-mono uppercase tracking-widest font-semibold text-neon mb-1.5">
                  Procurement-ready
                </div>
                <p className="text-xs text-htb-muted leading-relaxed">
                  DPA, SOC 2 questionnaire responses, and security review docs
                  available on request. Annual invoicing for teams of 10+.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

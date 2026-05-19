import { Quote } from "lucide-react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

/**
 * Section 12 — Testimonials.
 * Static 3-card grid (no carousel). Server Component.
 *
 * NOTE: Replace placeholders with REAL testimonials before launch —
 * fake quotes destroy AEO/E-E-A-T trust scores.
 * Mix recommended: 1 detection engineer / SOC analyst, 1 CISO or team lead,
 * 1 student/researcher.
 */

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  highlight?: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We finally have a place where my detection engineers can practice against real adversary TTPs without spinning up internal infra. The agent logs are gold for tuning rules.",
    author: "Sarah K.",
    role: "Detection Engineering Lead",
    company: "FinTech (US)",
    highlight: "real adversary TTPs",
  },
  {
    quote:
      "Browser-based C/C++ with a live agent runner is genuinely unique. I onboarded 12 SOC analysts in a week — zero install pain, zero VPN tickets.",
    author: "Marcus T.",
    role: "Director of Security Operations",
    company: "Healthcare Group",
    highlight: "zero install pain",
  },
  {
    quote:
      "Used Violethat to prep for my malware-research internship. The Detect-DB tracks taught me more in 6 weeks than two semesters of coursework.",
    author: "Priya V.",
    role: "CS Student / Security Researcher",
    company: "IIT Madras",
    highlight: "more in 6 weeks",
  },
];

function avatarColor(name: string) {
  // Stable hash-ish color picker per author for the initial circle
  const palette = [
    "from-purple-500/30 to-fuchsia-500/20",
    "from-sky-500/30 to-blue-500/20",
    "from-emerald-500/30 to-teal-500/20",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export default function TestimonialsGrid() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative border-b border-htb-border bg-htb-bg py-20 sm:py-24 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <TerminalEyebrow className="justify-center inline-flex">
            field.reports
          </TerminalEyebrow>
          <h2
            id="testimonials-heading"
            className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text mt-3"
          >
            What our operators are saying.
          </h2>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-4">
            Practitioners across detection, ops, and research — using Violethat
            in the wild.
          </p>
        </div>

        {/* Cards grid */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {testimonials.map((t) => (
            <li key={t.author}>
              <figure className="group relative h-full panel panel-hover p-6 sm:p-7 flex flex-col transition-all duration-300">
                {/* Decorative top accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quote icon */}
                <div className="mb-4">
                  <Quote
                    className="w-7 h-7 text-neon/60"
                    aria-hidden
                  />
                </div>

                {/* Quote text */}
                <blockquote className="flex-1">
                  <p className="text-sm sm:text-base text-htb-text leading-relaxed">
                    {t.highlight ? (
                      <>
                        {t.quote.split(t.highlight)[0]}
                        <span className="text-neon font-semibold">
                          {t.highlight}
                        </span>
                        {t.quote.split(t.highlight)[1]}
                      </>
                    ) : (
                      t.quote
                    )}
                  </p>
                </blockquote>

                {/* Author */}
                <figcaption className="mt-6 pt-5 border-t border-htb-border flex items-center gap-3">
                  <div
                    className={`shrink-0 flex items-center justify-center w-11 h-11 rounded-full border border-neon/30 bg-gradient-to-br ${avatarColor(
                      t.author,
                    )} text-neon font-mono text-sm font-bold`}
                    aria-hidden
                  >
                    {t.author.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-htb-text text-sm truncate">
                      {t.author}
                    </div>
                    <div className="text-xs text-htb-muted truncate">
                      {t.role}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim mt-0.5 truncate">
                      {t.company}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

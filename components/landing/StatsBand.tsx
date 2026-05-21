import StatCounter from "@/components/shared/StatCounter";

/**
 * Section 9 — Stats Band
 *
 * Full-width dark band with 4 huge mono numerals.
 * Numerals use <StatCounter/> (Phase 1 helper) — counts up once on first
 * viewport entry, then sits static.
 *
 * NOTE: numbers are placeholders. Replace with real metrics before launch.
 */

const stats = [
  { value: 850, label: "Challenges", suffix: "+" },
  { value: 120000, label: "Operators", suffix: "+" },
  { value: 4200000, label: "Flags captured", suffix: "+" },
  { value: 99.99, label: "Platform uptime", suffix: "%" },
];

export default function StatsBand() {
  return (
    <section
      aria-label="Platform statistics"
      className="relative border-b border-htb-border bg-htb-bg-deep py-14 sm:py-16 lg:py-20"
    >
      {/* Top/bottom hairline accents */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="flex flex-col items-center text-center"
            >
              <StatCounter
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
                valueClassName="text-3xl sm:text-4xl lg:text-5xl text-neon"
                labelClassName="text-htb-muted mt-2"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

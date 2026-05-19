import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  MapPin,
  Mail,
  Target,
  Users,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
  Linkedin,
  Briefcase,
  Quote,
} from "lucide-react";
import GridBackground from "@/components/shared/GridBackground";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";
import FinalCTA from "@/components/landing/FinalCTA";
import { SITE_URL } from "@/components/landing/pricing-data";

const TITLE = "About Violethat";
const DESCRIPTION =
  "Violethat is a hands-on cybersecurity training platform founded by practitioners, headquartered in Goa, India, and recognized by DPIIT. Built for detection engineers, blue teamers, and security researchers worldwide.";

const FOUNDER = {
  name: "Kartik Durg",
  role: "Founder · Violethat",
  image: "/kartik-durg.avif",
  twitter: "https://x.com/KartikDurg",
  linkedin: "https://www.linkedin.com/in/iamr00t",
  expertise: [
    "Malware Analysis",
    "Adversary Simulation",
    "AI Security",
    "Detection Engineering",
    "Reverse Engineering",
  ],
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
    type: "profile",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const pillars = [
  {
    icon: Target,
    title: "Built for the work, not the demo",
    body: "Every feature is built around real practitioner workflows — write code, run the agent, capture the flag. No theatre.",
  },
  {
    icon: Users,
    title: "Practitioners first",
    body: "Our team has hands-on backgrounds in detection engineering, malware research, and offensive security. We build the platform we wished we had.",
  },
  {
    icon: Lightbulb,
    title: "Honest by default",
    body: "Public pricing, honest comparisons, real testimonials. We do not hide the trade-offs or fake the numbers.",
  },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function AboutJsonLd() {
  const url = `${SITE_URL}/about`;
  const today = new Date().toISOString().slice(0, 10);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "AboutPage",
      "@id": `${url}#webpage`,
      url,
      name: TITLE,
      description: DESCRIPTION,
      datePublished: "2026-01-01",
      dateModified: today,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About", item: url },
      ],
    },
    {
      "@type": "Person",
      "@id": `${url}#founder`,
      name: FOUNDER.name,
      givenName: "Kartik",
      familyName: "Durg",
      jobTitle: "Founder",
      description:
        "Founder of Violethat with 9+ years in cybersecurity spanning malware analysis, adversary simulation, reverse engineering, AI security, and detection engineering. Creator of the original Detect-DB research repository.",
      image: `${SITE_URL}${FOUNDER.image}`,
      url: `${SITE_URL}/about`,
      sameAs: [FOUNDER.twitter, FOUNDER.linkedin],
      worksFor: { "@id": `${SITE_URL}/#organization` },
      founder: { "@id": `${SITE_URL}/#organization` },
      nationality: { "@type": "Country", name: "India" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Goa",
        addressCountry: "IN",
      },
      knowsAbout: FOUNDER.expertise,
      knowsLanguage: ["en"],
      hasOccupation: {
        "@type": "Occupation",
        name: "Cybersecurity Researcher & Founder",
        occupationalCategory: "15-1212.00",
        skills: FOUNDER.expertise.join(", "),
        experienceRequirements: "9+ years in cybersecurity",
      },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Recognition",
        name: "DPIIT Recognized Founder",
        recognizedBy: {
          "@type": "GovernmentOrganization",
          name: "Department for Promotion of Industry and Internal Trade, Government of India",
        },
      },
    },
  ];
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutJsonLd />

      {/* Hero */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative overflow-hidden border-b border-htb-border pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20"
      >
        <GridBackground variant="neon" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <TerminalEyebrow className="justify-center inline-flex">
            about.violethat
          </TerminalEyebrow>
          <h1
            id="about-hero-heading"
            className="heading-display text-3xl sm:text-5xl lg:text-6xl text-htb-text mt-4"
          >
            We are building the{" "}
            <span className="text-neon">playground we always wanted.</span>
          </h1>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-5 max-w-2xl mx-auto">
            Violethat started as <em>Detect-DB</em> — a private research
            repository for detection engineers. Today it is a hands-on training
            platform with a browser IDE, a live agent runner, and a growing
            community of operators worldwide.
          </p>

          {/* Trust ribbon */}
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-8">
            <li className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-htb-muted">
              <Award className="w-4 h-4 text-neon" /> DPIIT Recognized
            </li>
            <li className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-htb-muted">
              <MapPin className="w-4 h-4 text-neon" /> Goa, India
            </li>
            <li className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-htb-muted">
              <ShieldCheck className="w-4 h-4 text-neon" /> Built by
              practitioners
            </li>
          </ul>
        </div>
      </section>

      {/* Mission */}
      <section
        aria-labelledby="mission-heading"
        className="relative border-b border-htb-border bg-htb-bg-deep py-16 sm:py-20"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <TerminalEyebrow className="justify-center inline-flex">
              mission
            </TerminalEyebrow>
            <h2
              id="mission-heading"
              className="heading-display text-2xl sm:text-3xl lg:text-4xl text-htb-text mt-3"
            >
              Know Your Defense. Train Your Offense.
            </h2>
            <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-4">
              We exist to close the gap between learning security theory and
              actually doing the work. The way to learn detection is to write
              the attack. The way to learn offense is to see the trace.
              Violethat lets you do both, in the same browser tab.
            </p>
          </div>

          {/* Pillars */}
          <ul className="grid sm:grid-cols-3 gap-5">
            {pillars.map((p) => (
              <li key={p.title} className="panel panel-hover p-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-md border border-neon/30 bg-neon/10 text-neon mb-4">
                  <p.icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-htb-text">
                  {p.title}
                </h3>
                <p className="text-xs text-htb-muted leading-relaxed mt-2">
                  {p.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Founder — refined */}
      <section
        aria-labelledby="founder-heading"
        className="relative border-b border-htb-border bg-htb-bg py-16 sm:py-20 lg:py-24"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <TerminalEyebrow className="justify-center inline-flex">
              the.founder
            </TerminalEyebrow>
            <h2
              id="founder-heading"
              className="heading-display text-2xl sm:text-3xl lg:text-4xl text-htb-text mt-3"
            >
              Built by a <span className="text-neon">practitioner</span>.
            </h2>
            <p className="text-htb-muted text-sm sm:text-base leading-relaxed mt-3 max-w-2xl mx-auto">
              Not a marketing team. Not a course aggregator. One engineer who
              kept getting asked the same question — and decided to answer it
              with a platform.
            </p>
          </div>

          <article className="relative panel p-6 sm:p-8 lg:p-10 overflow-hidden">
            {/* Subtle glow accent */}
            <div
              aria-hidden
              className="absolute -top-24 -right-24 w-72 h-72 bg-radial-glow opacity-40 pointer-events-none"
            />

            <div className="relative grid md:grid-cols-[200px_minmax(0,1fr)] gap-8 items-start">
              {/* Photo + meta column */}
              <div className="flex md:flex-col items-center md:items-start gap-5">
                <div className="relative shrink-0">
                  <div
                    aria-hidden
                    className="absolute -inset-1 rounded-lg bg-gradient-to-br from-neon/40 via-neon/10 to-transparent blur-sm"
                  />
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden border border-neon/30 bg-htb-bg-deep">
                    <Image
                      src={FOUNDER.image}
                      alt={`Portrait of ${FOUNDER.name}, Founder of Violethat`}
                      fill
                      sizes="(min-width: 768px) 160px, 128px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Stats stack — visible on md+ */}
                <dl className="hidden md:block w-full space-y-3 mt-2">
                  <div className="panel p-3">
                    <dt className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
                      Experience
                    </dt>
                    <dd className="text-base font-semibold text-htb-text mt-1">
                      9+ years
                    </dd>
                  </div>
                  <div className="panel p-3">
                    <dt className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
                      Based in
                    </dt>
                    <dd className="text-base font-semibold text-htb-text mt-1">
                      Goa, IN
                    </dd>
                  </div>
                </dl>

                {/* Inline name/role for mobile */}
                <div className="md:hidden flex flex-col items-start gap-1">
                  <p className="text-lg font-bold text-htb-text">
                    {FOUNDER.name}
                  </p>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-neon">
                    {FOUNDER.role}
                  </p>
                </div>
              </div>

              {/* Bio column */}
              <div className="min-w-0">
                <div className="hidden md:block">
                  <h3 className="text-2xl font-bold text-htb-text">
                    {FOUNDER.name}
                  </h3>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-neon mt-1">
                    {FOUNDER.role}
                  </p>
                </div>

                {/* Credentials strip */}
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 md:mt-3">
                  <li className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-htb-muted">
                    <Briefcase className="w-3.5 h-3.5 text-neon" /> 9+ yrs in
                    Cybersecurity
                  </li>
                  <li className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-htb-muted">
                    <Award className="w-3.5 h-3.5 text-neon" /> DPIIT Founder
                  </li>
                </ul>

                {/* Bio paragraphs */}
                <div className="space-y-4 mt-5 text-sm sm:text-[15px] leading-relaxed text-htb-muted">
                  <p>
                    Kartik has spent the last decade deep in the trenches of
                    cybersecurity — reverse-engineering malware, simulating
                    real-world adversaries, and more recently pushing the
                    boundaries of AI security research. He has worked on the
                    kind of problems that do not make it into textbooks: novel
                    evasion techniques, detection gaps in production EDR
                    stacks, and the messy reality of defending real
                    environments.
                  </p>
                  <p>
                    Violethat was born from a simple, recurring frustration. As
                    detection engineers reached out asking <em>where can I
                    actually practice this for real?</em> the honest answer was:
                    nowhere good enough. So he built it.
                  </p>
                  <p>
                    The original{" "}
                    <strong className="text-htb-text">Detect-DB</strong>{" "}
                    research repository is now integrated into the Violethat
                    challenge catalog — so practitioners can move from reading
                    about a TTP to executing it in the same session.
                  </p>
                </div>

                {/* Expertise tags */}
                <div className="mt-6">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim mb-3">
                    Areas of expertise
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {FOUNDER.expertise.map((tag) => (
                      <li
                        key={tag}
                        className="px-2.5 py-1 rounded border border-htb-border bg-htb-bg-deep text-[11px] font-mono text-htb-muted hover:border-neon/40 hover:text-neon transition-colors"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quote */}
                <blockquote className="relative mt-7 pl-5 border-l-2 border-neon/40">
                  <Quote
                    aria-hidden
                    className="absolute -top-1 -left-2 w-3.5 h-3.5 text-neon/60 bg-htb-panel"
                  />
                  <p className="text-sm sm:text-base text-htb-text italic leading-relaxed">
                    The best way to learn detection is to write the attack. The
                    best way to learn offense is to see the trace.
                  </p>
                  <footer className="mt-2 text-[11px] font-mono uppercase tracking-widest text-htb-text-dim">
                    — {FOUNDER.name}
                  </footer>
                </blockquote>

                {/* Social links */}
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={FOUNDER.twitter}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${FOUNDER.name} on X (Twitter)`}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-md border border-htb-border bg-htb-bg-deep text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-[11px] uppercase tracking-widest"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                    Follow on X
                    <ArrowRight className="w-3 h-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  </a>
                  <a
                    href={FOUNDER.linkedin}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${FOUNDER.name} on LinkedIn`}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-md border border-htb-border bg-htb-bg-deep text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-[11px] uppercase tracking-widest"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    Connect on LinkedIn
                    <ArrowRight className="w-3 h-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Company facts */}
      <section
        aria-labelledby="company-heading"
        className="relative border-b border-htb-border bg-htb-bg-deep py-16 sm:py-20"
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <TerminalEyebrow className="justify-center inline-flex">
              company.facts
            </TerminalEyebrow>
            <h2
              id="company-heading"
              className="heading-display text-2xl sm:text-3xl lg:text-4xl text-htb-text mt-3"
            >
              The basics.
            </h2>
          </div>

          <dl className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {[
              { label: "Legal entity", value: "VioletHat Infosec Pvt. Ltd." },
              { label: "Headquarters", value: "Goa, India" },
              { label: "Founded", value: "2024" },
              { label: "DPIIT Recognition", value: "DIPP179766" },
              { label: "Contact", value: "violethat@violethat.com" },
              { label: "Status", value: "Bootstrapped & operating" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-4 panel p-4"
              >
                <dt className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim">
                  {f.label}
                </dt>
                <dd className="text-sm font-medium text-htb-text text-right truncate">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Contact CTA */}
          <div className="text-center mt-10">
            <Link
              href="mailto:violethat@violethat.com"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-md border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Get in touch</span>
              <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA reuse */}
      <FinalCTA />
    </>
  );
}

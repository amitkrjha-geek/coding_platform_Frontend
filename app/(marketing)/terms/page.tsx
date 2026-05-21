import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Mail, ArrowRight } from "lucide-react";
import GridBackground from "@/components/shared/GridBackground";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";
import { SITE_URL } from "@/components/landing/pricing-data";

const TITLE = "Terms of Use";
const DESCRIPTION =
  "The Terms of Use governing your access to and use of the Violethat platform, operated by VioletHat Infosec Private Limited.";
const LAST_UPDATED = "Tuesday 21 May 2024";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/terms",
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

function TermsJsonLd() {
  const url = `${SITE_URL}/terms`;
  const today = new Date().toISOString().slice(0, 10);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: TITLE,
      description: DESCRIPTION,
      datePublished: "2024-05-21",
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
        { "@type": "ListItem", position: 2, name: "Terms of Use", item: url },
      ],
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

const sections: { id: string; n: string; title: string }[] = [
  { id: "agreement", n: "1", title: "Agreement to Terms" },
  { id: "representations", n: "2", title: "User Representations" },
  { id: "conduct", n: "3", title: "User Conduct" },
  { id: "services", n: "4", title: "Services" },
  { id: "accounts", n: "5", title: "User Registration & Accounts" },
  { id: "payments", n: "6", title: "Payments & Fees" },
  { id: "ip", n: "7", title: "Intellectual Property Rights" },
  { id: "security", n: "8", title: "Platform Security" },
  { id: "submissions", n: "9", title: "Submissions" },
  { id: "management", n: "10", title: "Site Management" },
  { id: "privacy", n: "11", title: "Privacy Policy" },
  { id: "term", n: "12", title: "Term and Termination" },
  { id: "law", n: "13", title: "Governing Law" },
  { id: "dispute", n: "14", title: "Dispute Resolution" },
  { id: "indemnification", n: "15", title: "Indemnification" },
  { id: "modifications", n: "16", title: "Modifications" },
  { id: "miscellaneous", n: "17", title: "Miscellaneous" },
  { id: "contact", n: "18", title: "Contact Us" },
];

export default function TermsPage() {
  return (
    <>
      <TermsJsonLd />

      {/* Hero */}
      <section
        aria-labelledby="terms-hero-heading"
        className="relative overflow-hidden border-b border-htb-border pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16"
      >
        <GridBackground variant="neon" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <TerminalEyebrow className="justify-center inline-flex">
            legal.terms
          </TerminalEyebrow>
          <h1
            id="terms-hero-heading"
            className="heading-display text-3xl sm:text-5xl lg:text-6xl text-htb-text mt-4"
          >
            Terms of <span className="text-neon">Use</span>
          </h1>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-5 max-w-2xl mx-auto">
            Please read these terms carefully before using the Violethat
            platform. By accessing or using the Services, you agree to be bound
            by them.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-6 text-[11px] font-mono uppercase tracking-widest text-htb-muted">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-neon" /> Last updated:{" "}
              {LAST_UPDATED}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="relative bg-htb-bg py-14 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-10 lg:gap-14">
            {/* TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 panel p-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim mb-4">
                  Contents
                </p>
                <ul className="space-y-2">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block text-xs text-htb-muted hover:text-neon transition-colors leading-snug"
                      >
                        <span className="font-mono text-htb-text-dim mr-2">
                          {s.n}.
                        </span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Content */}
            <article className="prose-legal max-w-none text-htb-muted text-sm sm:text-[15px] leading-relaxed space-y-12">
              <Section id="agreement" n="1" title="Agreement to Terms">
                <p>
                  These Terms of Use constitute a legally binding agreement made
                  between you, whether personally or on behalf of an entity
                  (&ldquo;you&rdquo;) and{" "}
                  <strong className="text-htb-text">
                    VioletHat Infosec Private Limited
                  </strong>{" "}
                  (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
                  or &ldquo;our&rdquo;), concerning your access to and use of
                  the Violethat platform, including any related applications,
                  services, or content (collectively, the
                  &ldquo;Services&rdquo;).
                </p>
                <p>
                  You agree that by accessing the Services, you have read,
                  understood, and agree to be bound by all of these Terms of
                  Use. If you do not agree with all of these Terms of Use, then
                  you are expressly prohibited from using the Services and you
                  must discontinue use immediately.
                </p>
              </Section>

              <Section id="representations" n="2" title="User Representations">
                <p>
                  By using the Services, you represent and warrant that:
                  (1)&nbsp;all registration information you submit will be true,
                  accurate, current, and complete; (2)&nbsp;you will maintain
                  the accuracy of such information and promptly update such
                  registration information as necessary; (3)&nbsp;you have the
                  legal capacity and you agree to comply with these Terms of
                  Use; (4)&nbsp;you are not a minor in the jurisdiction in which
                  you reside; (5)&nbsp;you will not access the Services through
                  automated or non-human means, whether through a bot, script
                  or otherwise, except as expressly permitted; (6)&nbsp;you
                  will not use the Services for any illegal or unauthorized
                  purpose; and (7)&nbsp;your use of the Services will not
                  violate any applicable law or regulation.
                </p>
              </Section>

              <Section id="conduct" n="3" title="User Conduct">
                <p>
                  You agree not to engage in any of the following prohibited
                  activities while using the Services:
                </p>
                <ul>
                  <li>
                    Attempt to disrupt, compromise, or gain unauthorized access
                    to any part of the platform, its infrastructure, or other
                    users&rsquo; accounts.
                  </li>
                  <li>
                    Use the platform to develop, distribute, or deploy malicious
                    software outside of the controlled sandboxed challenge
                    environments provided by Violethat.
                  </li>
                  <li>
                    Reverse engineer, decompile, or otherwise attempt to derive
                    the source code of the platform, except as expressly
                    permitted by applicable law.
                  </li>
                  <li>
                    Share, sell, sublicense, or otherwise distribute challenge
                    content, solutions, writeups, or platform materials outside
                    the Services without express written permission.
                  </li>
                  <li>
                    Use the Services in any manner that could disable,
                    overburden, damage, or impair the Services, or interfere
                    with any other party&rsquo;s use of the Services.
                  </li>
                </ul>
              </Section>

              <Section id="services" n="4" title="Services">
                <p>
                  Violethat provides a hands-on cybersecurity training platform
                  that includes a browser-based code editor, a sandboxed agent
                  runner, curated coding challenges, and supporting learning
                  materials. The Services may evolve over time, and we reserve
                  the right to add, remove, or modify features at our
                  discretion.
                </p>
              </Section>

              <Section
                id="accounts"
                n="5"
                title="User Registration & Accounts"
              >
                <p>
                  You may be required to register to use certain Services. You
                  agree to keep your password confidential and will be
                  responsible for all use of your account and password. We
                  reserve the right to remove, reclaim, or change a username you
                  select if we determine, in our sole discretion, that such
                  username is inappropriate, obscene, or otherwise
                  objectionable.
                </p>
              </Section>

              <Section id="payments" n="6" title="Payments & Fees">
                <p>
                  Certain features of the Services are offered on a paid basis,
                  including individual coding challenges and challenge bundles.
                  By purchasing a paid offering, you agree to pay the
                  applicable fees as displayed at the time of purchase. All
                  fees are stated in the currency indicated and are exclusive
                  of any applicable taxes unless stated otherwise.
                </p>
                <p>
                  Our current pricing model is based on one-time payments for
                  individual challenges or challenge bundles rather than
                  recurring billing. Once purchased, paid items are generally
                  non-refundable except where required by applicable law.
                </p>
              </Section>

              <Section
                id="ip"
                n="7"
                title="Intellectual Property Rights"
              >
                <p>
                  Unless otherwise indicated, the Services and all source code,
                  databases, functionality, software, website designs, audio,
                  video, text, photographs, and graphics on the platform
                  (collectively, the &ldquo;Content&rdquo;) and the trademarks,
                  service marks, and logos contained therein (the
                  &ldquo;Marks&rdquo;) are owned or controlled by us or
                  licensed to us, and are protected by copyright and trademark
                  laws and various other intellectual property rights and
                  unfair competition laws.
                </p>
                <p>
                  The Content and Marks are provided on the Services &ldquo;AS
                  IS&rdquo; for your information and personal use only. Except
                  as expressly provided in these Terms of Use, no part of the
                  Services and no Content or Marks may be copied, reproduced,
                  aggregated, republished, uploaded, posted, publicly
                  displayed, encoded, translated, transmitted, distributed,
                  sold, licensed, or otherwise exploited for any commercial
                  purpose whatsoever, without our express prior written
                  permission.
                </p>
              </Section>

              <Section id="security" n="8" title="Platform Security">
                <p>
                  All challenge code is executed inside isolated, sandboxed
                  environments. You are responsible for ensuring that any code
                  you write, run, or submit through the platform does not
                  attempt to attack, probe, or interfere with systems or
                  infrastructure outside the designated challenge environment.
                  Any attempt to do so will result in termination of your
                  account and may be reported to the appropriate authorities.
                </p>
              </Section>

              <Section id="submissions" n="9" title="Submissions">
                <p>
                  You acknowledge and agree that any questions, comments,
                  suggestions, ideas, feedback, or other information regarding
                  the Services (&ldquo;Submissions&rdquo;) provided by you to
                  us are non-confidential and shall become our sole property.
                  We shall own exclusive rights, including all intellectual
                  property rights, and shall be entitled to the unrestricted
                  use and dissemination of these Submissions for any lawful
                  purpose, commercial or otherwise, without acknowledgment or
                  compensation to you.
                </p>
              </Section>

              <Section id="management" n="10" title="Site Management">
                <p>
                  We reserve the right, but not the obligation, to: (1)&nbsp;
                  monitor the Services for violations of these Terms of Use;
                  (2)&nbsp;take appropriate legal action against anyone who, in
                  our sole discretion, violates the law or these Terms of Use;
                  (3)&nbsp;refuse, restrict access to, limit the availability
                  of, or disable (to the extent technologically feasible) any
                  of your contributions or any portion thereof; and (4)&nbsp;
                  otherwise manage the Services in a manner designed to protect
                  our rights and property and to facilitate the proper
                  functioning of the Services.
                </p>
              </Section>

              <Section id="privacy" n="11" title="Privacy Policy">
                <p>
                  We care about data privacy and security. Please review our{" "}
                  <Link
                    href="/privacy"
                    className="text-neon hover:text-neon-green-dim font-semibold transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  . By using the Services, you agree to be bound by our Privacy
                  Policy, which is incorporated into these Terms of Use.
                </p>
              </Section>

              <Section id="term" n="12" title="Term and Termination">
                <p>
                  These Terms of Use shall remain in full force and effect
                  while you use the Services. Without limiting any other
                  provision of these Terms of Use, we reserve the right to, in
                  our sole discretion and without notice or liability, deny
                  access to and use of the Services to any person for any
                  reason or for no reason, including without limitation for
                  breach of any representation, warranty, or covenant contained
                  in these Terms of Use or of any applicable law or regulation.
                </p>
              </Section>

              <Section id="law" n="13" title="Governing Law">
                <p>
                  These Terms of Use and your use of the Services are governed
                  by and construed in accordance with the laws of India
                  applicable to agreements made and to be entirely performed
                  within India, without regard to its conflict of law
                  principles.
                </p>
              </Section>

              <Section id="dispute" n="14" title="Dispute Resolution">
                <p>
                  Any legal action of whatever nature brought by either you or
                  us shall be commenced or prosecuted in the courts located in
                  Goa, India, and you and we hereby consent to, and waive all
                  defenses of lack of personal jurisdiction and forum non
                  conveniens with respect to venue and jurisdiction in such
                  courts.
                </p>
              </Section>

              <Section id="indemnification" n="15" title="Indemnification">
                <p>
                  You agree to defend, indemnify, and hold us harmless,
                  including our subsidiaries, affiliates, and all of our
                  respective officers, agents, partners, and employees, from
                  and against any loss, damage, liability, claim, or demand,
                  including reasonable attorneys&rsquo; fees and expenses, made
                  by any third party due to or arising out of: (1)&nbsp;your
                  use of the Services; (2)&nbsp;breach of these Terms of Use;
                  (3)&nbsp;any breach of your representations and warranties
                  set forth in these Terms of Use; or (4)&nbsp;your violation
                  of the rights of a third party.
                </p>
              </Section>

              <Section id="modifications" n="16" title="Modifications">
                <p>
                  We reserve the right, in our sole discretion, to make changes
                  or modifications to these Terms of Use at any time and for
                  any reason. We will alert you about any changes by updating
                  the &ldquo;Last updated&rdquo; date of these Terms of Use,
                  and you waive any right to receive specific notice of each
                  such change. It is your responsibility to periodically review
                  these Terms of Use to stay informed of updates.
                </p>
              </Section>

              <Section id="miscellaneous" n="17" title="Miscellaneous">
                <p>
                  These Terms of Use and any policies or operating rules posted
                  by us on the Services constitute the entire agreement and
                  understanding between you and us. Our failure to exercise or
                  enforce any right or provision of these Terms of Use shall
                  not operate as a waiver of such right or provision. If any
                  provision or part of a provision of these Terms of Use is
                  determined to be unlawful, void, or unenforceable, that
                  provision or part of the provision is deemed severable from
                  these Terms of Use and does not affect the validity and
                  enforceability of any remaining provisions.
                </p>
              </Section>

              <Section id="contact" n="18" title="Contact Us">
                <p>
                  In order to resolve a complaint regarding the Services or to
                  receive further information regarding use of the Services,
                  please contact us at:
                </p>
                <div className="not-prose panel p-5 mt-4 space-y-2">
                  <p className="text-htb-text font-semibold text-sm">
                    VioletHat Infosec Private Limited
                  </p>
                  <p className="text-sm text-htb-muted">
                    House 731, Pinto Heritage Villa, Dmello Vaddo, Anjuna,
                    Goa-403509, India
                  </p>
                  <p className="text-sm">
                    <a
                      href="mailto:violethat@violethat.com"
                      className="text-neon hover:text-neon-green-dim font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      violethat@violethat.com
                    </a>
                  </p>
                </div>
              </Section>

              {/* Back to top / cross-link */}
              <div className="pt-6 border-t border-htb-border flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/privacy"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-md border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
                >
                  Read the Privacy Policy
                  <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </Link>
                <a
                  href="#terms-hero-heading"
                  className="text-[11px] font-mono uppercase tracking-widest text-htb-text-dim hover:text-neon transition-colors"
                >
                  ↑ Back to top
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="heading-display text-xl sm:text-2xl text-htb-text mb-4 flex items-baseline gap-3">
        <span className="font-mono text-sm text-neon">{n}.</span>
        <span>{title}</span>
      </h2>
      <div className="space-y-4 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline [&_a]:decoration-neon/40 hover:[&_a]:decoration-neon">
        {children}
      </div>
    </section>
  );
}

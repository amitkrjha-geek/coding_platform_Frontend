import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Mail, ArrowRight } from "lucide-react";
import GridBackground from "@/components/shared/GridBackground";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";
import { SITE_URL } from "@/components/landing/pricing-data";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "How VioletHat Infosec Private Limited collects, uses, retains, shares, and protects your personal information when you use the Violethat platform.";
const LAST_UPDATED = "Tuesday 13 February 2024";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/privacy",
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

function PrivacyJsonLd() {
  const url = `${SITE_URL}/privacy`;
  const today = new Date().toISOString().slice(0, 10);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: TITLE,
      description: DESCRIPTION,
      datePublished: "2024-02-13",
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
        { "@type": "ListItem", position: 2, name: "Privacy Policy", item: url },
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
  { id: "collection", n: "1", title: "Personal Data We Collect" },
  { id: "usage-data", n: "2", title: "Usage Data" },
  { id: "sources", n: "3", title: "Sources of Personal Information" },
  { id: "use", n: "4", title: "How We Use Your Personal Information" },
  { id: "retention", n: "5", title: "Retention of Personal Information" },
  { id: "sharing", n: "6", title: "Sharing of Personal Information" },
  { id: "storage", n: "7", title: "Storage of Personal Information" },
  { id: "legal-basis", n: "8", title: "Legal Basis for Processing" },
  { id: "cookies", n: "9", title: "Cookies" },
  { id: "marketing", n: "10", title: "Marketing & Preferences" },
  { id: "social", n: "11", title: "Social Media Email Connect" },
  { id: "children", n: "12", title: "Children's Privacy" },
  { id: "security", n: "13", title: "Security & Data Deletion" },
  { id: "rights", n: "14", title: "Your Rights" },
  { id: "third-party", n: "15", title: "Third Party Sharing" },
  { id: "changes", n: "16", title: "Changes to this Policy" },
  { id: "contact", n: "17", title: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <>
      <PrivacyJsonLd />

      {/* Hero */}
      <section
        aria-labelledby="privacy-hero-heading"
        className="relative overflow-hidden border-b border-htb-border pt-24 pb-12 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16"
      >
        <GridBackground variant="neon" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <TerminalEyebrow className="justify-center inline-flex">
            legal.privacy
          </TerminalEyebrow>
          <h1
            id="privacy-hero-heading"
            className="heading-display text-3xl sm:text-5xl lg:text-6xl text-htb-text mt-4"
          >
            Privacy <span className="text-neon">Policy</span>
          </h1>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-5 max-w-2xl mx-auto">
            We respect your privacy. This policy explains what personal
            information we collect when you use the Violethat platform, how we
            use it, and the choices you have.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-6 text-[11px] font-mono uppercase tracking-widest text-htb-muted">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon" /> Last updated:{" "}
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
              <p className="text-htb-muted">
                This Privacy Policy describes how{" "}
                <strong className="text-htb-text">
                  VioletHat Infosec Private Limited
                </strong>{" "}
                (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
                collects, uses, and shares personal information when you use
                the Violethat platform, our website, and related services
                (collectively, the &ldquo;Services&rdquo;).
              </p>

              <Section id="collection" n="1" title="Personal Data We Collect">
                <p>
                  We collect personal information that you voluntarily provide
                  to us when you register on the Services, express an interest
                  in obtaining information about us or our products and
                  Services, when you participate in activities on the Services,
                  or otherwise when you contact us. The personal information we
                  collect may include the following:
                </p>
                <ul>
                  <li>Name, username, and contact details</li>
                  <li>Email address</li>
                  <li>Authentication credentials</li>
                  <li>
                    Billing information (processed by our payment processors;
                    we do not store full card numbers)
                  </li>
                  <li>
                    Profile preferences and information you submit through
                    challenges
                  </li>
                </ul>
              </Section>

              <Section id="usage-data" n="2" title="Usage Data">
                <p>
                  We automatically collect certain information when you visit,
                  use, or navigate the Services. This information does not
                  reveal your specific identity but may include device and
                  usage information, such as your IP address, browser and
                  device characteristics, operating system, language
                  preferences, referring URLs, device name, country, location,
                  information about how and when you use our Services, and
                  other technical information.
                </p>
              </Section>

              <Section id="sources" n="3" title="Sources of Personal Information">
                <p>
                  We collect personal information directly from you when you
                  voluntarily provide it, automatically when you use the
                  Services, and from third-party services you connect to your
                  account (such as authentication providers).
                </p>
              </Section>

              <Section
                id="use"
                n="4"
                title="How We Use Your Personal Information"
              >
                <p>
                  We use the personal information collected via our Services
                  for a variety of business purposes, including to:
                </p>
                <ul>
                  <li>Facilitate account creation and the login process</li>
                  <li>Manage user accounts and provide the Services</li>
                  <li>
                    Send administrative information, including updates to our
                    terms, conditions, and policies
                  </li>
                  <li>Fulfill and manage your orders and payments</li>
                  <li>
                    Respond to user inquiries and offer support to users
                  </li>
                  <li>
                    Send you marketing and promotional communications, where
                    permitted and subject to your preferences
                  </li>
                  <li>
                    Protect the security and integrity of the Services and
                    investigate misuse
                  </li>
                  <li>Comply with our legal obligations</li>
                </ul>
              </Section>

              <Section
                id="retention"
                n="5"
                title="Retention of Personal Information"
              >
                <p>
                  We will only keep your personal information for as long as it
                  is necessary for the purposes set out in this Privacy Policy,
                  unless a longer retention period is required or permitted by
                  law (such as tax, accounting, or other legal requirements).
                </p>
              </Section>

              <Section
                id="sharing"
                n="6"
                title="Sharing of Personal Information"
              >
                <p>
                  We may process or share your data based on the following
                  legal bases: consent, legitimate interests, performance of a
                  contract, legal obligations, and vital interests. More
                  specifically, we may share data with service providers,
                  business partners, affiliates, and in connection with
                  business transfers (such as a merger, sale of assets, or
                  acquisition).
                </p>
              </Section>

              <Section
                id="storage"
                n="7"
                title="Storage of Personal Information"
              >
                <p>
                  Your information may be stored on servers located inside or
                  outside your country of residence. Wherever we store
                  personal information, we take reasonable steps to protect it
                  in accordance with applicable laws.
                </p>
              </Section>

              <Section
                id="legal-basis"
                n="8"
                title="Legal Basis for Processing"
              >
                <p>
                  We rely on the following legal bases to process your
                  personal information: (1)&nbsp;your consent; (2)&nbsp;the
                  performance of a contract with you; (3)&nbsp;compliance with
                  a legal obligation; and (4)&nbsp;our legitimate interests in
                  operating, securing, and improving the Services, balanced
                  against your rights and interests.
                </p>
              </Section>

              <Section id="cookies" n="9" title="Cookies">
                <p>
                  We may use cookies and similar tracking technologies (like
                  web beacons and pixels) to access or store information.
                  Cookies help us understand how the Services are used,
                  authenticate users, remember preferences, and improve the
                  overall experience. You can choose to disable cookies
                  through your individual browser options.
                </p>
              </Section>

              <Section id="marketing" n="10" title="Marketing & Preferences">
                <p>
                  If we send you marketing communications, you can opt out at
                  any time by clicking the unsubscribe link in the email or by
                  contacting us. Note that you may still receive transactional
                  or service-related communications even if you opt out of
                  marketing.
                </p>
              </Section>

              <Section
                id="social"
                n="11"
                title="Social Media Email Connect"
              >
                <p>
                  If you choose to register or log in to our Services using a
                  third-party social media account (for example, Google), we
                  will receive certain profile information about you from your
                  social media provider. The profile information we receive
                  may vary depending on the social media provider concerned,
                  but will often include your name and email address.
                </p>
              </Section>

              <Section id="children" n="12" title="Children's Privacy">
                <p>
                  Our Services are not directed to individuals under the age of
                  18, and we do not knowingly collect personal information from
                  children. If we become aware that a child has provided us
                  with personal information without verified parental consent,
                  we will take steps to delete such information.
                </p>
              </Section>

              <Section
                id="security"
                n="13"
                title="Security & Data Deletion"
              >
                <p>
                  We have implemented appropriate technical and organizational
                  security measures designed to protect the security of any
                  personal information we process. However, despite our
                  safeguards and efforts to secure your information, no
                  electronic transmission over the Internet or information
                  storage technology can be guaranteed to be 100% secure.
                </p>
                <p>
                  You may request deletion of your account and associated
                  personal data at any time by contacting us. Upon verified
                  request, we will delete or anonymize your personal data,
                  unless retention is required for legitimate business or
                  legal reasons.
                </p>
              </Section>

              <Section id="rights" n="14" title="Your Rights">
                <p>
                  Depending on your location, you may have certain rights
                  regarding your personal information, including the right to:
                </p>
                <ul>
                  <li>Access and obtain a copy of your personal information</li>
                  <li>Rectify inaccurate or incomplete information</li>
                  <li>Request erasure of your personal information</li>
                  <li>Restrict or object to certain processing</li>
                  <li>Withdraw consent where processing is based on consent</li>
                  <li>Data portability</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us using the
                  details provided at the end of this Privacy Policy.
                </p>
              </Section>

              <Section id="third-party" n="15" title="Third Party Sharing">
                <p>
                  The Services may contain links to third-party websites and
                  services that are not owned or controlled by us. We are not
                  responsible for the privacy practices of any third party,
                  and we encourage you to review the privacy policies of any
                  third-party services you interact with.
                </p>
              </Section>

              <Section id="changes" n="16" title="Changes to this Policy">
                <p>
                  We may update this Privacy Policy from time to time. The
                  updated version will be indicated by a revised &ldquo;Last
                  updated&rdquo; date and the updated version will be effective
                  as soon as it is accessible. We encourage you to review this
                  Privacy Policy frequently to be informed of how we are
                  protecting your information.
                </p>
              </Section>

              <Section id="contact" n="17" title="Contact Us">
                <p>
                  If you have questions or comments about this Privacy Policy,
                  or would like to exercise your rights, please contact us:
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

              <div className="pt-6 border-t border-htb-border flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/terms"
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-md border border-htb-border bg-htb-panel text-htb-muted hover:text-neon hover:border-neon/40 transition-colors font-mono text-xs uppercase tracking-widest font-semibold"
                >
                  Read the Terms of Use
                  <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </Link>
                <a
                  href="#privacy-hero-heading"
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

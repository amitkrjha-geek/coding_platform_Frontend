import { faqs } from "../faq-data";
import { SITE_URL } from "../pricing-data";

/**
 * Consolidated structured-data block for the landing page.
 *
 * Uses Schema.org's @graph pattern — one <script> tag, multiple entities,
 * cross-linked via @id so Google understands the relationships.
 *
 * Entities shipped:
 *   - Organization        (Violethat brand identity)
 *   - WebSite             (with SearchAction)
 *   - SoftwareApplication (no static offers — real offers live on /billing,
 *                          server-fetched from the plans API, so the schema
 *                          matches what users see)
 *   - FAQPage             (mirrors visible FAQ from faq-data)
 *   - BreadcrumbList      (home only — sub-pages will extend)
 *
 * Server Component. Renders a single <script type="application/ld+json">
 * which Next.js auto-hoists when used in App Router Server Components.
 *
 * Validate at: https://search.google.com/test/rich-results
 */
export default function SiteJsonLd() {
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;
  const appId = `${SITE_URL}/#software`;
  const faqId = `${SITE_URL}/#faq`;
  const breadcrumbId = `${SITE_URL}/#breadcrumb`;

  const graph: Record<string, unknown>[] = [
    // ------------- Organization -------------
    {
      "@type": "Organization",
      "@id": orgId,
      name: "Violethat",
      legalName: "Violethat",
      alternateName: "VioletHat",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/VioletHat%20Logo_Emblen_Violet.svg`,
        contentUrl: `${SITE_URL}/VioletHat%20Logo_Emblen_Violet.svg`,
        width: 512,
        height: 512,
        caption: "Violethat logo",
        encodingFormat: "image/svg+xml",
        inLanguage: "en-US",
      },
      // `image` is separate from `logo` in Schema.org — Knowledge Panel uses
      // this for the org photo. We reuse the logo here as the brand image.
      image: { "@id": `${SITE_URL}/#logo` },
      description:
        "A hands-on cybersecurity training platform for detection engineers, blue teamers, and security researchers.",
      slogan: "Know Your Defense. Train Your Offense.",
      foundingDate: "2024",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Goa",
        addressCountry: "IN",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "violethat@violethat.com",
          availableLanguage: ["English"],
          areaServed: "Worldwide",
        },
      ],
      sameAs: [
        "https://twitter.com/violethat",
        "https://github.com/violethat",
        "https://linkedin.com/company/violethat",
      ],
      knowsAbout: [
        "Cybersecurity training",
        "Detection engineering",
        "Malware analysis",
        "Capture the flag",
        "Offensive security",
        "Blue team operations",
      ],
      award: ["DPIIT Recognized Startup (DIPP179766)"],
    },

    // ------------- WebSite -------------
    {
      "@type": "WebSite",
      "@id": siteId,
      url: SITE_URL,
      name: "Violethat",
      description:
        "Hands-on cybersecurity training for detection engineers, blue teamers, and security researchers.",
      publisher: { "@id": orgId },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/challenges?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },

    // ------------- SoftwareApplication -------------
    {
      "@type": "SoftwareApplication",
      "@id": appId,
      name: "Violethat",
      url: SITE_URL,
      applicationCategory: "SecurityApplication",
      applicationSubCategory: "Cybersecurity training platform",
      operatingSystem: "Web",
      browserRequirements: "Requires JavaScript and a modern browser",
      description:
        "Write C/C++ in the browser, run a live agent against the target, and capture flags in real time. Built for detection engineers, blue teamers, malware analysts, and security researchers.",
      featureList: [
        "Browser-native Monaco IDE (C/C++)",
        "Live agent runner with real-time streaming logs",
        "Real flag capture (CTF-style) with verification",
        "Curated challenge library across detection, malware, web, pwn, and crypto",
        "Progression and leaderboard",
        "Team / enterprise plans with SSO, SCIM, and compliance reporting",
      ],
      image: { "@id": `${SITE_URL}/#logo` },
      screenshot: { "@id": `${SITE_URL}/#logo` },
      publisher: { "@id": orgId },
      isAccessibleForFree: true,
      inLanguage: "en-US",
    },

    // ------------- FAQPage -------------
    {
      "@type": "FAQPage",
      "@id": faqId,
      url: `${SITE_URL}/#faq`,
      isPartOf: { "@id": siteId },
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    },

    // ------------- WebPage (landing) with Speakable -------------
    // Tells voice assistants (Google Assistant, Bixby) which parts of the page
    // to read aloud when the user asks for an overview.
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: "Violethat — Where Blue Teams Play With Hooks",
      description:
        "A hands-on cybersecurity training platform for detection engineers, blue teamers, and security researchers.",
      inLanguage: "en-US",
      isPartOf: { "@id": siteId },
      about: { "@id": orgId },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/opengraph-image`,
      },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".heading-display", "[data-speakable]"],
      },
    },

    // ------------- BreadcrumbList -------------
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
      ],
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      // Use dangerouslySetInnerHTML so JSON.stringify isn't re-escaped by React
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

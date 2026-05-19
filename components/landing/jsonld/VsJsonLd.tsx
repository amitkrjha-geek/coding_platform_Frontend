import { SITE_URL } from "../pricing-data";

interface VsJsonLdProps {
  competitor: string;
  /** Path including leading slash, e.g. "/vs/hackthebox" */
  path: string;
  title: string;
  description: string;
  /** ISO date string */
  datePublished?: string;
  /** Optional FAQ pairs to extend the page-level FAQPage entity */
  faqs?: { question: string; answer: string }[];
}

/**
 * Structured data for a /vs/* comparison page.
 *
 * Ships:
 *   - WebPage      (lightweight; full Organization/WebSite already on root)
 *   - BreadcrumbList: Home → Compare → {Competitor}
 *   - FAQPage      (only if `faqs` provided)
 *
 * Server Component. Pure <script type="application/ld+json">.
 */
export default function VsJsonLd({
  competitor,
  path,
  title,
  description,
  datePublished = "2026-01-01",
  faqs,
}: VsJsonLdProps) {
  const url = `${SITE_URL}${path}`;
  const today = new Date().toISOString().slice(0, 10);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      datePublished,
      dateModified: today,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: {
        "@type": "SoftwareApplication",
        name: "Violethat",
        url: SITE_URL,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Compare",
          item: `${SITE_URL}/#compare`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `Violethat vs ${competitor}`,
          item: url,
        },
      ],
    },
  ];

  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      isPartOf: { "@id": `${url}#webpage` },
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

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

import type { Metadata } from "next";
import PricingHeader from "@/components/billing/PricingHeader"
import Faq from '@/components/billing/FAQ'
import { PricingFeatures } from '@/components/billing/PricingFeatures'
import { PricingPlans } from '@/components/billing/PricingPlans'
import { SITE_URL } from "@/components/landing/pricing-data"

// Refresh billing JSON-LD offers hourly so admin price changes hit search fast
export const revalidate = 3600;

const TITLE = "Pricing — Violethat Subscription & Per-Challenge Plans";
const DESCRIPTION =
  "Simple, transparent pricing for Violethat. Start free with starter challenges, upgrade to monthly or yearly subscriptions for full catalog access, premium tracks, writeups, and priority agent runner queue. Per-challenge bundles available.";
const URL = `${SITE_URL}/billing`;

interface BackendPlan {
  _id: string;
  name: string;
  price: number;
  priceMode: string;
  popular?: boolean;
  details?: string[];
  isActive?: boolean;
}

async function fetchPlansServerSide(): Promise<BackendPlan[]> {
  const base = process.env.NEXT_PUBLIC_API_END_POINTS;
  if (!base) return [];
  try {
    const res = await fetch(`${base}/api/plans`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: unknown = Array.isArray(data) ? data : data?.data;
    if (!Array.isArray(list)) return [];
    return (list as BackendPlan[]).filter(
      (p) => p && p._id && p.name && typeof p.price === "number",
    );
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/billing" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Violethat pricing",
    "cybersecurity training subscription",
    "detection engineering platform pricing",
    "EDR training plans",
    "blue team training cost",
    "CTF platform subscription",
    "per-challenge pricing",
  ],
  openGraph: {
    type: "website",
    url: "/billing",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Violethat",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Verbatim from components/billing/FAQ.tsx — single source of truth.
// If you edit the visible FAQ copy, update both places (schema must match
// what users see or Google penalizes the rich result).
const BILLING_FAQS: { question: string; answer: string }[] = [
  {
    question: "What do I get with a premium subscription?",
    answer:
      "Premium subscription provides access to all the paid coding challenges, along with complete technical solution writeups.",
  },
  {
    question: "What are premium subscription?",
    answer:
      "Premium subscription includes carefully researched coding challenges designed to provide unique detection insights into advanced attacker techniques that are often difficult to identify, or alternative detection approaches that can be more effective than existing methods.",
  },
  {
    question: "How much does the premium subscription cost?",
    answer:
      "Our Premium subscription is currently offered in multiple pricing tiers. At the moment, you can choose either an individual coding challenge or a bundle that provides access to multiple challenges. We also plan to revise and expand our subscription plans soon.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "You cannot cancel the subscription once it has been purchased, as the current model is based on one-time payments for individual challenges or challenge bundles rather than recurring billing. Cancellation options will be available once we revise the subscription structure in the future.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      'Yes! We offer special discounts for students with valid student email addresses. Contact us on "violethat@violethat.com" with your student credentials to get your discount code.',
  },
  {
    question: "Can I switch between different subscription plans?",
    answer:
      "Yes, you can upgrade or downgrade your subscription plan at any time. The changes will take effect at the start of your next billing cycle.",
  },
];

function BillingJsonLd({ plans }: { plans: BackendPlan[] }) {
  const today = new Date().toISOString().slice(0, 10);

  // Build Offer nodes from REAL backend plans — schema matches visible UI
  const offers = plans
    .filter((p) => p.isActive !== false)
    .map((p) => ({
      "@type": "Offer",
      "@id": `${URL}#offer-${p._id}`,
      name: p.name,
      price: String(p.price),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: URL,
      category: p.priceMode || "SaaS subscription",
      eligibleRegion: { "@type": "Place", name: "Worldwide" },
      priceSpecification: {
        "@type": "PriceSpecification",
        price: String(p.price),
        priceCurrency: "INR",
        ...(p.priceMode === "Monthly" && {
          billingDuration: "P1M",
        }),
        ...(p.priceMode === "Yearly" && {
          billingDuration: "P1Y",
        }),
      },
      itemOffered: {
        "@type": "Service",
        name: p.name,
        description: (p.details || []).join(". "),
        provider: { "@id": `${SITE_URL}/#organization` },
      },
    }));

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": `${URL}#webpage`,
      url: URL,
      name: TITLE,
      description: DESCRIPTION,
      datePublished: "2024-06-01",
      dateModified: today,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      mainEntity: { "@id": `${URL}#faq` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Pricing", item: URL },
      ],
    },
    {
      "@type": "Product",
      "@id": `${URL}#product`,
      name: "Violethat — cybersecurity training platform",
      description: DESCRIPTION,
      brand: { "@id": `${SITE_URL}/#organization` },
      ...(offers.length > 0 && { offers }),
    },
    {
      "@type": "FAQPage",
      "@id": `${URL}#faq`,
      inLanguage: "en-US",
      isPartOf: { "@id": `${URL}#webpage` },
      mainEntity: BILLING_FAQS.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
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

const Page = async () => {
    const plans = await fetchPlansServerSide();
    return (
        <div className="relative -mt-14 bg-htb-bg">
            <BillingJsonLd plans={plans} />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-20">
                <PricingHeader />
                <PricingPlans />
                <PricingFeatures />
            </div>
            <div className="relative bg-htb-bg-deep border-t border-htb-border py-16 sm:py-20 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Faq />
                </div>
            </div>
        </div>
    )
}

export default Page

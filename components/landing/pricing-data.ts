/**
 * Single source of truth for landing pricing.
 *
 * Imported by:
 *   - <PricingSection/>     (visible pricing UI)
 *   - jsonld/SiteJsonLd.tsx (SoftwareApplication.offers in structured data)
 *
 * Prices MUST stay in sync between visible tiers and structured data —
 * Google penalizes Offer schema that doesn't match what users see.
 *
 * NOTE: For v2, replace these constants with values read from the existing
 *       /redux/features/planSlice so admin-managed prices flow through.
 */

export type Cadence = "monthly" | "annual";

export interface PricingTier {
  id: "free" | "pro" | "teams";
  name: string;
  blurb: string;
  monthly: number | "custom";
  annual: number | "custom";
  /** Currency symbol shown before the number (display only) */
  unit?: string;
  /** ISO 4217 currency code used in JSON-LD Offer.priceCurrency */
  priceCurrency: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  popular?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    blurb: "Get hands-on with the platform — no card required.",
    monthly: 0,
    annual: 0,
    priceCurrency: "INR",
    features: [
      "Access to 20+ starter challenges",
      "In-browser IDE (C/C++)",
      "Live agent runner with streaming logs",
      "Community leaderboard",
      "Personal progression dashboard",
    ],
    ctaLabel: "Start free",
    ctaHref: "/sign-up",
  },
  {
    id: "pro",
    name: "Pro",
    blurb: "Everything you need to train seriously, every week.",
    monthly: 899,
    annual: 719,
    unit: "₹",
    priceCurrency: "INR",
    features: [
      "All Free features",
      "Full challenge catalog (850+)",
      "Premium tracks with full writeups",
      "Reference solutions + walkthroughs",
      "Detect-DB research access",
      "Priority queue on the agent runner",
      "Cancel anytime",
    ],
    ctaLabel: "Go Pro",
    ctaHref: "/sign-up?plan=pro",
    popular: true,
  },
  {
    id: "teams",
    name: "Teams",
    blurb: "For SOCs, detection teams, and training programs.",
    monthly: "custom",
    annual: "custom",
    priceCurrency: "INR",
    features: [
      "Everything in Pro for every seat",
      "SSO & SCIM provisioning",
      "Custom private challenges",
      "Cohorts, assignments, leaderboards",
      "Compliance reporting + audit exports",
      "DPA + SOC 2 questionnaire on request",
      "Dedicated success contact",
    ],
    ctaLabel: "Talk to Sales",
    ctaHref: "mailto:violethat@violethat.com?subject=Teams%20plan",
  },
];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://violethat.com";

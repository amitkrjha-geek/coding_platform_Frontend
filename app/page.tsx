import type { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { auth } from "@clerk/nextjs/server";
import MarketingNav from "@/components/landing/MarketingNav";
import HeroSplitTerminal from "@/components/landing/HeroSplitTerminal";
import TrustStrip from "@/components/landing/TrustStrip";
import WhyViolethat from "@/components/landing/WhyViolethat";
import IdeAgentDemo from "@/components/landing/IdeAgentDemo";
import ThreePillars from "@/components/landing/ThreePillars";
import FeatureChallenges from "@/components/landing/FeatureChallenges";
import FeatureAgentRunner from "@/components/landing/FeatureAgentRunner";
import FeatureProgression from "@/components/landing/FeatureProgression";
import StatsBand from "@/components/landing/StatsBand";
import ComparisonTable from "@/components/landing/ComparisonTable";
import ForTeamsBand from "@/components/landing/ForTeamsBand";
import TestimonialsGrid from "@/components/landing/TestimonialsGrid";
import PricingSection from "@/components/landing/PricingSection";
import LandingFAQ from "@/components/landing/LandingFAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import MarketingFooter from "@/components/landing/MarketingFooter";
import SiteJsonLd from "@/components/landing/jsonld/SiteJsonLd";

// SERP title kept short (≤60 chars). The full long-form line lives in the
// hero <h1> and in the OG/Twitter cards for richer share previews.
export const metadata: Metadata = {
  title: "Violethat — Where Blue Teams Play With Hooks",
  description:
    "A hands-on cybersecurity training platform for detection engineers, blue teamers, and security researchers. Write C/C++ in the browser, run a live agent against the target, capture flags in real time.",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Violethat — The First Platform Where Blue Teams Finally Get to Play With Hooks",
    description:
      "Hands-on cybersecurity training for detection engineers, blue teamers, and security researchers. Browser-native IDE. Live agent runner. Real flag capture.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Violethat — The First Platform Where Blue Teams Finally Get to Play With Hooks",
    description:
      "Hands-on cybersecurity training for detection engineers, blue teamers, and security researchers.",
  },
};

export default async function Home() {
  // const { userId } = await auth();

  // // Logged-in users go straight to the app
  // if (userId) {
  //   redirect("/challenges");
  // }

  return (
    <>
      {/* Structured data (Organization + WebSite + SoftwareApplication + FAQPage + BreadcrumbList) */}
      <SiteJsonLd />

      {/* Skip-to-content link — first focusable element (a11y) */}
      {/* <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:bg-neon focus:text-white focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
      >
        Skip to content
      </a> */}

      <MarketingNav />

      <main id="main" className="bg-htb-bg">
        <HeroSplitTerminal />
        <TrustStrip />
        <WhyViolethat />
        <IdeAgentDemo />
        <ThreePillars />
        {/* <FeatureChallenges /> */}
        <FeatureAgentRunner />
        {/* <FeatureProgression /> */}
        <StatsBand />
        {/* <ComparisonTable /> */}
        {/* <ForTeamsBand /> */}
        {/* <TestimonialsGrid /> */}
        <PricingSection />
        <LandingFAQ />
        <FinalCTA />

        {/* Phase L7 — JSON-LD + SEO polish lands here */}
      </main>

      {/* <MarketingFooter /> */}
    </>
  );
}

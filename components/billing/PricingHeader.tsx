import React from "react";
import GridBackground from "@/components/shared/GridBackground";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";

const PricingHeader = () => (
  <div className="relative">
    <GridBackground variant="neon" />
    <div className="relative text-center space-y-5 py-6">
      <TerminalEyebrow className="justify-center inline-flex">
        pricing.tier
      </TerminalEyebrow>
      <h1 className="heading-display text-4xl sm:text-5xl lg:text-6xl text-htb-text">
        Unlock <span className="text-neon">Premium</span>
      </h1>
      <p className="max-w-xl mx-auto text-htb-muted text-sm sm:text-base leading-relaxed">
        Pick the subscription that matches your training intensity. Cancel
        anytime — no exit fees, no questions asked.
      </p>
    </div>
  </div>
);

export default PricingHeader;

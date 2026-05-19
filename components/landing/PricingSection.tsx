"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import {
  Check,
  Crown,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { RootState } from "@/redux/store";
import { fetchPlans, type PlanData } from "@/redux/features/planSlice";
import { CheckoutPage } from "@/components/billing/CheckoutPage";
import { pricingTiers as tiers, type PricingTier } from "./pricing-data";

/**
 * Section 13 — Pricing
 *
 * Left  : static Free tier   (from pricing-data.ts)
 * Middle: backend Pro plans  (dispatch(fetchPlans), filtered by Monthly/Yearly,
 *         rendered as a carousel inside the popular card)
 * Right : static Teams/Custom (from pricing-data.ts)
 *
 * Auth + checkout flow mirrors components/billing/PricingPlans.tsx so paid
 * subscriptions go through the same Clerk-gated CheckoutPage.
 */

type ProCadence = "Monthly" | "Yearly";

const freeTier = tiers.find((t) => t.id === "free")!;
const teamsTier = tiers.find((t) => t.id === "teams")!;

export default function PricingSection() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { userId } = useAuth();
  const { plans, status: planStatus } = useAppSelector(
    (state: RootState) => state.plan,
  );

  const [proCadence, setProCadence] = useState<ProCadence>("Monthly");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState("");

  // Fetch plans on mount
  useEffect(() => {
    if (!plans.length && planStatus === "idle") {
      dispatch(fetchPlans());
    }
  }, [dispatch, plans.length, planStatus]);

  // Auto-submit hidden payment form (matches billing flow)
  useEffect(() => {
    const el = document.getElementById("payment_post") as HTMLFormElement | null;
    if (el) el.submit();
  }, [paymentForm]);

  // Plans matching current cadence
  const proPlans = useMemo(
    () => plans.filter((p) => p.priceMode === proCadence),
    [plans, proCadence],
  );

  // Reset slide index when cadence flips or list size changes
  useEffect(() => {
    setActiveIndex(0);
  }, [proCadence, proPlans.length]);

  const handlePrev = () =>
    setActiveIndex((i) => (i - 1 + proPlans.length) % proPlans.length);
  const handleNext = () =>
    setActiveIndex((i) => (i + 1) % proPlans.length);

  const handleSubscribe = (plan: PlanData) => {
    if (!userId) {
      toast.error("Please login to subscribe to a plan");
      setTimeout(() => router.push("/sign-in"), 1000);
      return;
    }
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const isLoading = planStatus === "loading";
  const activePlan = proPlans[activeIndex];

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative border-b border-htb-border bg-htb-bg-deep py-20 sm:py-24 lg:py-28"
    >
      {/* Hidden payment auto-submit — preserved */}
      <div
        dangerouslySetInnerHTML={{ __html: paymentForm }}
        style={{ display: "none" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <TerminalEyebrow className="justify-center inline-flex">
            pricing.tiers
          </TerminalEyebrow>
          <h2
            id="pricing-heading"
            className="heading-display text-3xl sm:text-4xl lg:text-5xl text-htb-text mt-3"
          >
            Simple pricing. <span className="text-neon">No surprises.</span>
          </h2>
          <p className="text-htb-muted text-base sm:text-lg leading-relaxed mt-4">
            Start free. Upgrade when you are ready. Cancel anytime.
          </p>
        </div>

        {/* Tier grid: 3 columns on lg, stack on smaller */}
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {/* LEFT — static Free */}
          <li>
            <StaticTierCard tier={freeTier} />
          </li>

          {/* MIDDLE — backend Pro carousel */}
          <li>
            <ProCarouselCard
              cadence={proCadence}
              onCadenceChange={setProCadence}
              plans={proPlans}
              isLoading={isLoading}
              activeIndex={activeIndex}
              activePlan={activePlan}
              onPrev={handlePrev}
              onNext={handleNext}
              onSelectDot={setActiveIndex}
              onSubscribe={handleSubscribe}
            />
          </li>

          {/* RIGHT — static Custom / Teams */}
          <li>
            <StaticTierCard tier={teamsTier} />
          </li>
        </ul>

        {/* Compare all features */}
        <div className="text-center mt-10">
          <Link
            href="/billing"
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest font-semibold text-htb-muted hover:text-neon transition-colors"
          >
            Compare all features
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Checkout modal */}
      {isCheckoutOpen && selectedPlan && (
        <CheckoutPage
          plan={selectedPlan}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={(form) => {
            setPaymentForm(form);
            setIsCheckoutOpen(false);
          }}
        />
      )}
    </section>
  );
}

// ----------------------------------------------------------------------------
// Static tier card (Free / Teams)
// ----------------------------------------------------------------------------

function StaticTierCard({ tier }: { tier: PricingTier }) {
  const value = tier.monthly;
  const displayPrice =
    value === "custom" ? "Custom" : value === 0 ? "Free" : `${tier.unit ?? ""}${value.toLocaleString()}`;
  const perUnit = value === "custom" || value === 0 ? undefined : "/ month";

  return (
    <article className="group relative h-full overflow-hidden rounded-lg panel panel-hover transition-all duration-300">
      <div className="relative p-6 sm:p-7 flex flex-col h-full">
        {/* Header */}
        <div className="mb-5">
          <span className="terminal-eyebrow">tier.{tier.id}</span>
          <h3 className="text-2xl font-bold mt-2 text-htb-text">{tier.name}</h3>
          <p className="text-sm text-htb-muted mt-1">{tier.blurb}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono text-4xl sm:text-5xl font-bold text-htb-text tabular-nums">
              {displayPrice}
            </span>
            {perUnit && (
              <span className="text-xs text-htb-text-dim font-mono uppercase tracking-wider">
                {perUnit}
              </span>
            )}
          </div>
        </div>

        <div className="h-px bg-htb-border mb-5" />

        {/* Features */}
        <ul className="space-y-2.5 mb-7 flex-1">
          {tier.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-htb-muted">
              <span className="shrink-0 flex items-center justify-center w-4 h-4 rounded border border-neon/30 bg-neon/10 mt-0.5">
                <Check className="w-2.5 h-2.5 text-neon" />
              </span>
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href={tier.ctaHref}
          className="group/btn relative w-full overflow-hidden bg-htb-panel-2 hover:bg-neon/10 border border-htb-border hover:border-neon/40 text-htb-text hover:text-neon font-mono text-xs uppercase tracking-widest font-semibold py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>{tier.ctaLabel}</span>
          <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300" />
        </Link>
      </div>
    </article>
  );
}

// ----------------------------------------------------------------------------
// Pro carousel card (backend-fed)
// ----------------------------------------------------------------------------

interface ProCarouselCardProps {
  cadence: ProCadence;
  onCadenceChange: (c: ProCadence) => void;
  plans: PlanData[];
  isLoading: boolean;
  activeIndex: number;
  activePlan: PlanData | undefined;
  onPrev: () => void;
  onNext: () => void;
  onSelectDot: (i: number) => void;
  onSubscribe: (plan: PlanData) => void;
}

function ProCarouselCard({
  cadence,
  onCadenceChange,
  plans,
  isLoading,
  activeIndex,
  activePlan,
  onPrev,
  onNext,
  onSelectDot,
  onSubscribe,
}: ProCarouselCardProps) {
  return (
    <article className="group relative h-full rounded-lg border border-purple-500/40 bg-gradient-to-br from-htb-panel via-htb-panel to-purple-950/30 shadow-[0_0_0_1px_rgba(168,85,247,0.4),0_0_40px_rgba(168,85,247,0.18)] transition-all duration-300">
      {/* Premium accents (inside-clip layer) */}
      <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-purple-600 via-fuchsia-400 to-purple-600 opacity-80" />
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />
      </div>

      {/* Sparkle */}
      <div className="absolute top-3 right-3 pointer-events-none z-10">
        <Sparkles className="w-3.5 h-3.5 text-fuchsia-300/60 animate-pulse" />
      </div>

      {/* Most Popular ribbon — floats above card top edge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 text-white px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest rounded shadow-[0_0_16px_rgba(217,70,239,0.4)] whitespace-nowrap">
          <Crown className="w-2.5 h-2.5" />
          Most Popular
        </span>
      </div>

      <div className="relative p-6 sm:p-7 pt-8 sm:pt-9 flex flex-col h-full">
        {/* Cadence filter */}
        <div className="flex justify-center mb-5">
          <div
            role="tablist"
            aria-label="Plan cadence"
            className="inline-flex items-center p-1 rounded-md border border-purple-500/30 bg-htb-bg/40"
          >
            {(["Monthly", "Yearly"] as ProCadence[]).map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cadence === c}
                onClick={() => onCadenceChange(c)}
                className={`px-3 py-1.5 rounded font-mono text-[10px] uppercase tracking-widest font-semibold transition-colors ${
                  cadence === c
                    ? "bg-fuchsia-500/15 text-fuchsia-200 border border-fuchsia-400/40"
                    : "border border-transparent text-htb-muted hover:text-htb-text"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Slide region */}
        <div className="relative flex-1 flex flex-col min-h-[420px]">
          {isLoading ? (
            <ProSkeleton />
          ) : plans.length === 0 ? (
            <ProEmpty cadence={cadence} />
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${cadence}-${activeIndex}-${activePlan?._id ?? "x"}`}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 flex flex-col"
                >
                  {activePlan && (
                    <ProPlanBody
                      plan={activePlan}
                      onSubscribe={() => onSubscribe(activePlan)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Prev/next + dots */}
              {plans.length > 1 && (
                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onPrev}
                    aria-label="Previous plan"
                    className="flex items-center justify-center w-8 h-8 rounded-md border border-purple-500/30 bg-htb-bg/40 text-htb-muted hover:text-fuchsia-200 hover:border-fuchsia-400/50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5" role="tablist">
                    {plans.map((p, i) => (
                      <button
                        key={p._id}
                        role="tab"
                        aria-selected={i === activeIndex}
                        aria-label={`Show ${p.name}`}
                        onClick={() => onSelectDot(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          i === activeIndex
                            ? "w-6 bg-fuchsia-300"
                            : "w-1.5 bg-htb-border hover:bg-fuchsia-400/40"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={onNext}
                    aria-label="Next plan"
                    className="flex items-center justify-center w-8 h-8 rounded-md border border-purple-500/30 bg-htb-bg/40 text-htb-muted hover:text-fuchsia-200 hover:border-fuchsia-400/50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </article>
  );
}

// ----------------------------------------------------------------------------
// Pro plan body (inside carousel slide)
// ----------------------------------------------------------------------------

function ProPlanBody({
  plan,
  onSubscribe,
}: {
  plan: PlanData;
  onSubscribe: () => void;
}) {
  const cadenceLabel = plan.priceMode === "Yearly" ? "/ year" : "/ month";
  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <div className="mb-4">
        <span className="terminal-eyebrow">
          plan.{plan.name.trim().toLowerCase().replace(/\s+/g, "_")}
        </span>
        <h3 className="text-2xl font-bold mt-2 text-htb-text">{plan.name}</h3>
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-mono text-4xl sm:text-5xl font-bold tabular-nums text-fuchsia-200">
            ₹{plan.price.toLocaleString()}
          </span>
          <span className="text-xs text-htb-text-dim font-mono uppercase tracking-wider">
            {cadenceLabel}
          </span>
        </div>
      </div>

      <div className="h-px bg-htb-border mb-5" />

      {/* Features */}
      <ul className="space-y-2.5 mb-7 flex-1">
        {plan.details.map((d, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm text-htb-muted"
          >
            <span className="shrink-0 flex items-center justify-center w-4 h-4 rounded border border-fuchsia-400/40 bg-fuchsia-500/10 mt-0.5">
              <Check className="w-2.5 h-2.5 text-fuchsia-200" />
            </span>
            <span className="leading-snug">{d}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        type="button"
        onClick={onSubscribe}
        className="group/btn relative w-full overflow-hidden bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-700 bg-[length:200%_100%] bg-left hover:bg-right text-white font-mono text-xs uppercase tracking-widest font-semibold py-3.5 rounded-md transition-[background-position,box-shadow,transform] duration-500 hover:shadow-[0_0_0_1px_rgba(217,70,239,0.6),0_0_32px_rgba(217,70,239,0.45)] hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-fuchsia-400/30"
      >
        <Crown className="w-3.5 h-3.5" />
        <span>Subscribe Now</span>
        <ArrowRight className="w-3.5 h-3.5 -translate-x-1 opacity-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all duration-300" />
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Loading / empty states
// ----------------------------------------------------------------------------

function ProSkeleton() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-htb-muted gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-fuchsia-300" />
      <p className="text-[11px] font-mono uppercase tracking-widest">
        Loading plans...
      </p>
    </div>
  );
}

function ProEmpty({ cadence }: { cadence: ProCadence }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-2">
      <div className="w-12 h-12 rounded-md border border-fuchsia-400/30 bg-fuchsia-500/5 flex items-center justify-center">
        <Crown className="w-5 h-5 text-fuchsia-300/60" />
      </div>
      <p className="text-sm font-semibold text-htb-text">
        No {cadence.toLowerCase()} plans yet
      </p>
      <p className="text-xs text-htb-muted leading-relaxed max-w-[220px]">
        Switch the toggle above or check back soon — new subscription plans are
        rolling out.
      </p>
    </div>
  );
}

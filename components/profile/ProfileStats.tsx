"use client";

import useIsMounted from "@/hooks/useIsMounted";
import Link from "next/link";

const defaultStats = {
  solved: 0,
  total: 0,
  attempting: 0,
  difficulty: {
    easy: { count: 0, total: 0, color: 'text-neon', label: 'Easy' },
    medium: { count: 0, total: 0, color: 'text-warn', label: 'Med.' },
    hard: { count: 0, total: 0, color: 'text-danger', label: 'Hard' }
  },

  plan: {
    name: "Standard",
    price: "160",
    nextBillingDate: "April 22, 2024"
  }
};

const ProfileStats = ({ organizedData, plan }: { organizedData: any, plan: any }) => {
  // console.log('📊 Organized Data:', organizedData);
  

  // console.log('📊 Plan:', plan);
  const isMounted = useIsMounted();

  // Get the latest plan from payment history
  const getLatestPlan = () => {
    if (!plan) {
      return null; // Return null when no plan data
    }

    // Handle both array and single object cases
    let planData;
    if (Array.isArray(plan)) {
      if (plan.length === 0) return null;
      planData = plan[plan.length - 1];
    } else {
      planData = plan;
    }

    // Check if planData has the expected structure
    if (planData && planData.name && planData.price !== undefined) {
      // Calculate next billing date based on endDate
      let nextBillingDate = "N/A";
      if (planData.endDate) {
        const endDate = new Date(planData.endDate);
        nextBillingDate = endDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }

      return {
        name: planData.name,
        price: planData.price,
        priceMode: planData.priceMode || 'month',
        nextBillingDate: nextBillingDate,
        // isActive: planData.isActive || false,
        durationDays: planData.durationDays || 30,
        details: planData.details || [],
        startDate: planData.startDate,
        endDate: planData.endDate
      };
    }

    return null; // Return null when no valid plan data
  };

  const currentPlan = getLatestPlan();
  const today = new Date();
  const planEndDate = new Date(currentPlan?.endDate);
  const isActive = planEndDate >= today;

  // console.log('📊 Current Plan:', currentPlan);

  // Calculate stats from organized data
  const stats = organizedData ? {
    solved: organizedData.total || 0,
    total: organizedData.total || 0, // You can adjust this based on your total available challenges
    attempting: 0, // You can calculate this if you have pending submissions
    difficulty: {
      easy: {
        count: organizedData.easy?.length || 0,
        total: organizedData.easy?.length || 0,
        color: 'text-neon',
        label: 'Easy'
      },
      medium: {
        count: organizedData.medium?.length || 0,
        total: organizedData.medium?.length || 0,
        color: 'text-warn',
        label: 'Med.'
      },
      hard: {
        count: organizedData.hard?.length || 0,
        total: organizedData.hard?.length || 0,
        color: 'text-danger',
        label: 'Hard'
      }
    },
    plan: currentPlan || defaultStats.plan
  } : defaultStats;

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className="panel p-5 sm:p-6">
          <div className="h-[200px] bg-htb-panel-2 rounded animate-pulse" />
        </div>
        <div className="panel p-5 sm:p-6">
          <div className="h-[200px] bg-htb-panel-2 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // HTB-aligned palette (donut + dots)
  const colorEasy = '#A855F7';
  const colorMedium = '#FFAF00';
  const colorHard = '#FF3E3E';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {/* Progress Circle */}
      <div className="panel p-5 sm:p-6">
        <span className="terminal-eyebrow">progress.report</span>
        <div className="relative w-28 sm:w-36 h-28 sm:h-36 mx-auto mt-4">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background dots */}
            {Array.from({ length: 12 }).map((_, i) => (
              <circle
                key={i}
                cx={50 + 45 * Math.cos((i * 30 * Math.PI) / 180)}
                cy={50 + 45 * Math.sin((i * 30 * Math.PI) / 180)}
                r="1.5"
                fill={i % 3 === 0 ? colorEasy : i % 3 === 1 ? colorMedium : colorHard}
                opacity="0.4"
              />
            ))}
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="10"
            />
            {/* Progress circles for each difficulty */}
            {(() => {
              const circumference = 283;
              const totalChallenges = stats.difficulty.easy.count + stats.difficulty.medium.count + stats.difficulty.hard.count;

              if (totalChallenges === 0) return null;

              const easyLength = (stats.difficulty.easy.count / totalChallenges) * circumference;
              const mediumLength = (stats.difficulty.medium.count / totalChallenges) * circumference;
              const hardLength = (stats.difficulty.hard.count / totalChallenges) * circumference;

              let currentOffset = 0;

              return (
                <>
                  {stats.difficulty.easy.count > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={colorEasy}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${easyLength} ${circumference}`}
                      strokeDashoffset={`-${currentOffset}`}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                  {currentOffset += easyLength}

                  {stats.difficulty.medium.count > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={colorMedium}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${mediumLength} ${circumference}`}
                      strokeDashoffset={`-${currentOffset}`}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                  {currentOffset += mediumLength}

                  {stats.difficulty.hard.count > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={colorHard}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${hardLength} ${circumference}`}
                      strokeDashoffset={`-${currentOffset}`}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                </>
              );
            })()}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-bold text-htb-text tabular-nums">
              {stats.solved}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-htb-text-dim mt-0.5">
              /{stats.total} solved
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {Object.entries(stats.difficulty).map(([key, stat]) => (
            <div key={key} className="flex flex-col items-center gap-1 p-2 rounded border border-htb-border bg-htb-bg/40">
              <span className={`${stat.color} text-[11px] font-mono uppercase tracking-widest font-semibold`}>
                {stat.label}
              </span>
              <span className="font-mono text-htb-text text-sm tabular-nums">
                {stat.count}<span className="text-htb-text-dim">/{stat.total}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Plan */}
      <div className="panel p-5 sm:p-6">
        {currentPlan ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="terminal-eyebrow">subscription</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-neon shadow-neon-sm animate-glow-pulse' : 'bg-danger'}`}></div>
                <span className={`text-[10px] font-mono uppercase tracking-widest font-semibold ${isActive ? 'text-neon' : 'text-danger'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-htb-text">{currentPlan.name}</span>
                  {!isActive && (
                    <span className="px-2 py-0.5 rounded border border-danger/30 bg-danger/10 text-danger text-[10px] font-mono uppercase tracking-widest font-semibold">
                      Expired
                    </span>
                  )}
                  {currentPlan.name === 'ENTERPRISE' && (
                    <span className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-300 text-[10px] font-mono uppercase tracking-widest font-semibold">
                      Pro
                    </span>
                  )}
                </div>
                <span className="font-mono text-lg font-bold text-htb-text">
                  ₹{currentPlan.price?.toLocaleString()}
                  <span className="text-xs text-htb-text-dim font-normal"> /{currentPlan.priceMode?.toLowerCase() || 'month'}</span>
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-htb-text-dim">Duration</span>
                  <span className="font-mono text-htb-text tabular-nums">{currentPlan.durationDays} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-htb-text-dim">Expires</span>
                  <span className="font-mono text-htb-text">{currentPlan.nextBillingDate}</span>
                </div>
              </div>

              {(currentPlan.name === 'MONTHLY' || currentPlan.name === 'YEARLY') && (
                <div className="rounded-md border border-neon/20 bg-neon/5 p-3">
                  <div className="text-[10px] font-mono uppercase tracking-widest font-semibold text-neon mb-1.5">
                    Plan Features
                  </div>
                  <div className="text-xs text-htb-muted space-y-0.5">
                    {currentPlan?.details && currentPlan?.details?.length > 0 ? (
                      currentPlan?.details.map((detail: string, index: number) => (
                        <div key={index}>• {detail}</div>
                      ))
                    ) : (
                      <div>• Unlimited challenges • Priority support • Advanced analytics</div>
                    )}
                  </div>
                </div>
              )}

              <Link href="/billing">
                <button className="w-full mt-2 py-2.5 rounded-md border border-danger/40 text-danger hover:bg-danger/10 hover:border-danger/60 transition-colors font-mono text-xs uppercase tracking-widest font-semibold">
                  Manage Subscription
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="terminal-eyebrow">subscription</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-htb-text-dim rounded-full"></div>
                <span className="text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-text-dim">
                  Free
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-htb-text">Free Plan</span>
                  <span className="px-2 py-0.5 rounded border border-htb-border bg-htb-panel-2 text-htb-muted text-[10px] font-mono uppercase tracking-widest font-semibold">
                    Basic
                  </span>
                </div>
                <span className="font-mono text-lg font-bold text-htb-text">
                  ₹0 <span className="text-xs text-htb-text-dim font-normal">/month</span>
                </span>
              </div>

              <div className="rounded-md border border-htb-border bg-htb-bg/40 p-3">
                <div className="text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-1.5">
                  Free Plan
                </div>
                <div className="text-xs text-htb-muted space-y-0.5">
                  <div>• Limited challenges per day</div>
                  <div>• Basic support</div>
                  <div>• Standard analytics</div>
                </div>
              </div>

              <div className="rounded-md border border-neon/30 bg-neon/5 p-3">
                <div className="text-[10px] font-mono uppercase tracking-widest font-semibold text-neon mb-1.5">
                  Upgrade to unlock
                </div>
                <div className="text-xs text-htb-muted">
                  • Unlimited challenges • Priority support • Advanced analytics
                </div>
              </div>

              <Link href="/billing">
                <button className="w-full mt-2 py-2.5 bg-neon text-white hover:shadow-neon-sm hover:-translate-y-0.5 transition-all font-mono text-xs uppercase tracking-widest font-semibold rounded-md">
                  Upgrade Plan
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileStats;
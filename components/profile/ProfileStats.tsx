"use client";

import useIsMounted from "@/hooks/useIsMounted";
import Link from "next/link";

const defaultStats = {
  solved: 0,
  total: 0,
  attempting: 0,
  difficulty: {
    easy: { count: 0, total: 0, color: 'text-[#00B8A3]', label: 'Easy' },
    medium: { count: 0, total: 0, color: 'text-[#FFC01E]', label: 'Med.' },
    hard: { count: 0, total: 0, color: 'text-[#FF375F]', label: 'Hard' }
  },

  
  plan: {
    name: "Standard",
    price: "160",
    nextBillingDate: "April 22, 2024"
  }
};

const ProfileStats = ({ organizedData, plan }: { organizedData: any, plan: any }) => {
  // console.log('📊 Organized Data:', organizedData);
  

  console.log('📊 Plan:', plan);
  const isMounted = useIsMounted();

  // Get the latest plan from payment history
  const getLatestPlan = () => {
    if (!plan || !Array.isArray(plan) || plan.length === 0) {
      return null; // Return null when no plan data
    }

    // Get the most recent plan (assuming the array is ordered by date)
    const latestPayment = plan[plan.length - 1];
    if (latestPayment?.plan) {
      return {
        name: latestPayment.plan.name,
        price: latestPayment.plan.price,
        priceMode: latestPayment.plan.priceMode,
        nextBillingDate: "Next month" // You can calculate this based on payment date
      };
    }

    return null; // Return null when no valid plan data
  };

  const currentPlan = getLatestPlan();

  // Calculate stats from organized data
  const stats = organizedData ? {
    solved: organizedData.total || 0,
    total: organizedData.total || 0, // You can adjust this based on your total available challenges
    attempting: 0, // You can calculate this if you have pending submissions
    difficulty: {
      easy: { 
        count: organizedData.easy?.length || 0, 
        total: organizedData.easy?.length || 0, // You can set this to total available easy challenges
        color: 'text-[#00B8A3]', 
        label: 'Easy' 
      },
      medium: { 
        count: organizedData.medium?.length || 0, 
        total: organizedData.medium?.length || 0, // You can set this to total available medium challenges
        color: 'text-[#FFC01E]', 
        label: 'Med.' 
      },
      hard: { 
        count: organizedData.hard?.length || 0, 
        total: organizedData.hard?.length || 0, // You can set this to total available hard challenges
        color: 'text-[#FF375F]', 
        label: 'Hard' 
      }
    },
    plan: currentPlan || defaultStats.plan
  } : defaultStats;

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl p-4 sm:p-6">
          <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6">
          <div className="h-[200px] bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Progress Circle */}
      <div className="bg-white rounded-xl p-4 sm:p-6">
        <div className="relative w-24 sm:w-32 h-24 sm:h-32 mx-auto">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background dots */}
            {Array.from({ length: 12 }).map((_, i) => (
              <circle
                key={i}
                cx={50 + 45 * Math.cos((i * 30 * Math.PI) / 180)}
                cy={50 + 45 * Math.sin((i * 30 * Math.PI) / 180)}
                r="2"
                fill={i % 3 === 0 ? '#00B8A3' : i % 3 === 1 ? '#FFC01E' : '#FF375F'}
              />
            ))}
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#eee"
              strokeWidth="10"
            />
            {/* Progress circles for each difficulty */}
            {(() => {
              const circumference = 283; // 2 * π * 45
              const totalChallenges = stats.difficulty.easy.count + stats.difficulty.medium.count + stats.difficulty.hard.count;
              
              if (totalChallenges === 0) return null;
              
              const easyLength = (stats.difficulty.easy.count / totalChallenges) * circumference;
              const mediumLength = (stats.difficulty.medium.count / totalChallenges) * circumference;
              const hardLength = (stats.difficulty.hard.count / totalChallenges) * circumference;
              
              let currentOffset = 0;
              
              return (
                <>
                  {/* Easy progress (green) */}
                  {stats.difficulty.easy.count > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#00B8A3"
                      strokeWidth="10"
                      strokeDasharray={`${easyLength} ${circumference}`}
                      strokeDashoffset={`-${currentOffset}`}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                  {currentOffset += easyLength}
                  
                  {/* Medium progress (yellow) */}
                  {stats.difficulty.medium.count > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#FFC01E"
                      strokeWidth="10"
                      strokeDasharray={`${mediumLength} ${circumference}`}
                      strokeDashoffset={`-${currentOffset}`}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                  {currentOffset += mediumLength}
                  
                  {/* Hard progress (red) */}
                  {stats.difficulty.hard.count > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#FF375F"
                      strokeWidth="10"
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
            <span className="text-3xl font-semibold">{stats.solved}</span>
            <span className="text-xs text-gray-500">/{stats.total}</span>
            <span className="text-xs text-gray-500">Solved</span>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex justify-center gap-4 sm:gap-8 flex-wrap">
          {Object.entries(stats.difficulty).map(([key, stat]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`${stat.color} text-sm sm:text-base`}>{stat.label}</span>
              <span className="text-gray-500 text-sm sm:text-base">
                {stat.count}/{stat.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl p-4 sm:p-6">
        {currentPlan ? (
          // Active Plan UI
          <>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-normal text-gray-700">Your Current Plan</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">Active</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1 h-full space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-semibold text-purple">{currentPlan.name}</span>
                    {currentPlan.name === 'ENTERPRISE' && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        Pro
                      </span>
                    )}
                  </div>
                  <span className="text-base sm:text-lg font-semibold">
                    ₹{currentPlan.price?.toLocaleString()} <span className="text-xs sm:text-sm text-gray-500 font-normal">/ {currentPlan.priceMode?.toLowerCase() || 'month'}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-500">Next Billing Date:</span>
                  <span className="font-medium">{currentPlan.nextBillingDate}</span>
                </div>
                {currentPlan.name === 'ENTERPRISE' && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                    <div className="text-xs text-purple-700 font-medium mb-1">Plan Features:</div>
                    <div className="text-xs text-purple-600">
                      • Unlimited challenges • Priority support • Advanced analytics
                    </div>
                  </div>
                )}
              </div>

              <Link href="/billing">
              <button className="w-full mt-2 sm:mt-4 py-2 sm:py-2.5 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                Manage Subscription
              </button>
              </Link>
            </div>
          </>
        ) : (
          // No Plan UI
          <>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-normal text-gray-700">Your Current Plan</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs text-gray-500 font-medium">Free</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex-1 h-full space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl font-semibold text-gray-600">Free Plan</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Basic
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-semibold text-gray-600">
                    ₹0 <span className="text-xs sm:text-sm text-gray-500 font-normal">/ month</span>
                  </span>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 font-medium mb-2">Free Plan Features:</div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• Limited challenges per day</div>
                    <div>• Basic support</div>
                    <div>• Standard analytics</div>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                  <div className="text-xs text-purple-700 font-medium mb-1">Upgrade to unlock:</div>
                  <div className="text-xs text-purple-600">
                    • Unlimited challenges • Priority support • Advanced analytics • Premium features
                  </div>
                </div>
              </div>

              <Link href="/billing">
              <button className="w-full mt-2 sm:mt-4 py-2 sm:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
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
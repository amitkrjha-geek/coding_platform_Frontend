"use client";

import useIsMounted from "@/hooks/useIsMounted";

const stats = {
  solved: 34,
  total: 343,
  attempting: 4,
  difficulty: {
    easy: { count: 8, total: 854, color: 'text-[#00B8A3]', label: 'Easy' },
    medium: { count: 22, total: 1790, color: 'text-[#FFC01E]', label: 'Med.' },
    hard: { count: 4, total: 793, color: 'text-[#FF375F]', label: 'Hard' }
  },
  plan: {
    name: "Standard",
    price: "160",
    nextBillingDate: "April 22, 2024"
  }
};

const ProfileStats = () => {
  const isMounted = useIsMounted();

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
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#00B8A3"
              strokeWidth="10"
              strokeDasharray={`${(stats.solved / stats.total) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold">{stats.solved}</span>
            <span className="text-xs text-gray-500">/{stats.total}</span>
            <span className="text-xs text-gray-500">Solved</span>
            {/* <span className="text-xs text-gray-400 mt-1">
              {stats.attempting} Attempting
            </span> */}
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
        <h2 className="text-base sm:text-lg font-normal text-gray-700 mb-3 sm:mb-4">Your Current Plan</h2>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex-1 h-full space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg sm:text-xl font-semibold text-purple">{stats.plan.name}</span>
              <span className="text-base sm:text-lg">
                ${stats.plan.price} <span className="text-xs sm:text-sm text-gray-500">/ month</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-500">Next Billing Date:</span>
              <span>{stats.plan.nextBillingDate}</span>
            </div>
          </div>

          <button className="w-full mt-2 sm:mt-4 py-1.5 sm:py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-50 transition-colors">
            Unsubscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
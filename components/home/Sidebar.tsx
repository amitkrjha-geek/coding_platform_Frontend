"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const trendingCompanies = [
  { name: "Amazon", count: "1771" },
  { name: "Meta", count: "1018" },
  { name: "Uber", count: "617" },
  { name: "Google", count: "1786" },
  { name: "Bloomberg", count: "928" },
  { name: "Apple", count: "710" },
  { name: "Oracle", count: "289" },
  { name: "Microsoft", count: "1059" },
  { name: "LinkedIn", count: "149" },
  { name: "TikTok", count: "424" },
  { name: "Adobe", count: "892" },
  { name: "Salesforce", count: "188" },
  { name: "Goldman Sachs", count: "222" },
  { name: "Walmart Labs", count: "155" },
  { name: "PayPal", count: "106" },
  { name: "Snap", count: "112" },
  { name: "Nvidia", count: "129" },
  { name: "IBM", count: "129" },
  { name: "Airbnb", count: "55" },
  { name: "DoorDash", count: "78" }
];

const difficultyStats = [
  { level: "Easy", count: 8, total: 834, color: "text-green-500" },
  { level: "Medium", count: 22, total: 1794, color: "text-yellow-500" },
  { level: "Hard", count: 4, total: 793, color: "text-red-500" }
];

const Sidebar = () => {
  return (
    <div className="w-[280px] space-y-8 py-8 pr-8">
      {/* Submissions Stats */}
      <div>
        <div className="relative w-32 h-32 mx-auto">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#eee"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#4CAF50"
              strokeWidth="10"
              strokeDasharray={`${(34/100) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold">34</span>
            <span className="text-xs text-gray-500">3437</span>
          </div>
        </div>
        
        {/* Difficulty Stats */}
        <div className="space-y-2 mt-6">
          {difficultyStats.map((stat) => (
            <div key={stat.level} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={stat.color}>{stat.level}</span>
                <span className="text-gray-400">{stat.count}/{stat.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div>
        <h3 className="text-lg font-medium mb-4">Trending Topics</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search for a company..."
            className="pl-9 bg-[#F8F9FA] border-0 mb-4"
          />
        </div>
        <div className="flex flex-wrap gap-y-4 gap-x-2">
          {trendingCompanies.map((company) => (
            <div
              key={company.name}
              className="flex items-center gap-x-2 bg-[#262626BF]/10 p-0.5 px-1.5 rounded-full group cursor-pointer"
            >
              <span className="text-sm font-medium group-hover:text-purple">
                {company.name}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-purple text-white">
                {company.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 
"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/redux/hooks";
import { useState, useMemo } from "react";



const difficultyStats = [
  { level: "Easy", count: 8, total: 834, color: "text-green-500" },
  { level: "Medium", count: 22, total: 1794, color: "text-yellow-500" },
  { level: "Hard", count: 4, total: 793, color: "text-red-500" }
];

const Sidebar = ({ selectedCompany, onCompanySelect }: {
  selectedCompany?: string | null,
  onCompanySelect?: (company: string | null) => void
}) => {
  const { companyStats, loading } = useAppSelector((state) => state.challenge);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort companies based on search query
  const filteredCompanies = useMemo(() => {
    return Object.entries(companyStats)
      .filter(([name]) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b[1] - a[1]); // Sort by count in descending order
  }, [companyStats, searchQuery]);

  return (
    <div className="w-[280px] space-y-8 py-8 pr-8">
      {/* Submissions Stats */}
      {/* <div>
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
              strokeDasharray={`${(34 / 100) * 283} 283`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold">34</span>
            <span className="text-xs text-gray-500">3437</span>
          </div>
        </div>

        Difficulty Stats
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
      </div> */}

      {/* Trending Companies */}
      <div>
        <h3 className="text-lg font-medium mb-4">Trending Companies</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search for a company..."
            className="pl-9 bg-[#F8F9FA] border-0 mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {loading ? (
            // Loading skeleton
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-24 bg-gray-200 animate-pulse rounded-full"
                />
              ))}
            </>
          ) : filteredCompanies.length === 0 ? (
            // No results message
            <div className="w-full text-center py-4">
              <p className="text-gray-500 text-sm">
                {searchQuery
                  ? `No companies found matching "${searchQuery}"`
                  : "No companies available"}
              </p>
            </div>
          ) : (
            // Actual company data
            filteredCompanies.map(([name, count]) => (
              <div
                key={name}
                className={`flex items-center gap-x-2 p-0.5 px-1.5 rounded-full group cursor-pointer transition-colors ${selectedCompany === name.toLowerCase()
                    ? 'bg-purple/20 ring-2 ring-purple'
                    : 'bg-[#262626BF]/10 hover:bg-[#262626BF]/20'
                  }`}
                onClick={() => {
                  const isCurrentlySelected = selectedCompany === name.toLowerCase();
                  onCompanySelect?.(isCurrentlySelected ? null : name.toLowerCase());
                }}
              >
                <span className={`text-sm font-medium capitalize ${selectedCompany === name.toLowerCase()
                    ? 'text-purple'
                    : 'group-hover:text-purple'
                  }`}>
                  {name}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full text-white ${selectedCompany === name.toLowerCase()
                    ? 'bg-purple'
                    : 'bg-purple'
                  }`}>
                  {count}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 
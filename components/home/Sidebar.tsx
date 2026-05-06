"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/redux/hooks";
import { useState, useMemo } from "react";
import TerminalEyebrow from "@/components/shared/TerminalEyebrow";


const difficultyStats = [
  { level: "Easy", count: 8, total: 834, color: "text-neon" },
  { level: "Medium", count: 22, total: 1794, color: "text-warn" },
  { level: "Hard", count: 4, total: 793, color: "text-danger" }
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

  // difficultyStats reserved for future stats card; suppress unused warning
  void difficultyStats;

  return (
    <div className="w-[280px] space-y-6 py-8 pr-2">
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
      <div className="panel p-5">
        <TerminalEyebrow className="mb-4">trending.companies</TerminalEyebrow>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-htb-text-dim w-4 h-4 pointer-events-none" />
          <Input
            placeholder="Search for a company..."
            className="pl-9 font-mono text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {loading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-24 bg-htb-panel-2 border border-htb-border animate-pulse rounded-md"
                />
              ))}
            </>
          ) : filteredCompanies.length === 0 ? (
            <div className="w-full text-center py-4">
              <p className="text-htb-text-dim text-sm font-mono">
                {searchQuery
                  ? `No matches for "${searchQuery}"`
                  : "No companies available"}
              </p>
            </div>
          ) : (
            filteredCompanies.map(([name, count]) => {
              const isSelected = selectedCompany === name.toLowerCase();
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onCompanySelect?.(isSelected ? null : name.toLowerCase());
                  }}
                  className={`group flex items-center gap-2 px-2 py-1 rounded-md border font-mono text-[11px] uppercase tracking-wider transition-all ${
                    isSelected
                      ? 'bg-neon/10 border-neon/50 text-neon shadow-neon-sm'
                      : 'bg-htb-bg border-htb-border text-htb-muted hover:border-htb-border-hover hover:text-htb-text'
                  }`}
                >
                  <span className="capitalize">{name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums ${
                      isSelected
                        ? 'bg-neon text-htb-bg'
                        : 'bg-htb-panel-2 text-htb-muted group-hover:bg-htb-panel-hover'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 
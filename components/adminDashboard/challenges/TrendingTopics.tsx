import { Input } from "@/components/ui/input";
import { TrendingCompany } from "@/types";
import { Search } from "lucide-react";
import { useState } from "react";

interface TrendingTopicsProps {
  companies: TrendingCompany[];
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
}

export const TrendingTopics = ({ companies, selectedCompany, setSelectedCompany }: TrendingTopicsProps) => {
  const [search, setSearch] = useState("");

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="panel p-4 2xl:p-5">
      <span className="terminal-eyebrow">trending.companies</span>
      <h2 className="text-base font-semibold text-htb-text mt-0.5 mb-4">
        Trending Topics
      </h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-htb-text-dim h-4 w-4 pointer-events-none" />
        <Input
          placeholder="Search for a company..."
          className="pl-10 font-mono text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredCompanies.map((company) => {
          const active = selectedCompany === company.name.toLowerCase();
          return (
            <button
              key={company.name}
              className={`group flex items-center gap-2 px-2 py-1 rounded-md border font-mono text-[11px] uppercase tracking-wider transition-all ${
                active
                  ? "bg-neon/10 border-neon/40 text-neon shadow-neon-sm"
                  : "bg-htb-bg border-htb-border text-htb-muted hover:border-htb-border-hover hover:text-htb-text"
              }`}
              onClick={() => setSelectedCompany(company.name.toLowerCase())}
            >
              <span className="capitalize">{company.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums ${
                active
                  ? "bg-neon text-white"
                  : "bg-htb-panel-2 text-htb-muted group-hover:bg-htb-panel-hover"
              }`}>
                {company.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

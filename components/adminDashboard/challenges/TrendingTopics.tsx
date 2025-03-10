
import { Input } from "@/components/ui/input";
import { TrendingCompany } from "@/types";
import { Search } from "lucide-react";
import { useState } from "react";

interface TrendingTopicsProps {
  companies: TrendingCompany[];
}

export const TrendingTopics = ({ companies }: TrendingTopicsProps) => {
  const [search, setSearch] = useState("");
  
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg p-2 2xl:p-4 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search for a company..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredCompanies.map((company) => (
          <div
            key={company.name}
            className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1"
          >
            <span className="text-xs 2xl:text-sm font-medium">{company.name}</span>
            <span className="text-xs bg-purple-600 text-white rounded-full px-2 py-0.5">
              {company.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
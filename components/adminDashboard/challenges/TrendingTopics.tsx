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
          <button
            key={company.name}
            className={`flex items-center gap-1 rounded-full px-3 py-1 border transition ${
              selectedCompany === company.name.toLowerCase()
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-purple-100"
            }`}
            onClick={() => setSelectedCompany(company.name.toLowerCase())}
          >
            <span className="text-xs 2xl:text-sm font-medium">{company.name}</span>
            <span className={`text-xs rounded-full px-2 py-0.5 ${
              selectedCompany === company.name.toLowerCase()
                ? "bg-white text-purple-700"
                : "bg-purple-600 text-white"
            }`}>
              {company.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
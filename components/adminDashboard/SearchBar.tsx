import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative">
          <h3 className="text-[#7E22CE] font-semibold text-sm">Search</h3>
      <Search className="absolute right-3 top-8 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
       className="border-[#7E22CE] focus:ring-none "
      />
    </div>
   
  );
};

export default SearchBar;

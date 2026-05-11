import { Search } from "lucide-react";
import { Input } from "../ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative">
      <h3 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-1.5">
        Search
      </h3>
      <Search className="absolute right-3 top-8 h-4 w-4 text-htb-text-dim pointer-events-none" />
      <Input
        placeholder="Search by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-sm"
      />
    </div>
  );
};

export default SearchBar;

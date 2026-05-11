import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const SortSelect = ({ value, onChange }: SortSelectProps) => {
  return (
    <div>
      <h3 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-1.5">
        Sort By
      </h3>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="font-mono text-xs uppercase tracking-wider">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="id_asc">ID (Ascending)</SelectItem>
          <SelectItem value="id_desc">ID (Descending)</SelectItem>
          <SelectItem value="name_asc">Name (A-Z)</SelectItem>
          <SelectItem value="name_desc">Name (Z-A)</SelectItem>
          <SelectItem value="date_asc">Join Date (Oldest)</SelectItem>
          <SelectItem value="date_desc">Join Date (Newest)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelect;

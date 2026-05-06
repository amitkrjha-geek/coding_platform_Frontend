import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  subscriptionOptions: string[];
}

const CategoryFilter = ({ value, onChange, subscriptionOptions }: CategoryFilterProps) => {
  return (
    <div>
      <h3 className="text-[10px] font-mono uppercase tracking-widest font-semibold text-htb-muted mb-1.5">
        Category
      </h3>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="font-mono text-xs uppercase tracking-wider">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {subscriptionOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;

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
  
  const CategoryFilter = ({ value, onChange,subscriptionOptions }: CategoryFilterProps) => {
    return (
      <div>
        <h3 className="text-[#7E22CE] font-semibold text-sm">Category</h3>
  
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className=" border-[#7E22CE] focus:ring-none">
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
  
import * as React from "react";
import { cn } from "@/lib/utils";

// Remove empty interface and use type instead
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-htb-border bg-htb-panel px-3 py-2 text-sm text-htb-text ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-htb-text-dim placeholder:font-mono placeholder:text-xs placeholder:tracking-wide outline-none transition-colors hover:border-htb-border-hover focus-visible:border-neon/60 focus-visible:ring-1 focus-visible:ring-neon/40 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input }; 
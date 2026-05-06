import { cn } from "@/lib/utils";

interface NeonDividerProps {
  className?: string;
  withDiamond?: boolean;
  label?: string;
}

export const NeonDivider = ({
  className,
  withDiamond = true,
  label,
}: NeonDividerProps) => {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn(
        "relative flex items-center justify-center w-full",
        className
      )}
    >
      <span className="flex-1 h-px bg-gradient-to-r from-transparent via-htb-border to-transparent" />
      {withDiamond && (
        <span className="mx-3 inline-flex items-center justify-center">
          {label ? (
            <span className="terminal-eyebrow px-3 py-1 rounded border border-htb-border bg-htb-panel">
              {label}
            </span>
          ) : (
            <span className="block w-2 h-2 rotate-45 bg-neon shadow-neon-sm" />
          )}
        </span>
      )}
      <span className="flex-1 h-px bg-gradient-to-r from-transparent via-htb-border to-transparent" />
    </div>
  );
};

export default NeonDivider;

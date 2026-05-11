import { cn } from "@/lib/utils";

interface TerminalEyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  cursor?: boolean;
}

export const TerminalEyebrow = ({
  className,
  children,
  cursor = false,
  ...props
}: TerminalEyebrowProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon",
        className
      )}
      {...props}
    >
      <span className="text-htb-text-dim">&gt;</span>
      <span>{children}</span>
      {cursor && (
        <span
          aria-hidden
          className="inline-block w-[7px] h-[14px] bg-neon align-middle animate-terminal-blink"
        />
      )}
    </span>
  );
};

export default TerminalEyebrow;

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  variant?: "default" | "neon" | "violet";
  withGlow?: boolean;
  withScanline?: boolean;
}

export const GridBackground = ({
  className,
  variant = "default",
  withGlow = true,
  withScanline = false,
}: GridBackgroundProps) => {
  const glow =
    variant === "neon"
      ? "bg-radial-glow"
      : variant === "violet"
      ? "bg-radial-glow-violet"
      : "bg-radial-glow";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 section-grid-bg" />
      {withGlow && (
        <div className={cn("absolute inset-x-0 top-0 h-[480px]", glow)} />
      )}
      {withScanline && (
        <div className="absolute inset-0 scanline-bg" />
      )}
    </div>
  );
};

export default GridBackground;

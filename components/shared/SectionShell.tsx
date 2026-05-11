import { cn } from "@/lib/utils";

interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "header" | "main" | "footer";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  spacing?: "none" | "sm" | "md" | "lg";
  bleed?: boolean;
}

const sizeMap = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1440px]",
  full: "max-w-none",
};

const spacingMap = {
  none: "py-0",
  sm: "py-8 sm:py-12",
  md: "py-12 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-24 lg:py-32",
};

export const SectionShell = ({
  as: Tag = "section",
  size = "lg",
  spacing = "md",
  bleed = false,
  className,
  children,
  ...props
}: SectionShellProps) => {
  return (
    <Tag
      className={cn(
        "relative w-full",
        spacingMap[spacing],
        bleed ? "" : "px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      <div className={cn("mx-auto w-full", sizeMap[size])}>{children}</div>
    </Tag>
  );
};

export default SectionShell;

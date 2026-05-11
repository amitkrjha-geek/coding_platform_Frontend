import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-htb-border text-htb-text",
        // HTB status variants
        neon:
          "border-neon/30 bg-neon/10 text-neon",
        easy:
          "border-neon/30 bg-neon/10 text-neon",
        medium:
          "border-warn/30 bg-warn/10 text-warn",
        hard:
          "border-danger/30 bg-danger/10 text-danger",
        info:
          "border-sky-400/30 bg-sky-400/10 text-sky-300",
        violet:
          "border-purple-500/30 bg-purple-500/10 text-purple-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

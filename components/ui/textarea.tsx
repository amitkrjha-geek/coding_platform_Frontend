import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-htb-border bg-htb-panel px-3 py-2 text-base text-htb-text shadow-panel placeholder:text-htb-text-dim placeholder:font-mono placeholder:text-xs placeholder:tracking-wide transition-colors hover:border-htb-border-hover focus-visible:outline-none focus-visible:border-neon/60 focus-visible:ring-1 focus-visible:ring-neon/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  value: number;
  label?: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

/**
 * Visual count-up. The `value` is purely cosmetic — pass it from existing
 * Redux/state. No data fetching is performed here.
 */
export const StatCounter = ({
  value,
  label,
  suffix,
  prefix,
  duration = 1200,
  className,
  labelClassName,
  valueClassName,
}: StatCounterProps) => {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const animate = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplay(Math.round(value * eased));
              if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn(
          "font-mono font-bold text-3xl sm:text-4xl text-htb-text tabular-nums",
          valueClassName
        )}
      >
        {prefix}
        {display.toLocaleString()}
        {suffix}
      </div>
      {label && (
        <div
          className={cn(
            "font-mono text-[11px] uppercase tracking-widest text-htb-muted",
            labelClassName
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
};

export default StatCounter;

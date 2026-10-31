import * as React from "react";
import { cn } from "@/lib/utils";

const TONE = {
  accent: "var(--accent)",
  success: "var(--success)",
  danger: "var(--danger)",
} as const;

export type ProgressTone = keyof typeof TONE;

const VIEWBOX = 100;

/**
 * Circular progress. `value` and `max` are counts; the center shows `children`.
 * With `label` it is announced as a progressbar, otherwise it is decorative.
 */
export function ProgressRing({
  value,
  max = 100,
  label,
  tone = "accent",
  thickness = 9,
  className,
  children,
}: {
  value: number;
  max?: number;
  label?: string;
  tone?: ProgressTone;
  /** Stroke width relative to a 100-unit ring. */
  thickness?: number;
  /** Size via `size-*`; defaults to size-20. */
  className?: string;
  children?: React.ReactNode;
}) {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  const radius = (VIEWBOX - thickness) / 2;
  const length = 2 * Math.PI * radius;
  const a11y = label
    ? {
        role: "progressbar" as const,
        "aria-label": label,
        "aria-valuemin": 0,
        "aria-valuemax": max,
        "aria-valuenow": Math.min(value, max),
      }
    : { "aria-hidden": true };

  return (
    <div {...a11y} className={cn("relative size-20 shrink-0", className)}>
      <svg
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="size-full -rotate-90"
        aria-hidden
      >
        <circle
          cx={VIEWBOX / 2}
          cy={VIEWBOX / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-hover)"
          strokeWidth={thickness}
        />
        <circle
          cx={VIEWBOX / 2}
          cy={VIEWBOX / 2}
          r={radius}
          fill="none"
          stroke={TONE[tone]}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={length * (1 - ratio)}
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      {children ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          aria-hidden
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Thin horizontal bar. Pass `label` unless the number is already written next to it. */
export function ProgressBar({
  value,
  max = 100,
  label,
  tone = "accent",
  size = "sm",
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  tone?: ProgressTone;
  size?: "sm" | "md";
  className?: string;
}) {
  const pct = max > 0 ? Math.min(Math.max(value / max, 0), 1) * 100 : 0;
  const a11y = label
    ? {
        role: "progressbar" as const,
        "aria-label": label,
        "aria-valuemin": 0,
        "aria-valuemax": max,
        "aria-valuenow": Math.min(value, max),
      }
    : { "aria-hidden": true };

  return (
    <div
      {...a11y}
      className={cn(
        "w-full overflow-hidden rounded-full bg-[var(--surface-hover)]",
        size === "sm" ? "h-1.5" : "h-2.5",
        className,
      )}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
        style={{
          width: `${value > 0 ? Math.max(pct, 2) : 0}%`,
          backgroundColor: TONE[tone],
        }}
      />
    </div>
  );
}

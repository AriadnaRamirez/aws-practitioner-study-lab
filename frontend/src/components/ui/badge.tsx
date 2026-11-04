import * as React from "react";
import { cn } from "@/lib/utils";

const TONE = {
  neutral: "bg-[var(--surface-hover)] text-[var(--foreground-muted)]",
  accent:
    "bg-[var(--accent-soft)] text-[var(--foreground)] [&>svg]:text-[var(--accent)]",
  success: "status-success [&>svg]:text-[var(--success-text)]",
  danger: "status-danger [&>svg]:text-[var(--danger-text)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning-text)]",
} as const;

type BadgeTone = keyof typeof TONE;

/** Short status tag: "Activo", "Admin", "Nuevo", "3 días". */
export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold [&>svg]:size-3",
        TONE[tone],
        className,
      )}
      {...props}
    />
  );
}

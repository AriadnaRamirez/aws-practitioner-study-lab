import * as React from "react";
import { cn } from "@/lib/utils";

const DOT = {
  accent: "bg-[var(--accent)]",
  success: "bg-[var(--success)]",
  danger: "bg-[var(--danger)]",
  warning: "bg-[var(--warning)]",
} as const;

/**
 * One number with its label. Render inside a `<dl>`; a grid of these is the
 * standard way to show a summary (sessions, accuracy, streak…).
 */
export function Stat({
  label,
  value,
  hint,
  tone,
  align = "start",
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  hint?: React.ReactNode;
  /** Small colored dot before the label. */
  tone?: keyof typeof DOT;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col-reverse rounded-xl bg-[var(--surface-elevated)] px-3 py-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <dt className="mt-1.5 flex items-center gap-1.5 text-xs leading-tight text-[var(--foreground-muted)]">
        {tone ? (
          <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", DOT[tone])} />
        ) : null}
        {label}
      </dt>
      <dd className="text-2xl font-extrabold leading-none tracking-tight tabular-nums text-[var(--foreground)]">
        {value}
        {hint ? (
          <span className="ml-1 text-xs font-medium tracking-normal text-[var(--foreground-muted)]">
            {hint}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

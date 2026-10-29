import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Admin design primitives: same palette as the study app, quieter and denser.
 * No thin borders; separation comes from surface tones.
 */

export const ADMIN_CARD =
  "min-w-0 rounded-2xl bg-[var(--surface)] p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]";

export const ADMIN_LABEL =
  "text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground-muted)]";

export const ADMIN_INPUT =
  "h-10 w-full rounded-lg bg-[var(--surface-elevated)] px-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-50";

export const ADMIN_TEXTAREA =
  "min-h-24 w-full rounded-lg bg-[var(--surface-elevated)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

const BUTTON_BASE =
  "inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50";

export const ADMIN_BUTTON = {
  primary: cn(BUTTON_BASE, "bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]"),
  secondary: cn(BUTTON_BASE, "bg-[var(--surface-elevated)] text-[var(--foreground)] hover:bg-[var(--surface-hover)]"),
  ghost: cn(BUTTON_BASE, "text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"),
  danger: cn(BUTTON_BASE, "bg-red-500/15 text-red-200 hover:bg-red-500/25"),
} as const;

/** Table: header row on elevated surface, zebra body rows, no borders. */
export const ADMIN_TABLE = {
  wrap: "overflow-x-auto rounded-2xl bg-[var(--surface)]",
  table: "min-w-full text-left text-sm tabular-nums",
  thead: "bg-[var(--surface-elevated)] text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground-muted)]",
  th: "whitespace-nowrap px-4 py-2.5 font-semibold",
  tr: "even:bg-[color-mix(in_srgb,var(--surface-elevated)_45%,transparent)] hover:bg-[var(--surface-hover)]",
  td: "px-4 py-2.5 align-middle",
} as const;

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-[var(--foreground-muted)]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function AdminSection({
  title,
  description,
  actions,
  className,
  children,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn(ADMIN_CARD, className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const BADGE_TONES = {
  neutral: "bg-[var(--surface-elevated)] text-[var(--foreground-muted)]",
  accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
  success: "bg-emerald-500/15 text-emerald-300",
  danger: "bg-red-500/15 text-red-300",
  warning: "bg-amber-500/15 text-amber-200",
} as const;

export function AdminBadge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof BADGE_TONES;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
        BADGE_TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

export function AdminEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-[var(--surface)] px-5 py-8 text-center text-sm text-[var(--foreground-muted)]">
      {children}
    </div>
  );
}

export function AdminNotice({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "danger" | "success" | "warning";
  children: ReactNode;
}) {
  const tones = {
    neutral: "bg-[var(--surface-elevated)] text-[var(--foreground)]",
    danger: "bg-red-500/10 text-red-200",
    success: "bg-emerald-500/10 text-emerald-200",
    warning: "bg-amber-500/10 text-amber-100",
  } as const;
  return (
    <p
      role={tone === "danger" ? "alert" : "status"}
      className={cn("rounded-xl px-4 py-2.5 text-sm", tones[tone])}
    >
      {children}
    </p>
  );
}

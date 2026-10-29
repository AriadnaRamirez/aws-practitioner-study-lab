import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-elevated)]";

/** Secondary text action inside a tile ("Ver podio"). */
export const tileLinkClass = cn(
  "inline-flex items-center gap-1 rounded-md text-sm font-semibold text-[var(--accent)] underline-offset-4 transition-colors hover:text-[var(--accent-hover)] hover:underline",
  focusRing,
);

/** Compact pill action inside a tile ("Practicar"). */
export const tilePillClass = cn(
  "inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] px-3.5 text-xs font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
  focusRing,
);

export function DashboardTile({
  id,
  title,
  icon,
  children,
  className,
}: {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "flex min-w-0 flex-col rounded-2xl bg-[var(--surface-elevated)] p-5 sm:p-6",
        className,
      )}
    >
      <h3
        id={id}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground-muted)]"
      >
        {icon ? (
          <span className="text-[var(--accent)]" aria-hidden>
            {icon}
          </span>
        ) : null}
        {title}
      </h3>
      <div className="mt-4 flex min-w-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

export function TileMessage({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
      {children}
    </p>
  );
}

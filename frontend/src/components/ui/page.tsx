import * as React from "react";
import { Mascot, type MascotPose } from "@/components/brand/mascot";
import { cn } from "@/lib/utils";

const WIDTH = {
  /** Forms and single-column flows (auth, account forms). */
  narrow: "max-w-md",
  /** Reading and single-column tools (guides, study hub, history). */
  default: "max-w-xl lg:max-w-3xl",
  /** Dashboards with grids (inicio, más falladas, admin). */
  wide: "max-w-xl md:max-w-5xl lg:max-w-6xl",
} as const;

/** Every screen's outer box: same gutters and vertical rhythm everywhere. */
export function PageContainer({
  width = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { width?: keyof typeof WIDTH }) {
  return (
    <div
      className={cn(
        "mx-auto w-full min-w-0 px-5 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12",
        WIDTH[width],
        className,
      )}
      {...props}
    />
  );
}

export const PAGE_TITLE =
  "text-3xl font-extrabold leading-[1.1] tracking-tight text-[var(--foreground)] sm:text-4xl";

/** Page title, one line of context and an optional mascot on the right. */
export function PageHeader({
  title,
  subtitle,
  mascot,
  actions,
  id,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  mascot?: MascotPose;
  /** Buttons under the subtitle. */
  actions?: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <header className={cn("flex items-center justify-between gap-4", className)}>
      <div className="min-w-0">
        <h1 id={id} className={PAGE_TITLE}>
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-prose text-base text-[var(--foreground-muted)]">
            {subtitle}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-5 flex flex-wrap items-center gap-3">{actions}</div>
        ) : null}
      </div>
      {mascot ? (
        <Mascot
          pose={mascot}
          size="lg"
          glow={false}
          className="h-28 w-32 shrink-0 sm:h-44 sm:w-52 lg:h-56 lg:w-64"
        />
      ) : null}
    </header>
  );
}

export const SECTION_TITLE =
  "font-display text-lg font-semibold tracking-tight text-[var(--foreground)] lg:text-xl";

/** h2 for a block of the page, with an optional count. */
export function SectionTitle({
  count,
  className,
  children,
  as: Tag = "h2",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  count?: number;
  as?: "h2" | "h3";
}) {
  return (
    <Tag className={cn(SECTION_TITLE, className)} {...props}>
      {children}
      {count !== undefined ? (
        <span className="ml-2 text-sm font-medium tabular-nums text-[var(--foreground-muted)]">
          {count}
        </span>
      ) : null}
    </Tag>
  );
}

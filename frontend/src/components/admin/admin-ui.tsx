import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/shell/breadcrumbs";
import { BENTO_GAP } from "@/components/ui/bento";
import { Card, cardVariants } from "@/components/ui/card";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/**
 * Admin building blocks on top of the shared primitives: same cards, buttons
 * and type scale as the study app, a little denser.
 */

export const FIELD_LABEL = "text-sm font-medium text-[var(--foreground)]";

const FIELD =
  "w-full bg-[var(--surface-elevated)] text-sm text-[var(--foreground)] transition-[background-color] placeholder:text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] focus-visible:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50";

/** Native selects render their popup with the OS scheme unless told otherwise. */
export const ADMIN_SELECT = cn(FIELD, "h-12 rounded-full px-5 [color-scheme:dark]");

export const ADMIN_TEXTAREA = cn(FIELD, "min-h-24 rounded-xl px-5 py-3");

/** Table: header row on elevated surface, zebra body rows, no borders. */
export const ADMIN_TABLE = {
  wrap: cn(cardVariants({ padding: "none" }), "overflow-x-auto"),
  table: "min-w-full text-left text-sm tabular-nums",
  thead: "bg-[var(--surface-elevated)] text-xs text-[var(--foreground-muted)]",
  th: "whitespace-nowrap px-4 py-2.5 font-semibold",
  tr: "even:bg-[color-mix(in_srgb,var(--surface-elevated)_45%,transparent)] hover:bg-[var(--surface-hover)]",
  td: "px-4 py-2.5 align-middle",
} as const;

/**
 * Admin bento: KPI tiles two per row up to xl, then 12 tracks (KPIs take 3, charts 8 + side panel 4,
 * tables 6 + 6). Same gaps as the study app grid; phones keep the tighter KPI gap.
 */
export const ADMIN_GRID = cn("grid grid-cols-2 xl:grid-cols-12", BENTO_GAP, "gap-3 sm:gap-4");

/** Page root for every admin screen: breadcrumbs, title and the content below. */
export function AdminPage({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <PageContainer width="wide">
      <Breadcrumbs scope="admin" />
      <PageHeader title={title} subtitle={description} actions={actions} />
      <div className="mt-8 space-y-6">{children}</div>
    </PageContainer>
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
    <Card as="section" className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      {/* Stretched in a grid row, the body fills the card so a trailing `mt-auto` action sits at the bottom. */}
      <div className="mt-4 flex min-w-0 flex-1 flex-col">{children}</div>
    </Card>
  );
}

/** Client-loaded admin list or table: placeholder rows plus what is loading for screen readers. */
export function AdminSkeleton({ message, rows = 5 }: { message: string; rows?: number }) {
  return (
    <Card padding="none" className="overflow-hidden" aria-busy="true">
      <p className="sr-only" role="status">
        {message}
      </p>
      <div aria-hidden>
        <div className="flex gap-6 bg-[var(--surface-elevated)] px-4 py-3">
          <Skeleton className="block h-3.5 w-16" />
          <Skeleton className="block h-3.5 w-28" />
          <Skeleton className="ml-auto block h-3.5 w-20" />
        </div>
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-6 px-4 py-3">
            <Skeleton className="block h-4 w-10" />
            <Skeleton className="block h-4 w-1/3" />
            <Skeleton className="ml-auto block h-4 w-12" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AdminEmpty({ children }: { children: ReactNode }) {
  return (
    <Card
      padding="none"
      className="px-5 py-8 text-center text-sm text-[var(--foreground-muted)]"
    >
      {children}
    </Card>
  );
}

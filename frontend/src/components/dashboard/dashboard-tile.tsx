import type { ReactNode } from "react";
import { Card, CardLabel } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { cn } from "@/lib/utils";

/** Secondary text action inside a tile ("Ir a Cuenta"). */
export const tileLinkClass = cn(
  "inline-flex items-center gap-1 rounded-md text-sm font-semibold text-[var(--accent)] underline-offset-4 transition-colors hover:text-[var(--accent-hover)] hover:underline",
  FOCUS_RING,
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
    <Card
      as="section"
      aria-labelledby={id}
      className={cn("flex flex-col", className)}
    >
      <CardLabel id={id} icon={icon}>
        {title}
      </CardLabel>
      <div className="mt-4 flex min-w-0 flex-1 flex-col">{children}</div>
    </Card>
  );
}

/** Loading body of a tile: skeleton shaped like its content plus what is loading, for screen readers. */
export function TileLoading({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div aria-busy="true" className="min-w-0">
      <span className="sr-only">{label}</span>
      <div aria-hidden>{children}</div>
    </div>
  );
}

export function TileMessage({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
      {children}
    </p>
  );
}

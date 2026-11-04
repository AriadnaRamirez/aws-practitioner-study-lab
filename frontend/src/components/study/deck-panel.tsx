import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A card standing on a small deck: the "Nueva partida" look, shared by every screen that starts a
 * round. The body grows (push settings down with `mt-auto`); the footer holds the start action.
 */
export function DeckPanel({
  id,
  title,
  subtitle,
  children,
  footer,
  className,
  ...props
}: {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  footer: ReactNode;
  className?: string;
  "data-tour"?: string;
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "relative flex flex-1 flex-col pb-3 animate-deck-in",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="absolute inset-x-6 bottom-0 top-6 rounded-2xl bg-[var(--surface-hover)] opacity-35"
      />
      <div
        aria-hidden
        className="absolute inset-x-3 bottom-1.5 top-3 rounded-2xl bg-[var(--surface-hover)] opacity-70 shadow-[var(--shadow-float)]"
      />

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-[var(--deck-face)] shadow-[var(--shadow-float)]">
        <div className="flex flex-1 flex-col px-5 pb-5 pt-6 sm:px-6">
          <h2
            id={id}
            className="text-3xl font-extrabold leading-none tracking-tight text-[var(--foreground)] sm:text-4xl"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2.5 text-sm text-[var(--foreground-muted)]">
              {subtitle}
            </p>
          ) : null}
          {children}
        </div>

        <div className="bg-[var(--card-face)] px-5 py-4 sm:px-6">{footer}</div>
      </div>
    </section>
  );
}

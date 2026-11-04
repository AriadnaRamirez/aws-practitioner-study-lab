"use client";

import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type FlashDeckProps = {
  /** Label on the face (e.g. variant). */
  eyebrow?: string;
  /** Main stem / question. */
  title: string;
  /** Footer meta (e.g. progress). */
  footer?: string;
  /** How many cards peek behind (1–2). */
  depth?: 1 | 2;
  /** Loading skeleton face. */
  loading?: boolean;
  /** Flip to the result face. */
  flipped?: boolean;
  /** Back-face content (result + explanation). */
  back?: ReactNode;
  /** Landscape card on desktop and short landscape: question left, choices right. */
  wide?: boolean;
  className?: string;
  children?: ReactNode;
};

const WIDE_GRID =
  "lg:grid lg:grid-cols-2 [@media(max-height:500px)]:md:grid [@media(max-height:500px)]:md:grid-cols-2";

/**
 * Mazo de cards apiladas con flip 3D a la cara de resultado.
 */
export function FlashDeck({
  eyebrow = "Carta",
  title,
  footer,
  depth = 2,
  loading = false,
  flipped = false,
  back,
  wide = false,
  className,
  children,
}: FlashDeckProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-md min-w-0 animate-deck-in lg:max-w-lg",
        wide && "lg:max-w-4xl [@media(max-height:500px)]:md:max-w-none",
        className,
      )}
      style={{ minHeight: "17.5rem", perspective: "1400px" }}
    >
      {depth >= 2 ? (
        <div
          aria-hidden
          className="absolute inset-x-3 top-3 bottom-1 rounded-xl"
          style={{
            background: "var(--deck-back)",
            transform: "translate(6px, 8px)",
            opacity: flipped ? 0.25 : 0.7,
            zIndex: 0,
            transition: "opacity 0.4s ease",
          }}
        />
      ) : null}
      {depth >= 1 ? (
        <div
          aria-hidden
          className="absolute inset-x-1.5 top-1.5 bottom-0.5 rounded-xl"
          style={{
            background: "var(--deck-mid)",
            transform: "translate(3px, 4px)",
            opacity: flipped ? 0.35 : 0.95,
            zIndex: 1,
            transition: "opacity 0.4s ease",
          }}
        />
      ) : null}

      <div
        className={cn(
          "relative z-[2] grid w-full transition-transform duration-700 ease-[cubic-bezier(0.4,0.15,0.2,1)]",
          flipped && "[transform:rotateY(180deg)]",
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        <article
          className={cn(
            "col-start-1 row-start-1 overflow-hidden rounded-2xl shadow-[var(--shadow-float)]",
            wide && WIDE_GRID,
            flipped && "pointer-events-none",
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div
            className={cn(
              "relative px-5 pb-6 pt-5",
              wide && "lg:px-7 lg:pb-7 lg:pt-6",
              loading && "animate-shimmer",
            )}
            style={{
              background: loading ? "var(--deck-mid)" : "var(--deck-face)",
              minHeight: "9.5rem",
            }}
          >
            <p className="text-xs font-semibold text-[var(--foreground-muted)]">
              {eyebrow}
            </p>
            <h2
              className={cn(
                "font-display mt-4 text-xl font-bold leading-snug tracking-tight text-[var(--foreground)] [overflow-wrap:anywhere] sm:text-2xl",
                wide && "[@media(max-height:500px)]:md:mt-3 [@media(max-height:500px)]:md:text-xl",
              )}
            >
              {loading ? <Skeleton className="h-7 w-4/5" /> : title}
            </h2>
          </div>

          <div
            className={cn(
              "bg-[var(--card-face)] px-5 py-4 text-[var(--card-face-fg)]",
              wide &&
                "lg:flex lg:flex-col lg:justify-center lg:px-6 lg:py-5 [@media(max-height:500px)]:md:flex [@media(max-height:500px)]:md:flex-col [@media(max-height:500px)]:md:justify-center",
            )}
          >
            {footer ? (
              <p className="text-xs font-medium text-[color-mix(in_srgb,var(--card-face-fg)_55%,transparent)]">
                {footer}
              </p>
            ) : null}
            {children}
          </div>
        </article>

        <article
          aria-hidden={!flipped}
          className={cn(
            "col-start-1 row-start-1 flex min-h-full flex-col overflow-hidden rounded-2xl bg-[var(--deck-face)] shadow-[var(--shadow-float)]",
            flipped ? "pointer-events-auto" : "pointer-events-none",
          )}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className={cn(
              "relative flex flex-1 flex-col px-5 py-5",
              wide && "lg:px-7 lg:py-6",
            )}
          >
            {back}
          </div>
        </article>
      </div>
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FlashDeckProps = {
  /** Label on the gradient face (e.g. variant). */
  eyebrow?: string;
  /** Main stem / question. */
  title: string;
  /** Footer meta (e.g. progress). */
  footer?: string;
  /** How many cards peek behind (1–2). */
  depth?: 1 | 2;
  /** Loading skeleton face. */
  loading?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * Mazo de 3 cards apiladas — caras planas AWS (naranja / squid ink).
 * Front card = pregunta; las de atrás dan sensación de deck.
 */
export function FlashDeck({
  eyebrow = "FLASH",
  title,
  footer,
  depth = 2,
  loading = false,
  className,
  children,
}: FlashDeckProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-md min-w-0 overflow-hidden animate-deck-in",
        className,
      )}
      style={{ minHeight: "17.5rem" }}
    >
      {/* Back cards — kept inside the box (no page overflow) */}
      {depth >= 2 ? (
        <div
          aria-hidden
          className="absolute inset-x-3 top-3 bottom-1 rounded-xl ring-1 ring-white/5"
          style={{
            background: "var(--deck-back)",
            transform: "translate(6px, 8px)",
            opacity: 0.7,
            zIndex: 0,
          }}
        />
      ) : null}
      {depth >= 1 ? (
        <div
          aria-hidden
          className="absolute inset-x-1.5 top-1.5 bottom-0.5 rounded-xl ring-1 ring-white/8"
          style={{
            background: "var(--deck-mid)",
            transform: "translate(3px, 4px)",
            opacity: 0.95,
            zIndex: 1,
          }}
        />
      ) : null}

      {/* Front card */}
      <article
        className="relative z-[2] overflow-hidden rounded-2xl ring-1 ring-black/20"
        style={{
          boxShadow: "0 18px 36px -18px rgba(0, 0, 0, 0.55)",
        }}
      >
        <div
          className={cn(
            "relative px-5 pb-6 pt-5",
            loading && "animate-shimmer",
          )}
          style={{
            background: loading ? "var(--deck-mid)" : "var(--deck-face)",
            minHeight: "9.5rem",
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-foreground)]/80">
              {eyebrow}
            </p>
            <span
              aria-hidden
              className="inline-flex size-7 items-center justify-center rounded-full border border-black/25 text-[var(--accent-foreground)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3l7 3v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </span>
          </div>
          <h2 className="font-display mt-4 text-xl font-bold leading-snug tracking-tight text-[var(--accent-foreground)] sm:text-2xl">
            {loading ? (
              <span className="inline-block h-7 w-4/5 rounded bg-black/20" />
            ) : (
              title
            )}
          </h2>
        </div>

        <div
          className="px-5 py-4"
          style={{
            background: "var(--card-face)",
            color: "var(--card-face-fg)",
          }}
        >
          {footer ? (
            <p className="text-xs font-medium text-black/55">{footer}</p>
          ) : null}
          {children}
        </div>
      </article>
    </div>
  );
}

/** Decorative static deck for landing / empty states. */
export function FlashDeckShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto h-64 w-full max-w-xs min-w-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <div
        className="absolute left-6 top-8 h-44 w-40 rounded-2xl ring-1 ring-white/5"
        style={{
          background: "var(--deck-back)",
          transform: "rotate(-8deg)",
          opacity: 0.85,
        }}
      />
      <div
        className="absolute left-14 top-4 h-48 w-44 rounded-2xl ring-1 ring-white/8"
        style={{
          background: "var(--deck-mid)",
          transform: "rotate(3deg)",
        }}
      />
      <div
        className="absolute left-10 top-0 flex h-52 w-48 flex-col overflow-hidden rounded-2xl ring-1 ring-black/15"
        style={{
          background: "var(--deck-face)",
          boxShadow: "0 22px 40px -18px rgba(0, 0, 0, 0.55)",
          transform: "rotate(-2deg)",
        }}
      >
        <div className="flex flex-1 flex-col p-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-foreground)]/75">
            AWS Lab
          </span>
          <span className="font-display mt-auto text-lg font-bold text-[var(--accent-foreground)]">
            Flash MCQ
          </span>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-xs font-semibold text-black">Listo para estudiar</p>
          <p className="mt-0.5 text-[11px] text-black/50">
            10 cartas · miss-repeat
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/** Civil YYYY-MM-DD → days from today (viewer local midnight). */
export function daysUntilExam(examDate: string, now = new Date()): number {
  const [y, m, d] = examDate.split("-").map(Number);
  if (!y || !m || !d) return NaN;
  const target = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function formatLongDate(examDate: string, locale = "es-MX"): string {
  const [y, m, d] = examDate.split("-").map(Number);
  if (!y || !m || !d) return examDate;
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  examDate: string | null | undefined;
  className?: string;
  /** Compact strip vs full panel. */
  compact?: boolean;
};

/**
 * Mini calendario + contador hacia el examen CLF.
 */
export function ExamCountdown({ examDate, className, compact }: Props) {
  const days = useMemo(
    () => (examDate ? daysUntilExam(examDate) : null),
    [examDate],
  );

  if (!examDate || days === null || Number.isNaN(days)) {
    return (
      <aside
        className={cn(
          "glass-pill w-full justify-start px-4 py-3 text-sm",
          className,
        )}
      >
        <Link href="/cuenta" className="hover:text-[var(--foreground)]">
          Agregar fecha
        </Link>
      </aside>
    );
  }

  const cal = examDate.split("-");
  const dayNum = Number(cal[2]);
  const monthShort = (() => {
    const [y, m, d] = examDate.split("-").map(Number);
    if (!y || !m || !d) return "—";
    return new Date(y, m - 1, d).toLocaleDateString("es-MX", {
      month: "short",
    });
  })();

  let headline: string;
  if (days > 1) {
    headline = compact ? `Faltan ${days} días` : `Faltan ${days} días para el examen`;
  } else if (days === 1) {
    headline = "Mañana es el examen";
  } else if (days === 0) {
    headline = "Examen hoy";
  } else {
    const ago = Math.abs(days);
    headline = ago === 1 ? "Examen ayer" : `Hace ${ago} días`;
  }

  return (
    <aside
      className={cn(
        "glass-pill flex w-full min-w-0 items-center justify-start gap-3 px-3 py-3 sm:gap-4 sm:px-4",
        className,
      )}
      aria-live="polite"
    >
      <div
        className={cn(
          "flex shrink-0 flex-col overflow-hidden rounded-2xl text-center",
          compact ? "w-12" : "w-14",
        )}
      >
        <div className="bg-[var(--surface-hover)] px-1 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--foreground)]">
          {(monthShort ?? "—").replace(/\.$/, "").slice(0, 3)}
        </div>
        <div className="bg-[var(--surface-elevated)] px-1 py-1.5">
          <p className="font-display text-xl font-bold leading-none text-[var(--foreground)]">
            {dayNum}
          </p>
        </div>
      </div>

      <div className="min-w-0 flex-1 text-left">
        <p className="font-display text-sm font-semibold leading-snug sm:text-base">
          {headline}
        </p>
        {!compact ? (
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            {formatLongDate(examDate)}
            {" · "}
            <Link href="/cuenta" className="text-[var(--foreground)] hover:underline">
              Cambiar
            </Link>
          </p>
        ) : (
          <Link
            href="/cuenta"
            className="mt-0.5 inline-block text-xs text-[var(--foreground)] hover:underline"
          >
            Fecha
          </Link>
        )}
      </div>
    </aside>
  );
}

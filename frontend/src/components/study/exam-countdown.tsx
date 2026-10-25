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
          "rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4",
          className,
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Tu examen
        </p>
        <p className="font-display mt-2 text-lg font-semibold text-white">
          ¿Cuándo es tu Cloud Practitioner?
        </p>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Define la fecha y verás cuántos días faltan.
        </p>
        <Link
          href="/cuenta"
          className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Agregar fecha en Cuenta →
        </Link>
      </aside>
    );
  }

  const cal = examDate.split("-");
  const dayNum = Number(cal[2]);
  const monthShort = formatLongDate(examDate)
    .split(" ")
    .find((p) => /[a-zA-Záéíóúñ]/i.test(p) && p.length > 2)
    ?.replace(",", "");

  let headline: string;
  if (days > 1) {
    headline = `Faltan ${days} días para tu examen de AWS Cloud Practitioner`;
  } else if (days === 1) {
    headline = "Mañana es tu examen de AWS Cloud Practitioner";
  } else if (days === 0) {
    headline = "¡Hoy es tu examen de AWS Cloud Practitioner!";
  } else {
    const ago = Math.abs(days);
    headline =
      ago === 1
        ? "Tu examen de AWS Cloud Practitioner fue ayer"
        : `Tu examen de AWS Cloud Practitioner fue hace ${ago} días`;
  }

  return (
    <aside
      className={cn(
        "flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 ring-1 ring-[var(--accent)]/20",
        className,
      )}
      aria-live="polite"
    >
      <div
        className={cn(
          "flex shrink-0 flex-col overflow-hidden rounded-xl text-center",
          compact ? "w-14" : "w-16",
        )}
        style={{
          boxShadow: "0 12px 28px -12px var(--glow)",
        }}
      >
        <div
          className="px-1 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-foreground)]"
          style={{ background: "var(--deck-grad-1)" }}
        >
          {monthShort?.slice(0, 3) ?? "—"}
        </div>
        <div className="bg-white px-1 py-2">
          <p className="font-display text-2xl font-bold leading-none text-black">
            {dayNum}
          </p>
          <p className="mt-0.5 text-[10px] font-medium text-black/50">
            {cal[0]}
          </p>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
          Countdown examen
        </p>
        <p className="font-display mt-1 text-base font-semibold leading-snug text-white sm:text-lg">
          {headline}
        </p>
        <p className="mt-1 text-xs text-[var(--foreground-muted)]">
          {formatLongDate(examDate)}
          {" · "}
          <Link
            href="/cuenta"
            className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Cambiar fecha
          </Link>
        </p>
      </div>
    </aside>
  );
}

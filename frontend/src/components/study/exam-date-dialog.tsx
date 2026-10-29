"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { EXAM_CATALOG, ExamCode } from "@aps/shared";
import { Button } from "@/components/ui/button";
import {
  civilTodayInTz,
  daysUntilExam,
} from "@/components/study/exam-countdown";
import { cn } from "@/lib/utils";

export type CatalogExam = (typeof EXAM_CATALOG)[number];

type Props = {
  open: boolean;
  /** Exam being edited; null when adding a new one. */
  exam: CatalogExam | null;
  /** Exams the user can still schedule (add mode). */
  choices?: readonly CatalogExam[];
  /** Current exam date (YYYY-MM-DD) or null. */
  value: string | null;
  timeZone?: string | null;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (examCode: ExamCode, date: string) => void;
  /** Edit mode only: removes the exam from the agenda. */
  onRemove?: () => void;
};

export const FOCUS_RING =
  "outline-none focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const WEEKDAY_NAMES = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseIso(value: string | null): { y: number; m: number; d: number } | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
}

function monthLabel(y: number, m: number): string {
  const s = new Date(y, m - 1, 1).toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });
  return s.replace(" de ", " ").replace(/^./, (c) => c.toUpperCase());
}

function longLabel(y: number, m: number, d: number): string {
  return new Date(y, m - 1, d).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** YYYY-MM-DD → "sáb 7 nov 2026". */
export function shortExamDate(iso: string): string {
  const p = parseIso(iso);
  if (!p) return iso;
  return new Date(p.y, p.m - 1, p.d)
    .toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/ de /g, " ");
}

/** Days until the exam → "faltan 9 días" / "mañana" / "hoy" / "fue hace 2 días". */
export function examCountdownLabel(days: number): string {
  if (days > 1) return `faltan ${days} días`;
  if (days === 1) return "mañana";
  if (days === 0) return "hoy";
  return days === -1 ? "fue ayer" : `fue hace ${Math.abs(days)} días`;
}

export function ExamDateDialog({
  open,
  exam,
  choices = [],
  value,
  timeZone,
  saving,
  error,
  onClose,
  onSave,
  onRemove,
}: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const tz = timeZone || "America/Mexico_City";
  const [picked, setPicked] = useState<CatalogExam | null>(exam);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [draft, setDraft] = useState<string | null>(value);
  const [view, setView] = useState(() => {
    const p = parseIso(value) ?? civilTodayInTz(tz);
    return { y: p.y, m: p.m };
  });

  useEffect(() => {
    if (!open) return;
    setPicked(exam ?? (choices.length === 1 ? choices[0] : null));
    setConfirmRemove(false);
    setDraft(value);
    const p = parseIso(value) ?? civilTodayInTz(tz);
    setView({ y: p.y, m: p.m });
    // `choices` is derived on every render; only reset when the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, exam, value, tz]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const isAdd = !exam;
  const canChangeExam = isAdd && choices.length > 1;

  const today = civilTodayInTz(tz);
  const todayIso = toIso(today.y, today.m, today.d);
  const atOrBeforeToday = view.y * 12 + view.m <= today.y * 12 + today.m;
  const daysInMonth = new Date(view.y, view.m, 0).getDate();
  const leading = (new Date(view.y, view.m - 1, 1).getDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const shiftMonth = (delta: number) =>
    setView((v) => {
      const idx = v.y * 12 + (v.m - 1) + delta;
      return { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
    });

  const draftDays = draft ? daysUntilExam(draft, new Date(), tz) : NaN;

  const iconButton = cn(
    "inline-flex size-8 items-center justify-center rounded-full text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
    FOCUS_RING,
  );

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-fade-up relative z-10 max-h-[calc(100dvh-1.5rem)] w-full max-w-sm overflow-y-auto rounded-3xl bg-[var(--surface-elevated)] p-5 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)] outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          {picked ? (
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src={picked.badge}
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="font-display text-lg font-bold leading-tight tracking-tight"
                >
                  {isAdd ? "Agrega tu examen" : "Fecha de tu examen"}
                </h2>
                <p className="text-xs leading-snug text-[var(--foreground-muted)]">
                  {picked.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="min-w-0">
              <h2
                id={titleId}
                className="font-display text-lg font-bold tracking-tight"
              >
                Agrega un examen
              </h2>
              <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
                Elige la certificación que vas a presentar.
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className={cn("-mr-1 -mt-1 shrink-0", iconButton)}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        {!picked ? (
          <ul className="mt-4 space-y-2">
            {choices.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => setPicked(c)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-2xl bg-[var(--surface)] p-3 text-left transition-colors hover:bg-[var(--surface-hover)]",
                    FOCUS_RING,
                  )}
                >
                  <Image
                    src={c.badge}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 shrink-0 object-contain"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-snug text-[var(--foreground)]">
                      {c.name}
                    </span>
                    <span className="block text-xs text-[var(--foreground-muted)]">
                      {c.code} · {c.level}
                    </span>
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 text-[var(--foreground-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--foreground)]"
                    aria-hidden
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <>
            {canChangeExam ? (
              <button
                type="button"
                onClick={() => {
                  setPicked(null);
                  setDraft(null);
                }}
                className={cn(
                  "mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
                  FOCUS_RING,
                )}
              >
                <ChevronLeft className="size-3.5" aria-hidden />
                Cambiar examen
              </button>
            ) : null}

            <div className="mt-4 rounded-2xl bg-[var(--surface)] p-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  disabled={atOrBeforeToday}
                  aria-label="Mes anterior"
                  className={cn(
                    iconButton,
                    "disabled:pointer-events-none disabled:opacity-30",
                  )}
                >
                  <ChevronLeft className="size-4" aria-hidden />
                </button>
                <p
                  className="font-display text-sm font-semibold tracking-tight text-[var(--foreground)]"
                  aria-live="polite"
                >
                  {monthLabel(view.y, view.m)}
                </p>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="Mes siguiente"
                  className={iconButton}
                >
                  <ChevronRight className="size-4" aria-hidden />
                </button>
              </div>

              <div
                className="mt-2 grid grid-cols-7 justify-items-center gap-y-1"
                role="group"
                aria-label={monthLabel(view.y, view.m)}
              >
                {WEEKDAYS.map((w, i) => (
                  <abbr
                    key={i}
                    title={WEEKDAY_NAMES[i]}
                    className="flex size-8 items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)] no-underline sm:size-9"
                  >
                    {w}
                  </abbr>
                ))}
                {cells.map((day, i) => {
                  if (day === null)
                    return <span key={`e${i}`} className="size-8 sm:size-9" />;
                  const iso = toIso(view.y, view.m, day);
                  const isPast = iso < todayIso;
                  const isToday = iso === todayIso;
                  const isSelected = iso === draft;
                  return (
                    <button
                      key={iso}
                      type="button"
                      disabled={isPast}
                      onClick={() => setDraft(iso)}
                      aria-label={longLabel(view.y, view.m, day)}
                      aria-pressed={isSelected}
                      aria-current={isToday ? "date" : undefined}
                      className={cn(
                        "relative inline-flex size-8 items-center justify-center rounded-full text-sm tabular-nums transition-colors sm:size-9",
                        FOCUS_RING,
                        isSelected
                          ? "bg-[var(--accent)] font-semibold text-white"
                          : isPast
                            ? "cursor-not-allowed text-[var(--foreground-muted)] opacity-35"
                            : isToday
                              ? "font-semibold text-[var(--accent)] hover:bg-[var(--surface-hover)]"
                              : "text-[var(--foreground)] hover:bg-[var(--surface-hover)]",
                      )}
                    >
                      {day}
                      {isToday && !isSelected ? (
                        <span
                          className="absolute bottom-1 size-1 rounded-full bg-[var(--accent)]"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {error ? (
              <p className="mt-3 text-xs text-red-300" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="min-w-0" aria-live="polite">
                {draft ? (
                  <>
                    <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {shortExamDate(draft).replace(/^./, (c) => c.toUpperCase())}
                    </p>
                    {!Number.isNaN(draftDays) ? (
                      <p className="text-[11px] text-[var(--foreground-muted)]">
                        {examCountdownLabel(draftDays)}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Elige un día.
                  </p>
                )}
              </div>
              <Button
                size="sm"
                disabled={!draft || saving || (!isAdd && draft === value)}
                onClick={() => draft && onSave(picked.code, draft)}
                className="shrink-0 focus-visible:ring-[color:var(--accent)]"
              >
                {saving ? "Guardando…" : isAdd ? "Agregar" : "Listo"}
              </Button>
            </div>

            {!isAdd && onRemove ? (
              <div className="mt-4 rounded-2xl bg-[var(--surface)] p-1.5">
                {confirmRemove ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 pl-2.5">
                    <p className="text-xs text-[var(--foreground)]">
                      ¿Quitar este examen de tu agenda?
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfirmRemove(false)}
                        disabled={saving}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
                          FOCUS_RING,
                        )}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={onRemove}
                        disabled={saving}
                        className={cn(
                          "rounded-full bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-200 transition-colors hover:bg-red-500/30 disabled:opacity-50",
                          FOCUS_RING,
                        )}
                      >
                        {saving ? "Quitando…" : "Sí, quitar"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmRemove(true)}
                    disabled={saving}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:bg-red-500/10 hover:text-red-200",
                      FOCUS_RING,
                    )}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Quitar examen
                  </button>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

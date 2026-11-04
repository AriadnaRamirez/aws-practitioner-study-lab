"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useEffect, useId, useState } from "react";
import type { EXAM_CATALOG, ExamCode } from "@aps/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { FOCUS_RING } from "@/components/ui/focus";
import { IconButton } from "@/components/ui/icon-button";
import { Notice } from "@/components/ui/notice";
import { civilTodayInTz, daysUntilExam } from "@/lib/exam-date";
import { cn } from "@/lib/utils";

type CatalogExam = (typeof EXAM_CATALOG)[number];

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

function parseIso(
  value: string | null,
): { y: number; m: number; d: number } | null {
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
function shortExamDate(iso: string): string {
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
function examCountdownLabel(days: number): string {
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

  return (
    <Dialog open={open} onClose={onClose} labelledBy={titleId} size="sm">
      <DialogHeader
        titleId={titleId}
        onClose={onClose}
        title={
          picked
            ? isAdd
              ? "Agrega tu examen"
              : "Fecha de tu examen"
            : "Agrega un examen"
        }
        media={
          picked ? (
            <Image
              src={picked.badge}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0 object-contain"
            />
          ) : null
        }
      >
        <p className="mt-0.5 text-xs leading-snug text-[var(--foreground-muted)]">
          {picked ? picked.name : "Elige la certificación que vas a presentar."}
        </p>
      </DialogHeader>

      {!picked ? (
        <ul className="space-y-2">
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
            <Button
              variant="secondary"
              size="xs"
              className="w-fit gap-1"
              onClick={() => {
                setPicked(null);
                setDraft(null);
              }}
            >
              <ChevronLeft className="size-3.5" aria-hidden />
              Cambiar examen
            </Button>
          ) : null}

          <div className="rounded-2xl bg-[var(--surface)] p-3">
            <div className="flex items-center justify-between gap-2">
              <IconButton
                aria-label="Mes anterior"
                onClick={() => shiftMonth(-1)}
                disabled={atOrBeforeToday}
              >
                <ChevronLeft aria-hidden />
              </IconButton>
              <p
                className="font-display text-sm font-semibold tracking-tight text-[var(--foreground)]"
                aria-live="polite"
              >
                {monthLabel(view.y, view.m)}
              </p>
              <IconButton
                aria-label="Mes siguiente"
                onClick={() => shiftMonth(1)}
              >
                <ChevronRight aria-hidden />
              </IconButton>
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
                  className="flex size-8 items-center justify-center text-xs font-semibold text-[var(--foreground-muted)] no-underline sm:size-9"
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
                        ? "bg-[var(--accent)] font-semibold text-[var(--accent-foreground)]"
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

          {error ? <Notice tone="danger">{error}</Notice> : null}

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0" aria-live="polite">
              {draft ? (
                <>
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {shortExamDate(draft).replace(/^./, (c) => c.toUpperCase())}
                  </p>
                  {!Number.isNaN(draftDays) ? (
                    <p className="text-xs text-[var(--foreground-muted)]">
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
              pending={saving && !confirmRemove}
              onClick={() => draft && onSave(picked.code, draft)}
              className="shrink-0"
            >
              {saving ? "Guardando…" : isAdd ? "Agregar" : "Listo"}
            </Button>
          </div>

          {!isAdd && onRemove ? (
            <div className="rounded-2xl bg-[var(--surface)] p-1.5">
              {confirmRemove ? (
                <div className="flex flex-wrap items-center justify-between gap-2 pl-2.5">
                  <p className="text-xs text-[var(--foreground)]">
                    ¿Quitar este examen de tu agenda?
                  </p>
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setConfirmRemove(false)}
                      disabled={saving}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="danger"
                      size="xs"
                      onClick={onRemove}
                      pending={saving}
                    >
                      {saving ? "Quitando…" : "Sí, quitar"}
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmRemove(true)}
                  disabled={saving}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-medium text-[var(--foreground-muted)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger-text)]",
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
    </Dialog>
  );
}

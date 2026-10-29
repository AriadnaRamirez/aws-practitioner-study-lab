"use client";

import { CalendarPlus, Pencil, RotateCw } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import type {
  ExamCode,
  ProgressOverview,
  PublicUser,
  UserExam,
} from "@aps/shared";
import { EXAM_CATALOG } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { daysUntilExam } from "@/components/study/exam-countdown";
import {
  ExamDateDialog,
  FOCUS_RING,
  shortExamDate,
} from "@/components/study/exam-date-dialog";
import {
  createMyExam,
  deleteMyExam,
  fetchMe,
  fetchMyExams,
  setStoredUser,
  updateMyExam,
} from "@/lib/api";
import { cn } from "@/lib/utils";

/** For now Inicio only schedules the Cloud Practitioner exam. */
const HERO_EXAM_CODE: ExamCode = "CLF-C02";
const HERO_EXAM = EXAM_CATALOG.find((c) => c.code === HERO_EXAM_CODE)!;

/** Nombre corto para el saludo (Ariadna → Ari). */
function greetingName(user: PublicUser): string {
  const u = user.username.trim().toLowerCase();
  if (user.role === "ADMIN" || u === "ariadna" || u === "ari") return "Ari";
  if (!u) return "tú";
  return u.charAt(0).toUpperCase() + u.slice(1);
}

/** "2026-11-07" → { month: "nov", day: "7" } (civil date, no timezone shift). */
function calendarParts(iso: string): { month: string; day: string } {
  const date = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  const month = new Intl.DateTimeFormat("es-MX", { month: "short", timeZone: "UTC" })
    .format(date)
    .replace(".", "");
  return { month, day: String(date.getUTCDate()) };
}

const TILE = cn(
  "group flex min-w-0 items-center gap-3 rounded-2xl bg-[var(--surface)] p-3 pr-4 text-left shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] transition-colors hover:bg-[var(--surface-hover)]",
  FOCUS_RING,
);

const STATIC_TILE =
  "flex min-w-0 items-center gap-3 rounded-2xl bg-[var(--surface)] p-3 pr-4 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)]";

const SKELETON_TILE = "h-[4.5rem] animate-pulse rounded-2xl bg-[var(--surface)]";

export function DashboardHero({
  user,
  overview,
  onUserChange,
  onExamsChange,
}: {
  user: PublicUser;
  overview: ProgressOverview | null;
  onUserChange: (user: PublicUser) => void;
  onExamsChange?: (exams: UserExam[]) => void;
}) {
  const tz = user.timezone || "America/Mexico_City";
  const [exams, setExams] = useState<UserExam[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadExams = useCallback(async () => {
    try {
      const next = await fetchMyExams();
      setExams(next);
      setLoadError(null);
      onExamsChange?.(next);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "No se pudieron cargar",
      );
    }
  }, [onExamsChange]);

  useEffect(() => {
    void loadExams();
  }, [loadExams]);

  const closeDialog = useCallback(() => setDialogOpen(false), []);

  const exam = exams?.find((e) => e.examCode === HERO_EXAM_CODE) ?? null;

  function openDialog() {
    setSaveError(null);
    setDialogOpen(true);
  }

  /** `User.examDate` mirrors CLF-C02; keep the stored profile in sync. */
  async function refreshUser() {
    try {
      const me = await fetchMe();
      onUserChange(me);
      setStoredUser(me);
    } catch {
      /* the exam list is already up to date */
    }
  }

  async function mutate(action: () => Promise<unknown>) {
    setSaving(true);
    setSaveError(null);
    try {
      await action();
      await loadExams();
      setDialogOpen(false);
      void refreshUser();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  function onSave(examCode: ExamCode, examDate: string) {
    void mutate(() =>
      exam
        ? updateMyExam(exam.id, { examDate })
        : createMyExam({ examCode, examDate }),
    );
  }

  function onRemove() {
    if (!exam) return;
    void mutate(() => deleteMyExam(exam.id));
  }

  return (
    <section
      aria-labelledby="saludo"
      className="mx-auto grid w-full max-w-xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 lg:max-w-3xl lg:gap-x-8"
    >
      <div className="col-start-1 row-start-1 min-w-0">
        <h1
          id="saludo"
          className="font-sans text-2xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] sm:text-3xl"
        >
          Hola, {greetingName(user)}.
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Así vas con tu certificación.
        </p>
      </div>

      <Mascot
        pose="wave"
        size="sm"
        priority
        float
        glow={false}
        className="col-start-2 row-start-1 h-20 w-[5.5rem] sm:row-span-2 sm:h-36 sm:w-40 lg:h-44 lg:w-48 [@media(max-height:500px)]:!h-24 [@media(max-height:500px)]:!w-28"
      />

      <div className="col-span-2 row-start-2 mt-4 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:col-span-1">
        {exams === null && !loadError ? (
          <div className={SKELETON_TILE} aria-busy="true" aria-label="Cargando tu examen" />
        ) : loadError && exams === null ? (
          <button type="button" onClick={() => void loadExams()} className={TILE}>
            <RotateCw className="size-5 shrink-0 text-[var(--accent)]" aria-hidden />
            <span className="min-w-0 text-sm text-[var(--foreground-muted)]">
              No pude cargar tu examen.{" "}
              <span className="font-semibold text-[var(--foreground)]">Reintentar</span>
            </span>
          </button>
        ) : exam ? (
          <ExamTile exam={exam} timeZone={tz} onEdit={openDialog} />
        ) : (
          <button type="button" onClick={openDialog} aria-haspopup="dialog" className={TILE}>
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <CalendarPlus className="size-6" aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold text-[var(--foreground)]">
                Agenda tu examen
              </span>
              <span className="text-xs text-[var(--foreground-muted)]">
                Cloud Practitioner
              </span>
            </span>
          </button>
        )}

        <ProgressTile overview={overview} />
      </div>

      <ExamDateDialog
        open={dialogOpen}
        exam={exam ? HERO_EXAM : null}
        choices={[HERO_EXAM]}
        value={exam?.examDate ?? null}
        timeZone={tz}
        saving={saving}
        error={saveError}
        onClose={closeDialog}
        onSave={onSave}
        onRemove={exam ? onRemove : undefined}
      />
    </section>
  );
}

function ExamTile({
  exam,
  timeZone,
  onEdit,
}: {
  exam: UserExam;
  timeZone: string;
  onEdit: () => void;
}) {
  const days = daysUntilExam(exam.examDate, new Date(), timeZone);
  const { month, day } = calendarParts(exam.examDate);

  let headline: ReactNode;
  let caption: string;
  if (Number.isNaN(days) || days < 0) {
    headline = <span className="text-lg">Ya pasó</span>;
    caption = "Toca para cambiar la fecha";
  } else if (days === 0) {
    headline = "¡Hoy!";
    caption = "es tu examen. ¡Suerte!";
  } else if (days === 1) {
    headline = "¡Mañana!";
    caption = "es tu examen";
  } else {
    headline = (
      <>
        {days}{" "}
        <span className="text-sm font-semibold text-[var(--foreground-muted)]">días</span>
      </>
    );
    caption = "para tu examen";
  }

  return (
    <button
      type="button"
      onClick={onEdit}
      aria-haspopup="dialog"
      aria-label={`Examen Cloud Practitioner: ${shortExamDate(exam.examDate)}. Cambiar fecha`}
      className={cn(TILE, "relative")}
    >
      <span
        aria-hidden
        className="flex w-12 shrink-0 flex-col overflow-hidden rounded-xl bg-[var(--surface-elevated)] text-center shadow-[0_8px_18px_-10px_rgba(0,0,0,0.8)]"
      >
        <span className="bg-[var(--accent)] py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-foreground)]">
          {month}
        </span>
        <span className="py-1 text-xl font-extrabold leading-none tabular-nums text-[var(--foreground)]">
          {day}
        </span>
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-2xl font-extrabold leading-none tabular-nums tracking-tight text-[var(--foreground)]">
          {headline}
        </span>
        <span className="mt-1 text-xs text-[var(--foreground-muted)]">{caption}</span>
      </span>
      <Pencil
        className="absolute right-2.5 top-2.5 size-3.5 text-[var(--foreground-muted)] opacity-60 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
    </button>
  );
}

const RING_SIZE = 52;
const RING_STROKE = 6;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function ProgressTile({ overview }: { overview: ProgressOverview | null }) {
  if (!overview) {
    return <div className={SKELETON_TILE} aria-hidden />;
  }
  const mastered = overview.masteredItems;
  const total = overview.totalTrackableItems;
  const pct = Math.round(Math.min(100, Math.max(0, overview.masteryPct)));

  return (
    <div
      role="group"
      aria-label={`${mastered} de ${total} conceptos dominados (${pct}%)`}
      className={STATIC_TILE}
    >
      <span className="relative size-[52px] shrink-0" aria-hidden>
        <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="size-full -rotate-90">
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="var(--surface-hover)"
            strokeWidth={RING_STROKE}
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH * (1 - pct / 100)}
            className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-[var(--foreground)]">
          {pct}%
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-2xl font-extrabold leading-none tabular-nums tracking-tight text-[var(--foreground)]">
          {mastered}
          <span className="text-sm font-semibold text-[var(--foreground-muted)]">/{total}</span>
        </span>
        <span className="mt-1 text-xs text-[var(--foreground-muted)]">
          conceptos dominados
        </span>
      </span>
    </div>
  );
}

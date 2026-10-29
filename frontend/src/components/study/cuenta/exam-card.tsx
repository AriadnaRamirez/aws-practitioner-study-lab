"use client";

import Image from "next/image";
import { CalendarDays, CalendarPlus, Pencil, RotateCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ExamCode, ProgressOverview, PublicUser, UserExam } from "@aps/shared";
import { EXAM_CATALOG } from "@aps/shared";
import { daysUntilExam } from "@/components/study/exam-countdown";
import { ExamDateDialog } from "@/components/study/exam-date-dialog";
import {
  createMyExam,
  deleteMyExam,
  fetchMe,
  fetchMyExams,
  fetchProgressOverview,
  updateMyExam,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  CARD,
  CARD_ICON,
  CARD_TITLE,
  PILL_BUTTON,
  errorMessage,
} from "./cuenta-ui";

/** For now only the Cloud Practitioner exam can be scheduled. */
const EXAM_CODE: ExamCode = "CLF-C02";
const EXAM = EXAM_CATALOG.find((c) => c.code === EXAM_CODE)!;

const LEVEL_ES: Record<string, string> = {
  Foundational: "Nivel fundamental",
  Associate: "Nivel asociado",
  Professional: "Nivel profesional",
  Specialty: "Especialidad",
};

function civilDate(iso: string): Date {
  return new Date(`${iso.slice(0, 10)}T12:00:00Z`);
}

function longDate(iso: string): string {
  const s = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(civilDate(iso));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function calendarParts(iso: string): { month: string; day: string; weekday: string } {
  const date = civilDate(iso);
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es-MX", { ...o, timeZone: "UTC" })
      .format(date)
      .replace(".", "");
  return {
    month: fmt({ month: "short" }),
    day: String(date.getUTCDate()),
    weekday: fmt({ weekday: "short" }),
  };
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** 9 → "1 semana y 2 días"; under a week → null. */
function weeksBreakdown(days: number): string | null {
  if (days < 7) return null;
  const weeks = Math.floor(days / 7);
  const rest = days % 7;
  const w = plural(weeks, "semana", "semanas");
  return rest ? `${w} y ${plural(rest, "día", "días")}` : w;
}

function paceLine(days: number, overview: ProgressOverview | null): string | null {
  if (!overview || days < 1) return null;
  const left = Math.max(0, overview.totalTrackableItems - overview.masteredItems);
  if (left === 0) {
    return "Ya dominas todos los conceptos. Sigue repasando para llegar fresco al examen.";
  }
  const perDay = Math.ceil(left / days);
  return `Te faltan ${plural(left, "concepto", "conceptos")} por dominar: unos ${perDay} al día hasta tu examen.`;
}

export function ExamCard({
  user,
  onUserChange,
}: {
  user: PublicUser;
  onUserChange: (user: PublicUser) => void;
}) {
  const tz = user.timezone || "America/Mexico_City";
  const [exams, setExams] = useState<UserExam[] | null>(null);
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadExams = useCallback(async () => {
    try {
      setExams(await fetchMyExams());
      setLoadError(null);
    } catch (err) {
      setLoadError(errorMessage(err, "No se pudo cargar tu examen"));
    }
  }, []);

  useEffect(() => {
    void loadExams();
    fetchProgressOverview().then(setOverview, () => {});
  }, [loadExams]);

  const closeDialog = useCallback(() => setDialogOpen(false), []);
  const exam = exams?.find((e) => e.examCode === EXAM_CODE) ?? null;

  function openDialog() {
    setSaveError(null);
    setDialogOpen(true);
  }

  async function mutate(action: () => Promise<unknown>) {
    setSaving(true);
    setSaveError(null);
    try {
      await action();
      await loadExams();
      setDialogOpen(false);
      fetchMe().then(onUserChange, () => {});
    } catch (err) {
      setSaveError(errorMessage(err, "No se pudo guardar"));
    } finally {
      setSaving(false);
    }
  }

  function onSave(examCode: ExamCode, examDate: string) {
    void mutate(() =>
      exam ? updateMyExam(exam.id, { examDate }) : createMyExam({ examCode, examDate }),
    );
  }

  function onRemove() {
    if (exam) void mutate(() => deleteMyExam(exam.id));
  }

  return (
    <section aria-labelledby="examen-titulo" className={CARD}>
      <div className="flex items-center justify-between gap-3">
        <h2 id="examen-titulo" className={CARD_TITLE}>
          <CalendarDays className={CARD_ICON} aria-hidden />
          Tu examen
        </h2>
        {exam ? (
          <button type="button" onClick={openDialog} aria-haspopup="dialog" className={PILL_BUTTON}>
            <Pencil className="size-3.5" aria-hidden />
            Cambiar fecha
          </button>
        ) : null}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Image
          src={EXAM.badge}
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 object-contain"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug text-[var(--foreground)]">
            {EXAM.name}
          </p>
          <p className="text-xs text-[var(--foreground-muted)]">
            {EXAM.code} · {LEVEL_ES[EXAM.level] ?? EXAM.level}
          </p>
        </div>
      </div>

      {exams === null && !loadError ? (
        <div className="mt-5 h-32 animate-pulse rounded-2xl bg-[var(--surface-elevated)]" aria-busy="true" aria-label="Cargando tu examen" />
      ) : loadError && exams === null ? (
        <button
          type="button"
          onClick={() => void loadExams()}
          className={cn(PILL_BUTTON, "mt-5")}
        >
          <RotateCw className="size-3.5" aria-hidden />
          {loadError}. Reintentar
        </button>
      ) : exam ? (
        <ScheduledExam examDate={exam.examDate} timeZone={tz} overview={overview} />
      ) : (
        <div className="mt-5 flex flex-col items-start gap-4 rounded-2xl bg-[var(--surface-elevated)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-base font-semibold text-[var(--foreground)]">
              Aún no tienes fecha
            </p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Agéndala y verás la cuenta regresiva aquí y en Inicio, con un ritmo
              sugerido de conceptos por día.
            </p>
          </div>
          <button
            type="button"
            onClick={openDialog}
            aria-haspopup="dialog"
            className={cn(
              PILL_BUTTON,
              "h-11 shrink-0 bg-[var(--accent)] px-5 text-sm text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] hover:brightness-110",
            )}
          >
            <CalendarPlus className="size-4" aria-hidden />
            Agendar fecha
          </button>
        </div>
      )}

      <ExamDateDialog
        open={dialogOpen}
        exam={exam ? EXAM : null}
        choices={[EXAM]}
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

function ScheduledExam({
  examDate,
  timeZone,
  overview,
}: {
  examDate: string;
  timeZone: string;
  overview: ProgressOverview | null;
}) {
  const days = daysUntilExam(examDate, new Date(), timeZone);
  const { month, day, weekday } = calendarParts(examDate);
  const past = Number.isNaN(days) || days < 0;

  let headline: string;
  let caption: string;
  if (past) {
    headline = "Ya pasó";
    caption = "Cambia la fecha si vas a presentarlo otra vez.";
  } else if (days === 0) {
    headline = "¡Es hoy!";
    caption = "Respira hondo. ¡Mucha suerte!";
  } else if (days === 1) {
    headline = "¡Mañana!";
    caption = "Un repaso ligero y a descansar.";
  } else {
    headline = `${days} días`;
    caption = weeksBreakdown(days) ?? "Menos de una semana. ¡Último empujón!";
  }

  const pace = past ? null : paceLine(days, overview);

  return (
    <div className="mt-5 rounded-2xl bg-[var(--surface-elevated)] p-4 sm:p-5">
      <div className="flex items-center gap-4 sm:gap-5">
        <span
          aria-hidden
          className="flex w-[4.5rem] shrink-0 flex-col overflow-hidden rounded-2xl bg-[var(--surface)] text-center shadow-[0_10px_24px_-14px_rgba(0,0,0,0.9)] sm:w-20"
        >
          <span className="bg-[var(--accent)] py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--accent-foreground)]">
            {month}
          </span>
          <span className="pt-1.5 text-3xl font-extrabold leading-none tabular-nums text-[var(--foreground)]">
            {day}
          </span>
          <span className="pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
            {weekday}
          </span>
        </span>
        <div className="min-w-0">
          <p className="text-3xl font-extrabold leading-none tracking-tight tabular-nums text-[var(--foreground)] sm:text-4xl">
            {headline}
          </p>
          <p className="mt-1.5 text-sm text-[var(--foreground-muted)]">
            {past ? caption : `${longDate(examDate)} · ${caption}`}
          </p>
        </div>
      </div>
      {pace ? (
        <p className="mt-4 rounded-xl bg-[var(--accent-soft)] px-3.5 py-2.5 text-sm text-[var(--foreground)]">
          {pace}
        </p>
      ) : null}
    </div>
  );
}

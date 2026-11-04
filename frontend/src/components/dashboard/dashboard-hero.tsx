"use client";

import { CalendarDays, CalendarPlus, Pencil, RotateCw } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import type { ExamCode, PublicUser, UserExam } from "@aps/shared";
import { EXAM_CATALOG } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { daysUntilExam } from "@/lib/exam-date";
import { ExamDateDialog } from "@/components/exam-date/exam-date-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cardVariants } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { Skeleton } from "@/components/ui/spinner";
import {
  createMyExam,
  deleteMyExam,
  fetchMe,
  setStoredUser,
  updateMyExam,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { DASHBOARD_TILE } from "./dashboard-grid";

/** For now Inicio only schedules the Cloud Practitioner exam. */
const HERO_EXAM_CODE: ExamCode = "CLF-C02";
const HERO_EXAM = EXAM_CATALOG.find((c) => c.code === HERO_EXAM_CODE)!;

/** Nombre corto para el saludo (Ariadna → Ari). */
function greetingName(user: PublicUser): string {
  const u = user.username.trim().toLowerCase();
  if (user.role === "ADMIN" || u === "ariadna" || u === "ari") return "Ari";
  // "lucia_perez99" → "Lucia": the first word reads like a name in the greeting.
  const first = u.split(/[_\d]+/).find((part) => part.length >= 2) ?? u;
  if (!first) return "tú";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

/** "2026-11-22" → "Domingo 22 de noviembre" (civil date, no timezone shift). */
function longExamDate(iso: string): string {
  const date = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  const text = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  })
    .format(date)
    .replace(",", "");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * md+: one panel. lg+ stacks the greeting and a full-width countdown strip on the left and gives
 * the mascot the whole right side, standing on the panel's bottom edge (the greeting wrapper is
 * `display: contents` so its children join the panel grid). md stacks the countdown under the
 * greeting. Phones keep the greeting and a separate exam card.
 */
export const HERO_TILE = cn(
  DASHBOARD_TILE.hero,
  "md:relative md:overflow-hidden md:rounded-2xl md:bg-[var(--surface)] md:shadow-[var(--shadow-raised)]",
  "lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:grid-rows-[auto_auto] lg:gap-x-6 lg:pl-8 lg:pr-6",
  "md:bg-[radial-gradient(ellipse_40%_130%_at_88%_100%,rgba(210,101,47,0.18),transparent_70%)]",
);
export const HERO_GREETING =
  "flex items-center justify-between gap-4 md:p-6 lg:contents";
export const HERO_GREETING_TEXT =
  "min-w-0 lg:col-[1] lg:row-[1] lg:self-end lg:pt-7";
export const HERO_EXAM_PANE =
  "mt-6 md:mt-0 lg:col-[1] lg:row-[2] lg:self-start lg:pb-7 lg:pt-5";
export const HERO_MASCOT_CELL = "lg:col-[2] lg:row-[1/3] lg:mt-4 lg:self-end";
const HERO_TITLE_SIZE = "text-4xl sm:text-5xl xl:text-6xl";
export const HERO_MASCOT_SIZE =
  "h-24 w-24 shrink-0 sm:h-36 sm:w-40 lg:h-64 lg:w-72 [@media(max-height:500px)]:!h-24 [@media(max-height:500px)]:!w-28";
export const HERO_EXAM_SKELETON =
  "block h-32 w-full rounded-2xl md:h-full md:min-h-36 md:rounded-none lg:min-h-0 lg:h-[5.5rem] lg:rounded-2xl";

const CARD_LAYOUT = "flex h-full w-full items-center gap-4 sm:p-5";

const EXAM_CARD = cn(
  cardVariants({ padding: "sm", interactive: true }),
  CARD_LAYOUT,
  "group md:rounded-none md:border-t md:border-[var(--border)] md:bg-transparent md:p-6 md:shadow-none md:hover:bg-[var(--surface-hover)]/40",
  "lg:h-auto lg:rounded-2xl lg:border-t-0 lg:bg-[var(--surface-elevated)]/60 lg:px-5 lg:py-3.5 lg:hover:bg-[var(--surface-hover)]/70",
  FOCUS_RING,
  "md:focus-visible:ring-inset md:focus-visible:ring-offset-0",
);

/** Phones/md: one column. lg: the headline on the left, date and action pushed to the right. */
const EXAM_BODY =
  "flex min-w-0 flex-col lg:flex-1 lg:flex-row lg:items-center lg:justify-between lg:gap-6";
const EXAM_META = "flex flex-col lg:shrink-0 lg:items-end";

const EDIT_PILL = cn(
  buttonVariants({ variant: "soft", size: "xs" }),
  "mt-3 w-fit gap-1.5 lg:mt-2 group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-foreground)]",
);

function ExamBadge({ dim = false }: { dim?: boolean }) {
  return (
    <Image
      src={HERO_EXAM.badge}
      alt=""
      width={80}
      height={80}
      loading="eager"
      className={cn(
        "size-16 shrink-0 object-contain sm:size-20 lg:size-14",
        dim && "opacity-60 grayscale",
      )}
    />
  );
}

export function DashboardHero({
  user,
  exams,
  examsError,
  onUserChange,
  onReloadExams,
}: {
  user: PublicUser;
  exams: UserExam[] | null;
  examsError: boolean;
  onUserChange: (user: PublicUser) => void;
  onReloadExams: () => Promise<void>;
}) {
  const tz = user.timezone || "America/Mexico_City";
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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
      await onReloadExams();
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
    <section aria-labelledby="saludo" className={HERO_TILE}>
      <div className={HERO_GREETING}>
        <div className={HERO_GREETING_TEXT}>
          <h1
            id="saludo"
            className={cn(
              "font-sans font-extrabold leading-[1.05] tracking-tight text-[var(--foreground)]",
              HERO_TITLE_SIZE,
            )}
          >
            {`Hola, ${greetingName(user)}.`}
          </h1>
          <p className="mt-2 text-base text-[var(--foreground-muted)] sm:text-lg">
            Así vas con tu certificación.
          </p>
        </div>

        <Mascot
          pose="wave"
          size="lg"
          priority
          glow={false}
          className={cn(HERO_MASCOT_SIZE, HERO_MASCOT_CELL)}
        />
      </div>

      <div className={HERO_EXAM_PANE} data-tour="exam-countdown">
        {exams === null && !examsError ? (
          <div
            aria-busy="true"
            aria-label="Cargando tu examen"
            className="h-full"
          >
            <Skeleton className={HERO_EXAM_SKELETON} />
          </div>
        ) : examsError && exams === null ? (
          <button
            type="button"
            onClick={() => void onReloadExams()}
            className={EXAM_CARD}
          >
            <RotateCw
              className="size-5 shrink-0 text-[var(--accent)]"
              aria-hidden
            />
            <span className="min-w-0 text-sm text-[var(--foreground-muted)]">
              No pude cargar tu examen.{" "}
              <span className="font-semibold text-[var(--foreground)]">
                Reintentar
              </span>
            </span>
          </button>
        ) : exam ? (
          <ExamCard exam={exam} timeZone={tz} onEdit={openDialog} />
        ) : (
          <button
            type="button"
            onClick={openDialog}
            aria-haspopup="dialog"
            className={EXAM_CARD}
          >
            <ExamBadge dim />
            <span className={EXAM_BODY}>
              <span className="flex min-w-0 flex-col">
                <span className="text-xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-2xl">
                  Agenda tu examen
                </span>
                <span className="mt-1 text-sm text-[var(--foreground-muted)]">
                  {HERO_EXAM.name}
                </span>
              </span>
              <span className={EXAM_META}>
                <span className={cn(EDIT_PILL, "lg:mt-0")}>
                  <CalendarPlus className="size-3.5" aria-hidden />
                  Elegir fecha
                </span>
              </span>
            </span>
          </button>
        )}
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

function examHeadline(days: number): { headline: string; caption: string } {
  if (Number.isNaN(days) || days < 0) {
    return { headline: "Tu examen ya pasó", caption: HERO_EXAM.name };
  }
  if (days === 0) {
    return {
      headline: "Hoy es tu examen",
      caption: `${HERO_EXAM.name}. ¡Suerte!`,
    };
  }
  if (days === 1) {
    return {
      headline: "Falta 1 día",
      caption: `para tu examen ${HERO_EXAM.name}`,
    };
  }
  return {
    headline: `Faltan ${days} días`,
    caption: `para tu examen ${HERO_EXAM.name}`,
  };
}

function ExamCard({
  exam,
  timeZone,
  onEdit,
}: {
  exam: UserExam;
  timeZone: string;
  onEdit: () => void;
}) {
  const days = daysUntilExam(exam.examDate, new Date(), timeZone);
  const { headline, caption } = examHeadline(days);
  const date = longExamDate(exam.examDate);

  return (
    <button
      type="button"
      onClick={onEdit}
      aria-haspopup="dialog"
      aria-label={`${headline} ${caption}, el ${date}. Cambiar fecha`}
      className={EXAM_CARD}
    >
      <ExamBadge />
      <span className={EXAM_BODY}>
        <span className="flex min-w-0 flex-col">
          <span className="text-2xl font-extrabold leading-tight tabular-nums tracking-tight text-[var(--foreground)] sm:text-3xl">
            {headline}
          </span>
          <span className="mt-1 text-sm leading-snug text-[var(--foreground-muted)]">
            {caption}
          </span>
        </span>
        <span className={EXAM_META}>
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground)] lg:mt-0">
            <CalendarDays
              className="size-4 shrink-0 text-[var(--accent)]"
              aria-hidden
            />
            {date}
          </span>
          <span className={EDIT_PILL}>
            <Pencil className="size-3.5" aria-hidden />
            Cambiar fecha
          </span>
        </span>
      </span>
    </button>
  );
}

"use client";

import Link from "next/link";
import { ChevronRight, Play, Target } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { ProgressOverview, UserExam } from "@aps/shared";
import { getExamCatalogEntry } from "@aps/shared";
import { buttonVariants } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { segmentedItem, segmentedList } from "@/components/ui/segmented";
import { Skeleton } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { DashboardTile, TileLoading, tileLinkClass } from "./dashboard-tile";
import {
  computeExamGoal,
  estimateAnswers,
  sessionSizeFor,
  type ExamGoal,
} from "./exam-goal";

const GOAL_OPTIONS = [10, 20, 30, 50] as const;
type ManualGoal = (typeof GOAL_OPTIONS)[number];
const DEFAULT_GOAL: ManualGoal = 20;
const GOAL_STORAGE_KEY = "aps.dailyGoal";

function readStoredGoal(): ManualGoal {
  if (typeof window === "undefined") return DEFAULT_GOAL;
  try {
    const n = Number(window.localStorage.getItem(GOAL_STORAGE_KEY));
    return (GOAL_OPTIONS as readonly number[]).includes(n)
      ? (n as ManualGoal)
      : DEFAULT_GOAL;
  } catch {
    return DEFAULT_GOAL;
  }
}

/** "vie 6 nov" for a civil YYYY-MM-DD. */
function shortDay(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return date;
  return new Date(y, m - 1, d)
    .toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .replace(/[.,]/g, "")
    .replace(/ de /g, " ");
}

function daysLeftLabel(days: number): string {
  if (days === 0) return "Es hoy";
  if (days === 1) return "Mañana";
  return `Faltan ${days} días`;
}

function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}

/** Main line of the goal tile ("Aprende 5 cartas al día"). */
const GOAL_TITLE =
  "text-lg font-semibold leading-snug tracking-tight text-[var(--foreground)] sm:text-xl";

function GoalRing({
  value,
  goal,
  label,
}: {
  value: number;
  goal: number;
  label: string;
}) {
  return (
    <ProgressRing value={value} max={goal} label={label} className="size-28">
      <span className="text-3xl font-extrabold leading-none tabular-nums tracking-tight text-[var(--foreground)]">
        {value}
      </span>
      <span className="mt-1 text-xs tabular-nums text-[var(--foreground-muted)]">
        de {goal}
      </span>
    </ProgressRing>
  );
}

function AnswersBar({ done, goal }: { done: number; goal: number }) {
  return (
    <div className="mt-4">
      <div className="flex min-w-0 items-baseline justify-between gap-3 text-xs">
        <span className="text-[var(--foreground-muted)]">Respondidas hoy</span>
        <span className="shrink-0 tabular-nums text-[var(--foreground)]">
          {done}{" "}
          <span className="text-[var(--foreground-muted)]">de ~{goal} aprox.</span>
        </span>
      </div>
      <ProgressBar
        value={done}
        max={goal}
        label={`Cartas respondidas hoy: ${done} de aproximadamente ${goal}`}
        className="mt-1.5"
      />
    </div>
  );
}

/** Starts a quick game right away, sized to what is left of today's goal. */
function PlayLink({ size, again = false }: { size: number; again?: boolean }) {
  return (
    <Link
      href={`/estudiar?quick=1&start=${size}`}
      className={cn(buttonVariants({ variant: "soft", size: "sm" }), "gap-1.5")}
    >
      <Play className="size-3.5 fill-current" aria-hidden />
      {again ? `Otra partida de ${size} cartas` : `Iniciar partida de ${size} cartas`}
    </Link>
  );
}

function ScheduleLink({ children }: { children: string }) {
  return (
    <Link href="#saludo" className={tileLinkClass}>
      {children}
      <ChevronRight className="size-4" aria-hidden />
    </Link>
  );
}

/** Ring on the left, copy on the right; stacks on narrow tiles. */
function GoalLayout({ ring, children }: { ring: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-5 @min-[22rem]:flex-row @min-[22rem]:items-center">
      {ring}
      <div className="w-full min-w-0 flex-1">{children}</div>
    </div>
  );
}

function ExamLine({ exam, daysLeft }: { exam: UserExam; daysLeft: number }) {
  const name = getExamCatalogEntry(exam.examCode)?.name ?? exam.examCode;
  return (
    <p className="flex min-w-0 flex-wrap gap-x-1.5 text-xs text-[var(--foreground-muted)]">
      <span className="max-w-full truncate font-semibold text-[var(--foreground)]">
        {name}
      </span>
      <span className="whitespace-nowrap">
        {daysLeftLabel(daysLeft)} · examen {shortDay(exam.examDate)}
      </span>
    </p>
  );
}

function ManualGoalBody({
  answeredToday,
  note,
}: {
  answeredToday: number;
  note: ReactNode;
}) {
  const [goal, setGoal] = useState<ManualGoal>(readStoredGoal);

  function chooseGoal(next: ManualGoal) {
    setGoal(next);
    try {
      window.localStorage.setItem(GOAL_STORAGE_KEY, String(next));
    } catch {
      /* storage unavailable: keep the goal for this visit */
    }
  }

  const remaining = Math.max(goal - answeredToday, 0);
  const status =
    remaining === 0
      ? "¡Meta cumplida! Sigue si quieres más."
      : answeredToday === 0
        ? `Responde ${goal} cartas hoy.`
        : `Te ${remaining === 1 ? "falta 1 carta" : `faltan ${remaining} cartas`} para tu meta.`;

  return (
    <GoalLayout
      ring={
        <GoalRing
          value={answeredToday}
          goal={goal}
          label={`Cartas respondidas hoy: ${answeredToday} de ${goal}`}
        />
      }
    >
      <p className={GOAL_TITLE} aria-live="polite">
        {status}
      </p>
      <div className="mt-1">{note}</div>
      <div className="mt-4 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-3">
        <PlayLink size={sessionSizeFor(remaining)} again={remaining === 0} />
        <div className="flex flex-wrap items-center gap-2">
          <span
            id="meta-diaria-opciones"
            className="text-xs text-[var(--foreground-muted)]"
          >
            Cartas al día
          </span>
          <div
            role="radiogroup"
            aria-labelledby="meta-diaria-opciones"
            className={cn(segmentedList, "bg-[var(--surface-elevated)]")}
          >
            {GOAL_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={goal === n}
                onClick={() => chooseGoal(n)}
                className={segmentedItem(goal === n, "min-w-10 tabular-nums")}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </GoalLayout>
  );
}

function PaceBody({
  goal,
  overview,
}: {
  goal: Extract<ExamGoal, { kind: "pace" }>;
  overview: ProgressOverview;
}) {
  const learned = overview.masteredToday;
  const answered = overview.answeredToday;
  const cardsLeft = Math.max(goal.cardsPerDay - learned, 0);
  const reached = cardsLeft === 0;
  const answersGoal = reached
    ? goal.answersPerDay
    : Math.max(
        goal.answersPerDay,
        answered + estimateAnswers(cardsLeft, overview.recentAccuracy),
      );
  const answersLeft = answersGoal - answered;
  const finish =
    goal.studyDays === 1
      ? "terminar hoy (1 día de holgura)"
      : `terminar el ${shortDay(goal.targetDate)} (1 día de holgura)`;

  return (
    <GoalLayout
      ring={
        <GoalRing
          value={learned}
          goal={goal.cardsPerDay}
          label={`Cartas aprendidas hoy: ${learned} de ${goal.cardsPerDay}`}
        />
      }
    >
      <ExamLine exam={goal.exam} daysLeft={goal.daysLeft} />
      <p className={cn("mt-1.5", GOAL_TITLE)} aria-live="polite">
        {reached
          ? "¡Meta de hoy cumplida!"
          : `Aprende ${plural(goal.cardsPerDay, "carta", "cartas")} al día`}
      </p>
      <p className="mt-0.5 text-sm leading-snug text-[var(--foreground-muted)]">
        {reached
          ? `Aprendiste ${plural(learned, "carta", "cartas")} hoy. Si sigues, adelantas a mañana.`
          : learned === 0
            ? `Meta: ${finish}.`
            : `Te ${cardsLeft === 1 ? "falta 1 carta" : `faltan ${cardsLeft} cartas`} hoy · meta: ${finish}.`}
      </p>
      <AnswersBar done={answered} goal={answersGoal} />
      <div className="mt-4">
        <PlayLink size={reached ? 10 : sessionSizeFor(answersLeft)} again={reached} />
      </div>
    </GoalLayout>
  );
}

function SimpleBody({
  exam,
  daysLeft,
  title,
  text,
  answeredToday,
  action,
}: {
  exam: UserExam;
  daysLeft: number;
  title: string;
  text: string;
  answeredToday: number;
  action: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <ExamLine exam={exam} daysLeft={daysLeft} />
      <p className={cn("mt-1.5", GOAL_TITLE)}>{title}</p>
      <p className="mt-0.5 text-sm leading-snug text-[var(--foreground-muted)]">
        {text}
      </p>
      <p className="mt-3 text-xs tabular-nums text-[var(--foreground-muted)]">
        Respondidas hoy:{" "}
        <span className="font-semibold text-[var(--foreground)]">{answeredToday}</span>
      </p>
      <div className="mt-4">{action}</div>
    </div>
  );
}

export function TodayGoalWidget({
  exams,
  overview,
  progressError,
  timeZone,
  examsError,
  className,
}: {
  exams: UserExam[] | null;
  overview: ProgressOverview | null;
  progressError: boolean;
  timeZone: string;
  examsError: boolean;
  className?: string;
}) {
  let body: ReactNode;
  if (progressError) {
    body = (
      <Notice tone="danger">
        No pudimos cargar tu progreso. Recarga la página para intentarlo de nuevo.
      </Notice>
    );
  } else if (!overview || (!exams && !examsError)) {
    body = (
      <TileLoading label="Calculando tu meta de hoy…">
        <GoalLayout ring={<Skeleton className="size-28 shrink-0 rounded-full" />}>
          <Skeleton className="block h-3 w-40" />
          <Skeleton className="mt-2.5 block h-6 w-3/4" />
          <Skeleton className="mt-2 block h-4 w-full" />
          <Skeleton className="mt-4 block h-2 w-full rounded-full" />
          <Skeleton className="mt-4 block h-9 w-52 rounded-full" />
        </GoalLayout>
      </TileLoading>
    );
  } else {
    const goal: ExamGoal = examsError
      ? { kind: "no-exam", hadPastExam: false }
      : computeExamGoal(exams ?? [], overview, timeZone);

    switch (goal.kind) {
      case "no-exam":
        body = (
          <ManualGoalBody
            answeredToday={overview.answeredToday}
            note={
              examsError ? (
                <Notice tone="danger">No pudimos cargar tus exámenes.</Notice>
              ) : (
                <ScheduleLink>
                  {goal.hadPastExam
                    ? "Tu examen ya pasó: agenda el siguiente"
                    : "Agenda tu examen para calcular tu meta"}
                </ScheduleLink>
              )
            }
          />
        );
        break;
      case "pace":
        body = <PaceBody goal={goal} overview={overview} />;
        break;
      case "final-review": {
        const weak = overview.weakItems;
        body = (
          <SimpleBody
            exam={goal.exam}
            daysLeft={goal.daysLeft}
            title="Repaso final"
            text={
              weak > 0
                ? `${goal.daysLeft === 0 ? "Hoy es tu examen" : "Tu examen es mañana"}: tu meta es repasar tus ${plural(weak, "carta más fallada", "cartas más falladas")}.`
                : `${goal.daysLeft === 0 ? "Hoy es tu examen" : "Tu examen es mañana"}: haz un repaso ligero y confía en lo que sabes.`
            }
            answeredToday={overview.answeredToday}
            action={
              weak > 0 ? (
                <Link
                  href="/mas-falladas"
                  className={buttonVariants({ variant: "soft", size: "sm" })}
                >
                  Repasar falladas
                </Link>
              ) : (
                <PlayLink size={10} />
              )
            }
          />
        );
        break;
      }
      case "mastered":
        body = (
          <SimpleBody
            exam={goal.exam}
            daysLeft={goal.daysLeft}
            title="Ya dominas todas las cartas"
            text="Tu meta ahora es mantenerte: una partida corta al día para llegar en forma."
            answeredToday={overview.answeredToday}
            action={<PlayLink size={10} />}
          />
        );
        break;
    }
  }

  return (
    <DashboardTile
      id="widget-meta-hoy"
      title="Tu meta diaria"
      icon={<Target aria-hidden />}
      className={cn("@container", className)}
    >
      {body}
    </DashboardTile>
  );
}

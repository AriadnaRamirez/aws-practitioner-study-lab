"use client";

import Link from "next/link";
import { ChevronRight, Play, Target } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { ProgressOverview, UserExam } from "@aps/shared";
import { getExamCatalogEntry } from "@aps/shared";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardTile, TileMessage, tileLinkClass } from "./dashboard-tile";
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

const RING_SIZE = 112;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function ProgressRing({
  value,
  goal,
  label,
}: {
  value: number;
  goal: number;
  label: string;
}) {
  const ratio = goal > 0 ? Math.min(value / goal, 1) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={goal}
      aria-valuenow={Math.min(value, goal)}
      className="relative size-28 shrink-0"
    >
      <svg
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="size-full -rotate-90"
        aria-hidden
      >
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
          strokeDashoffset={RING_LENGTH * (1 - ratio)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        aria-hidden
      >
        <span className="font-display text-3xl font-semibold leading-none tabular-nums text-[var(--foreground)]">
          {value}
        </span>
        <span className="mt-1 text-xs tabular-nums text-[var(--foreground-muted)]">
          de {goal}
        </span>
      </div>
    </div>
  );
}

function AnswersBar({ done, goal }: { done: number; goal: number }) {
  const pct = goal > 0 ? Math.min(Math.round((done / goal) * 100), 100) : 0;
  return (
    <div className="mt-4">
      <div className="flex min-w-0 items-baseline justify-between gap-3 text-xs">
        <span className="text-[var(--foreground-muted)]">Respondidas hoy</span>
        <span className="shrink-0 tabular-nums text-[var(--foreground)]">
          {done}{" "}
          <span className="text-[var(--foreground-muted)]">de ~{goal} aprox.</span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`Cartas respondidas hoy: ${done} de aproximadamente ${goal}`}
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={Math.min(done, goal)}
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-hover)]"
      >
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-700 ease-out"
          style={{ width: `${Math.max(pct, done > 0 ? 2 : 0)}%` }}
        />
      </div>
    </div>
  );
}

/** Starts a quick game right away, sized to what is left of today's goal. */
function PlayLink({ size, again = false }: { size: number; again?: boolean }) {
  return (
    <Link
      href={`/estudiar?quick=1&start=${size}`}
      className={cn(
        buttonVariants({ size: "sm" }),
        "gap-1.5 focus-visible:ring-offset-[var(--surface-elevated)]",
      )}
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
    <div className="flex min-w-0 flex-col items-start gap-5 min-[400px]:flex-row min-[400px]:items-center">
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
        <ProgressRing
          value={answeredToday}
          goal={goal}
          label={`Cartas respondidas hoy: ${answeredToday} de ${goal}`}
        />
      }
    >
      <p
        className="font-display text-lg font-semibold leading-snug text-[var(--foreground)] sm:text-xl"
        aria-live="polite"
      >
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
            className="grid grid-cols-4 gap-1 rounded-full bg-[var(--surface)] p-1"
          >
            {GOAL_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={goal === n}
                onClick={() => chooseGoal(n)}
                className={cn(
                  "h-7 min-w-10 rounded-full px-2.5 text-xs font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  goal === n
                    ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
                )}
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
        <ProgressRing
          value={learned}
          goal={goal.cardsPerDay}
          label={`Cartas aprendidas hoy: ${learned} de ${goal.cardsPerDay}`}
        />
      }
    >
      <ExamLine exam={goal.exam} daysLeft={goal.daysLeft} />
      <p
        className="mt-1.5 font-display text-lg font-semibold leading-snug text-[var(--foreground)] sm:text-xl"
        aria-live="polite"
      >
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
      <p className="mt-1.5 font-display text-lg font-semibold leading-snug text-[var(--foreground)] sm:text-xl">
        {title}
      </p>
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
  timeZone,
  examsError,
  className,
}: {
  exams: UserExam[] | null;
  overview: ProgressOverview | null;
  timeZone: string;
  examsError: boolean;
  className?: string;
}) {
  let body: ReactNode;
  if (!overview || (!exams && !examsError)) {
    body = <TileMessage>Cargando…</TileMessage>;
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
                <TileMessage>No pudimos cargar tus exámenes.</TileMessage>
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
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "focus-visible:ring-offset-[var(--surface-elevated)]",
                  )}
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
      icon={<Target className="size-4" />}
      className={className}
    >
      {body}
    </DashboardTile>
  );
}

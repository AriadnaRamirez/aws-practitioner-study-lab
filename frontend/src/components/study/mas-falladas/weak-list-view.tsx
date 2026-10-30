"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { MASTERY_STREAK, planWeakReview, type WeakItem } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { WeakInsightsPanel } from "./weak-insights-panel";
import {
  WeakItemCard,
  WeakItemCardSkeleton,
} from "./weak-item-card";
import { isMastered, plural } from "./weak-insights";

const pageClass =
  "mx-auto w-full min-w-0 max-w-xl px-6 py-8 sm:py-10 md:max-w-5xl lg:max-w-6xl lg:px-8 lg:py-12";

const sectionTitleClass =
  "font-display text-lg font-semibold tracking-tight text-[var(--foreground)]";

const summaryClass =
  "rounded-2xl bg-[var(--surface)] p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] sm:p-6";

const DOT = {
  danger: "bg-[var(--danger)]",
  accent: "bg-[var(--accent)]",
  success: "bg-[var(--success)]",
} as const;

type Tone = keyof typeof DOT;

const RING_SIZE = 88;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function WeakHeader({
  subtitle,
  mascot = false,
}: {
  subtitle?: string;
  mascot?: boolean;
}) {
  return (
    <header className="flex items-center gap-4">
      <div className="min-w-0">
        <h1 className="font-sans text-2xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] sm:text-3xl">
          Más falladas
        </h1>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          {subtitle ?? "Repásalas hasta dominarlas."}
        </p>
      </div>
      {mascot ? (
        <Mascot
          pose="study"
          size="sm"
          glow={false}
          float
          className="h-16 w-24 shrink-0 sm:h-24 sm:w-32"
        />
      ) : null}
    </header>
  );
}

function QuietStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: Tone;
}) {
  return (
    <div className="min-w-0">
      <dd
        className={cn(
          "text-2xl font-extrabold leading-none tabular-nums tracking-tight",
          value ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]",
        )}
      >
        {value}
      </dd>
      <dt className="mt-1.5 flex items-start gap-1.5 text-xs leading-tight text-[var(--foreground-muted)]">
        <span aria-hidden className={cn("mt-1 size-1.5 shrink-0 rounded-full", DOT[tone])} />
        {label}
      </dt>
    </div>
  );
}

function MasteryRing({ mastered, total }: { mastered: number; total: number }) {
  const ratio = total > 0 ? mastered / total : 0;
  return (
    <div
      role="img"
      aria-label={`${mastered} de ${total} dominadas`}
      className="relative size-20 shrink-0 sm:size-24"
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
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden>
        <span className="font-display text-xl font-semibold leading-none tabular-nums text-[var(--foreground)] sm:text-2xl">
          {mastered}
        </span>
        <span className="mt-0.5 text-[11px] tabular-nums text-[var(--foreground-muted)]">
          de {total}
        </span>
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center text-center">
      <Mascot pose="champion" size="lg" glow={false} float />
      <h2 className="mt-6 font-sans text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
        ¡No tienes cartas falladas!
      </h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--foreground-muted)]">
        Cuando una carta se te resista, aparecerá aquí con lo que debes
        recordar.
      </p>
      <Link
        href="/estudiar"
        className={cn(buttonVariants({ size: "lg" }), "mt-6")}
      >
        Ir a estudiar
      </Link>
    </div>
  );
}

export function WeakSignedOut() {
  return (
    <div className={pageClass}>
      <WeakHeader subtitle="Inicia sesión para ver las cartas que más se te resisten." />
      <Link
        href="/login"
        className={cn(buttonVariants({ size: "lg" }), "mt-8")}
      >
        Entrar
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className={pageClass} aria-busy>
      <WeakHeader mascot />
      <p className="sr-only" role="status">
        Cargando tus cartas más falladas…
      </p>
      <div aria-hidden className={cn(summaryClass, "mt-8 flex items-center gap-4 sm:gap-6")}>
        <span className="size-20 shrink-0 rounded-full bg-[var(--surface-hover)] motion-safe:animate-pulse sm:size-24" />
        <span className="grid min-w-0 grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex flex-col gap-2">
              <span className="h-7 w-8 rounded-md bg-[var(--surface-hover)] motion-safe:animate-pulse" />
              <span className="h-3 w-14 max-w-full rounded-md bg-[var(--surface-hover)] motion-safe:animate-pulse" />
            </span>
          ))}
        </span>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <WeakItemCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function WeakListView({
  items,
  error,
  pending: studyPending,
  onStudyWeak,
  onRetry,
}: {
  items: WeakItem[] | null;
  error: string | null;
  pending: boolean;
  onStudyWeak: () => void;
  onRetry: () => void;
}) {
  if (items == null) return <LoadingState />;

  if (items.length === 0) {
    return (
      <div className={pageClass}>
        <WeakHeader />
        {error ? (
          <>
            <p className="mt-6 text-sm text-[var(--danger)]" role="alert">
              {error}
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-4"
              onClick={onRetry}
            >
              Reintentar
            </Button>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    );
  }

  const toMaster = items.filter((it) => !isMastered(it));
  const mastered = items.filter(isMastered);
  const almost = toMaster.filter(
    (it) => it.consecutiveCorrect === MASTERY_STREAK - 1,
  ).length;
  const round = planWeakReview(items).queue.length;

  return (
    <div className={pageClass}>
      <WeakHeader mascot />

      <section aria-label="Resumen" className={cn(summaryClass, "mt-8")}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex min-w-0 flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-5 sm:gap-6">
            <MasteryRing mastered={mastered.length} total={items.length} />
            <dl className="grid min-w-0 grid-cols-3 gap-x-3 gap-y-1 sm:gap-x-6">
              <QuietStat label="Por dominar" value={toMaster.length - almost} tone="danger" />
              <QuietStat label="A 1 acierto" value={almost} tone="accent" />
              <QuietStat label="Dominadas" value={mastered.length} tone="success" />
            </dl>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-1.5 sm:items-end">
            <Button
              type="button"
              size="lg"
              className="w-full sm:w-auto"
              disabled={studyPending}
              onClick={onStudyWeak}
            >
              {studyPending ? (
                <>
                  <Spinner label="Preparando el refuerzo" />
                  Preparando…
                </>
              ) : (
                "Reforzar"
              )}
            </Button>
            <p className="text-center text-xs text-[var(--foreground-muted)] sm:text-right">
              Ronda de {plural(round, "carta", "cartas")}
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <p className="mt-4 text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <WeakInsightsPanel
        items={items}
        pending={toMaster}
        studyPending={studyPending}
        onStudyWeak={onStudyWeak}
      />

      {toMaster.length ? (
        <section aria-labelledby="mas-falladas-por-dominar" className="mt-12">
          <h2 id="mas-falladas-por-dominar" className={sectionTitleClass}>
            Por dominar
            <span className="ml-2 text-sm font-medium tabular-nums text-[var(--foreground-muted)]">
              {toMaster.length}
            </span>
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {toMaster.map((item) => (
              <li key={`${item.itemType}:${item.itemId}`} className="flex">
                <WeakItemCard item={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {mastered.length ? (
        <details
          className="group mt-12"
          open={toMaster.length === 0 ? true : undefined}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-1 py-2 transition-colors hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] [&::-webkit-details-marker]:hidden">
            <span className={cn(sectionTitleClass, "flex min-w-0 items-center gap-2")}>
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-[var(--success)]" />
              Ya las dominas
              <span className="text-sm font-medium tabular-nums text-[var(--foreground-muted)]">
                {mastered.length}
              </span>
            </span>
            <ChevronDown
              aria-hidden
              className="size-5 shrink-0 text-[var(--foreground-muted)] group-open:rotate-180 motion-safe:transition-transform"
            />
          </summary>
          <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mastered.map((item) => (
              <li key={`${item.itemType}:${item.itemId}`} className="flex">
                <WeakItemCard item={item} compact />
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

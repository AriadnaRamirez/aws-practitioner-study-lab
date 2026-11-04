"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { MASTERY_STREAK, planWeakReview, type WeakItem } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { SECTION_TITLE } from "@/components/ui/page";
import { Skeleton, Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { buildInsights, InsightsStrip } from "./weak-insights-panel";
import {
  WeakItemDialog,
  WeakLaneCard,
  WeakLaneCardSkeleton,
} from "./weak-item-card";
import { isMastered, plural } from "./weak-insights";
import { loginHref } from "@/lib/route-labels";
import { WEAK_REVIEW_HREF } from "@/lib/study-categories";

const INTRO = `Aquí están las cartas que se te dificultan. Con ${MASTERY_STREAK} aciertos seguidos, ya la dominas.`;
/** Cards shown per lane before "Ver todas". */
const LANE_LIMIT = 5;

/** Red → amber → light green → green: copper stays reserved for the primary action. */
type Tone = "danger" | "warning" | "fresh" | "success";

const FILL: Record<Tone, string> = {
  danger: "bg-[var(--danger)]",
  warning: "bg-[var(--warning)]",
  fresh: "bg-[var(--success-text)]",
  success: "bg-[var(--success)]",
};

/** One lane per streak step: a hit moves the card right, a miss sends it back to the first lane. */
const STAGES: Array<{ hits: number; title: string; tone: Tone }> = [
  { hits: 0, title: "Recién falladas", tone: "danger" },
  { hits: 1, title: "Van bien", tone: "warning" },
  { hits: 2, title: "Casi dominadas", tone: "fresh" },
  { hits: 3, title: "Dominadas", tone: "success" },
];

function stageOf(item: WeakItem): number {
  return Math.min(Math.max(item.consecutiveCorrect, 0), MASTERY_STREAK);
}

function StepDots({ hits, tone }: { hits: number; tone: Tone }) {
  return (
    <span aria-hidden className="inline-flex gap-1">
      {Array.from({ length: MASTERY_STREAK }, (_, i) => (
        <span
          key={i}
          className={cn(
            "size-2 rounded-full",
            i < hits ? FILL[tone] : "bg-[var(--surface-hover)]",
            hits === 0 &&
              i === 0 &&
              "ring-2 ring-[var(--danger)]/70 ring-inset",
          )}
        />
      ))}
    </span>
  );
}

/** How the list splits across the four steps, as one segmented bar. */
function StageBar({ counts, total }: { counts: number[]; total: number }) {
  return (
    <div className="mt-6">
      <div
        role="img"
        aria-label={STAGES.map((s, i) => `${s.title}: ${counts[i]}`).join(", ")}
        className="flex h-3 w-full gap-1 overflow-hidden rounded-full"
      >
        {STAGES.map((s, i) =>
          counts[i] ? (
            <span
              key={s.hits}
              className={cn("h-full rounded-full", FILL[s.tone])}
              style={{ flexGrow: counts[i], flexBasis: 0 }}
            />
          ) : null,
        )}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-4">
        {STAGES.map((s, i) => (
          <div key={s.hits} className="flex min-w-0 items-center gap-2 text-sm">
            <span
              aria-hidden
              className={cn("size-2 shrink-0 rounded-full", FILL[s.tone])}
            />
            <dt className="order-last min-w-0 truncate text-[var(--foreground-muted)]">
              {s.title}
            </dt>
            <dd className="font-bold tabular-nums text-[var(--foreground)]">
              {counts[i]}
            </dd>
          </div>
        ))}
      </dl>
      <p className="sr-only">
        {plural(total, "carta fallada", "cartas falladas")} en total.
      </p>
    </div>
  );
}

/** A small fanned stack with the round size on the top card. */
function MiniDeck({ count }: { count: number }) {
  return (
    <div aria-hidden className="relative h-24 w-[4.25rem] shrink-0">
      <span className="absolute inset-0 -rotate-[12deg] rounded-xl bg-[var(--surface-hover)] opacity-50" />
      <span className="absolute inset-0 rotate-[7deg] rounded-xl bg-[var(--surface-hover)]" />
      <span className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-[var(--card-face)] shadow-[var(--shadow-float)]">
        <span className="text-3xl font-extrabold leading-none tabular-nums text-[var(--accent)]">
          {count}
        </span>
        <span className="mt-1 text-[0.625rem] font-bold uppercase tracking-wider text-[var(--card-face-fg)] opacity-60">
          cartas
        </span>
      </span>
    </div>
  );
}

function RoundCard({
  items,
  toMaster,
  pending,
  onStudyWeak,
}: {
  items: WeakItem[];
  toMaster: number;
  pending: boolean;
  onStudyWeak: () => void;
}) {
  const plan = planWeakReview(items);
  const done = toMaster === 0;

  return (
    <Card
      as="section"
      aria-labelledby="ronda-refuerzo"
      className="relative mt-16 lg:mt-0"
    >
      <Mascot
        pose={done ? "champion" : "study"}
        size="sm"
        glow={false}
        className="pointer-events-none absolute -top-[4.5rem] right-4 h-24 w-24"
      />
      <div className="flex items-center gap-5">
        {done ? null : <MiniDeck count={plan.queue.length} />}
        <div className="min-w-0">
          <h2
            id="ronda-refuerzo"
            className="text-sm font-semibold text-[var(--foreground-muted)]"
          >
            {done ? "Todo al día" : "Ronda de refuerzo"}
          </h2>
          <p className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-[var(--foreground)]">
            {done
              ? "Las dominas todas"
              : plural(plan.queue.length, "carta", "cartas")}
          </p>
          <p className="mt-1 text-sm leading-snug text-[var(--foreground-muted)]">
            {done
              ? "Sigue con partidas nuevas: lo que falles llegará aquí."
              : plan.refresh
                ? `${plan.pending} por dominar + ${plan.refresh} que ya dominas, para que no se te olvide.`
                : `${plural(plan.pending, "carta", "cartas")} por dominar, primero las que más fallas.`}
          </p>
        </div>
      </div>

      {done ? (
        <Link
          href="/estudiar"
          className={buttonVariants({ size: "lg", className: "mt-5 w-full" })}
        >
          Ir a estudiar
        </Link>
      ) : (
        <>
          <Button
            type="button"
            size="lg"
            className="mt-5 w-full"
            disabled={pending}
            onClick={onStudyWeak}
          >
            {pending ? (
              <>
                <Spinner label="Preparando el refuerzo" />
                Preparando…
              </>
            ) : (
              "Empezar refuerzo"
            )}
          </Button>
          <p className="mt-2.5 text-center text-xs text-[var(--foreground-muted)]">
            Si fallas una, vuelve a salir. Puedes salir cuando quieras.
          </p>
        </>
      )}
    </Card>
  );
}

function Lane({
  stage,
  items,
  onOpen,
}: {
  stage: (typeof STAGES)[number];
  items: WeakItem[];
  onOpen: (item: WeakItem) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const id = `carril-${stage.hits}`;
  const shown = expanded ? items : items.slice(0, LANE_LIMIT);
  const hidden = items.length - shown.length;

  return (
    <section
      aria-labelledby={id}
      className="relative flex min-w-0 flex-col rounded-2xl bg-[var(--surface)] p-3 shadow-[var(--shadow-raised)]"
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-5 top-0 h-0.5 rounded-b-full",
          FILL[stage.tone],
        )}
      />
      <header className="flex items-center justify-between gap-3 px-1.5 pb-3 pt-1.5">
        <div className="min-w-0">
          <h3
            id={id}
            className="truncate text-sm font-semibold text-[var(--foreground)]"
          >
            {stage.title}
          </h3>
          <p className="mt-1 flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
            <StepDots hits={stage.hits} tone={stage.tone} />
            {stage.hits} de {MASTERY_STREAK} seguidas
          </p>
        </div>
        <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-elevated)] px-2 text-sm font-bold tabular-nums text-[var(--foreground)]">
          {items.length}
        </span>
      </header>

      {items.length ? (
        <ul className="flex flex-col gap-2">
          {shown.map((item) => (
            <li key={`${item.itemType}:${item.itemId}`}>
              <WeakLaneCard item={item} onOpen={onOpen} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-[var(--border)] px-3 py-4 text-center text-xs text-[var(--foreground-muted)]">
          {stage.hits === MASTERY_STREAK
            ? "Aquí llegarán las que domines."
            : "Ninguna aquí ahora."}
        </p>
      )}

      {hidden > 0 || expanded ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
        >
          {expanded ? "Ver menos" : `Ver ${hidden} más`}
        </button>
      ) : null}
    </section>
  );
}

function Board({
  items,
  onOpen,
}: {
  items: WeakItem[];
  onOpen: (item: WeakItem) => void;
}) {
  const byStage = STAGES.map((s) =>
    items.filter((it) => stageOf(it) === s.hits),
  );
  return (
    <section aria-labelledby="camino" className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="camino" className={SECTION_TITLE}>
          Camino a dominarlas
        </h2>
        <p className="text-xs text-[var(--foreground-muted)]">
          Toca una carta para ver la respuesta y la explicación.
        </p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {STAGES.map((stage, i) => (
          <Lane
            key={stage.hits}
            stage={stage}
            items={byStage[i]}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}

const HEADER =
  "grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-center";

const INTRO_CLASS = "max-w-prose text-base text-[var(--foreground-muted)]";

function EmptyState({
  hasPlayed,
  error,
  onRetry,
}: {
  hasPlayed: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <>
      <p className={INTRO_CLASS}>
        {error ? "No pudimos cargar tu lista. Inténtalo de nuevo." : INTRO}
      </p>
      {error ? (
        <Notice
          tone="danger"
          boxed
          className="mt-8"
          action={
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onRetry}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Notice>
      ) : (
        <Card className="mt-8 flex flex-col items-center px-6 py-10 text-center">
          <Mascot
            pose={hasPlayed ? "champion" : "wave"}
            size="md"
            glow={false}
          />
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
            {hasPlayed
              ? "¡No tienes cartas falladas!"
              : "Aún no hay fallos que repasar"}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-[var(--foreground-muted)]">
            {hasPlayed
              ? "Cuando una carta se te resista, aparecerá aquí con lo que debes recordar."
              : "Juega tu primera partida: las cartas que falles aparecerán aquí para repasarlas."}
          </p>
          <Link
            href={hasPlayed ? "/estudiar" : "/estudiar?quick=1&start=10"}
            className={cn(buttonVariants({ size: "lg" }), "mt-6")}
          >
            {hasPlayed ? "Jugar una partida" : "Jugar mi primera partida"}
          </Link>
        </Card>
      )}
    </>
  );
}

export function WeakSignedOut() {
  return (
    <>
      <p className={INTRO_CLASS}>
        Entra para ver las cartas que más se te dificultan.
      </p>
      <Link
        href={loginHref(WEAK_REVIEW_HREF)}
        className={cn(buttonVariants({ size: "lg" }), "mt-6")}
      >
        Entrar
      </Link>
    </>
  );
}

function LoadingState() {
  return (
    <div aria-busy>
      <p className="sr-only" role="status">
        Cargando tus cartas más falladas…
      </p>
      <div className={HEADER}>
        <div className="min-w-0">
          <p className={INTRO_CLASS}>{INTRO}</p>
          <Skeleton className="mt-6 block h-3 w-full rounded-full" />
          <Skeleton className="mt-3 block h-4 w-2/3" />
        </div>
        <Skeleton className="mt-16 block h-52 w-full rounded-2xl lg:mt-0" />
      </div>
      <div
        aria-hidden
        className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5"
      >
        {STAGES.map((s) => (
          <div
            key={s.hits}
            className="flex flex-col gap-2 rounded-2xl bg-[var(--surface)] p-3"
          >
            <Skeleton className="m-1.5 block h-4 w-28" />
            <WeakLaneCardSkeleton />
            <WeakLaneCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WeakListView({
  items,
  hasPlayed = true,
  error,
  pending: studyPending,
  onStudyWeak,
  onRetry,
}: {
  items: WeakItem[] | null;
  /** False for an account that never answered a card. */
  hasPlayed?: boolean;
  error: string | null;
  pending: boolean;
  onStudyWeak: () => void;
  onRetry: () => void;
}) {
  const [openItem, setOpenItem] = useState<WeakItem | null>(null);
  const closeItem = useCallback(() => setOpenItem(null), []);

  if (items == null) return <LoadingState />;

  if (items.length === 0) {
    return <EmptyState hasPlayed={hasPlayed} error={error} onRetry={onRetry} />;
  }

  const toMaster = items.filter((it) => !isMastered(it));
  const counts = STAGES.map(
    (s) => items.filter((it) => stageOf(it) === s.hits).length,
  );
  const insights = buildInsights(items, toMaster);

  return (
    <>
      <div className={HEADER}>
        <div className="min-w-0">
          <p className={INTRO_CLASS}>{INTRO}</p>
          <StageBar counts={counts} total={items.length} />
        </div>
        <RoundCard
          items={items}
          toMaster={toMaster.length}
          pending={studyPending}
          onStudyWeak={onStudyWeak}
        />
      </div>

      {error ? (
        <Notice tone="danger" className="mt-6">
          {error}
        </Notice>
      ) : null}

      <InsightsStrip
        insights={insights}
        studyPending={studyPending}
        onStudyWeak={onStudyWeak}
        onOpenItem={setOpenItem}
        className="mt-10"
      />

      <Board items={items} onOpen={setOpenItem} />

      <WeakItemDialog item={openItem} onClose={closeItem} />
    </>
  );
}

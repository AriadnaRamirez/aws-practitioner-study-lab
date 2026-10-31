"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCallback, useState } from "react";
import { MASTERY_STREAK, planWeakReview, type WeakItem } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { BentoGrid } from "@/components/ui/bento";
import { BENTO_LIST, bentoFill } from "@/components/ui/bento-tile";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { Notice } from "@/components/ui/notice";
import {
  PAGE_TITLE,
  PageContainer,
  PageHeader,
  SECTION_TITLE,
  SectionTitle,
} from "@/components/ui/page";
import { Skeleton, Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { WeakInsightsPanel } from "./weak-insights-panel";
import {
  WeakItemCard,
  WeakItemCardSkeleton,
  WeakItemDialog,
  WeakItemTile,
} from "./weak-item-card";
import { isMastered, plural } from "./weak-insights";

const TITLE = "Más falladas";
/** Card lists: 2-up on md, 3-up from lg, on the page's 12 tracks; the last row always fills. */
const TILES_PER_ROW = { md: 2, lg: 3 } as const;
const SUBTITLE = "Repásalas hasta dominarlas.";

const DOT = {
  danger: "bg-[var(--danger)]",
  accent: "bg-[var(--accent)]",
  success: "bg-[var(--success)]",
} as const;

function MetricChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: keyof typeof DOT;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] py-1.5 pl-3 pr-3.5">
      <span aria-hidden className={cn("size-2 shrink-0 rounded-full", DOT[tone])} />
      <dt className="order-last text-sm text-[var(--foreground-muted)]">{label}</dt>
      <dd
        className={cn(
          "text-sm font-extrabold tabular-nums",
          value ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center text-center">
      <Mascot pose="champion" size="lg" glow={false} />
      <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
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
    <PageContainer width="wide">
      <PageHeader
        title={TITLE}
        subtitle="Inicia sesión para ver las cartas que más se te resisten."
      />
      <Link
        href="/login"
        className={cn(buttonVariants({ size: "lg" }), "mt-8")}
      >
        Entrar
      </Link>
    </PageContainer>
  );
}

function LoadingState() {
  return (
    <PageContainer width="wide" className="pt-4 sm:pt-6 lg:pt-6" aria-busy>
      <PageHeader
        title={TITLE}
        subtitle={SUBTITLE}
        mascot="study"
        actions={
          <span aria-hidden className="flex flex-wrap gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-8 w-32 rounded-full" />
            ))}
          </span>
        }
      />
      <p className="sr-only" role="status">
        Cargando tus cartas más falladas…
      </p>
      <div aria-hidden className={cn(BENTO_LIST, "mt-10 md:mt-5 lg:mt-6")}>
        {[0, 1, 2].map((i) => (
          <Card key={i} className={cn(bentoFill(i, 3, { md: 3 }), "flex flex-col gap-3")}>
            <Skeleton className="block h-4 w-28" />
            <Skeleton className="block h-6 w-3/4" />
            <Skeleton className="block h-4 w-1/2" />
            <Skeleton className="mt-2 block h-4 w-24" />
          </Card>
        ))}
      </div>
      <div className={cn(BENTO_LIST, "mt-10 md:mt-5 lg:mt-6")}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={cn(bentoFill(i, 6, TILES_PER_ROW), "flex")}>
            <WeakItemCardSkeleton />
          </div>
        ))}
      </div>
    </PageContainer>
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
  const [openItem, setOpenItem] = useState<WeakItem | null>(null);
  const closeItem = useCallback(() => setOpenItem(null), []);

  if (items == null) return <LoadingState />;

  if (items.length === 0) {
    return (
      <PageContainer width="wide">
        <PageHeader title={TITLE} subtitle={SUBTITLE} />
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
          <EmptyState />
        )}
      </PageContainer>
    );
  }

  const toMaster = items.filter((it) => !isMastered(it));
  const mastered = items.filter(isMastered);
  const almost = toMaster.filter(
    (it) => it.consecutiveCorrect === MASTERY_STREAK - 1,
  ).length;
  const round = planWeakReview(items).queue.length;

  const summary =
    toMaster.length === 0
      ? `Dominaste las ${plural(items.length, "carta", "cartas")} de tu lista.`
      : `Te ${toMaster.length === 1 ? "falta" : "faltan"} ${toMaster.length} de ${plural(items.length, "carta", "cartas")} por dominar.`;

  return (
    <PageContainer width="wide" className="pt-4 sm:pt-6 lg:pt-6">
      <BentoGrid flowOnMobile>
        <header
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4"
        >
          <div className="min-w-0 sm:self-end">
            <h1 className={PAGE_TITLE}>{TITLE}</h1>
            <p className="mt-2 max-w-prose text-base text-[var(--foreground-muted)]">
              {summary}
            </p>
          </div>
          <Mascot
            pose="study"
            size="lg"
            glow={false}
            className="h-28 w-28 shrink-0 sm:row-span-2 sm:h-44 sm:w-44 md:h-52 md:w-60 lg:h-60 lg:w-72"
          />
          <div className="col-span-2 min-w-0 sm:col-span-1 sm:self-start">
            <dl aria-label="Resumen" className="mt-4 flex flex-wrap gap-2">
              <MetricChip label="por dominar" value={toMaster.length - almost} tone="danger" />
              <MetricChip label="a 1 acierto" value={almost} tone="accent" />
              <MetricChip label="dominadas" value={mastered.length} tone="success" />
            </dl>
            {toMaster.length ? (
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                <Button
                  type="button"
                  disabled={studyPending}
                  onClick={onStudyWeak}
                  className="px-7"
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
                <span className="text-sm text-[var(--foreground-muted)]">
                  Ronda de {plural(round, "carta", "cartas")}
                </span>
              </div>
            ) : null}
          </div>
        </header>

        {error ? (
          <Notice tone="danger" className="mt-4 md:mt-0">
            {error}
          </Notice>
        ) : null}

        <WeakInsightsPanel
          items={items}
          pending={toMaster}
          studyPending={studyPending}
          onStudyWeak={onStudyWeak}
          onOpenItem={setOpenItem}
          className="mt-10 md:mt-0"
        />

        {toMaster.length ? (
          <section aria-labelledby="mas-falladas-por-dominar" className="mt-10 md:mt-0">
            <SectionTitle id="mas-falladas-por-dominar" count={toMaster.length}>
              Por dominar
            </SectionTitle>
            <ul className={cn(BENTO_LIST, "mt-4")}>
              {toMaster.map((item, i) => (
                <li
                  key={`${item.itemType}:${item.itemId}`}
                  className={cn(bentoFill(i, toMaster.length, TILES_PER_ROW), "flex")}
                >
                  <WeakItemTile item={item} onOpen={setOpenItem} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {mastered.length ? (
          <details
            className="group mt-12 md:mt-0"
            open={toMaster.length === 0 ? true : undefined}
          >
            <summary
              className={cn(
                "-mx-1 flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-1 py-2 transition-colors hover:bg-[var(--surface)] [&::-webkit-details-marker]:hidden",
                FOCUS_RING,
              )}
            >
              <span className={cn(SECTION_TITLE, "flex min-w-0 items-center gap-2")}>
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
            <ul className={cn(BENTO_LIST, "mt-4")}>
              {mastered.map((item, i) => (
                <li
                  key={`${item.itemType}:${item.itemId}`}
                  className={cn(bentoFill(i, mastered.length, TILES_PER_ROW), "flex")}
                >
                  <WeakItemCard item={item} compact />
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </BentoGrid>

      <WeakItemDialog item={openItem} onClose={closeItem} />
    </PageContainer>
  );
}

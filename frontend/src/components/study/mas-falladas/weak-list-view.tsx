"use client";

import Link from "next/link";
import { ChevronDown, Dumbbell } from "lucide-react";
import { MASTERY_STREAK, planWeakReview, type WeakItem } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { WeakInsightsPanel } from "./weak-insights-panel";
import {
  WeakItemCard,
  WeakItemCardSkeleton,
  weakCardClass,
} from "./weak-item-card";
import { isMastered, plural } from "./weak-insights";

const pageClass =
  "mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:max-w-5xl lg:px-8 lg:py-12";

const sectionTitleClass =
  "font-sans text-lg font-bold tracking-tight text-[var(--foreground)]";

function WeakHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header>
      <h1 className="font-sans text-3xl font-extrabold leading-none tracking-tight text-[var(--foreground)] sm:text-4xl">
        Más falladas
      </h1>
      <p className="mt-2.5 text-sm text-[var(--foreground-muted)] sm:text-base">
        {subtitle ??
          "Las cartas que más se te resisten. Repásalas hasta dominarlas."}
      </p>
    </header>
  );
}

function SummaryText({
  total,
  pending,
}: {
  total: number;
  pending: number;
}) {
  if (pending === 0) {
    return (
      <>
        <strong>
          Ya dominas {total === 1 ? "la carta" : `las ${total} cartas`}
        </strong>{" "}
        que habías fallado.
      </>
    );
  }
  const strong = <strong>{plural(pending, "carta", "cartas")} por dominar</strong>;
  if (pending === total) {
    return <>Tienes {strong}.</>;
  }
  return (
    <>
      Te {pending === 1 ? "queda" : "quedan"} {strong} de las {total} que has
      fallado.
    </>
  );
}

/** Mirrors the backend round (`planWeakReview`): pending first, mastered only to fill. */
function ctaExplanation(items: WeakItem[]): string {
  const { pending, refresh } = planWeakReview(items);
  const again = "Si fallas una, te la volvemos a preguntar más adelante.";
  if (pending === 0) {
    return `Una ronda de repaso con ${plural(refresh, "carta que ya dominas", "cartas que ya dominas")}, para que no se te olviden. ${again}`;
  }
  const lead =
    pending === 1
      ? "Una ronda con tu carta por dominar."
      : `Una ronda con tus ${pending} cartas por dominar, empezando por las que más fallas.`;
  const fill = refresh
    ? ` Como son pocas, la completamos con ${refresh} que ya dominas, para que no se te olviden.`
    : "";
  return `${lead}${fill} ${again}`;
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
      <WeakHeader />
      <p className="sr-only" role="status">
        Cargando tus cartas más falladas…
      </p>
      <div aria-hidden className={cn(weakCardClass, "mt-8 gap-3 sm:p-6")}>
        <span className="h-5 w-2/3 rounded-md bg-[var(--surface-hover)] motion-safe:animate-pulse" />
        <span className="h-3 w-full rounded-md bg-[var(--surface-hover)] motion-safe:animate-pulse" />
        <span className="mt-2 h-12 w-64 max-w-full rounded-full bg-[var(--surface-hover)] motion-safe:animate-pulse" />
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

  return (
    <div className={pageClass}>
      <WeakHeader />

      <section
        aria-label="Resumen"
        className={cn(
          weakCardClass,
          "mt-8 gap-5 sm:p-6 md:flex-row md:items-center md:justify-between",
        )}
      >
        <div className="min-w-0 md:max-w-xl">
          <p className="text-lg leading-snug text-[var(--foreground)] sm:text-xl">
            <SummaryText total={items.length} pending={toMaster.length} />
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
            {ctaExplanation(items)}
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          className="w-full shrink-0 md:w-auto"
          disabled={studyPending}
          onClick={onStudyWeak}
        >
          {studyPending ? (
            <>
              <Spinner label="Preparando el refuerzo" />
              Preparando…
            </>
          ) : (
            <>
              <Dumbbell className="size-5" aria-hidden />
              Reforzar las más falladas
            </>
          )}
        </Button>
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
            Por dominar{" "}
            <span className="font-semibold text-[var(--foreground-muted)]">
              · {toMaster.length}
            </span>
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Léelas con calma: esto es lo que se te está resistiendo.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl bg-[var(--surface-elevated)] px-5 py-4 transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">
              <span className={cn(sectionTitleClass, "block")}>
                Ya las dominas{" "}
                <span className="font-semibold text-[var(--foreground-muted)]">
                  · {mastered.length}
                </span>
              </span>
              <span className="mt-0.5 block text-sm text-[var(--foreground-muted)]">
                Las fallaste antes, pero ya las acertaste{" "}
                {plural(MASTERY_STREAK, "vez", "veces")} seguidas.
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
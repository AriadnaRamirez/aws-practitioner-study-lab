"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  MASTERY_STREAK,
  type PodiumResponse,
  type StudySessionSummary,
} from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { Medal } from "@/components/shell/podium-trophy";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { ProgressRing } from "@/components/ui/progress";
import { Stat } from "@/components/ui/stat";
import { fetchPodium, notifyProgressChanged } from "@/lib/api";
import { ofPlayers } from "@/lib/podium-standing";
import { cn } from "@/lib/utils";

const HOME_HREF = "/dashboard";
const AUTO_RETURN_SECONDS = 45;

type Action = { label: string; onClick: () => void };

type Props = {
  summary: StudySessionSummary;
  playAgain?: Action;
  extraAction?: Action;
  /** Count down back to Inicio (off for Más falladas, which has its own list). */
  autoReturn?: boolean;
};

function headline(pct: number): string {
  if (pct >= 90) return "¡Sesión impecable!";
  if (pct >= 70) return "¡Muy bien!";
  if (pct >= 50) return "Buen avance";
  return "Cada error suma: sigue practicando";
}

/** Fills from zero on mount so the ring animates in. */
function useFillIn(target: number): number {
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setFilled(target), 50);
    return () => clearTimeout(t);
  }, [target]);
  return filled;
}

function PodiumStanding({
  podium,
}: {
  podium: PodiumResponse | null | "error";
}) {
  if (podium === null) {
    return (
      <p className="text-sm text-[var(--foreground-muted)]">
        Calculando tu lugar…
      </p>
    );
  }
  if (podium === "error") {
    return (
      <p className="text-sm text-[var(--foreground-muted)]">
        No pudimos cargar el podio ahora.
      </p>
    );
  }
  const { me, totalRanked } = podium;
  if (me.podiumHidden) {
    return (
      <p className="text-sm text-[var(--foreground-muted)]">
        Tu perfil está oculto del podio · {me.score}{" "}
        {me.score === 1 ? "concepto dominado" : "conceptos dominados"}
      </p>
    );
  }
  if (me.rank == null) {
    return (
      <p className="text-sm text-[var(--foreground-muted)]">
        Aún sin lugar en el podio. Entras al dominar tu primer concepto:
        acértalo {MASTERY_STREAK} veces seguidas.
      </p>
    );
  }
  return (
    <div className="flex items-center gap-4">
      {me.rank <= 3 ? (
        <Medal rank={me.rank as 1 | 2 | 3} className="h-14 w-11" />
      ) : null}
      <div>
        <p className="text-3xl font-extrabold tabular-nums tracking-tight text-[var(--foreground)]">
          #{me.rank}
          <span className="ml-2 text-sm font-medium tracking-normal text-[var(--foreground-muted)]">
            {ofPlayers(totalRanked)}
          </span>
        </p>
        <p className="text-sm text-[var(--foreground-muted)]">
          {me.score}{" "}
          {me.score === 1 ? "concepto dominado" : "conceptos dominados"} en
          total
        </p>
      </div>
    </div>
  );
}

export function SessionSummary({
  summary,
  playAgain,
  extraAction,
  autoReturn: autoReturnInitial = true,
}: Props) {
  const router = useRouter();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [podium, setPodium] = useState<PodiumResponse | null | "error">(null);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_RETURN_SECONDS);
  const [autoReturn, setAutoReturn] = useState(autoReturnInitial);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
    notifyProgressChanged();
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPodium("all")
      .then((res) => {
        if (!cancelled) setPodium(res);
      })
      .catch(() => {
        if (!cancelled) setPodium("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Anyone reading or using the summary keeps it: only an idle screen goes back to Inicio.
  useEffect(() => {
    if (!autoReturn) return;
    const stay = () => setAutoReturn(false);
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    for (const e of events) window.addEventListener(e, stay, { passive: true });
    return () => {
      for (const e of events) window.removeEventListener(e, stay);
    };
  }, [autoReturn]);

  useEffect(() => {
    if (!autoReturn) return;
    if (secondsLeft <= 0) {
      router.push(HOME_HREF);
      // Client navigation can stall (e.g. slow dev compile); fall back to a hard load.
      const fallback = setTimeout(
        () => window.location.assign(HOME_HREF),
        3000,
      );
      return () => clearTimeout(fallback);
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [autoReturn, router, secondsLeft]);

  const unique = summary.uniqueItems || 0;
  const firstTry = summary.firstTryCorrect;
  const resolved = summary.resolvedItems;
  const byConcept = firstTry != null && unique > 0;
  /** Per concept when available: re-asked misses inflate the raw answer count. */
  const ringPct = byConcept
    ? Math.round((firstTry / unique) * 100)
    : Math.min(100, Math.max(0, summary.accuracyPct));
  const filled = useFillIn(ringPct);
  const recovered =
    byConcept && resolved != null ? Math.max(0, resolved - firstTry) : 0;
  /** Más falladas lists every concept missed at least once, corrected or not. */
  const missed = byConcept ? Math.max(0, unique - firstTry) : 0;
  const dailyStreak = summary.dailyStreak ?? 0;
  const mastered = summary.masteredInSession ?? 0;
  const stats = [
    {
      label: "Respuestas correctas",
      value: `${summary.correctAnswers}/${summary.answered}`,
    },
    {
      label: mastered === 1 ? "Nuevo dominado" : "Nuevos dominados",
      value: String(mastered),
      hint:
        mastered === 0 ? `llegan con ${MASTERY_STREAK} seguidas` : undefined,
    },
    {
      label: "Mejor racha",
      value: String(summary.maxSessionStreak),
      hint: summary.maxSessionStreak === 1 ? "seguida" : "seguidas",
    },
    {
      label: "Racha diaria",
      value: String(dailyStreak),
      hint: dailyStreak === 1 ? "día" : "días",
    },
  ];

  return (
    <section
      data-session-summary
      className="animate-fade-up mx-auto max-w-xl py-6 lg:grid lg:max-w-5xl lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-10 xl:gap-x-14 [@media(max-height:500px)]:md:grid [@media(max-height:500px)]:md:max-w-none [@media(max-height:500px)]:md:grid-cols-2 [@media(max-height:500px)]:md:grid-rows-[auto_auto_auto_1fr] [@media(max-height:500px)]:md:gap-x-6 [@media(max-height:500px)]:md:py-2"
      aria-labelledby="resumen-sesion"
    >
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left lg:col-start-1 lg:row-start-1 [@media(max-height:500px)]:md:col-start-1 [@media(max-height:500px)]:md:row-start-1 [@media(max-height:500px)]:md:gap-4">
        <ProgressRing
          value={filled}
          label={
            byConcept
              ? "Conceptos acertados a la primera"
              : "Respuestas correctas"
          }
          className="size-36 sm:size-40 [@media(max-height:500px)]:md:size-28"
        >
          <span className="text-4xl font-extrabold tabular-nums tracking-tight text-[var(--foreground)]">
            {ringPct}%
          </span>
          <span className="text-xs text-[var(--foreground-muted)]">
            {byConcept ? "a la primera" : "correctas"}
          </span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--foreground-muted)]">
            Resumen de tu sesión
          </p>
          <h1
            id="resumen-sesion"
            ref={titleRef}
            tabIndex={-1}
            className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] outline-none sm:text-3xl"
          >
            {headline(ringPct)}
          </h1>
          {byConcept ? (
            <div className="mt-2 space-y-1 text-sm text-[var(--foreground-muted)]">
              <p>
                Acertaste{" "}
                <strong className="font-semibold text-[var(--foreground)]">
                  {firstTry} de {unique}
                </strong>{" "}
                {unique === 1 ? "concepto" : "conceptos"} a la primera
                {recovered > 0
                  ? ` y corregiste ${recovered} al repetirl${recovered === 1 ? "o" : "os"}`
                  : ""}
                .
              </p>
              {missed > 0 ? (
                <p>
                  {missed === 1
                    ? "El concepto que fallaste queda en Más falladas para repasarlo."
                    : `Los ${missed} conceptos que fallaste quedan en Más falladas para repasarlos.`}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Respondiste {summary.answered}{" "}
              {summary.answered === 1 ? "carta" : "cartas"} de {unique}{" "}
              {unique === 1 ? "concepto" : "conceptos"}.
            </p>
          )}
        </div>
        <Mascot
          pose="wave"
          size="sm"
          glow={false}
          className="hidden shrink-0 sm:block [@media(max-height:500px)]:md:hidden"
        />
      </div>

      <div className="lg:col-start-2 lg:row-span-4 lg:row-start-1 [@media(max-height:500px)]:md:col-start-2 [@media(max-height:500px)]:md:row-span-4 [@media(max-height:500px)]:md:row-start-1">
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-0 lg:grid-cols-2 [@media(max-height:500px)]:md:mt-0 [@media(max-height:500px)]:md:grid-cols-2">
          {stats.map((s) => (
            <Stat
              key={s.label}
              label={s.label}
              value={s.value}
              hint={s.hint}
              className="[@media(max-height:500px)]:md:py-2"
            />
          ))}
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-[var(--foreground-muted)]">
          Dominas un concepto al acertarlo {MASTERY_STREAK} veces seguidas,
          aunque sea en partidas distintas. Cada concepto dominado suma un punto
          en el podio.
        </p>

        <Card
          variant="flat"
          padding="sm"
          className="mt-4 [@media(max-height:500px)]:md:mt-3 [@media(max-height:500px)]:md:py-3"
        >
          <CardLabel as="p" className="mb-2">
            Tu posición en el podio
          </CardLabel>
          <PodiumStanding podium={podium} />
        </Card>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:col-start-1 lg:row-start-2 [@media(max-height:500px)]:md:col-start-1 [@media(max-height:500px)]:md:row-start-2 [@media(max-height:500px)]:md:mt-4">
        <Button
          size="lg"
          className="sm:flex-1"
          onClick={() => router.push(HOME_HREF)}
        >
          Ir al inicio
        </Button>
        {playAgain ? (
          <Button
            size="lg"
            variant="secondary"
            className="sm:flex-1"
            onClick={() => {
              setAutoReturn(false);
              playAgain.onClick();
            }}
          >
            {playAgain.label}
          </Button>
        ) : null}
        {extraAction ? (
          <Button
            size="lg"
            variant="secondary"
            className="sm:flex-1"
            onClick={() => {
              setAutoReturn(false);
              extraAction.onClick();
            }}
          >
            {extraAction.label}
          </Button>
        ) : null}
      </div>

      <div className="mt-5 lg:col-start-1 lg:row-start-3 [@media(max-height:500px)]:md:col-start-1 [@media(max-height:500px)]:md:row-start-3 [@media(max-height:500px)]:md:mt-3">
        {autoReturn ? (
          <>
            <div className="h-1 overflow-hidden rounded-full bg-[var(--surface-hover)]">
              <div
                className="h-full rounded-full bg-[var(--foreground-muted)] transition-[width] duration-1000 ease-linear"
                style={{
                  width: `${(secondsLeft / AUTO_RETURN_SECONDS) * 100}%`,
                }}
              />
            </div>
            <p className="mt-2 flex flex-wrap items-center justify-center gap-x-2 text-xs text-[var(--foreground-muted)]">
              <span aria-hidden>Volviendo al inicio en {secondsLeft} s</span>
              <span className="sr-only">
                Volverás al inicio en {AUTO_RETURN_SECONDS} segundos.
              </span>
              <button
                type="button"
                onClick={() => setAutoReturn(false)}
                className={cn(
                  "inline-flex min-h-6 items-center rounded-full px-1 font-semibold text-[var(--foreground)] underline-offset-4 hover:underline",
                  FOCUS_RING,
                )}
              >
                Quedarme aquí
              </button>
            </p>
          </>
        ) : (
          <p className="text-center text-xs text-[var(--foreground-muted)]">
            Te quedas en el resumen. Vuelve al inicio cuando quieras.
          </p>
        )}
      </div>
    </section>
  );
}

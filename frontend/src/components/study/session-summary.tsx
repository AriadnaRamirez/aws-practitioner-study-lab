"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PodiumResponse, StudySessionSummary } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { Medal } from "@/components/shell/podium-trophy";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { ProgressRing } from "@/components/ui/progress";
import { Stat } from "@/components/ui/stat";
import { fetchPodium } from "@/lib/api";
import { ofPlayers } from "@/lib/podium-standing";
import { cn } from "@/lib/utils";

const HOME_HREF = "/dashboard";
const AUTO_RETURN_SECONDS = 10;

type Action = { label: string; onClick: () => void };

type Props = {
  summary: StudySessionSummary;
  playAgain?: Action;
  extraAction?: Action;
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

function PodiumStanding({ podium }: { podium: PodiumResponse | null | "error" }) {
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
        Aún sin lugar en el podio. Domina tu primer concepto para entrar.
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
          {me.score} {me.score === 1 ? "concepto dominado" : "conceptos dominados"}{" "}
          en total
        </p>
      </div>
    </div>
  );
}

export function SessionSummary({ summary, playAgain, extraAction }: Props) {
  const router = useRouter();
  const [podium, setPodium] = useState<PodiumResponse | null | "error">(null);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_RETURN_SECONDS);
  const [autoReturn, setAutoReturn] = useState(true);

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

  useEffect(() => {
    if (!autoReturn) return;
    if (secondsLeft <= 0) {
      router.push(HOME_HREF);
      // Client navigation can stall (e.g. slow dev compile); fall back to a hard load.
      const fallback = setTimeout(() => window.location.assign(HOME_HREF), 3000);
      return () => clearTimeout(fallback);
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [autoReturn, router, secondsLeft]);

  const accuracy = Math.min(100, Math.max(0, summary.accuracyPct));
  const filled = useFillIn(accuracy);
  const dailyStreak = summary.dailyStreak ?? 0;
  const mastered = summary.masteredInSession ?? 0;
  const stats = [
    {
      label: "Aciertos",
      value: `${summary.correctAnswers}/${summary.answered}`,
    },
    {
      label: mastered === 1 ? "Nuevo dominado" : "Nuevos dominados",
      value: String(mastered),
    },
    {
      label: "Mejor racha",
      value: String(summary.maxSessionStreak),
      hint: "seguidas",
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
          label="Respuestas correctas"
          className="size-36 sm:size-40 [@media(max-height:500px)]:md:size-28"
        >
          <span className="text-4xl font-extrabold tabular-nums tracking-tight text-[var(--foreground)]">
            {Math.round(accuracy)}%
          </span>
          <span className="text-xs text-[var(--foreground-muted)]">correctas</span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--foreground-muted)]">
            Resumen de tu sesión
          </p>
          <h2
            id="resumen-sesion"
            className="mt-1 text-2xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] sm:text-3xl"
          >
            {headline(summary.accuracyPct)}
          </h2>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Respondiste {summary.answered}{" "}
            {summary.answered === 1 ? "carta" : "cartas"} de{" "}
            {summary.uniqueItems}{" "}
            {summary.uniqueItems === 1 ? "concepto" : "conceptos"}.
          </p>
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

      <div
        className="mt-5 lg:col-start-1 lg:row-start-3 [@media(max-height:500px)]:md:col-start-1 [@media(max-height:500px)]:md:row-start-3 [@media(max-height:500px)]:md:mt-3"
        aria-live="polite"
      >
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
              Volviendo al inicio en {secondsLeft} s
              <button
                type="button"
                onClick={() => setAutoReturn(false)}
                className={cn(
                  "rounded-full font-semibold text-[var(--foreground)] underline-offset-4 hover:underline",
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

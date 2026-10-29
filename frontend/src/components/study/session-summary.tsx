"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PodiumResponse, StudySessionSummary } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { Medal } from "@/components/shell/podium-trophy";
import { Button } from "@/components/ui/button";
import { fetchPodium } from "@/lib/api";
import { ofPlayers } from "@/lib/podium-standing";

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

function AccuracyRing({ pct }: { pct: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, pct));
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setFilled(clamped), 50);
    return () => clearTimeout(t);
  }, [clamped]);
  return (
    <div className="relative size-36 shrink-0 sm:size-40 [@media(max-height:500px)]:md:size-28">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--surface-hover)"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - filled / 100)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold tabular-nums tracking-tight">
          {Math.round(clamped)}%
        </span>
        <span className="text-xs text-[var(--foreground-muted)]">correctas</span>
      </div>
    </div>
  );
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
        <p className="font-display text-3xl font-bold tabular-nums tracking-tight">
          #{me.rank}
          <span className="ml-2 font-sans text-sm font-medium text-[var(--foreground-muted)]">
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
      className="mx-auto max-w-xl py-6 animate-[fade-up_0.4s_ease-out] lg:grid lg:max-w-5xl lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-10 xl:gap-x-14 [@media(max-height:500px)]:md:grid [@media(max-height:500px)]:md:max-w-none [@media(max-height:500px)]:md:grid-cols-2 [@media(max-height:500px)]:md:grid-rows-[auto_auto_auto_1fr] [@media(max-height:500px)]:md:gap-x-6 [@media(max-height:500px)]:md:py-2"
      aria-labelledby="resumen-sesion"
    >
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left lg:col-start-1 lg:row-start-1 [@media(max-height:500px)]:md:col-start-1 [@media(max-height:500px)]:md:row-start-1 [@media(max-height:500px)]:md:gap-4">
        <AccuracyRing pct={summary.accuracyPct} />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Resumen de tu sesión
          </p>
          <h2
            id="resumen-sesion"
            className="font-display mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl"
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
          float
          className="hidden shrink-0 sm:block [@media(max-height:500px)]:md:hidden"
        />
      </div>

      <div className="lg:col-start-2 lg:row-span-4 lg:row-start-1 [@media(max-height:500px)]:md:col-start-2 [@media(max-height:500px)]:md:row-span-4 [@media(max-height:500px)]:md:row-start-1">
        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:mt-0 lg:grid-cols-2 [@media(max-height:500px)]:md:mt-0 [@media(max-height:500px)]:md:grid-cols-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col-reverse rounded-2xl bg-[var(--surface-elevated)] px-4 py-3 [@media(max-height:500px)]:md:py-2"
            >
              <dt className="text-xs text-[var(--foreground-muted)]">{s.label}</dt>
              <dd className="font-display text-2xl font-bold tabular-nums">
                {s.value}
                {s.hint ? (
                  <span className="ml-1 font-sans text-xs font-medium text-[var(--foreground-muted)]">
                    {s.hint}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 rounded-2xl bg-[var(--surface-elevated)] px-5 py-4 [@media(max-height:500px)]:md:mt-3 [@media(max-height:500px)]:md:py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
            Tu posición en el podio
          </p>
          <PodiumStanding podium={podium} />
        </div>
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
                className="font-semibold text-[var(--foreground)] underline-offset-4 hover:underline"
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

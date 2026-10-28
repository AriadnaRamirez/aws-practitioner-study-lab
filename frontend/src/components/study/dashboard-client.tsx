"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type {
  ActiveSessionSummary,
  ProgressOverview,
  PublicUser,
  TopicProgressRow,
} from "@aps/shared";
import { STUDY_MODE_LABELS } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { daysUntilExam } from "@/components/study/exam-countdown";
import { TopicFolders } from "@/components/study/topic-folders";
import { buttonVariants } from "@/components/ui/button";
import {
  clearAuth,
  fetchMe,
  fetchProgressOverview,
  fetchTopicProgress,
  getStoredToken,
} from "@/lib/api";
import { cn } from "@/lib/utils";

function resumeHref(s: ActiveSessionSummary): string {
  if (s.mode === "EXAM_TIMED") return `/estudiar/examen?session=${s.id}`;
  if (s.mode === "WEAK_REVIEW") return "/mas-falladas";
  return `/estudiar?session=${s.id}`;
}

function streakLabel(n: number): string {
  return n === 1 ? "1 día" : `${n} días`;
}

/** Nombre corto para el saludo (Ariadna → Ari). */
function greetingName(user: PublicUser): string {
  const u = user.username.trim().toLowerCase();
  if (user.role === "ADMIN" || u === "ariadna" || u === "ari") return "Ari";
  if (!u) return "tú";
  return u.charAt(0).toUpperCase() + u.slice(1);
}

function examGreetingLine(
  examDate: string | null | undefined,
  timeZone?: string | null,
): { primary: string; secondary?: string } {
  if (!examDate) {
    return {
      primary: "Agrega la fecha de tu examen",
      secondary: "para ver la cuenta regresiva",
    };
  }
  const days = daysUntilExam(
    examDate,
    new Date(),
    timeZone || "America/Mexico_City",
  );
  if (Number.isNaN(days)) {
    return { primary: "Revisa la fecha de tu examen" };
  }
  if (days > 1) {
    return { primary: `faltan ${days} días para tu examen` };
  }
  if (days === 1) {
    return { primary: "mañana es tu examen" };
  }
  if (days === 0) {
    return { primary: "hoy es tu examen" };
  }
  const ago = Math.abs(days);
  return {
    primary: ago === 1 ? "tu examen fue ayer" : `tu examen fue hace ${ago} días`,
  };
}

export function DashboardClient() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [overview, setOverview] = useState<ProgressOverview | null>(null);
  const [topics, setTopics] = useState<TopicProgressRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      return;
    }
    try {
      const me = await fetchMe();
      setUser(me);
    } catch (err) {
      clearAuth();
      setUser(null);
      setError(err instanceof Error ? err.message : "Sesión inválida");
      return;
    }
    try {
      const [ov, byTopic] = await Promise.all([
        fetchProgressOverview(),
        fetchTopicProgress(),
      ]);
      setOverview(ov);
      setTopics(byTopic.topics);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Progreso no disponible: ${err.message}`
          : "Progreso no disponible",
      );
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user) {
    return (
      <div
        className="mx-auto px-4 py-20 text-center text-sm text-[var(--foreground-muted)]"
        aria-busy="true"
      >
        {error ?? "…"}
      </div>
    );
  }

  const pct = overview?.masteryPct ?? 0;
  const dailyStreak = overview?.dailyStreak ?? 0;
  const activeSessions = overview?.activeSessions ?? [];
  const hasActive = activeSessions.length > 0;
  const primarySession = hasActive ? activeSessions[0] : null;
  const otherSessions = hasActive ? activeSessions.slice(1) : [];

  const name = greetingName(user);
  const examLine = examGreetingLine(user.examDate, user.timezone);

  return (
    <div className="mx-auto w-full min-w-0 max-w-xl px-6 py-8 sm:px-6 sm:py-10 lg:max-w-5xl lg:px-8 lg:py-12">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)] lg:items-end lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)]">
        <header className="flex min-w-0 items-center gap-4 sm:gap-5 lg:gap-6">
          <Mascot pose="wave" size="md" className="shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
              Hola {name},
            </h1>
            <p
              className="mt-1 text-base leading-snug text-[var(--foreground-muted)] sm:text-lg"
              aria-live="polite"
            >
              {examLine.primary}
              {examLine.secondary ? (
                <>
                  <br />
                  <span className="text-sm">{examLine.secondary}</span>
                </>
              ) : null}
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--foreground-muted)]">
              <span className="font-mono tabular-nums text-[var(--foreground)]">
                {pct}%
              </span>
              <span aria-label={`Racha diaria: ${streakLabel(dailyStreak)}`}>
                Racha{" "}
                <span className="font-mono tabular-nums text-[var(--foreground)]">
                  {dailyStreak}
                </span>
              </span>
              <Link
                href="/cuenta"
                className="text-[var(--foreground)] underline-offset-4 hover:underline"
              >
                {user.examDate ? "Cambiar fecha" : "Agregar fecha"}
              </Link>
            </p>
          </div>
        </header>

        {/* CTA principal: sesión mixta, debajo del personaje (al lado en desktop) */}
        <div className="mt-6 space-y-3 lg:mt-0">
          {primarySession ? (
            <>
              <Link
                href={resumeHref(primarySession)}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "inline-flex w-full justify-center",
                )}
              >
                Continuar
              </Link>
              <p className="text-center text-xs text-[var(--foreground-muted)] lg:text-left">
                {STUDY_MODE_LABELS[primarySession.mode]}{" "}
                {primarySession.answered}/{primarySession.size}
              </p>
              <Link
                href="/estudiar?start=10"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "inline-flex w-full justify-center",
                )}
              >
                Empezar otra
              </Link>
            </>
          ) : (
            <Link
              href="/estudiar?start=10"
              className={cn(
                buttonVariants({ size: "lg" }),
                "inline-flex w-full justify-center",
              )}
            >
              Empezar
            </Link>
          )}
          {!primarySession ? (
            <p className="text-center text-xs text-[var(--foreground-muted)] lg:text-left">
              10 cartas de todo
            </p>
          ) : null}
        </div>
      </div>

      {otherSessions.length ? (
        <ul className="mt-5 space-y-0 border-t border-[var(--border)]/60 lg:mt-8">
          {otherSessions.map((s) => (
            <li
              key={s.id}
              className="flex min-w-0 items-center justify-between gap-3 border-b border-[var(--border)]/60 py-3"
            >
              <p className="min-w-0 truncate text-sm text-[var(--foreground-muted)]">
                {STUDY_MODE_LABELS[s.mode]} {s.answered}/{s.size}
              </p>
              <Link
                href={resumeHref(s)}
                className="shrink-0 text-sm font-semibold text-[var(--foreground)]"
              >
                Continuar
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Después: personalizar por tema */}
      <section className="mt-8 lg:mt-12" aria-labelledby="temas-heading">
        <h2
          id="temas-heading"
          className="text-sm font-medium text-[var(--foreground-muted)]"
        >
          Elige un tema
        </h2>
        <TopicFolders topics={topics} className="mt-3 lg:mt-4" />
      </section>

      <nav
        className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--border)]/40 pt-5 text-sm text-[var(--foreground-muted)] lg:mt-10"
        aria-label="Atajos"
      >
        <Link href="/podio" className="hover:text-[var(--foreground)]">
          Podio
        </Link>
        <Link href="/mas-falladas" className="hover:text-[var(--foreground)]">
          Más falladas
        </Link>
      </nav>
    </div>
  );
}

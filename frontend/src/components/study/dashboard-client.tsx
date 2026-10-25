"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type {
  ProgressOverview,
  PublicUser,
  TopicProgressRow,
} from "@aps/shared";
import { STUDY_MODE_LABELS } from "@aps/shared";
import { ExamCountdown } from "@/components/study/exam-countdown";
import { TopicCategoryMenu } from "@/components/study/topic-category-menu";
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
      // Solo invalidar sesión si /auth/me falla (token malo / ban).
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
      // Mantener sesión aunque el overview falle (red / 5xx).
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
    // RequireAuth on the page redirects guests — avoid a dead “solo Entrar” view.
    return (
      <div
        className="mx-auto flex max-w-md flex-col items-center gap-2 px-4 py-20 text-sm text-[var(--foreground-muted)]"
        aria-busy="true"
      >
        {error ? <p className="text-red-600">{error}</p> : <p>Cargando tu lab…</p>}
      </div>
    );
  }

  const pct = overview?.masteryPct ?? 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium text-[var(--accent)]">Tu lab</p>
      <h1 className="font-display mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
        Hola, @{user.username}
      </h1>
      <p className="mt-3 max-w-xl text-base text-[var(--foreground-muted)]">
        Elige un modo. El progreso (dominio, rachas, más falladas) se guarda en
        tu cuenta.
      </p>

      <ExamCountdown className="mt-8" examDate={user.examDate} />

      <TopicCategoryMenu topics={topics} />

      <TopicFolders topics={topics} className="mt-12" />

      <section className="mt-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">
              Dominio global
            </p>
            <p className="font-display text-3xl font-semibold">
              {pct}%
              <span className="ml-2 text-base font-normal text-[var(--foreground-muted)]">
                {overview?.masteredItems ?? 0}/
                {overview?.totalTrackableItems ?? 0} ítems
              </span>
            </p>
          </div>
          <div className="text-sm text-[var(--foreground-muted)]">
            Racha diaria{" "}
            <strong className="text-[var(--foreground)]">
              {overview?.dailyStreak ?? 0}
            </strong>
            {" · "}
            récord {overview?.longestDailyStreak ?? 0}
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-[width]"
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/progreso" className={cn(buttonVariants({ variant: "secondary" }))}>
            Ver por tema
          </Link>
          <Link href="/mas-falladas" className={cn(buttonVariants({ variant: "ghost" }))}>
            Más falladas ({overview?.weakItems ?? 0})
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <Link
          href="/estudiar?start=10"
          className={cn(
            buttonVariants({ size: "lg" }),
            "inline-flex w-full justify-center sm:w-auto",
          )}
        >
          Empezar 10 flashcards
        </Link>
        <p className="mt-2 text-xs text-[var(--foreground-muted)]">
          Un clic crea el mazo y te pone la primera carta.
        </p>
      </section>

      {overview?.activeSessions?.length ? (
        <section className="mt-8">
          <h2 className="font-display text-xl font-semibold">
            Sesiones a medias
          </h2>
          <ul className="mt-3 space-y-2">
            {overview.activeSessions.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border)] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {STUDY_MODE_LABELS[s.mode]} · {s.size} ítems
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    Respondidas {s.answered}
                  </p>
                </div>
                <Link
                  href={
                    s.mode === "EXAM_TIMED"
                      ? `/estudiar/examen?session=${s.id}`
                      : s.mode === "WEAK_REVIEW"
                        ? "/mas-falladas"
                        : `/estudiar?session=${s.id}`
                  }
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Continuar
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          {
            href: "/estudiar",
            title: "Flashcards",
            body: "MCQ con miss-repeat y dominio.",
          },
          {
            href: "/estudiar/examen",
            title: "Modo Examen",
            body: "Cronometrado, mock 65/90.",
          },
          {
            href: "/podio",
            title: "Podio",
            body: "Ranking por ítems dominados.",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4 transition-colors hover:border-[var(--accent)]"
          >
            <h3 className="font-display text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              {card.body}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}

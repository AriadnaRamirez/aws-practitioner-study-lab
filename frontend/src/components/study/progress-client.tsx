"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { TopicProgressRow } from "@aps/shared";
import { buttonVariants } from "@/components/ui/button";
import { fetchTopicProgress, getStoredToken } from "@/lib/api";
import { cn } from "@/lib/utils";

export function ProgressClient() {
  const [topics, setTopics] = useState<TopicProgressRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    if (!getStoredToken()) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    try {
      const res = await fetchTopicProgress();
      setTopics(res.topics);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
      setTopics([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (authed === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Progreso</h1>
        <p className="mt-3 text-[var(--foreground-muted)]">
          Inicia sesión para ver el % de dominio por tema.
        </p>
        <Link href="/login" className={cn(buttonVariants(), "mt-8 inline-flex")}>
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Progreso por tema
      </h1>
      <p className="mt-2 text-sm text-[var(--foreground-muted)]">
        Ítems dominados (3 aciertos seguidos) sobre el banco publicado.
      </p>
      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {topics == null ? (
        <p className="mt-8 text-sm text-[var(--foreground-muted)]">Cargando…</p>
      ) : topics.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--foreground-muted)]">
          Todavía no hay temas con contenido publicado.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {topics.map((t) => (
            <li key={t.topicId}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium">{t.topicName}</span>
                <span className="font-mono tabular-nums text-[var(--foreground-muted)]">
                  {t.mastered}/{t.total} · {t.masteryPct}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                <div
                  className="h-full rounded-full bg-[var(--accent)]"
                  style={{ width: `${Math.min(100, t.masteryPct)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "ghost" }), "mt-10")}
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}

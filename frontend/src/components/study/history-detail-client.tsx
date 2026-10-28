"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { StudyHistoryDetail } from "@aps/shared";
import { buttonVariants } from "@/components/ui/button";
import { fetchSessionHistoryDetail, getStoredToken } from "@/lib/api";
import {
  formatDuration,
  formatScore,
  formatSessionWhen,
  modeLabel,
} from "@/lib/format-study";
import { cn } from "@/lib/utils";

export function HistoryDetailClient({ sessionId }: { sessionId: string }) {
  const [detail, setDetail] = useState<StudyHistoryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    if (!getStoredToken()) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    try {
      const res = await fetchSessionHistoryDetail(sessionId);
      setDetail(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar");
    }
  }, [sessionId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (authed === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Sesión</h1>
        <p className="mt-3 text-[var(--foreground-muted)]">
          Entra para ver el detalle.
        </p>
        <Link href="/login" className={cn(buttonVariants(), "mt-8 inline-flex")}>
          Entrar
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
        <Link href="/cuenta#historial" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Volver al historial
        </Link>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="text-sm text-[var(--foreground-muted)]">Cargando…</p>
      </div>
    );
  }

  const attempts = detail.attempts ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/cuenta#historial"
        className="text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
      >
        ← Historial
      </Link>
      <h1 className="font-display mt-4 text-3xl font-bold tracking-tight">
        {modeLabel(detail.mode)}
      </h1>
      <p className="mt-2 text-sm text-[var(--foreground-muted)]">
        {formatSessionWhen(detail, detail.timezone)} · {detail.size} conceptos ·
        puntaje {formatScore(detail)} · {formatDuration(detail.durationMs)}
      </p>

      {attempts.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--foreground-muted)]">
          Esta sesión no tiene intentos registrados (la dejaste a medias o
          sigue en curso).
        </p>
      ) : (
        <ol className="mt-10 space-y-4">
          {attempts.map((a, i) => (
            <li
              key={a.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-4"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold">
                  {i + 1}. {a.title}
                </p>
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wide",
                    a.correct
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {a.correct ? "Correcto" : "Incorrecto"}
                </span>
              </div>
              {a.prompt ? (
                <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]">
                  {a.prompt}
                </p>
              ) : null}
              <ul className="mt-3 space-y-1 text-sm text-[var(--foreground-muted)]">
                {a.selectedLabel ? (
                  <li>
                    Tu respuesta:{" "}
                    <strong className="text-[var(--foreground)]">
                      {a.selectedLabel}
                    </strong>
                  </li>
                ) : null}
                {a.correctLabel ? (
                  <li>
                    Correcta:{" "}
                    <strong className="text-[var(--foreground)]">
                      {a.correctLabel}
                    </strong>
                  </li>
                ) : null}
                {a.explanation ? <li className="pt-1">{a.explanation}</li> : null}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

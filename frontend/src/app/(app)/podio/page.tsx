"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { PodiumResponse, PodiumWindow } from "@aps/shared";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearAuth, fetchPodium, getStoredToken } from "@/lib/api";

const WINDOWS: { id: PodiumWindow; label: string; hint: string }[] = [
  {
    id: "all",
    label: "Histórico",
    hint: "Todos los ítems que has dominado",
  },
  {
    id: "week",
    label: "Esta semana",
    hint: "Dominios en los últimos 7 días (rodante)",
  },
];

export default function PodioPage() {
  const [window, setWindow] = useState<PodiumWindow>("all");
  const [data, setData] = useState<PodiumResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  const load = useCallback(async (w: PodiumWindow) => {
    setLoading(true);
    setError(null);
    try {
      const token = getStoredToken();
      if (!token) {
        setAuthed(false);
        setData(null);
        return;
      }
      setAuthed(true);
      const podium = await fetchPodium(w);
      setData(podium);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo cargar el podio";
      if (/401|403|Sesión|token|autoriz/i.test(message)) {
        clearAuth();
        setAuthed(false);
        setData(null);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(window);
  }, [window, load]);

  const activeHint =
    WINDOWS.find((w) => w.id === window)?.hint ?? WINDOWS[0].hint;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <header className="animate-[fade-up_0.5s_ease-out]">
        <p className="text-sm font-medium text-[var(--accent)]">
          Competencia sana
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Podio
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--foreground-muted)]">
          Ranking por{" "}
          <strong className="font-semibold text-[var(--foreground)]">
            respuestas memorizadas
          </strong>{" "}
          — ítems que alcanzaron dominio. Se muestra el username; el correo
          nunca es público.
        </p>
      </header>

      {!authed && !loading ? (
        <div
          className="mt-10 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-6 animate-[fade-up_0.55s_ease-out]"
          style={{ animationDelay: "60ms", animationFillMode: "backwards" }}
        >
          <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
            El podio es solo para cuentas registradas. Los invitados no
            participan ni ven el ranking. Crea una cuenta para guardar progreso
            y subir al podio.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/register" className={cn(buttonVariants())}>
              Crear cuenta
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Entrar
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div
            className="mt-8 flex flex-wrap gap-2 animate-[fade-up_0.5s_ease-out]"
            style={{ animationDelay: "40ms", animationFillMode: "backwards" }}
            role="tablist"
            aria-label="Ventana del podio"
          >
            {WINDOWS.map((w) => {
              const active = window === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setWindow(w.id)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
                  )}
                >
                  {w.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            {activeHint}
          </p>

          {data?.me ? (
            <section
              className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 animate-[fade-up_0.55s_ease-out]"
              style={{ animationDelay: "80ms", animationFillMode: "backwards" }}
              aria-label="Tu posición"
            >
              <p className="text-sm text-[var(--foreground-muted)]">
                Tu posición
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-[var(--foreground)]">
                @{data.me.username}
                <span className="ml-2 font-sans text-base font-medium text-[var(--foreground-muted)]">
                  {data.me.podiumHidden
                    ? "· oculta del ranking"
                    : data.me.rank != null
                      ? `· #${data.me.rank}`
                      : "· sin puntuación aún"}
                  {" · "}
                  {data.me.score}{" "}
                  {data.me.score === 1 ? "dominado" : "dominados"}
                </span>
              </p>
            </section>
          ) : null}

          {loading ? (
            <p className="mt-10 text-sm text-[var(--foreground-muted)]">
              Cargando podio…
            </p>
          ) : error ? (
            <p
              className="mt-10 text-sm text-red-700 dark:text-red-300"
              role="alert"
            >
              {error}
            </p>
          ) : data && data.entries.length === 0 ? (
            <p className="mt-10 text-sm text-[var(--foreground-muted)]">
              Todavía no hay ítems dominados en esta ventana. Estudia con
              flashcards o el banco para subir.
            </p>
          ) : data ? (
            <ol className="mt-8 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {data.entries.map((entry, i) => {
                const isMe = entry.userId === data.me.userId;
                return (
                  <li
                    key={entry.userId}
                    className={cn(
                      "flex items-baseline justify-between gap-4 py-3 animate-[fade-up_0.45s_ease-out]",
                      isMe &&
                        "bg-[var(--accent-soft)]/40 -mx-2 rounded-md px-2",
                    )}
                    style={{
                      animationDelay: `${100 + i * 40}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <div className="flex min-w-0 items-baseline gap-3">
                      <span className="w-8 shrink-0 font-mono text-sm tabular-nums text-[var(--foreground-muted)]">
                        #{entry.rank}
                      </span>
                      <span className="truncate font-medium text-[var(--foreground)]">
                        @{entry.username}
                        {isMe ? (
                          <span className="ml-2 text-xs font-normal text-[var(--accent)]">
                            tú
                          </span>
                        ) : null}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-sm tabular-nums text-[var(--foreground)]">
                      {entry.score}
                    </span>
                  </li>
                );
              })}
            </ol>
          ) : null}

          <p className="mt-8 text-xs leading-relaxed text-[var(--foreground-muted)]">
            Métrica: conteo de ítems con dominio alcanzado. Admin incluido.
            Cuentas con{" "}
            <code className="font-mono">podiumHidden</code> no aparecen en el
            ranking público.
          </p>
        </>
      )}
    </div>
  );
}

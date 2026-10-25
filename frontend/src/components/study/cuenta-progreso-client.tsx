"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { PublicUser, StudyHistoryEntry } from "@aps/shared";
import { SessionHistory } from "@/components/study/session-history";
import { buttonVariants } from "@/components/ui/button";
import {
  fetchMe,
  fetchStudySessions,
  getStoredToken,
  getStoredUser,
} from "@/lib/api";
import { cn } from "@/lib/utils";

export function CuentaProgresoClient() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [sessions, setSessions] = useState<StudyHistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    setError(null);
    if (!getStoredToken()) {
      setAuthed(false);
      setUser(null);
      setSessions([]);
      return;
    }
    setAuthed(true);
    setUser(getStoredUser());
    try {
      const me = await fetchMe();
      setUser(me);
      const hist = await fetchStudySessions(50);
      setSessions(hist.sessions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cargar la cuenta",
      );
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (authed === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Cuenta
        </h1>
        <p className="mt-3 text-base text-[var(--foreground-muted)]">
          Entrá para ver tu perfil, timezone e historial de sesiones.
        </p>
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "lg" }), "mt-8 inline-flex")}
        >
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        Cuenta
      </h1>
      <p className="mt-3 text-base text-[var(--foreground-muted)]">
        Perfil y progreso: timezone, historial de sesiones y acceso a más
        falladas.
      </p>

      {error ? (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {user ? (
        <dl className="mt-8 grid gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[var(--foreground-muted)]">Usuario</dt>
            <dd className="font-semibold">@{user.username}</dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Timezone</dt>
            <dd className="font-medium">{user.timezone}</dd>
          </div>
          <div>
            <dt className="text-[var(--foreground-muted)]">Rol</dt>
            <dd className="font-medium">{user.role}</dd>
          </div>
        </dl>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/mas-falladas" className={cn(buttonVariants())}>
          Más falladas
        </Link>
        <Link
          href="/estudiar"
          className={cn(buttonVariants({ variant: "secondary" }))}
        >
          Ir a estudiar
        </Link>
      </div>

      <section id="historial" className="mt-12 scroll-mt-20">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Historial de sesiones
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Flash, examen y refuerzo de más falladas.
        </p>
        <div className="mt-4">
          {sessions == null ? (
            <p className="text-sm text-[var(--foreground-muted)]">Cargando…</p>
          ) : (
            <SessionHistory
              sessions={sessions}
              timezone={user?.timezone}
            />
          )}
        </div>
      </section>
    </div>
  );
}

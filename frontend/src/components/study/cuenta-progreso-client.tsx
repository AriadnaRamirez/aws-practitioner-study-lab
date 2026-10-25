"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import type { PublicUser, StudyHistoryEntry } from "@aps/shared";
import { OpenTourButton } from "@/components/onboarding/open-tour-button";
import { SessionHistory } from "@/components/study/session-history";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  changePassword,
  fetchMe,
  fetchStudySessions,
  getStoredToken,
  getStoredUser,
  setStoredUser,
  updateProfile,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const TIMEZONES = [
  "America/Mexico_City",
  "America/Bogota",
  "America/Lima",
  "America/Santiago",
  "America/Argentina/Buenos_Aires",
  "America/New_York",
  "UTC",
];

export function CuentaProgresoClient() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [sessions, setSessions] = useState<StudyHistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const [timezone, setTimezone] = useState("America/Mexico_City");
  const [podiumHidden, setPodiumHidden] = useState(false);
  const [examDate, setExamDate] = useState("");
  const [profilePending, setProfilePending] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passPending, setPassPending] = useState(false);

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
      setTimezone(me.timezone);
      setPodiumHidden(me.podiumHidden);
      setExamDate(me.examDate ?? "");
      setStoredUser(me);
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

  async function onSaveProfile(e: FormEvent) {
    e.preventDefault();
    setNotice(null);
    setError(null);
    setProfilePending(true);
    try {
      const me = await updateProfile({
        timezone,
        podiumHidden,
        examDate: examDate.trim() ? examDate.trim() : null,
      });
      setUser(me);
      setExamDate(me.examDate ?? "");
      setStoredUser(me);
      setNotice("Perfil actualizado.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setProfilePending(false);
    }
  }

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    setNotice(null);
    setError(null);
    setPassPending(true);
    try {
      const res = await changePassword({
        currentPassword,
        password,
        confirmPassword,
      });
      setNotice(res.message);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cambiar la contraseña",
      );
    } finally {
      setPassPending(false);
    }
  }

  if (authed === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Cuenta
        </h1>
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
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        Cuenta
      </h1>

      {error ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mt-4 text-sm text-emerald-700 dark:text-emerald-400" role="status">
          {notice}
        </p>
      ) : null}

      <nav
        className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm"
        aria-label="Tu estudio"
      >
        <Link href="/progreso" className="hover:text-[var(--accent)]">
          Progreso
        </Link>
        <Link href="#historial" className="hover:text-[var(--accent)]">
          Historial
        </Link>
        <Link href="/mas-falladas" className="hover:text-[var(--accent)]">
          Más falladas
        </Link>
        <OpenTourButton label="Guía" className="justify-start" />
      </nav>

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
            <dt className="text-[var(--foreground-muted)]">Rol</dt>
            <dd className="font-medium">{user.role}</dd>
          </div>
        </dl>
      ) : null}

      <form
        onSubmit={onSaveProfile}
        className="mt-8 space-y-4 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
      >
        <h2 className="font-display text-base font-semibold">Preferencias</h2>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Fecha del examen
          <Input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Zona horaria
          <select
            className="h-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={podiumHidden}
            onChange={(e) => setPodiumHidden(e.target.checked)}
          />
          Ocultar del podio
        </label>
        <button
          type="submit"
          disabled={profilePending}
          className={cn(buttonVariants())}
        >
          {profilePending ? "…" : "Guardar"}
        </button>
      </form>

      <form
        onSubmit={onChangePassword}
        className="mt-6 space-y-4 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4"
      >
        <h2 className="font-display text-lg font-semibold">Seguridad</h2>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Contraseña actual
          <Input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Nueva contraseña
          <Input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Confirmar
          <Input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        <button
          type="submit"
          disabled={passPending}
          className={cn(buttonVariants({ variant: "secondary" }))}
        >
          {passPending ? "Actualizando…" : "Cambiar contraseña"}
        </button>
      </form>

      <div className="mt-6">
        <Link
          href="/logout"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Cerrar sesión
        </Link>
      </div>

      <section id="historial" className="mt-10 scroll-mt-20">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Historial
        </h2>
        <div className="mt-3">
          {sessions == null ? (
            <p className="text-sm text-[var(--foreground-muted)]">…</p>
          ) : (
            <SessionHistory
              sessions={sessions}
              timezone={user?.timezone}
              linkDetail
            />
          )}
        </div>
      </section>
    </div>
  );
}

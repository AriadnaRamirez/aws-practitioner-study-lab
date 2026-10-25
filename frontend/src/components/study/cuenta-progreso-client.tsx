"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import type { PublicUser, StudyHistoryEntry } from "@aps/shared";
import { OpenTourButton } from "@/components/onboarding/open-tour-button";
import { SessionHistory } from "@/components/study/session-history";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  changePassword,
  clearAuth,
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
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [sessions, setSessions] = useState<StudyHistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const [timezone, setTimezone] = useState("America/Mexico_City");
  const [podiumHidden, setPodiumHidden] = useState(false);
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
      const me = await updateProfile({ timezone, podiumHidden });
      setUser(me);
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

  function logout() {
    clearAuth();
    router.push("/");
    router.refresh();
  }

  if (authed === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Cuenta
        </h1>
        <p className="mt-3 text-base text-[var(--foreground-muted)]">
          Entrá para ver perfil, seguridad, progreso e historial.
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
        Hub de perfil, seguridad, instructivo e historial — al estilo CCST, con
        reset de password y timezone.
      </p>

      {error ? (
        <p className="mt-6 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mt-6 text-sm text-emerald-700 dark:text-emerald-400" role="status">
          {notice}
        </p>
      ) : null}

      <nav
        className="mt-8 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]"
        aria-label="Tu estudio"
      >
        {[
          ["/progreso", "Progreso", "Dominio por tema"],
          ["#historial", "Historial", "Sesiones anteriores"],
          ["/mas-falladas", "Más falladas", "Cola de refuerzo"],
          ["/dashboard", "Inicio", "Continuar sesiones"],
        ].map(([href, label, hint]) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 text-sm last:border-b-0 hover:bg-[var(--surface-hover)]"
          >
            <span className="font-medium">{label}</span>
            <span className="text-[var(--foreground-muted)]">{hint}</span>
          </Link>
        ))}
        <div className="flex items-center justify-between px-2 py-1">
          <OpenTourButton label="Instructivo" className="justify-start" />
          <span className="pr-3 text-sm text-[var(--foreground-muted)]">
            Cómo funciona
          </span>
        </div>
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
        <h2 className="font-display text-lg font-semibold">Preferencias</h2>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Timezone (racha diaria)
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
          Ocultarme del podio público
        </label>
        <button
          type="submit"
          disabled={profilePending}
          className={cn(buttonVariants())}
        >
          {profilePending ? "Guardando…" : "Guardar preferencias"}
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
        <button
          type="button"
          onClick={logout}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Cerrar sesión
        </button>
      </div>

      <section id="historial" className="mt-12 scroll-mt-20">
        <h2 className="font-display text-xl font-semibold tracking-tight">
          Historial de sesiones
        </h2>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Flash, examen y refuerzo. Toca una fila para ver intentos.
        </p>
        <div className="mt-4">
          {sessions == null ? (
            <p className="text-sm text-[var(--foreground-muted)]">Cargando…</p>
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

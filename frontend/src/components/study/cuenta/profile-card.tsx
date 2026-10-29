"use client";

import { Check, Pencil, UserRound, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { PublicUser } from "@aps/shared";
import { USERNAME_MAX, USERNAME_MIN, USERNAME_PATTERN } from "@aps/shared";
import { FOCUS_RING } from "@/components/study/exam-date-dialog";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  CARD,
  CARD_ICON,
  CARD_TITLE,
  PILL_BUTTON,
  errorMessage,
} from "./cuenta-ui";

function usernameProblem(value: string): string | null {
  const v = value.trim();
  if (v.length < USERNAME_MIN) return `Mínimo ${USERNAME_MIN} caracteres.`;
  if (v.length > USERNAME_MAX) return `Máximo ${USERNAME_MAX} caracteres.`;
  if (!USERNAME_PATTERN.test(v)) return "Solo letras, números y _.";
  return null;
}

function memberSince(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    month: "long",
    year: "numeric",
  });
}

export function ProfileCard({
  user,
  onUserChange,
}: {
  user: PublicUser;
  onUserChange: (user: PublicUser) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user.username);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedName, setSavedName] = useState(false);
  const [podiumSaving, setPodiumSaving] = useState(false);
  const [podiumError, setPodiumError] = useState<string | null>(null);

  const problem = usernameProblem(draft);
  const unchanged = draft.trim() === user.username;

  function startEditing() {
    setDraft(user.username);
    setError(null);
    setSavedName(false);
    setEditing(true);
  }

  async function onSaveUsername(e: FormEvent) {
    e.preventDefault();
    if (problem || unchanged) return;
    setSaving(true);
    setError(null);
    try {
      onUserChange(await updateProfile({ username: draft.trim() }));
      setEditing(false);
      setSavedName(true);
    } catch (err) {
      setError(errorMessage(err, "No se pudo cambiar el usuario"));
    } finally {
      setSaving(false);
    }
  }

  async function togglePodium() {
    setPodiumSaving(true);
    setPodiumError(null);
    try {
      onUserChange(await updateProfile({ podiumHidden: !user.podiumHidden }));
    } catch (err) {
      setPodiumError(errorMessage(err, "No se pudo guardar"));
    } finally {
      setPodiumSaving(false);
    }
  }

  const visible = !user.podiumHidden;

  return (
    <section aria-labelledby="perfil-titulo" className={CARD}>
      <h2 id="perfil-titulo" className={CARD_TITLE}>
        <UserRound className={CARD_ICON} aria-hidden />
        Tu perfil
      </h2>

      <div className="mt-5 flex items-center gap-4">
        <span
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] font-display text-2xl font-bold uppercase text-[var(--accent)]"
        >
          {user.username.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          {editing ? (
            <form onSubmit={onSaveUsername} className="space-y-2">
              <label htmlFor="nuevo-usuario" className="text-xs font-medium text-[var(--foreground-muted)]">
                Nuevo usuario
              </label>
              <div className="flex items-center gap-2">
                <Input
                  id="nuevo-usuario"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  maxLength={USERNAME_MAX}
                  aria-invalid={Boolean(problem) || undefined}
                  aria-describedby="nuevo-usuario-ayuda"
                  className="h-10 min-w-0"
                />
                <button
                  type="submit"
                  disabled={Boolean(problem) || unchanged || saving}
                  aria-label="Guardar usuario"
                  className={cn(PILL_BUTTON, "size-10 shrink-0 justify-center bg-[var(--accent)] px-0 text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] hover:brightness-110")}
                >
                  <Check className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  aria-label="Cancelar"
                  className={cn(PILL_BUTTON, "size-10 shrink-0 justify-center px-0")}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <p
                id="nuevo-usuario-ayuda"
                className={cn(
                  "text-xs",
                  error || (problem && draft.trim())
                    ? "text-red-300"
                    : "text-[var(--foreground-muted)]",
                )}
                role={error ? "alert" : undefined}
              >
                {saving
                  ? "Guardando…"
                  : error ??
                    (draft.trim() && problem) ??
                    `De ${USERNAME_MIN} a ${USERNAME_MAX} caracteres: letras, números y _. Así te verán en el podio.`}
              </p>
            </form>
          ) : (
            <>
              <p className="text-xs text-[var(--foreground-muted)]">Usuario</p>
              <p className="truncate text-xl font-extrabold tracking-tight text-[var(--foreground)]">
                @{user.username}
              </p>
              {savedName ? (
                <p className="mt-1 text-xs text-emerald-300" role="status">
                  Listo. Ahora entras con @{user.username} o tu correo.
                </p>
              ) : null}
            </>
          )}
        </div>
        {!editing ? (
          <button type="button" onClick={startEditing} className={cn(PILL_BUTTON, "shrink-0")}>
            <Pencil className="size-3.5" aria-hidden />
            <span className="hidden min-[400px]:inline">Cambiar usuario</span>
            <span className="min-[400px]:hidden">Cambiar</span>
          </button>
        ) : null}
      </div>

      <dl className="mt-6 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-xs text-[var(--foreground-muted)]">Correo</dt>
          <dd className="mt-0.5 font-medium [overflow-wrap:anywhere]">{user.email}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-[var(--foreground-muted)]">Zona horaria</dt>
          <dd className="mt-0.5 font-medium [overflow-wrap:anywhere]">
            {user.timezone.replace(/_/g, " ")}
            <span className="block text-xs font-normal text-[var(--foreground-muted)]">
              Se detecta de tu dispositivo
            </span>
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs text-[var(--foreground-muted)]">Estudias aquí desde</dt>
          <dd className="mt-0.5 font-medium">{memberSince(user.createdAt)}</dd>
        </div>
        {user.role === "ADMIN" ? (
          <div className="min-w-0">
            <dt className="text-xs text-[var(--foreground-muted)]">Rol</dt>
            <dd className="mt-0.5 font-medium">Administración</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-[var(--surface-elevated)] p-4">
        <div className="min-w-0">
          <p id="podio-visible" className="text-sm font-semibold text-[var(--foreground)]">
            Aparecer en el podio
          </p>
          <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
            {visible
              ? "Otros estudiantes ven tu usuario y cuántos conceptos dominas."
              : "Estás oculto: nadie ve tu usuario en el podio."}
          </p>
          {podiumError ? (
            <p className="mt-1 text-xs text-red-300" role="alert">
              {podiumError}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={visible}
          aria-labelledby="podio-visible"
          disabled={podiumSaving}
          onClick={() => void togglePodium()}
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60",
            FOCUS_RING,
            visible ? "bg-[var(--accent)]" : "bg-[var(--surface-hover)]",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute top-1 size-5 rounded-full bg-white shadow transition-[left] duration-200 motion-reduce:transition-none",
              visible ? "left-6" : "left-1",
            )}
          />
        </button>
      </div>
    </section>
  );
}

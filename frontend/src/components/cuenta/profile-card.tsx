"use client";

import { Check, Pencil, UserRound, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { PublicUser } from "@aps/shared";
import { USERNAME_MAX, USERNAME_MIN, USERNAME_PATTERN } from "@aps/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { updateProfile } from "@/lib/api";
import { cn } from "@/lib/utils";
import { errorMessage } from "./cuenta-ui";

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
    <Card as="section" aria-labelledby="perfil-titulo">
      <CardLabel as="h2" id="perfil-titulo" icon={<UserRound aria-hidden />}>
        Tu perfil
      </CardLabel>

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
                <Button
                  type="submit"
                  size="icon"
                  disabled={Boolean(problem) || unchanged || saving}
                  aria-label="Guardar usuario"
                  className="size-10 shrink-0"
                >
                  <Check className="size-4" aria-hidden />
                </Button>
                <IconButton
                  size="md"
                  onClick={() => setEditing(false)}
                  aria-label="Cancelar"
                  className="bg-[var(--surface-elevated)]"
                >
                  <X aria-hidden />
                </IconButton>
              </div>
              <p
                id="nuevo-usuario-ayuda"
                className={cn(
                  "text-xs",
                  error || (problem && draft.trim())
                    ? "text-[var(--danger-text)]"
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
                <Notice tone="success" className="mt-1 text-xs">
                  Listo. Ahora entras con @{user.username} o tu correo.
                </Notice>
              ) : null}
            </>
          )}
        </div>
        {!editing ? (
          <Button
            type="button"
            variant="soft"
            size="sm"
            onClick={startEditing}
            className="shrink-0"
          >
            <Pencil className="size-3.5" aria-hidden />
            <span className="hidden min-[400px]:inline">Cambiar usuario</span>
            <span className="min-[400px]:hidden">Cambiar</span>
          </Button>
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
            <dd className="mt-1">
              <Badge tone="accent">Administración</Badge>
            </dd>
          </div>
        ) : null}
      </dl>

      <Card
        variant="flat"
        padding="sm"
        className="mt-6 flex items-center justify-between gap-4"
      >
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
            <Notice tone="danger" className="mt-1 text-xs">
              {podiumError}
            </Notice>
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
              "absolute top-1 size-5 rounded-full bg-[var(--foreground)] shadow-[var(--shadow-float)] transition-[left] duration-200 motion-reduce:transition-none",
              visible ? "left-6" : "left-1",
            )}
          />
        </button>
      </Card>
    </Card>
  );
}

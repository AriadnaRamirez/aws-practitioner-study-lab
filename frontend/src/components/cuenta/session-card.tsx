"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { PublicUser } from "@aps/shared";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { clearAuth, deleteAccount } from "@/lib/api";
import { FIELD_LABEL, errorMessage } from "./cuenta-ui";

export function SessionCard({ user }: { user: PublicUser }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user.role === "ADMIN";

  async function onDelete(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await deleteAccount({ password });
      clearAuth();
      router.replace("/?deleted=1");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err, "No se pudo eliminar la cuenta"));
      setPending(false);
    }
  }

  return (
    <Card as="section" aria-labelledby="sesion-titulo">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <CardLabel as="h2" id="sesion-titulo" icon={<LogOut aria-hidden />}>
            Sesión
          </CardLabel>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Tu progreso queda guardado para la próxima vez.
          </p>
        </div>
        <Link
          href="/logout"
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          <LogOut className="size-4" aria-hidden />
          Cerrar sesión
        </Link>
      </div>

      {isAdmin ? null : (
        <div className="mt-6 rounded-xl bg-[var(--danger-soft)] p-4">
          <p className="text-sm font-semibold text-[var(--danger-text)]">
            Eliminar cuenta
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--foreground-muted)]">
            Se borran para siempre tu progreso, historial, racha, fecha de examen y tu
            lugar en el podio. No se puede deshacer.
          </p>

          {confirming ? (
            <form onSubmit={onDelete} className="mt-4 space-y-3">
              <label className={FIELD_LABEL}>
                Escribe tu contraseña para confirmar
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </label>
              {error ? (
                <Notice tone="danger" className="text-xs">
                  {error}
                </Notice>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                  disabled={!password}
                  pending={pending}
                >
                  {pending ? null : <Trash2 className="size-4" aria-hidden />}
                  {pending ? "Eliminando…" : "Eliminar para siempre"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setConfirming(false);
                    setPassword("");
                    setError(null);
                  }}
                  disabled={pending}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setConfirming(true)}
              className="mt-3 text-[var(--danger-text)]"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Eliminar mi cuenta
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

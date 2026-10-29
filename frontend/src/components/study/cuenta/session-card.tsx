"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { PublicUser } from "@aps/shared";
import { Input } from "@/components/ui/input";
import { clearAuth, deleteAccount } from "@/lib/api";
import { cn } from "@/lib/utils";
import { FOCUS_RING } from "@/components/study/exam-date-dialog";
import { CARD, CARD_TITLE, FIELD_LABEL, PILL_BUTTON, errorMessage } from "./cuenta-ui";

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
    <section aria-labelledby="sesion-titulo" className={CARD}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 id="sesion-titulo" className={CARD_TITLE}>
            <LogOut className="size-5 shrink-0 text-[var(--accent)]" aria-hidden />
            Sesión
          </h2>
          <p className="mt-1 text-xs text-[var(--foreground-muted)]">
            Tu progreso queda guardado para la próxima vez.
          </p>
        </div>
        <Link href="/logout" className={cn(PILL_BUTTON, "h-10 px-4 text-sm text-[var(--foreground)]")}>
          <LogOut className="size-4" aria-hidden />
          Cerrar sesión
        </Link>
      </div>

      {isAdmin ? null : (
        <div className="mt-6 rounded-2xl bg-red-500/[0.07] p-4">
          <p className="text-sm font-semibold text-red-200">Eliminar cuenta</p>
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
                <p className="text-xs text-red-300" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={pending || !password}
                  className={cn(
                    "inline-flex h-10 items-center gap-1.5 rounded-full bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:opacity-50",
                    FOCUS_RING,
                  )}
                >
                  <Trash2 className="size-4" aria-hidden />
                  {pending ? "Eliminando…" : "Eliminar para siempre"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false);
                    setPassword("");
                    setError(null);
                  }}
                  disabled={pending}
                  className={cn(PILL_BUTTON, "h-10 px-4 text-sm")}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className={cn(
                "mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-red-500/15 px-3.5 text-xs font-semibold text-red-200 transition-colors hover:bg-red-500/25",
                FOCUS_RING,
              )}
            >
              <Trash2 className="size-3.5" aria-hidden />
              Eliminar mi cuenta
            </button>
          )}
        </div>
      )}
    </section>
  );
}

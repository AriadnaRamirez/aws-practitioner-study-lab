"use client";

import Link from "next/link";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mascot } from "@/components/brand/mascot";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { login, storeAuth } from "@/lib/api";

const DEMO_ACCOUNTS = [
  { label: "Demo", identifier: "demo", password: "StudyPass1!" },
  { label: "Admin", identifier: "admin", password: "ChangeMeAdmin1!" },
] as const;

function safeNextPath(raw: string | null, role: string): string {
  if (role === "ADMIN") return "/admin";
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/login")) {
    return "/dashboard";
  }
  return raw;
}

/**
 * Disposición del boceto mobile (header + mascot, form compacto, ojo).
 * Paleta: tokens de producción — sin tip light.
 */
function LoginForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const hint = useMemo(() => {
    if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
      return `Luego vuelves a ${nextParam}.`;
    }
    return null;
  }, [nextParam]);

  async function doLogin(idValue: string, passwordValue: string) {
    setError(null);
    setPending(true);
    try {
      const res = await login({
        identifier: idValue.trim(),
        password: passwordValue,
      });
      storeAuth(res);
      const next = safeNextPath(nextParam, res.user.role);
      window.location.assign(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo entrar");
      setPending(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await doLogin(identifier, password);
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[var(--background)] text-[var(--foreground)]">
      <main className="mx-auto flex w-full max-w-[22rem] flex-1 flex-col px-7 py-10 sm:max-w-sm sm:px-8 sm:py-14">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 pt-1">
            <Link
              href="/"
              className="font-display text-sm font-semibold tracking-tight text-[var(--foreground)]"
            >
              Study Lab
            </Link>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight">
              Entrar
            </h1>
            {hint ? (
              <p className="mt-2 text-xs text-[var(--foreground-muted)]">{hint}</p>
            ) : null}
          </div>
          <div className="relative flex size-[5.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--surface)] sm:size-28">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(232,80,2,0.2),transparent_70%)]"
            />
            <Mascot
              pose="wave"
              size="sm"
              priority
              className="relative !h-16 !w-20 sm:!h-20 sm:!w-24"
            />
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
            Correo o usuario
            <Input
              name="identifier"
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
            Contraseña
            <span className="relative block">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M3 3l18 18M10.5 10.6a2.5 2.5 0 003 3M9.9 5.1A9.8 9.8 0 0112 5c5 0 9.3 3.1 11 7.5a11.6 11.6 0 01-4.1 4.9M6.1 6.1A11.5 11.5 0 001 12.5C2.7 16.9 7 20 12 20c1.7 0 3.3-.3 4.8-1"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M1 12.5C2.7 8.1 7 5 12 5s9.3 3.1 11 7.5C21.3 16.9 17 20 12 20S2.7 16.9 1 12.5z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12.5" r="3" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                )}
              </button>
            </span>
          </label>

          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className={cn(buttonVariants({ size: "lg" }), "mt-1 w-full")}
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-right text-sm">
          <Link
            href="/forgot-password"
            className="text-[var(--foreground-muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
          >
            Olvidé mi contraseña
          </Link>
        </p>

        <p className="mt-auto pt-12 text-center text-sm text-[var(--foreground-muted)]">
          <Link
            href="/register"
            className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
          >
            Crear cuenta
          </Link>
          <span className="mx-2 opacity-40" aria-hidden>
            ·
          </span>
          <Link
            href="/guest"
            className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
          >
            Probar sin cuenta
          </Link>
        </p>

        <ul className="mt-6 flex gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <li key={acc.identifier} className="flex-1">
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setIdentifier(acc.identifier);
                  setPassword(acc.password);
                  void doLogin(acc.identifier, acc.password);
                }}
                className="w-full rounded-lg px-2 py-1.5 text-center text-[11px] text-[var(--foreground-muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] disabled:opacity-50"
              >
                {acc.label}
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-dvh max-w-[22rem] items-center justify-center bg-[var(--background)] px-7">
          <p className="text-sm text-[var(--foreground-muted)]">Cargando…</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

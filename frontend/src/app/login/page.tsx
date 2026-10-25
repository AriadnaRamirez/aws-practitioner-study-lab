"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { login, storeAuth } from "@/lib/api";

const DEMO_ACCOUNTS = [
  { label: "Estudiante", identifier: "demo", password: "StudyPass1!" },
  {
    label: "Admin",
    identifier: "admin",
    password: "ChangeMeAdmin1!",
  },
] as const;

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function doLogin(idValue: string, passwordValue: string) {
    setError(null);
    setPending(true);
    try {
      const res = await login({
        identifier: idValue.trim(),
        password: passwordValue,
      });
      storeAuth(res);
      const next = res.user.role === "ADMIN" ? "/admin" : "/dashboard";
      // Hard navigation: avoids client-router races that look like “no entró”.
      window.location.assign(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
      setPending(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await doLogin(identifier, password);
  }

  async function enterAs(identifierValue: string, passwordValue: string) {
    setIdentifier(identifierValue);
    setPassword(passwordValue);
    await doLogin(identifierValue, passwordValue);
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <Link
        href="/"
        className="font-display text-sm font-semibold text-[var(--foreground)]"
      >
        AWS Practitioner Study Lab
      </Link>
      <h1 className="font-display mt-8 text-3xl font-bold tracking-tight">
        Entrar
      </h1>
      <p className="mt-2 text-sm text-[var(--foreground-muted)]">
        Usa tu{" "}
        <strong className="font-medium text-[var(--foreground)]">
          email o username
        </strong>{" "}
        en el mismo campo, junto con la contraseña.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Correo o username
          <Input
            name="identifier"
            type="text"
            required
            autoComplete="username"
            placeholder="demo · admin · tu@email.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Contraseña
          <Input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <aside className="mt-8 rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
          Entrar en un clic (local)
        </p>
        <ul className="mt-3 space-y-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <li key={acc.identifier}>
              <button
                type="button"
                disabled={pending}
                onClick={() => void enterAs(acc.identifier, acc.password)}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-left text-sm transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-hover)] disabled:opacity-60"
              >
                <span className="font-medium">Entrar como {acc.label}</span>
                <span className="mt-0.5 block font-mono text-xs text-[var(--foreground-muted)]">
                  {acc.identifier} / {acc.password}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[var(--foreground-muted)]">
          También sirve <code className="font-mono">estudiante</code> con la
          misma clave que demo (<code className="font-mono">StudyPass1!</code>
          ).
        </p>
      </aside>

      <p className="mt-6 text-sm text-[var(--foreground-muted)]">
        <Link
          href="/forgot-password"
          className="text-[var(--accent)] underline-offset-4 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        {" · "}
        <Link
          href="/register"
          className="text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Crear cuenta
        </Link>
        {" · "}
        <Link
          href="/guest"
          className="text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Probar sin cuenta
        </Link>
      </p>
    </main>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fetchMe, login, storeAuth } from "@/lib/api";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [meSummary, setMeSummary] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMeSummary(null);
    setPending(true);
    try {
      const res = await login({ identifier, password });
      storeAuth(res);
      const me = await fetchMe();
      setMeSummary(`${me.username} · ${me.email} · ${me.role}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setPending(false);
    }
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
        Usa tu email o username junto con la contraseña.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Correo o username
          <Input
            name="identifier"
            type="text"
            required
            autoComplete="username"
            placeholder="tu@email.com o username"
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

        {meSummary ? (
          <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
            Sesión OK: {meSummary}
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
      </p>
    </main>
  );
}

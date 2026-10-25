"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Mascot } from "@/components/brand/mascot";
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

function safeNextPath(raw: string | null, role: string): string {
  if (role === "ADMIN") return "/admin";
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/login")) {
    return "/dashboard";
  }
  return raw;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const hint = useMemo(() => {
    if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
      return `Después de entrar vuelves a ${nextParam}.`;
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
        Study Lab
      </Link>
      <Mascot pose="wave" size="md" float className="mt-8" />
      <h1 className="font-display mt-6 text-3xl font-semibold tracking-tight">
        Entrar
      </h1>
      {hint ? (
        <p className="mt-2 text-sm text-[var(--accent)]">{hint}</p>
      ) : null}

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

      <ul className="mt-8 space-y-2">
        {DEMO_ACCOUNTS.map((acc) => (
          <li key={acc.identifier}>
            <button
              type="button"
              disabled={pending}
              onClick={() => void enterAs(acc.identifier, acc.password)}
              className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-left text-sm hover:border-[var(--accent)] disabled:opacity-60"
            >
              {acc.label}
              <span className="ml-2 font-mono text-xs text-[var(--foreground-muted)]">
                {acc.identifier}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link href="/forgot-password" className="text-[var(--accent)] hover:underline">
          Contraseña
        </Link>
        <Link href="/register" className="text-[var(--accent)] hover:underline">
          Registro
        </Link>
        <Link href="/guest" className="text-[var(--accent)] hover:underline">
          Probar
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-dvh max-w-md items-center justify-center px-6">
          <p className="text-sm text-[var(--foreground-muted)]">Cargando…</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { PASSWORD_MIN, USERNAME_MAX, USERNAME_MIN } from "@aps/shared";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { register, storeAuth } from "@/lib/api";
import { forceOnboardingOnce } from "@/lib/onboarding";

function strengthHints(password: string) {
  return [
    {
      ok: password.length >= PASSWORD_MIN,
      label: `Al menos ${PASSWORD_MIN} caracteres`,
    },
    { ok: /[a-z]/.test(password), label: "Una minúscula" },
    { ok: /[A-Z]/.test(password), label: "Una mayúscula" },
    { ok: /[0-9]/.test(password), label: "Un número" },
    {
      ok: /[^A-Za-z0-9]/.test(password),
      label: "Un símbolo (recomendado)",
    },
  ];
}

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timezone, setTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [doneUser, setDoneUser] = useState<string | null>(null);

  const hints = useMemo(() => strengthHints(password), [password]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await register({
        email,
        username,
        password,
        confirmPassword,
        timezone,
      });
      storeAuth(res);
      forceOnboardingOnce();
      setDoneUser(res.user.username);
      router.push("/estudiar");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar");
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
        Crear cuenta
      </h1>
      <p className="mt-2 text-sm text-[var(--foreground-muted)]">
        Email, username único y contraseña robusta. El username aparece en el
        podio.
      </p>

      {doneUser ? (
        <div className="mt-8 space-y-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm">
          <p>
            Cuenta creada. Bienvenida/o, <strong>{doneUser}</strong>. Te
            llevamos a Estudiar con el tour «Así funciona…».
          </p>
          <Link
            className="text-[var(--accent)] underline-offset-4 hover:underline"
            href="/estudiar"
          >
            Ir a Estudiar
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Correo
            <Input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Username ({USERNAME_MIN}–{USERNAME_MAX}, letras/números/_)
            <Input
              type="text"
              required
              minLength={USERNAME_MIN}
              maxLength={USERNAME_MAX}
              pattern="[a-zA-Z0-9_]+"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Contraseña
            <Input
              type="password"
              required
              minLength={PASSWORD_MIN}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <ul className="space-y-1 text-xs text-[var(--foreground-muted)]">
            {hints.map((h) => (
              <li
                key={h.label}
                className={h.ok ? "text-emerald-600 dark:text-emerald-400" : ""}
              >
                {h.ok ? "✓" : "○"} {h.label}
              </li>
            ))}
          </ul>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Confirmar contraseña
            <Input
              type="password"
              required
              minLength={PASSWORD_MIN}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Zona horaria
            <Input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
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
            {pending ? "Creando…" : "Registrarme"}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-[var(--foreground-muted)]">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </p>
    </main>
  );
}

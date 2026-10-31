"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { PASSWORD_MIN, USERNAME_MAX, USERNAME_MIN } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { AuthAside } from "@/components/shell/auth-aside";
import { Button } from "@/components/ui/button";
import { FOCUS_RING } from "@/components/ui/focus";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { PAGE_TITLE, PageContainer } from "@/components/ui/page";
import { cn } from "@/lib/utils";
import { getStoredGuestProbeId, register, storeAuth } from "@/lib/api";
import { forceOnboardingOnce } from "@/lib/onboarding";
import { detectTimezone } from "@/lib/timezone";

const LINK = cn(
  "rounded-sm font-semibold text-[var(--foreground)] underline-offset-4 hover:underline",
  FOCUS_RING,
);

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
        timezone: detectTimezone() ?? undefined,
        guestProbeId:
          new URLSearchParams(window.location.search).get("guest") ??
          getStoredGuestProbeId() ??
          undefined,
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
    <div className="md:grid md:min-h-dvh md:grid-cols-2">
      <AuthAside
        pose="server"
        title="Crea tu cuenta y guarda tu progreso."
        text="Tus rachas, conceptos dominados y lugar en el podio te esperan."
      />
      <main className="flex min-h-dvh flex-col">
        <PageContainer
          width="narrow"
          className="flex flex-1 flex-col md:justify-center [@media(max-height:500px)]:md:py-5"
        >
          <Link
            href="/"
            className={cn(
              "font-display self-start rounded-sm text-sm font-semibold tracking-tight text-[var(--foreground)] md:hidden",
              FOCUS_RING,
            )}
          >
            AWS Study Lab
          </Link>

          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center md:mb-8 md:flex-none md:items-start md:py-0 md:text-left [@media(max-height:640px)]:py-3 [@media(max-height:500px)]:md:mb-4">
            <Mascot
              pose="server"
              size="hero"
              glow={false}
              priority
              className="!h-[clamp(7rem,30dvh,15rem)] !w-full !max-w-[18rem] md:hidden [@media(max-height:640px)]:!h-24"
            />
            <h1 className={cn(PAGE_TITLE, "mt-4 md:mt-0")}>Crear cuenta</h1>
          </div>

          {doneUser ? (
            <Notice
              tone="success"
              boxed
              action={
                <Link className={LINK} href="/estudiar">
                  Ir a Estudiar
                </Link>
              }
            >
              Cuenta creada. Bienvenido/a, <strong>{doneUser}</strong>. Te
              llevamos a Estudiar con la guía «Así funciona…».
            </Notice>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
                Correo
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
                Usuario ({USERNAME_MIN}–{USERNAME_MAX}, letras/números/_)
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
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
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
              <ul className="space-y-1 text-left text-xs text-[var(--foreground-muted)]">
                {hints.map((h) => (
                  <li
                    key={h.label}
                    className={h.ok ? "text-[var(--success-text)]" : undefined}
                  >
                    {h.ok ? "✓" : "○"} {h.label}
                  </li>
                ))}
              </ul>
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
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

              {error ? <Notice tone="danger">{error}</Notice> : null}

              <Button type="submit" size="lg" pending={pending} className="mt-1 w-full">
                {pending ? "Creando…" : "Registrarme"}
              </Button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-[var(--foreground-muted)]">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className={LINK}>
              Entrar
            </Link>
          </p>
        </PageContainer>
      </main>
    </div>
  );
}

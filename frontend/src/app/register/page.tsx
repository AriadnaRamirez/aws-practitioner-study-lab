"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { PASSWORD_MIN, USERNAME_MAX, USERNAME_MIN, USERNAME_PATTERN } from "@aps/shared";
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

function FieldError({
  id,
  message,
  children,
}: {
  id: string;
  message: string | null;
  children?: React.ReactNode;
}) {
  if (!message) return null;
  return (
    <span id={id} className="block text-xs font-normal text-[var(--danger-text)]">
      {message}
      {children}
    </span>
  );
}

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

/** "Lucía Pérez" → "lucia_perez": what a valid username for that name would look like. */
function suggestUsername(raw: string): string {
  const base = raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, USERNAME_MAX);
  return base.length >= USERNAME_MIN ? base : "";
}

type Field = "email" | "username" | "password" | "confirm";

function fieldErrors(
  email: string,
  username: string,
  password: string,
  confirm: string,
): Partial<Record<Field, string>> {
  const out: Partial<Record<Field, string>> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    out.email = "Escribe un correo válido, por ejemplo nombre@correo.com.";
  }
  const u = username.trim();
  if (u.length < USERNAME_MIN || u.length > USERNAME_MAX) {
    out.username = `Usa entre ${USERNAME_MIN} y ${USERNAME_MAX} caracteres.`;
  } else if (!USERNAME_PATTERN.test(u)) {
    out.username = "Sin espacios, acentos ni ñ: solo letras, números y guion bajo (_).";
  }
  if (
    password.length < PASSWORD_MIN ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    out.password = "Tu contraseña aún no cumple los requisitos de la lista.";
  }
  if (confirm !== password) {
    out.confirm = "Las contraseñas no coinciden.";
  }
  return out;
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
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const hints = useMemo(() => strengthHints(password), [password]);
  const errors = fieldErrors(email, username, password, confirmPassword);
  const shown = (f: Field) => ((submitted || touched[f]) && errors[f]) || null;
  const usernameSuggestion =
    shown("username") && suggestUsername(username) !== username
      ? suggestUsername(username)
      : "";
  const blur = (f: Field) => () => setTouched((t) => ({ ...t, [f]: true }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitted(true);
    const first = (["email", "username", "password", "confirm"] as const).find((f) => errors[f]);
    if (first) {
      document.getElementById(`registro-${first}`)?.focus();
      return;
    }
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
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos crear tu cuenta. Inténtalo de nuevo.",
      );
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
                <Link className={LINK} href="/dashboard">
                  Ir a Inicio
                </Link>
              }
            >
              Cuenta creada. Bienvenido/a, <strong>{doneUser}</strong>. Te
              llevamos a Inicio para enseñarte cómo funciona.
            </Notice>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
                Correo
                <Input
                  id="registro-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={blur("email")}
                  aria-invalid={Boolean(shown("email"))}
                  aria-describedby={shown("email") ? "registro-email-error" : undefined}
                />
                <FieldError id="registro-email-error" message={shown("email")} />
              </label>
              <div className="flex flex-col gap-1.5 text-left text-sm font-medium">
                <label htmlFor="registro-username">Nombre de usuario</label>
                <p id="registro-username-ayuda" className="text-xs font-normal text-[var(--foreground-muted)]">
                  Así te verán en el podio. Sin espacios ni acentos, por ejemplo: lucia_perez.
                </p>
                <Input
                  id="registro-username"
                  type="text"
                  required
                  maxLength={USERNAME_MAX}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={blur("username")}
                  aria-invalid={Boolean(shown("username"))}
                  aria-describedby={
                    shown("username")
                      ? "registro-username-ayuda registro-username-error"
                      : "registro-username-ayuda"
                  }
                />
                <FieldError id="registro-username-error" message={shown("username")}>
                  {usernameSuggestion ? (
                    <>
                      {" "}
                      <button
                        type="button"
                        className={cn(LINK, "inline-flex min-h-6 items-center")}
                        onClick={() => setUsername(usernameSuggestion)}
                      >
                        Usar «{usernameSuggestion}»
                      </button>
                    </>
                  ) : null}
                </FieldError>
              </div>
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
                Contraseña
                <Input
                  id="registro-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={blur("password")}
                  aria-invalid={Boolean(shown("password"))}
                  aria-describedby="registro-password-requisitos"
                />
                <FieldError id="registro-password-error" message={shown("password")} />
              </label>
              <ul
                id="registro-password-requisitos"
                className="space-y-1 text-left text-xs text-[var(--foreground-muted)]"
              >
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
                  id="registro-confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={blur("confirm")}
                  aria-invalid={Boolean(shown("confirm"))}
                  aria-describedby={shown("confirm") ? "registro-confirm-error" : undefined}
                />
                <FieldError id="registro-confirm-error" message={shown("confirm")} />
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

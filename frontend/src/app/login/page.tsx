"use client";

import Link from "next/link";
import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Mascot } from "@/components/brand/mascot";
import { AuthAside } from "@/components/shell/auth-aside";
import { Button } from "@/components/ui/button";
import { FOCUS_RING } from "@/components/ui/focus";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { PAGE_TITLE, PageContainer } from "@/components/ui/page";
import { ScreenLoader } from "@/components/ui/screen-loader";
import { cn } from "@/lib/utils";
import { login, setStoredUser, storeAuth, updateProfile } from "@/lib/api";
import { detectTimezone } from "@/lib/timezone";

const DEMO_ACCOUNTS = [
  { label: "Demo", identifier: "demo", password: "StudyPass1!" },
  { label: "Admin", identifier: "admin", password: "ChangeMeAdmin1!" },
] as const;

const LINK = cn(
  "rounded-sm font-semibold text-[var(--foreground)] underline-offset-4 hover:underline",
  FOCUS_RING,
);

function safeNextPath(raw: string | null, role: string): string {
  if (role === "ADMIN") return "/admin";
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/login")) {
    return "/dashboard";
  }
  return raw;
}

/** Mobile: la mascota ocupa el alto libre; form y enlaces quedan abajo, al alcance del pulgar. */
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
      const tz = detectTimezone();
      if (tz && tz !== res.user.timezone) {
        await updateProfile({ timezone: tz }).then(setStoredUser, () => {});
      }
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
    <div className="md:grid md:min-h-dvh md:grid-cols-2">
      <AuthAside
        pose="wave"
        title="Estudia para tu certificación AWS, carta por carta."
        text="Partidas cortas, repaso de lo que más fallas y un podio para motivarte."
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
              pose="wave"
              size="hero"
              glow={false}
              priority
              className="!h-[clamp(7rem,30dvh,15rem)] !w-full !max-w-[18rem] md:hidden [@media(max-height:640px)]:!h-24"
            />
            <h1 className={cn(PAGE_TITLE, "mt-4 md:mt-0")}>Entrar</h1>
            <p className="mt-2 max-w-prose text-base text-[var(--foreground-muted)]">
              {hint ?? "Hola de nuevo. Tus cartas te esperan."}
            </p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
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
                <IconButton
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
                </IconButton>
              </span>
            </label>

            {error ? <Notice tone="danger">{error}</Notice> : null}

            <Button type="submit" size="lg" pending={pending} className="mt-1 w-full">
              {pending ? "Entrando…" : "Entrar"}
            </Button>
          </form>

          <p className="mt-4 text-right text-sm">
            <Link
              href="/forgot-password"
              className={cn(
                "rounded-sm text-[var(--foreground-muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline",
                FOCUS_RING,
              )}
            >
              Olvidé mi contraseña
            </Link>
          </p>

          <p className="mt-8 text-center text-sm text-[var(--foreground-muted)]">
            <Link href="/register" className={LINK}>
              Crear cuenta
            </Link>
            <span className="mx-2 opacity-40" aria-hidden>
              ·
            </span>
            <Link href="/guest" className={LINK}>
              Probar sin cuenta
            </Link>
          </p>

          <ul className="mt-4 flex gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <li key={acc.identifier} className="flex-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  disabled={pending}
                  onClick={() => {
                    setIdentifier(acc.identifier);
                    setPassword(acc.password);
                    void doLogin(acc.identifier, acc.password);
                  }}
                  className="w-full"
                >
                  {acc.label}
                </Button>
              </li>
            ))}
          </ul>
        </PageContainer>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <ScreenLoader pose="wave" message="Preparando el inicio de sesión…" />
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PASSWORD_MIN } from '@aps/shared';
import { Mascot } from '@/components/brand/mascot';
import { AuthAside } from '@/components/shell/auth-aside';
import { Button } from '@/components/ui/button';
import { FOCUS_RING } from '@/components/ui/focus';
import { Input } from '@/components/ui/input';
import { Notice } from '@/components/ui/notice';
import { PAGE_TITLE, PageContainer } from '@/components/ui/page';
import { ScreenLoader } from '@/components/ui/screen-loader';
import { cn } from '@/lib/utils';
import { forgotPassword, resetPassword } from '@/lib/api';

const LINK = cn(
  'rounded-sm font-semibold text-[var(--foreground)] underline-offset-4 hover:underline',
  FOCUS_RING,
);

function ForgotPasswordForm() {
  const search = useSearchParams();
  const tokenFromUrl = search.get('token') ?? '';

  const [email, setEmail] = useState('');
  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const mode = useMemo(
    () => (tokenFromUrl || token ? 'reset' : 'request'),
    [tokenFromUrl, token],
  );

  async function onRequest(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);
    try {
      const res = await forgotPassword({ email });
      setMessage(
        `${res.message} (En desarrollo el enlace se imprime en el log de la API.)`,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo solicitar el restablecimiento',
      );
    } finally {
      setPending(false);
    }
  }

  async function onReset(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);
    try {
      const res = await resetPassword({ token, password, confirmPassword });
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer');
    } finally {
      setPending(false);
    }
  }

  const errorNotice = error ? <Notice tone="danger">{error}</Notice> : null;

  return (
    <div className="md:grid md:min-h-dvh md:grid-cols-2">
      <AuthAside
        pose="security"
        title="Recupera el acceso a tu cuenta."
        text="Tu progreso y tus rachas siguen guardados."
      />
      <main className="flex min-h-dvh flex-col">
        <PageContainer
          width="narrow"
          className="flex flex-1 flex-col md:justify-center [@media(max-height:500px)]:md:py-5"
        >
          <Link
            href="/"
            className={cn(
              'font-display self-start rounded-sm text-sm font-semibold tracking-tight text-[var(--foreground)] md:hidden',
              FOCUS_RING,
            )}
          >
            AWS Study Lab
          </Link>

          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center md:mb-8 md:flex-none md:items-start md:py-0 md:text-left [@media(max-height:640px)]:py-3 [@media(max-height:500px)]:md:mb-4">
            <Mascot
              pose="security"
              size="hero"
              glow={false}
              priority
              className="!h-[clamp(7rem,30dvh,15rem)] !w-full !max-w-[18rem] md:hidden [@media(max-height:640px)]:!h-24"
            />
            <h1 className={cn(PAGE_TITLE, 'mt-4 md:mt-0')}>
              {mode === 'reset' ? 'Nueva contraseña' : 'Recuperar contraseña'}
            </h1>
            <p className="mt-2 max-w-prose text-base text-[var(--foreground-muted)]">
              {mode === 'reset'
                ? 'Escribe el token y tu nueva contraseña.'
                : 'Te enviaremos un enlace de un solo uso al correo con el que te registraste.'}
            </p>
          </div>

          {mode === 'request' ? (
            <form onSubmit={onRequest} className="flex flex-col gap-4">
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

              {errorNotice}

              <Button type="submit" size="lg" pending={pending} className="mt-1 w-full">
                {pending ? 'Enviando…' : 'Enviar enlace'}
              </Button>
            </form>
          ) : (
            <form onSubmit={onReset} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
                Token
                <Input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="font-mono text-xs"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-left text-sm font-medium">
                Nueva contraseña
                <Input
                  type="password"
                  required
                  minLength={PASSWORD_MIN}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
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

              {errorNotice}

              <Button type="submit" size="lg" pending={pending} className="mt-1 w-full">
                {pending ? 'Guardando…' : 'Restablecer'}
              </Button>
            </form>
          )}

          {message ? (
            <Notice tone="success" boxed className="mt-6">
              {message}
            </Notice>
          ) : null}

          <p className="mt-8 text-center text-sm text-[var(--foreground-muted)]">
            <Link href="/login" className={LINK}>
              Volver a entrar
            </Link>
          </p>
        </PageContainer>
      </main>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <ScreenLoader pose="security" message="Preparando la recuperación de tu cuenta…" />
        </main>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}

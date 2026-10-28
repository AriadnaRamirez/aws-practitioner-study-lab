'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PASSWORD_MIN } from '@aps/shared';
import { forgotPassword, resetPassword } from '../../lib/api';
import { Suspense } from 'react';

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

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-sm text-zinc-500">AWS Practitioner Study Lab</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {mode === 'reset' ? 'Nueva contraseña' : 'Recuperar contraseña'}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          {mode === 'reset'
            ? 'Escribe el token y tu nueva contraseña.'
            : 'Te enviaremos un enlace de un solo uso al correo con el que te registraste.'}
        </p>
      </div>

      {mode === 'request' ? (
        <form onSubmit={onRequest} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Correo
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {pending ? 'Enviando…' : 'Enviar enlace'}
          </button>
        </form>
      ) : (
        <form onSubmit={onReset} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Token
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="rounded border border-zinc-300 bg-transparent px-3 py-2 font-mono text-xs dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Nueva contraseña
            <input
              type="password"
              required
              minLength={PASSWORD_MIN}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Confirmar contraseña
            <input
              type="password"
              required
              minLength={PASSWORD_MIN}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {pending ? 'Guardando…' : 'Restablecer'}
          </button>
        </form>
      )}

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
          {message}
        </p>
      ) : null}

      <p className="text-sm text-zinc-500">
        <Link className="underline underline-offset-4" href="/login">
          Volver a entrar
        </Link>
      </p>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<main className="p-8 text-sm">Cargando…</main>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

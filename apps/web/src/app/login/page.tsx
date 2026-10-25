'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { fetchMe, login, storeAuth } from '../../lib/api';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-sm text-zinc-500">AWS Practitioner Study Lab</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Iniciar sesión</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Usa tu email o username junto con la contraseña.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email o username
          <input
            type="text"
            required
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contraseña
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
          />
        </label>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        {meSummary ? (
          <p className="rounded border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm">
            Sesión OK via <code>/auth/me</code>: {meSummary}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {pending ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="text-sm text-zinc-500">
        <Link className="underline underline-offset-4" href="/forgot-password">
          ¿Olvidaste tu contraseña?
        </Link>
        {' · '}
        <Link className="underline underline-offset-4" href="/register">
          Crear cuenta
        </Link>
      </p>
    </main>
  );
}

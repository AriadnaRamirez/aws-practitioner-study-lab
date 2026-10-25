'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { PASSWORD_MIN, USERNAME_MAX, USERNAME_MIN } from '@aps/shared';
import { register, storeAuth } from '../../lib/api';

function strengthHints(password: string) {
  return [
    {
      ok: password.length >= PASSWORD_MIN,
      label: `Al menos ${PASSWORD_MIN} caracteres`,
    },
    { ok: /[a-z]/.test(password), label: 'Una minúscula' },
    { ok: /[A-Z]/.test(password), label: 'Una mayúscula' },
    { ok: /[0-9]/.test(password), label: 'Un número' },
    {
      ok: /[^A-Za-z0-9]/.test(password),
      label: 'Un símbolo (recomendado)',
    },
  ];
}

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timezone, setTimezone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
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
      setDoneUser(res.user.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-16">
      <div>
        <p className="text-sm text-zinc-500">AWS Practitioner Study Lab</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Crear cuenta</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Email, username único y contraseña robusta. El username aparece en el
          podio.
        </p>
      </div>

      {doneUser ? (
        <div className="space-y-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm">
          <p>
            Cuenta creada. Bienvenida/o, <strong>{doneUser}</strong>.
          </p>
          <Link className="underline underline-offset-4" href="/login">
            Ir a iniciar sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Username ({USERNAME_MIN}–{USERNAME_MAX}, letras/números/_)
            <input
              type="text"
              required
              minLength={USERNAME_MIN}
              maxLength={USERNAME_MAX}
              pattern="[a-zA-Z0-9_]+"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Contraseña
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
          <ul className="space-y-1 text-xs text-zinc-500">
            {hints.map((h) => (
              <li key={h.label} className={h.ok ? 'text-emerald-600' : ''}>
                {h.ok ? '✓' : '○'} {h.label}
              </li>
            ))}
          </ul>
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
          <label className="flex flex-col gap-1 text-sm">
            Zona horaria
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
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
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {pending ? 'Creando…' : 'Registrarme'}
          </button>
        </form>
      )}

      <p className="text-sm text-zinc-500">
        ¿Ya tienes cuenta?{' '}
        <Link className="underline underline-offset-4" href="/login">
          Iniciar sesión
        </Link>
      </p>
    </main>
  );
}

import Link from 'next/link';
import { APP_NAME } from '@aps/shared';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:43124/api/v1';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
        APS-4 · Auth
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {APP_NAME}
      </h1>
      <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
        Registro y login con email o username. La API Nest emite JWT de acceso
        (Bearer).
      </p>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          className="rounded bg-zinc-900 px-4 py-2 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          href="/register"
        >
          Crear cuenta
        </Link>
        <Link
          className="rounded border border-zinc-300 px-4 py-2 dark:border-zinc-700"
          href="/login"
        >
          Iniciar sesión
        </Link>
        <Link
          className="rounded border border-zinc-300 px-4 py-2 dark:border-zinc-700"
          href="/forgot-password"
        >
          Recuperar contraseña
        </Link>
      </div>
      <ul className="list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-300">
        <li>
          API health:{' '}
          <a
            className="underline underline-offset-4"
            href={`${API_URL}/health`}
            target="_blank"
            rel="noreferrer"
          >
            {API_URL}/health
          </a>
        </li>
        <li>
          Swagger:{' '}
          <a
            className="underline underline-offset-4"
            href="http://127.0.0.1:43124/docs"
            target="_blank"
            rel="noreferrer"
          >
            http://127.0.0.1:43124/docs
          </a>
        </li>
      </ul>
    </main>
  );
}

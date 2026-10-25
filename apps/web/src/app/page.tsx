import { APP_NAME } from "@aps/shared";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:43124/api/v1";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <p className="text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
        Scaffold · APS-3
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {APP_NAME}
      </h1>
      <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
        Monorepo listo: UI en Next.js (<code className="text-sm">apps/web</code>
        ) y API en Nest.js (<code className="text-sm">apps/api</code>). Aún no hay
        flashcards, examen ni auth — solo la base del §9 del documento maestro.
      </p>
      <ul className="list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-300">
        <li>
          API health:{" "}
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
          Swagger:{" "}
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

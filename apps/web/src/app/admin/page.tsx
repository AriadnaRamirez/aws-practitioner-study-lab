import Link from "next/link";
import {
  getExamQuestions,
  getKnowledgeItems,
  getTopics,
} from "@/lib/content-api";

export default async function AdminResumenPage() {
  const [topics, knowledge, questions] = await Promise.all([
    getTopics(),
    getKnowledgeItems(),
    getExamQuestions(),
  ]);

  const sourceNote =
    topics.source === "api" ? "datos de la API" : "mocks (API no disponible)";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resumen de uso</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Stub owner: conteos de contenido in-memory. Analytics reales (DAU,
          guests…) llegan en tickets posteriores. Fuente: {sourceNote}.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-3">
        <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">Temas</p>
          <p className="mt-1 text-3xl font-semibold">{topics.data.length}</p>
          <Link href="/admin/temas" className="mt-2 inline-block text-sm underline">
            Ver temas
          </Link>
        </li>
        <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">Flash (hechos)</p>
          <p className="mt-1 text-3xl font-semibold">{knowledge.data.length}</p>
          <Link href="/admin/flash" className="mt-2 inline-block text-sm underline">
            Ver flash
          </Link>
        </li>
        <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">Banco examen</p>
          <p className="mt-1 text-3xl font-semibold">{questions.data.length}</p>
          <Link href="/admin/banco" className="mt-2 inline-block text-sm underline">
            Ver banco
          </Link>
        </li>
      </ul>

      <p className="text-sm text-zinc-500">
        Usuarios e Import son placeholders hasta APS-4 / APS-14.
      </p>
    </div>
  );
}

import { getKnowledgeItems } from "@/lib/api";

export default async function AdminFlashPage() {
  const { data, source } = await getKnowledgeItems();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Flash / hechos</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          KnowledgeItem canónico (name + definition + distractors + variantes).
          Fuente: {source === "api" ? "API" : "mock"}.
        </p>
      </div>
      <ul className="space-y-3">
        {data.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <span className="text-xs uppercase tracking-wide text-zinc-500">
                {item.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              {item.definition}
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              Variantes: {item.allowedVariants.join(", ")} · distractores:{" "}
              {item.distractors.length}
            </p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-zinc-500">
        CRUD: <code>/api/v1/admin/knowledge-items</code>
      </p>
    </div>
  );
}

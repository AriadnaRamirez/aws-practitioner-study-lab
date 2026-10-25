import { getExamQuestions } from "@/lib/api";

export default async function AdminBancoPage() {
  const { data, source } = await getExamQuestions();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Banco examen</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          ExamQuestion con exactamente 4 opciones. Fuente:{" "}
          {source === "api" ? "API" : "mock"}.
        </p>
      </div>
      <ul className="space-y-4">
        {data.map((q) => (
          <li
            key={q.id}
            className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="font-medium">{q.stem}</p>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              {q.choices.map((c, i) => (
                <li
                  key={i}
                  className={i === q.correctIndex ? "font-semibold" : ""}
                >
                  {c}
                  {i === q.correctIndex ? " ✓" : ""}
                </li>
              ))}
            </ol>
            <p className="mt-2 text-xs text-zinc-500">{q.explanation}</p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-zinc-500">
        CRUD: <code>/api/v1/admin/exam-questions</code>
      </p>
    </div>
  );
}

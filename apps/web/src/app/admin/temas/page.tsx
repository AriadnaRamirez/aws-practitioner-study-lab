import { getTopics } from "@/lib/api";

export default async function AdminTemasPage() {
  const { data, source } = await getTopics();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Temas</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Taxonomía SERVICE | CONCEPT (maestro §5). Fuente:{" "}
          {source === "api" ? "API" : "mock"}.
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-3 py-2 font-medium">Nombre</th>
              <th className="px-3 py-2 font-medium">Tipo</th>
              <th className="px-3 py-2 font-medium">Track</th>
              <th className="px-3 py-2 font-medium">Orden</th>
              <th className="px-3 py-2 font-medium">Id</th>
            </tr>
          </thead>
          <tbody>
            {data.map((t) => (
              <tr
                key={t.id}
                className="border-t border-zinc-200 dark:border-zinc-800"
              >
                <td className="px-3 py-2 font-medium">{t.name}</td>
                <td className="px-3 py-2">{t.type}</td>
                <td className="px-3 py-2">{t.trackId}</td>
                <td className="px-3 py-2">{t.sortOrder}</td>
                <td className="px-3 py-2 font-mono text-xs text-zinc-500">
                  {t.id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-500">
        Mutaciones vía Swagger <code>/api/v1/admin/topics</code> + header{" "}
        <code>x-admin-token</code>. Form UI en tickets siguientes.
      </p>
    </div>
  );
}

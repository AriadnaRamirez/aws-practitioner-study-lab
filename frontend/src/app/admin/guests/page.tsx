import { getAdminGuests } from "@/lib/usage-api";

export default async function AdminGuestsPage() {
  const { data, source } = await getAdminGuests();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Invitados / marketing
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          GuestProbes: sesiones de prueba y conversión a cuenta. Fuente:{" "}
          {source === "api" ? "API" : "API no disponible"}.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
          Aún no hay guests, o la API no responde.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-3 py-2 font-medium">Probe</th>
                <th className="px-3 py-2 font-medium">Sesiones</th>
                <th className="px-3 py-2 font-medium">Convertido</th>
                <th className="px-3 py-2 font-medium">User id</th>
                <th className="px-3 py-2 font-medium">Creado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((g) => (
                <tr
                  key={g.id}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="px-3 py-2 font-mono text-xs">{g.id}</td>
                  <td className="px-3 py-2">{g.sessionsCount}</td>
                  <td className="px-3 py-2">{g.converted ? "Sí" : "No"}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {g.convertedUserId ?? "—"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(g.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { getAdminUsers } from "@/lib/usage-api";

export default async function AdminUsuariosPage() {
  const { data, source } = await getAdminUsers();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Cuentas registradas (lectura). Ban / reset / podiumHidden llegan en
          tickets posteriores. Fuente:{" "}
          {source === "api" ? "API" : "API no disponible"}.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
          Sin usuarios o API inaccesible.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-3 py-2 font-medium">Username</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Rol</th>
                <th className="px-3 py-2 font-medium">TZ</th>
                <th className="px-3 py-2 font-medium">Alta</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="px-3 py-2 font-medium">{u.username}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.role}</td>
                  <td className="px-3 py-2">{u.timezone}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleString()}
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

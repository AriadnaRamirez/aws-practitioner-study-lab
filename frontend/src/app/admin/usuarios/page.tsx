import { UsersPanel } from "@/components/admin/users-panel";
import { getAdminUsers } from "@/lib/usage-api";

export default async function AdminUsuariosPage() {
  const { data, source } = await getAdminUsers();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Ban suave, reset de contraseña y{" "}
          <code className="text-xs">podiumHidden</code>. Fuente:{" "}
          {source === "api" ? "API" : "API no disponible"}.
        </p>
      </div>
      <UsersPanel initialUsers={data} />
    </div>
  );
}

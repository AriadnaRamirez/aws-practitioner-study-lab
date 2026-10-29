import { AdminNotice, AdminPageHeader } from "@/components/admin/admin-ui";
import { UsersPanel } from "@/components/admin/users-panel";
import { getAdminUsers } from "@/lib/usage-api";

export default async function AdminUsuariosPage() {
  const { data, source } = await getAdminUsers();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Usuarios"
        description="Actividad de estudio por cuenta, suspensiones, visibilidad en el podio y restablecimiento de contraseñas."
      />
      {source === "unavailable" ? (
        <AdminNotice tone="warning">
          La API no respondió; no se pudieron cargar los usuarios.
        </AdminNotice>
      ) : null}
      <UsersPanel initialUsers={data} />
    </div>
  );
}

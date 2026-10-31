import { AdminPage } from "@/components/admin/admin-ui";
import { UsersPanel } from "@/components/admin/users-panel";
import { Notice } from "@/components/ui/notice";
import { getAdminUsers } from "@/lib/usage-api";

export default async function AdminUsuariosPage() {
  const { data, source } = await getAdminUsers();

  return (
    <AdminPage
      title="Usuarios"
      description="Actividad de estudio por cuenta, suspensiones, visibilidad en el podio y restablecimiento de contraseñas."
    >
      {source === "unavailable" ? (
        <Notice tone="warning" boxed>
          La API no respondió; no se pudieron cargar los usuarios.
        </Notice>
      ) : null}
      <UsersPanel initialUsers={data} />
    </AdminPage>
  );
}

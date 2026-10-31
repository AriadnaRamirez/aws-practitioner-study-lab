import { AdminPage } from "@/components/admin/admin-ui";
import { ImportPanel } from "./import-panel";

export default function AdminImportPage() {
  return (
    <AdminPage
      title="Importar / exportar"
      description={
        <>
          Contenido en CSV o JSON con upsert por <code className="font-mono text-xs">externalKey</code>.
          Las importaciones se simulan por defecto y no modifican nada hasta confirmar.
        </>
      }
    >
      <ImportPanel />
    </AdminPage>
  );
}

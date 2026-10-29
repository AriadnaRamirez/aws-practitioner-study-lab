import { AdminPageHeader } from "@/components/admin/admin-ui";
import { FlagsPanel } from "@/components/admin/flags-panel";

export default function AdminFlagsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Banderas de función"
        description="Activa o desactiva partes de la app sin desplegar. Ambas banderas vienen apagadas por defecto."
      />
      <FlagsPanel />
    </div>
  );
}

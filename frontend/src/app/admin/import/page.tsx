import { ImportPanel } from "./import-panel";

export default function AdminImportPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Importar / exportar</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          CSV o JSON con upsert por <code className="text-xs">externalKey</code>.
          Dry-run por defecto.
        </p>
      </div>
      <ImportPanel />
    </div>
  );
}

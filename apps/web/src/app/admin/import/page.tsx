export default function AdminImportPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight">Import / export</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Placeholder. CSV/JSON idempotente por{" "}
        <code className="text-sm">externalKey</code>, dry-run e historial de jobs
        son APS-14. Aquí no se parsean archivos.
      </p>
      <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
        Arrastra un archivo… (deshabilitado en este stub)
      </div>
    </div>
  );
}

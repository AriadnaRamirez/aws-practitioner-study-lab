export default function AdminUsuariosPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Placeholder. El CRUD de cuentas, ban, reset password y{" "}
        <code className="text-sm">podiumHidden</code> llega con el auth JWT
        (APS-4) y analytics de uso posteriores.
      </p>
      <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
        Sin lista aún — seed del admin único lo hace APS-4.
      </div>
    </div>
  );
}

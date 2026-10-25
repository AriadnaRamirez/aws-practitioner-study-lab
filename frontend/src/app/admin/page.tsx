import Link from "next/link";
import { getUsageSummary } from "@/lib/usage-api";

function pct(rate: number) {
  return `${Math.round(rate * 1000) / 10}%`;
}

export default async function AdminResumenPage() {
  const { data, source } = await getUsageSummary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resumen de uso</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Métricas de uso de la app (owner): usuarios, guests de marketing,
          conversión y sesiones guest. Sin heatmaps de conocimiento. Fuente:{" "}
          {source === "api" ? "API" : "API no disponible"}.
        </p>
      </div>

      {data ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Usuarios</p>
            <p className="mt-1 text-3xl font-semibold">{data.usersTotal}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {data.usersStudents} estudiantes · {data.usersAdmins} admin
            </p>
            <Link
              href="/admin/usuarios"
              className="mt-2 inline-block text-sm underline"
            >
              Ver usuarios
            </Link>
          </li>
          <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Guests (marketing)</p>
            <p className="mt-1 text-3xl font-semibold">{data.guestsTotal}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {data.guestsConverted} convertidos
            </p>
            <Link
              href="/admin/guests"
              className="mt-2 inline-block text-sm underline"
            >
              Ver guests
            </Link>
          </li>
          <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Conversión guest→registro</p>
            <p className="mt-1 text-3xl font-semibold">
              {pct(data.conversionRate)}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {data.guestsConverted}/{data.guestsTotal || 0} probes
            </p>
          </li>
          <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Sesiones guest</p>
            <p className="mt-1 text-3xl font-semibold">
              {data.guestSessionsTotal}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Suma de sesiones registradas en GuestProbe
            </p>
          </li>
          <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">DAU / WAU</p>
            <p className="mt-1 text-3xl font-semibold">
              {data.dau}{" "}
              <span className="text-lg font-medium text-zinc-500">
                / {data.wau}
              </span>
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Usuarios distintos con sesión (24h / 7×24h)
            </p>
          </li>
          <li className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Finish rate (7d)</p>
            <p className="mt-1 text-3xl font-semibold">
              {pct(data.finishRateLast7d)}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {data.sessionsCompletedLast7d}/{data.sessionsLast7d} sesiones
              terminadas
            </p>
          </li>
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
          No se pudo cargar el resumen. Comprueba que la API esté arriba y el
          header <code className="text-xs">x-admin-token</code> coincida con{" "}
          <code className="text-xs">ADMIN_TOKEN</code>.
        </div>
      )}
    </div>
  );
}

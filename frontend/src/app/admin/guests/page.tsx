import { cn } from "@/lib/utils";
import { getAdminGuests } from "@/lib/usage-api";
import {
  ADMIN_TABLE,
  AdminBadge,
  AdminEmpty,
  AdminNotice,
  AdminPageHeader,
} from "@/components/admin/admin-ui";
import {
  AdminStat,
  AdminStatGrid,
  formatAdminDateTime,
  formatPercent,
  formatRelative,
} from "@/components/admin/admin-metrics";

export default async function AdminGuestsPage() {
  const { data, source } = await getAdminGuests();

  const converted = data.filter((g) => g.converted).length;
  const sessions = data.reduce((sum, g) => sum + g.sessionsCount, 0);
  const rate = data.length > 0 ? converted / data.length : 0;
  const avgSessions = data.length > 0 ? sessions / data.length : 0;
  const now = Date.now();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Invitados"
        description="Pruebas sin cuenta desde la landing: sesiones usadas y conversión a registro."
      />

      {source === "unavailable" ? (
        <AdminNotice tone="warning">
          La API no respondió; no se pudieron cargar los invitados.
        </AdminNotice>
      ) : null}

      <AdminStatGrid>
        <AdminStat label="Invitados" value={data.length} hint={`${sessions} sesiones en total`} />
        <AdminStat label="Convertidos" value={converted} tone="success" />
        <AdminStat
          label="Tasa de conversión"
          value={formatPercent(rate)}
          tone="accent"
          hint={`${converted} de ${data.length}`}
        />
        <AdminStat label="Sesiones promedio" value={avgSessions.toFixed(1)} hint="Por invitado" />
      </AdminStatGrid>

      {data.length === 0 ? (
        <AdminEmpty>Aún no hay invitados, o la API no responde.</AdminEmpty>
      ) : (
        <div className={ADMIN_TABLE.wrap}>
          <table className={ADMIN_TABLE.table}>
            <thead className={ADMIN_TABLE.thead}>
              <tr>
                <th className={ADMIN_TABLE.th}>Invitado</th>
                <th className={cn(ADMIN_TABLE.th, "text-right")}>Sesiones</th>
                <th className={ADMIN_TABLE.th}>Estado</th>
                <th className={ADMIN_TABLE.th}>Cuenta creada</th>
                <th className={ADMIN_TABLE.th}>Primera visita</th>
              </tr>
            </thead>
            <tbody>
              {data.map((g) => (
                <tr key={g.id} className={ADMIN_TABLE.tr}>
                  <td className={cn(ADMIN_TABLE.td, "font-mono text-xs text-[var(--foreground-muted)]")}>
                    {g.id}
                  </td>
                  <td className={cn(ADMIN_TABLE.td, "text-right font-semibold")}>
                    {g.sessionsCount}
                  </td>
                  <td className={ADMIN_TABLE.td}>
                    {g.converted ? (
                      <AdminBadge tone="success">Convertido</AdminBadge>
                    ) : (
                      <AdminBadge>Sin cuenta</AdminBadge>
                    )}
                  </td>
                  <td className={cn(ADMIN_TABLE.td, "font-mono text-xs text-[var(--foreground-muted)]")}>
                    {g.convertedUserId ?? "—"}
                  </td>
                  <td className={cn(ADMIN_TABLE.td, "whitespace-nowrap")}>
                    <span title={formatAdminDateTime(g.createdAt)}>
                      {formatRelative(g.createdAt, now)}
                    </span>
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

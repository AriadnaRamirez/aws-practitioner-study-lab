import Link from "next/link";
import type { AdminKpi, AdminMetrics } from "@aps/shared";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { DailyChart, ShareBar, Sparkline } from "@/components/admin/admin-charts";
import {
  ADMIN_BUTTON,
  ADMIN_CARD,
  ADMIN_LABEL,
  ADMIN_TABLE,
  AdminBadge,
  AdminEmpty,
  AdminPageHeader,
  AdminSection,
} from "@/components/admin/admin-ui";
import { getAdminMetrics } from "@/lib/usage-api";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const NUMBER = new Intl.NumberFormat("es-MX");

function pct(rate: number, digits = 0): string {
  return `${(rate * 100).toFixed(digits)}%`;
}

type Delta = { text: string; tone: "up" | "down" | "flat" };

/**
 * Counts compare in %, rates in percentage points. `baseline` is the previous
 * window's volume behind the number; with none there is nothing to compare.
 */
function delta(kpi: AdminKpi, kind: "count" | "rate", baseline: number): Delta | null {
  if (baseline === 0) return null;
  const diff = kpi.current - kpi.previous;
  if (kind === "rate") {
    const pp = Math.round(diff * 1000) / 10;
    if (pp === 0) return { text: "sin cambio", tone: "flat" };
    return { text: `${pp > 0 ? "+" : ""}${pp} pp`, tone: pp > 0 ? "up" : "down" };
  }
  if (diff === 0) return { text: "sin cambio", tone: "flat" };
  const change = Math.round((diff / kpi.previous) * 100);
  return { text: `${change > 0 ? "+" : ""}${change}%`, tone: change >= 0 ? "up" : "down" };
}

function KpiTile({
  label,
  value,
  kpi,
  kind = "count",
  baseline,
  series,
  hint,
}: {
  label: string;
  value: string;
  kpi?: AdminKpi;
  kind?: "count" | "rate";
  /** Defaults to the KPI's own previous value. */
  baseline?: number;
  series?: number[];
  hint?: string;
}) {
  const d = kpi ? delta(kpi, kind, baseline ?? kpi.previous) : null;
  const Icon = d?.tone === "up" ? ArrowUpRight : d?.tone === "down" ? ArrowDownRight : Minus;
  return (
    <div className={cn(ADMIN_CARD, "flex min-w-0 flex-col gap-3 p-3.5 sm:p-4")}>
      <p className={ADMIN_LABEL}>{label}</p>
      <div className="flex items-end justify-between gap-3">
        <p className="text-3xl font-bold leading-none tracking-tight tabular-nums text-[var(--foreground)]">
          {value}
        </p>
        {series ? <Sparkline values={series} className="hidden w-20 shrink-0 sm:block" /> : null}
      </div>
      <p className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
        {d ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold tabular-nums",
              d.tone === "up" && "bg-emerald-500/15 text-emerald-300",
              d.tone === "down" && "bg-red-500/15 text-red-300",
              d.tone === "flat" && "bg-[var(--surface-elevated)]",
            )}
          >
            <Icon className="size-3" aria-hidden />
            {d.text}
          </span>
        ) : null}
        <span>
          {hint ?? (d ? "vs. 7 días previos" : "Sin datos de la semana previa")}
        </span>
      </p>
    </div>
  );
}

function relativeTime(iso: string, now: Date): string {
  const mins = Math.round((now.getTime() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `hace ${days} ${days === 1 ? "día" : "días"}`;
}

const MODE_LABEL: Record<string, string> = {
  FLASH_STUDY: "Cartas",
  WEAK_REVIEW: "Más falladas",
  EXAM_STUDY: "Examen · estudio",
  EXAM_TIMED: "Examen · cronometrado",
};

function Overview({ m }: { m: AdminMetrics }) {
  const now = new Date(m.generatedAt);
  const last14 = m.daily.slice(-14);
  const series = (fn: (d: AdminMetrics["daily"][number]) => number) => last14.map(fn);
  const updated = new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: m.timezone,
  }).format(now);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Resumen"
        description={`Actividad de estudiantes en los últimos ${m.daily.length} días, en hora de Ciudad de México. Las cuentas de administración no cuentan.`}
        actions={
          <span className="rounded-lg bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground-muted)]">
            Actualizado a las {updated}
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiTile
          label="Estudiantes activos · 7 días"
          value={NUMBER.format(m.kpis.activeUsers.current)}
          kpi={m.kpis.activeUsers}
          series={series((d) => d.activeUsers)}
        />
        <KpiTile
          label="Partidas · 7 días"
          value={NUMBER.format(m.kpis.sessions.current)}
          kpi={m.kpis.sessions}
          series={series((d) => d.sessions)}
        />
        <KpiTile
          label="Respuestas · 7 días"
          value={NUMBER.format(m.kpis.answers.current)}
          kpi={m.kpis.answers}
          series={series((d) => d.answers)}
        />
        <KpiTile
          label="Conceptos dominados · 7 días"
          value={NUMBER.format(m.kpis.mastered.current)}
          kpi={m.kpis.mastered}
          series={series((d) => d.mastered)}
        />
        <KpiTile
          label="Precisión · 7 días"
          value={pct(m.kpis.accuracy.current, 1)}
          kpi={m.kpis.accuracy}
          kind="rate"
          baseline={m.kpis.answers.previous}
        />
        <KpiTile
          label="Partidas terminadas · 7 días"
          value={pct(m.kpis.finishRate.current)}
          kpi={m.kpis.finishRate}
          kind="rate"
          baseline={m.kpis.sessions.previous}
        />
        <KpiTile
          label="Nuevos registros · 7 días"
          value={NUMBER.format(m.kpis.newUsers.current)}
          kpi={m.kpis.newUsers}
          series={series((d) => d.newUsers)}
        />
        <KpiTile
          label="Conversión de invitados"
          value={pct(m.guests.conversionRate)}
          hint={`${m.guests.converted} de ${m.guests.total} invitados crearon cuenta`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <AdminSection
          title="Partidas y estudiantes activos"
          description="Por día. Pasa el cursor sobre una barra para ver el detalle."
          className="xl:col-span-2"
        >
          <DailyChart
            points={m.daily.map((d) => ({ date: d.date, bar: d.sessions, line: d.activeUsers }))}
            barLabel="Partidas"
            lineLabel="Estudiantes activos"
          />
        </AdminSection>

        <AdminSection title="Estudiantes" description="Cuántos avanzan en cada paso.">
          <dl className="grid grid-cols-3 gap-2">
            {[
              { label: "Registrados", value: m.totals.students },
              { label: "Activos hoy", value: m.activeToday },
              { label: "Suspendidos", value: m.totals.banned },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-[var(--surface-elevated)] px-3 py-2.5">
                <dt className="text-[11px] text-[var(--foreground-muted)]">{s.label}</dt>
                <dd className="mt-0.5 text-xl font-bold tabular-nums">{NUMBER.format(s.value)}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 space-y-4">
            <ShareBar label="Registrados" value={m.funnel.registered} total={m.funnel.registered} />
            <ShareBar
              label="Empezaron a estudiar"
              value={m.funnel.studied}
              total={m.funnel.registered}
            />
            <ShareBar
              label="Dominaron al menos un concepto"
              value={m.funnel.mastered}
              total={m.funnel.registered}
            />
          </div>
          <Link href="/admin/usuarios" className={cn(ADMIN_BUTTON.secondary, "mt-5 w-full")}>
            Ver usuarios
          </Link>
        </AdminSection>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <AdminSection
          title="Respuestas y precisión"
          description="Respuestas por día y porcentaje de aciertos."
          className="xl:col-span-2"
        >
          <DailyChart
            points={m.daily.map((d) => ({
              date: d.date,
              bar: d.answers,
              line: d.answers > 0 ? d.correctAnswers / d.answers : null,
            }))}
            barLabel="Respuestas"
            lineLabel="Precisión"
            lineMax={1}
            formatLine={(v) => pct(v)}
          />
        </AdminSection>

        <AdminSection
          title="Contenido"
          description={`${NUMBER.format(m.totals.publishedItems)} conceptos publicados.`}
        >
          <dl className="space-y-3 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[var(--foreground-muted)]">Dominios acumulados</dt>
              <dd className="font-semibold tabular-nums">{NUMBER.format(m.totals.masteredItems)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[var(--foreground-muted)]">Promedio por estudiante</dt>
              <dd className="font-semibold tabular-nums">
                {m.totals.students > 0
                  ? (m.totals.masteredItems / m.totals.students).toFixed(1)
                  : "0"}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[var(--foreground-muted)]">Sesiones de invitados</dt>
              <dd className="font-semibold tabular-nums">{NUMBER.format(m.guests.sessions)}</dd>
            </div>
          </dl>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/admin/flash" className={ADMIN_BUTTON.secondary}>
              Cartas
            </Link>
            <Link href="/admin/import" className={ADMIN_BUTTON.ghost}>
              Importar
            </Link>
          </div>
        </AdminSection>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminSection
          title="Conceptos más fallados"
          description="Últimos 30 días, con al menos 3 intentos. Buenos candidatos para revisar el contenido."
        >
          {m.mostMissed.length === 0 ? (
            <p className="text-sm text-[var(--foreground-muted)]">Aún no hay suficientes intentos.</p>
          ) : (
            <div className={cn(ADMIN_TABLE.wrap, "-mx-1 bg-transparent")}>
              <table className={ADMIN_TABLE.table}>
                <thead className={ADMIN_TABLE.thead}>
                  <tr>
                    <th className={ADMIN_TABLE.th}>Concepto</th>
                    <th className={cn(ADMIN_TABLE.th, "text-right")}>Intentos</th>
                    <th className={cn(ADMIN_TABLE.th, "text-right")}>Fallos</th>
                    <th className={cn(ADMIN_TABLE.th, "w-32")}>% de fallo</th>
                  </tr>
                </thead>
                <tbody>
                  {m.mostMissed.map((item) => (
                    <tr key={item.itemId} className={ADMIN_TABLE.tr}>
                      <td className={ADMIN_TABLE.td}>
                        <p className="font-medium text-[var(--foreground)]">{item.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{item.topicName}</p>
                      </td>
                      <td className={cn(ADMIN_TABLE.td, "text-right")}>{item.attempts}</td>
                      <td className={cn(ADMIN_TABLE.td, "text-right font-semibold")}>{item.misses}</td>
                      <td className={ADMIN_TABLE.td}>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                            <div
                              className="h-full rounded-full bg-red-400/80"
                              style={{ width: `${Math.round(item.missRate * 100)}%` }}
                            />
                          </div>
                          <span className="w-9 text-right text-xs">{pct(item.missRate)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminSection>

        <AdminSection title="Actividad reciente" description="Últimas partidas de estudiantes.">
          {m.recentSessions.length === 0 ? (
            <p className="text-sm text-[var(--foreground-muted)]">Todavía no hay partidas.</p>
          ) : (
            <div className={cn(ADMIN_TABLE.wrap, "-mx-1 bg-transparent")}>
              <table className={ADMIN_TABLE.table}>
                <thead className={ADMIN_TABLE.thead}>
                  <tr>
                    <th className={ADMIN_TABLE.th}>Estudiante</th>
                    <th className={ADMIN_TABLE.th}>Modo</th>
                    <th className={cn(ADMIN_TABLE.th, "text-right")}>Aciertos</th>
                    <th className={ADMIN_TABLE.th}>Estado</th>
                    <th className={cn(ADMIN_TABLE.th, "text-right")}>Inicio</th>
                  </tr>
                </thead>
                <tbody>
                  {m.recentSessions.map((s) => (
                    <tr key={s.id} className={ADMIN_TABLE.tr}>
                      <td className={cn(ADMIN_TABLE.td, "font-medium text-[var(--foreground)]")}>
                        @{s.username}
                      </td>
                      <td className={cn(ADMIN_TABLE.td, "text-[var(--foreground-muted)]")}>
                        {MODE_LABEL[s.mode] ?? s.mode} · {s.size}
                      </td>
                      <td className={cn(ADMIN_TABLE.td, "text-right")}>
                        {s.correct}/{s.answered}
                      </td>
                      <td className={ADMIN_TABLE.td}>
                        {s.endedAt ? (
                          <AdminBadge tone="success">Terminada</AdminBadge>
                        ) : (
                          <AdminBadge tone="warning">Sin terminar</AdminBadge>
                        )}
                      </td>
                      <td className={cn(ADMIN_TABLE.td, "whitespace-nowrap text-right text-[var(--foreground-muted)]")}>
                        {relativeTime(s.startedAt, now)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminSection>
      </div>
    </div>
  );
}

export default async function AdminResumenPage() {
  const metrics = await getAdminMetrics();
  if (!metrics) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Resumen" />
        <AdminEmpty>
          No se pudieron cargar las métricas. Revisa que la API esté arriba y que el header{" "}
          <code className="text-xs">x-admin-token</code> coincida con{" "}
          <code className="text-xs">ADMIN_TOKEN</code>.
        </AdminEmpty>
      </div>
    );
  }
  return <Overview m={metrics} />;
}

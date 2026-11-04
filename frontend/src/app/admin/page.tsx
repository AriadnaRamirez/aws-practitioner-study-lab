import Link from "next/link";
import type { AdminKpi, AdminMetrics } from "@aps/shared";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { DailyChart, ShareBar, Sparkline } from "@/components/admin/admin-charts";
import { ADMIN_GRID, ADMIN_TABLE, AdminPage, AdminSection } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { ProgressBar } from "@/components/ui/progress";
import { Stat } from "@/components/ui/stat";
import { getAdminMetrics } from "@/lib/usage-api";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const NUMBER = new Intl.NumberFormat("es-MX");

function pct(rate: number, digits = 0): string {
  return `${(rate * 100).toFixed(digits)}%`;
}

/**
 * Resumen on ADMIN_GRID, xl (12 tracks):
 * ┌─────┬─────┬─────┬─────┐  8 KPI tiles, 3 tracks each
 * ├─────┴─────┴─────┼─────┤
 * │ partidas        │ est.│  chart 8 + panel 4
 * ├─────────────────┼─────┤
 * │ respuestas      │ cont│
 * ├───────────┬─────┴─────┤
 * │ fallados  │ actividad │  tables 6 + 6
 * └───────────┴───────────┘
 * Below xl: KPIs two per row, every panel full width.
 */
const TILE = {
  kpi: "xl:col-span-3",
  chart: "col-span-2 xl:col-span-8",
  side: "col-span-2 xl:col-span-4",
  half: "col-span-2 xl:col-span-6",
} as const;

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
    <Card padding="sm" className={cn("flex flex-col gap-3", TILE.kpi)}>
      <CardLabel as="p">{label}</CardLabel>
      <div className="flex items-end justify-between gap-3">
        <p className="text-3xl font-extrabold leading-none tracking-tight tabular-nums text-[var(--foreground)]">
          {value}
        </p>
        {series ? <Sparkline values={series} className="hidden w-20 shrink-0 sm:block" /> : null}
      </div>
      <p className="mt-auto flex flex-wrap items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
        {d ? (
          <Badge
            tone={d.tone === "up" ? "success" : d.tone === "down" ? "danger" : "neutral"}
            className="tabular-nums"
          >
            <Icon aria-hidden />
            {d.text}
          </Badge>
        ) : null}
        <span>
          {hint ?? (d ? "vs. 7 días previos" : "Sin datos de la semana previa")}
        </span>
      </p>
    </Card>
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
    <AdminPage
      title="Resumen"
      description={`Actividad de estudiantes en los últimos ${m.daily.length} días, en hora de Ciudad de México. Las cuentas de administración no cuentan.`}
      actions={<Badge>Actualizado a las {updated}</Badge>}
    >
      <div className={ADMIN_GRID}>
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

        <AdminSection
          title="Partidas y estudiantes activos"
          description="Por día. Pasa el cursor sobre una barra para ver el detalle."
          className={TILE.chart}
        >
          <DailyChart
            points={m.daily.map((d) => ({ date: d.date, bar: d.sessions, line: d.activeUsers }))}
            barLabel="Partidas"
            lineLabel="Estudiantes activos"
          />
        </AdminSection>

        <AdminSection
          title="Estudiantes"
          description="Cuántos avanzan en cada paso."
          className={TILE.side}
        >
          <dl className="grid grid-cols-3 gap-2">
            {[
              { label: "Registrados", value: m.totals.students },
              { label: "Activos hoy", value: m.activeToday },
              { label: "Suspendidos", value: m.totals.banned },
            ].map((s) => (
              <Stat key={s.label} label={s.label} value={NUMBER.format(s.value)} />
            ))}
          </dl>
          <div className="my-5 space-y-4">
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
          <Link
            href="/admin/usuarios"
            className={buttonVariants({ variant: "secondary", size: "sm", className: "mt-auto w-full" })}
          >
            Ver usuarios
          </Link>
        </AdminSection>

        <AdminSection
          title="Respuestas y precisión"
          description="Respuestas por día y porcentaje de aciertos."
          className={TILE.chart}
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
          className={TILE.side}
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
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            <Link href="/admin/flash" className={buttonVariants({ variant: "secondary", size: "sm" })}>
              Cartas
            </Link>
            <Link href="/admin/import" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Importar
            </Link>
          </div>
        </AdminSection>

        <AdminSection
          title="Conceptos más fallados"
          description="Últimos 30 días, con al menos 3 intentos. Buenos candidatos para revisar el contenido."
          className={TILE.half}
        >
          {m.mostMissed.length === 0 ? (
            <p className="text-sm text-[var(--foreground-muted)]">Aún no hay suficientes intentos.</p>
          ) : (
            <div className="-mx-1 overflow-x-auto rounded-xl">
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
                          <ProgressBar value={item.missRate} max={1} tone="danger" className="flex-1" />
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

        <AdminSection
          title="Actividad reciente"
          description="Últimas partidas de estudiantes."
          className={TILE.half}
        >
          {m.recentSessions.length === 0 ? (
            <p className="text-sm text-[var(--foreground-muted)]">Todavía no hay partidas.</p>
          ) : (
            <div className="-mx-1 overflow-x-auto rounded-xl">
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
                          <Badge tone="success">Terminada</Badge>
                        ) : (
                          <Badge tone="warning">Sin terminar</Badge>
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
    </AdminPage>
  );
}

export default async function AdminResumenPage() {
  const metrics = await getAdminMetrics();
  if (!metrics) {
    return (
      <AdminPage title="Resumen">
        <Notice tone="warning" boxed>
          No se pudieron cargar las métricas. Revisa que la API esté arriba y que tu sesión de
          administración siga vigente.
        </Notice>
      </AdminPage>
    );
  }
  return <Overview m={metrics} />;
}

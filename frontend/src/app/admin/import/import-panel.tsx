"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  ImportEntityKind,
  ImportFormat,
  ImportJob,
  ImportJobStatus,
  ImportRowAction,
} from "@aps/shared";
import { cn } from "@/lib/utils";
import {
  detectFormat,
  downloadExport,
  getAdminToken,
  listImportJobs,
  runImport,
  setAdminToken,
} from "@/lib/import-api";
import {
  ADMIN_BUTTON,
  ADMIN_LABEL,
  ADMIN_TABLE,
  ADMIN_TEXTAREA,
  AdminBadge,
  AdminNotice,
  AdminSection,
} from "@/components/admin/admin-ui";
import {
  ADMIN_SELECT,
  AdminStat,
  AdminStatGrid,
  AdminTokenDetails,
  formatAdminDateTime,
  formatRelative,
} from "@/components/admin/admin-metrics";

const STATUS_BADGE: Record<
  ImportJobStatus,
  { label: string; tone: "neutral" | "success" | "danger" }
> = {
  dry_run: { label: "Simulación", tone: "neutral" },
  completed: { label: "Completado", tone: "success" },
  failed: { label: "Fallido", tone: "danger" },
};

const ACTION_BADGE: Record<
  ImportRowAction,
  { label: string; tone: "neutral" | "success" | "accent" | "danger" }
> = {
  create: { label: "Crear", tone: "success" },
  update: { label: "Actualizar", tone: "accent" },
  skip: { label: "Omitir", tone: "neutral" },
  error: { label: "Error", tone: "danger" },
};

const KIND_LABEL: Record<ImportEntityKind, string> = {
  topic: "Tema",
  knowledge: "Carta",
  question: "Pregunta",
};

export function ImportPanel() {
  const [token, setToken] = useState("dev-admin-token");
  const [format, setFormat] = useState<ImportFormat>("json");
  const [filename, setFilename] = useState<string>("");
  const [content, setContent] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastJob, setLastJob] = useState<ImportJob | null>(null);
  const [jobs, setJobs] = useState<ImportJob[]>([]);

  const refreshJobs = useCallback(async () => {
    try {
      const list = await listImportJobs();
      setJobs(list);
    } catch {
      /* API down — leave history empty */
    }
  }, []);

  useEffect(() => {
    setToken(getAdminToken());
    void refreshJobs();
  }, [refreshJobs]);

  const stats = useMemo(() => {
    const real = jobs.filter((j) => !j.dryRun);
    return {
      real: real.length,
      created: real.reduce((sum, j) => sum + j.summary.created, 0),
      updated: real.reduce((sum, j) => sum + j.summary.updated, 0),
      failed: jobs.filter((j) => j.status === "failed").length,
    };
  }, [jobs]);

  async function onFile(file: File | null) {
    if (!file) return;
    const text = await file.text();
    setFilename(file.name);
    setContent(text);
    setFormat(detectFormat(file.name, text));
    setError(null);
  }

  async function onSubmit(forceDryRun?: boolean) {
    setBusy(true);
    setError(null);
    setAdminToken(token);
    try {
      const job = await runImport({
        format,
        content,
        dryRun: forceDryRun ?? dryRun,
        filename: filename || undefined,
      });
      setLastJob(job);
      await refreshJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al importar");
    } finally {
      setBusy(false);
    }
  }

  async function onExport(fmt: ImportFormat) {
    setBusy(true);
    setError(null);
    setAdminToken(token);
    try {
      await downloadExport(fmt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al exportar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminStatGrid>
        <AdminStat label="Trabajos" value={jobs.length} hint={`${stats.real} importaciones reales`} />
        <AdminStat label="Registros creados" value={stats.created} tone="success" />
        <AdminStat label="Registros actualizados" value={stats.updated} />
        <AdminStat
          label="Trabajos fallidos"
          value={stats.failed}
          tone={stats.failed > 0 ? "danger" : "default"}
        />
      </AdminStatGrid>

      {error ? <AdminNotice tone="danger">{error}</AdminNotice> : null}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_minmax(0,20rem)]">
        <AdminSection
          title="Importar"
          description="Pega el contenido o elige un archivo. El formato se detecta al cargarlo."
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer">
                <span className={ADMIN_BUTTON.secondary}>Elegir archivo</span>
                <input
                  type="file"
                  accept=".json,.csv,application/json,text/csv"
                  className="sr-only"
                  onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ImportFormat)}
                aria-label="Formato"
                className={cn(ADMIN_SELECT, "h-9 w-auto")}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
              <label className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="size-4 accent-[var(--accent)]"
                />
                Solo simular
              </label>
              {filename ? (
                <span className="truncate font-mono text-xs text-[var(--foreground-muted)]">
                  {filename}
                </span>
              ) : null}
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              aria-label="Contenido a importar"
              placeholder='JSON: { "topics": [], "knowledgeItems": [], "examQuestions": [] } — o CSV con columna kind'
              className={cn(ADMIN_TEXTAREA, "min-h-64 font-mono text-xs")}
            />

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={ADMIN_BUTTON.secondary}
                disabled={busy || !content.trim()}
                onClick={() => void onSubmit(true)}
              >
                Simular
              </button>
              <button
                type="button"
                className={ADMIN_BUTTON.primary}
                disabled={busy || !content.trim()}
                onClick={() => void onSubmit(false)}
              >
                Importar y guardar
              </button>
            </div>
          </div>
        </AdminSection>

        <AdminSection
          title="Exportar"
          description="Descarga temas, cartas y preguntas actuales."
        >
          <div className="grid gap-2">
            <button
              type="button"
              className={ADMIN_BUTTON.secondary}
              disabled={busy}
              onClick={() => void onExport("json")}
            >
              Descargar JSON
            </button>
            <button
              type="button"
              className={ADMIN_BUTTON.secondary}
              disabled={busy}
              onClick={() => void onExport("csv")}
            >
              Descargar CSV
            </button>
          </div>
        </AdminSection>
      </div>

      {lastJob ? <JobResult job={lastJob} /> : null}

      <AdminSection
        title="Historial"
        description="Trabajos de importación recientes, incluidas las simulaciones."
        actions={
          <button
            type="button"
            className={cn(ADMIN_BUTTON.ghost, "h-8 px-2.5 text-xs")}
            onClick={() => void refreshJobs()}
          >
            Actualizar
          </button>
        }
      >
        {jobs.length === 0 ? (
          <p className="text-sm text-[var(--foreground-muted)]">Sin trabajos todavía.</p>
        ) : (
          <div className={ADMIN_TABLE.wrap}>
            <table className={ADMIN_TABLE.table}>
              <thead className={ADMIN_TABLE.thead}>
                <tr>
                  <th className={ADMIN_TABLE.th}>Fecha</th>
                  <th className={ADMIN_TABLE.th}>Archivo</th>
                  <th className={ADMIN_TABLE.th}>Estado</th>
                  <th className={cn(ADMIN_TABLE.th, "text-right")}>Creados</th>
                  <th className={cn(ADMIN_TABLE.th, "text-right")}>Actualizados</th>
                  <th className={cn(ADMIN_TABLE.th, "text-right")}>Omitidos</th>
                  <th className={cn(ADMIN_TABLE.th, "text-right")}>Errores</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className={ADMIN_TABLE.tr}>
                    <td className={cn(ADMIN_TABLE.td, "whitespace-nowrap")}>
                      <span title={formatAdminDateTime(job.createdAt)}>
                        {formatRelative(job.createdAt)}
                      </span>
                    </td>
                    <td className={ADMIN_TABLE.td}>
                      <p className="font-medium">{job.filename ?? "Contenido pegado"}</p>
                      <p className="text-xs uppercase text-[var(--foreground-muted)]">{job.format}</p>
                    </td>
                    <td className={ADMIN_TABLE.td}>
                      <JobStatusBadge job={job} />
                    </td>
                    <td className={cn(ADMIN_TABLE.td, "text-right")}>{job.summary.created}</td>
                    <td className={cn(ADMIN_TABLE.td, "text-right")}>{job.summary.updated}</td>
                    <td className={cn(ADMIN_TABLE.td, "text-right")}>{job.summary.skipped}</td>
                    <td
                      className={cn(
                        ADMIN_TABLE.td,
                        "text-right",
                        job.summary.errors > 0 && "font-semibold text-red-300",
                      )}
                    >
                      {job.summary.errors}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminSection>

      <AdminTokenDetails value={token} onChange={setToken} />
    </div>
  );
}

function JobStatusBadge({ job }: { job: ImportJob }) {
  const status = STATUS_BADGE[job.status] ?? { label: job.status, tone: "neutral" as const };
  return <AdminBadge tone={status.tone}>{status.label}</AdminBadge>;
}

function JobResult({ job }: { job: ImportJob }) {
  const counts: { label: string; value: number; className?: string }[] = [
    { label: "Creados", value: job.summary.created, className: "text-emerald-300" },
    { label: "Actualizados", value: job.summary.updated },
    { label: "Omitidos", value: job.summary.skipped },
    {
      label: "Errores",
      value: job.summary.errors,
      className: job.summary.errors > 0 ? "text-red-300" : undefined,
    },
  ];

  return (
    <AdminSection
      title={job.dryRun ? "Resultado de la simulación" : "Resultado de la importación"}
      description={
        <span className="font-mono">
          {job.filename ? `${job.filename} · ` : ""}
          {job.id}
        </span>
      }
      actions={<JobStatusBadge job={job} />}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map((c) => (
          <div key={c.label} className="rounded-xl bg-[var(--surface-elevated)] px-4 py-3">
            <p className={ADMIN_LABEL}>{c.label}</p>
            <p className={cn("mt-1 text-xl font-bold tabular-nums", c.className)}>{c.value}</p>
          </div>
        ))}
      </div>

      {job.results.length > 0 ? (
        <div className={cn(ADMIN_TABLE.wrap, "mt-4 max-h-72 overflow-y-auto")}>
          <table className={cn(ADMIN_TABLE.table, "text-xs")}>
            <thead className={cn(ADMIN_TABLE.thead, "sticky top-0")}>
              <tr>
                <th className={ADMIN_TABLE.th}>Tipo</th>
                <th className={ADMIN_TABLE.th}>externalKey</th>
                <th className={ADMIN_TABLE.th}>Acción</th>
                <th className={ADMIN_TABLE.th}>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {job.results.map((r, i) => {
                const action = ACTION_BADGE[r.action] ?? { label: r.action, tone: "neutral" as const };
                return (
                  <tr key={`${r.kind}-${r.externalKey ?? r.id ?? i}`} className={ADMIN_TABLE.tr}>
                    <td className={cn(ADMIN_TABLE.td, "py-1.5")}>{KIND_LABEL[r.kind] ?? r.kind}</td>
                    <td className={cn(ADMIN_TABLE.td, "py-1.5 font-mono")}>{r.externalKey ?? "—"}</td>
                    <td className={cn(ADMIN_TABLE.td, "py-1.5")}>
                      <AdminBadge tone={action.tone}>{action.label}</AdminBadge>
                    </td>
                    <td className={cn(ADMIN_TABLE.td, "py-1.5 text-[var(--foreground-muted)]")}>
                      {r.message}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-[var(--foreground-muted)]">El trabajo no devolvió filas.</p>
      )}
    </AdminSection>
  );
}

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
  listImportJobs,
  runImport,
} from "@/lib/import-api";
import {
  ADMIN_SELECT,
  ADMIN_TABLE,
  ADMIN_TEXTAREA,
  AdminSection,
} from "@/components/admin/admin-ui";
import {
  AdminStat,
  AdminStatGrid,
  formatAdminDateTime,
  formatRelative,
} from "@/components/admin/admin-metrics";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { Stat } from "@/components/ui/stat";

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
          tone={stats.failed > 0 ? "danger" : undefined}
        />
      </AdminStatGrid>

      {error ? (
        <Notice tone="danger" boxed>
          {error}
        </Notice>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-12">
        <AdminSection
          title="Importar"
          description="Pega el contenido o elige un archivo. El formato se detecta al cargarlo."
          className="lg:col-span-8"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <label
                className={buttonVariants({
                  variant: "secondary",
                  className:
                    "cursor-pointer focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--background)]",
                })}
              >
                Elegir archivo
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
                className={cn(ADMIN_SELECT, "h-11 w-auto")}
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
              <Button
                type="button"
                variant="secondary"
                disabled={busy || !content.trim()}
                onClick={() => void onSubmit(true)}
              >
                Simular
              </Button>
              <Button
                type="button"
                disabled={busy || !content.trim()}
                onClick={() => void onSubmit(false)}
              >
                Importar y guardar
              </Button>
            </div>
          </div>
        </AdminSection>

        <AdminSection
          title="Exportar"
          description="Descarga temas, cartas y preguntas actuales."
          className="lg:col-span-4"
        >
          <div className="mt-auto grid gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => void onExport("json")}
            >
              Descargar JSON
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => void onExport("csv")}
            >
              Descargar CSV
            </Button>
          </div>
        </AdminSection>
      </div>

      {lastJob ? <JobResult job={lastJob} /> : null}

      <AdminSection
        title="Historial"
        description="Trabajos de importación recientes, incluidas las simulaciones."
        actions={
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => void refreshJobs()}
          >
            Actualizar
          </Button>
        }
      >
        {jobs.length === 0 ? (
          <p className="text-sm text-[var(--foreground-muted)]">Sin trabajos todavía.</p>
        ) : (
          <div className="-mx-1 overflow-x-auto rounded-xl">
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
                        job.summary.errors > 0 && "font-semibold text-[var(--danger-text)]",
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
    </div>
  );
}

function JobStatusBadge({ job }: { job: ImportJob }) {
  const status = STATUS_BADGE[job.status] ?? { label: job.status, tone: "neutral" as const };
  return <Badge tone={status.tone}>{status.label}</Badge>;
}

function JobResult({ job }: { job: ImportJob }) {
  const counts: { label: string; value: number; tone?: "success" | "danger" }[] = [
    { label: "Creados", value: job.summary.created, tone: "success" },
    { label: "Actualizados", value: job.summary.updated },
    { label: "Omitidos", value: job.summary.skipped },
    {
      label: "Errores",
      value: job.summary.errors,
      tone: job.summary.errors > 0 ? "danger" : undefined,
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
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map((c) => (
          <Stat key={c.label} label={c.label} value={c.value} tone={c.tone} />
        ))}
      </dl>

      {job.results.length > 0 ? (
        <div className="mt-4 max-h-72 overflow-auto rounded-xl">
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
                      <Badge tone={action.tone}>{action.label}</Badge>
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

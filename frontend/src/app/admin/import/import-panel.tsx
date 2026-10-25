"use client";

import { useCallback, useEffect, useState } from "react";
import type { ImportFormat, ImportJob } from "@aps/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  detectFormat,
  downloadExport,
  getAdminToken,
  listImportJobs,
  runImport,
  setAdminToken,
} from "@/lib/import-api";

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
      setError(err instanceof Error ? err.message : "Import failed");
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
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Credencial admin</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Header <code className="text-xs">x-admin-token</code> (env{" "}
          <code className="text-xs">ADMIN_TOKEN</code>, default{" "}
          <code className="text-xs">dev-admin-token</code>).
        </p>
        <Input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          aria-label="Admin token"
          className="max-w-md font-mono text-sm"
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Importar</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          CSV o JSON. Upsert por <code className="text-xs">externalKey</code>.
          Dry-run por defecto; no muta hasta confirmar.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
            <span className="rounded-md border border-zinc-300 px-3 py-2 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
              Elegir archivo
            </span>
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
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
            />
            Dry-run
          </label>
          {filename ? (
            <span className="text-xs text-zinc-500">{filename}</span>
          ) : null}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          placeholder='JSON: { "topics": [], "knowledgeItems": [], "examQuestions": [] } — o CSV con columna kind'
          className="w-full rounded-md border border-zinc-300 bg-white p-3 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-900"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={busy || !content.trim()}
            onClick={() => void onSubmit(true)}
            variant="secondary"
          >
            Dry-run
          </Button>
          <Button
            type="button"
            disabled={busy || !content.trim()}
            onClick={() => void onSubmit(false)}
          >
            Importar de verdad
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Exportar</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => void onExport("json")}
          >
            Descargar JSON
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => void onExport("csv")}
          >
            Descargar CSV
          </Button>
        </div>
      </section>

      {error ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {lastJob ? <JobCard title="Último job" job={lastJob} /> : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Historial de jobs</h2>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => void refreshJobs()}
          >
            Actualizar
          </Button>
        </div>
        {jobs.length === 0 ? (
          <p className="text-sm text-zinc-500">Sin jobs todavía.</p>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <JobCard job={job} compact />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function JobCard({
  job,
  title,
  compact,
}: {
  job: ImportJob;
  title?: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      {title ? (
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {title}
        </h3>
      ) : null}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span>
          <span className="text-zinc-500">status</span> {job.status}
        </span>
        <span>
          <span className="text-zinc-500">format</span> {job.format}
        </span>
        <span>
          <span className="text-zinc-500">dryRun</span>{" "}
          {job.dryRun ? "sí" : "no"}
        </span>
        {job.filename ? (
          <span>
            <span className="text-zinc-500">file</span> {job.filename}
          </span>
        ) : null}
        <span className="font-mono text-xs text-zinc-500">{job.id}</span>
      </div>
      <p className="mt-2 text-sm">
        +{job.summary.created} / ~{job.summary.updated} / skip{" "}
        {job.summary.skipped} / err {job.summary.errors}
      </p>
      {!compact && job.results.length > 0 ? (
        <div className="mt-3 max-h-56 overflow-auto rounded border border-zinc-100 dark:border-zinc-800">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-950">
              <tr>
                <th className="px-2 py-1">kind</th>
                <th className="px-2 py-1">externalKey</th>
                <th className="px-2 py-1">action</th>
                <th className="px-2 py-1">message</th>
              </tr>
            </thead>
            <tbody>
              {job.results.map((r, i) => (
                <tr
                  key={`${r.kind}-${r.externalKey ?? r.id ?? i}`}
                  className="border-t border-zinc-100 dark:border-zinc-800"
                >
                  <td className="px-2 py-1">{r.kind}</td>
                  <td className="px-2 py-1 font-mono">
                    {r.externalKey ?? "—"}
                  </td>
                  <td className="px-2 py-1">{r.action}</td>
                  <td className="px-2 py-1 text-zinc-500">{r.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

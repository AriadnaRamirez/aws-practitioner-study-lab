import type {
  ContentExportBundle,
  ImportFormat,
  ImportJob,
} from "@aps/shared";
import { getApiUrl } from "@/lib/api";

export const ADMIN_TOKEN_KEY = "aps_admin_token";

export function getAdminToken(): string {
  if (typeof window === "undefined") return "dev-admin-token";
  return (
    window.localStorage.getItem(ADMIN_TOKEN_KEY) ??
    process.env.NEXT_PUBLIC_ADMIN_TOKEN ??
    "dev-admin-token"
  );
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join(". ");
    if (typeof body.message === "string") return body.message;
  } catch {
    /* ignore */
  }
  return `Error ${res.status}`;
}

async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("x-admin-token", getAdminToken());
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${getApiUrl()}${path}`, { ...init, headers });
  if (!res.ok) throw new Error(await parseError(res));
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/csv")) {
    return (await res.text()) as T;
  }
  return (await res.json()) as T;
}

export function runImport(body: {
  format: ImportFormat;
  content: string;
  dryRun: boolean;
  filename?: string;
}): Promise<ImportJob> {
  return adminFetch<ImportJob>("/admin/import", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function listImportJobs(): Promise<ImportJob[]> {
  return adminFetch<ImportJob[]>("/admin/import/jobs");
}

export async function downloadExport(format: ImportFormat): Promise<void> {
  const headers = new Headers();
  headers.set("x-admin-token", getAdminToken());
  const res = await fetch(`${getApiUrl()}/admin/export?format=${format}`, {
    headers,
  });
  if (!res.ok) throw new Error(await parseError(res));

  if (format === "csv") {
    const text = await res.text();
    triggerDownload(text, "aps-content-export.csv", "text/csv;charset=utf-8");
    return;
  }

  const json = (await res.json()) as ContentExportBundle;
  triggerDownload(
    JSON.stringify(json, null, 2),
    "aps-content-export.json",
    "application/json",
  );
}

function triggerDownload(body: string, filename: string, mime: string) {
  const blob = new Blob([body], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function detectFormat(filename: string, text: string): ImportFormat {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".csv")) return "csv";
  if (lower.endsWith(".json")) return "json";
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
  return "csv";
}

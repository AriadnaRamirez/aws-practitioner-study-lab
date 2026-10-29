import type { ReactNode } from "react";
import type { ContentStatus } from "@aps/shared";
import { cn } from "@/lib/utils";
import { ADMIN_CARD, ADMIN_INPUT, ADMIN_LABEL, AdminBadge } from "./admin-ui";

/** Native selects render their popup with the OS scheme unless told otherwise. */
export const ADMIN_SELECT = cn(ADMIN_INPUT, "[color-scheme:dark]");

const VALUE_TONES = {
  default: "text-[var(--foreground)]",
  accent: "text-[var(--accent)]",
  success: "text-emerald-300",
  danger: "text-red-300",
} as const;

export function AdminStat({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: keyof typeof VALUE_TONES;
}) {
  return (
    <div className={cn(ADMIN_CARD, "p-4")}>
      <p className={ADMIN_LABEL}>{label}</p>
      <p className={cn("mt-2 text-2xl font-bold tabular-nums", VALUE_TONES[tone])}>
        {value}
      </p>
      {hint ? (
        <p className="mt-1 truncate text-xs text-[var(--foreground-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function AdminStatGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</div>;
}

export const CONTENT_STATUS_LABEL: Record<ContentStatus, string> = {
  published: "Publicada",
  draft: "Borrador",
  archived: "Archivada",
};

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  const tone = status === "published" ? "success" : status === "draft" ? "warning" : "neutral";
  return <AdminBadge tone={tone}>{CONTENT_STATUS_LABEL[status] ?? status}</AdminBadge>;
}

/** Collapsible `x-admin-token` field shared by panels that call token-guarded endpoints. */
export function AdminTokenDetails({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}) {
  return (
    <details className="group rounded-2xl bg-[var(--surface)] px-5 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)] [&::-webkit-details-marker]:hidden">
        Token de administración
        <span aria-hidden className="text-xs transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <label className="mt-3 block max-w-md space-y-1.5">
        <span className={ADMIN_LABEL}>Encabezado x-admin-token</span>
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(ADMIN_INPUT, "font-mono")}
          autoComplete="off"
        />
        <span className="block text-xs text-[var(--foreground-muted)]">
          Valor local por defecto: <code className="font-mono">dev-admin-token</code>
        </span>
      </label>
    </details>
  );
}

const DATE_FMT = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const DATE_TIME_FMT = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** `28 oct 2026` */
export function formatAdminDate(iso: string): string {
  return DATE_FMT.format(new Date(iso)).replace(/\./g, "");
}

/** `28 oct 2026, 14:05` */
export function formatAdminDateTime(iso: string): string {
  return DATE_TIME_FMT.format(new Date(iso)).replace(/\./g, "");
}

/** `hace 2 h`, `hace 3 días`, `Nunca`; dates older than 30 days fall back to the calendar date. */
export function formatRelative(iso: string | null, now: number = Date.now()): string {
  if (!iso) return "Nunca";
  const diff = Math.max(0, now - new Date(iso).getTime());
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "hace un momento";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return d === 1 ? "hace 1 día" : `hace ${d} días`;
  return formatAdminDate(iso);
}

export function formatPercent(rate: number): string {
  return `${Math.round(rate * 1000) / 10}%`;
}

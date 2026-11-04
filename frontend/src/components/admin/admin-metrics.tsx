import type { ReactNode } from "react";
import type { ContentStatus } from "@aps/shared";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";

export function AdminStat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "accent" | "success" | "danger" | "warning";
}) {
  return (
    <Stat
      value={value}
      tone={tone}
      label={
        hint ? (
          <span className="flex min-w-0 flex-col gap-0.5">
            <span>{label}</span>
            <span className="truncate opacity-80">{hint}</span>
          </span>
        ) : (
          label
        )
      }
    />
  );
}

export function AdminStatGrid({ children }: { children: ReactNode }) {
  return (
    <Card padding="sm">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">{children}</dl>
    </Card>
  );
}

const CONTENT_STATUS_LABEL: Record<ContentStatus, string> = {
  published: "Publicada",
  draft: "Borrador",
  archived: "Archivada",
};

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  const tone = status === "published" ? "success" : status === "draft" ? "warning" : "neutral";
  return <Badge tone={tone}>{CONTENT_STATUS_LABEL[status] ?? status}</Badge>;
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

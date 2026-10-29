"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
  FEATURE_FLAG_EXAM_MODES,
  FEATURE_FLAG_EXAM_TRACK_AI,
  type FeatureFlagDto,
} from "@aps/shared";
import { cn } from "@/lib/utils";
import {
  fetchFeatureFlags,
  getAdminToken,
  setAdminToken,
  updateFeatureFlag,
} from "@/lib/flags-api";
import { ADMIN_CARD, AdminBadge, AdminEmpty, AdminNotice } from "./admin-ui";
import {
  AdminStat,
  AdminStatGrid,
  AdminTokenDetails,
  formatAdminDateTime,
  formatRelative,
} from "./admin-metrics";

const FLAG_COPY: Record<string, { title: string; description: string }> = {
  [FEATURE_FLAG_EXAM_TRACK_AI]: {
    title: "Track AWS + IA (AIF)",
    description:
      "Cuando está apagado, los listados públicos ocultan temas, flash y banco con trackId=AIF.",
  },
  [FEATURE_FLAG_EXAM_MODES]: {
    title: "Modos Estudio y Examen",
    description:
      "Apagado = solo Cartas. Oculta las pestañas Estudio y Examen y la API rechaza esas sesiones.",
  },
};

export function FlagsPanel() {
  const [flags, setFlags] = useState<FeatureFlagDto[]>([]);
  const [token, setToken] = useState("dev-admin-token");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();

  const reload = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const data = await fetchFeatureFlags();
        setFlags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar");
      } finally {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    setToken(getAdminToken());
    reload();
  }, [reload]);

  function onTokenBlur() {
    setAdminToken(token.trim() || "dev-admin-token");
  }

  async function toggle(flag: FeatureFlagDto) {
    setError(null);
    setAdminToken(token.trim() || "dev-admin-token");
    try {
      const updated = await updateFeatureFlag(
        flag.key,
        !flag.enabled,
        "admin-ui",
      );
      setFlags((prev) =>
        prev.map((f) => (f.key === updated.key ? updated : f)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    }
  }

  const stats = useMemo(() => {
    const enabled = flags.filter((f) => f.enabled).length;
    const latest = flags.reduce<FeatureFlagDto | null>(
      (acc, f) => (!acc || f.updatedAt > acc.updatedAt ? f : acc),
      null,
    );
    return { enabled, latest };
  }, [flags]);

  if (loading && flags.length === 0) {
    return <AdminEmpty>Cargando banderas…</AdminEmpty>;
  }

  return (
    <div className="space-y-6">
      <AdminStatGrid>
        <AdminStat
          label="Activas"
          value={`${stats.enabled} / ${flags.length}`}
          tone={stats.enabled > 0 ? "success" : "default"}
        />
        <AdminStat label="Apagadas" value={flags.length - stats.enabled} />
        <AdminStat
          label="Último cambio"
          value={stats.latest ? formatRelative(stats.latest.updatedAt) : "—"}
          hint={
            stats.latest
              ? (FLAG_COPY[stats.latest.key]?.title ?? stats.latest.key)
              : undefined
          }
        />
        <AdminStat
          label="Modificado por"
          value={stats.latest?.updatedBy ?? "—"}
        />
      </AdminStatGrid>

      {error ? <AdminNotice tone="danger">{error}</AdminNotice> : null}

      {flags.length === 0 ? (
        <AdminEmpty>
          No hay banderas. Ejecuta <code className="font-mono">npm run db:migrate</code> y{" "}
          <code className="font-mono">npm run db:seed</code>.
        </AdminEmpty>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {flags.map((flag) => {
            const copy = FLAG_COPY[flag.key] ?? {
              title: flag.key,
              description: "Bandera de función",
            };
            return (
              <li
                key={flag.key}
                className={cn(ADMIN_CARD, "flex items-start justify-between gap-4")}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{copy.title}</p>
                    {flag.enabled ? (
                      <AdminBadge tone="success">Activa</AdminBadge>
                    ) : (
                      <AdminBadge>Apagada</AdminBadge>
                    )}
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-[var(--foreground-muted)]">
                    {flag.key}
                  </p>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">
                    {copy.description}
                  </p>
                  <p className="mt-3 text-xs text-[var(--foreground-muted)] tabular-nums">
                    Actualizada {formatAdminDateTime(flag.updatedAt)}
                    {flag.updatedBy ? ` · ${flag.updatedBy}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void toggle(flag)}
                  disabled={pending}
                  aria-pressed={flag.enabled}
                  aria-label={`${flag.enabled ? "Apagar" : "Activar"} ${copy.title}`}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:opacity-50",
                    flag.enabled
                      ? "bg-[var(--accent)] hover:bg-[var(--accent-hover)]"
                      : "bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)]",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "inline-block size-4 rounded-full bg-[var(--foreground)] shadow transition-transform",
                      flag.enabled ? "translate-x-6" : "translate-x-1",
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <AdminTokenDetails value={token} onChange={setToken} onBlur={onTokenBlur} />
    </div>
  );
}

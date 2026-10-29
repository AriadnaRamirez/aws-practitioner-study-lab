"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PodiumResponse, PodiumWindow } from "@aps/shared";
import { cn } from "@/lib/utils";
import { fetchPodium, getStoredToken } from "@/lib/api";
import {
  ADMIN_TABLE,
  AdminBadge,
  AdminEmpty,
  AdminNotice,
  AdminPageHeader,
} from "@/components/admin/admin-ui";
import { AdminStat, AdminStatGrid } from "@/components/admin/admin-metrics";

const WINDOWS: { id: PodiumWindow; label: string; hint: string }[] = [
  { id: "all", label: "Histórico", hint: "Todos los conceptos dominados." },
  { id: "week", label: "Esta semana", hint: "Dominios de los últimos 7 días." },
];

export default function AdminPodioPage() {
  const [window, setWindow] = useState<PodiumWindow>("all");
  const [data, setData] = useState<PodiumResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(true);

  const load = useCallback(async (w: PodiumWindow) => {
    setLoading(true);
    setError(null);
    if (!getStoredToken()) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    try {
      setData(await fetchPodium(w));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el podio");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(window);
  }, [window, load]);

  const hint = WINDOWS.find((w) => w.id === window)?.hint ?? "";

  const stats = useMemo(() => {
    const entries = data?.entries ?? [];
    const leader = entries.find((e) => e.rank === 1) ?? entries[0] ?? null;
    const totalMastered = entries.reduce((sum, e) => sum + e.score, 0);
    return {
      ranked: data?.totalRanked ?? entries.length,
      leader,
      totalMastered,
      average: entries.length > 0 ? totalMastered / entries.length : 0,
    };
  }, [data]);

  const topScore = stats.leader?.score ?? 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Podio"
        description="Ranking completo por conceptos dominados. Los estudiantes solo ven el top 3, a quien tienen justo arriba y su propio lugar; quien oculta su perfil no aparece."
        actions={
          authed ? (
            <div
              className="inline-flex rounded-xl bg-[var(--surface)] p-1"
              role="tablist"
              aria-label="Ventana del podio"
            >
              {WINDOWS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  role="tab"
                  aria-selected={window === w.id}
                  onClick={() => setWindow(w.id)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                    window === w.id
                      ? "bg-[var(--surface-elevated)] text-[var(--foreground)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
                  )}
                >
                  {w.label}
                </button>
              ))}
            </div>
          ) : null
        }
      />

      {!authed ? (
        <AdminNotice tone="warning">
          <Link
            href="/login?next=/admin/podio"
            className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
          >
            Entra como admin
          </Link>{" "}
          para ver el podio completo.
        </AdminNotice>
      ) : (
        <>
          <AdminStatGrid>
            <AdminStat label="Jugadores en ranking" value={loading ? "—" : stats.ranked} hint={hint} />
            <AdminStat
              label="Líder"
              value={loading || !stats.leader ? "—" : `@${stats.leader.username}`}
              tone="accent"
              hint={stats.leader && !loading ? `${stats.leader.score} dominados` : undefined}
            />
            <AdminStat
              label="Conceptos dominados"
              value={loading ? "—" : stats.totalMastered}
              hint="Suma de todo el ranking"
            />
            <AdminStat
              label="Promedio por jugador"
              value={loading ? "—" : stats.average.toFixed(1)}
            />
          </AdminStatGrid>

          {loading ? (
            <AdminEmpty>Cargando podio…</AdminEmpty>
          ) : error ? (
            <AdminNotice tone="danger">{error}</AdminNotice>
          ) : !data || data.entries.length === 0 ? (
            <AdminEmpty>Todavía no hay conceptos dominados en esta ventana.</AdminEmpty>
          ) : (
            <div className={ADMIN_TABLE.wrap}>
              <table className={ADMIN_TABLE.table}>
                <thead className={ADMIN_TABLE.thead}>
                  <tr>
                    <th className={cn(ADMIN_TABLE.th, "w-20")}>Lugar</th>
                    <th className={ADMIN_TABLE.th}>Usuario</th>
                    <th className={cn(ADMIN_TABLE.th, "hidden w-1/3 sm:table-cell")}>
                      Respecto al líder
                    </th>
                    <th className={cn(ADMIN_TABLE.th, "text-right")}>Dominados</th>
                  </tr>
                </thead>
                <tbody>
                  {data.entries.map((entry) => (
                    <tr key={entry.userId} className={ADMIN_TABLE.tr}>
                      <td className={ADMIN_TABLE.td}>
                        {entry.rank <= 3 ? (
                          <AdminBadge tone="accent">#{entry.rank}</AdminBadge>
                        ) : (
                          <span className="text-[var(--foreground-muted)]">#{entry.rank}</span>
                        )}
                      </td>
                      <td className={cn(ADMIN_TABLE.td, "font-semibold")}>@{entry.username}</td>
                      <td className={cn(ADMIN_TABLE.td, "hidden sm:table-cell")}>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                          <div
                            className="h-full rounded-full bg-[var(--accent)]"
                            style={{
                              width: `${topScore > 0 ? Math.round((entry.score / topScore) * 100) : 0}%`,
                            }}
                          />
                        </div>
                      </td>
                      <td className={cn(ADMIN_TABLE.td, "text-right font-semibold")}>
                        {entry.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

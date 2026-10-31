"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PodiumResponse, PodiumWindow } from "@aps/shared";
import { cn } from "@/lib/utils";
import { fetchPodium, getStoredToken } from "@/lib/api";
import { ADMIN_TABLE, AdminEmpty, AdminPage, AdminSkeleton } from "@/components/admin/admin-ui";
import { AdminStat, AdminStatGrid } from "@/components/admin/admin-metrics";
import { Badge } from "@/components/ui/badge";
import { FOCUS_RING } from "@/components/ui/focus";
import { Notice } from "@/components/ui/notice";
import { ProgressBar } from "@/components/ui/progress";
import { segmentedItem, segmentedList } from "@/components/ui/segmented";

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
    <AdminPage
      title="Podio"
      description="Ranking completo por conceptos dominados. Los estudiantes solo ven el top 3, a quien tienen justo arriba y su propio lugar; quien oculta su perfil no aparece."
      actions={
        authed ? (
          <div className={segmentedList} role="tablist" aria-label="Ventana del podio">
            {WINDOWS.map((w) => (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={window === w.id}
                onClick={() => setWindow(w.id)}
                className={segmentedItem(window === w.id)}
              >
                {w.label}
              </button>
            ))}
          </div>
        ) : null
      }
    >
      {!authed ? (
        <Notice tone="warning" boxed>
          <Link
            href="/login?next=/admin/podio"
            className={cn("rounded-sm font-semibold underline underline-offset-2", FOCUS_RING)}
          >
            Entra como admin
          </Link>{" "}
          para ver el podio completo.
        </Notice>
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
            <AdminSkeleton message="Cargando el ranking del podio…" />
          ) : error ? (
            <Notice tone="danger" boxed>
              {error}
            </Notice>
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
                          <Badge tone="accent">#{entry.rank}</Badge>
                        ) : (
                          <span className="text-[var(--foreground-muted)]">#{entry.rank}</span>
                        )}
                      </td>
                      <td className={cn(ADMIN_TABLE.td, "font-semibold")}>@{entry.username}</td>
                      <td className={cn(ADMIN_TABLE.td, "hidden sm:table-cell")}>
                        <ProgressBar value={entry.score} max={topScore} />
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
    </AdminPage>
  );
}

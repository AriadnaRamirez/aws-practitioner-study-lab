"use client";

import { useMemo, useState } from "react";
import type { AdminUserRow } from "@aps/shared";
import { cn } from "@/lib/utils";
import { resetAdminUserPassword, updateAdminUser } from "@/lib/admin-users-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import { ADMIN_SELECT, ADMIN_TABLE, AdminEmpty } from "./admin-ui";
import {
  AdminStat,
  AdminStatGrid,
  formatAdminDate,
  formatRelative,
} from "./admin-metrics";

type Props = {
  initialUsers: AdminUserRow[];
};

type SortKey = "activity" | "mastered" | "created";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function time(iso: string | null | undefined): number {
  return iso ? new Date(iso).getTime() : 0;
}

export function UsersPanel({ initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState<string | null>(null);
  const [tempPass, setTempPass] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("activity");
  const [now] = useState(() => Date.now());

  const stats = useMemo(() => {
    const studentRows = users.filter((u) => u.role === "STUDENT");
    const active7d = studentRows.filter(
      (u) => u.lastActiveAt && now - time(u.lastActiveAt) <= WEEK_MS,
    ).length;
    const neverStudied = studentRows.filter((u) => !u.lastActiveAt).length;
    const banned = users.filter((u) => u.bannedAt).length;
    return { students: studentRows.length, active7d, neverStudied, banned };
  }, [users, now]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? users.filter(
          (u) =>
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        )
      : users;
    return [...filtered].sort((a, b) => {
      if (sort === "mastered") return (b.masteredCount ?? 0) - (a.masteredCount ?? 0);
      if (sort === "created") return time(b.createdAt) - time(a.createdAt);
      return time(b.lastActiveAt) - time(a.lastActiveAt);
    });
  }, [users, query, sort]);

  async function toggleHidden(user: AdminUserRow) {
    setError(null);
    setBusyId(user.id);
    try {
      const updated = await updateAdminUser(user.id, {
        podiumHidden: !user.podiumHidden,
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleBan(user: AdminUserRow) {
    setError(null);
    setBusyId(user.id);
    try {
      const updated = await updateAdminUser(user.id, {
        banned: !user.bannedAt,
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al suspender");
    } finally {
      setBusyId(null);
    }
  }

  async function onReset(user: AdminUserRow) {
    if (
      !window.confirm(
        `¿Generar contraseña temporal para @${user.username}?`,
      )
    ) {
      return;
    }
    setError(null);
    setTempPass(null);
    setBusyId(user.id);
    try {
      const res = await resetAdminUserPassword(user.id);
      setTempPass(`@${res.username}: ${res.temporaryPassword}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al restablecer");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminStatGrid>
        <AdminStat
          label="Estudiantes"
          value={stats.students}
          hint={`${users.length} cuentas en total`}
        />
        <AdminStat
          label="Activos 7 días"
          value={stats.active7d}
          tone="success"
          hint="Estudiaron en la última semana"
        />
        <AdminStat
          label="Sin actividad"
          value={stats.neverStudied}
          hint="Nunca han estudiado"
        />
        <AdminStat
          label="Suspendidos"
          value={stats.banned}
          tone={stats.banned > 0 ? "danger" : undefined}
        />
      </AdminStatGrid>

      {error ? (
        <Notice tone="danger" boxed>
          {error}
        </Notice>
      ) : null}
      {tempPass ? (
        <Notice tone="warning" boxed>
          Contraseña temporal (cópiala ahora):{" "}
          <span className="font-mono font-semibold">{tempPass}</span>
        </Notice>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por usuario o correo…"
          aria-label="Buscar usuarios"
          className="sm:max-w-sm"
        />
        <label className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] sm:ml-auto">
          Ordenar por
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={cn(ADMIN_SELECT, "w-auto")}
          >
            <option value="activity">Última actividad</option>
            <option value="mastered">Dominados</option>
            <option value="created">Registro</option>
          </select>
        </label>
      </div>

      {users.length === 0 ? (
        <AdminEmpty>Sin usuarios o la API no está disponible.</AdminEmpty>
      ) : visible.length === 0 ? (
        <AdminEmpty>Ningún usuario coincide con “{query}”.</AdminEmpty>
      ) : (
        <div className={ADMIN_TABLE.wrap}>
          <table className={ADMIN_TABLE.table}>
            <thead className={ADMIN_TABLE.thead}>
              <tr>
                <th className={ADMIN_TABLE.th}>Usuario</th>
                <th className={ADMIN_TABLE.th}>Rol</th>
                <th className={cn(ADMIN_TABLE.th, "text-right")}>Partidas</th>
                <th className={cn(ADMIN_TABLE.th, "text-right")}>Dominados</th>
                <th className={cn(ADMIN_TABLE.th, "text-right")}>Racha</th>
                <th className={ADMIN_TABLE.th}>Última actividad</th>
                <th className={ADMIN_TABLE.th}>Registro</th>
                <th className={ADMIN_TABLE.th}>Estado</th>
                <th className={ADMIN_TABLE.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u.id} className={ADMIN_TABLE.tr}>
                  <td className={ADMIN_TABLE.td}>
                    <p className="font-semibold">@{u.username}</p>
                    <p className="text-xs text-[var(--foreground-muted)]">{u.email}</p>
                  </td>
                  <td className={ADMIN_TABLE.td}>
                    {u.role === "ADMIN" ? (
                      <Badge tone="accent">Admin</Badge>
                    ) : (
                      <Badge>Estudiante</Badge>
                    )}
                  </td>
                  <td className={cn(ADMIN_TABLE.td, "text-right")}>{u.sessionsTotal ?? 0}</td>
                  <td className={cn(ADMIN_TABLE.td, "text-right")}>{u.masteredCount ?? 0}</td>
                  <td className={cn(ADMIN_TABLE.td, "text-right")}>
                    {u.currentStreak ?? 0}
                    <span className="ml-1 text-xs text-[var(--foreground-muted)]">d</span>
                  </td>
                  <td className={cn(ADMIN_TABLE.td, "whitespace-nowrap")}>
                    <span
                      suppressHydrationWarning
                      title={u.lastActiveAt ? formatAdminDate(u.lastActiveAt) : undefined}
                      className={u.lastActiveAt ? undefined : "text-[var(--foreground-muted)]"}
                    >
                      {formatRelative(u.lastActiveAt, now)}
                    </span>
                  </td>
                  <td
                    className={cn(ADMIN_TABLE.td, "whitespace-nowrap text-[var(--foreground-muted)]")}
                    suppressHydrationWarning
                  >
                    {formatAdminDate(u.createdAt)}
                  </td>
                  <td className={ADMIN_TABLE.td}>
                    <div className="flex gap-1 whitespace-nowrap">
                      {u.bannedAt ? (
                        <Badge tone="danger">Suspendido</Badge>
                      ) : (
                        <Badge tone="success">Activo</Badge>
                      )}
                      {u.podiumHidden ? (
                        <Badge tone="warning">Oculto del podio</Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className={ADMIN_TABLE.td}>
                    <div className="flex gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        disabled={busyId === u.id}
                        onClick={() => void toggleHidden(u)}
                      >
                        {u.podiumHidden ? "Mostrar en podio" : "Ocultar del podio"}
                      </Button>
                      <Button
                        type="button"
                        variant={u.bannedAt ? "secondary" : "danger"}
                        size="xs"
                        disabled={busyId === u.id || u.role === "ADMIN"}
                        onClick={() => void toggleBan(u)}
                      >
                        {u.bannedAt ? "Reactivar" : "Suspender"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        disabled={busyId === u.id}
                        onClick={() => void onReset(u)}
                      >
                        Restablecer contraseña
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

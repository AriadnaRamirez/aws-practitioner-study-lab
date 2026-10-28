"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminUserRow } from "@aps/shared";
import { Button } from "@/components/ui/button";
import {
  getAdminToken,
  resetAdminUserPassword,
  setAdminToken,
  updateAdminUser,
} from "@/lib/admin-users-api";

type Props = {
  initialUsers: AdminUserRow[];
};

export function UsersPanel({ initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers);
  const [token, setToken] = useState("dev-admin-token");
  const [error, setError] = useState<string | null>(null);
  const [tempPass, setTempPass] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setToken(getAdminToken());
  }, []);

  const withToken = useCallback(() => {
    setAdminToken(token.trim() || "dev-admin-token");
  }, [token]);

  async function toggleHidden(user: AdminUserRow) {
    setError(null);
    setBusyId(user.id);
    withToken();
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
    withToken();
    try {
      const updated = await updateAdminUser(user.id, {
        banned: !user.bannedAt,
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al banear");
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
    withToken();
    try {
      const res = await resetAdminUserPassword(user.id);
      setTempPass(`@${res.username}: ${res.temporaryPassword}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al resetear");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block max-w-md space-y-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          Token admin (`x-admin-token`)
        </span>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onBlur={withToken}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          autoComplete="off"
        />
      </label>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      {tempPass ? (
        <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 font-mono text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          Contraseña temporal (cópiala ahora): {tempPass}
        </p>
      ) : null}

      {users.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
          Sin usuarios o API inaccesible.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900">
              <tr>
                <th className="px-3 py-2 font-medium">Usuario</th>
                <th className="px-3 py-2 font-medium">Correo</th>
                <th className="px-3 py-2 font-medium">Rol</th>
                <th className="px-3 py-2 font-medium">Estado</th>
                <th className="px-3 py-2 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="px-3 py-2 font-medium">@{u.username}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.role}</td>
                  <td className="px-3 py-2 text-xs">
                    {u.bannedAt ? (
                      <span className="text-red-600">baneado</span>
                    ) : (
                      <span className="text-emerald-700">activo</span>
                    )}
                    {u.podiumHidden ? " · oculto podio" : null}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={busyId === u.id}
                        onClick={() => void toggleHidden(u)}
                      >
                        {u.podiumHidden ? "Mostrar podio" : "Ocultar podio"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={busyId === u.id || u.role === "ADMIN"}
                        onClick={() => void toggleBan(u)}
                      >
                        {u.bannedAt ? "Rehabilitar" : "Ban"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={busyId === u.id}
                        onClick={() => void onReset(u)}
                      >
                        Reset pass
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

"use client";

import { useMemo, useState } from "react";
import type { Topic } from "@aps/shared";
import { cn } from "@/lib/utils";
import {
  createTopic,
  deleteTopic,
  updateTopic,
} from "@/lib/admin-content-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import {
  ADMIN_SELECT,
  ADMIN_TABLE,
  AdminEmpty,
  AdminSection,
  FIELD_LABEL,
} from "./admin-ui";
import { AdminStat, AdminStatGrid } from "./admin-metrics";

type Props = { initial: Topic[] };

const TYPE_LABEL: Record<Topic["type"], string> = {
  SERVICE: "Servicio",
  CONCEPT: "Concepto",
};

export function TopicsCrud({ initial }: Props) {
  const [rows, setRows] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [trackId, setTrackId] = useState("CLF");
  const [type, setType] = useState<Topic["type"]>("SERVICE");
  const [sortOrder, setSortOrder] = useState(100);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const sorted = useMemo(
    () => [...rows].sort((a, b) => a.sortOrder - b.sortOrder),
    [rows],
  );

  const stats = useMemo(
    () => ({
      clf: rows.filter((t) => t.trackId === "CLF").length,
      aif: rows.filter((t) => t.trackId === "AIF").length,
      services: rows.filter((t) => t.type === "SERVICE").length,
    }),
    [rows],
  );

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const row = await createTopic({ name, trackId, type, sortOrder });
      setRows((prev) => [...prev, row]);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear");
    } finally {
      setBusy(false);
    }
  }

  async function onSaveEdit(id: string) {
    setError(null);
    setBusy(true);
    try {
      const row = await updateTopic(id, { name: editName });
      setRows((prev) => prev.map((r) => (r.id === id ? row : r)));
      setEditId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (
      !window.confirm(
        "¿Borrar este tema? (fallará si tiene conceptos asociados)",
      )
    )
      return;
    setError(null);
    setBusy(true);
    try {
      await deleteTopic(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al borrar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <AdminStatGrid>
        <AdminStat label="Temas" value={rows.length} />
        <AdminStat label="Track CLF" value={stats.clf} />
        <AdminStat label="Track AIF" value={stats.aif} tone="accent" />
        <AdminStat
          label="Servicios / conceptos"
          value={`${stats.services} / ${rows.length - stats.services}`}
        />
      </AdminStatGrid>

      {error ? (
        <Notice tone="danger" boxed>
          {error}
        </Notice>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <AdminSection title="Nuevo tema" description="Se agrega al final del orden indicado.">
          <form onSubmit={onCreate} className="grid gap-4">
            <label className="grid gap-1.5">
              <span className={FIELD_LABEL}>Nombre</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5">
                <span className={FIELD_LABEL}>Track</span>
                <select
                  className={ADMIN_SELECT}
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                >
                  <option value="CLF">CLF</option>
                  <option value="AIF">AIF</option>
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className={FIELD_LABEL}>Tipo</span>
                <select
                  className={ADMIN_SELECT}
                  value={type}
                  onChange={(e) => setType(e.target.value as Topic["type"])}
                >
                  <option value="SERVICE">Servicio</option>
                  <option value="CONCEPT">Concepto</option>
                </select>
              </label>
            </div>
            <label className="grid gap-1.5">
              <span className={FIELD_LABEL}>Orden</span>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="tabular-nums"
              />
            </label>
            <Button type="submit" disabled={busy}>
              Crear tema
            </Button>
          </form>
        </AdminSection>

        {sorted.length === 0 ? (
          <AdminEmpty>Todavía no hay temas.</AdminEmpty>
        ) : (
          <div className={ADMIN_TABLE.wrap}>
            <table className={ADMIN_TABLE.table}>
              <thead className={ADMIN_TABLE.thead}>
                <tr>
                  <th className={ADMIN_TABLE.th}>Nombre</th>
                  <th className={ADMIN_TABLE.th}>Track</th>
                  <th className={ADMIN_TABLE.th}>Tipo</th>
                  <th className={cn(ADMIN_TABLE.th, "text-right")}>Orden</th>
                  <th className={ADMIN_TABLE.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((t) => (
                  <tr key={t.id} className={ADMIN_TABLE.tr}>
                    <td className={cn(ADMIN_TABLE.td, "min-w-48")}>
                      {editId === t.id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          aria-label="Nombre del tema"
                          className="h-8 px-3"
                        />
                      ) : (
                        <span className="font-semibold">{t.name}</span>
                      )}
                    </td>
                    <td className={ADMIN_TABLE.td}>
                      <Badge tone={t.trackId === "AIF" ? "accent" : "neutral"}>
                        {t.trackId}
                      </Badge>
                    </td>
                    <td className={cn(ADMIN_TABLE.td, "text-[var(--foreground-muted)]")}>
                      {TYPE_LABEL[t.type] ?? t.type}
                    </td>
                    <td className={cn(ADMIN_TABLE.td, "text-right")}>{t.sortOrder}</td>
                    <td className={ADMIN_TABLE.td}>
                      <div className="flex gap-1.5">
                        {editId === t.id ? (
                          <>
                            <Button
                              type="button"
                              variant="soft"
                              size="xs"
                              disabled={busy}
                              onClick={() => void onSaveEdit(t.id)}
                            >
                              Guardar
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              onClick={() => setEditId(null)}
                            >
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            onClick={() => {
                              setEditId(t.id);
                              setEditName(t.name);
                            }}
                          >
                            Editar
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="danger"
                          size="xs"
                          disabled={busy}
                          onClick={() => void onDelete(t.id)}
                        >
                          Borrar
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
    </div>
  );
}

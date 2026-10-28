"use client";

import { useMemo, useState } from "react";
import type { Topic } from "@aps/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createTopic,
  deleteTopic,
  updateTopic,
} from "@/lib/admin-content-api";

type Props = { initial: Topic[] };

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
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <form
        onSubmit={onCreate}
        className="grid gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 sm:grid-cols-2"
      >
        <h2 className="sm:col-span-2 text-sm font-semibold">Nuevo tema</h2>
        <label className="text-sm">
          Nombre
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1"
          />
        </label>
        <label className="text-sm">
          Track
          <select
            className="mt-1 flex h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
          >
            <option value="CLF">CLF</option>
            <option value="AIF">AIF</option>
          </select>
        </label>
        <label className="text-sm">
          Tipo
          <select
            className="mt-1 flex h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={type}
            onChange={(e) => setType(e.target.value as Topic["type"])}
          >
            <option value="SERVICE">SERVICE</option>
            <option value="CONCEPT">CONCEPT</option>
          </select>
        </label>
        <label className="text-sm">
          Orden
          <Input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="mt-1"
          />
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>
            Crear tema
          </Button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Track</th>
              <th className="px-3 py-2">Tipo</th>
              <th className="px-3 py-2">Orden</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => (
              <tr
                key={t.id}
                className="border-t border-zinc-200 dark:border-zinc-800"
              >
                <td className="px-3 py-2">
                  {editId === t.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    <span className="font-medium">{t.name}</span>
                  )}
                </td>
                <td className="px-3 py-2">{t.trackId}</td>
                <td className="px-3 py-2">{t.type}</td>
                <td className="px-3 py-2">{t.sortOrder}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    {editId === t.id ? (
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() => void onSaveEdit(t.id)}
                      >
                        Guardar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditId(t.id);
                          setEditName(t.name);
                        }}
                      >
                        Editar
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
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
    </div>
  );
}

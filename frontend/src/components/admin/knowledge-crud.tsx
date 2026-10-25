"use client";

import { useState } from "react";
import type { KnowledgeItem, Topic } from "@aps/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createKnowledge,
  deleteKnowledge,
  updateKnowledge,
} from "@/lib/admin-content-api";

type Props = { initial: KnowledgeItem[]; topics: Topic[] };

export function KnowledgeCrud({ initial, topics }: Props) {
  const [rows, setRows] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [definition, setDefinition] = useState("");
  const [explanation, setExplanation] = useState("");
  const [distractors, setDistractors] = useState("A, B, C");
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "");
  const [trackId, setTrackId] = useState(topics[0]?.trackId ?? "CLF");
  const [status, setStatus] = useState<KnowledgeItem["status"]>("published");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const dists = distractors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const row = await createKnowledge({
        topicId,
        trackId,
        name,
        definition,
        explanation,
        distractors: dists,
        allowedVariants: [
          "NAME_TO_DEFINITION",
          "DEFINITION_TO_NAME",
          "NAME_FOCUS",
        ],
        status,
        externalKey: null,
      });
      setRows((prev) => [...prev, row]);
      setName("");
      setDefinition("");
      setExplanation("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear");
    } finally {
      setBusy(false);
    }
  }

  async function onToggleStatus(item: KnowledgeItem) {
    setBusy(true);
    setError(null);
    try {
      const next = item.status === "published" ? "draft" : "published";
      const row = await updateKnowledge(item.id, { status: next });
      setRows((prev) => prev.map((r) => (r.id === item.id ? row : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("¿Borrar este ítem flash?")) return;
    setBusy(true);
    try {
      await deleteKnowledge(id);
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
        <h2 className="sm:col-span-2 text-sm font-semibold">Nuevo flash</h2>
        <label className="text-sm sm:col-span-2">
          Nombre
          <Input
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Definición
          <Input
            className="mt-1"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            required
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Explicación
          <Input
            className="mt-1"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
          />
        </label>
        <label className="text-sm sm:col-span-2">
          Distractores (coma)
          <Input
            className="mt-1"
            value={distractors}
            onChange={(e) => setDistractors(e.target.value)}
            required
          />
        </label>
        <label className="text-sm">
          Tema
          <select
            className="mt-1 flex h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={topicId}
            onChange={(e) => {
              const id = e.target.value;
              setTopicId(id);
              const t = topics.find((x) => x.id === id);
              if (t) setTrackId(t.trackId);
            }}
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.trackId})
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Status
          <select
            className="mt-1 flex h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as KnowledgeItem["status"])
            }
          >
            <option value="published">published</option>
            <option value="draft">draft</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy || !topicId}>
            Crear flash
          </Button>
        </div>
      </form>

      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {rows.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">
                {item.name}{" "}
                <span className="text-xs font-normal text-zinc-500">
                  {item.trackId} · {item.status}
                </span>
              </p>
              <p className="text-xs text-zinc-500 line-clamp-2">
                {item.definition}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                disabled={busy}
                onClick={() => void onToggleStatus(item)}
              >
                {item.status === "published" ? "A draft" : "Publicar"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => void onDelete(item.id)}
              >
                Borrar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

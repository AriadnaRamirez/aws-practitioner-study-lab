"use client";

import { useState } from "react";
import type { ExamChoices, ExamQuestion, Topic } from "@aps/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from "@/lib/admin-content-api";

type Props = { initial: ExamQuestion[]; topics: Topic[] };

export function QuestionsCrud({ initial, topics }: Props) {
  const [rows, setRows] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [stem, setStem] = useState("");
  const [explanation, setExplanation] = useState("");
  const [c0, setC0] = useState("");
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [c3, setC3] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "");
  const [trackId, setTrackId] = useState(topics[0]?.trackId ?? "CLF");
  const [status, setStatus] = useState<ExamQuestion["status"]>("published");
  const [filter, setFilter] = useState("");

  const visible = filter
    ? rows.filter((q) =>
        q.stem.toLowerCase().includes(filter.toLowerCase()),
      )
    : rows;

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const choices = [c0, c1, c2, c3] as ExamChoices;
      const row = await createQuestion({
        topicId,
        trackId,
        stem,
        choices,
        correctIndex: correctIndex as 0 | 1 | 2 | 3,
        explanation,
        status,
        externalKey: null,
      });
      setRows((prev) => [...prev, row]);
      setStem("");
      setExplanation("");
      setC0("");
      setC1("");
      setC2("");
      setC3("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear");
    } finally {
      setBusy(false);
    }
  }

  async function onToggle(item: ExamQuestion) {
    setBusy(true);
    try {
      const next = item.status === "published" ? "draft" : "published";
      const row = await updateQuestion(item.id, { status: next });
      setRows((prev) => prev.map((r) => (r.id === item.id ? row : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("¿Borrar pregunta?")) return;
    setBusy(true);
    try {
      await deleteQuestion(id);
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
        className="grid gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <h2 className="text-sm font-semibold">Nueva pregunta (opción múltiple)</h2>
        <label className="text-sm">
          Stem
          <Input
            className="mt-1"
            value={stem}
            onChange={(e) => setStem(e.target.value)}
            required
          />
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            [c0, setC0, "Opción 0"],
            [c1, setC1, "Opción 1"],
            [c2, setC2, "Opción 2"],
            [c3, setC3, "Opción 3"],
          ].map(([val, set, label], i) => (
            <label key={String(label)} className="text-sm">
              {String(label)}
              <Input
                className="mt-1"
                value={val as string}
                onChange={(e) =>
                  (set as (v: string) => void)(e.target.value)
                }
                required
              />
              <span className="ml-2 text-xs text-zinc-500">
                <input
                  type="radio"
                  name="correct"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                />{" "}
                correcta
              </span>
            </label>
          ))}
        </div>
        <label className="text-sm">
          Explicación
          <Input
            className="mt-1"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            required
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
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
                setStatus(e.target.value as ExamQuestion["status"])
              }
            >
              <option value="published">published</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
            </select>
          </label>
        </div>
        <Button type="submit" disabled={busy || !topicId}>
          Crear pregunta
        </Button>
      </form>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          {rows.length} preguntas · mostrando {visible.length}
        </p>
        <Input
          placeholder="Filtrar…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <ul className="max-h-[32rem] space-y-2 overflow-y-auto">
        {visible.slice(0, 80).map((q) => (
          <li
            key={q.id}
            className="rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-medium">
                {q.stem}{" "}
                <span className="text-xs font-normal text-zinc-500">
                  {q.trackId} · {q.status}
                </span>
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => void onToggle(q)}
                >
                  {q.status === "published" ? "A draft" : "Publicar"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => void onDelete(q.id)}
                >
                  Borrar
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {visible.length > 80 ? (
        <p className="text-xs text-zinc-500">
          Mostrando 80 de {visible.length}. Usa el filtro para acotar.
        </p>
      ) : null}
    </div>
  );
}

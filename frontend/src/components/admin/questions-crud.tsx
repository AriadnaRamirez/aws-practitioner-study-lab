"use client";

import { useMemo, useState } from "react";
import type { ExamChoices, ExamQuestion, Topic } from "@aps/shared";
import { cn } from "@/lib/utils";
import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from "@/lib/admin-content-api";
import {
  ADMIN_BUTTON,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_TABLE,
  ADMIN_TEXTAREA,
  AdminBadge,
  AdminEmpty,
  AdminNotice,
  AdminSection,
} from "./admin-ui";
import {
  ADMIN_SELECT,
  AdminStat,
  AdminStatGrid,
  ContentStatusBadge,
} from "./admin-metrics";

type Props = { initial: ExamQuestion[]; topics: Topic[] };

const ROW_BUTTON = "h-8 px-2.5 text-xs";
const MAX_VISIBLE = 80;

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

  const topicName = useMemo(
    () => new Map(topics.map((t) => [t.id, t.name])),
    [topics],
  );

  const stats = useMemo(
    () => ({
      published: rows.filter((r) => r.status === "published").length,
      draft: rows.filter((r) => r.status === "draft").length,
      aif: rows.filter((r) => r.trackId === "AIF").length,
    }),
    [rows],
  );

  const choiceFields: [string, (v: string) => void][] = [
    [c0, setC0],
    [c1, setC1],
    [c2, setC2],
    [c3, setC3],
  ];

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
      <AdminStatGrid>
        <AdminStat label="Preguntas" value={rows.length} />
        <AdminStat label="Publicadas" value={stats.published} tone="success" />
        <AdminStat label="Borrador" value={stats.draft} />
        <AdminStat label="Track AIF" value={stats.aif} tone="accent" />
      </AdminStatGrid>

      {error ? <AdminNotice tone="danger">{error}</AdminNotice> : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <AdminSection title="Nueva pregunta" description="Opción múltiple: marca la respuesta correcta.">
          <form onSubmit={onCreate} className="grid gap-4">
            <label className="grid gap-1.5">
              <span className={ADMIN_LABEL}>Enunciado</span>
              <textarea
                className={cn(ADMIN_TEXTAREA, "min-h-20")}
                value={stem}
                onChange={(e) => setStem(e.target.value)}
                required
              />
            </label>
            <fieldset className="grid gap-2">
              <legend className={cn(ADMIN_LABEL, "mb-1.5")}>Opciones</legend>
              {choiceFields.map(([val, set], i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                    aria-label={`Opción ${String.fromCharCode(65 + i)} es la correcta`}
                    className="size-4 shrink-0 accent-[var(--accent)]"
                  />
                  <input
                    className={ADMIN_INPUT}
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                    aria-label={`Opción ${String.fromCharCode(65 + i)}`}
                    required
                  />
                </div>
              ))}
              <p className="text-xs text-[var(--foreground-muted)]">
                Correcta: opción {String.fromCharCode(65 + correctIndex)}
              </p>
            </fieldset>
            <label className="grid gap-1.5">
              <span className={ADMIN_LABEL}>Explicación</span>
              <textarea
                className={cn(ADMIN_TEXTAREA, "min-h-20")}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className={ADMIN_LABEL}>Tema</span>
              <select
                className={ADMIN_SELECT}
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
            <label className="grid gap-1.5">
              <span className={ADMIN_LABEL}>Estado</span>
              <select
                className={ADMIN_SELECT}
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ExamQuestion["status"])
                }
              >
                <option value="published">Publicada</option>
                <option value="draft">Borrador</option>
                <option value="archived">Archivada</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={busy || !topicId}
              className={ADMIN_BUTTON.primary}
            >
              Crear pregunta
            </button>
          </form>
        </AdminSection>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--foreground-muted)] tabular-nums">
              {rows.length} preguntas · mostrando {Math.min(visible.length, MAX_VISIBLE)}
            </p>
            <input
              type="search"
              placeholder="Filtrar por enunciado…"
              aria-label="Filtrar preguntas"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={cn(ADMIN_INPUT, "sm:max-w-xs")}
            />
          </div>

          {visible.length === 0 ? (
            <AdminEmpty>
              {rows.length === 0 ? "Todavía no hay preguntas." : "Ninguna pregunta coincide con el filtro."}
            </AdminEmpty>
          ) : (
            <div className={cn(ADMIN_TABLE.wrap, "max-h-[40rem] overflow-y-auto")}>
              <table className={ADMIN_TABLE.table}>
                <thead className={cn(ADMIN_TABLE.thead, "sticky top-0 z-10")}>
                  <tr>
                    <th className={ADMIN_TABLE.th}>Pregunta</th>
                    <th className={ADMIN_TABLE.th}>Tema</th>
                    <th className={ADMIN_TABLE.th}>Estado</th>
                    <th className={ADMIN_TABLE.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.slice(0, MAX_VISIBLE).map((q) => (
                    <tr key={q.id} className={ADMIN_TABLE.tr}>
                      <td className={cn(ADMIN_TABLE.td, "min-w-72 max-w-xl")}>
                        <p className="line-clamp-2 font-medium">{q.stem}</p>
                      </td>
                      <td className={ADMIN_TABLE.td}>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <AdminBadge tone={q.trackId === "AIF" ? "accent" : "neutral"}>
                            {q.trackId}
                          </AdminBadge>
                          <span className="text-xs text-[var(--foreground-muted)]">
                            {topicName.get(q.topicId) ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className={ADMIN_TABLE.td}>
                        <ContentStatusBadge status={q.status} />
                      </td>
                      <td className={ADMIN_TABLE.td}>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            className={cn(ADMIN_BUTTON.secondary, ROW_BUTTON)}
                            disabled={busy}
                            onClick={() => void onToggle(q)}
                          >
                            {q.status === "published" ? "Pasar a borrador" : "Publicar"}
                          </button>
                          <button
                            type="button"
                            className={cn(ADMIN_BUTTON.danger, ROW_BUTTON)}
                            disabled={busy}
                            onClick={() => void onDelete(q.id)}
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {visible.length > MAX_VISIBLE ? (
            <p className="text-xs text-[var(--foreground-muted)] tabular-nums">
              Mostrando {MAX_VISIBLE} de {visible.length}. Usa el filtro para acotar.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

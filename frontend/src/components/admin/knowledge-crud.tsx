"use client";

import { useMemo, useState } from "react";
import type { KnowledgeItem, Topic } from "@aps/shared";
import { cn } from "@/lib/utils";
import {
  createKnowledge,
  deleteKnowledge,
  updateKnowledge,
} from "@/lib/admin-content-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/ui/notice";
import {
  ADMIN_SELECT,
  ADMIN_TABLE,
  ADMIN_TEXTAREA,
  AdminEmpty,
  AdminSection,
  FIELD_LABEL,
} from "./admin-ui";
import { AdminStat, AdminStatGrid, ContentStatusBadge } from "./admin-metrics";

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
  const [filter, setFilter] = useState("");

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

  const visible = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.definition.toLowerCase().includes(q),
    );
  }, [rows, filter]);

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
    if (!window.confirm("¿Borrar esta carta flash?")) return;
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
      <AdminStatGrid>
        <AdminStat label="Cartas" value={rows.length} />
        <AdminStat label="Publicadas" value={stats.published} tone="success" />
        <AdminStat label="Borrador" value={stats.draft} />
        <AdminStat label="Track AIF" value={stats.aif} tone="accent" />
      </AdminStatGrid>

      {error ? (
        <Notice tone="danger" boxed>
          {error}
        </Notice>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <AdminSection title="Nueva carta" description="Se usan las tres variantes de pregunta.">
          <form onSubmit={onCreate} className="grid gap-4">
            <label className="grid gap-1.5">
              <span className={FIELD_LABEL}>Nombre</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className={FIELD_LABEL}>Definición</span>
              <textarea
                className={cn(ADMIN_TEXTAREA, "min-h-20")}
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className={FIELD_LABEL}>Explicación</span>
              <textarea
                className={cn(ADMIN_TEXTAREA, "min-h-20")}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className={FIELD_LABEL}>Distractores (separados por coma)</span>
              <Input
                value={distractors}
                onChange={(e) => setDistractors(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className={FIELD_LABEL}>Tema</span>
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
              <span className={FIELD_LABEL}>Estado</span>
              <select
                className={ADMIN_SELECT}
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as KnowledgeItem["status"])
                }
              >
                <option value="published">Publicada</option>
                <option value="draft">Borrador</option>
                <option value="archived">Archivada</option>
              </select>
            </label>
            <Button type="submit" disabled={busy || !topicId}>
              Crear carta
            </Button>
          </form>
        </AdminSection>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--foreground-muted)] tabular-nums">
              Mostrando {visible.length} de {rows.length}
            </p>
            <Input
              type="search"
              placeholder="Filtrar por nombre o definición…"
              aria-label="Filtrar cartas"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="sm:max-w-xs"
            />
          </div>

          {visible.length === 0 ? (
            <AdminEmpty>
              {rows.length === 0 ? "Todavía no hay cartas." : "Ninguna carta coincide con el filtro."}
            </AdminEmpty>
          ) : (
            <div className={cn(ADMIN_TABLE.wrap, "max-h-[40rem] overflow-y-auto")}>
              <table className={ADMIN_TABLE.table}>
                <thead className={cn(ADMIN_TABLE.thead, "sticky top-0 z-10")}>
                  <tr>
                    <th className={ADMIN_TABLE.th}>Concepto</th>
                    <th className={ADMIN_TABLE.th}>Tema</th>
                    <th className={ADMIN_TABLE.th}>Estado</th>
                    <th className={ADMIN_TABLE.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item) => (
                    <tr key={item.id} className={ADMIN_TABLE.tr}>
                      <td className={cn(ADMIN_TABLE.td, "min-w-64 max-w-md")}>
                        <p className="font-semibold">{item.name}</p>
                        <p className="line-clamp-2 text-xs text-[var(--foreground-muted)]">
                          {item.definition}
                        </p>
                      </td>
                      <td className={ADMIN_TABLE.td}>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Badge tone={item.trackId === "AIF" ? "accent" : "neutral"}>
                            {item.trackId}
                          </Badge>
                          <span className="text-xs text-[var(--foreground-muted)]">
                            {topicName.get(item.topicId) ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className={ADMIN_TABLE.td}>
                        <ContentStatusBadge status={item.status} />
                      </td>
                      <td className={ADMIN_TABLE.td}>
                        <div className="flex gap-1.5">
                          <Button
                            type="button"
                            variant="secondary"
                            size="xs"
                            disabled={busy}
                            onClick={() => void onToggleStatus(item)}
                          >
                            {item.status === "published" ? "Pasar a borrador" : "Publicar"}
                          </Button>
                          <Button
                            type="button"
                            variant="danger"
                            size="xs"
                            disabled={busy}
                            onClick={() => void onDelete(item.id)}
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
    </div>
  );
}

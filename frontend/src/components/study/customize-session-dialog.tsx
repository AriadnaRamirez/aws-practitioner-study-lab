"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { FOCUS_RING } from "@/components/ui/focus";
import {
  STUDY_GROUPS,
  categoriesInGroup,
  type StudyCategory,
} from "@/lib/study-categories";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  /** Categories that have topics in the bank. */
  available: StudyCategory[];
  selected: string[];
  defaultSelection: string[];
  /** Published cards per category id. */
  cardCounts: Record<string, number>;
  sessionSize: number;
  /** Texto del botón principal (p. ej. "Listo" o "Iniciar partida"). */
  applyLabel?: string;
  onClose: () => void;
  onApply: (categoryIds: string[]) => void;
};

const SHORT_LANDSCAPE_FULL_ROW = "[@media(max-height:500px)]:md:col-span-2";

export function CustomizeSessionDialog({
  open,
  available,
  selected,
  defaultSelection,
  cardCounts,
  sessionSize,
  applyLabel = "Listo",
  onClose,
  onApply,
}: Props) {
  const titleId = useId();
  const [draft, setDraft] = useState<string[]>(selected);

  useEffect(() => {
    if (open) setDraft(selected);
  }, [open, selected]);

  if (!open) return null;

  const availableIds = new Set(available.map((c) => c.id));
  const toggle = (id: string) =>
    setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const pool = draft.reduce((sum, id) => sum + (cardCounts[id] ?? 0), 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      className="[@media(max-height:500px)]:md:grid [@media(max-height:500px)]:md:max-w-2xl [@media(max-height:500px)]:md:grid-cols-2 [@media(max-height:500px)]:md:content-start [@media(max-height:500px)]:md:gap-x-6 [@media(max-height:500px)]:md:gap-y-3 [@media(max-height:500px)]:md:p-4"
    >
      <div className={SHORT_LANDSCAPE_FULL_ROW}>
        <DialogHeader
          titleId={titleId}
          title="Personalizar sesión"
          onClose={onClose}
        >
          <p className="mt-0.5 text-xs leading-snug text-[var(--foreground-muted)]">
            Elige qué temas entran en tu partida.
          </p>
        </DialogHeader>
      </div>

      {STUDY_GROUPS.map((group) => {
        const cats = categoriesInGroup(group.id).filter((c) =>
          availableIds.has(c.id),
        );
        if (!cats.length) return null;
        const groupIds: string[] = cats.map((c) => c.id);
        const allOn = groupIds.every((id) => draft.includes(id));
        return (
          <div key={group.id} className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <CardLabel as="p">{group.title}</CardLabel>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="shrink-0"
                aria-label={`${allOn ? "Quitar todos" : "Elegir todos"}: ${group.title}`}
                onClick={() =>
                  setDraft((d) =>
                    allOn
                      ? d.filter((id) => !groupIds.includes(id))
                      : Array.from(new Set([...d, ...groupIds])),
                  )
                }
              >
                {allOn ? "Quitar todos" : "Elegir todos"}
              </Button>
            </div>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {cats.map((cat) => {
                const on = draft.includes(cat.id);
                const count = cardCounts[cat.id] ?? 0;
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-label={`${cat.title}, ${count} ${count === 1 ? "carta" : "cartas"}`}
                      onClick={() => toggle(cat.id)}
                      title={`${cat.title} · ${cat.subtitle}`}
                      className={cn(
                        "inline-flex h-8 items-center gap-1.5 rounded-full pl-3 pr-2 text-xs font-semibold transition-colors",
                        FOCUS_RING,
                        on
                          ? "bg-[color-mix(in_srgb,var(--accent)_24%,var(--surface-elevated))] text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--accent)_32%,var(--surface-elevated))]"
                          : "bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
                      )}
                    >
                      {cat.shortTitle}
                      <span
                        className={cn(
                          "rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                          on
                            ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                            : "bg-[var(--surface)] text-[var(--foreground-muted)]",
                        )}
                      >
                        {count}
                      </span>
                      {on ? (
                        <X className="size-3.5" aria-hidden />
                      ) : (
                        <Plus className="size-3.5" aria-hidden />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <Card
        variant="inset"
        padding="none"
        className={cn(
          "px-4 py-3 [@media(max-height:500px)]:md:py-2",
          SHORT_LANDSCAPE_FULL_ROW,
        )}
      >
        <p className="flex items-baseline justify-between gap-3">
          <span className="text-xs text-[var(--foreground-muted)]">
            Cartas disponibles
          </span>
          <span className="text-lg font-extrabold tabular-nums tracking-tight text-[var(--foreground)]">
            {pool} {pool === 1 ? "carta" : "cartas"}
          </span>
        </p>
        <p
          className="mt-0.5 text-xs leading-snug text-[var(--foreground-muted)]"
          aria-live="polite"
        >
          {draft.length === 0
            ? "Elige al menos un tema."
            : pool < sessionSize
              ? `Menos de ${sessionSize}: la partida tendrá solo ${pool} ${pool === 1 ? "carta" : "cartas"}.`
              : `${draft.length} ${draft.length === 1 ? "tema" : "temas"} · se eligen ${sessionSize} al azar.`}
        </p>
      </Card>

      <div
        className={cn(
          "flex items-center justify-between gap-3",
          SHORT_LANDSCAPE_FULL_ROW,
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => setDraft(defaultSelection)}
        >
          Restablecer
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={draft.length === 0}
          onClick={() => onApply(draft)}
        >
          {applyLabel}
        </Button>
      </div>
    </Dialog>
  );
}

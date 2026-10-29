"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<string[]>(selected);

  useEffect(() => {
    if (open) setDraft(selected);
  }, [open, selected]);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const availableIds = new Set(available.map((c) => c.id));
  const toggle = (id: string) =>
    setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  const pool = draft.reduce((sum, id) => sum + (cardCounts[id] ?? 0), 0);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-fade-up relative z-10 max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-[var(--surface-elevated)] p-5 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)] outline-none [@media(max-height:500px)]:md:grid [@media(max-height:500px)]:md:max-w-2xl [@media(max-height:500px)]:md:grid-cols-2 [@media(max-height:500px)]:md:content-start [@media(max-height:500px)]:md:gap-x-6 [@media(max-height:500px)]:md:p-4"
      >
        <div className="flex items-start justify-between gap-3 [@media(max-height:500px)]:md:col-span-2">
          <div>
            <h2
              id={titleId}
              className="font-display text-lg font-bold tracking-tight"
            >
              Personalizar sesión
            </h2>
            <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
              Elige qué temas entran en tu partida.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mr-1 -mt-1 inline-flex size-8 items-center justify-center rounded-full text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        {STUDY_GROUPS.map((group) => {
          const cats = categoriesInGroup(group.id).filter((c) =>
            availableIds.has(c.id),
          );
          if (!cats.length) return null;
          const groupIds: string[] = cats.map((c) => c.id);
          const allOn = groupIds.every((id) => draft.includes(id));
          return (
            <div key={group.id} className="mt-5 min-w-0 [@media(max-height:500px)]:md:mt-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
                  {group.title}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((d) =>
                      allOn
                        ? d.filter((id) => !groupIds.includes(id))
                        : Array.from(new Set([...d, ...groupIds])),
                    )
                  }
                  className="shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                >
                  {allOn ? "Quitar todos" : "Elegir todos"}
                </button>
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
                          on
                            ? "bg-[color-mix(in_srgb,var(--accent)_26%,var(--surface-hover))] text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--accent)_34%,var(--surface-hover))]"
                            : "bg-[var(--surface-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
                        )}
                      >
                        {cat.shortTitle}
                        <span
                          className={cn(
                            "rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                            on
                              ? "bg-[var(--accent)] text-white"
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

        <div className="mt-5 rounded-2xl bg-[var(--surface-hover)] px-4 py-3 [@media(max-height:500px)]:md:col-span-2 [@media(max-height:500px)]:md:mt-3 [@media(max-height:500px)]:md:py-2">
          <p className="flex items-baseline justify-between gap-3">
            <span className="text-xs text-[var(--foreground-muted)]">
              Cartas disponibles
            </span>
            <span className="font-display text-lg font-semibold tabular-nums text-[var(--foreground)]">
              {pool} {pool === 1 ? "carta" : "cartas"}
            </span>
          </p>
          <p
            className="mt-0.5 text-[11px] leading-snug text-[var(--foreground-muted)]"
            aria-live="polite"
          >
            {draft.length === 0
              ? "Elige al menos un tema."
              : pool < sessionSize
                ? `Menos de ${sessionSize}: la partida tendrá solo ${pool} ${pool === 1 ? "carta" : "cartas"}.`
                : `${draft.length} ${draft.length === 1 ? "tema" : "temas"} · se eligen ${sessionSize} al azar.`}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 [@media(max-height:500px)]:md:col-span-2 [@media(max-height:500px)]:md:mt-3">
          <button
            type="button"
            onClick={() => setDraft(defaultSelection)}
            className="text-xs font-semibold text-[var(--foreground-muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
          >
            Restablecer
          </button>
          <Button
            size="sm"
            disabled={draft.length === 0}
            onClick={() => onApply(draft)}
          >
            {applyLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

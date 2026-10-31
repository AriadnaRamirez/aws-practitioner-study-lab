"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, GripVertical, Lock } from "lucide-react";
import { FOCUS_RING } from "@/components/ui/focus";
import type { OsiLayerNumber } from "@/lib/minigames/osi-tcpip";
import { cn } from "@/lib/utils";
import {
  CheckBar,
  HintBox,
  Mark,
  StepHeading,
  mergeMissed,
  shuffleUnsolved,
  type CheckPhase,
  type Missed,
  type StepProps,
} from "@/components/minigames/osi-lesson-ui";

export type OrderItem = {
  id: string;
  label: string;
  /** Número que debe quedar a su lado, p. ej. 7 para Aplicación en OSI. */
  number: number;
  /** Capa OSI cuya ficha se abre para repasar este elemento. */
  layer: OsiLayerNumber;
};

const ICON_BTN =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--foreground)] hover:bg-[var(--border-strong)] disabled:pointer-events-none disabled:opacity-30";

export function OrderStep({
  title,
  instruction,
  hint,
  items,
  listLabel,
  onComplete,
}: StepProps & {
  title: string;
  instruction: React.ReactNode;
  /** Se muestra tras el primer fallo. */
  hint: React.ReactNode;
  /** En el orden correcto, de arriba hacia abajo. */
  items: readonly OrderItem[];
  listLabel: string;
}) {
  const [order, setOrder] = React.useState<string[]>(() =>
    shuffleUnsolved(items.map((i) => i.id)),
  );
  const [locked, setLocked] = React.useState<ReadonlySet<string>>(() => new Set());
  const [phase, setPhase] = React.useState<CheckPhase>("edit");
  const [attempts, setAttempts] = React.useState(0);
  const [firstScore, setFirstScore] = React.useState(0);
  const [missed, setMissed] = React.useState<Missed[]>([]);
  const [solved, setSolved] = React.useState(false);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);
  const buttons = React.useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = React.useRef<{ id: string; dir: "up" | "down" } | null>(null);

  const byId = React.useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const editing = phase === "edit";
  const showMarks = phase !== "edit";
  const okCount = order.filter((id, i) => id === items[i].id).length;

  React.useEffect(() => {
    const want = pendingFocus.current;
    if (!want) return;
    pendingFocus.current = null;
    const btn = buttons.current.get(`${want.id}-${want.dir}`);
    const other = buttons.current.get(`${want.id}-${want.dir === "up" ? "down" : "up"}`);
    (btn && !btn.disabled ? btn : other)?.focus();
  }, [order]);

  function target(index: number, dir: -1 | 1) {
    let j = index + dir;
    while (j >= 0 && j < order.length && locked.has(order[j])) j += dir;
    return j >= 0 && j < order.length ? j : null;
  }

  function swap(a: number, b: number) {
    setOrder((cur) => {
      const next = [...cur];
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
  }

  function move(index: number, dir: -1 | 1) {
    const j = target(index, dir);
    if (j === null) return;
    pendingFocus.current = { id: order[index], dir: dir === -1 ? "up" : "down" };
    swap(index, j);
  }

  function check() {
    const wrong = order
      .map((id, i) => ({ id, ok: id === items[i].id }))
      .filter((r) => !r.ok)
      .map((r) => byId.get(r.id)!);
    const n = attempts + 1;
    setAttempts(n);
    if (n === 1) setFirstScore(order.length - wrong.length);
    setMissed((m) => mergeMissed(m, wrong.map((w) => ({ label: w.label, layer: w.layer }))));
    setPhase(wrong.length === 0 ? "done" : "wrong");
  }

  function retry() {
    setLocked(new Set(order.filter((id, i) => id === items[i].id)));
    setPhase("edit");
  }

  function solution() {
    setOrder(items.map((i) => i.id));
    setSolved(true);
    setPhase("done");
  }

  return (
    <div>
      <StepHeading title={title} instruction={instruction}>
        {attempts > 0 ? <HintBox>{hint}</HintBox> : null}
      </StepHeading>

      <ol aria-label={listLabel} className="mt-6 max-w-xl space-y-2">
        {order.map((id, index) => {
          const item = byId.get(id)!;
          const slot = items[index];
          const isLocked = locked.has(id);
          const ok = id === slot.id;
          const canDrag = editing && !isLocked;
          const up = editing && !isLocked ? target(index, -1) : null;
          const down = editing && !isLocked ? target(index, 1) : null;
          return (
            <li
              key={id}
              className="flex items-stretch gap-2.5"
              onDragOver={
                canDrag && dragId
                  ? (e) => {
                      e.preventDefault();
                      setOverIndex(index);
                    }
                  : undefined
              }
              onDragLeave={() => setOverIndex((o) => (o === index ? null : o))}
              onDrop={
                canDrag && dragId
                  ? (e) => {
                      e.preventDefault();
                      const from = order.indexOf(dragId);
                      if (from >= 0 && from !== index) swap(from, index);
                      setOverIndex(null);
                      setDragId(null);
                    }
                  : undefined
              }
            >
              <span className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--surface)] py-1 text-center">
                <span className="text-lg font-bold tabular-nums leading-none text-[var(--foreground)]">
                  {slot.number}
                </span>
                {index === 0 || index === order.length - 1 ? (
                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
                    {index === 0 ? "arriba" : "abajo"}
                  </span>
                ) : null}
              </span>
              <div
                draggable={canDrag}
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", id);
                  e.dataTransfer.effectAllowed = "move";
                  setDragId(id);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setOverIndex(null);
                }}
                className={cn(
                  "flex min-h-14 min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2 ring-1 motion-safe:transition-[background-color,box-shadow,opacity]",
                  canDrag && "cursor-grab active:cursor-grabbing",
                  dragId === id && "opacity-40",
                  overIndex === index && dragId !== id && "ring-2 ring-[var(--accent)]",
                  showMarks && ok && "bg-[var(--success-soft)] ring-[var(--success)]",
                  showMarks && !ok && "bg-[var(--danger-soft)] ring-[var(--danger)]",
                  !showMarks && isLocked && "bg-[var(--success-soft)] ring-transparent",
                  !showMarks && !isLocked && "bg-[var(--surface-elevated)] ring-[var(--border)]",
                )}
              >
                {canDrag ? (
                  <GripVertical className="size-4 shrink-0 text-[var(--foreground-muted)]" aria-hidden />
                ) : isLocked && !showMarks ? (
                  <Lock className="size-4 shrink-0 text-[var(--success-text)]" aria-label="Ya está bien" />
                ) : null}
                <span className="min-w-0 flex-1 text-base font-semibold leading-tight text-[var(--foreground)]">
                  {item.label}
                </span>
                {showMarks ? <Mark ok={ok} /> : null}
                {editing && !isLocked ? (
                  <span className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      ref={(el) => {
                        if (el) buttons.current.set(`${id}-up`, el);
                        else buttons.current.delete(`${id}-up`);
                      }}
                      onClick={() => move(index, -1)}
                      disabled={up === null}
                      aria-label={`Subir ${item.label} (ahora en el lugar ${slot.number})`}
                      className={cn(ICON_BTN, FOCUS_RING)}
                    >
                      <ArrowUp className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      ref={(el) => {
                        if (el) buttons.current.set(`${id}-down`, el);
                        else buttons.current.delete(`${id}-down`);
                      }}
                      onClick={() => move(index, 1)}
                      disabled={down === null}
                      aria-label={`Bajar ${item.label} (ahora en el lugar ${slot.number})`}
                      className={cn(ICON_BTN, FOCUS_RING)}
                    >
                      <ArrowDown className="size-4" aria-hidden />
                    </button>
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <CheckBar
        phase={phase}
        ready
        notReadyText=""
        attempts={attempts}
        okCount={okCount}
        total={items.length}
        solved={solved}
        onCheck={check}
        onRetry={retry}
        onSolution={solution}
        onContinue={() => onComplete({ correct: firstScore, total: items.length, missed })}
      />
    </div>
  );
}

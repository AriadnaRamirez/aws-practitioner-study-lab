"use client";

import * as React from "react";
import { Cloud, Cpu, Lightbulb, X, type LucideIcon } from "lucide-react";
import { FOCUS_RING } from "@/components/ui/focus";
import {
  OSI_LAYERS,
  PLACE_CHIPS,
  osiLayer,
  type ChipType,
  type OsiLayerNumber,
  type PlaceChip,
} from "@/lib/minigames/osi-tcpip";
import { cn } from "@/lib/utils";
import {
  CheckBar,
  Mark,
  StepHeading,
  mergeMissed,
  shuffle,
  type CheckPhase,
  type Missed,
  type StepProps,
} from "@/components/minigames/osi-lesson-ui";
import { LayerNumber } from "@/components/minigames/osi-layer-board";

export const CHIP_ICON: Record<ChipType, LucideIcon> = {
  funcion: Lightbulb,
  fisico: Cpu,
  aws: Cloud,
};

type Slots = Partial<Record<OsiLayerNumber, string>>;

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

const CHIP_BASE =
  "flex min-h-11 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold leading-snug text-[var(--foreground)] touch-manipulation motion-safe:transition-[background-color,box-shadow,opacity]";

export function PlaceStep({
  type,
  title,
  instruction,
  onComplete,
}: StepProps & { type: ChipType; title: string; instruction: React.ReactNode }) {
  const chips = PLACE_CHIPS[type];
  const [poolOrder] = React.useState(() => shuffle(chips.map((c) => c.id)));
  const [slots, setSlots] = React.useState<Slots>({});
  const [locked, setLocked] = React.useState<ReadonlySet<OsiLayerNumber>>(() => new Set());
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<OsiLayerNumber | "pool" | null>(null);
  const [phase, setPhase] = React.useState<CheckPhase>("edit");
  const [attempts, setAttempts] = React.useState(0);
  const [firstScore, setFirstScore] = React.useState(0);
  const [missed, setMissed] = React.useState<Missed[]>([]);
  const [solved, setSolved] = React.useState(false);

  const byId = React.useMemo(() => new Map(chips.map((c) => [c.id, c])), [chips]);
  const editing = phase === "edit";
  const placedIds = new Set(Object.values(slots));
  const pool = poolOrder.filter((id) => !placedIds.has(id)).map((id) => byId.get(id)!);
  const selected = selectedId ? (byId.get(selectedId) ?? null) : null;
  const placedCount = placedIds.size;
  const isOk = (n: OsiLayerNumber) => {
    const id = slots[n];
    return id !== undefined && byId.get(id)!.layer === n;
  };
  const okCount = OSI_LAYERS.filter((l) => isOk(l.number)).length;
  const Icon = CHIP_ICON[type];

  React.useEffect(() => {
    if (!selectedId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  function slotOf(chipId: string): OsiLayerNumber | undefined {
    return OSI_LAYERS.find((l) => slots[l.number] === chipId)?.number;
  }

  function place(chipId: string, n: OsiLayerNumber) {
    if (!editing || locked.has(n)) return;
    const from = slotOf(chipId);
    if (from !== undefined && locked.has(from)) return;
    setSlots((cur) => {
      const next = { ...cur };
      const occupant = next[n];
      next[n] = chipId;
      if (from !== undefined && from !== n) {
        if (occupant) next[from] = occupant;
        else delete next[from];
      }
      return next;
    });
    setSelectedId(null);
  }

  function unplace(chipId: string) {
    const from = slotOf(chipId);
    if (from === undefined || locked.has(from)) return;
    setSlots((cur) => {
      const next = { ...cur };
      delete next[from];
      return next;
    });
    setSelectedId(null);
  }

  function check() {
    const wrong = OSI_LAYERS.filter((l) => !isOk(l.number)).map((l) => byId.get(slots[l.number]!)!);
    const n = attempts + 1;
    setAttempts(n);
    if (n === 1) setFirstScore(chips.length - wrong.length);
    setMissed((m) => mergeMissed(m, wrong.map((c) => ({ label: c.label, layer: c.layer }))));
    setSelectedId(null);
    setPhase(wrong.length === 0 ? "done" : "wrong");
  }

  function retry() {
    const keep = OSI_LAYERS.filter((l) => isOk(l.number)).map((l) => l.number);
    setLocked(new Set(keep));
    setSlots((cur) => Object.fromEntries(keep.map((n) => [n, cur[n]])) as Slots);
    setPhase("edit");
  }

  function solution() {
    setSlots(Object.fromEntries(chips.map((c) => [c.layer, c.id])) as Slots);
    setSolved(true);
    setPhase("done");
  }

  function dragProps(chip: PlaceChip) {
    return {
      draggable: editing,
      onDragStart: (e: React.DragEvent) => {
        e.dataTransfer.setData("text/plain", chip.id);
        e.dataTransfer.effectAllowed = "move";
        setDragId(chip.id);
      },
      onDragEnd: () => {
        setDragId(null);
        setOver(null);
      },
    };
  }

  function dropProps(targetKey: OsiLayerNumber | "pool", onDrop: (id: string) => void) {
    if (!editing || (targetKey !== "pool" && locked.has(targetKey))) return {};
    return {
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (over !== targetKey) setOver(targetKey);
      },
      onDragLeave: (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(null);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setOver(null);
        const id = e.dataTransfer.getData("text/plain") || dragId;
        if (id && byId.has(id)) onDrop(id);
        setDragId(null);
      },
    };
  }

  const poolPanel = (
    <div
      {...dropProps("pool", unplace)}
      className={cn(
        "rounded-2xl bg-[var(--surface)] p-3 ring-1 ring-[var(--border)]",
        over === "pool" && "ring-2 ring-[var(--accent)]",
      )}
    >
      <p className="flex min-h-6 items-center justify-between gap-2 text-sm font-semibold text-[var(--foreground-muted)]">
        <span className="flex items-center gap-1.5">
          <Icon className="size-4 text-[var(--accent)]" aria-hidden />
          {pool.length > 0 ? `Tarjetas por colocar: ${pool.length}` : "¡Todas colocadas!"}
        </span>
      </p>
      {pool.length > 0 ? (
        <ul aria-label="Tarjetas por colocar" className="mt-2.5 grid gap-2">
          {pool.map((chip) => {
            const isSel = selectedId === chip.id;
            return (
              <li key={chip.id}>
                <button
                  type="button"
                  {...dragProps(chip)}
                  disabled={!editing}
                  aria-pressed={isSel}
                  onClick={() => setSelectedId(isSel ? null : chip.id)}
                  className={cn(
                    CHIP_BASE,
                    "cursor-grab shadow-[var(--shadow-float)] active:cursor-grabbing",
                    FOCUS_RING,
                    isSel
                      ? "bg-[var(--accent-soft)] ring-2 ring-[var(--accent)]"
                      : "bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)]",
                    dragId === chip.id && "opacity-40",
                  )}
                >
                  <Icon className="size-4 shrink-0 text-[var(--foreground-muted)]" aria-hidden />
                  {chip.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-1.5 text-sm text-[var(--foreground-muted)]">
          {editing ? "Revisa el tablero y pulsa Comprobar." : "Lee por qué va cada una en su capa."}
        </p>
      )}
      {selected ? (
        <p className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--foreground)]">
          <span>
            Elegiste <span className="font-semibold">«{selected.label}»</span>. Ahora toca su capa.
          </span>
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className={cn(
              "shrink-0 rounded-md px-1.5 py-0.5 text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
              FOCUS_RING,
            )}
          >
            Cancelar
          </button>
        </p>
      ) : null}
    </div>
  );

  return (
    <div>
      <StepHeading title={title} instruction={instruction} />

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="lg:sticky lg:top-24 lg:order-2">{poolPanel}</div>

        <ol aria-label="Capas del modelo OSI" className="space-y-2 lg:order-1">
          {OSI_LAYERS.map((layer) => {
            const n = layer.number;
            const chip = slots[n] ? byId.get(slots[n]!)! : null;
            const isLocked = locked.has(n);
            const showMark = chip !== null && (phase !== "edit" || isLocked);
            const ok = isOk(n);
            const name = `Capa ${n} · ${layer.name}`;
            return (
              <li
                key={n}
                {...dropProps(n, (id) => place(id, n))}
                className={cn(
                  "rounded-2xl p-2.5 ring-1 motion-safe:transition-[background-color,box-shadow] sm:flex sm:items-start sm:gap-3",
                  showMark && ok && "bg-[var(--success-soft)] ring-[var(--success)]",
                  showMark && !ok && "bg-[var(--danger-soft)] ring-[var(--danger)]",
                  !showMark && "bg-[var(--surface)] ring-[var(--border)]",
                  over === n && "ring-2 ring-[var(--accent)]",
                )}
              >
                <div className="flex items-center gap-2.5 sm:min-h-11 sm:w-44 sm:shrink-0">
                  <LayerNumber n={n} />
                  <span className="font-semibold leading-tight text-[var(--foreground)]">
                    {layer.name}
                  </span>
                </div>

                <div className="mt-2 min-w-0 flex-1 sm:mt-0">
                  {chip ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        {...dragProps(chip)}
                        draggable={editing && !isLocked}
                        disabled={!editing || isLocked}
                        aria-pressed={selectedId === chip.id}
                        aria-label={
                          selected && selected.id !== chip.id
                            ? `Colocar «${selected.label}» en ${name} (cambia por «${chip.label}»)`
                            : `«${chip.label}» en ${name}. Pulsa para moverla.`
                        }
                        onClick={() => {
                          if (selected && selected.id !== chip.id) place(selected.id, n);
                          else setSelectedId(selectedId === chip.id ? null : chip.id);
                        }}
                        className={cn(
                          CHIP_BASE,
                          "flex-1 disabled:cursor-default",
                          FOCUS_RING,
                          editing && !isLocked && "cursor-grab hover:bg-[var(--surface-hover)]",
                          selectedId === chip.id
                            ? "bg-[var(--accent-soft)] ring-2 ring-[var(--accent)]"
                            : "bg-[var(--surface-elevated)]",
                          dragId === chip.id && "opacity-40",
                        )}
                      >
                        <Icon className="size-4 shrink-0 text-[var(--foreground-muted)]" aria-hidden />
                        <span className="min-w-0 flex-1">{chip.label}</span>
                        {showMark ? <Mark ok={ok} /> : null}
                      </button>
                      {editing && !isLocked ? (
                        <button
                          type="button"
                          onClick={() => unplace(chip.id)}
                          aria-label={`Quitar «${chip.label}» de ${name}`}
                          className={cn(
                            "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
                            FOCUS_RING,
                          )}
                        >
                          <X className="size-4" aria-hidden />
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!editing}
                      onClick={() => selected && place(selected.id, n)}
                      aria-label={
                        selected
                          ? `Colocar «${selected.label}» en ${name}`
                          : `${name}: vacía. Elige primero una tarjeta.`
                      }
                      className={cn(
                        "flex min-h-11 w-full items-center rounded-xl border-2 border-dashed px-3 text-sm",
                        FOCUS_RING,
                        selected
                          ? "border-[var(--accent)] text-[var(--foreground)] hover:bg-[var(--accent-soft)]"
                          : "border-[var(--border)] text-[var(--foreground-muted)]",
                      )}
                    >
                      {selected ? "Toca para colocarla aquí" : "Suelta aquí una tarjeta"}
                    </button>
                  )}
                  {showMark && chip ? (
                    <p
                      className={cn(
                        "mt-1.5 px-1 text-sm leading-snug",
                        ok ? "text-[var(--foreground)]" : "text-[var(--danger-text)]",
                      )}
                    >
                      {ok
                        ? chip.why
                        : `Aquí no. La capa ${layer.name} ${lowerFirst(osiLayer(n).does)}`}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <CheckBar
        phase={phase}
        ready={placedCount === chips.length}
        notReadyText={`Coloca las 7 tarjetas (${placedCount} de ${chips.length}).`}
        attempts={attempts}
        okCount={okCount}
        total={chips.length}
        solved={solved}
        onCheck={check}
        onRetry={retry}
        onSolution={solution}
        onContinue={() => onComplete({ correct: firstScore, total: chips.length, missed })}
      />
    </div>
  );
}

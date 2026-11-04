"use client";

import * as React from "react";
import {
  OSI_LAYERS,
  TCPIP_LAYERS,
  tcpIpForOsi,
  type OsiLayerNumber,
  type TcpIpLayerId,
} from "@/lib/minigames/osi-tcpip";
import { cn } from "@/lib/utils";
import {
  CheckBar,
  HintBox,
  Mark,
  StepHeading,
  mergeMissed,
  type CheckPhase,
  type Missed,
  type StepProps,
} from "@/components/minigames/osi-lesson-ui";
import { tint } from "@/components/minigames/osi-layer-board";

type Answers = Partial<Record<OsiLayerNumber, TcpIpLayerId>>;

export function MatchStep({ onComplete }: StepProps) {
  const [answers, setAnswers] = React.useState<Answers>({});
  const [locked, setLocked] = React.useState<ReadonlySet<OsiLayerNumber>>(() => new Set());
  const [phase, setPhase] = React.useState<CheckPhase>("edit");
  const [attempts, setAttempts] = React.useState(0);
  const [firstScore, setFirstScore] = React.useState(0);
  const [missed, setMissed] = React.useState<Missed[]>([]);
  const [solved, setSolved] = React.useState(false);

  const isOk = (n: OsiLayerNumber) => answers[n] === tcpIpForOsi(n).id;
  const answered = OSI_LAYERS.filter((l) => answers[l.number]).length;
  const okCount = OSI_LAYERS.filter((l) => isOk(l.number)).length;
  const editing = phase === "edit";

  function check() {
    const wrong = OSI_LAYERS.filter((l) => !isOk(l.number));
    const n = attempts + 1;
    setAttempts(n);
    if (n === 1) setFirstScore(OSI_LAYERS.length - wrong.length);
    setMissed((m) =>
      mergeMissed(
        m,
        wrong.map((l) => ({ label: `${l.name} → TCP/IP ${tcpIpForOsi(l.number).name}`, layer: l.number })),
      ),
    );
    setPhase(wrong.length === 0 ? "done" : "wrong");
  }

  function retry() {
    const keep = OSI_LAYERS.filter((l) => isOk(l.number)).map((l) => l.number);
    setLocked(new Set(keep));
    setAnswers((a) => Object.fromEntries(keep.map((n) => [n, a[n]])) as Answers);
    setPhase("edit");
  }

  function solution() {
    setAnswers(Object.fromEntries(OSI_LAYERS.map((l) => [l.number, tcpIpForOsi(l.number).id])));
    setSolved(true);
    setPhase("done");
  }

  return (
    <div>
      <StepHeading
        title="Relaciona OSI con TCP/IP"
        instruction={
          <>
            TCP/IP junta varias capas de OSI en una sola. Para cada capa OSI, elige a qué capa
            TCP/IP pertenece. Puedes elegir la misma varias veces.
          </>
        }
      >
        {attempts > 0 ? (
          <HintBox>
            Aplicación de TCP/IP junta las 3 capas de arriba de OSI; Acceso a la red junta las 2 de
            abajo. Transporte e Internet son una sola capa cada una.
          </HintBox>
        ) : null}
      </StepHeading>

      <ul className="mt-6 space-y-3">
        {OSI_LAYERS.map((layer) => {
          const n = layer.number;
          const picked = answers[n];
          const isLocked = locked.has(n);
          const showMark = phase !== "edit" || isLocked;
          const ok = isOk(n);
          return (
            <li
              key={n}
              className={cn(
                "rounded-2xl p-3 ring-1 sm:flex sm:items-center sm:gap-4",
                showMark && ok && "bg-[var(--success-soft)] ring-[var(--success)]",
                showMark && !ok && "bg-[var(--danger-soft)] ring-[var(--danger)]",
                !showMark && "bg-[var(--surface)] ring-[var(--border)]",
              )}
            >
              <fieldset className="contents" disabled={!editing || isLocked}>
                <legend className="sr-only">
                  Capa OSI {n}, {layer.name}: ¿a qué capa TCP/IP pertenece?
                </legend>
                <div className="flex items-center gap-2.5 sm:w-52 sm:shrink-0">
                  <span
                    aria-hidden
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-hover)] text-sm font-bold tabular-nums text-[var(--foreground)]"
                  >
                    {n}
                  </span>
                  <span className="min-w-0 flex-1 font-semibold leading-tight text-[var(--foreground)]">
                    {layer.name}
                  </span>
                  {showMark ? <Mark ok={ok} /> : null}
                </div>
                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-0 sm:flex-1 sm:grid-cols-4">
                  {TCPIP_LAYERS.map((opt) => {
                    const checked = picked === opt.id;
                    const id = `rel-${n}-${opt.id}`;
                    return (
                      <div key={opt.id}>
                        <input
                          type="radio"
                          id={id}
                          name={`rel-${n}`}
                          value={opt.id}
                          checked={checked}
                          onChange={() => setAnswers((a) => ({ ...a, [n]: opt.id }))}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={id}
                          className={cn(
                            "flex min-h-11 cursor-pointer items-center justify-center rounded-xl px-2 py-2 text-center text-sm font-semibold leading-tight ring-1 motion-safe:transition-colors",
                            "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--background)]",
                            "peer-disabled:cursor-default",
                            checked
                              ? "bg-[var(--accent-soft)] text-[var(--foreground)] ring-[var(--accent)]"
                              : "bg-[var(--surface-elevated)] text-[var(--foreground-muted)] ring-transparent hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
                          )}
                        >
                          {opt.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ul>

      {phase === "done" ? (
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {TCPIP_LAYERS.map((tcp) => (
            <p
              key={tcp.id}
              className="rounded-xl border-l-4 px-3.5 py-2.5 text-sm"
              style={{ borderColor: tcp.color, backgroundColor: tint(tcp.color, 10) }}
            >
              <span className="font-semibold" style={{ color: tcp.color }}>
                {tcp.name}
              </span>{" "}
              <span className="text-[var(--foreground-muted)]">· {tcp.summary}</span>
            </p>
          ))}
        </div>
      ) : null}

      <CheckBar
        phase={phase}
        ready={answered === OSI_LAYERS.length}
        notReadyText={`Elige una opción en cada capa (${answered} de ${OSI_LAYERS.length}).`}
        attempts={attempts}
        okCount={okCount}
        total={OSI_LAYERS.length}
        solved={solved}
        onCheck={check}
        onRetry={retry}
        onSolution={solution}
        onContinue={() => onComplete({ correct: firstScore, total: OSI_LAYERS.length, missed })}
      />
    </div>
  );
}

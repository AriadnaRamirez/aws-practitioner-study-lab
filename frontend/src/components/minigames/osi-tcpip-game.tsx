"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ListChecks,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { ProgressBar } from "@/components/ui/progress";
import { OsiLearn } from "@/components/minigames/osi-learn";
import { OrderStep, type OrderItem } from "@/components/minigames/osi-order-step";
import { MatchStep } from "@/components/minigames/osi-match-step";
import { PlaceStep } from "@/components/minigames/osi-place-step";
import type { StepResult } from "@/components/minigames/osi-lesson-ui";
import { LayerNumber } from "@/components/minigames/osi-layer-board";
import {
  MNEMONIC,
  OSI_LAYERS,
  TCPIP_LAYERS,
  type OsiLayerNumber,
} from "@/lib/minigames/osi-tcpip";
import { cn } from "@/lib/utils";

type StepId =
  | "aprende"
  | "orden-osi"
  | "orden-tcpip"
  | "relaciona"
  | "ubica-funcion"
  | "ubica-fisico"
  | "ubica-aws";

type View = StepId | "resumen";

const STEPS: readonly { id: StepId; name: string }[] = [
  { id: "aprende", name: "Aprende" },
  { id: "orden-osi", name: "Ordena OSI" },
  { id: "orden-tcpip", name: "Ordena TCP/IP" },
  { id: "relaciona", name: "Relaciona" },
  { id: "ubica-funcion", name: "¿Qué hace?" },
  { id: "ubica-fisico", name: "Sistema físico" },
  { id: "ubica-aws", name: "AWS" },
];

const PRACTICE = STEPS.filter((s) => s.id !== "aprende");

const OSI_ORDER: readonly OrderItem[] = OSI_LAYERS.map((l) => ({
  id: `osi-${l.number}`,
  label: l.name,
  number: l.number,
  layer: l.number,
}));

const TCPIP_ORDER: readonly OrderItem[] = TCPIP_LAYERS.map((l) => ({
  id: `tcp-${l.id}`,
  label: l.name,
  number: l.number,
  layer: l.osi[0],
}));

const PLACE_INTRO = "Arrastra cada tarjeta a su capa, o tócala y luego toca la capa.";

function stepIndex(id: StepId) {
  return STEPS.findIndex((s) => s.id === id);
}

function Stepper({
  view,
  reached,
  results,
  reviewing,
  onGo,
}: {
  view: View;
  reached: number;
  results: Partial<Record<StepId, StepResult>>;
  reviewing: boolean;
  onGo: (id: StepId) => void;
}) {
  const current = view === "resumen" ? null : stepIndex(view);
  return (
    <nav aria-label="Pasos de la lección">
      <p className="text-sm font-semibold text-[var(--foreground-muted)]">
        {current === null ? (
          <span className="text-[var(--foreground)]">Resumen final</span>
        ) : (
          <>
            Paso <span className="tabular-nums text-[var(--foreground)]">{current + 1}</span> de{" "}
            <span className="tabular-nums">{STEPS.length}</span> ·{" "}
            <span className="text-[var(--foreground)]">{STEPS[current].name}</span>
          </>
        )}
        {reviewing ? (
          <span className="ml-2 rounded-full bg-[var(--warning-soft)] px-2 py-0.5 text-xs text-[var(--warning-text)]">
            Repaso
          </span>
        ) : null}
      </p>
      <ol className="mt-2.5 grid grid-cols-7 gap-1.5">
        {STEPS.map((step, i) => {
          const isCurrent = i === current;
          const done = step.id === "aprende" ? reached > 0 : results[step.id] !== undefined;
          const reachable = i <= reached;
          return (
            <li key={step.id} className="min-w-0">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onGo(step.id)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Paso ${i + 1}: ${step.name}${done ? " (hecho)" : ""}${reachable ? "" : " (aún no disponible)"}`}
                className={cn(
                  "group flex w-full flex-col gap-1.5 rounded-md pb-1 text-left disabled:cursor-default",
                  FOCUS_RING,
                )}
              >
                <span
                  className={cn(
                    "h-2 w-full rounded-full motion-safe:transition-colors",
                    isCurrent
                      ? "bg-[var(--accent)]"
                      : done
                        ? "bg-[var(--success)]"
                        : "bg-[var(--surface-hover)]",
                  )}
                />
                <span
                  className={cn(
                    "hidden items-center gap-1 truncate text-xs font-semibold md:flex",
                    isCurrent
                      ? "text-[var(--foreground)]"
                      : reachable
                        ? "text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]"
                        : "text-[var(--foreground-muted)] opacity-50",
                  )}
                >
                  {done && !isCurrent ? <Check className="size-3 shrink-0" aria-hidden /> : null}
                  <span className="truncate">{step.name}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Summary({
  results,
  onStudy,
  onReview,
  onRestart,
}: {
  results: Partial<Record<StepId, StepResult>>;
  onStudy: (n?: OsiLayerNumber) => void;
  onReview: () => void;
  onRestart: () => void;
}) {
  const rows = PRACTICE.map((s) => ({ ...s, result: results[s.id] }));
  const correct = rows.reduce((a, r) => a + (r.result?.correct ?? 0), 0);
  const total = rows.reduce((a, r) => a + (r.result?.total ?? 0), 0);
  const failed = rows.filter((r) => (r.result?.missed.length ?? 0) > 0);

  return (
    <div>
      <div className="flex items-start gap-3">
        <Trophy className="mt-1 size-8 shrink-0 text-[var(--accent)]" aria-hidden />
        <div>
          <h2
            data-step-heading
            tabIndex={-1}
            className="text-2xl font-bold tracking-tight text-[var(--foreground)] outline-none sm:text-3xl"
          >
            ¡Lección terminada!
          </h2>
          <p className="mt-1 text-base text-[var(--foreground)]">
            Acertaste <span className="font-semibold tabular-nums">{correct}</span> de{" "}
            <span className="tabular-nums">{total}</span> a la primera.
          </p>
        </div>
      </div>

      <Card className="mt-6" padding="md">
        <h3 className="text-sm font-semibold text-[var(--foreground-muted)]">Puntos por paso</h3>
        <ul className="mt-3 space-y-3">
          {rows.map((r) => {
            const perfect = r.result && r.result.correct === r.result.total;
            return (
              <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--foreground)]">
                  {perfect ? (
                    <Check className="size-4 shrink-0 text-[var(--success-text)]" aria-label="Perfecto" />
                  ) : null}
                  {r.name}
                </span>
                <span className="text-sm font-semibold tabular-nums text-[var(--foreground-muted)]">
                  {r.result ? `${r.result.correct} / ${r.result.total}` : "—"}
                </span>
                <ProgressBar
                  value={r.result?.correct ?? 0}
                  max={r.result?.total ?? 1}
                  tone={perfect ? "success" : "accent"}
                  className="col-span-2"
                />
              </li>
            );
          })}
        </ul>
      </Card>

      {failed.length > 0 ? (
        <Card className="mt-4" padding="md">
          <h3 className="text-sm font-semibold text-[var(--foreground-muted)]">Lo que fallaste</h3>
          <ul className="mt-3 space-y-4">
            {failed.map((r) => (
              <li key={r.id}>
                <p className="text-sm font-semibold text-[var(--foreground)]">{r.name}</p>
                <ul className="mt-2 space-y-1.5">
                  {r.result!.missed.map((m) => (
                    <li
                      key={m.label}
                      className="flex items-center gap-3 rounded-xl bg-[var(--surface-elevated)] px-3 py-2"
                    >
                      <LayerNumber n={m.layer} />
                      <span className="min-w-0 flex-1 text-sm text-[var(--foreground)]">{m.label}</span>
                      <Button variant="soft" size="xs" onClick={() => onStudy(m.layer)}>
                        <BookOpen className="size-3.5" aria-hidden />
                        Ver ficha
                      </Button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
        <p className="mt-4 text-base font-semibold text-[var(--success-text)]">
          No fallaste nada. ¡Te sabes las capas!
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2.5">
        {failed.length > 0 ? (
          <Button size="lg" onClick={onReview}>
            <ListChecks className="size-4" aria-hidden />
            Repasar lo que fallé
          </Button>
        ) : null}
        <Button size="lg" variant={failed.length > 0 ? "secondary" : "default"} onClick={onRestart}>
          <RotateCcw className="size-4" aria-hidden />
          Jugar de nuevo
        </Button>
        <Button size="lg" variant="secondary" onClick={() => onStudy()}>
          <BookOpen className="size-4" aria-hidden />
          Volver a estudiar
        </Button>
      </div>
    </div>
  );
}

export function OsiTcpIpGame() {
  const [view, setView] = useState<View>("aprende");
  const [reached, setReached] = useState(0);
  const [results, setResults] = useState<Partial<Record<StepId, StepResult>>>({});
  const [mounted, setMounted] = useState<ReadonlySet<View>>(() => new Set<View>(["aprende"]));
  const [round, setRound] = useState<Partial<Record<StepId, number>>>({});
  const [queue, setQueue] = useState<StepId[] | null>(null);
  const [selected, setSelected] = useState<OsiLayerNumber | null>(7);
  const [visited, setVisited] = useState<Set<OsiLayerNumber>>(() => new Set([7]));
  const [jump, setJump] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);
  const navCount = useRef(0);
  const [navKey, setNavKey] = useState(0);

  const allDone = PRACTICE.every((s) => results[s.id] !== undefined);

  useEffect(() => {
    if (navKey === 0 || navCount.current === navKey) return;
    navCount.current = navKey;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    topRef.current?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
    const panel = document.querySelector<HTMLElement>(`[data-panel="${view}"]`);
    panel?.querySelector<HTMLElement>("[data-step-heading]")?.focus({ preventScroll: true });
  }, [navKey, view]);

  function show(next: View) {
    setView(next);
    setMounted((m) => (m.has(next) ? m : new Set(m).add(next)));
    if (next !== "resumen") setReached((r) => Math.max(r, stepIndex(next)));
    setNavKey((k) => k + 1);
  }

  function select(n: OsiLayerNumber, opts?: { toggle?: boolean }) {
    setSelected((cur) => (opts?.toggle && cur === n ? null : n));
    setVisited((v) => (v.has(n) ? v : new Set(v).add(n)));
  }

  function complete(id: StepId, result: StepResult) {
    setResults((r) => ({ ...r, [id]: result }));
    if (queue) {
      const rest = queue.filter((q) => q !== id);
      setQueue(rest.length > 0 ? rest : null);
      show(rest.length > 0 ? rest[0] : "resumen");
      return;
    }
    const next = STEPS[stepIndex(id) + 1];
    show(next ? next.id : "resumen");
  }

  function remount(ids: readonly StepId[]) {
    setRound((r) => {
      const next = { ...r };
      for (const id of ids) next[id] = (next[id] ?? 0) + 1;
      return next;
    });
  }

  function study(n?: OsiLayerNumber) {
    if (n) {
      select(n);
      setJump((j) => j + 1);
      setView("aprende");
      return;
    }
    show("aprende");
  }

  function review() {
    const ids = PRACTICE.filter((s) => (results[s.id]?.missed.length ?? 0) > 0).map((s) => s.id);
    if (ids.length === 0) return;
    remount(ids);
    setQueue(ids);
    show(ids[0]);
  }

  function restart() {
    remount(PRACTICE.map((s) => s.id));
    setResults({});
    setQueue(null);
    show("orden-osi");
  }

  function panel(id: View, node: ReactNode) {
    if (!mounted.has(id)) return null;
    return (
      <div key={id} data-panel={id} hidden={view !== id}>
        {node}
      </div>
    );
  }

  const done = (id: StepId) => (r: StepResult) => complete(id, r);

  return (
    <PageContainer width="wide">
      <PageHeader
        title="OSI vs TCP/IP"
        subtitle="Una lección paso a paso: primero aprendes las capas y luego practicas una cosa a la vez."
        actions={
          <Link href="/minijuegos" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <ArrowLeft className="size-4" aria-hidden />
            Minijuegos
          </Link>
        }
      />

      <div ref={topRef} className="mt-8 scroll-mt-24">
        <Stepper view={view} reached={reached} results={results} reviewing={queue !== null} onGo={show} />
        {view !== "aprende" || allDone ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {view !== "aprende" ? (
              <Button variant="ghost" size="sm" onClick={() => show("aprende")}>
                <BookOpen className="size-4" aria-hidden />
                Repasar las fichas
              </Button>
            ) : null}
            {allDone && view !== "resumen" ? (
              <Button variant="ghost" size="sm" onClick={() => show("resumen")}>
                <Trophy className="size-4" aria-hidden />
                Ver resumen
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        {panel(
          "aprende",
          <OsiLearn
            selected={selected}
            visited={visited}
            jump={jump}
            onSelect={select}
            onPractice={() => show(reached > 0 && !allDone ? STEPS[reached].id : "orden-osi")}
            practiceLabel={reached > 0 && !allDone ? "Seguir practicando" : "Ya me las sé, a practicar"}
          />,
        )}
        {panel(
          "orden-osi",
          <OrderStep
            key={round["orden-osi"] ?? 0}
            title="Ordena el modelo OSI"
            instruction={
              <>
                Pon las 7 capas en orden: <strong>de arriba (7) a abajo (1)</strong>. Arrastra cada
                capa o usa las flechas ↑ ↓.
              </>
            }
            hint={
              <>
                Frase para recordar, de 7 a 1: <strong>{MNEMONIC}</strong>. Cada palabra empieza
                como una capa: Aplicación, Presentación, Sesión, Transporte, Red, Enlace, Física.
              </>
            }
            items={OSI_ORDER}
            listLabel="Capas OSI, de la 7 (arriba) a la 1 (abajo)"
            onComplete={done("orden-osi")}
          />,
        )}
        {panel(
          "orden-tcpip",
          <OrderStep
            key={round["orden-tcpip"] ?? 0}
            title="Ordena el modelo TCP/IP"
            instruction={
              <>
                TCP/IP tiene solo 4 capas. Ordénalas <strong>de arriba (4) a abajo (1)</strong>.
                Arrastra o usa las flechas ↑ ↓.
              </>
            }
            hint={
              <>
                Piensa de abajo hacia arriba: primero el cable y la tarjeta de red, luego las
                direcciones IP, luego los puertos TCP/UDP y arriba las apps.
              </>
            }
            items={TCPIP_ORDER}
            listLabel="Capas TCP/IP, de la 4 (arriba) a la 1 (abajo)"
            onComplete={done("orden-tcpip")}
          />,
        )}
        {panel("relaciona", <MatchStep key={round.relaciona ?? 0} onComplete={done("relaciona")} />)}
        {panel(
          "ubica-funcion",
          <PlaceStep
            key={round["ubica-funcion"] ?? 0}
            type="funcion"
            title="Ubica: ¿qué hace cada capa?"
            instruction={`Hay 7 tarjetas, una por capa, que dicen lo que hace cada una. ${PLACE_INTRO}`}
            onComplete={done("ubica-funcion")}
          />,
        )}
        {panel(
          "ubica-fisico",
          <PlaceStep
            key={round["ubica-fisico"] ?? 0}
            type="fisico"
            title="Ubica: el sistema físico"
            instruction={`Cada tarjeta es una pieza o protocolo de una red real. Una por capa. ${PLACE_INTRO}`}
            onComplete={done("ubica-fisico")}
          />,
        )}
        {panel(
          "ubica-aws",
          <PlaceStep
            key={round["ubica-aws"] ?? 0}
            type="aws"
            title="Ubica: servicios de AWS"
            instruction={`Cada tarjeta es algo de AWS que trabaja en una capa. Una por capa. ${PLACE_INTRO}`}
            onComplete={done("ubica-aws")}
          />,
        )}
        {panel(
          "resumen",
          <Summary results={results} onStudy={study} onReview={review} onRestart={restart} />,
        )}
      </div>
    </PageContainer>
  );
}

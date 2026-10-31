"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, Check, ChevronDown, Cloud, Cpu, Gamepad2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { SectionTitle } from "@/components/ui/page";
import { ProgressBar } from "@/components/ui/progress";
import {
  MNEMONIC,
  OSI_LAYERS,
  osiLayer,
  tcpIpForOsi,
  type FichaItem,
  type OsiLayer,
  type OsiLayerNumber,
} from "@/lib/minigames/osi-tcpip";
import { cn } from "@/lib/utils";
import {
  LayerBoard,
  LayerNumber,
  TcpIpPill,
  bandColor,
  tint,
} from "@/components/minigames/osi-layer-board";

function Mnemonic({ active }: { active?: OsiLayerNumber }) {
  return (
    <span>
      <span className="sr-only">{MNEMONIC}</span>
      <span aria-hidden>
      {MNEMONIC.split(" ").map((word, i) => {
        const n = (7 - i) as OsiLayerNumber;
        const on = active === undefined || active === n;
        return (
          <span key={word}>
            {i > 0 ? " " : null}
            <span
              className={cn(
                on ? "font-semibold text-[var(--foreground)]" : "text-[var(--foreground-muted)]",
              )}
            >
              <span style={on ? { color: bandColor(n) } : undefined}>{word.charAt(0)}</span>
              {word.slice(1)}
            </span>
          </span>
        );
      })}
      </span>
    </span>
  );
}

function ItemList({ items }: { items: readonly FichaItem[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item.name} className="text-sm leading-snug">
          <span className="font-semibold text-[var(--foreground)]">{item.name}</span>
          {item.span ? (
            <span className="ml-1.5 inline-flex rounded-full bg-[var(--warning-soft)] px-2 py-px align-middle text-[11px] font-semibold text-[var(--warning-text)]">
              {item.span}
            </span>
          ) : null}
          {item.note ? (
            <span className="text-[var(--foreground-muted)]"> · {item.note}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function FichaBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[var(--surface-elevated)] px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)] [&>svg]:size-3.5">
        {icon}
        {title}
      </p>
      {children}
    </div>
  );
}

function Ficha({
  layer,
  headingId,
  onSelect,
  inline = false,
}: {
  layer: OsiLayer;
  headingId: string;
  onSelect: (n: OsiLayerNumber) => void;
  /** Dentro de la fila del acordeón: el nombre ya se ve en la fila. */
  inline?: boolean;
}) {
  const above = layer.number < 7 ? osiLayer((layer.number + 1) as OsiLayerNumber) : null;
  const below = layer.number > 1 ? osiLayer((layer.number - 1) as OsiLayerNumber) : null;
  return (
    <div className="space-y-3">
      {inline ? (
        <div>
          <h3 id={headingId} className="sr-only">
            Capa {layer.number} · {layer.name}
          </h3>
          <TcpIpPill n={layer.number} />
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <LayerNumber n={layer.number} />
          <div className="min-w-0">
            <h3
              id={headingId}
              className="text-lg font-semibold leading-tight tracking-tight text-[var(--foreground)]"
            >
              Capa {layer.number} · {layer.name}
            </h3>
            <TcpIpPill n={layer.number} className="mt-1.5" />
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
          ¿Qué hace?
        </p>
        <p className="mt-1 text-base leading-relaxed text-[var(--foreground)]">{layer.does}</p>
      </div>

      <p className="text-sm text-[var(--foreground-muted)]">
        Unidad de datos:{" "}
        <span className="font-semibold text-[var(--foreground)]">{layer.pdu}</span>
      </p>

      <FichaBlock icon={<Cpu aria-hidden />} title="En un sistema físico">
        <ItemList items={layer.physical} />
      </FichaBlock>

      <FichaBlock icon={<Cloud aria-hidden />} title="En AWS">
        {layer.aws.length > 0 ? (
          <ItemList items={layer.aws} />
        ) : (
          <p className="mt-2 text-sm leading-snug text-[var(--foreground-muted)]">
            {layer.awsNone}
          </p>
        )}
      </FichaBlock>

      <div className="rounded-xl px-3.5 py-3" style={{ backgroundColor: tint(bandColor(layer.number), 10) }}>
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
          Para recordar
        </p>
        <p className="mt-1 text-sm">
          <Mnemonic active={layer.number} />
        </p>
        <p className="mt-1.5 text-sm text-[var(--foreground)]">{layer.tip}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {above ? (
          <Button variant="secondary" size="sm" onClick={() => onSelect(above.number)}>
            <ArrowUp className="size-4" aria-hidden />
            Capa {above.number} · {above.name}
          </Button>
        ) : null}
        {below ? (
          <Button variant="secondary" size="sm" onClick={() => onSelect(below.number)}>
            <ArrowDown className="size-4" aria-hidden />
            Capa {below.number} · {below.name}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function ComparisonTable() {
  return (
    <section aria-labelledby="comparativa" className="mt-12 scroll-mt-24" id="comparativa-osi">
      <SectionTitle id="comparativa">Comparativa OSI vs TCP/IP</SectionTitle>
      <p className="mt-1 text-sm text-[var(--foreground-muted)]">
        Todo en una tabla. Desliza de lado en el móvil.
      </p>
      <Card padding="none" className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
          <caption className="sr-only">
            Capas del modelo OSI con lo que hacen, su unidad de datos, ejemplos físicos, servicios
            de AWS y la capa TCP/IP equivalente
          </caption>
          <thead className="text-xs uppercase tracking-wide text-[var(--foreground-muted)]">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Capa OSI</th>
              <th scope="col" className="px-4 py-3 font-semibold">Qué hace</th>
              <th scope="col" className="px-4 py-3 font-semibold">Unidad</th>
              <th scope="col" className="px-4 py-3 font-semibold">Sistema físico</th>
              <th scope="col" className="px-4 py-3 font-semibold">En AWS</th>
              <th scope="col" className="px-4 py-3 font-semibold">TCP/IP</th>
            </tr>
          </thead>
          <tbody>
            {OSI_LAYERS.map((layer) => {
              const tcp = tcpIpForOsi(layer.number);
              const first = tcp.osi[0] === layer.number;
              return (
                <tr key={layer.number} className="border-t border-[var(--border)] align-top">
                  <th scope="row" className="px-4 py-3 font-semibold text-[var(--foreground)]">
                    <span className="tabular-nums" style={{ color: tcp.color }}>
                      {layer.number}
                    </span>{" "}
                    {layer.name}
                  </th>
                  <td className="px-4 py-3 text-[var(--foreground-muted)]">{layer.does}</td>
                  <td className="px-4 py-3 text-[var(--foreground)]">{layer.pdu}</td>
                  <td className="px-4 py-3 text-[var(--foreground-muted)]">
                    {layer.physical.map((p) => p.name).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-[var(--foreground-muted)]">
                    {layer.aws.length > 0
                      ? layer.aws.map((a) => (a.span ? `${a.name} (${a.span})` : a.name)).join(", ")
                      : "—"}
                  </td>
                  {first ? (
                    <td
                      rowSpan={tcp.osi.length}
                      className="border-l-4 px-4 py-3"
                      style={{ borderColor: tcp.color, backgroundColor: tint(tcp.color, 10) }}
                    >
                      <span className="block font-semibold" style={{ color: tcp.color }}>
                        {tcp.number} · {tcp.name}
                      </span>
                      <span className="mt-1 block text-xs text-[var(--foreground-muted)]">
                        {tcp.summary}
                      </span>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
      <ul className="mt-4 space-y-2 text-sm text-[var(--foreground-muted)]">
        <li>
          <span className="font-semibold text-[var(--foreground)]">OSI</span> tiene 7 capas y sirve
          para explicar y estudiar redes.{" "}
          <span className="font-semibold text-[var(--foreground)]">TCP/IP</span> tiene 4 y es el que
          usa Internet en la práctica.
        </li>
        <li>
          Security Groups y Network ACL filtran por IP y por puerto, así que trabajan en las capas
          3 y 4.
        </li>
      </ul>
    </section>
  );
}

export function OsiLearn({
  selected,
  visited,
  jump,
  onSelect,
  onPractice,
  practiceLabel,
}: {
  selected: OsiLayerNumber | null;
  visited: ReadonlySet<OsiLayerNumber>;
  /** Cambia para pedir que se muestre la capa seleccionada (p. ej. desde el resultado). */
  jump: number;
  onSelect: (n: OsiLayerNumber, opts?: { toggle?: boolean }) => void;
  onPractice: () => void;
  practiceLabel: string;
}) {
  const layer = selected ? osiLayer(selected) : null;

  const handledJump = useRef(0);
  useEffect(() => {
    if (jump === handledJump.current || !selected) return;
    handledJump.current = jump;
    const el = document.getElementById(`capa-btn-${selected}`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    el.focus({ preventScroll: true });
  }, [jump, selected]);

  return (
    <div>
      <h2
        data-step-heading
        tabIndex={-1}
        className="text-2xl font-bold tracking-tight text-[var(--foreground)] outline-none sm:text-3xl"
      >
        Aprende las capas
      </h2>
      <p className="mt-2 max-w-prose text-base leading-relaxed text-[var(--foreground)]">
        Toca cada capa para abrir su ficha. Cuando ya las tengas claras, pasa a practicar: será
        una cosa a la vez.
      </p>
      <Card variant="flat" padding="sm" className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
            <Info className="size-4 shrink-0 text-[var(--accent)]" aria-hidden />
            Cada ficha tiene 4 cosas
          </p>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Qué hace la capa, su unidad de datos, qué pieza de un sistema real la representa y qué
            servicio de AWS vive ahí. La franja de color de la derecha es la capa TCP/IP
            equivalente.{" "}
            <a
              href="#comparativa-osi"
              className={cn("rounded-sm font-semibold text-[var(--foreground)] underline underline-offset-4", FOCUS_RING)}
            >
              Ver comparativa
            </a>
          </p>
          <div className="mt-3 flex items-center gap-3">
            <ProgressBar
              value={visited.size}
              max={7}
              label={`Has visto ${visited.size} de 7 capas`}
              className="max-w-48"
            />
            <span className="shrink-0 text-xs font-semibold tabular-nums text-[var(--foreground-muted)]">
              Has visto {visited.size} de 7
            </span>
          </div>
        </div>
        <Button className="shrink-0" onClick={onPractice}>
          <Gamepad2 className="size-4" aria-hidden />
          {practiceLabel}
        </Button>
      </Card>

      <p className="mt-5 text-sm text-[var(--foreground-muted)]">
        Para recordarlas de 7 a 1: <Mnemonic />
      </p>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <LayerBoard
          label="Capas del modelo OSI y su equivalente en TCP/IP"
          renderLayer={(l) => {
            const open = selected === l.number;
            const seen = visited.has(l.number);
            return (
              <div
                className={cn(
                  "h-full rounded-xl border-l-4 bg-[var(--surface)] motion-safe:transition-colors",
                  open && "bg-[var(--surface-elevated)]",
                )}
                style={{
                  borderColor: open ? bandColor(l.number) : tint(bandColor(l.number), 40),
                  boxShadow: open ? `inset 0 0 0 1px ${tint(bandColor(l.number), 60)}` : undefined,
                }}
              >
                <button
                  id={`capa-btn-${l.number}`}
                  type="button"
                  aria-expanded={open}
                  aria-controls={`ficha-${l.number}`}
                  aria-label={`Capa ${l.number} · ${l.name}: ver ficha${seen ? " (ya la viste)" : ""}`}
                  onClick={() => onSelect(l.number, { toggle: true })}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-3 rounded-r-xl px-3 py-2.5 text-left hover:bg-[var(--surface-hover)]",
                    FOCUS_RING,
                  )}
                >
                  <LayerNumber n={l.number} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold leading-tight text-[var(--foreground)]">
                      {l.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--foreground-muted)]">
                      {l.pdu}
                    </span>
                  </span>
                  {seen ? (
                    <Check className="size-4 shrink-0 text-[var(--success-text)]" aria-hidden />
                  ) : null}
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-[var(--foreground-muted)] motion-safe:transition-transform lg:-rotate-90",
                      open && "rotate-180 lg:-rotate-90",
                    )}
                    aria-hidden
                  />
                </button>
                {open ? (
                  <div
                    id={`ficha-${l.number}`}
                    role="region"
                    aria-labelledby={`ficha-${l.number}-titulo`}
                    className="px-3 pb-4 pt-1 lg:hidden"
                  >
                    <Ficha
                      layer={l}
                      headingId={`ficha-${l.number}-titulo`}
                      onSelect={onSelect}
                      inline
                    />
                  </div>
                ) : null}
              </div>
            );
          }}
        />

        <Card as="aside" aria-label="Ficha de la capa" className="hidden lg:block">
          {layer ? (
            <Ficha layer={layer} headingId="ficha-panel-titulo" onSelect={onSelect} />
          ) : (
            <p className="text-sm text-[var(--foreground-muted)]">
              Elige una capa de la izquierda para ver su ficha.
            </p>
          )}
        </Card>
      </div>

      <ComparisonTable />
    </div>
  );
}

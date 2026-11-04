import * as React from "react";
import {
  OSI_LAYERS,
  TCPIP_LAYERS,
  tcpIpForOsi,
  type OsiLayer,
  type OsiLayerNumber,
  type TcpIpLayer,
} from "@/lib/minigames/osi-tcpip";
import { cn } from "@/lib/utils";

export function bandColor(n: OsiLayerNumber) {
  return tcpIpForOsi(n).color;
}

export function tint(color: string, pct: number) {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

function osiRange(layer: TcpIpLayer) {
  const first = layer.osi[0];
  const last = layer.osi[layer.osi.length - 1];
  return first === last ? `OSI ${first}` : `OSI ${first}–${last}`;
}

/** Etiqueta pequeña con la capa TCP/IP equivalente, en su color. */
export function TcpIpPill({ n, className }: { n: OsiLayerNumber; className?: string }) {
  const tcp = tcpIpForOsi(n);
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        className,
      )}
      style={{ backgroundColor: tint(tcp.color, 16), color: tcp.color }}
    >
      TCP/IP: {tcp.name}
    </span>
  );
}

function Band({ layer, style }: { layer: TcpIpLayer; style: React.CSSProperties }) {
  return (
    <div
      style={{ ...style, borderColor: layer.color, backgroundColor: tint(layer.color, 12) }}
      className="flex min-w-0 flex-col justify-center rounded-r-xl border-l-4 px-2 py-2 sm:px-3"
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--foreground-muted)]">
        Capa {layer.number}
      </span>
      <span
        className="text-xs font-bold leading-tight sm:text-base"
        style={{ color: layer.color }}
      >
        {layer.name}
      </span>
      <span className="mt-0.5 text-xs text-[var(--foreground-muted)]">{osiRange(layer)}</span>
    </div>
  );
}

/**
 * Las 7 capas OSI a la izquierda y, a la derecha, una franja por capa TCP/IP
 * que abarca las filas OSI equivalentes.
 */
export function LayerBoard({
  renderLayer,
  label,
}: {
  renderLayer: (layer: OsiLayer) => React.ReactNode;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid grid-cols-[minmax(0,1fr)_5.5rem] gap-x-2 gap-y-2 sm:grid-cols-[minmax(0,1fr)_9rem] sm:gap-x-3"
      style={{ gridTemplateRows: "auto repeat(7, auto)" }}
    >
      <p
        className="px-1 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
        style={{ gridColumn: 1, gridRow: 1 }}
      >
        Modelo OSI · 7 capas
      </p>
      <p
        className="px-1 text-xs font-semibold uppercase tracking-wide text-[var(--foreground-muted)]"
        style={{ gridColumn: 2, gridRow: 1 }}
      >
        TCP/IP · 4 capas
      </p>
      {OSI_LAYERS.map((layer, i) => (
        <div key={layer.number} className="min-w-0" style={{ gridColumn: 1, gridRow: i + 2 }}>
          {renderLayer(layer)}
        </div>
      ))}
      {TCPIP_LAYERS.map((layer) => {
        const start = OSI_LAYERS.findIndex((l) => l.number === layer.osi[0]) + 2;
        return (
          <Band
            key={layer.id}
            layer={layer}
            style={{ gridColumn: 2, gridRow: `${start} / span ${layer.osi.length}` }}
          />
        );
      })}
    </div>
  );
}

export function LayerNumber({ n, className }: { n: OsiLayerNumber; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums",
        className,
      )}
      style={{ backgroundColor: tint(bandColor(n), 18), color: bandColor(n) }}
    >
      {n}
    </span>
  );
}

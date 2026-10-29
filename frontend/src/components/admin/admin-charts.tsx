import { cn } from "@/lib/utils";

/** "2026-10-28" → "28 oct" (civil date, no timezone shift). */
export function shortDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", timeZone: "UTC" })
    .format(d)
    .replace(".", "");
}

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * pow >= value) ?? 10;
  return step * pow;
}

const W = 100;
const H = 40;

function linePath(values: (number | null)[], max: number): string {
  const n = values.length;
  let d = "";
  let pen = false;
  values.forEach((v, i) => {
    if (v === null) {
      pen = false;
      return;
    }
    const x = ((i + 0.5) / n) * W;
    const y = H - (v / max) * H;
    d += `${pen ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
    pen = true;
  });
  return d;
}

export type ChartPoint = {
  date: string;
  bar: number;
  line?: number | null;
};

const AXIS = "flex h-40 flex-col justify-between py-0.5 text-[10px] tabular-nums text-[var(--foreground-muted)]";

/**
 * Daily bars with an optional line on its own scale. The SVG stretches to the
 * container; all text is HTML so it never distorts.
 */
export function DailyChart({
  points,
  barLabel,
  lineLabel,
  formatLine = (v) => String(v),
  lineMax,
  className,
}: {
  points: ChartPoint[];
  barLabel: string;
  lineLabel?: string;
  formatLine?: (v: number) => string;
  /** Fixed top of the line scale (e.g. 1 for rates). */
  lineMax?: number;
  className?: string;
}) {
  const barMax = niceMax(Math.max(0, ...points.map((p) => p.bar)));
  const lineValues = points.map((p) => p.line ?? null);
  const hasLine = lineLabel !== undefined && lineValues.some((v) => v !== null);
  const lMax = lineMax ?? niceMax(Math.max(0, ...lineValues.map((v) => v ?? 0)));
  const n = Math.max(points.length, 1);
  const slot = W / n;
  const barW = slot * 0.62;
  const tickEvery = n > 14 ? 7 : n > 7 ? 2 : 1;

  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--foreground-muted)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-[color-mix(in_srgb,var(--accent)_75%,transparent)]" aria-hidden />
          {barLabel}
        </span>
        {hasLine ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-3.5 rounded-full bg-[var(--foreground)]" aria-hidden />
            {lineLabel}
          </span>
        ) : null}
      </div>
      <div className="flex gap-2">
        <div className={cn(AXIS, "w-6 text-right")}>
          <span>{barMax}</span>
          <span>{barMax / 2}</span>
          <span>0</span>
        </div>
        <div className="relative h-40 min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-px w-full bg-[var(--surface-hover)] opacity-50" />
            ))}
          </div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 overflow-visible"
            style={{ width: "100%", height: "100%" }}
            role="img"
            aria-label={`${barLabel}${hasLine ? ` y ${lineLabel}` : ""} por día`}
          >
            {points.map((p, i) => {
              const h = (p.bar / barMax) * H;
              const lineText =
                hasLine && p.line != null ? ` · ${formatLine(p.line)} ${lineLabel?.toLowerCase()}` : "";
              return (
                <g key={p.date}>
                  <rect
                    x={i * slot + (slot - barW) / 2}
                    y={H - h}
                    width={barW}
                    height={Math.max(h, p.bar > 0 ? 0.4 : 0)}
                    rx={0.6}
                    className="fill-[color-mix(in_srgb,var(--accent)_75%,transparent)]"
                  />
                  <rect x={i * slot} y={0} width={slot} height={H} fill="transparent">
                    <title>{`${shortDate(p.date)}: ${p.bar} ${barLabel.toLowerCase()}${lineText}`}</title>
                  </rect>
                </g>
              );
            })}
            {hasLine ? (
              <path
                d={linePath(lineValues, lMax)}
                fill="none"
                stroke="var(--foreground)"
                strokeWidth={1.75}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
              />
            ) : null}
          </svg>
        </div>
        {hasLine ? (
          <div className={cn(AXIS, "w-8")}>
            <span>{formatLine(lMax)}</span>
            <span>{formatLine(lMax / 2)}</span>
            <span>{formatLine(0)}</span>
          </div>
        ) : null}
      </div>
      <div
        className={cn("mt-2 flex text-[10px] tabular-nums text-[var(--foreground-muted)]", hasLine ? "ml-8 mr-10" : "ml-8")}
        aria-hidden
      >
        {points.map((p, i) => (
          <span key={p.date} className="flex-1 whitespace-nowrap text-center">
            {(n - 1 - i) % tickEvery === 0 ? shortDate(p.date) : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Tiny trend line for KPI tiles. */
export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  if (values.length < 2) return null;
  const max = Math.max(1, ...values);
  const d = linePath(values, max);
  const first = ((0.5 / values.length) * W).toFixed(2);
  const last = (((values.length - 0.5) / values.length) * W).toFixed(2);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("w-full overflow-visible", className)}
      style={{ height: "2rem" }}
      aria-hidden
    >
      <path d={`${d}L${last},${H}L${first},${H}Z`} className="fill-[var(--accent-soft)]" />
      <path
        d={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Horizontal share bar, e.g. funnel steps. */
export function ShareBar({
  label,
  value,
  total,
  hint,
}: {
  label: string;
  value: number;
  total: number;
  hint?: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-[var(--foreground)]">{label}</span>
        <span className="shrink-0 tabular-nums">
          <span className="font-semibold text-[var(--foreground)]">{value}</span>
          <span className="ml-1.5 text-xs text-[var(--foreground-muted)]">{pct}%</span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
        <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
      </div>
      {hint ? <p className="mt-1 text-[11px] text-[var(--foreground-muted)]">{hint}</p> : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { ChevronRight, Shuffle } from "lucide-react";
import type { StudySize, TopicProgressRow } from "@aps/shared";
import { SessionSizePicker } from "@/components/study/session-size-picker";
import { buttonVariants } from "@/components/ui/button";
import { STUDY_GROUPS, studyStartHref } from "@/lib/study-categories";
import { cn } from "@/lib/utils";
import {
  PRESETS,
  WEAKEST_COUNT,
  buildTopicOptions,
  builderStartHref,
  loadBuilderPrefs,
  plural,
  presetCategoryIds,
  sameIds,
  saveBuilderPrefs,
  type BuilderPreset,
  type Distribution,
} from "./builder-model";
import { DistributionPicker } from "./distribution-picker";
import { TopicOptionRow } from "./topic-option";

/** Temas / tamaño pedidos por la URL sin `start` (p. ej. `?category=linux`). */
export type BuilderPreselect = {
  topicIds: string[] | null;
  size: StudySize | null;
};

function Step({
  n,
  id,
  title,
  children,
}: {
  n: number;
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="mt-8 [@media(max-height:500px)]:mt-6"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-hover)] text-sm font-bold tabular-nums text-[var(--foreground)]"
        >
          {n}
        </span>
        <h3
          id={id}
          className="font-sans text-lg font-bold tracking-tight text-[var(--foreground)]"
        >
          {title}
        </h3>
      </div>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}

export function SessionBuilder({
  progressRows,
  knownTopicIds,
  preselect,
}: {
  progressRows: TopicProgressRow[];
  knownTopicIds: string[];
  preselect: BuilderPreselect | null;
}) {
  const router = useRouter();
  const uid = useId();
  const options = useMemo(
    () => buildTopicOptions(progressRows, knownTopicIds),
    [progressRows, knownTopicIds],
  );
  const optionIds = useMemo<string[]>(
    () => options.map((o) => o.cat.id),
    [options],
  );

  // Only mounts client-side after boot, so localStorage is safe to read here.
  const [initial] = useState(() => {
    const saved = loadBuilderPrefs();
    const restored = (saved.categoryIds ?? []).filter((id) =>
      optionIds.includes(id),
    );
    const categoryIds = restored.length ? restored : optionIds;
    const preset: BuilderPreset | null = !saved.categoryIds
      ? "all"
      : saved.preset &&
          sameIds(presetCategoryIds(saved.preset, options), categoryIds)
        ? saved.preset
        : null;
    return {
      categoryIds,
      preset,
      size: saved.size ?? (10 as StudySize),
      distribution: saved.distribution ?? ("balanced" as Distribution),
    };
  });
  const [selected, setSelected] = useState<string[]>(initial.categoryIds);
  const [preset, setPreset] = useState<BuilderPreset | null>(initial.preset);
  const [size, setSize] = useState<StudySize>(initial.size);
  const [distribution, setDistribution] = useState<Distribution>(
    initial.distribution,
  );
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!preselect) return;
    if (preselect.topicIds?.length) {
      const wanted = new Set(preselect.topicIds);
      const ids = options
        .filter((o) => o.topicIds.some((t) => wanted.has(t)))
        .map((o) => o.cat.id);
      if (ids.length) {
        setSelected(ids);
        setPreset(
          PRESETS.find((p) => sameIds(presetCategoryIds(p.id, options), ids))
            ?.id ?? null,
        );
      }
    }
    if (preselect.size) setSize(preselect.size);
  }, [preselect, options]);

  useEffect(() => {
    saveBuilderPrefs({ categoryIds: selected, size, distribution, preset });
  }, [selected, size, distribution, preset]);

  const chosen = options.filter((o) => selected.includes(o.cat.id));
  const topicIds = chosen.flatMap((o) => o.topicIds);
  const pool = options.every((o) => o.total !== null)
    ? chosen.reduce((sum, o) => sum + (o.total ?? 0), 0)
    : null;
  const cards = pool !== null && chosen.length ? Math.min(size, pool) : size;
  const shortPool = pool !== null && chosen.length > 0 && pool < size ? pool : null;
  const canStart = chosen.length > 0 && !starting;
  const distributionLabel = distribution === "balanced" ? "parejo" : "al azar";
  const summaryMeta = [
    plural(chosen.length, "tema", "temas"),
    pool !== null ? `de un pool de ${pool}` : null,
    distributionLabel,
  ]
    .filter(Boolean)
    .join(" · ");

  function applyPreset(id: BuilderPreset) {
    setSelected(presetCategoryIds(id, options));
    setPreset(id);
  }

  function toggleTopic(catId: string) {
    setSelected((prev) =>
      prev.includes(catId) ? prev.filter((x) => x !== catId) : [...prev, catId],
    );
    setPreset(null);
  }

  function toggleGroup(ids: string[], allOn: boolean) {
    setSelected((prev) =>
      allOn
        ? prev.filter((x) => !ids.includes(x))
        : [...prev, ...ids.filter((x) => !prev.includes(x))],
    );
    setPreset(null);
  }

  function start() {
    if (!canStart) return;
    setStarting(true);
    router.push(builderStartHref(size, topicIds, distribution), {
      scroll: false,
    });
  }

  const startButton = (hintId: string, className?: string) => (
    <button
      type="button"
      onClick={start}
      disabled={!canStart}
      aria-describedby={!chosen.length ? hintId : undefined}
      className={cn(buttonVariants({ size: "lg" }), className)}
    >
      {starting ? "Iniciando…" : "Iniciar partida"}
    </button>
  );

  return (
    <div
      data-session-builder
      className={cn(
        "min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] xl:gap-14",
        "[@media(max-height:500px)]:md:grid [@media(max-height:500px)]:md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] [@media(max-height:500px)]:md:items-start [@media(max-height:500px)]:md:gap-6",
      )}
    >
      <div className="min-w-0">
        <Link
          href={studyStartHref(size, null)}
          className="group flex items-center gap-3.5 rounded-2xl bg-[var(--surface-elevated)] px-4 py-3 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.7)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:px-5"
        >
          <span
            aria-hidden
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]"
          >
            <Shuffle className="size-[18px]" />
          </span>
          <span className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-3">
            <span className="block font-bold text-[var(--foreground)]">
              Partida rápida
            </span>
            <span className="block text-sm text-[var(--foreground-muted)]">
              {size} cartas al azar de todos los temas
            </span>
          </span>
          <span className="hidden shrink-0 text-sm font-semibold text-[var(--foreground)] sm:inline">
            Jugar ya
          </span>
          <ChevronRight
            aria-hidden
            className="size-5 shrink-0 text-[var(--foreground-muted)] transition-transform motion-safe:group-hover:translate-x-0.5"
          />
        </Link>

        <header className="mt-10 [@media(max-height:500px)]:mt-7">
          <h2 className="font-sans text-3xl font-extrabold leading-none tracking-tight text-[var(--foreground)] sm:text-4xl">
            Arma tu partida
          </h2>
          <p className="mt-2.5 text-sm text-[var(--foreground-muted)]">
            Tú decides qué temas entran, cuántas cartas y cómo se reparten.
          </p>
        </header>

        <Step n={1} id={`${uid}-que`} title="¿Qué quieres estudiar?">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Atajos de selección"
          >
            {PRESETS.map((p) => {
              if (p.id === "weakest" && pool === null) return null;
              const active = preset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => applyPreset(p.id)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                    active
                      ? "bg-[color-mix(in_srgb,var(--accent)_24%,var(--surface-elevated))] text-[var(--foreground)]"
                      : "bg-[var(--surface-elevated)] text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          {preset === "weakest" ? (
            <p className="mt-2.5 text-xs text-[var(--foreground-muted)]">
              Tus {WEAKEST_COUNT} temas con menor porcentaje de cartas dominadas.
            </p>
          ) : null}

          {STUDY_GROUPS.map((group) => {
            const groupOptions = options.filter((o) => o.cat.group === group.id);
            if (!groupOptions.length) return null;
            const ids = groupOptions.map((o) => o.cat.id);
            const on = ids.filter((id) => selected.includes(id)).length;
            const allOn = on === ids.length;
            const headingId = `${uid}-grupo-${group.id}`;
            return (
              <div key={group.id} className="mt-5 [@media(max-height:500px)]:mt-4">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <p
                    id={headingId}
                    className="text-sm font-semibold text-[var(--foreground)]"
                  >
                    {group.title}
                    <span className="ml-2 font-normal tabular-nums text-[var(--foreground-muted)]">
                      {on} de {ids.length}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleGroup(ids, allOn)}
                    className="rounded-full bg-[var(--surface-elevated)] px-3.5 py-1.5 text-xs font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    aria-label={`${allOn ? "Quitar todos" : "Elegir todos"}: ${group.title}`}
                  >
                    {allOn ? "Quitar todos" : "Elegir todos"}
                  </button>
                </div>
                <div
                  role="group"
                  aria-labelledby={headingId}
                  className="mt-2 grid gap-1.5 sm:grid-cols-2"
                >
                  {groupOptions.map((o) => (
                    <TopicOptionRow
                      key={o.cat.id}
                      option={o}
                      checked={selected.includes(o.cat.id)}
                      onToggle={() => toggleTopic(o.cat.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </Step>

        <Step n={2} id={`${uid}-cuantas`} title="¿Cuántas cartas?">
          <SessionSizePicker
            value={size}
            onChange={setSize}
            labelledBy={`${uid}-cuantas`}
            className="max-w-sm"
          />
          {shortPool !== null ? (
            <p className="mt-3 max-w-md text-xs leading-relaxed text-[var(--foreground-muted)]">
              Tu selección tiene{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {plural(shortPool, "carta", "cartas")}
              </span>
              , así que la partida será de {shortPool} (no de {size}). Suma
              temas si quieres más.
            </p>
          ) : null}
        </Step>

        <Step n={3} id={`${uid}-reparto`} title="¿Cómo se reparten?">
          <DistributionPicker
            value={distribution}
            onChange={setDistribution}
            labelledBy={`${uid}-reparto`}
          />
        </Step>

        <div
          className={cn(
            "sticky bottom-0 z-30 -mx-6 mt-8 flex items-center gap-3 bg-[var(--background)] px-6 pt-3 shadow-[0_-16px_28px_-18px_rgba(0,0,0,0.85)] lg:hidden",
            "pb-[max(0.75rem,env(safe-area-inset-bottom))] [@media(max-height:500px)]:md:hidden",
          )}
        >
          <div className="min-w-0 flex-1" aria-live="polite">
            <p className="truncate font-bold tabular-nums text-[var(--foreground)]">
              {chosen.length ? plural(cards, "carta", "cartas") : "Sin temas"}
            </p>
            <p
              id={`${uid}-hint-bar`}
              className="truncate text-xs text-[var(--foreground-muted)]"
            >
              {chosen.length
                ? `${plural(chosen.length, "tema", "temas")} · ${distributionLabel}`
                : "Elige al menos un tema"}
            </p>
          </div>
          {startButton(`${uid}-hint-bar`, "h-11 shrink-0 px-5 text-sm")}
        </div>
      </div>

      <aside
        aria-label="Resumen de tu partida"
        className={cn(
          "hidden lg:sticky lg:top-24 lg:block",
          "[@media(max-height:500px)]:md:sticky [@media(max-height:500px)]:md:top-16 [@media(max-height:500px)]:md:block",
        )}
      >
        <div className="rounded-2xl bg-[var(--surface-elevated)] p-5 shadow-[0_18px_36px_-18px_rgba(0,0,0,0.55)] xl:p-6 [@media(max-height:500px)]:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
            Tu partida
          </p>
          <p
            className="mt-2 font-sans text-4xl font-extrabold leading-none tracking-tight tabular-nums text-[var(--foreground)] [@media(max-height:500px)]:mt-1.5 [@media(max-height:500px)]:text-3xl"
            aria-live="polite"
          >
            {chosen.length ? plural(cards, "carta", "cartas") : "Sin temas"}
          </p>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            {chosen.length ? summaryMeta : "Ningún tema elegido"}
          </p>
          {chosen.length ? (
            <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[var(--foreground-muted)] [@media(max-height:500px)]:hidden">
              {chosen.map((o) => o.cat.shortTitle).join(", ")}
            </p>
          ) : null}
          {shortPool !== null ? (
            <p className="mt-3 text-xs leading-relaxed text-[var(--foreground-muted)] [@media(max-height:500px)]:mt-2">
              Pediste {size}, pero tu selección solo tiene {shortPool}.
            </p>
          ) : null}
          {startButton(
            `${uid}-hint`,
            "mt-5 w-full [@media(max-height:500px)]:mt-3 [@media(max-height:500px)]:h-11",
          )}
          {!chosen.length ? (
            <p
              id={`${uid}-hint`}
              className="mt-2.5 text-center text-xs text-[var(--foreground-muted)]"
            >
              Elige al menos un tema para empezar.
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import type { StudySize, TopicProgressRow } from "@aps/shared";
import { Mascot } from "@/components/brand/mascot";
import { SessionSizePicker } from "@/components/study/session-size-picker";
import { Button } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { SectionTitle } from "@/components/ui/page";
import { STUDY_GROUPS } from "@/lib/study-categories";
import { cn } from "@/lib/utils";
import {
  BUILDER_GRID,
  BUILDER_HALVES,
  BUILDER_MAIN,
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
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="mt-6 [@media(max-height:500px)]:mt-4"
    >
      <SectionTitle as="h3" id={id}>
        {title}
      </SectionTitle>
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

  const startButton = (
    hintId: string,
    size: "default" | "lg",
    className?: string,
  ) => (
    <Button
      type="button"
      size={size}
      onClick={start}
      disabled={!canStart}
      aria-describedby={!chosen.length ? hintId : undefined}
      className={className}
    >
      {starting ? "Iniciando…" : "Iniciar partida"}
    </Button>
  );

  return (
    <div
      data-session-builder
      className={cn(
        BUILDER_GRID,
        "[@media(max-height:500px)]:md:grid [@media(max-height:500px)]:md:grid-cols-12 [@media(max-height:500px)]:md:items-start [@media(max-height:500px)]:md:gap-6",
      )}
    >
      <div className={BUILDER_MAIN}>
        <header className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-sans text-2xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] sm:text-3xl">
              Arma tu partida
            </h2>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Elige temas, cuántas cartas y cómo se reparten.
            </p>
          </div>
          <Mascot
            pose="laptop"
            size="lg"
            glow={false}
            className="h-28 w-32 shrink-0 sm:h-44 sm:w-52 lg:h-56 lg:w-64"
          />
        </header>

        <div
          className={cn(
            BUILDER_HALVES,
            "mt-6 gap-3 md:gap-5 lg:gap-6 [@media(max-height:500px)]:mt-4",
          )}
        >
          <Card as="section" padding="sm" aria-labelledby={`${uid}-cuantas`}>
            <CardLabel id={`${uid}-cuantas`}>Cuántas cartas</CardLabel>
            <SessionSizePicker
              value={size}
              onChange={setSize}
              labelledBy={`${uid}-cuantas`}
              className="mt-2"
            />
          </Card>
          <Card as="section" padding="sm" aria-labelledby={`${uid}-reparto`}>
            <CardLabel id={`${uid}-reparto`}>Cómo se reparten</CardLabel>
            <div className="mt-3">
              <DistributionPicker
                value={distribution}
                onChange={setDistribution}
                labelledBy={`${uid}-reparto`}
              />
            </div>
          </Card>
        </div>
        {shortPool !== null ? (
          <p className="mt-3 text-xs leading-relaxed text-[var(--foreground-muted)]">
            Tu selección tiene {plural(shortPool, "carta", "cartas")}, así que
            la partida será de {shortPool}.
          </p>
        ) : null}

        <Step id={`${uid}-que`} title="Qué temas entran">
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
                    FOCUS_RING,
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
                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    onClick={() => toggleGroup(ids, allOn)}
                    aria-label={`${allOn ? "Quitar todos" : "Elegir todos"}: ${group.title}`}
                  >
                    {allOn ? "Quitar todos" : "Elegir todos"}
                  </Button>
                </div>
                <div
                  role="group"
                  aria-labelledby={headingId}
                  className={cn(BUILDER_HALVES, "mt-2 gap-1.5 md:gap-x-5 lg:gap-x-6")}
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

        <div
          className={cn(
            "sticky bottom-0 z-30 -mx-5 mt-8 flex items-center gap-3 bg-[var(--background)] px-5 pt-3 shadow-[0_-16px_28px_-18px_rgba(0,0,0,0.85)] sm:-mx-6 sm:px-6 lg:hidden",
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
          {startButton(`${uid}-hint-bar`, "default", "shrink-0")}
        </div>
      </div>

      <aside
        aria-label="Resumen de tu partida"
        className={cn(
          "hidden lg:sticky lg:top-24 lg:col-span-4 lg:block",
          "[@media(max-height:500px)]:md:sticky [@media(max-height:500px)]:md:top-16 [@media(max-height:500px)]:md:col-span-4 [@media(max-height:500px)]:md:block",
        )}
      >
        <Card className="[@media(max-height:500px)]:p-4">
          <CardLabel as="p">Tu partida</CardLabel>
          <p
            className="mt-2 text-4xl font-extrabold leading-none tracking-tight tabular-nums text-[var(--foreground)] [@media(max-height:500px)]:mt-1.5 [@media(max-height:500px)]:text-3xl"
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
            "lg",
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
        </Card>
      </aside>
    </div>
  );
}

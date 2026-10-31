"use client";

import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { useCallback, useState } from "react";
import type {
  ActiveSessionSummary,
  StudySize,
  TopicProgressRow,
} from "@aps/shared";
import { STUDY_MODE_LABELS } from "@aps/shared";
import { CustomizeSessionDialog } from "@/components/study/customize-session-dialog";
import { plural } from "@/components/study/session-builder/builder-model";
import { SessionSizePicker } from "@/components/study/session-size-picker";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, cardVariants } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import {
  STUDY_CATEGORIES,
  resolveCategoryTopicIds,
  scopeForTopicIds,
  studyStartHref,
  type StudyCategory,
} from "@/lib/study-categories";
import { cn } from "@/lib/utils";

/** Por defecto la partida mezcla todos los temas de ambos grupos. */
const DEFAULT_CATEGORY_IDS = STUDY_CATEGORIES.map((c) => c.id);

function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** "de todos los temas", "de servicios de seguridad", "de 3 temas elegidos"… */
function scopePhrase(topicIds: string[], known: string[], count: number): string {
  const scope = scopeForTopicIds(topicIds, known);
  if (scope.kind === "all") return "de todos los temas";
  if (scope.kind === "category") {
    if (scope.category.id === "aws") return "de todos los servicios de AWS";
    if (scope.category.id === "concepts") return "de todos los conceptos";
    return `de ${lowerFirst(scope.category.title)}`;
  }
  return `de ${plural(count, "tema elegido", "temas elegidos")}`;
}

/** Resumen corto de la selección bajo "Personalizar sesión". */
function selectionSummary(
  topicIds: string[],
  known: string[],
  cats: StudyCategory[],
): string {
  const scope = scopeForTopicIds(topicIds, known);
  if (scope.kind === "all") return "Todos los temas";
  if (scope.kind === "category") return scope.category.title;
  const services = cats.filter((c) => c.group === "aws").length;
  const modules = cats.length - services;
  return [
    services ? plural(services, "tipo de servicio", "tipos de servicio") : null,
    modules ? plural(modules, "módulo", "módulos") : null,
  ]
    .filter(Boolean)
    .join(" + ");
}

export function resumeHref(s: ActiveSessionSummary): string {
  if (s.mode === "EXAM_TIMED") return `/estudiar/examen?session=${s.id}`;
  if (s.mode === "WEAK_REVIEW") return "/mas-falladas";
  return `/estudiar?session=${s.id}`;
}

export function NewGameCard({
  topics,
  primarySession,
  className,
}: {
  topics: TopicProgressRow[];
  primarySession: ActiveSessionSummary | null;
  className?: string;
}) {
  const [gameSize, setGameSize] = useState<StudySize>(10);
  const [selectedCats, setSelectedCats] = useState<string[]>(DEFAULT_CATEGORY_IDS);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const closeCustomize = useCallback(() => setCustomizeOpen(false), []);

  const knownTopicIds = topics.map((t) => t.topicId);
  const availableCats = STUDY_CATEGORIES.filter(
    (c) => resolveCategoryTopicIds(c.id, knownTopicIds).length > 0,
  );
  const cardsByTopic = new Map(topics.map((t) => [t.topicId, t.total]));
  const cardCounts = Object.fromEntries(
    availableCats.map((c) => [
      c.id,
      resolveCategoryTopicIds(c.id, knownTopicIds).reduce(
        (sum, id) => sum + (cardsByTopic.get(id) ?? 0),
        0,
      ),
    ]),
  );
  const chosenCats = availableCats.filter((c) => selectedCats.includes(c.id));
  const chosenTopicIds = chosenCats.flatMap((c) =>
    resolveCategoryTopicIds(c.id, knownTopicIds),
  );
  const poolSize = chosenCats.reduce((sum, c) => sum + (cardCounts[c.id] ?? 0), 0);
  const isQuick = chosenCats.length === availableCats.length;
  const gameHref = studyStartHref(
    gameSize,
    isQuick ? null : chosenTopicIds,
    knownTopicIds,
  );
  const cardsInGame = poolSize ? Math.min(gameSize, poolSize) : gameSize;

  return (
    <>
      <div className={cn("flex flex-col gap-4", className)}>
        {primarySession ? (
          <div className="flex flex-col gap-2">
            <Link
              href={resumeHref(primarySession)}
              className={buttonVariants({ size: "lg", className: "w-full" })}
            >
              Continuar partida
            </Link>
            <p className="text-center text-xs text-[var(--foreground-muted)]">
              Tienes una partida en curso: {STUDY_MODE_LABELS[primarySession.mode]} ·{" "}
              {primarySession.answered}/{primarySession.size}
            </p>
          </div>
        ) : null}

        <section
          aria-labelledby="nueva-partida"
          data-tour="new-game"
          className="relative flex flex-1 flex-col pb-3 animate-deck-in"
        >
          <div
            aria-hidden
            className="absolute inset-x-6 bottom-0 top-6 rounded-2xl bg-[var(--surface-hover)] opacity-35"
          />
          <div
            aria-hidden
            className="absolute inset-x-3 bottom-1.5 top-3 rounded-2xl bg-[var(--surface-hover)] opacity-70 shadow-[var(--shadow-float)]"
          />

          <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-[var(--deck-face)] shadow-[var(--shadow-float)]">
            <div className="flex flex-1 flex-col px-5 pb-5 pt-6 sm:px-6">
              <h2
                id="nueva-partida"
                className="text-3xl font-extrabold leading-none tracking-tight text-[var(--foreground)] sm:text-4xl"
              >
                Nueva partida
              </h2>
              <p className="mt-2.5 text-sm text-[var(--foreground-muted)]">
                <span className="font-semibold tabular-nums text-[var(--foreground)]">
                  {plural(cardsInGame, "carta", "cartas")}
                </span>{" "}
                al azar {scopePhrase(chosenTopicIds, knownTopicIds, chosenCats.length)}
              </p>

              <div className="mt-auto space-y-2 pt-5">
                <Card variant="inset" padding="none" className="px-3 pb-2 pt-3">
                  <p
                    id="tamano-sesion"
                    className="px-1 text-sm font-semibold text-[var(--foreground)]"
                  >
                    Tamaño de la sesión
                  </p>
                  <SessionSizePicker
                    value={gameSize}
                    onChange={setGameSize}
                    labelledBy="tamano-sesion"
                    className="mt-1.5"
                  />
                </Card>

                <button
                  type="button"
                  onClick={() => setCustomizeOpen(true)}
                  aria-haspopup="dialog"
                  className={cn(
                    cardVariants({ variant: "inset", padding: "none" }),
                    "group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-hover)]",
                    FOCUS_RING,
                  )}
                >
                  <SlidersHorizontal
                    className="size-4 shrink-0 text-[var(--accent)]"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[var(--foreground)]">
                      Personalizar sesión
                    </span>
                    <span className="block text-xs text-[var(--foreground-muted)]">
                      Elige qué temas entran en tu partida
                    </span>
                    <Badge className="mt-1.5 max-w-full gap-1.5 text-[var(--foreground)] group-hover:bg-[var(--surface-elevated)]">
                      <span
                        aria-hidden
                        className="size-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                      />
                      <span className="min-w-0 truncate">
                        {selectionSummary(chosenTopicIds, knownTopicIds, chosenCats)}
                        {poolSize ? ` · ${plural(poolSize, "carta", "cartas")}` : ""}
                      </span>
                    </Badge>
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 text-[var(--foreground-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--foreground)]"
                    aria-hidden
                  />
                </button>
              </div>
            </div>

            <div className="bg-[var(--card-face)] px-5 py-4 sm:px-6">
              <Link
                href={gameHref}
                className={buttonVariants({
                  variant: primarySession ? "secondary" : "default",
                  size: "lg",
                  className: "w-full",
                })}
              >
                {isQuick ? "Iniciar partida rápida" : "Iniciar partida"}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <CustomizeSessionDialog
        open={customizeOpen}
        available={availableCats}
        selected={selectedCats}
        defaultSelection={DEFAULT_CATEGORY_IDS}
        cardCounts={cardCounts}
        sessionSize={gameSize}
        onClose={closeCustomize}
        onApply={(ids) => {
          setSelectedCats(ids);
          setCustomizeOpen(false);
        }}
      />
    </>
  );
}

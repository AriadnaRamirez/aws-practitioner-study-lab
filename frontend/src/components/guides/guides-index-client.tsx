"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Cloud,
  Download,
  Network,
  ServerCog,
  ShieldCheck,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import type { KnowledgeItem } from "@aps/shared";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/spinner";
import { STUDY_GROUPS } from "@/lib/study-categories";
import {
  fetchGuideKnowledge,
  guideConceptCount,
  guideSections,
  guidesInGroup,
  type StudyGuide,
  type StudyGuideId,
} from "@/lib/study-guides";
import { cn } from "@/lib/utils";

const GUIDE_ICONS: Record<StudyGuideId, LucideIcon> = {
  "servicios-aws": ServerCog,
  "conceptos-nube": Cloud,
  "conceptos-linux": Terminal,
  "conceptos-redes": Network,
  "conceptos-seguridad": ShieldCheck,
};

function conceptLabel(n: number) {
  return `${n} ${n === 1 ? "concepto" : "conceptos"}`;
}

function GuideCard({
  guide,
  items,
  featured = false,
  delayMs,
}: {
  guide: StudyGuide;
  items: KnowledgeItem[] | null;
  featured?: boolean;
  delayMs: number;
}) {
  const Icon = GUIDE_ICONS[guide.id];
  const count = items ? guideConceptCount(guide, items) : null;
  const sections = items && featured ? guideSections(guide, items) : null;
  const titleId = `guia-${guide.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "flex min-w-0 flex-col gap-5 rounded-2xl bg-[var(--surface)] p-5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.85)] motion-safe:animate-[fade-up_0.5s_ease-out_both] sm:p-6",
        featured && "lg:flex-row lg:items-center lg:justify-between lg:gap-8",
      )}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex min-w-0 items-start gap-4">
        <span
          aria-hidden
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-elevated)] text-[var(--foreground)]"
        >
          <Icon className="size-6" />
        </span>
        <div className="min-w-0">
          <h3
            id={titleId}
            className="text-lg font-bold leading-snug tracking-tight text-[var(--foreground)]"
          >
            {guide.title}
          </h3>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {guide.subtitle}
          </p>
          <p className="mt-2 text-sm font-semibold tabular-nums text-[var(--foreground)]">
            {count === null ? (
              <Skeleton className="inline-block h-4 w-24 align-middle" />
            ) : (
              conceptLabel(count)
            )}
          </p>
          {sections ? (
            <p className="mt-3 text-xs leading-relaxed text-[var(--foreground-muted)]">
              {sections.map((s, i) => (
                <span key={s.category.id}>
                  {i > 0 ? <span aria-hidden> · </span> : null}
                  <span className="whitespace-nowrap">
                    {s.category.shortTitle}{" "}
                    <span className="tabular-nums">({s.items.length})</span>
                  </span>
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          "mt-auto flex flex-wrap gap-2.5",
          featured && "lg:mt-0 lg:shrink-0",
        )}
      >
        <Link
          href={`/guias/${guide.id}?print=1`}
          className={cn(buttonVariants({ size: "sm" }), "h-10 px-4")}
          aria-label={`Descargar PDF: ${guide.title}`}
        >
          <Download className="size-4" aria-hidden />
          Descargar PDF
        </Link>
        <Link
          href={`/guias/${guide.id}`}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "h-10 px-4",
          )}
          aria-label={`Ver guía: ${guide.title}`}
        >
          Ver guía
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </article>
  );
}

export function GuidesIndexClient() {
  const [items, setItems] = useState<KnowledgeItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await fetchGuideKnowledge());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  let delay = 60;

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl px-4 py-10 sm:px-6 lg:max-w-6xl lg:px-8 lg:py-12">
      <h1 className="font-sans text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl">
        Guías para descargar
      </h1>
      <p className="mt-2 max-w-2xl text-base text-[var(--foreground-muted)]">
        Todos los conceptos de cada tema en una sola página, listos para
        guardar como PDF y repasar sin conexión.
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--surface)] p-4 text-sm text-[var(--foreground-muted)]"
        >
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={() => void load()}>
            Reintentar
          </Button>
        </div>
      ) : null}

      {STUDY_GROUPS.map((group) => {
        const guides = guidesInGroup(group.id);
        const featured = guides.length === 1;
        return (
          <section
            key={group.id}
            aria-labelledby={`guias-${group.id}`}
            className="mt-10"
          >
            <h2
              id={`guias-${group.id}`}
              className="text-xl font-bold tracking-tight text-[var(--foreground)]"
            >
              {group.title}
            </h2>
            <div
              className={cn(
                "mt-4 grid gap-4",
                !featured && "sm:grid-cols-2",
              )}
            >
              {guides.map((guide) => {
                delay += 50;
                return (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    items={items}
                    featured={featured}
                    delayMs={delay}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

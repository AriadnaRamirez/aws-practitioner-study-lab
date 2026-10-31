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
import { Badge } from "@/components/ui/badge";
import { BentoGrid } from "@/components/ui/bento";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, cardVariants } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { Notice } from "@/components/ui/notice";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/spinner";
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

/**
 * lg and up, 12 tracks: the services guide takes 7 and the concept list 5, same height;
 * below lg they stack in this order.
 */
const GUIDES_GRID = "mt-8 lg:grid-cols-12";

const GUIDE_TITLE = "text-base font-semibold tracking-tight text-[var(--foreground)]";

function conceptLabel(n: number) {
  return `${n} ${n === 1 ? "concepto" : "conceptos"}`;
}

function GuideIcon({ id }: { id: StudyGuideId }) {
  const Icon = GUIDE_ICONS[id];
  return (
    <span
      aria-hidden
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-elevated)] text-[var(--foreground)]"
    >
      <Icon className="size-5" />
    </span>
  );
}

function Count({ n }: { n: number | null }) {
  if (n === null) return <Skeleton className="h-4 w-8" />;
  return <span className="tabular-nums">{n}</span>;
}

function ServiceGuide({
  guide,
  items,
  className,
}: {
  guide: StudyGuide;
  items: KnowledgeItem[] | null;
  className?: string;
}) {
  const count = items ? guideConceptCount(guide, items) : null;
  const sections = items ? guideSections(guide, items) : null;

  return (
    <Card
      as="article"
      aria-labelledby="guia-servicios"
      className={cn("flex flex-col", className)}
    >
      <div className="flex items-start gap-3">
        <GuideIcon id={guide.id} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="guia-servicios" className={GUIDE_TITLE}>
              {guide.title}
            </h2>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--foreground)]">
              {count === null ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                conceptLabel(count)
              )}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[var(--foreground-muted)]">
            {guide.subtitle}
          </p>
        </div>
      </div>

      {sections ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {sections.map((section) => (
            <li key={section.category.id}>
              <Badge className="font-medium">
                <span className="text-[var(--foreground)]">
                  {section.category.shortTitle}
                </span>
                <span className="tabular-nums">{section.items.length}</span>
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
        <Link
          href={`/guias/${guide.id}?print=1`}
          className={buttonVariants({ size: "sm" })}
          aria-label={`Descargar PDF: ${guide.title}`}
        >
          <Download className="size-4" aria-hidden />
          Descargar PDF
        </Link>
        <Link
          href={`/guias/${guide.id}`}
          className={buttonVariants({ variant: "secondary", size: "sm" })}
          aria-label={`Ver guía: ${guide.title}`}
        >
          Ver guía
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </Card>
  );
}

function ConceptRow({
  guide,
  items,
}: {
  guide: StudyGuide;
  items: KnowledgeItem[] | null;
}) {
  const count = items ? guideConceptCount(guide, items) : null;

  return (
    <li className="flex items-center gap-1 pr-2 sm:pr-3">
      <Link
        href={`/guias/${guide.id}`}
        aria-label={
          count === null
            ? `Ver guía: ${guide.title}`
            : `Ver guía: ${guide.title}, ${conceptLabel(count)}`
        }
        className={cn(
          "flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-[var(--surface-hover)] sm:px-4",
          FOCUS_RING,
        )}
      >
        <GuideIcon id={guide.id} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold tracking-tight text-[var(--foreground)]">
            {guide.title}
          </span>
          <span className="mt-0.5 block truncate text-sm text-[var(--foreground-muted)]">
            {guide.subtitle}
          </span>
        </span>
        <span className="shrink-0 text-sm font-semibold text-[var(--foreground)]">
          <Count n={count} />
        </span>
        <ArrowRight
          className="size-4 shrink-0 text-[var(--foreground-muted)]"
          aria-hidden
        />
      </Link>
      <Link
        href={`/guias/${guide.id}?print=1`}
        className={buttonVariants({ variant: "secondary", size: "icon" })}
        aria-label={`Descargar PDF: ${guide.title}`}
      >
        <Download className="size-4" aria-hidden />
      </Link>
    </li>
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

  const services = guidesInGroup("aws");
  const concepts = guidesInGroup("module");

  return (
    <PageContainer width="wide">
      <PageHeader
        title="Guías"
        subtitle="Un PDF por tema, para repasar sin conexión."
        mascot="study"
      />

      {error ? (
        <Notice
          tone="danger"
          boxed
          className="mt-8"
          action={
            <Button variant="secondary" size="sm" onClick={() => void load()}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Notice>
      ) : null}

      <BentoGrid
        className={GUIDES_GRID}
        aria-busy={items || error ? undefined : true}
      >
        {!items && !error ? (
          <p className="sr-only" role="status">
            Cargando tus guías…
          </p>
        ) : null}
        {services.map((guide) => (
          <ServiceGuide
            key={guide.id}
            guide={guide}
            items={items}
            className="lg:col-span-7"
          />
        ))}

        <section
          aria-labelledby="guias-conceptos"
          className={cn(
            cardVariants({ padding: "none" }),
            "flex flex-col overflow-hidden lg:col-span-5",
          )}
        >
          <h2 id="guias-conceptos" className={cn(GUIDE_TITLE, "px-3 pt-4 sm:px-4 sm:pt-5")}>
            Conceptos
          </h2>
          <ul className="mt-1 flex flex-1 flex-col justify-between divide-y divide-[var(--border)]">
            {concepts.map((guide) => (
              <ConceptRow key={guide.id} guide={guide} items={items} />
            ))}
          </ul>
        </section>
      </BentoGrid>
    </PageContainer>
  );
}

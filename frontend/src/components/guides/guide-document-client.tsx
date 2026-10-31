"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import type { KnowledgeItem } from "@aps/shared";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, cardVariants } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { Notice } from "@/components/ui/notice";
import { PAGE_TITLE, PageContainer, SectionTitle } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/spinner";
import {
  fetchGuideKnowledge,
  guideById,
  guideLabel,
  guideNote,
  guidePrintTitle,
  guideSections,
  type GuideSection,
  type StudyGuideId,
} from "@/lib/study-guides";
import { cn } from "@/lib/utils";
import "./guide-print.css";

const DATE_FORMAT = new Intl.DateTimeFormat("es-MX", { dateStyle: "long" });

function conceptLabel(n: number) {
  return `${n} ${n === 1 ? "concepto" : "conceptos"}`;
}

function Concept({
  item,
  headingLevel,
}: {
  item: KnowledgeItem;
  headingLevel: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const label = guideLabel(item);
  const note = guideNote(item);
  return (
    <li className="guide-concept grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[minmax(7.5rem,11rem)_minmax(0,1fr)] sm:items-baseline sm:gap-x-6">
      <div className="min-w-0">
        <Heading className="guide-concept-name text-base font-semibold leading-snug tracking-tight text-[var(--foreground)]">
          {item.name}
        </Heading>
        {label ? (
          <p className="guide-concept-label mt-0.5 text-xs leading-snug text-[var(--foreground-muted)]">
            {label}
          </p>
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="guide-concept-def text-base leading-snug text-[var(--foreground)]">
          {item.definition}
        </p>
        {note ? (
          <p className="guide-concept-note mt-1 text-sm leading-snug text-[var(--foreground-muted)]">
            {note}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function Section({
  section,
  withHeading,
}: {
  section: GuideSection;
  withHeading: boolean;
}) {
  const conceptHeading = withHeading ? "h3" : "h2";
  const headingId = `seccion-${section.category.id}`;

  return (
    <section
      id={headingId}
      aria-labelledby={withHeading ? `${headingId}-titulo` : undefined}
      className="guide-topic mt-8 scroll-mt-6 first-of-type:mt-6"
    >
      <Card padding="none" className="overflow-hidden">
        {withHeading ? (
          <div className="guide-topic-head guide-keep flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-[var(--border)] px-4 py-4 sm:px-5">
            <SectionTitle id={`${headingId}-titulo`}>
              {section.category.shortTitle}
            </SectionTitle>
            <span className="guide-topic-meta text-sm tabular-nums text-[var(--foreground-muted)]">
              {conceptLabel(section.items.length)}
            </span>
          </div>
        ) : null}
        {section.items.length ? (
          <ul className="guide-concepts divide-y divide-[var(--border)] px-4 sm:px-5">
            {section.items.map((item) => (
              <Concept
                key={item.id}
                item={item}
                headingLevel={conceptHeading}
              />
            ))}
          </ul>
        ) : (
          <p className="px-4 py-4 text-sm text-[var(--foreground-muted)] sm:px-5">
            Todavía no hay conceptos publicados en este tema.
          </p>
        )}
      </Card>
    </section>
  );
}

export function GuideDocumentClient({
  guideId,
  autoPrint,
}: {
  guideId: StudyGuideId;
  autoPrint: boolean;
}) {
  const guide = guideById(guideId)!;
  const printTitle = guidePrintTitle(guide);
  const [items, setItems] = useState<KnowledgeItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatedOn, setGeneratedOn] = useState<string | null>(null);
  const savedTitle = useRef<string | null>(null);
  const printed = useRef(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await fetchGuideKnowledge());
      setGeneratedOn(DATE_FORMAT.format(new Date()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /* The print dialog suggests the PDF filename from document.title. */
  const applyPrintTitle = useCallback(() => {
    if (savedTitle.current === null) savedTitle.current = document.title;
    document.title = printTitle;
  }, [printTitle]);

  const restoreTitle = useCallback(() => {
    if (savedTitle.current === null) return;
    document.title = savedTitle.current;
    savedTitle.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("beforeprint", applyPrintTitle);
    window.addEventListener("afterprint", restoreTitle);
    return () => {
      window.removeEventListener("beforeprint", applyPrintTitle);
      window.removeEventListener("afterprint", restoreTitle);
      restoreTitle();
    };
  }, [applyPrintTitle, restoreTitle]);

  const printGuide = useCallback(() => {
    applyPrintTitle();
    window.print();
  }, [applyPrintTitle]);

  useEffect(() => {
    if (!autoPrint || !items || printed.current) return;
    let cancelled = false;
    void (async () => {
      await document.fonts?.ready;
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
      if (cancelled || printed.current) return;
      printed.current = true;
      window.history.replaceState(null, "", `/guias/${guide.id}`);
      printGuide();
    })();
    return () => {
      cancelled = true;
    };
  }, [autoPrint, items, guide.id, printGuide]);

  /* App shell ancestors clip overflow, which disables position: sticky, so a
     fixed pill takes over once the top toolbar scrolls out of view. */
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const el = toolbarRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) =>
      setFloating(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const sections = items ? guideSections(guide, items) : null;
  const total = sections?.reduce((n, s) => n + s.items.length, 0) ?? null;
  const multi = guide.sections.length > 1;

  const toolbarActions = (
    <>
      <Link href="/guias" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        <ArrowLeft className="size-4" aria-hidden />
        Volver a Guías
      </Link>
      <Button size="sm" onClick={printGuide} disabled={!items}>
        <Download className="size-4" aria-hidden />
        Descargar PDF
      </Button>
    </>
  );

  return (
    <PageContainer data-guide-page className="pb-24 sm:pb-24 lg:pb-24">
      <div
        ref={toolbarRef}
        data-guide-noprint
        className={cn(
          cardVariants({ padding: "none" }),
          "flex flex-wrap items-center justify-between gap-2 p-2 print:hidden",
        )}
      >
        {toolbarActions}
      </div>

      {floating ? (
        <div
          data-guide-noprint
          data-guide-floating-toolbar
          className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 print:hidden"
        >
          <div
            role="toolbar"
            aria-label="Acciones de la guía"
            className="pointer-events-auto flex max-w-full items-center gap-1.5 rounded-full bg-[var(--surface-elevated)] p-1.5 shadow-[var(--shadow-float)] motion-safe:animate-[pill-in_0.3s_ease-out_both]"
          >
            {toolbarActions}
          </div>
        </div>
      ) : null}

      <article
        data-guide-doc
        aria-labelledby="guia-titulo"
        aria-busy={items ? undefined : true}
        className="mt-8"
      >
        <div className="guide-doc-head">
          <p className="guide-doc-brand hidden text-xs text-[var(--foreground-muted)] print:block">
            AWS Study Lab
          </p>
          <h1
            id="guia-titulo"
            className={cn("guide-doc-title", PAGE_TITLE)}
          >
            {guide.title}
          </h1>
          <p className="guide-doc-meta mt-2 max-w-prose text-base text-[var(--foreground-muted)]">
            {guide.subtitle}
            {total !== null ? (
              <>
                <span aria-hidden> · </span>
                <span className="tabular-nums">{conceptLabel(total)}</span>
              </>
            ) : null}
            {generatedOn ? (
              <span className="hidden print:inline">
                <span aria-hidden> · </span>
                Generada el {generatedOn}
              </span>
            ) : null}
          </p>
        </div>

        {error ? (
          <Notice
            tone="danger"
            boxed
            className="mt-8 print:hidden"
            action={
              <Button variant="secondary" size="sm" onClick={() => void load()}>
                Reintentar
              </Button>
            }
          >
            {error}
          </Notice>
        ) : null}

        {!sections && !error ? (
          <>
            <p className="sr-only" role="status">
              Cargando la guía…
            </p>
            <Card padding="sm" className="mt-8 space-y-3" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-xl" />
              ))}
            </Card>
          </>
        ) : null}

        {sections && multi ? (
          <nav aria-label="Temas de la guía" className="guide-toc mt-6">
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Temas
            </p>
            <ol className="mt-2 flex flex-wrap gap-2">
              {sections.map((s) => (
                <li key={s.category.id}>
                  <a
                    href={`#seccion-${s.category.id}`}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--surface-hover)]",
                      FOCUS_RING,
                    )}
                  >
                    <span>{s.category.shortTitle}</span>
                    <span className="tabular-nums text-[var(--foreground-muted)]">
                      {s.items.length}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {sections?.map((section) => (
          <Section
            key={section.category.id}
            section={section}
            withHeading={multi}
          />
        ))}
      </article>
    </PageContainer>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import type { KnowledgeItem } from "@aps/shared";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/spinner";
import {
  fetchGuideKnowledge,
  guideById,
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
  const note = guideNote(item);
  return (
    <div className="guide-concept rounded-xl bg-[var(--surface)] p-4 sm:p-5">
      <Heading className="guide-concept-name text-base font-bold tracking-tight text-[var(--foreground)]">
        {item.name}
      </Heading>
      <p className="guide-concept-def mt-1.5 text-[15px] leading-relaxed text-[var(--foreground)]">
        {item.definition}
      </p>
      {note ? (
        <p className="guide-concept-note mt-2 text-sm leading-relaxed text-[var(--foreground-muted)]">
          <span className="font-semibold">Para recordar:</span> {note}
        </p>
      ) : null}
    </div>
  );
}

function Section({
  section,
  withHeading,
}: {
  section: GuideSection;
  withHeading: boolean;
}) {
  const [first, ...rest] = section.items;
  const conceptHeading = withHeading ? "h3" : "h2";
  const headingId = `seccion-${section.category.id}`;

  return (
    <section
      id={headingId}
      aria-labelledby={withHeading ? `${headingId}-titulo` : undefined}
      className="guide-topic mt-8 scroll-mt-6 first-of-type:mt-6"
    >
      {/* Heading and first concept travel together so a heading never ends a page. */}
      <div className="guide-keep">
        {withHeading ? (
          <div className="guide-topic-head mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h2
              id={`${headingId}-titulo`}
              className="text-xl font-extrabold tracking-tight text-[var(--foreground)]"
            >
              {section.category.title}
            </h2>
            <span className="guide-topic-meta text-sm tabular-nums text-[var(--foreground-muted)]">
              {conceptLabel(section.items.length)}
            </span>
          </div>
        ) : null}
        {first ? (
          <Concept item={first} headingLevel={conceptHeading} />
        ) : (
          <p className="text-sm text-[var(--foreground-muted)]">
            Todavía no hay conceptos publicados en este tema.
          </p>
        )}
      </div>
      {rest.length ? (
        <div className="guide-concepts mt-3 space-y-3">
          {rest.map((item) => (
            <Concept key={item.id} item={item} headingLevel={conceptHeading} />
          ))}
        </div>
      ) : null}
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
      <Link
        href="/guias"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-10")}
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver a Guías
      </Link>
      <Button
        size="sm"
        className="h-10 px-4"
        onClick={printGuide}
        disabled={!items}
      >
        <Download className="size-4" aria-hidden />
        Descargar PDF
      </Button>
    </>
  );

  return (
    <div
      data-guide-page
      className="mx-auto w-full min-w-0 max-w-3xl px-4 pb-24 pt-6 sm:px-6 lg:pt-8"
    >
      <div
        ref={toolbarRef}
        data-guide-noprint
        className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[var(--surface-elevated)] p-2 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] print:hidden"
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
            className="pointer-events-auto flex max-w-full items-center gap-1.5 rounded-full bg-[var(--surface-elevated)] p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.9)] motion-safe:animate-[pill-in_0.3s_ease-out_both]"
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
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)] print:hidden">
            AWS Study Lab · Guía de estudio
          </p>
          <h1
            id="guia-titulo"
            className="guide-doc-title mt-2 font-sans text-3xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl"
          >
            <span className="hidden print:inline">AWS Study Lab · </span>
            {guide.title}
          </h1>
          <p className="guide-doc-meta mt-2 text-sm text-[var(--foreground-muted)]">
            {guide.subtitle}
            {total !== null ? (
              <>
                <span aria-hidden> · </span>
                <span className="tabular-nums">{conceptLabel(total)}</span>
              </>
            ) : null}
            {generatedOn ? (
              <>
                <span aria-hidden> · </span>
                Generada el {generatedOn}
              </>
            ) : null}
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--surface)] p-4 text-sm text-[var(--foreground-muted)] print:hidden"
          >
            <span>{error}</span>
            <Button variant="secondary" size="sm" onClick={() => void load()}>
              Reintentar
            </Button>
          </div>
        ) : null}

        {!sections && !error ? (
          <div className="mt-8 space-y-3" aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : null}

        {sections && multi ? (
          <nav
            aria-label="Temas de la guía"
            className="guide-toc mt-6 rounded-2xl bg-[var(--surface)] p-4 sm:p-5"
          >
            <p className="text-sm font-semibold text-[var(--foreground)]">
              En esta guía
            </p>
            <ol className="mt-2 grid gap-1 sm:grid-cols-2">
              {sections.map((s) => (
                <li key={s.category.id}>
                  <a
                    href={`#seccion-${s.category.id}`}
                    className="flex items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 text-sm text-[var(--foreground)] underline-offset-4 transition-colors hover:bg-[var(--surface-hover)] hover:underline"
                  >
                    <span>{s.category.title}</span>
                    <span className="shrink-0 tabular-nums text-[var(--foreground-muted)]">
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
    </div>
  );
}

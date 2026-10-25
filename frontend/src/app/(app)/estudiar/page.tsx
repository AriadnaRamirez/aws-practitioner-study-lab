import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { OpenTourButton } from "@/components/onboarding/open-tour-button";
import { ExamStudyPanel } from "@/components/study/exam-study-panel";
import { FlashStudyClient } from "@/components/study/flash-study-client";
import { Skeleton, Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Estudiar",
};

function FlashBootFallback() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12" aria-busy="true">
      <div className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]">
        <Spinner label="Cargando flashcards" />
        <span>Cargando flashcards…</span>
      </div>
      <div className="mt-8 space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  );
}

export default function EstudiarPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 8% 0%, var(--hero-mesh-a), transparent 60%), radial-gradient(ellipse 55% 45% at 92% 8%, var(--hero-mesh-b), transparent 55%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[var(--accent)]">
              AWS Practitioner Study Lab
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Estudiar{" "}
              <span className="text-accent-aws">flashcards</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <OpenTourButton />
            <Link
              href="/estudiar/examen"
              className="inline-flex h-10 items-center rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-4 text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[var(--accent)]"
            >
              Modo Examen
            </Link>
          </div>
        </div>
        <p className="max-w-prose text-sm text-[var(--foreground-muted)]">
          Primero flashcards (rápido). El banco de examen y el cronometrado
          están debajo si los necesitas.
        </p>
      </div>

      <section className="mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6">
        <Suspense fallback={<FlashBootFallback />}>
          <FlashStudyClient />
        </Suspense>
      </section>

      <details className="mx-auto mb-16 w-full max-w-3xl px-4 sm:px-6">
        <summary className="cursor-pointer list-none rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-3">
            Estudio del banco de examen (MCQ del exam)
            <span className="text-xs font-normal text-[var(--foreground-muted)]">
              Abrir
            </span>
          </span>
        </summary>
        <div className="pt-2">
          <ExamStudyPanel />
        </div>
      </details>
    </div>
  );
}

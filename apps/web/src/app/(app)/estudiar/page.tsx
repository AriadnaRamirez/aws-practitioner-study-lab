import type { Metadata } from "next";
import Link from "next/link";
import { ExamStudyPanel } from "@/components/study/exam-study-panel";

export const metadata: Metadata = {
  title: "Estudiar",
};

export default function EstudiarPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 10% 0%, var(--hero-mesh-a), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 10%, var(--hero-mesh-c), transparent 50%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[var(--accent)]">
              AWS Practitioner Study Lab
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Estudiar
            </h1>
          </div>
          <Link
            href="/estudiar/examen"
            className="inline-flex h-10 items-center rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-foreground)] transition-opacity hover:opacity-90"
          >
            Modo Examen cronometrado
          </Link>
        </div>
        <p className="max-w-prose text-sm text-[var(--foreground-muted)]">
          Abajo: Modo Estudio para examen (feedback + refuerzo). Para simular el
          CLF con timer y sin pistas en vivo, usa Modo Examen.
        </p>
      </div>

      <ExamStudyPanel />
    </div>
  );
}

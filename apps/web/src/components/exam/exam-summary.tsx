"use client";

import type { ExamTimedSummary } from "@aps/shared";
import { Button } from "@/components/ui/button";

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return `${h} h ${rm} min`;
  }
  return `${m} min ${String(s).padStart(2, "0")} s`;
}

type Props = {
  summary: ExamTimedSummary;
  onAgain: () => void;
};

export function ExamSummary({ summary, onAgain }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="space-y-3 animate-[fade-up_0.5s_ease-out]">
        <p className="text-sm font-medium text-[var(--accent)]">
          Resultado · Modo Examen
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {summary.scorePercent}%
        </h1>
        <p className="text-[var(--foreground-muted)]">
          {summary.correctCount} de {summary.totalCount} correctas
          {summary.unansweredCount > 0
            ? ` · ${summary.unansweredCount} sin responder`
            : ""}
          {summary.status === "EXPIRED" ? " · tiempo agotado" : ""}
        </p>
        <p className="text-sm text-[var(--foreground-muted)]">
          Tiempo usado: {formatDuration(summary.timeUsedSec)} de{" "}
          {formatDuration(summary.timeLimitSec)}
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={onAgain}>
          Nuevo examen
        </Button>
      </div>

      <section className="space-y-4" aria-labelledby="fallos-heading">
        <h2
          id="fallos-heading"
          className="font-display text-xl font-semibold text-[var(--foreground)]"
        >
          {summary.mistakes.length === 0
            ? "Sin fallos"
            : `Fallos y sin responder (${summary.mistakes.length})`}
        </h2>
        {summary.mistakes.length === 0 ? (
          <p className="text-[var(--foreground-muted)]">
            Excelente — todas las respuestas fueron correctas.
          </p>
        ) : (
          <ul className="space-y-6">
            {summary.mistakes.map((m, idx) => (
              <li
                key={m.questionId}
                className="border-t border-[var(--border)] pt-5"
              >
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Ítem {idx + 1}
                </p>
                <p className="mb-3 font-medium text-[var(--foreground)]">
                  {m.stem}
                </p>
                <ul className="mb-3 space-y-1.5 text-sm">
                  {m.choices.map((choice, i) => {
                    const isCorrect = i === m.correctIndex;
                    const isSelected = i === m.selectedIndex;
                    return (
                      <li
                        key={i}
                        className={
                          isCorrect
                            ? "text-emerald-700 dark:text-emerald-300"
                            : isSelected
                              ? "text-red-700 dark:text-red-300"
                              : "text-[var(--foreground-muted)]"
                        }
                      >
                        {String.fromCharCode(65 + i)}. {choice}
                        {isCorrect ? " · correcta" : ""}
                        {isSelected && !isCorrect ? " · tu respuesta" : ""}
                      </li>
                    );
                  })}
                </ul>
                {m.selectedIndex === null ? (
                  <p className="mb-2 text-sm text-amber-800 dark:text-amber-200">
                    No respondiste esta pregunta.
                  </p>
                ) : null}
                <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                  {m.explanation}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

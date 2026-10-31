"use client";

import type { ExamTimedSummary } from "@aps/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { PAGE_TITLE, PageContainer, SectionTitle } from "@/components/ui/page";
import { cn } from "@/lib/utils";

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
    <PageContainer>
      <header className="animate-fade-up">
        <p className="text-sm text-[var(--foreground-muted)]">Resultado</p>
        <h1 className={cn(PAGE_TITLE, "mt-1 tabular-nums")}>
          {summary.scorePercent}%
        </h1>
        <p className="mt-3 text-[var(--foreground-muted)]">
          {summary.correctCount} de {summary.totalCount} correctas
          {summary.unansweredCount > 0
            ? ` · ${summary.unansweredCount} sin responder`
            : ""}
          {summary.status === "EXPIRED" ? " · tiempo agotado" : ""}
        </p>
        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Tiempo usado: {formatDuration(summary.timeUsedSec)} de{" "}
          {formatDuration(summary.timeLimitSec)}
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={onAgain}>
          Nuevo examen
        </Button>
      </div>

      <section className="mt-12" aria-labelledby="fallos-heading">
        <SectionTitle
          id="fallos-heading"
          count={summary.mistakes.length || undefined}
        >
          {summary.mistakes.length === 0
            ? "Sin fallos"
            : "Fallos y sin responder"}
        </SectionTitle>
        {summary.mistakes.length === 0 ? (
          <p className="mt-4 text-[var(--foreground-muted)]">
            Excelente — todas las respuestas fueron correctas.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {summary.mistakes.map((m, idx) => (
              <Card as="li" key={m.questionId} variant="flat">
                <p className="mb-2 text-xs text-[var(--foreground-muted)]">
                  Pregunta {idx + 1}
                </p>
                <p className="mb-3 font-semibold text-[var(--foreground)]">
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
                            ? "text-[var(--success-text)]"
                            : isSelected
                              ? "text-[var(--danger-text)]"
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
                  <Notice tone="warning" className="mb-2">
                    No respondiste esta pregunta.
                  </Notice>
                ) : null}
                <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                  {m.explanation}
                </p>
              </Card>
            ))}
          </ul>
        )}
      </section>
    </PageContainer>
  );
}

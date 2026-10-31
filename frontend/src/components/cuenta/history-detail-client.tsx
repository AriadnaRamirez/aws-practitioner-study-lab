"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { StudyHistoryDetail } from "@aps/shared";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/spinner";
import { fetchSessionHistoryDetail, getStoredToken } from "@/lib/api";
import {
  formatDuration,
  formatScore,
  formatSessionWhen,
  modeLabel,
} from "@/lib/format-study";
import { cn } from "@/lib/utils";

const HISTORY_HREF = "/cuenta?tab=historial";

export function HistoryDetailClient({ sessionId }: { sessionId: string }) {
  const [detail, setDetail] = useState<StudyHistoryDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    if (!getStoredToken()) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    try {
      const res = await fetchSessionHistoryDetail(sessionId);
      setDetail(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar");
    }
  }, [sessionId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (authed === false) {
    return (
      <PageContainer>
        <PageHeader title="Sesión" subtitle="Entra para ver el detalle." />
        <Link href="/login" className={cn(buttonVariants(), "mt-8")}>
          Entrar
        </Link>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Notice
          tone="danger"
          boxed
          action={
            <Link
              href={HISTORY_HREF}
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              Volver al historial
            </Link>
          }
        >
          {error}
        </Notice>
      </PageContainer>
    );
  }

  const backLink = (
    <Link
      href={HISTORY_HREF}
      className={cn(buttonVariants({ variant: "ghost", size: "xs" }), "-ml-3")}
    >
      <ChevronLeft className="size-4" aria-hidden />
      Historial
    </Link>
  );

  if (!detail) {
    return (
      <PageContainer aria-busy="true">
        {backLink}
        <p className="sr-only" role="status">
          Cargando el detalle de tu partida…
        </p>
        <div className="mt-4" aria-hidden>
          <Skeleton className="block h-9 w-48 sm:h-10" />
          <Skeleton className="mt-3 block h-5 w-full max-w-md" />
        </div>
        <ol className="mt-8 space-y-3" aria-hidden>
          {[0, 1, 2].map((i) => (
            <Card as="li" key={i} variant="flat" padding="sm">
              <div className="flex items-baseline justify-between gap-2">
                <Skeleton className="block h-4 w-1/2" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="mt-3 block h-4 w-full" />
              <Skeleton className="mt-3 block h-3.5 w-2/3" />
              <Skeleton className="mt-1.5 block h-3.5 w-1/2" />
            </Card>
          ))}
        </ol>
      </PageContainer>
    );
  }

  const attempts = detail.attempts ?? [];

  return (
    <PageContainer>
      {backLink}
      <PageHeader
        className="mt-4"
        title={modeLabel(detail.mode)}
        subtitle={`${formatSessionWhen(detail, detail.timezone)} · ${detail.size} conceptos · puntaje ${formatScore(detail)} · ${formatDuration(detail.durationMs)}`}
      />

      {attempts.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--foreground-muted)]">
          Esta sesión no tiene intentos registrados (la dejaste a medias o
          sigue en curso).
        </p>
      ) : (
        <ol className="mt-8 space-y-3">
          {attempts.map((a, i) => (
            <Card as="li" key={a.id} variant="flat" padding="sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {i + 1}. {a.title}
                </p>
                <Badge tone={a.correct ? "success" : "danger"}>
                  {a.correct ? "Correcto" : "Incorrecto"}
                </Badge>
              </div>
              {a.prompt ? (
                <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]">
                  {a.prompt}
                </p>
              ) : null}
              <ul className="mt-3 space-y-1 text-sm text-[var(--foreground-muted)]">
                {a.selectedLabel ? (
                  <li>
                    Tu respuesta:{" "}
                    <strong className="text-[var(--foreground)]">
                      {a.selectedLabel}
                    </strong>
                  </li>
                ) : null}
                {a.correctLabel ? (
                  <li>
                    Correcta:{" "}
                    <strong className="text-[var(--foreground)]">
                      {a.correctLabel}
                    </strong>
                  </li>
                ) : null}
                {a.explanation ? <li className="pt-1">{a.explanation}</li> : null}
              </ul>
            </Card>
          ))}
        </ol>
      )}
    </PageContainer>
  );
}

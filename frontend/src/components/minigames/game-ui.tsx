"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CircleCheck, CircleDot, RotateCcw } from "lucide-react";
import type { KnowledgeItem } from "@aps/shared";
import { Mascot, type MascotPose } from "@/components/brand/mascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, cardVariants } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { Notice } from "@/components/ui/notice";
import { PageContainer, PageHeader, SectionTitle } from "@/components/ui/page";
import { ScreenLoader } from "@/components/ui/screen-loader";
import { fetchKnowledgeItems } from "@/lib/api";
import type { GameStatus } from "@/lib/minigames/progress";
import { cn } from "@/lib/utils";

export function GameStatusBadge({ status }: { status?: GameStatus }) {
  if (!status) return null;
  return status === "completed" ? (
    <Badge tone="success">
      <CircleCheck aria-hidden />
      Completado
    </Badge>
  ) : (
    <Badge tone="accent">
      <CircleDot aria-hidden />
      Jugado
    </Badge>
  );
}

/** Per-topic games: "Completado" once every topic is, "2/6 completados" on the way. */
export function TopicProgressBadge({
  done,
  played,
  total,
}: {
  done: number;
  played: number;
  total: number;
}) {
  if (total > 0 && done >= total) return <GameStatusBadge status="completed" />;
  if (done > 0) {
    return (
      <Badge tone="accent">
        <CircleCheck aria-hidden />
        {done}/{total} completados
      </Badge>
    );
  }
  return played > 0 ? <GameStatusBadge status="played" /> : null;
}

export type PickerOption = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  status?: GameStatus;
};

/** First screen of a game: what it is and which set to play. */
export function GamePicker({
  title,
  subtitle,
  mascot = "study",
  options,
  onPick,
}: {
  title: string;
  subtitle: string;
  mascot?: MascotPose;
  options: readonly PickerOption[];
  onPick: (id: string) => void;
}) {
  return (
    <PageContainer>
      <PageHeader title={title} subtitle={subtitle} mascot={mascot} />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {options.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => onPick(o.id)}
              className={cn(
                cardVariants({
                  variant: "flat",
                  padding: "sm",
                  interactive: true,
                }),
                "flex h-full w-full flex-col gap-1",
                FOCUS_RING,
              )}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="font-semibold text-[var(--foreground)]">
                  {o.title}
                </span>
                <span className="flex flex-wrap justify-end gap-1.5">
                  <GameStatusBadge status={o.status} />
                  {o.badge ? <Badge>{o.badge}</Badge> : null}
                </span>
              </span>
              <span className="text-sm text-[var(--foreground-muted)]">
                {o.description}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}

/** A round in progress: game title, the set being played and a way back. */
export function GameShell({
  title,
  subtitle,
  onExit,
  exitLabel = "Cambiar tema",
  children,
}: {
  title: string;
  subtitle?: string;
  onExit: () => void;
  exitLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <PageContainer>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <Button variant="ghost" size="sm" onClick={onExit} className="-ml-3">
            <ArrowLeft className="size-4" aria-hidden />
            {exitLabel}
          </Button>
        }
      />
      {children}
    </PageContainer>
  );
}

export function GameSummary({
  title,
  detail,
  pose = "champion",
  onReplay,
  onExit,
  exitLabel = "Cambiar tema",
  perfect,
  children,
}: {
  title: string;
  detail: React.ReactNode;
  pose?: MascotPose;
  onReplay: () => void;
  onExit: () => void;
  exitLabel?: string;
  /** Whether this round counts as completed (no mistakes) or just played. */
  perfect: boolean;
  /** Review below the result card. */
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-8 space-y-6">
      <Card className="flex items-center gap-4" role="status">
        <Mascot pose={pose} size="sm" glow={false} className="shrink-0" />
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            {detail}
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[var(--foreground-muted)]">
            {perfect ? (
              <>
                <GameStatusBadge status="completed" />
                Sin errores: quedó marcado como completado.
              </>
            ) : (
              "Termínalo sin errores para marcarlo como completado."
            )}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={onReplay}>
              <RotateCcw className="size-4" aria-hidden />
              Jugar otra vez
            </Button>
            <Button variant="secondary" onClick={onExit}>
              {exitLabel}
            </Button>
          </div>
        </div>
      </Card>
      {children}
    </div>
  );
}

export type ReviewEntry = {
  id: string;
  title: string;
  body: string;
  /** Extra line, e.g. what the player answered. */
  note?: string;
  tone?: "success" | "danger";
};

export function ReviewList({
  heading,
  entries,
}: {
  heading: string;
  entries: readonly ReviewEntry[];
}) {
  if (!entries.length) return null;
  return (
    <section>
      <SectionTitle count={entries.length}>{heading}</SectionTitle>
      <ul className="mt-3 space-y-2">
        {entries.map((e) => (
          <li key={e.id}>
            <Card variant="flat" padding="sm">
              <p
                className={cn(
                  "font-semibold",
                  e.tone === "danger"
                    ? "text-[var(--danger-text)]"
                    : e.tone === "success"
                      ? "text-[var(--success-text)]"
                      : "text-[var(--foreground)]",
                )}
              >
                {e.title}
              </p>
              {e.note ? (
                <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
                  {e.note}
                </p>
              ) : null}
              <p className="mt-0.5 text-sm text-[var(--foreground-muted)]">
                {e.body}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function formatElapsed(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m ? `${m} min ${s} s` : `${s} s`;
}

/** Published concepts for games built from the card bank. */
export function useKnowledgeItems() {
  const [items, setItems] = useState<KnowledgeItem[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    fetchKnowledgeItems()
      .then(setItems)
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { items, error, reload: load };
}

/** Loading and error states while the card bank arrives. */
export function KnowledgeGate({
  items,
  error,
  reload,
  children,
}: {
  items: KnowledgeItem[] | null;
  error: boolean;
  reload: () => void;
  children: (items: KnowledgeItem[]) => React.ReactNode;
}) {
  if (error) {
    return (
      <PageContainer>
        <Notice
          boxed
          tone="danger"
          title="No pudimos cargar los conceptos"
          action={
            <Button size="sm" variant="secondary" onClick={reload}>
              Reintentar
            </Button>
          }
        >
          Revisa tu conexión e inténtalo de nuevo.
        </Notice>
      </PageContainer>
    );
  }
  if (!items) return <ScreenLoader message="Preparando el juego…" />;
  return <>{children(items)}</>;
}

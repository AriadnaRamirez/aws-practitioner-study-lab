"use client";

import { ChevronRight, Clock, RotateCcw } from "lucide-react";
import { useId } from "react";
import { MASTERY_STREAK, type WeakItem } from "@aps/shared";
import { Card, cardVariants } from "@/components/ui/card";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import { FOCUS_RING } from "@/components/ui/focus";
import { Skeleton } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  cardAnchor,
  extraExplanation,
  hitsToMastery,
  plural,
  relativeDay,
} from "./weak-insights";

const labelClass = "text-xs text-[var(--foreground-muted)]";

/** One dot per consecutive hit needed to master the card. */
function MasteryDots({ item }: { item: WeakItem }) {
  const hits = Math.min(item.consecutiveCorrect, MASTERY_STREAK);
  const left = hitsToMastery(item);
  const done = left === 0;
  return (
    <span
      className="inline-flex items-center gap-2"
      role="img"
      aria-label={
        done
          ? "Dominada"
          : `${hits} de ${MASTERY_STREAK} aciertos seguidos para dominarla`
      }
    >
      <span className="inline-flex gap-1" aria-hidden>
        {Array.from({ length: MASTERY_STREAK }, (_, i) => (
          <span
            key={i}
            className={cn(
              "size-2.5 rounded-full",
              i < hits
                ? done
                  ? "bg-[var(--success)]"
                  : "bg-[var(--accent)]"
                : "bg-[var(--surface-hover)]",
            )}
          />
        ))}
      </span>
      <span
        aria-hidden
        className={cn(
          "text-xs font-semibold tabular-nums",
          done ? "text-[var(--success-text)]" : "text-[var(--foreground-muted)]",
        )}
      >
        {done ? "Dominada" : `${hits}/${MASTERY_STREAK}`}
      </span>
    </span>
  );
}

function FailCount({ count }: { count: number }) {
  return (
    <span
      className="shrink-0 text-xs tabular-nums text-[var(--foreground-muted)]"
      title={`La fallaste ${plural(count, "vez", "veces")}`}
    >
      {plural(count, "fallo", "fallos")}
    </span>
  );
}

export function WeakItemCard({
  item,
  compact = false,
}: {
  item: WeakItem;
  compact?: boolean;
}) {
  const extra = compact ? null : extraExplanation(item);
  const forgotten =
    !compact && Boolean(item.masteredAt) && hitsToMastery(item) > 0;

  return (
    <article
      id={cardAnchor(item)}
      className={cn(
        cardVariants({ variant: "flat" }),
        "flex w-full scroll-mt-24 flex-col gap-3 transition-colors target:bg-[var(--surface-hover)]",
      )}
    >
      <div className="flex min-w-0 items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-xs text-[var(--foreground-muted)]">
          {item.topicName ?? ""}
        </span>
        {!compact ? <FailCount count={item.failCount} /> : null}
      </div>

      <h3 className="break-words text-base font-semibold leading-snug tracking-tight text-[var(--foreground)] sm:text-lg">
        {item.title}
      </h3>

      {item.answer ? (
        <Card variant="inset" padding="none" className="px-4 py-3">
          <p className={labelClass}>
            {item.itemType === "EXAM_QUESTION"
              ? "Respuesta correcta"
              : "Recuerda"}
          </p>
          <p
            className={cn(
              "mt-1 break-words text-sm leading-relaxed text-[var(--foreground)]",
              compact && "line-clamp-2",
            )}
          >
            {item.answer}
          </p>
          {extra ? (
            <details className="group mt-2">
              <summary className="cursor-pointer list-none text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">Ver explicación</span>
                <span className="hidden group-open:inline">
                  Ocultar explicación
                </span>
              </summary>
              <p className="mt-1.5 break-words text-sm leading-relaxed text-[var(--foreground-muted)]">
                {extra}
              </p>
            </details>
          ) : null}
        </Card>
      ) : null}

      {item.confusedWith && !compact ? (
        <p
          className="min-w-0 truncate text-sm text-[var(--foreground-muted)]"
          title={item.confusedWith}
        >
          Elegiste{" "}
          <span className="line-through decoration-[var(--danger)]/50">
            {item.confusedWith}
          </span>
          {item.confusedCount > 1 ? (
            <span className="tabular-nums"> ×{item.confusedCount}</span>
          ) : null}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pt-1">
        <span className="inline-flex items-center gap-2">
          <MasteryDots item={item} />
          {forgotten ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-hover)]">
              <RotateCcw className="size-3" aria-hidden />
              Se te olvidó
            </span>
          ) : null}
        </span>
        {item.lastFailedAt && !compact ? (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
            <Clock className="size-3" aria-hidden />
            <span className="sr-only">Último fallo: </span>
            {relativeDay(item.lastFailedAt)}
          </span>
        ) : null}
      </div>
    </article>
  );
}

/** Small "Por dominar" card; opens the full card in a dialog. */
export function WeakItemTile({
  item,
  onOpen,
}: {
  item: WeakItem;
  onOpen: (item: WeakItem) => void;
}) {
  return (
    <button
      type="button"
      id={cardAnchor(item)}
      onClick={() => onOpen(item)}
      aria-haspopup="dialog"
      className={cn(
        cardVariants({ variant: "flat", padding: "sm", interactive: true }),
        "group flex w-full scroll-mt-24 flex-col gap-2",
        FOCUS_RING,
      )}
    >
      <span className="flex min-w-0 items-baseline justify-between gap-3">
        <span className="min-w-0 truncate text-xs text-[var(--foreground-muted)]">
          {item.topicName ?? ""}
        </span>
        <FailCount count={item.failCount} />
      </span>
      <span className="flex min-w-0 items-start justify-between gap-2">
        <span className="line-clamp-2 min-w-0 break-words text-base font-semibold leading-snug tracking-tight text-[var(--foreground)]">
          {item.title}
        </span>
        <ChevronRight
          aria-hidden
          className="mt-0.5 size-4 shrink-0 text-[var(--foreground-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--foreground)]"
        />
      </span>
      <span className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-1">
        <MasteryDots item={item} />
        {item.lastFailedAt ? (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
            <Clock className="size-3" aria-hidden />
            <span className="sr-only">Último fallo: </span>
            {relativeDay(item.lastFailedAt)}
          </span>
        ) : null}
      </span>
    </button>
  );
}

/** Full card: answer, explanation, mix-up and progress. */
export function WeakItemDialog({
  item,
  onClose,
}: {
  item: WeakItem | null;
  onClose: () => void;
}) {
  const titleId = useId();

  if (!item) return null;

  const explanation = item.explanation?.trim() || null;
  const extra = extraExplanation(item);
  const left = hitsToMastery(item);
  const forgotten = Boolean(item.masteredAt) && left > 0;

  return (
    <Dialog open onClose={onClose} labelledBy={titleId}>
      <DialogHeader
        titleId={titleId}
        onClose={onClose}
        eyebrow={
          <>
            {item.topicName ?? ""}
            <span aria-hidden> · </span>
            <span className="tabular-nums">
              {plural(item.failCount, "fallo", "fallos")}
            </span>
          </>
        }
        title={item.title}
      />

      {item.answer ? (
        <Card variant="inset" padding="none" className="px-4 py-3.5">
          <p className={labelClass}>
            {item.itemType === "EXAM_QUESTION"
              ? "Respuesta correcta"
              : "Recuerda"}
          </p>
          <p className="mt-1 break-words text-base leading-relaxed text-[var(--foreground)]">
            {item.answer}
          </p>
        </Card>
      ) : null}

      {(item.answer ? extra : explanation) ? (
        <div className="min-w-0">
          <p className={labelClass}>Explicación</p>
          <p className="mt-1 break-words text-sm leading-relaxed text-[var(--foreground-muted)]">
            {item.answer ? extra : explanation}
          </p>
        </div>
      ) : null}

      {item.confusedWith ? (
        <div className="min-w-0 rounded-xl bg-[var(--danger-soft)] px-4 py-3">
          <p className={labelClass}>
            Elegiste
            {item.confusedCount > 1 ? (
              <span className="tabular-nums">
                {" "}
                ({plural(item.confusedCount, "vez", "veces")})
              </span>
            ) : null}
          </p>
          <p className="mt-1 break-words text-sm leading-relaxed text-[var(--foreground)] line-through decoration-[var(--danger)]/60">
            {item.confusedWith}
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[var(--border)] pt-4">
        <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
          <MasteryDots item={item} />
          <span className="text-xs text-[var(--foreground-muted)]">
            {left === 0
              ? "Ya la dominas"
              : `Te ${left === 1 ? "falta" : "faltan"} ${plural(left, "acierto seguido", "aciertos seguidos")}`}
          </span>
          {forgotten ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-hover)]">
              <RotateCcw className="size-3" aria-hidden />
              Se te olvidó
            </span>
          ) : null}
        </span>
        {item.lastFailedAt ? (
          <span className="inline-flex items-center gap-1 text-xs text-[var(--foreground-muted)]">
            <Clock className="size-3" aria-hidden />
            Último fallo: {relativeDay(item.lastFailedAt)}
          </span>
        ) : null}
      </div>
    </Dialog>
  );
}

export function WeakItemCardSkeleton() {
  return (
    <Card variant="flat" aria-hidden className="flex flex-col gap-3">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-16 w-full rounded-xl bg-[var(--surface)]" />
      <Skeleton className="h-3 w-3/4" />
    </Card>
  );
}

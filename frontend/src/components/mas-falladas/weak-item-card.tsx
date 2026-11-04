"use client";

import { Check, Clock, RotateCcw } from "lucide-react";
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
  const done = hitsToMastery(item) === 0;
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
          done
            ? "text-[var(--success-text)]"
            : "text-[var(--foreground-muted)]",
        )}
      >
        {done ? "Dominada" : `${hits}/${MASTERY_STREAK} seguidas`}
      </span>
    </span>
  );
}

/** A card on the board: topic, title and why it is there. Opens the full card. */
export function WeakLaneCard({
  item,
  onOpen,
}: {
  item: WeakItem;
  onOpen: (item: WeakItem) => void;
}) {
  const mastered = hitsToMastery(item) === 0;
  const forgotten = !mastered && Boolean(item.masteredAt);
  return (
    <button
      type="button"
      id={cardAnchor(item)}
      onClick={() => onOpen(item)}
      aria-haspopup="dialog"
      className={cn(
        cardVariants({ variant: "flat", padding: "none", interactive: true }),
        "group flex w-full scroll-mt-24 flex-col gap-1.5 px-3.5 py-3",
        FOCUS_RING,
      )}
    >
      <span className="min-w-0 truncate text-xs text-[var(--foreground-muted)]">
        {item.topicName ?? ""}
      </span>
      <span className="line-clamp-2 min-w-0 break-words text-sm font-semibold leading-snug text-[var(--foreground)]">
        {item.title}
      </span>
      <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--foreground-muted)]">
        {mastered ? (
          <span className="inline-flex items-center gap-1 font-semibold text-[var(--success-text)]">
            <Check className="size-3" aria-hidden />
            Dominada
          </span>
        ) : (
          <span className="tabular-nums">
            {plural(item.failCount, "fallo", "fallos")}
          </span>
        )}
        {forgotten ? (
          <span className="inline-flex items-center gap-1 font-semibold text-[var(--accent-hover)]">
            <RotateCcw className="size-3" aria-hidden />
            Se te olvidó
          </span>
        ) : null}
        {item.lastFailedAt && !mastered ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" aria-hidden />
            <span className="sr-only">Último fallo: </span>
            {relativeDay(item.lastFailedAt)}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function WeakLaneCardSkeleton() {
  return (
    <Card
      variant="flat"
      padding="none"
      aria-hidden
      className="flex flex-col gap-2 px-3.5 py-3"
    >
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-16" />
    </Card>
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
        <div className="status-danger min-w-0 rounded-xl px-4 py-3">
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

import { Clock, RotateCcw } from "lucide-react";
import { MASTERY_STREAK, type WeakItem } from "@aps/shared";
import { cn } from "@/lib/utils";
import {
  cardAnchor,
  extraExplanation,
  hitsToMastery,
  plural,
  relativeDay,
} from "./weak-insights";

export const weakCardClass =
  "flex min-w-0 flex-col rounded-2xl bg-[var(--surface-elevated)] p-5";

const labelClass = "text-xs text-[var(--foreground-muted)]";

/** One dot per consecutive hit needed to master the card. */
export function MasteryDots({ item }: { item: WeakItem }) {
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
          done ? "text-[var(--success)]" : "text-[var(--foreground-muted)]",
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
  const forgotten = !compact && Boolean(item.masteredAt) && hitsToMastery(item) > 0;

  return (
    <article
      id={cardAnchor(item)}
      className={cn(
        weakCardClass,
        "w-full scroll-mt-24 gap-3 transition-colors target:bg-[var(--surface-hover)]",
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
        <div className="min-w-0 rounded-xl bg-[var(--surface)] px-4 py-3">
          <p className={labelClass}>
            {item.itemType === "EXAM_QUESTION" ? "Respuesta correcta" : "Recuerda"}
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
                <span className="hidden group-open:inline">Ocultar explicación</span>
              </summary>
              <p className="mt-1.5 break-words text-sm leading-relaxed text-[var(--foreground-muted)]">
                {extra}
              </p>
            </details>
          ) : null}
        </div>
      ) : null}

      {item.confusedWith && !compact ? (
        <p className="min-w-0 truncate text-sm text-[var(--foreground-muted)]" title={item.confusedWith}>
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

export function WeakItemCardSkeleton() {
  return (
    <div aria-hidden className={cn(weakCardClass, "gap-3")}>
      <span className="h-3 w-28 rounded-md bg-[var(--surface-hover)] motion-safe:animate-pulse" />
      <span className="h-5 w-1/2 rounded-md bg-[var(--surface-hover)] motion-safe:animate-pulse" />
      <span className="h-16 w-full rounded-xl bg-[var(--surface)] motion-safe:animate-pulse" />
      <span className="h-3 w-3/4 rounded-md bg-[var(--surface-hover)] motion-safe:animate-pulse" />
    </div>
  );
}

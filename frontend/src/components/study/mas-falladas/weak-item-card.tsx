import type { WeakItem } from "@aps/shared";
import { cn } from "@/lib/utils";
import {
  cardAnchor,
  confusedWithName,
  extraExplanation,
  plural,
  relativeDay,
  statusLine,
} from "./weak-insights";

export const weakCardClass =
  "flex min-w-0 flex-col rounded-2xl bg-[var(--surface-elevated)] p-5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)]";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--foreground-muted)]";

function Confusion({ item }: { item: WeakItem }) {
  const times =
    item.confusedCount > 1 ? ` (${plural(item.confusedCount, "vez", "veces")})` : "";
  if (confusedWithName(item)) {
    return (
      <p className="break-words text-sm leading-snug text-[var(--foreground)]">
        <span className="text-[var(--danger)]" aria-hidden>
          ✕{" "}
        </span>
        La confundes con <strong>{item.confusedWith}</strong>
        <span className="text-[var(--foreground-muted)]">{times}</span>
      </p>
    );
  }
  return (
    <p
      className="flex min-w-0 gap-1 text-sm leading-snug text-[var(--foreground)]"
      title={item.confusedWith ?? undefined}
    >
      <span className="shrink-0">
        <span className="text-[var(--danger)]" aria-hidden>
          ✕{" "}
        </span>
        Elegiste{times}:
      </span>
      <span className="min-w-0 truncate text-[var(--foreground-muted)]">
        «{item.confusedWith}»
      </span>
    </p>
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

  return (
    <article
      id={cardAnchor(item)}
      className={cn(
        weakCardClass,
        "w-full scroll-mt-24 gap-3 transition-colors target:bg-[var(--surface-hover)]",
      )}
    >
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
        {item.topicName ? (
          <span className="min-w-0 truncate text-xs font-semibold text-[var(--accent-hover)]">
            {item.topicName}
          </span>
        ) : (
          <span />
        )}
        {item.lastFailedAt && !compact ? (
          <span className="shrink-0 text-xs text-[var(--foreground-muted)]">
            Último fallo: {relativeDay(item.lastFailedAt)}
          </span>
        ) : null}
      </div>

      <h3 className="break-words text-lg font-bold leading-snug tracking-tight text-[var(--foreground)]">
        {item.title}
      </h3>

      {item.answer ? (
        <div className="min-w-0 rounded-xl bg-[var(--surface)] px-4 py-3">
          <p className={labelClass}>
            {item.itemType === "EXAM_QUESTION"
              ? "Respuesta correcta"
              : "Lo que debes recordar"}
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
            <p className="mt-2 break-words text-sm leading-relaxed text-[var(--foreground-muted)]">
              {extra}
            </p>
          ) : null}
        </div>
      ) : null}

      {item.confusedWith && !compact ? <Confusion item={item} /> : null}

      <p className="mt-auto pt-1 text-sm leading-snug text-[var(--foreground-muted)]">
        {statusLine(item)}
      </p>
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

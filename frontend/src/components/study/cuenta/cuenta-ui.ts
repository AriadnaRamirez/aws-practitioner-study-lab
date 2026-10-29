import { cn } from "@/lib/utils";
import { FOCUS_RING } from "@/components/study/exam-date-dialog";

export const CARD =
  "min-w-0 rounded-3xl bg-[var(--surface)] p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] sm:p-6";

export const CARD_TITLE =
  "flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-[var(--foreground)]";

export const CARD_ICON = "size-5 shrink-0 text-[var(--accent)]";

export const PILL_BUTTON = cn(
  "inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--surface-elevated)] px-3.5 text-xs font-semibold text-[var(--foreground-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] disabled:pointer-events-none disabled:opacity-50",
  FOCUS_RING,
);

export const FIELD_LABEL = "flex flex-col gap-1.5 text-sm font-medium";

export function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

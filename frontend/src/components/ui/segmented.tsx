import { FOCUS_RING } from "@/components/ui/focus";
import { cn } from "@/lib/utils";

/**
 * Pill-shaped switcher (tabs, filters, small option groups). Classes only, so
 * it works for links (tabs with URLs), buttons and radio groups alike.
 */
export const segmentedList =
  "inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-[var(--surface)] p-1";

export function segmentedItem(active: boolean, className?: string) {
  return cn(
    "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-sm font-semibold transition-colors",
    FOCUS_RING,
    active
      ? "bg-[var(--surface-hover)] text-[var(--foreground)]"
      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
    className,
  );
}

import { cn } from "@/lib/utils";

const SPIN = "inline-block size-4 shrink-0 animate-spin rounded-full border-2";

export function Spinner({
  className,
  label = "Cargando",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-2", className)}
    >
      <span
        aria-hidden
        className={cn(SPIN, "border-[var(--border-strong)] border-t-[var(--foreground)]")}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Decorative spinner that follows the text color; the visible label says what is happening. */
export function SpinnerIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(SPIN, "border-current/30 border-t-current", className)}
    />
  );
}

/** Pulse stops under `prefers-reduced-motion` (see globals.css). */
export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block animate-pulse rounded-md bg-[var(--surface-hover)]",
        className,
      )}
    />
  );
}

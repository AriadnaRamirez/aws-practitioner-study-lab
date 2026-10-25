import { cn } from "@/lib/utils";

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
        className="inline-block size-4 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--foreground)]"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-md bg-[var(--surface-hover)]",
        className,
      )}
    />
  );
}

import { Mascot, type MascotPose } from "@/components/brand/mascot";
import { SpinnerIcon } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/** Full-screen gate (session check, redirects): small mascot and what is happening. */
export function ScreenLoader({
  message,
  pose = "laptop",
  className,
}: {
  message: string;
  pose?: MascotPose;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center",
        className,
      )}
    >
      <div aria-hidden>
        <Mascot pose={pose} size="sm" glow={false} />
      </div>
      <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
        <SpinnerIcon className="text-[var(--accent)]" />
        {message}
      </p>
    </div>
  );
}

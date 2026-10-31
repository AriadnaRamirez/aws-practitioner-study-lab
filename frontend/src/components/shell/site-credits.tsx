import { FOCUS_RING } from "@/components/ui/focus";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  compact?: boolean;
};

/** Disclaimer + partner marks — quiet, centered, no visual noise. */
export function SiteCredits({ className, compact = false }: Props) {
  return (
    <aside
      className={cn("w-full min-w-0", className)}
      aria-label="Créditos y aviso"
    >
      <div
        className={cn(
          "mx-auto flex w-full min-w-0 max-w-lg flex-col items-center px-4 text-center sm:px-6",
          compact ? "py-7" : "py-9",
        )}
      >
        <p className="text-xs leading-relaxed text-[var(--foreground-muted)]/50">
          Material no oficial. No afiliado a AWS ni a Generation México.
        </p>

        <div
          className={cn(
            "flex items-center justify-center gap-4",
            compact ? "mt-4" : "mt-5",
          )}
        >
          <a
            href="https://mexico.generation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex h-5 w-[6.5rem] items-center justify-center rounded-sm opacity-[0.38] transition-opacity duration-300 hover:opacity-60 focus-visible:opacity-60",
              FOCUS_RING,
            )}
            title="Generation México"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/partners/generation-mexico.svg"
              alt="Generation México"
              className="!h-full !w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </a>

        </div>

        <p className="mt-3.5 text-xs text-[var(--foreground-muted)]/45">
          Autora ·{" "}
          <a
            href="https://www.linkedin.com/in/ariadnaramirez"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "rounded-sm underline-offset-2 transition-colors hover:text-[var(--foreground-muted)] hover:underline",
              FOCUS_RING,
            )}
          >
            Ariadna Ramírez
          </a>
        </p>
      </div>
    </aside>
  );
}

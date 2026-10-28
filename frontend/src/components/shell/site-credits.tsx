import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  compact?: boolean;
};

/** Disclaimer + partner marks (subtle) + author. */
export function SiteCredits({ className, compact = false }: Props) {
  return (
    <aside
      className={cn("w-full min-w-0", className)}
      aria-label="Créditos y aviso"
    >
      <div
        className={cn(
          "mx-auto w-full min-w-0 max-w-3xl px-4 sm:px-6",
          compact ? "py-3" : "py-5",
        )}
      >
        <p className="text-[11px] leading-relaxed text-[var(--foreground-muted)]/70">
          Material de estudio no oficial. No afiliado ni respaldado por Amazon
          Web Services ni por Generation México.
        </p>

        <div
          className={cn(
            "flex flex-wrap items-center gap-x-5 gap-y-2 opacity-45",
            compact ? "mt-3" : "mt-4",
          )}
        >
          <a
            href="https://mexico.generation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center transition-opacity hover:opacity-80"
            title="Generation México"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/partners/generation-mexico.svg"
              alt="Generation México"
              width={112}
              height={32}
              className="h-5 w-auto sm:h-6"
              loading="lazy"
              decoding="async"
            />
          </a>

          <a
            href="https://aws.amazon.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center transition-opacity hover:opacity-80"
            title="Amazon Web Services"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/partners/aws-logo-white.png"
              alt="AWS"
              width={72}
              height={45}
              className="h-5 w-auto sm:h-6"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>

        <p
          className={cn(
            "text-[11px] text-[var(--foreground-muted)]/60",
            compact ? "mt-3" : "mt-4",
          )}
        >
          Autora: Ariadna Ramírez
        </p>
      </div>
    </aside>
  );
}

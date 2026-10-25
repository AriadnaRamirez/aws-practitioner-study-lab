import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  compact?: boolean;
};

/** Unofficial study disclaimer + partner marks + author credit. */
export function SiteCredits({ className, compact = false }: Props) {
  return (
    <aside
      className={cn(
        "w-full min-w-0 border-t border-[var(--border)]",
        className,
      )}
      aria-label="Créditos y aviso"
    >
      <div
        className={cn(
          "mx-auto w-full min-w-0 max-w-3xl px-4 sm:px-6",
          compact ? "py-4" : "py-6",
        )}
      >
        <p className="text-xs leading-relaxed text-[var(--foreground-muted)]">
          Material de estudio{" "}
          <span className="font-semibold text-[var(--foreground)]">
            no oficial
          </span>
          . No está afiliado ni respaldado por Amazon Web Services ni por
          Generation México.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="https://mexico.generation.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center opacity-90 transition-opacity hover:opacity-100"
            title="Generation México"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/partners/generation-mexico.svg"
              alt="Generation México"
              width={140}
              height={40}
              className="h-8 w-auto"
              loading="lazy"
              decoding="async"
            />
          </a>

          <a
            href="https://aws.amazon.com/training/restart/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center opacity-90 transition-opacity hover:opacity-100"
            title="AWS re/Start · Cloud Practitioner"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/partners/aws-restart-clf-lockup.svg"
              alt="AWS re/Start Cloud Practitioner"
              width={200}
              height={40}
              className="h-9 w-auto"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>

        <p className="mt-4 text-xs text-[var(--foreground-muted)]">
          Autora:{" "}
          <span className="font-medium text-[var(--foreground)]">
            Ariadna Ramírez
          </span>
        </p>
      </div>
    </aside>
  );
}

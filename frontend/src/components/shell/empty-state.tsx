import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  hint?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondary?: ReactNode;
};

export function EmptyState({
  title,
  description,
  hint,
  primaryHref,
  primaryLabel,
  secondary,
}: EmptyStateProps) {
  return (
    <div className="relative mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-2xl flex-col justify-center overflow-hidden px-4 py-16 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 20% 30%, var(--hero-mesh-a), transparent 55%),
            radial-gradient(ellipse 60% 45% at 85% 20%, var(--hero-mesh-c), transparent 50%),
            radial-gradient(ellipse 80% 55% at 50% 100%, var(--hero-mesh-b), transparent 55%)
          `,
        }}
      />
      <div
        aria-hidden
        className="animate-soft-pulse pointer-events-none absolute -left-16 top-24 -z-10 h-56 w-56 rounded-full blur-3xl"
        style={{ background: "var(--glow)" }}
      />

      <p className="animate-fade-up font-display text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
        AWS Practitioner Study Lab
      </p>
      <h1 className="animate-fade-up-delay-1 font-display mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h1>
      <p className="animate-fade-up-delay-2 mt-4 max-w-xl text-base leading-relaxed text-[var(--foreground-muted)] sm:text-lg">
        {description}
      </p>
      {hint ? (
        <p className="animate-fade-up-delay-3 mt-3 max-w-lg text-sm leading-relaxed text-[var(--foreground-muted)]">
          {hint}
        </p>
      ) : null}

      {(primaryHref && primaryLabel) || secondary ? (
        <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-3">
          {primaryHref && primaryLabel ? (
            <Link
              href={primaryHref}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              {primaryLabel}
            </Link>
          ) : null}
          {secondary}
        </div>
      ) : null}
    </div>
  );
}

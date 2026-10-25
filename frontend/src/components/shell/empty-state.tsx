import Link from "next/link";
import type { ReactNode } from "react";
import { Mascot, type MascotPose } from "@/components/brand/mascot";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  hint?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondary?: ReactNode;
  pose?: MascotPose;
};

export function EmptyState({
  title,
  description,
  hint,
  primaryHref,
  primaryLabel,
  secondary,
  pose = "wave",
}: EmptyStateProps) {
  return (
    <div className="relative mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-2xl flex-col justify-center overflow-hidden px-4 py-16 sm:px-6">
      <div
        aria-hidden
        className="atmos-orange pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      <Mascot pose={pose} size="lg" float className="mb-8" />

      <h1 className="animate-fade-up font-display text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h1>
      <p className="animate-fade-up mt-3 max-w-xl text-base leading-relaxed text-[var(--foreground-muted)]">
        {description}
      </p>
      {hint ? (
        <p className="mt-2 max-w-lg text-sm text-[var(--foreground-muted)]">
          {hint}
        </p>
      ) : null}

      {(primaryHref && primaryLabel) || secondary ? (
        <div className="mt-8 flex flex-wrap items-center gap-3">
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

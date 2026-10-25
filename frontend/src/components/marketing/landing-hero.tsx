"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

function ByeBanner() {
  const params = useSearchParams();
  if (params.get("bye") !== "1") return null;
  return (
    <p
      role="status"
      className="relative z-10 px-4 py-2 text-center text-sm text-[var(--foreground-muted)]"
    >
      Sesión cerrada
    </p>
  );
}

function MarkStar({ className }: { className?: string }) {
  return (
    <svg
      className={cn("mark-star", className)}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 1.5 14.2 9.8 22.5 12 14.2 14.2 12 22.5 9.8 14.2 1.5 12l8.3-2.2L12 1.5Z" />
    </svg>
  );
}

export function LandingHero() {
  return (
    <div className="relative flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Atmospheric orange field — full-bleed visual plane */}
      <div
        aria-hidden
        className="atmos-orange animate-soft-drift pointer-events-none absolute inset-0 -z-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,5,0.55)_100%)]"
      />

      <Suspense fallback={null}>
        <ByeBanner />
      </Suspense>

      <header className="relative z-10 mx-auto flex w-full max-w-md items-center justify-between px-5 pt-6 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2"
          aria-label="Study Lab"
        >
          <MarkStar />
        </Link>
        <p className="text-[11px] font-medium tracking-wide text-[var(--foreground-muted)]">
          Study Lab
        </p>
      </header>

      <main className="relative z-10 mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col px-5 pb-10 pt-8 sm:px-6">
        {/* Focal glass pill */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <Link
            href="/register"
            className={cn(
              "glass-pill animate-pill-in w-full max-w-sm px-6 py-4 text-left",
            )}
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[11px] font-medium text-[var(--foreground-muted)]">
                Study Lab
              </span>
              <span className="font-display mt-0.5 text-lg font-semibold tracking-tight">
                Empezar a estudiar
              </span>
            </span>
            <span
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]"
              aria-hidden
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </Link>

          <div className="mt-4 flex w-full max-w-sm items-center justify-center gap-5 text-sm text-[var(--foreground-muted)]">
            <Link href="/login" className="hover:text-[var(--foreground)]">
              Entrar
            </Link>
            <span aria-hidden className="opacity-30">
              ·
            </span>
            <Link href="/guest" className="hover:text-[var(--foreground)]">
              Probar
            </Link>
          </div>
        </div>

        {/* Brand-forward footer headline */}
        <div className="animate-fade-up mt-auto pt-10">
          <h1 className="font-display text-[clamp(2.75rem,14vw,4.5rem)] font-bold leading-[0.95] tracking-tight">
            Study Lab
          </h1>
          <p className="mt-3 max-w-[16rem] text-sm leading-snug text-[var(--foreground-muted)]">
            Prepárate para{" "}
            <span className="font-medium text-[var(--foreground)]">
              AWS Cloud Practitioner
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

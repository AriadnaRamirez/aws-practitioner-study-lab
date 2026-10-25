"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { Mascot } from "@/components/brand/mascot";
import { SiteCredits } from "@/components/shell/site-credits";
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

export function LandingHero() {
  return (
    <div className="relative flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_35%,rgba(232,80,2,0.14),transparent_70%)]"
      />

      <Suspense fallback={null}>
        <ByeBanner />
      </Suspense>

      <header className="relative z-10 mx-auto flex w-full max-w-md items-center justify-between px-5 pt-6 sm:px-6">
        <Link href="/" aria-label="Study Lab" className="inline-flex">
          <Logo size={36} priority />
        </Link>
        <p className="text-[11px] font-medium tracking-wide text-[var(--foreground-muted)]">
          Study Lab
        </p>
      </header>

      <main className="relative z-10 mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col px-5 pb-10 pt-4 sm:px-6">
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <Mascot pose="study" size="hero" priority />

          <Link
            href="/register"
            prefetch
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
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--brand-white)]"
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

          <div className="flex w-full max-w-sm items-center justify-center gap-5 text-sm text-[var(--foreground-muted)]">
            <Link
              href="/login"
              prefetch={false}
              className="hover:text-[var(--foreground)]"
            >
              Entrar
            </Link>
            <span aria-hidden className="opacity-30">
              ·
            </span>
            <Link
              href="/guest"
              prefetch={false}
              className="hover:text-[var(--foreground)]"
            >
              Probar
            </Link>
          </div>
        </div>

        <div className="animate-fade-up mt-auto pt-8">
          <div
            className="mb-5 h-0.5 w-12 rounded-full bg-[var(--accent)]"
            aria-hidden
          />
          <h1 className="font-display text-[clamp(2.75rem,14vw,4.5rem)] font-bold leading-[0.95] tracking-tight text-[var(--brand-white)]">
            Study Lab
          </h1>
          <p className="mt-3 max-w-[16rem] text-sm leading-snug text-[var(--brand-light-gray)]">
            Prepárate para{" "}
            <span className="font-medium text-[var(--brand-white)]">
              AWS Cloud Practitioner
            </span>
          </p>
          <p className="mt-2 text-xs text-[var(--brand-light-gray)]">
            Por Ariadna Ramírez · Material no oficial
          </p>
        </div>
      </main>

      <SiteCredits className="relative z-10 bg-[var(--background)]/80" />
    </div>
  );
}

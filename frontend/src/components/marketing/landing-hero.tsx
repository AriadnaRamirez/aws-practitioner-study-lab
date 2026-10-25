"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SiteFooter } from "@/components/shell/site-footer";
import { cn } from "@/lib/utils";

function ByeBanner() {
  const params = useSearchParams();
  if (params.get("bye") !== "1") return null;
  return (
    <p
      role="status"
      className="border-b border-[var(--border)] px-4 py-2 text-center text-sm text-[var(--foreground-muted)]"
    >
      sesión cerrada
    </p>
  );
}

function ArrowGlyph({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl bg-black/15 sm:size-12",
        className,
      )}
      aria-hidden
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12h12M13 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function LandingHero() {
  return (
    <div className="flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <Suspense fallback={null}>
        <ByeBanner />
      </Suspense>

      <header className="border-b border-[var(--border)]/60">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="font-display text-sm font-semibold lowercase tracking-tight">
            study lab
          </p>
          <nav className="flex items-center gap-3 text-sm lowercase">
            <Link
              href="/login"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              entrar
            </Link>
            <Link
              href="/register"
              className="keycap keycap-accent h-9 px-4 text-xs"
            >
              registro
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full min-w-0 max-w-lg flex-1 flex-col justify-center px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-center text-3xl font-semibold lowercase tracking-tight sm:text-4xl">
          study lab
        </h1>
        <p className="mt-2 text-center text-sm lowercase text-[var(--foreground-muted)]">
          aws cloud practitioner
        </p>

        <div
          className="mt-10 grid grid-cols-3 gap-3 sm:gap-4"
          role="group"
          aria-label="acciones"
        >
          <Link
            href="/register"
            className="keycap keycap-accent animate-key-pop aspect-square text-base sm:text-lg"
          >
            estudia
          </Link>
          <span
            className="keycap animate-key-pop-1 aspect-square text-base sm:text-lg"
            aria-hidden
          >
            aws
          </span>
          <span
            className="keycap animate-key-pop-2 aspect-square text-base sm:text-lg"
            aria-hidden
          >
            hoy
          </span>
          <Link
            href="/register"
            className="keycap keycap-accent animate-key-pop-3 aspect-square"
            aria-label="empezar"
          >
            <ArrowGlyph />
          </Link>
          <Link
            href="/login"
            className="keycap animate-key-pop-4 aspect-square text-base sm:text-lg"
          >
            entra
          </Link>
          <Link
            href="/guest"
            className="keycap animate-key-pop-5 aspect-square text-base sm:text-lg"
          >
            prueba
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ByeBanner() {
  const params = useSearchParams();
  if (params.get("bye") !== "1") return null;
  return (
    <p
      role="status"
      className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-center text-sm text-[var(--foreground-muted)]"
    >
      Sesión cerrada.
    </p>
  );
}

/** Formal, mobile-first marketing page — website, not app chrome. */
export function LandingHero() {
  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <Suspense fallback={null}>
        <ByeBanner />
      </Suspense>

      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <p className="font-display text-sm font-semibold tracking-tight">
          AWS Practitioner Study Lab
        </p>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/login"
            className="text-[var(--foreground-muted)] hover:text-[var(--accent)]"
          >
            Entrar
          </Link>
          <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
            Crear cuenta
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        <h1 className="font-display max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Prepárate para el examen{" "}
          <span className="text-[var(--accent)]">AWS Cloud Practitioner</span>
        </h1>
        <p className="mt-4 max-w-lg text-base text-[var(--foreground-muted)] sm:text-lg">
          Flashcards MCQ, dominio por tema y modo examen.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg" }), "w-full justify-center sm:w-auto")}
          >
            Crear cuenta
          </Link>
          <Link
            href="/guest"
            className="text-center text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline sm:text-left"
          >
            Probar sin cuenta
          </Link>
        </div>
      </main>
    </div>
  );
}

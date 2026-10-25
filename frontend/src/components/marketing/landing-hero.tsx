"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SiteFooter } from "@/components/shell/site-footer";
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

/**
 * Formal marketing homepage — document-like site, never app shell
 * (no bottom tabs, no glassmorphism, no neon accents).
 */
export function LandingHero() {
  return (
    <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip bg-[var(--background)] text-[var(--foreground)]">
      <Suspense fallback={null}>
        <ByeBanner />
      </Suspense>

      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="font-display text-sm font-semibold tracking-tight">
            AWS Practitioner Study Lab
          </p>
          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/login"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              Acceso
            </Link>
            <Link
              href="/register"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Registro
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
          Certificación CLF-C02
        </p>
        <h1 className="font-display mt-3 max-w-2xl text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl">
          Preparación formal para el examen{" "}
          <span className="text-[var(--accent)]">AWS Cloud Practitioner</span>
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--foreground-muted)]">
          Práctica con flashcards, seguimiento por tema y simulacro cronometrado.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full justify-center sm:w-auto",
            )}
          >
            Crear cuenta
          </Link>
          <Link
            href="/guest"
            className="text-center text-sm text-[var(--foreground-muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline sm:text-left"
          >
            Continuar como invitado
          </Link>
        </div>

        <ul className="mt-14 grid min-w-0 gap-6 border-t border-[var(--border)] pt-10 sm:grid-cols-3">
          {[
            { t: "Flashcards", d: "MCQ con refuerzo al fallar" },
            { t: "Temas", d: "Servicios, Linux y redes" },
            { t: "Examen", d: "Simulacro cronometrado" },
          ].map((item) => (
            <li key={item.t} className="min-w-0">
              <p className="font-display text-sm font-semibold">{item.t}</p>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                {item.d}
              </p>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}

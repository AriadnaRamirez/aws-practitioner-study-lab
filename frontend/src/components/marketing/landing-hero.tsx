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
      className="border-b border-[var(--border)] px-4 py-2 text-center text-sm text-[var(--foreground-muted)]"
    >
      Sesión cerrada.
    </p>
  );
}

export function LandingHero() {
  return (
    <div className="flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <Suspense fallback={null}>
        <ByeBanner />
      </Suspense>

      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <p className="font-display text-sm font-semibold tracking-tight">
            Study Lab
          </p>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/login"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              Entrar
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
              Registro
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <h1 className="font-display max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          AWS Cloud Practitioner
        </h1>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
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
            className="text-center text-sm text-[var(--accent)] underline-offset-4 hover:underline sm:text-left"
          >
            Probar
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

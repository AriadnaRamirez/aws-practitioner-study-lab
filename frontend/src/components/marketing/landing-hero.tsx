"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { FlashDeckShowcase } from "@/components/study/flash-deck";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ByeBanner() {
  const params = useSearchParams();
  if (params.get("bye") !== "1") return null;
  return (
    <p
      role="status"
      className="mx-6 mt-2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-2 text-sm text-[var(--foreground)] md:mx-10"
    >
      Sesión cerrada. Gracias por estudiar — vuelve cuando quieras.
    </p>
  );
}

export function LandingHero() {
  return (
    <section className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-black">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 animate-drift"
          style={{
            background: `
              radial-gradient(ellipse 70% 50% at 20% 30%, var(--hero-mesh-a), transparent 55%),
              radial-gradient(ellipse 55% 40% at 85% 15%, var(--hero-mesh-c), transparent 50%),
              radial-gradient(ellipse 80% 55% at 60% 90%, var(--hero-mesh-b), transparent 55%)
            `,
          }}
        />
        <div
          className="animate-soft-pulse absolute left-1/2 top-1/3 h-64 w-[28rem] -translate-x-1/2 rounded-full blur-[100px]"
          style={{ background: "var(--glow)" }}
        />
      </div>

      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <span className="font-display text-sm font-semibold tracking-tight text-white md:text-base">
          AWS Practitioner Study Lab
        </span>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Crear cuenta
          </Link>
        </nav>
      </header>

      <Suspense fallback={null}>
        <ByeBanner />
      </Suspense>

      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 pb-20 pt-6 md:grid-cols-2 md:gap-14 md:px-10">
        <div>
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-white">Tu mazo.</span>
            <br />
            <span className="text-gradient-aws">Tu examen AWS.</span>
          </h1>

          <p className="animate-fade-up-delay-1 mt-6 max-w-md text-lg font-medium leading-snug text-white/90 md:text-xl">
            Flashcards MCQ con refuerzo al fallar — minimalismo tech para
            practicar cada día.
          </p>

          <p className="animate-fade-up-delay-2 mt-4 max-w-md text-sm leading-relaxed text-[var(--foreground-muted)] md:text-base">
            Empieza en un clic. Feedback inmediato. Dominio con rachas.
          </p>

          <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-3">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
              Crear cuenta
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Entrar
            </Link>
            <Link
              href="/estudiar?start=10"
              className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Empezar 10 flashcards →
            </Link>
          </div>
        </div>

        <div className="animate-fade-up-delay-2 flex justify-center md:justify-end">
          <FlashDeckShowcase />
        </div>
      </div>
    </section>
  );
}

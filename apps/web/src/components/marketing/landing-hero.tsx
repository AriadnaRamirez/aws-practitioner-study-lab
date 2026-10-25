import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingHero() {
  return (
    <section className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      {/* Atmosphere: full-bleed mesh + soft glows (not a card collage) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute inset-0 animate-drift"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 15% 20%, var(--hero-mesh-a), transparent 55%),
              radial-gradient(ellipse 70% 50% at 85% 15%, var(--hero-mesh-c), transparent 50%),
              radial-gradient(ellipse 90% 70% at 50% 90%, var(--hero-mesh-b), transparent 55%),
              linear-gradient(165deg, var(--background) 0%, color-mix(in srgb, var(--hero-mesh-b) 40%, var(--background)) 100%)
            `,
          }}
        />
        <div
          className="animate-soft-pulse absolute -left-24 top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--glow)" }}
        />
        <div
          className="absolute bottom-10 right-0 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "var(--glow-secondary)" }}
        />
        {/* Horizon band as visual anchor — study / cloud atmosphere */}
        <div
          className="absolute inset-x-0 bottom-0 h-[42%] opacity-90"
          style={{
            background: `
              linear-gradient(
                to top,
                color-mix(in srgb, var(--accent) 12%, transparent) 0%,
                transparent 70%
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 48px,
                color-mix(in srgb, var(--border) 35%, transparent) 48px,
                color-mix(in srgb, var(--border) 35%, transparent) 49px
              )
            `,
            maskImage: "linear-gradient(to top, black 20%, transparent 95%)",
          }}
        />
      </div>

      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <span className="font-display text-sm font-semibold tracking-tight text-[var(--foreground)] md:text-base">
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
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Crear cuenta
          </Link>
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pb-24 pt-8 md:px-10">
        <h1 className="animate-fade-up font-display text-4xl font-bold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl lg:text-7xl">
          AWS Practitioner
          <br />
          Study Lab
        </h1>

        <p className="animate-fade-up-delay-1 mt-6 max-w-xl text-xl font-medium leading-snug text-[var(--foreground)] md:text-2xl">
          Memoriza servicios AWS y llega al examen con práctica diaria.
        </p>

        <p className="animate-fade-up-delay-2 mt-4 max-w-lg text-base leading-relaxed text-[var(--foreground-muted)] md:text-lg">
          Flashcards MCQ, modo estudio y examen cronometrado — pensado para
          estudiar en clase y en casa.
        </p>

        <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Crear cuenta
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
          >
            Entrar
          </Link>
          <Link
            href="/estudiar"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
          >
            Probar sin cuenta
          </Link>
        </div>
      </div>
    </section>
  );
}

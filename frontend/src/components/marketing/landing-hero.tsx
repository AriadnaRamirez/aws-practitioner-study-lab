"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { Mascot } from "@/components/brand/mascot";
import { SiteCredits } from "@/components/shell/site-credits";
import { buttonVariants } from "@/components/ui/button";
import { FOCUS_RING } from "@/components/ui/focus";
import { Notice } from "@/components/ui/notice";
import { cn } from "@/lib/utils";

const TEXT_LINK = cn(
  "rounded-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline",
  FOCUS_RING,
);

function ByeBanner() {
  const params = useSearchParams();
  const deleted = params.get("deleted") === "1";
  if (params.get("bye") !== "1" && !deleted) return null;
  return (
    <Notice className="relative z-10 px-7 py-2 text-center">
      {deleted ? "Tu cuenta se eliminó. ¡Gracias por estudiar con nosotros!" : "Sesión cerrada"}
    </Notice>
  );
}

/**
 * Disposición del boceto (header / mascot / CTA / links / tagline / footer).
 * Paleta: producción dark + accent — sin tip light.
 */
export function LandingHero() {
  return (
    <div className="relative flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-hidden text-[var(--foreground)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_30%,var(--hero-mesh-a),transparent_70%)]"
      />

      <Suspense fallback={null}>
        <ByeBanner />
      </Suspense>

      <header className="relative z-10 mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-7 pt-6 sm:px-8 md:max-w-5xl md:px-10 lg:max-w-6xl lg:px-12 lg:pt-7 [@media(max-height:500px)]:md:pt-4">
        <Link
          href="/"
          className={cn("inline-flex min-w-0 items-center rounded-lg", FOCUS_RING)}
          aria-label="AWS Study Lab"
        >
          <Logo size={32} priority withWordmark />
        </Link>
        <Link
          href="/login"
          prefetch={false}
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "shrink-0",
          )}
        >
          Entrar
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col items-center px-7 pb-10 pt-10 text-center sm:max-w-lg sm:px-8 sm:pt-14 md:grid md:max-w-5xl md:grid-cols-2 md:grid-rows-[1fr_auto_auto_auto_auto_1fr] md:justify-items-start md:gap-x-12 md:px-10 md:text-left lg:max-w-6xl lg:gap-x-16 lg:px-12 [@media(max-height:500px)]:md:pb-4 [@media(max-height:500px)]:md:pt-2">
        <h1 className="text-[clamp(2rem,8vw,2.75rem)] font-extrabold leading-tight tracking-tight text-[var(--foreground)] md:col-start-1 md:row-start-2 md:text-5xl lg:text-6xl [@media(max-height:500px)]:md:text-4xl">
          AWS Study Lab
        </h1>

        <div className="mt-8 flex w-full max-w-sm items-center justify-center py-2 sm:mt-10 md:col-start-2 md:row-span-6 md:row-start-1 md:mt-0 md:max-w-none md:self-center md:justify-self-stretch">
          <Mascot
            pose="study"
            size="hero"
            priority
            className="mx-auto md:h-[min(28rem,60dvh)] md:max-w-md [@media(max-height:500px)]:md:h-[62dvh]"
          />
        </div>

        <Link
          href="/login"
          prefetch={false}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 w-full max-w-xs sm:mt-10 md:col-start-1 md:row-start-4 md:mt-8 [@media(max-height:500px)]:md:mt-5",
          )}
        >
          Entrar
        </Link>

        <p className="mt-4 text-sm text-[var(--foreground-muted)] md:col-start-1 md:row-start-5 md:w-full md:max-w-xs md:text-center">
          <Link href="/register" prefetch={false} className={TEXT_LINK}>
            Crear cuenta
          </Link>
          <span className="mx-2 opacity-40" aria-hidden>
            ·
          </span>
          <Link href="/guest" prefetch={false} className={TEXT_LINK}>
            Probar
          </Link>
        </p>

        <p className="mt-8 max-w-[18rem] text-sm leading-snug text-[var(--foreground-muted)] sm:mt-10 md:col-start-1 md:row-start-3 md:mt-3 md:max-w-sm md:text-base lg:text-lg">
          Prepárate para la certificación AWS Cloud Practitioner
        </p>
      </main>

      <div className="relative z-10 mt-auto">
        <SiteCredits className="bg-[var(--background)]/40 px-7 sm:px-8" />
      </div>
    </div>
  );
}

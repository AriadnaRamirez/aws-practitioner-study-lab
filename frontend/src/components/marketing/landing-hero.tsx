"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/brand/logo";
import { Mascot } from "@/components/brand/mascot";
import { cn } from "@/lib/utils";

const AUTHOR_LINKEDIN = "https://www.linkedin.com/in/ariadnaramirez";

function ByeBanner() {
  const params = useSearchParams();
  if (params.get("bye") !== "1") return null;
  return (
    <p
      role="status"
      className="px-4 py-2 text-center text-sm text-[#646464]"
    >
      Sesión cerrada
    </p>
  );
}

/** Landing light/minimal según boceto v1. */
export function LandingHero() {
  return (
    <div className="flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-hidden bg-[#F6F6F4] text-[#1A1A1A]">
      <Suspense fallback={null}>
        <ByeBanner />
      </Suspense>

      <header className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-7 pt-6 sm:px-8 lg:max-w-3xl lg:px-10 lg:pt-7">
        <Link
          href="/"
          className="inline-flex min-w-0 items-center gap-2.5"
          aria-label="AWS Study Lab"
        >
          <Logo size={32} priority />
          <span className="font-display truncate text-sm font-semibold tracking-tight">
            AWS Study Lab
          </span>
        </Link>
        <Link
          href="/login"
          prefetch={false}
          className={cn(
            "inline-flex h-9 shrink-0 items-center justify-center rounded-full px-4 text-sm font-semibold",
            "bg-[#E4E4E0] text-[#1A1A1A] transition-colors hover:bg-[#D8D8D2]",
          )}
        >
          Entrar
        </Link>
      </header>

      <main className="mx-auto flex w-full min-w-0 max-w-md flex-1 flex-col items-center px-7 pb-10 pt-10 text-center sm:max-w-lg sm:px-8 sm:pt-14">
        <h1 className="font-display text-[clamp(2rem,8vw,2.75rem)] font-bold leading-tight tracking-tight">
          AWS Study Lab
        </h1>

        <div className="mt-8 flex w-full max-w-sm items-center justify-center rounded-2xl bg-[#EBEBE8] px-4 py-6 sm:mt-10 sm:py-8">
          <Mascot pose="study" size="hero" priority className="mx-auto" />
        </div>

        <Link
          href="/login"
          prefetch={false}
          className={cn(
            "mt-8 inline-flex h-12 w-full max-w-xs items-center justify-center rounded-full text-base font-semibold sm:mt-10",
            "bg-[#E85002] text-white transition-colors hover:bg-[#F16001]",
          )}
        >
          Entrar
        </Link>

        <p className="mt-4 text-sm text-[#646464]">
          <Link
            href="/register"
            prefetch={false}
            className="font-medium text-[#1A1A1A] underline-offset-4 hover:underline"
          >
            Crear cuenta
          </Link>
          <span className="mx-2 opacity-40" aria-hidden>
            ·
          </span>
          <Link
            href="/guest"
            prefetch={false}
            className="font-medium text-[#1A1A1A] underline-offset-4 hover:underline"
          >
            Probar
          </Link>
        </p>

        <p className="mt-8 max-w-[18rem] text-sm leading-snug text-[#646464] sm:mt-10">
          Prepárate para la certificación AWS Cloud Practitioner
        </p>
      </main>

      <footer className="mt-auto bg-[#E8E8E4] px-7 py-6 text-center sm:px-8">
        <p className="text-xs leading-relaxed text-[#646464]">
          Material de estudio no oficial de AWS.
        </p>
        <p className="mt-1.5 text-xs text-[#646464]">
          Autora ·{" "}
          <a
            href={AUTHOR_LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#333] underline-offset-2 hover:underline"
          >
            Ariadna Ramírez
          </a>
        </p>
      </footer>
    </div>
  );
}

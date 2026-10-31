import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Mascot } from "@/components/brand/mascot";
import { FOCUS_RING } from "@/components/ui/focus";
import { PAGE_TITLE } from "@/components/ui/page";
import { cn } from "@/lib/utils";
import { NotFoundActions } from "./not-found-actions";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh w-full min-w-0 flex-col text-[var(--foreground)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_32%,var(--hero-mesh-a),transparent_70%)]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-lg items-center px-7 pt-6 sm:px-8">
        <Link
          href="/"
          className={cn("inline-flex min-w-0 items-center rounded-lg", FOCUS_RING)}
          aria-label="AWS Study Lab"
        >
          <Logo size={32} priority withWordmark />
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-7 pb-16 pt-8 text-center">
        <Mascot pose="wave" size="md" glow={false} priority />
        <h1 className={cn(PAGE_TITLE, "mt-6")}>Esta página no existe</h1>
        <p className="mt-2 max-w-prose text-base text-[var(--foreground-muted)]">
          Esa dirección no corresponde a ninguna pantalla de AWS Study Lab.
        </p>
        <NotFoundActions />
      </main>
    </div>
  );
}

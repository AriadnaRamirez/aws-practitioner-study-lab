import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cardVariants } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { PageContainer, PageHeader } from "@/components/ui/page";
import { MINIGAMES } from "@/lib/minigames";
import { cn } from "@/lib/utils";

export function MinigamesIndex() {
  return (
    <PageContainer width="wide">
      <PageHeader
        title="Minijuegos"
        subtitle="Practica los temas difíciles jugando: arrastra, compara y aprende de cada error."
        mascot="laptop"
      />

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MINIGAMES.map((game) => {
          const Icon = game.icon;
          return (
            <li key={game.slug}>
              <Link
                href={`/minijuegos/${game.slug}`}
                className={cn(
                  cardVariants({ interactive: true }),
                  "group flex h-full flex-col",
                  FOCUS_RING,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"
                  >
                    <Icon className="size-5" />
                  </span>
                  <Badge>{game.topic}</Badge>
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight text-[var(--foreground)]">
                  {game.title}
                </h2>
                <p className="mt-1 flex-1 text-sm text-[var(--foreground-muted)]">
                  {game.description}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3 text-xs font-semibold text-[var(--foreground-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" aria-hidden />
                    {game.minutes} min · {game.format}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[var(--foreground)]">
                    Jugar
                    <ArrowRight
                      className="size-4 motion-safe:transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </PageContainer>
  );
}

import { Mascot } from "@/components/brand/mascot";
import { FlashDeck } from "@/components/study/flash-deck";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/page";
import { Skeleton } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  BUILDER_GRID,
  BUILDER_HALVES,
  BUILDER_MAIN,
} from "./session-builder/builder-model";

/** "Arma tu partida" while topics and progress load: same header, cards and topic grid. */
export function BuilderSkeleton({
  message = "Cargando tus temas…",
}: {
  message?: string;
}) {
  return (
    <div aria-busy="true" className={BUILDER_GRID}>
      <p className="sr-only" role="status">
        {message}
      </p>
      <div className={BUILDER_MAIN} aria-hidden>
        <header className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-sans text-2xl font-extrabold leading-tight tracking-tight text-[var(--foreground)] sm:text-3xl">
              Arma tu partida
            </p>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              Elige temas, cuántas cartas y cómo se reparten.
            </p>
          </div>
          <Mascot
            pose="laptop"
            size="lg"
            glow={false}
            className="h-28 w-32 shrink-0 sm:h-44 sm:w-52 lg:h-56 lg:w-64"
          />
        </header>

        <div className={cn(BUILDER_HALVES, "mt-6 gap-3 md:gap-5 lg:gap-6")}>
          {[0, 1].map((i) => (
            <Card key={i} padding="sm">
              <Skeleton className="block h-4 w-28" />
              <Skeleton className="mt-3 block h-24 w-full rounded-xl" />
            </Card>
          ))}
        </div>

        <section className="mt-6">
          <SectionTitle as="h3">Qué temas entran</SectionTitle>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-full" />
            ))}
          </div>
          {[0, 1].map((g) => (
            <div key={g} className="mt-5">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="block h-4 w-40" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <div className={cn(BUILDER_HALVES, "mt-2 gap-1.5 md:gap-x-5 lg:gap-x-6")}>
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="block h-14 w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      <div className="hidden lg:col-span-4 lg:block" aria-hidden>
        <Card>
          <Skeleton className="block h-4 w-24" />
          <Skeleton className="mt-3 block h-10 w-40" />
          <Skeleton className="mt-3 block h-4 w-full" />
          <Skeleton className="mt-5 block h-12 w-full rounded-full" />
        </Card>
      </div>
    </div>
  );
}

/** Card screen while a game starts or resumes: streak line, progress bar and a shimmering deck. */
export function DeckSkeleton({
  message = "Preparando tu partida…",
}: {
  message?: string;
}) {
  return (
    <section
      aria-busy="true"
      className="mx-auto w-full min-w-0 py-2 md:max-w-xl lg:max-w-4xl"
    >
      <p className="sr-only" role="status">
        {message}
      </p>
      <div aria-hidden>
        <div className="flex items-baseline justify-between gap-3">
          <Skeleton className="block h-4 w-20" />
          <Skeleton className="block h-4 w-10" />
        </div>
        <Skeleton className="mt-4 block h-2 w-full rounded-full" />
        <div className="mt-8">
          <FlashDeck wide loading eyebrow="Carta" title="" footer={message} />
        </div>
      </div>
    </section>
  );
}

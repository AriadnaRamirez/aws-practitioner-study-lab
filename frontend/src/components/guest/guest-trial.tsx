"use client";

import Link from "next/link";
import {
  Check,
  Lightbulb,
  Layers,
  Play,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  GUEST_MAX_SESSIONS,
  GUEST_SAMPLE_SIZE,
  type GuestProbe,
  type KnowledgeItem,
} from "@aps/shared";
import { Logo } from "@/components/brand/logo";
import { Mascot } from "@/components/brand/mascot";
import { SiteCredits } from "@/components/shell/site-credits";
import { CelebrateBurst } from "@/components/study/celebrate-burst";
import { FlashDeck } from "@/components/study/flash-deck";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardLabel } from "@/components/ui/card";
import { FOCUS_RING } from "@/components/ui/focus";
import { Notice } from "@/components/ui/notice";
import { PAGE_TITLE, PageContainer } from "@/components/ui/page";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/spinner";
import {
  createGuestProbe,
  fetchGuestProbe,
  getStoredGuestProbeId,
  recordGuestSession,
  storeGuestProbeId,
} from "@/lib/api";
import { getKnowledgeItems, MOCK_KNOWLEDGE } from "@/lib/content-api";
import { cn } from "@/lib/utils";

type Phase = "loading" | "intro" | "quiz" | "done" | "capped" | "error";

type SampleQ = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

const HERO_TITLE =
  "text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl";

const TEXT_LINK = cn(
  "rounded-sm font-semibold text-[var(--foreground)] underline-offset-4 hover:underline",
  FOCUS_RING,
);

function shuffle<T>(list: readonly T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Wrong options are names of other concepts (same topic first), never definitions. */
function distractorNames(item: KnowledgeItem, items: KnowledgeItem[]): string[] {
  const others = items.filter((o) => o.name !== item.name);
  const ranked = [
    ...shuffle(others.filter((o) => o.topicId === item.topicId)),
    ...shuffle(others.filter((o) => o.topicId !== item.topicId)),
  ];
  return [...new Set(ranked.map((o) => o.name))].slice(0, 3);
}

function buildSamples(items: KnowledgeItem[]): SampleQ[] {
  return shuffle(items)
    .slice(0, GUEST_SAMPLE_SIZE)
    .map((item) => {
      const pool = [item.name, ...distractorNames(item, items)];
      const choices = shuffle(pool);
      return {
        id: item.id,
        prompt: item.definition,
        choices,
        correctIndex: choices.indexOf(item.name),
        explanation: item.explanation,
      };
    });
}

function resultCopy(correct: number, total: number) {
  if (total > 0 && correct === total) return "¡Perfecto! Vas listo para más";
  if (correct / Math.max(total, 1) >= 0.6) return "¡Muy bien! Ya tienes buena base";
  return "Buen comienzo: aquí se aprende fallando";
}

const PREVIEW: { icon: LucideIcon; text: string }[] = [
  { icon: Layers, text: `${GUEST_SAMPLE_SIZE} cartas como las del examen` },
  { icon: Lightbulb, text: "Explicación al instante en cada respuesta" },
];

const BENEFITS = [
  "Plan diario hacia la fecha de tu examen",
  "Repaso automático de lo que más fallas",
  "Racha, progreso por tema y podio",
];

function GuestHeader({ registerHref }: { registerHref: string }) {
  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 px-5 py-3 sm:px-6 md:max-w-5xl lg:max-w-6xl lg:px-8">
        <Link
          href="/"
          aria-label="AWS Study Lab"
          className={cn("inline-flex min-w-0 items-center rounded-lg", FOCUS_RING)}
        >
          <Logo size={28} withWordmark />
        </Link>
        <nav aria-label="Cuenta" className="flex shrink-0 items-center gap-2">
          <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Entrar
          </Link>
          <Link href={registerHref} className={buttonVariants({ size: "sm" })}>
            Crear cuenta
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Benefits() {
  return (
    <ul className="space-y-2.5">
      {BENEFITS.map((text) => (
        <li key={text} className="flex items-start gap-2.5 text-sm text-[var(--foreground)] sm:text-base">
          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--success-text)]">
            <Check className="size-3.5" aria-hidden />
          </span>
          {text}
        </li>
      ))}
    </ul>
  );
}

/** Closing screen shared by "done" and "capped": result or mascot, pitch, CTAs. */
function ConversionCard({
  visual,
  title,
  text,
  children,
}: {
  visual: ReactNode;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <Card
      as="section"
      aria-labelledby="prueba-cierre"
      padding="lg"
      className="mx-auto grid max-w-3xl animate-fade-up items-center gap-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10"
    >
      <div className="flex justify-center">{visual}</div>
      <div className="min-w-0">
        <h1
          id="prueba-cierre"
          className={PAGE_TITLE}
        >
          {title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-[var(--foreground-muted)]">
          {text}
        </p>
        <div className="mt-6">
          <Benefits />
        </div>
        {children}
      </div>
    </Card>
  );
}

export function GuestTrial() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [probe, setProbe] = useState<GuestProbe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [bank, setBank] = useState<KnowledgeItem[]>(MOCK_KNOWLEDGE);
  const [conceptCount, setConceptCount] = useState<number | null>(null);
  const [round, setRound] = useState(0);

  // `round` reshuffles the sample for every new attempt.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const samples = useMemo(() => buildSamples(bank), [bank, round]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, source } = await getKnowledgeItems();
        if (!cancelled && data.length > 0) {
          setBank(data);
          if (source === "api") setConceptCount(data.length);
        }

        const existingId = getStoredGuestProbeId();
        let next: GuestProbe;
        if (existingId) {
          try {
            next = await fetchGuestProbe(existingId);
          } catch {
            next = await createGuestProbe();
            storeGuestProbeId(next.id);
          }
        } else {
          next = await createGuestProbe();
          storeGuestProbeId(next.id);
        }
        if (cancelled) return;
        setProbe(next);
        if (next.convertedUserId) {
          setPhase("error");
          setError("Esta prueba ya se convirtió en una cuenta. Entra para seguir estudiando.");
        } else if (next.sessionsRemaining <= 0) {
          setPhase("capped");
        } else {
          setPhase("intro");
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "No se pudo iniciar la prueba");
        setPhase("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function finishSession() {
    if (!probe) return;
    try {
      const updated = await recordGuestSession(probe.id);
      setProbe(updated);
      setPhase("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la sesión");
      setPhase("error");
    }
  }

  function start() {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setCorrectCount(0);
    setRound((r) => r + 1);
    setPhase("quiz");
  }

  function onSelect(choice: number) {
    if (revealed) return;
    setSelected(choice);
    setRevealed(true);
    if (choice === samples[index]?.correctIndex) setCorrectCount((c) => c + 1);
  }

  function onNext() {
    if (index + 1 >= samples.length) {
      void finishSession();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  const registerHref = probe
    ? `/register?guest=${encodeURIComponent(probe.id)}`
    : "/register";
  const remaining = probe?.sessionsRemaining ?? GUEST_MAX_SESSIONS;
  const concepts = conceptCount
    ? `los ${conceptCount} conceptos del examen`
    : "todos los conceptos del examen";
  const current = phase === "quiz" ? samples[index] : undefined;
  const isLast = index + 1 >= samples.length;
  const wasCorrect = revealed && selected === current?.correctIndex;

  const primaryCta = (
    <Link href={registerHref} className={buttonVariants({ size: "lg" })}>
      Crear cuenta
    </Link>
  );
  const loginLine = (
    <p className="mt-4 text-sm text-[var(--foreground-muted)]">
      ¿Ya tienes cuenta?{" "}
      <Link href="/login" className={TEXT_LINK}>
        Entrar
      </Link>
    </p>
  );

  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col overflow-x-hidden">
      <GuestHeader registerHref={registerHref} />

      <main id="contenido" className="flex w-full min-w-0 flex-1 flex-col">
        <PageContainer width="wide" className="flex flex-1 flex-col justify-center">
          {phase === "loading" || phase === "intro" ? (
            <section
              aria-labelledby="prueba-titulo"
              aria-busy={phase === "loading"}
              className="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:gap-12"
            >
              <div className="min-w-0 animate-fade-up">
                <Badge tone="accent">
                  Sin registro
                </Badge>
                <h1 id="prueba-titulo" className={cn(HERO_TITLE, "mt-4")}>
                  Pruébalo en 2 minutos
                </h1>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--foreground-muted)] sm:text-lg">
                  Responde {GUEST_SAMPLE_SIZE} preguntas del examen AWS Certified Cloud
                  Practitioner y mira cómo se estudia aquí.
                </p>

                <ul className="mt-6 space-y-3">
                  {PREVIEW.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-sm text-[var(--foreground)] sm:text-base">
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                  {phase === "loading" ? (
                    <>
                      <p className="sr-only" role="status">
                        Preparando tu prueba…
                      </p>
                      <Skeleton className="h-12 w-56 rounded-full" />
                    </>
                  ) : (
                    <>
                      <Button size="lg" onClick={start} className="px-8">
                        <Play className="size-4 fill-current" aria-hidden />
                        Empezar la prueba
                      </Button>
                      <Link href={registerHref} className={cn(TEXT_LINK, "text-sm")}>
                        o crea tu cuenta
                      </Link>
                    </>
                  )}
                </div>
                {phase === "intro" ? (
                  <p className="mt-4 text-sm text-[var(--foreground-muted)]">
                    Te {remaining === 1 ? "queda" : "quedan"} {remaining} de{" "}
                    {GUEST_MAX_SESSIONS} pruebas.
                  </p>
                ) : null}
              </div>

              <Mascot
                pose="rocket"
                size="hero"
                priority
                className="mx-auto hidden md:block md:h-[min(26rem,55dvh)] md:max-w-md"
              />
            </section>
          ) : null}

          {phase === "error" ? (
            <section aria-labelledby="prueba-error" className="mx-auto w-full max-w-lg text-center">
              <Mascot pose="laptop" size="lg" glow={false} className="mx-auto h-36 w-44" />
              <h1 id="prueba-error" className={cn(PAGE_TITLE, "mt-6")}>
                No pudimos abrir la prueba
              </h1>
              <Notice tone="danger" boxed className="mt-5 text-left">
                {error}
              </Notice>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/login" className={buttonVariants({ size: "lg" })}>
                  Entrar
                </Link>
                <Link
                  href={registerHref}
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  Crear cuenta
                </Link>
              </div>
            </section>
          ) : null}

          {phase === "capped" ? (
            <ConversionCard
              visual={
                <Mascot pose="laptop" size="lg" glow={false} className="h-40 w-48 md:h-52 md:w-56" />
              }
              title={`Ya usaste tus ${GUEST_MAX_SESSIONS} pruebas`}
              text={`Crea tu cuenta y sigue estudiando ${concepts}, sin límite.`}
            >
              <div className="mt-8 flex flex-wrap gap-3">{primaryCta}</div>
              {loginLine}
            </ConversionCard>
          ) : null}

          {current ? (
            <section aria-labelledby="prueba-titulo" className="mx-auto w-full min-w-0 md:max-w-xl lg:max-w-4xl">
              <div className="flex min-w-0 items-baseline justify-between gap-3 text-sm">
                <h1 id="prueba-titulo" className="font-semibold text-[var(--foreground)]">
                  Prueba
                </h1>
                <p className="tabular-nums text-[var(--foreground-muted)]">
                  {correctCount} {correctCount === 1 ? "acierto" : "aciertos"} · {index + 1}/
                  {samples.length}
                </p>
              </div>
              <ProgressBar
                value={index + (revealed ? 1 : 0)}
                max={samples.length}
                label="Progreso de la prueba"
                className="mt-4"
              />

              <div key={current.id} className="mt-8">
                <FlashDeck
                  wide
                  eyebrow="¿Qué servicio o concepto es?"
                  title={current.prompt}
                  footer={`${index + 1} de ${samples.length}`}
                  flipped={revealed}
                  back={
                    revealed ? (
                      <div
                        role="status"
                        className="relative flex h-full flex-col lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8"
                      >
                        {wasCorrect ? <CelebrateBurst /> : null}
                        <div className="min-w-0">
                          <span
                            className={cn(
                              "animate-celebrate inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold",
                              wasCorrect
                                ? "bg-[var(--success)] text-[var(--success-fg)]"
                                : "bg-[var(--danger)] text-[var(--danger-fg)]",
                            )}
                          >
                            {wasCorrect ? "¡Correcto!" : "Incorrecto"}
                          </span>
                          <p className="mt-4 text-sm leading-snug text-[var(--foreground)]">
                            <span className="text-[var(--foreground-muted)]">Respuesta: </span>
                            <span className="font-semibold">
                              {String.fromCharCode(65 + current.correctIndex)}.{" "}
                              {current.choices[current.correctIndex]}
                            </span>
                          </p>
                        </div>
                        <div className="min-w-0">
                          <Card variant="inset" padding="sm" className="mt-4 lg:mt-0">
                            <CardLabel as="p">Explicación</CardLabel>
                            <p className="mt-1.5 text-sm leading-relaxed text-[var(--foreground)]">
                              {current.explanation?.trim() ||
                                `La respuesta es «${current.choices[current.correctIndex]}».`}
                            </p>
                          </Card>
                          <Button className="mt-5 w-full" onClick={onNext}>
                            {isLast ? "Ver mi resultado" : "Siguiente"}
                          </Button>
                        </div>
                      </div>
                    ) : null
                  }
                >
                  <ul className="mt-3 flex flex-col gap-2">
                    {current.choices.map((choice, i) => {
                      const isCorrect = revealed && i === current.correctIndex;
                      const isWrongPick = revealed && selected === i && !isCorrect;
                      return (
                        <li key={`${current.id}-${i}`}>
                          <button
                            type="button"
                            disabled={revealed}
                            onClick={() => onSelect(i)}
                            className={cn(
                              "keycap keycap-option w-full px-4 py-3 text-sm leading-snug disabled:cursor-default",
                              isCorrect && "keycap-correct",
                              isWrongPick && "keycap-wrong",
                            )}
                          >
                            <span className="mr-2 shrink-0 font-semibold opacity-45">
                              {String.fromCharCode(65 + i)}.
                            </span>
                            <span>{choice}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </FlashDeck>
              </div>

              <Card
                variant="flat"
                padding="sm"
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm text-[var(--foreground-muted)]">
                  <span className="font-semibold text-[var(--foreground)]">¿Te está gustando?</span>{" "}
                  Con tu cuenta guardas tu avance y repasas lo que fallas.
                </p>
                <Link
                  href={registerHref}
                  className={cn(buttonVariants({ variant: "soft", size: "sm" }), "w-fit shrink-0")}
                >
                  Crear cuenta
                </Link>
              </Card>
            </section>
          ) : null}

          {phase === "done" ? (
            <ConversionCard
              visual={
                <ProgressRing
                  value={correctCount}
                  max={samples.length}
                  tone="success"
                  label={`${correctCount} de ${samples.length} correctas`}
                  className="size-36 md:size-44"
                >
                  <span className="text-4xl font-extrabold leading-none tabular-nums tracking-tight text-[var(--foreground)] md:text-5xl">
                    {correctCount}/{samples.length}
                  </span>
                  <span className="mt-1.5 text-xs text-[var(--foreground-muted)]">correctas</span>
                </ProgressRing>
              }
              title={resultCopy(correctCount, samples.length)}
              text={`Crea tu cuenta para guardar este avance y seguir con ${concepts}.`}
            >
              <div className="mt-8 flex flex-wrap gap-3">
                {primaryCta}
                {remaining > 0 ? (
                  <Button variant="secondary" size="lg" onClick={start}>
                    Otra prueba ({remaining})
                  </Button>
                ) : null}
              </div>
              {loginLine}
            </ConversionCard>
          ) : null}
        </PageContainer>
      </main>

      <SiteCredits className="px-5 sm:px-6" />
    </div>
  );
}

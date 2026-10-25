"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  GUEST_MAX_SESSIONS,
  GUEST_SAMPLE_SIZE,
  type GuestProbe,
  type KnowledgeItem,
} from "@aps/shared";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createGuestProbe,
  fetchGuestProbe,
  getStoredGuestProbeId,
  recordGuestSession,
  storeGuestProbeId,
} from "@/lib/api";
import { getKnowledgeItems, MOCK_KNOWLEDGE } from "@/lib/content-api";

type Phase = "loading" | "intro" | "quiz" | "done" | "capped" | "error";

type SampleQ = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

function buildSamples(items: KnowledgeItem[]): SampleQ[] {
  return items.slice(0, GUEST_SAMPLE_SIZE).map((item) => {
    const pool = [item.name, ...item.distractors].slice(0, 4);
    while (pool.length < 4) pool.push(`Opción ${pool.length + 1}`);
    const correctIndex = 0;
    // Shuffle while tracking correct answer
    const indexed = pool.map((label, i) => ({ label, i }));
    for (let i = indexed.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const a = indexed[i]!;
      const b = indexed[j]!;
      indexed[i] = b;
      indexed[j] = a;
    }
    return {
      id: item.id,
      prompt: `¿Qué servicio o concepto es: “${item.definition}”?`,
      choices: indexed.map((x) => x.label),
      correctIndex: indexed.findIndex((x) => x.i === correctIndex),
      explanation: item.explanation,
    };
  });
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

  const samples = useMemo(() => buildSamples(bank), [bank]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getKnowledgeItems();
        if (!cancelled && data.length > 0) setBank(data);

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
          setError(
            "Este guest ya se convirtió en cuenta. Entra o crea otra prueba.",
          );
        } else if (next.sessionsRemaining <= 0) {
          setPhase("capped");
        } else {
          setPhase("intro");
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "No se pudo iniciar la prueba",
        );
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
      setError(
        err instanceof Error ? err.message : "No se pudo registrar la sesión",
      );
      setPhase("error");
    }
  }

  function onSelect(choice: number) {
    if (revealed) return;
    setSelected(choice);
    setRevealed(true);
    if (choice === samples[index]?.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
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

  return (
    <main className="relative isolate mx-auto flex min-h-dvh max-w-2xl flex-col px-6 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 10% 0%, var(--hero-mesh-a), transparent 60%),
            radial-gradient(ellipse 70% 50% at 90% 100%, var(--hero-mesh-b), transparent 55%)
          `,
        }}
      />

      <Link
        href="/"
        className="font-display text-sm font-semibold tracking-tight text-[var(--foreground)]"
      >
        AWS Practitioner Study Lab
      </Link>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
        Prueba sin cuenta
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        Sesión limitada de marketing
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--foreground-muted)]">
        Prueba {GUEST_SAMPLE_SIZE} preguntas de muestra. Crea una cuenta para
        guardar progreso y subir al podio. Hasta {GUEST_MAX_SESSIONS} sesiones
        guest.
      </p>

      {probe ? (
        <p className="mt-2 text-sm text-[var(--foreground-muted)]">
          Sesiones usadas: {probe.sessionsCount}/{GUEST_MAX_SESSIONS} · quedan{" "}
          {probe.sessionsRemaining}
        </p>
      ) : null}

      {phase === "loading" ? (
        <p className="mt-10 text-sm text-[var(--foreground-muted)]">
          Preparando tu prueba…
        </p>
      ) : null}

      {phase === "error" ? (
        <div className="mt-10 space-y-4">
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
          <Link href={registerHref} className={cn(buttonVariants({ size: "lg" }))}>
            Crear cuenta
          </Link>
        </div>
      ) : null}

      {phase === "capped" ? (
        <div className="mt-10 space-y-4">
          <p className="text-base text-[var(--foreground)]">
            Llegaste al tope de sesiones guest. Crea una cuenta para seguir
            estudiando con historial y podio.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={registerHref}
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
          </div>
        </div>
      ) : null}

      {phase === "intro" ? (
        <div className="mt-10 space-y-6">
          <p className="text-base leading-relaxed text-[var(--foreground)]">
            No guardamos progreso ni entras al podio como invitado. Esta
            muestra solo sirve para engancharte al lab.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={cn(buttonVariants({ size: "lg" }))}
              onClick={() => setPhase("quiz")}
            >
              Empezar muestra
            </button>
            <Link
              href={registerHref}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Mejor crear cuenta
            </Link>
          </div>
        </div>
      ) : null}

      {phase === "quiz" && samples[index] ? (
        <div className="mt-10 space-y-5">
          <p className="text-sm text-[var(--foreground-muted)]">
            Pregunta {index + 1} de {samples.length}
          </p>
          <h2 className="font-display text-xl font-semibold leading-snug">
            {samples[index].prompt}
          </h2>
          <ul className="space-y-2">
            {samples[index].choices.map((choice, i) => {
              const isCorrect = i === samples[index].correctIndex;
              const isSelected = selected === i;
              return (
                <li key={`${samples[index].id}-${i}`}>
                  <button
                    type="button"
                    disabled={revealed}
                    onClick={() => onSelect(i)}
                    className={cn(
                      "w-full rounded-md border px-4 py-3 text-left text-sm transition-colors",
                      "border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)]",
                      revealed && isCorrect && "border-emerald-500 bg-emerald-500/10",
                      revealed &&
                        isSelected &&
                        !isCorrect &&
                        "border-red-500 bg-red-500/10",
                    )}
                  >
                    {choice}
                  </button>
                </li>
              );
            })}
          </ul>
          {revealed ? (
            <div className="space-y-3">
              <p className="text-sm text-[var(--foreground-muted)]">
                {samples[index].explanation}
              </p>
              <button
                type="button"
                className={cn(buttonVariants({ size: "lg" }))}
                onClick={onNext}
              >
                {index + 1 >= samples.length
                  ? "Terminar sesión guest"
                  : "Siguiente"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {phase === "done" ? (
        <div className="mt-10 space-y-5">
          <p className="text-lg font-medium text-[var(--foreground)]">
            Sesión guest completada · {correctCount}/{samples.length} aciertos
          </p>
          <p className="text-base leading-relaxed text-[var(--foreground-muted)]">
            Prueba una sesión; crea cuenta para guardar progreso y subir al
            podio.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={registerHref}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Crear cuenta
            </Link>
            {probe && probe.sessionsRemaining > 0 ? (
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                )}
                onClick={() => {
                  setIndex(0);
                  setSelected(null);
                  setRevealed(false);
                  setCorrectCount(0);
                  setPhase("intro");
                }}
              >
                Otra sesión guest ({probe.sessionsRemaining} restantes)
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <aside className="mt-auto border-t border-[var(--border)] pt-8">
        <p className="text-sm text-[var(--foreground-muted)]">
          ¿Listo para guardar rachas y aparecer en el podio?
        </p>
        <Link
          href={registerHref}
          className="mt-2 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
        >
          Crear cuenta gratis →
        </Link>
      </aside>
    </main>
  );
}

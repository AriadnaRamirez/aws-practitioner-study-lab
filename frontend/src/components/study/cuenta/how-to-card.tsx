"use client";

import {
  BookOpenCheck,
  ChartColumn,
  Flame,
  House,
  Layers,
  type LucideIcon,
  PlayCircle,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { openOnboardingTour } from "@/components/onboarding/onboarding-host";
import { cn } from "@/lib/utils";
import { CARD, CARD_ICON, CARD_TITLE, PILL_BUTTON } from "./cuenta-ui";

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: House,
    title: "Inicio",
    body: "Ves cuántos días faltan para tu examen y cuántos conceptos llevas dominados.",
  },
  {
    icon: Layers,
    title: "Estudiar",
    body: "Juegas partidas de cartas. Cada carta es un concepto de AWS con 4 opciones; eliges cuántas cartas y qué temas.",
  },
  {
    icon: BookOpenCheck,
    title: "Dominar un concepto",
    body: "Acierta su carta 3 veces seguidas. Si fallas, la carta regresa más adelante en la misma partida.",
  },
  {
    icon: RotateCcw,
    title: "Más falladas",
    body: "Reúne los conceptos que más se te complican y con cuáles los confundes, para repasarlos primero.",
  },
  {
    icon: ChartColumn,
    title: "Guías y progreso",
    body: "En Guías descargas los temas en PDF para estudiar sin pantalla. Tu avance por tema está aquí, en la pestaña Progreso.",
  },
  {
    icon: Trophy,
    title: "Podio",
    body: "En el trofeo de arriba ves tu lugar entre los estudiantes. Subes dominando conceptos.",
  },
  {
    icon: Flame,
    title: "Racha",
    body: "Cuenta los días seguidos que estudias. Una partida al día basta para mantenerla.",
  },
];

export function HowToCard() {
  return (
    <section aria-labelledby="como-usar-titulo" className={CARD}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="como-usar-titulo" className={CARD_TITLE}>
          <PlayCircle className={CARD_ICON} aria-hidden />
          Cómo usar AWS Study Lab
        </h2>
        <button
          type="button"
          onClick={() => openOnboardingTour()}
          className={cn(PILL_BUTTON, "text-[var(--foreground)]")}
        >
          Ver recorrido guiado
        </button>
      </div>
      <ol className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {STEPS.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex min-w-0 gap-3">
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-elevated)] text-[var(--accent)]"
            >
              <Icon className="size-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--foreground-muted)]">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

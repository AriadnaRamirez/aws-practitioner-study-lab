"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChoiceQuiz } from "@/components/minigames/choice-quiz";
import { PRECIOS_QUESTIONS, PRECIOS_ROUND } from "@/lib/minigames/precios";
import { quizRound, type QuizQuestion } from "@/lib/minigames/quiz";
import {
  RESPONSABILIDAD_QUESTIONS,
  RESPONSABILIDAD_ROUND,
} from "@/lib/minigames/responsabilidad";

/** Deals a fresh round on mount and on every "Jugar otra vez". */
function QuizRounds({
  deal,
  ...props
}: {
  gameId: string;
  title: string;
  subtitle: string;
  cheatSheetTitle: string;
  deal: () => QuizQuestion[];
}) {
  const router = useRouter();
  const [round, setRound] = useState(0);
  return (
    <DealtQuiz
      key={round}
      deal={deal}
      onReplay={() => setRound((r) => r + 1)}
      onExit={() => router.push("/minijuegos")}
      exitLabel="Minijuegos"
      {...props}
    />
  );
}

function DealtQuiz({
  deal,
  ...props
}: {
  gameId: string;
  title: string;
  subtitle: string;
  cheatSheetTitle: string;
  deal: () => QuizQuestion[];
  onReplay: () => void;
  onExit: () => void;
  exitLabel: string;
}) {
  const [questions] = useState(deal);
  return <ChoiceQuiz questions={questions} {...props} />;
}

export function ResponsabilidadGame() {
  return (
    <QuizRounds
      gameId="quien-se-encarga"
      title="¿Quién se encarga?"
      subtitle="Modelo de responsabilidad compartida: ¿es tarea de AWS o tuya?"
      cheatSheetTitle="Repaso rápido: ¿qué le toca a cada quien?"
      deal={() => quizRound(RESPONSABILIDAD_QUESTIONS, RESPONSABILIDAD_ROUND)}
    />
  );
}

export function PreciosGame() {
  return (
    <QuizRounds
      gameId="cuanto-pagas"
      title="¿Cuánto pagas?"
      subtitle="Elige el modelo de precios de EC2 que mejor encaja con cada caso."
      cheatSheetTitle="Repaso rápido: los 5 modelos de precios"
      deal={() => quizRound(PRECIOS_QUESTIONS, PRECIOS_ROUND)}
    />
  );
}

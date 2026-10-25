import type { Metadata } from "next";
import { OpenTourButton } from "@/components/onboarding/open-tour-button";
import { EmptyState } from "@/components/shell/empty-state";

export const metadata: Metadata = {
  title: "Estudiar",
};

export default function EstudiarPage() {
  return (
    <EmptyState
      title="Aún no hay sesiones"
      description="Aquí elegirás Repaso / Memoriza, Modo Estudio para examen o Modo Examen cronometrado. Las sesiones llegan cuando el banco de contenido y el motor de estudio estén listos."
      hint="Mientras tanto, revisa cómo funciona el lab: flash MCQ, miss-repeat, dominio y la diferencia entre estudio y examen."
      primaryHref="/register"
      primaryLabel="Crear cuenta"
      secondary={<OpenTourButton />}
    />
  );
}

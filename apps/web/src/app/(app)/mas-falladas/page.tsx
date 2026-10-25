import type { Metadata } from "next";
import { OpenTourButton } from "@/components/onboarding/open-tour-button";
import { EmptyState } from "@/components/shell/empty-state";

export const metadata: Metadata = {
  title: "Más falladas",
};

export default function MasFalladasPage() {
  return (
    <EmptyState
      title="Sin fallos todavía"
      description="Aquí aparecerá tu cola de preguntas más falladas (flash y examen), ordenada por errores. El atajo «Estudiar solo estas» abrirá un refuerzo con miss-repeat."
      hint="Empieza a practicar cuando las sesiones estén disponibles; esta lista se llena con tu historial real."
      primaryHref="/estudiar"
      primaryLabel="Ir a Estudiar"
      secondary={<OpenTourButton />}
    />
  );
}

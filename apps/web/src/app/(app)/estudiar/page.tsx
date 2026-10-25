import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shell/placeholder-page";

export const metadata: Metadata = {
  title: "Estudiar",
};

export default function EstudiarPage() {
  return (
    <PlaceholderPage
      title="Estudiar"
      description="Aquí eliges Repaso / Memoriza, Modo Estudio para examen o Modo Examen. Aún no hay sesiones — solo el shell."
    />
  );
}

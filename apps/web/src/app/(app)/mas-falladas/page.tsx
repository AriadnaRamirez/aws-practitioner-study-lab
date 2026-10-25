import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shell/placeholder-page";

export const metadata: Metadata = {
  title: "Más falladas",
};

export default function MasFalladasPage() {
  return (
    <PlaceholderPage
      title="Más falladas"
      description="Tu cola de preguntas más falladas y el atajo para estudiar solo esas. Contenido pendiente."
    />
  );
}

import type { Metadata } from "next";
import { OpenTourButton } from "@/components/onboarding/open-tour-button";
import { EmptyState } from "@/components/shell/empty-state";

export const metadata: Metadata = {
  title: "Podio",
};

export default function PodioPage() {
  return (
    <EmptyState
      title="El podio está vacío"
      description="El ranking muestra respuestas memorizadas: ítems que alcanzaron dominio (3 aciertos seguidos). Solo cuentas registradas — el admin también cuenta."
      hint="Cuando haya progreso compartido, verás usernames y ventanas all-time / semana. Crea cuenta para participar."
      primaryHref="/register"
      primaryLabel="Crear cuenta"
      secondary={<OpenTourButton />}
    />
  );
}

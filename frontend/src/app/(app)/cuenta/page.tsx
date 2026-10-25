import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shell/placeholder-page";

export const metadata: Metadata = {
  title: "Cuenta",
};

export default function CuentaPage() {
  return (
    <PlaceholderPage
      title="Cuenta"
      description="Perfil, timezone y preferencias. Auth real llega en otro ticket."
    />
  );
}

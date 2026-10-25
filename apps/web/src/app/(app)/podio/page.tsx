import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shell/placeholder-page";

export const metadata: Metadata = {
  title: "Podio",
};

export default function PodioPage() {
  return (
    <PlaceholderPage
      title="Podio"
      description="Ranking por respuestas memorizadas (ítems dominados). Requiere cuenta — placeholder de navegación."
    />
  );
}

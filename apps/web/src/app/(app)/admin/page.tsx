import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/shell/placeholder-page";

export const metadata: Metadata = {
  title: "Admin",
};

export default function AdminPage() {
  return (
    <PlaceholderPage
      title="Admin"
      description="Panel owner: uso de la app, usuarios, contenido e import/export. Solo Ariadna — UI pendiente."
    />
  );
}

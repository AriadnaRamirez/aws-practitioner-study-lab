import type { Metadata } from "next";
import { GuestTrial } from "@/components/guest/guest-trial";

export const metadata: Metadata = {
  title: "Probar sin cuenta",
  description:
    "Sesión limitada de marketing. Crea una cuenta para guardar progreso y subir al podio.",
};

export default function GuestPage() {
  return <GuestTrial />;
}

import type { Metadata } from "next";
import { GuestTrial } from "@/components/guest/guest-trial";

export const metadata: Metadata = {
  title: "Probar sin cuenta",
  description:
    "Pruébalo sin registro. Crea una cuenta para guardar tu progreso.",
};

export default function GuestPage() {
  return <GuestTrial />;
}

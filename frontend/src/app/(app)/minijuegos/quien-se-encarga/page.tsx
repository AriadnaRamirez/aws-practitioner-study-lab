import type { Metadata } from "next";
import { ResponsabilidadGame } from "@/components/minigames/quiz-games";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "¿Quién se encarga? · Minijuegos",
};

export default function QuienSeEncargaPage() {
  return (
    <RequireAuth>
      <ResponsabilidadGame />
    </RequireAuth>
  );
}

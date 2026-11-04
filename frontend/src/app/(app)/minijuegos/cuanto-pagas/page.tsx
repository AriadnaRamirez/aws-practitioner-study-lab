import type { Metadata } from "next";
import { PreciosGame } from "@/components/minigames/quiz-games";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "¿Cuánto pagas? · Minijuegos",
};

export default function CuantoPagasPage() {
  return (
    <RequireAuth>
      <PreciosGame />
    </RequireAuth>
  );
}

import type { Metadata } from "next";
import { CrucigramaGame } from "@/components/minigames/crucigrama-game";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Minijuegos",
};

export default function MinijuegosPage() {
  return (
    <RequireAuth>
      <CrucigramaGame />
    </RequireAuth>
  );
}

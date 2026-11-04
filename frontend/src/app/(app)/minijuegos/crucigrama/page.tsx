import type { Metadata } from "next";
import { CrucigramaGame } from "@/components/minigames/crucigrama-game";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Crucigrama · Minijuegos",
};

export default function CrucigramaPage() {
  return (
    <RequireAuth>
      <CrucigramaGame />
    </RequireAuth>
  );
}

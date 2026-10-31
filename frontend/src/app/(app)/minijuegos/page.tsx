import type { Metadata } from "next";
import { MinigamesIndex } from "@/components/minigames/minigames-index";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Minijuegos",
};

export default function MinijuegosPage() {
  return (
    <RequireAuth>
      <MinigamesIndex />
    </RequireAuth>
  );
}

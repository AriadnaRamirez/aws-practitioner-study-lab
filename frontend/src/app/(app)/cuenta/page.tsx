import type { Metadata } from "next";
import { CuentaProgresoClient } from "@/components/study/cuenta-progreso-client";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Cuenta",
};

export default function CuentaPage() {
  return (
    <RequireAuth>
      <CuentaProgresoClient />
    </RequireAuth>
  );
}

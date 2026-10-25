import type { Metadata } from "next";
import { ProgressClient } from "@/components/study/progress-client";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Progreso",
};

export default function ProgresoPage() {
  return (
    <RequireAuth>
      <ProgressClient />
    </RequireAuth>
  );
}

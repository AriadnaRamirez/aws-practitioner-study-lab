import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Inicio",
};

export default function DashboardPage() {
  return (
    <RequireAuth fallback="home">
      <DashboardClient />
    </RequireAuth>
  );
}

import type { Metadata } from "next";
import { DashboardClient } from "@/components/study/dashboard-client";

export const metadata: Metadata = {
  title: "Inicio",
};

export default function DashboardPage() {
  return <DashboardClient />;
}

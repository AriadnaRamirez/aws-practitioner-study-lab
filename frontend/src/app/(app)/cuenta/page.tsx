import type { Metadata } from "next";
import { CuentaClient } from "@/components/study/cuenta/cuenta-client";
import { parseCuentaTab } from "@/components/study/cuenta/cuenta-tabs";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Cuenta",
};

export default async function CuentaPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return (
    <RequireAuth>
      <CuentaClient initialTab={parseCuentaTab(tab)} />
    </RequireAuth>
  );
}

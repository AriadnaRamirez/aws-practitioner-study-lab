import type { Metadata } from "next";
import { HistoryDetailClient } from "@/components/cuenta/history-detail-client";
import { RequireAuth } from "@/components/shell/require-auth";

export const metadata: Metadata = {
  title: "Detalle de sesión",
};

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RequireAuth>
      <HistoryDetailClient sessionId={id} />
    </RequireAuth>
  );
}

import type { Metadata } from "next";
import { HistoryDetailClient } from "@/components/study/history-detail-client";

export const metadata: Metadata = {
  title: "Detalle de sesión",
};

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HistoryDetailClient sessionId={id} />;
}

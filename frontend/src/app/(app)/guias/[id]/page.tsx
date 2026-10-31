import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideDocumentClient } from "@/components/guides/guide-document-client";
import { RequireAuth } from "@/components/shell/require-auth";
import { guideById } from "@/lib/study-guides";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const guide = guideById(id);
  return { title: guide ? `Guía: ${guide.title}` : "Guías" };
}

export default async function GuiaPage({ params, searchParams }: Props) {
  const { id } = await params;
  const guide = guideById(id);
  if (!guide) notFound();
  const { print } = await searchParams;

  return (
    <RequireAuth>
      <GuideDocumentClient guideId={guide.id} autoPrint={print === "1"} />
    </RequireAuth>
  );
}

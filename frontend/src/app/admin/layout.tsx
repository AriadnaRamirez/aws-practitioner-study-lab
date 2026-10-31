import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { buttonVariants } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { PageContainer } from "@/components/ui/page";
import { getAdminSession } from "@/lib/admin-server";

export const metadata: Metadata = {
  title: { default: "Administración", template: "%s · Admin" },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (session.status === "anonymous") redirect("/login?next=/admin");
  if (session.status === "forbidden") redirect("/dashboard");

  if (session.status === "unavailable") {
    return (
      <main className="min-h-dvh text-[var(--foreground)]">
        <PageContainer width="narrow" className="space-y-4">
          <Notice tone="warning" boxed>
            No se pudo verificar tu sesión de administración. Revisa que la API
            esté arriba e inténtalo de nuevo.
          </Notice>
          <Link href="/dashboard" className={buttonVariants({ variant: "secondary", size: "sm" })}>
            Volver al Lab
          </Link>
        </PageContainer>
      </main>
    );
  }

  return (
    <div className="min-h-dvh text-[var(--foreground)]">
      <AdminNav />
      <main className="min-w-0 lg:pl-60">{children}</main>
    </div>
  );
}

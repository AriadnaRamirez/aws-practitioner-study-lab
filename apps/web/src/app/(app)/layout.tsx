import { AppNav } from "@/components/shell/app-nav";

export default function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--background)]">
      <AppNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}

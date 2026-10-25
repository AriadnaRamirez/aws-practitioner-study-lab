import { OnboardingHost } from "@/components/onboarding/onboarding-host";
import { AppNav } from "@/components/shell/app-nav";
import { SiteFooter } from "@/components/shell/site-footer";

export default function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip bg-[var(--background)]">
      <AppNav />
      <main id="contenido" className="min-w-0 flex-1">
        {children}
      </main>
      <SiteFooter />
      <OnboardingHost />
    </div>
  );
}

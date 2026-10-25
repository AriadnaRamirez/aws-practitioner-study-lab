import { OnboardingHost } from "@/components/onboarding/onboarding-host";
import { AppNav } from "@/components/shell/app-nav";
import { SiteFooter } from "@/components/shell/site-footer";

export default function AppShellLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-dvh w-full min-w-0 max-w-full flex-col overflow-x-hidden bg-[var(--background)]">
      <AppNav />
      <main id="contenido" className="w-full min-w-0 max-w-full flex-1 overflow-x-hidden">
        {children}
      </main>
      <SiteFooter />
      <OnboardingHost />
    </div>
  );
}

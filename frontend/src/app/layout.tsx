import type { Metadata } from "next";
import { Figtree, JetBrains_Mono, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AWS Practitioner Study Lab",
    template: "%s · AWS Practitioner Study Lab",
  },
  description:
    "Lab de estudio para AWS Certified Cloud Practitioner: flashcards MCQ, modos de examen y podio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="overflow-x-hidden" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${figtree.variable} ${jetbrains.variable} min-h-dvh w-full max-w-full overflow-x-hidden antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

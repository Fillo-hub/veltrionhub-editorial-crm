import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { DashboardProvider } from "@/components/providers/DashboardProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VeltrionHub — Studio Editoriale, Task & Analytics Hub",
  description:
    "Piattaforma gestionale moderna per contenuti editoriali, pianificazione attività, categorie e analytics in tempo reale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          storageKey="dashboard-theme"
        >
          <DashboardProvider>
            {children}
            <Toaster />
          </DashboardProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "VeltrionHub – Studio Editoriale, Task & Analytics Hub",
  description:
    "Piattaforma gestionale moderna per contenuti editoriali, pianificazione attività, categorie e analytics in tempo reale.",
  openGraph: {
    title: "VeltrionHub – Studio Editoriale, Task & Analytics Hub",
    description:
      "Piattaforma gestionale moderna per contenuti editoriali, pianificazione attività, categorie e analytics in tempo reale.",
    type: "website",
  },
};
export const metadata: Metadata = {
  description:
    "Krelvia: assistente AI e workspace operativo locale con PostgreSQL, calcolatori, utility dev e gestione chat.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    description:
      "Krelvia: assistente AI e workspace operativo locale con PostgreSQL, calcolatori, utility dev e gestione chat.",
    title: "Krelvia — Workspace AI & Utility",
    type: "website",
  },
  title: "Krelvia — Workspace AI & Utility",
};
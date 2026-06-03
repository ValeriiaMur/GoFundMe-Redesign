import type { Metadata } from "next";

import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/600.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/newsreader/500-italic.css";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import "./globals.css";

import { SiteProvider } from "@/components/app/site-provider";
import { AppShell } from "@/components/app/app-shell";

export const metadata: Metadata = {
  title: "GoFundMe — every cause is a place",
  description: "Help finds a way.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dawn" data-type="humanist" className="h-full antialiased">
      <body className="min-h-full">
        <SiteProvider>
          <AppShell>{children}</AppShell>
        </SiteProvider>
      </body>
    </html>
  );
}

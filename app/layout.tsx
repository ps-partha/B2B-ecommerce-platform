import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/auth/session-provider";

import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import LayoutWrapper from "@/components/layout-wrapper"; // import it here

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SecureTrade - Buy, Sell, and Trade Digital Products Securely",
  description: "The most secure platform for buying, selling, and trading digital accounts and products.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <LayoutWrapper>
              <div className="flex min-h-screen flex-col">
                <main className="flex-1">{children}</main>
              </div>
            </LayoutWrapper>
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

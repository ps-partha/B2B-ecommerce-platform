import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/auth/session-provider";

import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import LayoutWrapper from "@/components/layout-wrapper/layout-wrapper"; // import it here
import { CartProvider } from "@/context/cart-context";
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
            <CartProvider>
            <LayoutWrapper>
              <main className="flex-1">{children}</main>
            </LayoutWrapper>
            </CartProvider>
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

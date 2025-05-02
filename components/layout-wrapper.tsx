"use client";

import { usePathname } from "next/navigation";
import TopNav from "@/components/top-nav";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideTopNav = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === '/auth/seller/login';

  return (
    <>
      {!hideTopNav && !isLoginPage && <TopNav />}
      {children}
    </>
  );
}

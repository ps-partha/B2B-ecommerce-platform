'use client';

import { redirect, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/header';
import { Toaster } from '@/components/ui/toaster';
import { useSession } from 'next-auth/react';
import SellerDashboardLoading from "./loading"
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <SellerDashboardLoading />
  }

  if (status === "unauthenticated" || session?.user.role != "SELLER") {
    redirect("/")
  }

  console.log(session.user.role)



  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Fixed Header */}
      {session?.user && <DashboardHeader user={session.user} />}

      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        {<DashboardSidebar />}

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}


'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import DashboardSidebar from '@/components/dashboard/sidebar';
import DashboardHeader from '@/components/dashboard/header';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const user = {
    id: '1',
    name: 'partha sarker',
    email: 'admin@gmail.com',
    profileImage: 'image.jpg',
    role: 'user',
  };

  const isLoginPage = pathname === '/auth/seller/login';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!isLoginPage && <DashboardHeader user={user} />}
      <div className="flex flex-1">
        {!isLoginPage && <DashboardSidebar user={user} />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}

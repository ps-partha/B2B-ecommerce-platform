import type React from "react"
import AdminDashboardSidebar from "@/components/admin/sidebar"
import AdminDashboardHeader from "@/components/admin/admin-header"
export const metadata = {
  title: "Admin Dashboard | Ecommerce Platform",
  description: "Admin dashboard for managing the ecommerce platform",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <AdminDashboardHeader/>
      <div className="flex flex-1 overflow-hidden">
        <AdminDashboardSidebar/>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}

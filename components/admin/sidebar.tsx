"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  MessageSquare,
  Heart,
  Tag,
  FileText,
  Shield,
  Store,
  Truck,
  User,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function AdminDashboardSidebar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  if (isMobile) {
    return null
  }


  const adminLinks = [
    {
      title: "Overview",
      href: "/admin-dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin-dashboard",
    },
    {
      title: "Users",
      href: "/admin-dashboard/users",
      icon: Users,
      active: pathname.startsWith("/admin-dashboard/users"),
    },
    {
      title: "Sellers",
      href: "/admin-dashboard/sellers",
      icon: Store,
      active: pathname.startsWith("/admin-dashboard/sellers"),
    },
    {
      title: "Listings",
      href: "/admin-dashboard/listings",
      icon: Package,
      active: pathname.startsWith("/admin-dashboard/listings"),
    },
    {
      title: "Orders",
      href: "/admin-dashboard/orders",
      icon: ShoppingCart,
      active: pathname.startsWith("/admin-dashboard/orders"),
    },
    {
      title: "Categories",
      href: "/admin-dashboard/categories",
      icon: Tag,
      active: pathname.startsWith("/admin-dashboard/categories"),
    },
    {
      title: "Reports",
      href: "/admin-dashboard/reports",
      icon: FileText,
      active: pathname.startsWith("/admin-dashboard/reports"),
      badge: 2,
    },
    {
      title: "Moderation",
      href: "/admin-dashboard/moderation",
      icon: Shield,
      active: pathname.startsWith("/admin-dashboard/moderation"),
      badge: 7,
    },
    {
      title: "Analytics",
      href: "/admin-dashboard/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/admin-dashboard/analytics"),
    },
  ]

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <ScrollArea className="h-[calc(100vh-4rem)] py-2">
        <div className="px-3 py-3"> 
          <div className="space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  link.active ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon className={cn("h-4 w-4", link.active ? "text-primary" : "text-muted-foreground")} />
                  <span>{link.title}</span>
                </div>
                {link.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {link.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Settings</h2>
          <div className="space-y-1">
            <Link
              href="/dashboard/settings/profile"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/dashboard/settings/profile") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <User className="mr-3 h-4 w-4 text-muted-foreground" />
              <span>Profile</span>
            </Link>
            <Link
              href="/dashboard/settings/account"
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname.startsWith("/dashboard/settings/account") ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
              <span>Account</span>
            </Link>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

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

interface SidebarProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    profileImage?: string
    role?: string
  }
}

export default function DashboardSidebar({ user }: SidebarProps) {
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

  const isAdmin = user.role === "admin"

  const sellerLinks = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      title: "My Listings",
      href: "/dashboard/listings",
      icon: Package,
      active: pathname.startsWith("/dashboard/listings"),
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
      active: pathname.startsWith("/dashboard/orders"),
      badge: 5,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
      active: pathname.startsWith("/dashboard/messages"),
      badge: 3,
    },
    {
      title: "Favorites",
      href: "/dashboard/favorites",
      icon: Heart,
      active: pathname.startsWith("/dashboard/favorites"),
    },
    {
      title: "Payments",
      href: "/dashboard/payments",
      icon: CreditCard,
      active: pathname.startsWith("/dashboard/payments"),
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/dashboard/analytics"),
    },
  ]

  const adminLinks = [
    {
      title: "Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
      active: pathname === "/dashboard/admin",
    },
    {
      title: "Users",
      href: "/dashboard/admin/users",
      icon: Users,
      active: pathname.startsWith("/dashboard/admin/users"),
    },
    {
      title: "Sellers",
      href: "/dashboard/admin/sellers",
      icon: Store,
      active: pathname.startsWith("/dashboard/admin/sellers"),
    },
    {
      title: "Listings",
      href: "/dashboard/admin/listings",
      icon: Package,
      active: pathname.startsWith("/dashboard/admin/listings"),
    },
    {
      title: "Orders",
      href: "/dashboard/admin/orders",
      icon: ShoppingCart,
      active: pathname.startsWith("/dashboard/admin/orders"),
    },
    {
      title: "Categories",
      href: "/dashboard/admin/categories",
      icon: Tag,
      active: pathname.startsWith("/dashboard/admin/categories"),
    },
    {
      title: "Reports",
      href: "/dashboard/admin/reports",
      icon: FileText,
      active: pathname.startsWith("/dashboard/admin/reports"),
      badge: 2,
    },
    {
      title: "Moderation",
      href: "/dashboard/admin/moderation",
      icon: Shield,
      active: pathname.startsWith("/dashboard/admin/moderation"),
      badge: 7,
    },
    {
      title: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: BarChart3,
      active: pathname.startsWith("/dashboard/admin/analytics"),
    },
  ]

  const links = isAdmin ? adminLinks : sellerLinks

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:block">
      <ScrollArea className="h-[calc(100vh-4rem)] py-6">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {isAdmin ? "Admin Panel" : "Seller Dashboard"}
          </h2>
          <div className="space-y-1">
            {links.map((link) => (
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
            {isAdmin ? (
              <Link
                href="/dashboard/settings/site"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname.startsWith("/dashboard/settings/site") ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <Store className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Site Settings</span>
              </Link>
            ) : (
              <Link
                href="/dashboard/settings/shipping"
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname.startsWith("/dashboard/settings/shipping")
                    ? "bg-accent text-accent-foreground"
                    : "transparent",
                )}
              >
                <Truck className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Shipping</span>
              </Link>
            )}
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

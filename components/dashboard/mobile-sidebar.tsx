"use client"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
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
  LogOut,
  User,
  HelpCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

interface MobileSidebarProps {
  user: {
    id: string
    name?: string | null
    email?: string | null
    profileImage?: string
    role?: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function MobileSidebar({ user, isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    await signOut({ redirect: false })
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
    onClose()
  }

  const handleNavigation = (href: string) => {
    router.push(href)
    onClose()
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[240px] p-0 pt-10">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {isAdmin ? "Admin Panel" : "Seller Dashboard"}
            </h2>
            <div className="space-y-1">
              {links.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavigation(link.href)}
                  className={cn(
                    "w-full group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
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
                </button>
              ))}
            </div>
          </div>
          <Separator className="my-4" />
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Settings</h2>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigation("/dashboard/settings/profile")}
                className={cn(
                  "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname.startsWith("/dashboard/settings/profile")
                    ? "bg-accent text-accent-foreground"
                    : "transparent",
                )}
              >
                <User className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => handleNavigation("/dashboard/settings/account")}
                className={cn(
                  "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname.startsWith("/dashboard/settings/account")
                    ? "bg-accent text-accent-foreground"
                    : "transparent",
                )}
              >
                <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Account</span>
              </button>
              {isAdmin ? (
                <button
                  onClick={() => handleNavigation("/dashboard/settings/site")}
                  className={cn(
                    "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname.startsWith("/dashboard/settings/site")
                      ? "bg-accent text-accent-foreground"
                      : "transparent",
                  )}
                >
                  <Store className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Site Settings</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation("/dashboard/settings/shipping")}
                  className={cn(
                    "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname.startsWith("/dashboard/settings/shipping")
                      ? "bg-accent text-accent-foreground"
                      : "transparent",
                  )}
                >
                  <Truck className="mr-3 h-4 w-4 text-muted-foreground" />
                  <span>Shipping</span>
                </button>
              )}
              <button
                onClick={() => handleNavigation("/help")}
                className="w-full flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <HelpCircle className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Help & Support</span>
              </button>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="px-3 py-2">
            <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

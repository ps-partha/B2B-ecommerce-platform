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
  isOpen: boolean
  onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[240px] p-0 pt-10">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Seller Dashboard
            </h2>
            <div className="space-y-1">
              {adminLinks.map((link) => (
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

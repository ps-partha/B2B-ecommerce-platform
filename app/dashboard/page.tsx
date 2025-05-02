"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  DollarSign,
  MessageSquare,
  Package,
  Plus,
  ShoppingCart,
  Eye,
  ChevronUp,
  Filter,
  SortDesc,
  Check,
  Star,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { PageTransition } from "@/components/page-transition"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [progressValue, setProgressValue] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Animate progress bar
    const progressTimer = setTimeout(() => {
      setProgressValue(75)
    }, 300)

    return () => {
      clearTimeout(timer)
      clearTimeout(progressTimer)
    }
  }, [])

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex-1 rounded-lg border p-6">
                    <div className="skeleton-loading mb-2 h-4 w-24 rounded-md"></div>
                    <div className="skeleton-loading h-8 w-28 rounded-md"></div>
                    <div className="skeleton-loading mt-2 h-3 w-36 rounded-md"></div>
                  </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4 rounded-lg border p-6">
                <div className="skeleton-loading mb-6 h-6 w-36 rounded-md"></div>
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="skeleton-loading h-9 w-9 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="skeleton-loading h-4 w-full rounded-md"></div>
                          <div className="skeleton-loading h-3 w-3/4 rounded-md"></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="col-span-3 rounded-lg border p-6">
                <div className="skeleton-loading mb-2 h-6 w-36 rounded-md"></div>
                <div className="skeleton-loading mb-6 h-4 w-48 rounded-md"></div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="skeleton-loading h-4 w-24 rounded-md"></div>
                      <div className="skeleton-loading h-5 w-16 rounded-full"></div>
                    </div>
                    <div className="skeleton-loading h-2 w-full rounded-full"></div>
                    <div className="skeleton-loading h-3 w-3/4 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">

        {/* Mobile Sidebar */}
        {/* <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetContent side="left" className="w-[240px] p-0 pt-10">
            <div className="flex h-full flex-col">
              <div className="px-4 py-2">
                <h2 className="mb-2 font-semibold text-primary">Dashboard</h2>
                <nav className="grid items-start gap-2">
                  {[
                    { icon: LayoutDashboard, label: "Overview", value: "overview" },
                    { icon: Package, label: "My Listings", value: "listings" },
                    { icon: ShoppingCart, label: "Purchases", value: "purchases" },
                    { icon: Heart, label: "Favorites", value: "favorites" },
                    { icon: MessageSquare, label: "Messages", value: "messages", badge: 3 },
                    { icon: CreditCard, label: "Payments", value: "payments" },
                    { icon: User, label: "Profile", value: "profile" },
                    { icon: Settings, label: "Settings", value: "settings" },
                  ].map((item) => (
                    <Link
                      key={item.value}
                      href="#"
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 ${
                        activeTab === item.value
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveTab(item.value)
                        setIsMobileSidebarOpen(false)
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                      {item.badge && (
                        <Badge className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="mt-auto border-t p-4">
                <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet> */}
        <main>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent
              value="overview"
              className="space-y-6 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
            >
              <div className="flex flex-col gap-4 md:flex-row">
                <Card className="flex-1 overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1,234.56</div>
                    <p className="flex items-center text-xs text-green-500 dark:text-green-400">
                      <ChevronUp className="mr-1 h-3 w-3" />
                      +$249.20 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="flex-1 overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="flex items-center text-xs text-green-500 dark:text-green-400">
                      <ChevronUp className="mr-1 h-3 w-3" />
                      +3 from last month
                    </p>
                  </CardContent>
                </Card>
                <Card className="flex-1 overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Seller Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.9/5</div>
                    <p className="flex items-center text-xs text-muted-foreground">
                      <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                      Based on 48 reviews
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          type: "sale",
                          title: "Gaming Account Sold",
                          amount: "$199.99",
                          date: "2 hours ago",
                        },
                        {
                          type: "purchase",
                          title: "Digital Asset Bundle Purchased",
                          amount: "$49.99",
                          date: "Yesterday",
                        },
                        {
                          type: "message",
                          title: "New message from Buyer123",
                          content: "Is this still available?",
                          date: "2 days ago",
                        },
                        {
                          type: "review",
                          title: "New 5-star review received",
                          content: "Great seller, fast delivery!",
                          date: "3 days ago",
                        },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="group flex items-center gap-4 rounded-lg p-2 transition-colors duration-200 hover:bg-muted/50"
                        >
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${activity.type === "sale"
                                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                : activity.type === "purchase"
                                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                  : activity.type === "message"
                                    ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                                    : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                              }`}
                          >
                            {activity.type === "sale" ? (
                              <DollarSign className="h-4 w-4" />
                            ) : activity.type === "purchase" ? (
                              <ShoppingCart className="h-4 w-4" />
                            ) : activity.type === "message" ? (
                              <MessageSquare className="h-4 w-4" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{activity.title}</p>
                            {activity.amount ? (
                              <p className="text-sm text-muted-foreground">{activity.amount}</p>
                            ) : (
                              <p className="text-sm text-muted-foreground">{activity.content}</p>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{activity.date}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3 overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                    <CardDescription>Your current account level and benefits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Verified Seller</span>
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-700 dark:hover:bg-emerald-800">
                          Active
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Level Progress</span>
                          <span className="font-medium">{progressValue}%</span>
                        </div>
                        <Progress value={progressValue} className="h-2 transition-all duration-1000 ease-in-out" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Complete 5 more sales to reach Premium Seller status
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Current Benefits</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                          <span>Reduced transaction fees (4.5%)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                          <span>Priority customer support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500 dark:text-green-400" />
                          <span>Verified seller badge</span>
                        </li>
                      </ul>
                    </div>

                    <Button className="w-full bg-primary text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20">
                      Upgrade to Premium
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Recent Listings</h2>
                  <Button variant="outline" size="sm" className="h-8 group">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <Card
                      key={item}
                      className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-primary/10"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={`/placeholder.svg?height=200&width=300`}
                          alt="Product"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <Badge className="absolute left-2 top-2 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800">
                          Active
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold group-hover:text-primary">
                          Gaming Account - Level {80 + item * 5}
                        </h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-bold text-primary">${120 + item * 20}</span>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Eye className="mr-1 h-4 w-4" />
                            {50 + item * 12} views
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Link href="/dashboard/add-listing">
                    <Card className="flex aspect-video cursor-pointer items-center justify-center border-dashed transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg dark:hover:shadow-primary/10">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="mb-4 rounded-full bg-primary/10 p-2 transition-transform duration-300 hover:scale-110">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">Add New Listing</h3>
                        <p className="mt-1 text-center text-xs text-muted-foreground">
                          Create a new listing to sell or trade
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </TabsContent> 
          </Tabs>
        </main>
      </div>
    </PageTransition>
  )
}

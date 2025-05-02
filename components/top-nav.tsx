"use client";
import {
  Bell,
  Check,
  ChevronRight,
  Clock,
  Heart,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Play,
  Search,
  Settings,
  ShoppingCart,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { formatDistanceToNow } from "date-fns";
import { signOut, useSession } from "next-auth/react";
import AuthButton from "@/components/auth/auth-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { useToast } from "./ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import router from "next/router";
export default function TopNav() {
  const { data: session, status } = useSession();
  const user = session?.user || null;
  const isLoggedIn = user?.isLoggedIn || false;
  const isLoading = status === "loading";
  const { notifications, markAsRead, markAllAsRead, refresh } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const { toast } = useToast();
  // Refresh notifications when dropdown opens
  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "like":
        return <Heart className="h-4 w-4 text-rose-500" />;
      case "mention":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "follow":
        return <Bell className="h-4 w-4 text-green-500" />;
      case "video":
        return <Play className="h-4 w-4 text-red-500" />;
      case "system":
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await markAsRead(id);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };
  const handleLogout = async () => {
    await signOut({ redirect: false }); // prevent default redirection

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary transition-colors hover:text-primary/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 animate-pulse-subtle"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="M8 11h8" />
              <path d="M12 15V7" />
            </svg>
            SecureTrade
          </Link>
          <nav className="hidden md:flex md:gap-6">
            <Link
              href="/marketplace"
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Marketplace
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#"
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Categories
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#"
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="#"
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Support
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>
        </div>
        <div className="hidden md:flex md:items-center md:gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] bg-background pl-8 transition-all duration-300 focus:w-[300px] md:w-[300px] md:focus:w-[400px]"
            />
          </div>
          <ThemeToggle />
          {isLoggedIn ? (
            <DropdownMenu
              open={notificationOpen}
              onOpenChange={setNotificationOpen}
            >
              <DropdownMenuTrigger
                asChild
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(!open);
                }}
              >
                <Button variant="ghost" size="icon" className="relative transition-transform duration-300 hover:rotate-12">
                  <Bell className="h-5 w-5 " />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 bg-primary text-white text-xs flex items-center justify-center rounded-full">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}

                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[380px] p-0"
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <DropdownMenuLabel className="text-base font-semibold">
                    Notifications
                  </DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 p-0 h-12 rounded-none border-b">
                    <TabsTrigger
                      value="all"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="system"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                      System
                    </TabsTrigger>
                  </TabsList>

                  <ScrollArea className="h-[300px]">
                    <TabsContent value="all" className="m-0">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : false ? (
                        <div className="flex flex-col items-center justify-center h-[300px] p-4 text-center">
                          <p className="text-sm font-medium text-destructive">
                            Failed to load notifications
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={refresh}
                          >
                            Try again
                          </Button>
                        </div>
                      ) : notifications.length > 0 ? (
                        <div>
                          {notifications.map((notification) => (
                            <Link
                              href={notification.link || "#"}
                              key={notification.id}
                              className={`flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors ${
                                !notification.read ? "bg-muted/30" : ""
                              }`}
                            >
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {notification.date &&
                                      formatDistanceToNow(
                                        new Date(notification.date),
                                        { addSuffix: true }
                                      )}
                                  </span>
                                </div>
                              </div>
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 flex-shrink-0"
                                  onClick={(e) =>
                                    handleMarkAsRead(e, notification.id)
                                  }
                                >
                                  <Check className="h-4 w-4" />
                                  <span className="sr-only">Mark as read</span>
                                </Button>
                              )}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] p-4 text-center">
                          <Bell className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">
                            No notifications yet
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            When you get notifications, they'll show up here
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="system" className="m-0">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : notifications.filter((n) => n.type === "system")
                          .length > 0 ? (
                        <div>
                          {notifications
                            .filter((n) => n.type === "system")
                            .map((notification) => (
                              <Link
                                href={notification.link || "#"}
                                key={notification.id}
                                className={`flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors ${
                                  !notification.read ? "bg-muted/30" : ""
                                }`}
                              >
                                <div className="flex-shrink-0 mt-1">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(
                                        new Date(notification.date),
                                        { addSuffix: true }
                                      )}
                                    </span>
                                  </div>
                                </div>
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 flex-shrink-0"
                                    onClick={(e) =>
                                      handleMarkAsRead(e, notification.id)
                                    }
                                  >
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">
                                      Mark as read
                                    </span>
                                  </Button>
                                )}
                              </Link>
                            ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] p-4 text-center">
                          <Settings className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium">
                            No system notifications
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            System notifications about your account will appear
                            here
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </ScrollArea>
                </Tabs>

                <div className="p-2 border-t">
                  <Link
                    href="/notifications"
                    className="flex items-center justify-center w-full p-2 text-sm text-center rounded-md hover:bg-muted transition-colors"
                  >
                    View all notifications
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu
              open={isNotificationOpen}
              onOpenChange={setIsNotificationOpen}
            >
              <DropdownMenuTrigger
                asChild
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNotificationOpen(!isNotificationOpen);
                }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex relative transition-transform duration-300 hover:rotate-12"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[380px] p-0" align="end">
                <DropdownMenuLabel className="sr-only">
                  Notifications
                </DropdownMenuLabel>
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign in to view your notifications and stay updated with the
                    latest content.
                  </p>
                  <div className="flex gap-2">
                    <Link href="/auth/login">
                      <Button variant="default" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button variant="outline" size="sm">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="transition-transform duration-300 hover:rotate-12"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <AuthButton/>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
            <div className="flex flex-col gap-6 py-4">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xl font-bold text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="M8 11h8" />
                    <path d="M12 15V7" />
                  </svg>
                  SecureTrade
                </Link>
                <ThemeToggle />
              </div>

              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-background pl-8"
                />
              </div>

              <nav className="flex flex-col gap-2">
                <Link
                  href="/marketplace"
                  className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                >
                  Marketplace
                </Link>
                <Link
                  href="#"
                  className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                >
                  Categories
                </Link>
                <Link
                  href="#"
                  className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                >
                  How It Works
                </Link>
                <Link
                  href="#"
                  className="flex items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
                >
                  Support
                </Link>
              </nav>

              <div className="flex gap-2">
                
                <Button variant="outline" size="sm" className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Bell, Menu, MessageSquare, Search, Settings, User, LogOut, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import MobileSidebar from "./mobile-sidebar"

interface HeaderProps {
    user: {
        id: string
        name?: string | null
        email?: string | null
        profileImage?: string
        role?: string
    }
}

export default function DashboardHeader({ user }: HeaderProps) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleLogout = async () => {
        await fetch("/api/auth/seller-logout", {
            method: "POST",
        });
        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
        })
        router.push("/")
    }

    const getInitials = (name?: string | null) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    const isAdmin = user.role === "admin"

    return (
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4">
                <div className="flex items-center gap-4 md:gap-6">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>

                    <Link
                        href={isAdmin ? "/dashboard/admin" : "/dashboard"}
                        className="flex items-center gap-2 font-semibold text-primary"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                            <path d="M8 11h8" />
                            <path d="M12 15V7" />
                        </svg>
                        {isAdmin ? "Admin Dashboard" : "Seller Dashboard"}
                    </Link>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-[200px] bg-background pl-8 transition-all duration-300 focus:w-[300px]"
                        />
                    </div>

                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
                        <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]">
                            3
                        </Badge>
                    </Button>

                    <Button variant="ghost" size="icon">
                        <MessageSquare className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
                    </Button>

                    <ThemeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Avatar className="h-8 w-8 transition-transform duration-300 hover:scale-110">
                                    <AvatarImage src={user.profileImage || ""} alt={user.name || "User"} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push("/help")}>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Help & Support
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <MobileSidebar user={user} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
        </header>
    )
}

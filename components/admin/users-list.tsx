"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { MoreHorizontal, Check, X, Shield, User, Store, Eye, Edit, Trash, Ban } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface UserType {
  id: string
  name: string
  email: string
  username: string
  avatar?: string
  role: "ADMIN" | "SELLER" | "BUYER"
  isVerified: boolean
  joinedAt: string
  lastActive: string
}

interface UsersListProps {
  role: "all" | "ADMIN" | "SELLER" | "BUYER"
}

async function fetchUsers(role: string, page = 1) {
  // In a real application, this would fetch from your API
  // For now, we'll return mock data
  const mockUsers: UserType[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    username: `user${i + 1}`,
    avatar: i % 3 === 0 ? `/placeholder.svg?height=40&width=40` : undefined,
    role: i % 10 === 0 ? "ADMIN" : i % 3 === 0 ? "SELLER" : "BUYER",
    isVerified: i % 4 === 0,
    joinedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    lastActive: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
  }))

  // Filter by role if specified
  const filteredUsers = role === "all" ? mockUsers : mockUsers.filter((user) => user.role === role)

  // Paginate
  const perPage = 10
  const totalPages = Math.ceil(filteredUsers.length / perPage)
  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage)

  return {
    users: paginatedUsers,
    pagination: {
      total: filteredUsers.length,
      page,
      perPage,
      totalPages,
    },
  }
}

export function UsersList({ role }: UsersListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = Number(searchParams.get("page") || "1")

  const [data, setData] = useState<{
    users: UserType[]
    pagination: {
      total: number
      page: number
      perPage: number
      totalPages: number
    }
  } | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      const result = await fetchUsers(role, page)
      setData(result)
      setIsLoading(false)
    }

    loadUsers()
  }, [role, page])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-4 w-4" />
      case "SELLER":
        return <Store className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        )
      case "SELLER":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Store className="h-3 w-3" />
            Seller
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Buyer
          </Badge>
        )
    }
  }

  if (isLoading || !data) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  {user.isVerified ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Unverified
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{formatDate(user.joinedAt)}</TableCell>
                <TableCell>{formatDate(user.lastActive)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}`} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/users/${user.id}/edit`} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!user.isVerified ? (
                        <DropdownMenuItem className="cursor-pointer">
                          <Check className="mr-2 h-4 w-4" />
                          Verify User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="cursor-pointer">
                          <X className="mr-2 h-4 w-4" />
                          Unverify User
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                        <Ban className="mr-2 h-4 w-4" />
                        Suspend User
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={page > 1 ? `?page=${page - 1}` : "#"}
              aria-disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {Array.from({ length: Math.min(5, data.pagination.totalPages) }).map((_, i) => {
            const pageNumber = i + 1
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink href={`?page=${pageNumber}`} isActive={pageNumber === page}>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          {data.pagination.totalPages > 5 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href={`?page=${data.pagination.totalPages}`}>
                  {data.pagination.totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              href={page < data.pagination.totalPages ? `?page=${page + 1}` : "#"}
              aria-disabled={page >= data.pagination.totalPages}
              className={page >= data.pagination.totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

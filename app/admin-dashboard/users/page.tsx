import { Suspense } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { UsersList } from "@/components/admin/users-list"
import { UserFilters } from "@/components/admin/user-filters"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Button asChild>
          <Link href="/admin/users/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New User
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="buyers">Buyers</TabsTrigger>
            <TabsTrigger value="sellers">Sellers</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>
          <UserFilters />
        </div>

        <TabsContent value="all" className="space-y-6 mt-6">
          <Suspense fallback={<UsersListSkeleton />}>
            <UsersList role="all" />
          </Suspense>
        </TabsContent>

        <TabsContent value="buyers" className="space-y-6 mt-6">
          <Suspense fallback={<UsersListSkeleton />}>
            <UsersList role="BUYER" />
          </Suspense>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-6 mt-6">
          <Suspense fallback={<UsersListSkeleton />}>
            <UsersList role="SELLER" />
          </Suspense>
        </TabsContent>

        <TabsContent value="admins" className="space-y-6 mt-6">
          <Suspense fallback={<UsersListSkeleton />}>
            <UsersList role="ADMIN" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UsersListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="bg-muted/50 p-4">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </div>
        <div className="divide-y">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

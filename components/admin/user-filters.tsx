"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function UserFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [isVerified, setIsVerified] = useState<boolean | null>(
    searchParams.get("isVerified") === "true" ? true : searchParams.get("isVerified") === "false" ? false : null,
  )
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "joinedAt")
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc")

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (isVerified !== null) params.set("isVerified", String(isVerified))
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)

    router.push(`?${params.toString()}`)
  }

  const resetFilters = () => {
    setSearch("")
    setIsVerified(null)
    setSortBy("joinedAt")
    setSortOrder("desc")
    router.push("")
  }

  const hasFilters = search || isVerified !== null || sortBy !== "joinedAt" || sortOrder !== "desc"

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-64">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          className="w-full"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {hasFilters && (
              <Badge variant="secondary" className="ml-1 rounded-full px-1 text-xs">
                {
                  Object.keys({
                    search: search || undefined,
                    isVerified: isVerified !== null ? isVerified : undefined,
                    sortBy: sortBy !== "joinedAt" ? sortBy : undefined,
                    sortOrder: sortOrder !== "desc" ? sortOrder : undefined,
                  }).filter(
                    (k) =>
                      ({
                        search,
                        isVerified,
                        sortBy,
                        sortOrder,
                      })[k as keyof typeof isVerified] !== undefined,
                  ).length
                }
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Verification Status
          </DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={isVerified === true}
            onCheckedChange={() => setIsVerified(isVerified === true ? null : true)}
          >
            Verified
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={isVerified === false}
            onCheckedChange={() => setIsVerified(isVerified === false ? null : false)}
          >
            Unverified
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Sort By</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={sortBy === "joinedAt"} onCheckedChange={() => setSortBy("joinedAt")}>
            Join Date
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={sortBy === "lastActive"} onCheckedChange={() => setSortBy("lastActive")}>
            Last Active
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={sortBy === "name"} onCheckedChange={() => setSortBy("name")}>
            Name
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Sort Order</DropdownMenuLabel>
          <DropdownMenuCheckboxItem checked={sortOrder === "desc"} onCheckedChange={() => setSortOrder("desc")}>
            Descending
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={sortOrder === "asc"} onCheckedChange={() => setSortOrder("asc")}>
            Ascending
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          <div className="flex items-center justify-between p-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Apply
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
    
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Filter, Loader2, Plus, Search, SortDesc, Trash } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Listing = {
  id: number
  title: string
  description: string
  price: string
  originalPrice: string | null
  status: string
  slug : string
  featured: boolean
  createdAt: string
  updatedAt: string
  seller: {
    user: {
      name: string
      avatar: string | null
    }
  }
  category: {
    name: string
    slug: string
  }
  images: {
    id: number
    url: string
    isMain: boolean
  }[]
  _count: {
    reviews: number
  }
}

type PaginationData = {
  total: number
  page: number
  limit: number
  pages: number
}

export default function ListingsManagement() {
  const [listings, setListings] = useState<Listing[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<number | null>(null)
  const [deletingListing, setDeletingListing] = useState(false)

  const { toast } = useToast()

  const fetchListings = async () => {
    setLoading(true)
    try {
      let url = `/api/listings?page=${pagination.page}&limit=${pagination.limit}`

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`
      }

      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`
      }

      if (sortOrder) {
        url += `&sort=${sortOrder}`
      }

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setListings(data.data.listings)
        setPagination(data.data.pagination)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch listings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [pagination.page, statusFilter, sortOrder])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchListings()
  }

  const handleDeleteClick = (id: number) => {
    setListingToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return

    setDeletingListing(true)
    try {
      const response = await fetch(`/api/listings/${listingToDelete}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Listing deleted successfully",
        })
        fetchListings()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete listing",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setDeletingListing(false)
      setDeleteDialogOpen(false)
      setListingToDelete(null)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Listing status updated to ${status.toLowerCase()}`,
        })
        fetchListings()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update listing status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleFeaturedToggle = async (id: number, featured: boolean) => {
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featured: !featured }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: featured ? "Listing removed from featured" : "Listing added to featured",
        })
        fetchListings()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update listing",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500 hover:bg-green-600"
      case "PENDING":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "SOLD":
        return "bg-blue-500 hover:bg-blue-600"
      case "INACTIVE":
        return "bg-gray-500 hover:bg-gray-600"
      case "REJECTED":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle>Listings Management</CardTitle>
            <div className="flex flex-wrap gap-2">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px] pr-8"
                />
                <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="SOLD">Sold</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[130px]">
                  <SortDesc className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              <Link href="/seller-dashboard/add-listing">
                <Button size="sm" className="h-10 flex items-center bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Listing
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-muted-foreground"
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M12 11h4" />
                    <path d="M12 16h4" />
                    <path d="M8 11h.01" />
                    <path d="M8 16h.01" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">No listings found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Create your first listing to get started"}
                </p>
                <Link href="/seller-dashboard/add-listing" className="mt-4">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Listing
                  </Button>
                </Link>
              </div>
            ) : (
              listings.map((listing) => (
                <div
                  key={listing.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border p-4 transition-all duration-300 hover:border-primary hover:bg-muted/50"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                    <img
                      src={listing.images.length > 0 ? listing.images[0].url : `/placeholder.svg?height=64&width=64`}
                      alt={listing.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium transition-colors duration-300 group-hover:text-primary">
                      {listing.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>ID: {listing.id}</span>
                      <span>•</span>
                      <span>Category: {listing.category.name}</span>
                      <span>•</span>
                      <span>Seller: {listing.seller.user.name}</span>
                      <span>•</span>
                      <span>Listed on {new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col items-end gap-2">
                    <p className="font-bold text-primary">${Number.parseFloat(listing.price).toFixed(2)}</p>
                    <Badge
                      className={`cursor-pointer ${getStatusBadgeColor(listing.status)}`}
                      onClick={() => {
                        const nextStatus =
                          {
                            PENDING: "ACTIVE",
                            ACTIVE: "INACTIVE",
                            INACTIVE: "ACTIVE",
                            REJECTED: "PENDING",
                            SOLD: "ACTIVE",
                          }[listing.status] || "ACTIVE"
                        handleStatusChange(listing.id, nextStatus)
                      }}
                    >
                      {listing.status}
                    </Badge>
                    {listing.featured && (
                      <Badge variant="outline" className="border-amber-500 text-amber-500">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full transition-all duration-300 hover:bg-primary/10"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/seller-dashboard/listings/${listing.id}/edit`}>
                        <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => handleFeaturedToggle(listing.id, listing.featured)}
                      >
                        {listing.featured ? "Remove from Featured" : "Add to Featured"}
                      </DropdownMenuItem>
                      <Link href={`/product/${listing.id}`} target="_blank">
                        <DropdownMenuItem className="cursor-pointer">View Listing</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-500 focus:text-red-500"
                        onClick={() => handleDeleteClick(listing.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && listings.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} listings
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deletingListing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deletingListing}>
              {deletingListing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

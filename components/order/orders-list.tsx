"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
  MoreVertical,
  Eye,
  FileText,
  MessageSquare,
  Star,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

interface User {
  id: number
  name: string
  username: string
  avatar: string | null
  isVerified: boolean
}

interface ListingImage {
  id: number
  url: string
  isMain: boolean
}

interface Listing {
  id: number
  title: string
  price: number
  images: ListingImage[]
}

interface Review {
  id: number
  rating: number
}

interface Order {
  id: number
  orderNumber: string
  status: string
  totalAmount: number
  platformFee: number
  transactionFee: number
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  buyer: User
  seller: User
  listing: Listing
  review: Review | null
}

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500 hover:bg-yellow-600",
  PROCESSING: "bg-blue-500 hover:bg-blue-600",
  SHIPPED: "bg-purple-500 hover:bg-purple-600",
  DELIVERED: "bg-green-500 hover:bg-green-600",
  COMPLETED: "bg-emerald-500 hover:bg-emerald-600",
  CANCELLED: "bg-red-500 hover:bg-red-600",
  REFUNDED: "bg-orange-500 hover:bg-orange-600",
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500 hover:bg-yellow-600",
  PAID: "bg-green-500 hover:bg-green-600",
  FAILED: "bg-red-500 hover:bg-red-600",
  REFUNDED: "bg-orange-500 hover:bg-orange-600",
}

export default function Orders() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [orderType, setOrderType] = useState(searchParams.get("type") || "all")
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "createdAt")
  const [sortOrder, setSortOrder] = useState(searchParams.get("order") || "desc")
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)

  // Fetch orders with filters
  const fetchOrders = async () => {
    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      queryParams.set("page", currentPage.toString())
      queryParams.set("limit", pagination.limit.toString())

      if (orderType !== "all") {
        queryParams.set("type", orderType)
      }

      if (status) {
        queryParams.set("status", status)
      }

      if (searchQuery) {
        queryParams.set("search", searchQuery)
      }

      if (sortBy) {
        queryParams.set("sort", sortBy)
        queryParams.set("order", sortOrder)
      }

      const response = await fetch(`/api/orders?${queryParams.toString()}`)
      console.log(response)

      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data.orders || [])
      setPagination(
        data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 0,
        },
      )
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to load orders. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update URL with current filters
  const updateUrl = () => {
    const params = new URLSearchParams()

    if (orderType !== "all") {
      params.set("type", orderType)
    }

    if (status) {
      params.set("status", status)
    }

    if (searchQuery) {
      params.set("search", searchQuery)
    }

    if (sortBy) {
      params.set("sort", sortBy)
      params.set("order", sortOrder)
    }

    if (currentPage > 1) {
      params.set("page", currentPage.toString())
    }

    const queryString = params.toString()
    const url = queryString ? `/orders?${queryString}` : "/orders"

    router.push(url, { scroll: false })
  }

  // Handle filter changes
  const handleTypeChange = (value: string) => {
    setOrderType(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-")
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setCurrentPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchOrders()
    updateUrl()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Cancel order
  const handleCancelOrder = async (orderId: number) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to cancel order")
      }

      toast({
        title: "Order Cancelled",
        description: "The order has been cancelled successfully.",
      })

      // Refresh orders
      fetchOrders()
    } catch (err) {
      console.error("Error cancelling order:", err)
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Effects
  useEffect(() => {
    fetchOrders()
  }, [currentPage, orderType, status, sortBy, sortOrder])

  useEffect(() => {
    updateUrl()
  }, [currentPage, orderType, status, sortBy, sortOrder, searchQuery])

  // Render order status badge
  const renderStatusBadge = (status: string) => {
    const colorClass = ORDER_STATUS_COLORS[status] || "bg-gray-500 hover:bg-gray-600"
    return <Badge className={colorClass}>{status}</Badge>
  }

  // Render payment status badge
  const renderPaymentStatusBadge = (status: string) => {
    const colorClass = PAYMENT_STATUS_COLORS[status] || "bg-gray-500 hover:bg-gray-600"
    return <Badge className={colorClass}>{status}</Badge>
  }

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
          <Skeleton className="h-16 w-16 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
          <div className="text-center">
            <Skeleton className="h-5 w-16 mx-auto" />
            <Skeleton className="h-5 w-20 mx-auto mt-2" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle>My Orders</CardTitle>
            <div className="flex flex-wrap gap-2">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="w-[200px] h-8 pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </form>
            </div>
          </div>
        </CardHeader>

        <Tabs value={orderType} onValueChange={handleTypeChange} className="px-4">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="px-4 mb-4 flex flex-wrap gap-2">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="totalAmount-desc">Price: High to Low</SelectItem>
              <SelectItem value="totalAmount-asc">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <CardContent>
          {loading ? (
            renderSkeletons()
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mb-2" />
              <p className="text-lg font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => fetchOrders()}>
                Try Again
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {orderType === "purchases"
                  ? "You haven't made any purchases yet."
                  : orderType === "sales"
                    ? "You haven't made any sales yet."
                    : "You don't have any orders yet."}
              </p>
              {orderType === "purchases" && (
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/marketplace">Browse Marketplace</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4 transition-all duration-300 hover:border-primary hover:bg-muted/50"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                    <img
                      src={order.listing.images?.[0]?.url || `/placeholder.svg?height=64&width=64`}
                      alt={order.listing.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-medium transition-colors duration-300 group-hover:text-primary">
                      <Link href={`/dashboard/orders/${order.id}`}>{order.listing.title}</Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Order #{order.orderNumber} • {formatDate(order.createdAt)}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {renderStatusBadge(order.status)}
                      {renderPaymentStatusBadge(order.paymentStatus)}
                    </div>
                  </div>
                  <div className="text-center mt-2 sm:mt-0">
                    <p className="font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {orderType === "all"
                        ? order.buyer.id === order.seller.id
                          ? "Your Order"
                          : order.buyer.name === order.seller.name
                            ? "Your Order"
                            : `${order.buyer.id === Number(order.seller.id) ? "From" : "To"} ${order.buyer.id === Number(order.seller.id) ? order.seller.name : order.buyer.name}`
                        : orderType === "purchases"
                          ? `From ${order.seller.name}`
                          : `To ${order.buyer.name}`}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full transition-all duration-300 hover:bg-primary/10"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>

                      {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/orders/${order.id}/message`}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Contact {orderType === "purchases" ? "Seller" : "Buyer"}
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {order.status === "DELIVERED" && orderType === "purchases" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/orders/${order.id}/complete`}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark as Completed
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {order.status === "COMPLETED" && !order.review && orderType === "purchases" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/orders/${order.id}/review`}>
                            <Star className="mr-2 h-4 w-4" />
                            Leave Review
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {(order.status === "PENDING" || order.status === "PROCESSING") && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500" onClick={() => handleCancelOrder(order.id)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Order
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        {!loading && !error && orders.length > 0 && pagination.pages > 1 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                // Show pages around the current page
                let pageNum
                if (pagination.pages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(Math.min(pagination.pages, currentPage + 1))}
                disabled={currentPage === pagination.pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

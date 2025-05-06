"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Clock, Download, MessageSquare, Package, Star, Truck, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency, formatDate } from "@/lib/utils"

interface OrderDetailsProps {
  order: any
  userId: number
}

export default function OrderDetails({ order, userId }: OrderDetailsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const isUserBuyer = order.buyerId === userId
  const isUserSeller = order.sellerId === userId
  const seller = order.seller.user;
  const buyer = order.buyer;


  // Get main image
  const mainImage = order.listing.images.find((img: any) => img.isMain) || order.listing.images[0]

  // Order status steps
  const orderSteps = [
    { status: "PENDING", label: "Order Placed", icon: Clock },
    { status: "PROCESSING", label: "Processing", icon: Package },
    { status: "SHIPPED", label: "Shipped", icon: Truck },
    { status: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
    { status: "COMPLETED", label: "Completed", icon: Star },
  ]

  // Find current step index
  const currentStepIndex = orderSteps.findIndex((step) => step.status === order.status)
  const isCancelled = order.status === "CANCELLED"

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
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

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error("Error cancelling order:", error)
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle complete order
  const handleCompleteOrder = () => {
    router.push(`/dashboard/orders/${order.id}/complete`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/orders"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>

        <div className="flex items-center gap-2">
          {isUserBuyer && order.status === "DELIVERED" && (
            <Button onClick={handleCompleteOrder}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Completed
            </Button>
          )}

          {(order.status === "PENDING" || order.status === "PROCESSING") && (
            <Button variant="outline" onClick={handleCancelOrder} disabled={isLoading}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          )}

          <Button variant="outline" asChild>
            <Link href={`/dashboard/orders/${order.id}/message`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Order #{order.orderNumber}</CardTitle>
              <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
            </div>
            <Badge
              className={
                order.status === "COMPLETED"
                  ? "bg-green-500 hover:bg-green-600"
                  : order.status === "CANCELLED"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
              }
            >
              {order.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Progress */}
          {!isCancelled && (
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">Order Progress</h3>
              <div className="relative flex justify-between">
                {/* Progress Line */}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{
                      width: currentStepIndex >= 0 ? `${(currentStepIndex / (orderSteps.length - 1)) * 100}%` : "0%",
                    }}
                  />
                </div>

                {/* Steps */}
                {orderSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex
                  const isCurrent = index === currentStepIndex

                  return (
                    <div key={step.status} className="flex flex-col items-center z-10">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        } ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      >
                        <step.icon className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-xs font-medium">{step.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              {/* Product Details */}
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-4">Product</h3>
                <div className="flex gap-4">
                  <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                    <img
                      src={mainImage?.url || `/placeholder.svg?height=80&width=80`}
                      alt={order.listing.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">
                      <Link href={`/product/${order.listing.id}`} className="hover:underline">
                        {order.listing.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Category: {order.listing.category?.name || "N/A"}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-primary">{formatCurrency(order.listing.price)}</span>
                      <span className="text-sm text-muted-foreground">Qty: 1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer/Seller Info */}
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-4">{isUserBuyer ? "Seller Information" : "Customer Information"}</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        isUserBuyer ? seller.avatar : buyer.avatar || `/placeholder.svg?height=40&width=40`
                      }
                      alt={isUserBuyer ? seller.name : buyer.name}
                    />
                    <AvatarFallback>{(isUserBuyer ? seller.name : buyer.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {isUserBuyer ? seller.name : buyer.name}
                      {(isUserBuyer ? seller.isVerified : buyer.isVerified) && (
                        <Badge variant="outline" className="ml-2">
                          Verified
                        </Badge>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{isUserBuyer ? seller.username : buyer.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">Payment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.totalAmount - order.platformFee - order.transactionFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>{formatCurrency(order.platformFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction Fee</span>
                  <span>{formatCurrency(order.transactionFee)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm mt-4">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge
                    className={
                      order.paymentStatus === "PAID"
                        ? "bg-green-500 hover:bg-green-600"
                        : order.paymentStatus === "FAILED"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>

              {/* Download Invoice */}
              <Button variant="outline" className="w-full mt-6">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </div>
          </div>

          {/* Review Section */}
          {order.status === "COMPLETED" && isUserBuyer && (
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">Review</h3>
              {order.review ? (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < order.review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">{order.review.rating}/5</span>
                  </div>
                  {order.review.comment && <p className="text-sm">{order.review.comment}</p>}
                  <p className="text-xs text-muted-foreground">Reviewed on {formatDate(order.review.createdAt)}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">You haven't reviewed this purchase yet.</p>
                  <Button asChild>
                    <Link href={`/dashboard/orders/${order.id}/review`}>
                      <Star className="mr-2 h-4 w-4" />
                      Leave a Review
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

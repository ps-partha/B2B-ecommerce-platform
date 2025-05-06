"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CheckCircle, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface OrderCompleteFormProps {
  order: any // Using any for simplicity, but you should define a proper type
}

export function OrderCompleteForm({ order }: OrderCompleteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [includeReview, setIncludeReview] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // First, mark the order as completed
      const completeResponse = await fetch(`/api/orders/${order.id}/complete`, {
        method: "POST",
      })

      if (!completeResponse.ok) {
        const error = await completeResponse.json()
        throw new Error(error.message || "Failed to complete order")
      }

      // If including a review, submit it
      if (includeReview) {
        const reviewResponse = await fetch("/api/reviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
            listingId: order.listingId,
            rating,
            comment,
          }),
        })

        if (!reviewResponse.ok) {
          const error = await reviewResponse.json()
          console.error("Review submission error:", error)
          // We don't throw here to avoid blocking the order completion
          toast({
            title: "Review submission failed",
            description: error.message || "Your order was completed, but we couldn't submit your review.",
            variant: "destructive",
          })
        }
      }

      toast({
        title: "Order completed successfully",
        description: includeReview ? "Thank you for your review!" : "Thank you for your purchase!",
        variant: "success",
      })

      // Redirect to the orders page
      router.push("/dashboard/orders")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order #{order.orderNumber}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 overflow-hidden rounded-md border">
            <Image
              src={order.listing.images[0]?.url || "/placeholder.svg?height=80&width=80"}
              alt={order.listing.title}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium">{order.listing.title}</h3>
            <p className="text-sm text-muted-foreground">Seller: {order.seller.name}</p>
            <p className="text-sm font-medium">Total: ${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="font-medium">Confirm Order Completion</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            By completing this order, you confirm that you have received the product as described and are satisfied with
            your purchase. This will release the payment to the seller.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="include-review"
              checked={includeReview}
              onChange={(e) => setIncludeReview(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <label htmlFor="include-review" className="text-sm font-medium">
              Include a review for this product
            </label>
          </div>

          {includeReview && (
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          (hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium mb-2">
                  Your Review (Optional)
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-violet-600 hover:bg-violet-700">
          {isSubmitting ? "Processing..." : "Complete Order"}
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Heart, Share2, ShieldCheck, ShoppingCart, Star, User } from "lucide-react"
import { calculateDiscountPercentage } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { ViewProduct } from "@/lib/types"
import ProductImages from "./ProductImages"
import { ReviewStats } from "./review-stats"
import { CanReviewCheck } from "./can-review-check"
import { ReviewList } from "./review-list"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/context/cart-context"

export default function ProductPage({ product }: { product: ViewProduct }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [refreshReviews, setRefreshReviews] = useState(0)
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    const mainImage = product.images.find((img) => img.isMain) || product.images[0]

    addItem({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      quantity: quantity,
      image: mainImage?.url || "/placeholder.svg",
      sellerId: product.seller?.id || 0,
      sellerName: product.seller?.user?.name || "Unknown Seller",
    })
  }
  const handleBuyNow = async () => {
    // First add to cart
    handleAddToCart()

    // Then navigate to checkout
    router.push("/checkout")
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  // Order state
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD")

  // Review state
  const [includeReview, setIncludeReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")

  const handleOrder = async () => {
    setIsSubmitting(true)

    try {
      // Step 1: Create the order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: product.id,
          paymentMethod: paymentMethod,
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      const { order } = await orderResponse.json()

      // Step 2: If this is a digital product, we can optionally mark it as completed right away
      const isDigitalProduct = product.category?.name?.toLowerCase().includes("digital")
      const completeImmediately = isDigitalProduct

      if (completeImmediately) {
        const completeResponse = await fetch(`/api/orders/${order.id}/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!completeResponse.ok) {
          console.error("Order completion failed:", await completeResponse.json())
          // Continue with the order process even if completion fails
        }

        // Step 3: If review is included with immediate completion, submit it
        if (includeReview && rating > 0) {
          await submitReview(order.id, product.id)
        }
      }

      // Step 4: Show success message
      toast({
        title: "Order placed successfully",
        description: `Order #${order.orderNumber} has been created.`,
      })

      // Step 5: Redirect to order confirmation page
      router.push(`/dashboard/orders/${order.id}`)
    } catch (error: any) {
      console.error("Order creation error:", error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong while placing your order",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to submit a review
  const submitReview = async (orderId: number, listingId: number) => {
    try {
      const reviewResponse = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          listingId,
          rating,
          comment: reviewComment,
        }),
      })

      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json()
        console.error("Review submission failed:", errorData)
        toast({
          title: "Review submission failed",
          description: errorData.error || "Your order was placed, but we couldn't submit your review.",
          variant: "destructive",
        })
        return false
      }

      // Refresh reviews list
      setRefreshReviews((prev) => prev + 1)
      return true
    } catch (error) {
      console.error("Review submission error:", error)
      return false
    }
  }

  const handleReviewAdded = () => {
    setRefreshReviews((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/marketplace" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <ProductImages title={product.title} images={product.images} />

          {/* Product Info */}
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Badge className="bg-emerald-500 hover:bg-emerald-600">Verified</Badge>
              <Badge variant="outline">{product.category?.name || "Gaming Account"}</Badge>
            </div>
            <h1 className="mb-2 text-3xl font-bold">{product.title}</h1>

            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`mr-1 h-5 w-5 ${
                      star <= Math.round(product.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-medium">
                  {product.averageRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{product.sales} sold</span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-violet-600">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="ml-2 text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                    {calculateDiscountPercentage(Number(product.originalPrice), Number(product.price))}% OFF
                  </span>
                </>
              )}
            </div>

            <Separator className="my-6" />

            <div className="mb-6 space-y-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
              {product.features && product.features.length > 0 && (
                <ul className="grid gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-emerald-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={product.seller?.user?.avatar || "/placeholder.svg?height=40&width=40"}
                    alt="Seller"
                  />
                  <AvatarFallback>
                    {product.seller?.user?.name ? product.seller.user.name.substring(0, 2).toUpperCase() : "SE"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{product.seller?.user?.name || "Seller"}</p>
                  <p className="text-xs text-muted-foreground">Verified Seller</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </div>

            {/* Review option for immediate purchase */}
            <div className="mb-6 space-y-4 rounded-lg border p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-review"
                  checked={includeReview}
                  onCheckedChange={(checked) => setIncludeReview(checked as boolean)}
                />
                <label htmlFor="include-review" className="text-sm font-medium cursor-pointer">
                  Include a review with your purchase
                </label>
              </div>

              {includeReview && (
                <div className="space-y-4 pl-6">
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
                    <label htmlFor="reviewComment" className="block text-sm font-medium mb-2">
                      Your Review (Optional)
                    </label>
                    <Textarea
                      id="reviewComment"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1 bg-violet-600 hover:bg-violet-700"
                onClick={handleOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Buy Now"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <p className="text-sm font-medium">Secure Transaction</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                This transaction is protected by our escrow system. Payment is only released to the seller after you
                confirm receipt.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
              <TabsTrigger value="seller">Seller Info</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Product Details</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <ul className="space-y-2 text-sm">
                        {product.productInfo &&
                          product.productInfo.map((productInfo, index) => (
                            <li key={index} className="flex justify-between">
                              <span className="text-muted-foreground">{productInfo.key}</span>
                              <span>{productInfo.value}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Customer Reviews</h3>

                  {/* Review Statistics */}
                  <ReviewStats
                    averageRating={product.averageRating}
                    totalReviews={product.reviews.length}
                    ratingCounts={product.reviews}
                  />

                  <Separator className="my-6" />

                  {/* Add Review Form - Client Component */}
                  <CanReviewCheck listingId={product.id} onReviewAdded={handleReviewAdded} />

                  <Separator className="my-6" />

                  {/* Review List */}
                  <ReviewList
                    key={refreshReviews}
                    listingId={product.id}
                    initialReviews={product.reviews}
                    initialTotal={product.reviews.length}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seller" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Seller Information</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={product.seller?.user?.avatar || "/placeholder.svg?height=64&width=64"}
                        alt="Seller"
                      />
                      <AvatarFallback>
                        {product.seller?.user?.name ? product.seller.user.name.substring(0, 2).toUpperCase() : "SE"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{product.seller?.user?.name || "Seller"}</h4>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm">{product.seller.sellerRating?.toFixed(1) || "5.0"} Rating</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Member since{" "}
                        {product.seller?.createdAt
                          ? new Date(product.seller.createdAt).toLocaleDateString()
                          : "January 2023"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{product.seller?.totalSales || 120}</p>
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{product.seller?.responseRate || "98%"}</p>
                      <p className="text-sm text-muted-foreground">Response Rate</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">{product.seller?.responseTime || "2h"}</p>
                      <p className="text-sm text-muted-foreground">Response Time</p>
                    </div>
                  </div>

                  <Button className="w-full bg-violet-600 hover:bg-violet-700">Contact Seller</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">How does the delivery process work?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        After your purchase, the seller will contact you within 24 hours to arrange delivery of the
                        account credentials.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium">Is there a warranty or guarantee?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Yes, all purchases come with a 30-day warranty. If you encounter any issues with the account,
                        contact the seller for assistance.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium">Can I request specific features or items?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        You can contact the seller before purchase to inquire about specific features or items you're
                        interested in.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Similar Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <Link href="#" key={item}>
                <Card className="overflow-hidden border-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={`/placeholder.svg?height=300&width=300`}
                      alt="Product"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 font-semibold">Gaming Account - Level 80</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-violet-600">${120 + item * 10}.00</span>
                      <div className="flex items-center text-sm text-yellow-500">
                        4.8 <span className="ml-1">★</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

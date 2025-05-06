"use client"

import { useState, useEffect } from "react"
import { Star, ChevronDown, ChevronUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

interface Review {
  id: number
  rating: number
  comment: string
  createdAt: string
  giver: {
    id: number
    name: string
    username: string
    avatar: string | null
  }
}

interface ReviewListProps {
  listingId: number
  initialReviews?: Review[]
  initialTotal?: number
}

export function ReviewList({ listingId, initialReviews = [], initialTotal = 0 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(initialTotal)
  const limit = 5

  const fetchReviews = async (pageNum: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reviews?listingId=${listingId}&page=${pageNum}&limit=${limit}`)
      const data = await response.json()

      if (pageNum === 1) {
        setReviews(data.reviews)
      } else {
        setReviews((prev) => [...prev, ...data.reviews])
      }

      setTotal(data.pagination.total)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialReviews.length === 0) {
      fetchReviews(1)
    }
  }, [initialReviews.length])

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchReviews(nextPage)
  }

  const hasMoreReviews = reviews.length < total

  if (reviews.length === 0 && !loading) {
    return <div className="text-center py-8 text-muted-foreground">No reviews yet. Be the first to leave a review!</div>
  }

  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <div key={review.id}>
          <div className="mb-2 flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.giver.avatar || `/placeholder.svg?height=40&width=40`} alt={review.giver.name} />
              <AvatarFallback>{review.giver.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{review.giver.name}</p>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground ml-12">{review.comment}</p>
          {index < reviews.length - 1 && <Separator className="my-4" />}
        </div>
      ))}

      {loading && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {hasMoreReviews && (
        <div className="text-center">
          <Button variant="outline" onClick={loadMore} disabled={loading} className="mt-4">
            {loading ? "Loading..." : "Load More Reviews"}
            {loading ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  )
}

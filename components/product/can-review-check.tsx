"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

import { ReviewForm } from "./review-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface CanReviewCheckProps {
  listingId: number
  onReviewAdded?: () => void
}

export function CanReviewCheck({ listingId, onReviewAdded }: CanReviewCheckProps) {
  const { data: session, status } = useSession()
  const [checkResult, setCheckResult] = useState<{
    canReview: boolean
    reason?: string
    orderId?: number
    reviewId?: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkCanReview() {
      if (status === "loading") return

      if (status === "unauthenticated") {
        setCheckResult({ canReview: false, reason: "not_authenticated" })
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/reviews/can-review?listingId=${listingId}`)
        const data = await response.json()
        setCheckResult(data)
      } catch (error) {
        console.error("Error checking if user can review:", error)
        setCheckResult({ canReview: false, reason: "error" })
      } finally {
        setLoading(false)
      }
    }

    checkCanReview()
  }, [listingId, status])

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!checkResult) {
    return null
  }

  if (checkResult.canReview) {
    return (
      <div className="mb-8">
        <h4 className="text-lg font-medium mb-4">Write a Review</h4>
        <ReviewForm listingId={listingId} orderId={checkResult.orderId} onReviewAdded={onReviewAdded} />
      </div>
    )
  }

  if (checkResult.reason === "not_authenticated") {
    return (
      <div className="mb-8 p-4 bg-muted rounded-md">
        <p className="text-sm mb-2">Please log in to leave a review.</p>
        <Button onClick={() => router.push("/auth/login")} className="bg-violet-600 hover:bg-violet-700">
          Log In
        </Button>
      </div>
    )
  }

  if (checkResult.reason === "already_reviewed") {
    return (
      <div className="mb-8 p-4 bg-muted rounded-md">
        <p className="text-sm">You've already reviewed this product.</p>
      </div>
    )
  }

  if (checkResult.reason === "no_purchase") {
    return (
      <div className="mb-8 p-4 bg-muted rounded-md">
        <p className="text-sm">Only verified buyers can leave reviews.</p>
      </div>
    )
  }

  return (
    <div className="mb-8 p-4 bg-muted rounded-md">
      <p className="text-sm">Unable to determine review eligibility.</p>
    </div>
  )
}

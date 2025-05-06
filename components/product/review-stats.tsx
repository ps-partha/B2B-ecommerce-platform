"use client"

import { Star } from "lucide-react"

interface ReviewStatsProps {
  averageRating: number
  totalReviews: number
  ratingCounts: {
    [key: number]: number
  }
}

export function ReviewStats({ averageRating, totalReviews, ratingCounts }: ReviewStatsProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="text-center">
        <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
        <div className="flex items-center justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{totalReviews} reviews</div>
      </div>
      <div className="flex-1">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="mb-1 flex items-center gap-2">
            <div className="text-sm">{rating} stars</div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-yellow-400"
                style={{
                  width: totalReviews > 0 ? `${((ratingCounts[rating] || 0) / totalReviews) * 100}%` : "0%",
                }}
              ></div>
            </div>
            <div className="text-sm">{ratingCounts[rating] || 0}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

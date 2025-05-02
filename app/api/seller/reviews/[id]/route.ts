import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get review by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviewId = Number.parseInt(params.id)

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        giver: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            createdAt: true,
            completedAt: true,
          },
        },
      },
    })

    if (!review) {
      return errorResponse("Review not found", 404)
    }

    return successResponse(review)
  } catch (error) {
    console.error("Error fetching review:", error)
    return errorResponse("Failed to fetch review", 500)
  }
}

// Update review
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const reviewId = Number.parseInt(params.id)
    const userId = Number.parseInt(session.user.id)

    // Check if review exists and belongs to the user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        receiver: true,
      },
    })

    if (!review) {
      return errorResponse("Review not found", 404)
    }

    // Only the review giver or admin can update the review
    if (review.giverId !== userId && session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", 403)
    }

    const body = await request.json()
    const { rating, comment } = body

    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return errorResponse("Rating must be between 1 and 5", 400)
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        comment,
      },
      include: {
        giver: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Update seller rating if rating changed
    if (rating) {
      const sellerReviews = await prisma.review.findMany({
        where: { receiverId: review.receiverId },
        select: { rating: true },
      })

      const averageRating = sellerReviews.reduce((sum, review) => sum + review.rating, 0) / sellerReviews.length

      await prisma.user.update({
        where: { id: review.receiverId },
        data: { sellerRating: averageRating },
      })
    }

    return successResponse(updatedReview, "Review updated successfully")
  } catch (error) {
    console.error("Error updating review:", error)
    return errorResponse("Failed to update review", 500)
  }
}

// Delete review
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const reviewId = Number.parseInt(params.id)
    const userId = Number.parseInt(session.user.id)

    // Check if review exists and belongs to the user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        receiver: true,
      },
    })

    if (!review) {
      return errorResponse("Review not found", 404)
    }

    // Only the review giver or admin can delete the review
    if (review.giverId !== userId && session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", 403)
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId },
    })

    // Update seller rating
    const sellerReviews = await prisma.review.findMany({
      where: { receiverId: review.receiverId },
      select: { rating: true },
    })

    if (sellerReviews.length > 0) {
      const averageRating = sellerReviews.reduce((sum, review) => sum + review.rating, 0) / sellerReviews.length

      await prisma.user.update({
        where: { id: review.receiverId },
        data: { sellerRating: averageRating },
      })
    } else {
      // No reviews left, reset rating to null
      await prisma.user.update({
        where: { id: review.receiverId },
        data: { sellerRating: null },
      })
    }

    return successResponse(null, "Review deleted successfully")
  } catch (error) {
    console.error("Error deleting review:", error)
    return errorResponse("Failed to delete review", 500)
  }
}

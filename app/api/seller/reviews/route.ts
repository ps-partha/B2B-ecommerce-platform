import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get reviews (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const listingId = searchParams.get("listingId") ? Number.parseInt(searchParams.get("listingId")!) : undefined
    const userId = searchParams.get("userId") ? Number.parseInt(searchParams.get("userId")!) : undefined

    const skip = (page - 1) * limit

    // Build where clause based on filters
    const where: any = {}

    if (listingId) {
      where.listingId = listingId
    }

    if (userId) {
      where.receiverId = userId
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
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
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where }),
    ])

    return successResponse({
      reviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return errorResponse("Failed to fetch reviews", 500)
  }
}

// Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const body = await request.json()
    const { orderId, rating, comment } = body

    // Validate input
    if (!orderId || !rating) {
      return errorResponse("Missing required fields", 400)
    }

    if (rating < 1 || rating > 5) {
      return errorResponse("Rating must be between 1 and 5", 400)
    }

    // Check if order exists and belongs to the user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        listing: {
          include: {
            seller: true,
          },
        },
      },
    })

    if (!order) {
      return errorResponse("Order not found", 404)
    }

    // Only the buyer can leave a review
    if (order.buyerId !== userId) {
      return errorResponse("Forbidden", 403)
    }

    // Check if order is completed
    if (order.status !== "COMPLETED") {
      return errorResponse("Cannot review an incomplete order", 400)
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { orderId },
    })

    if (existingReview) {
      return errorResponse("Review already exists for this order", 409)
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        orderId,
        listingId: order.listingId,
        giverId: userId,
        receiverId: order.sellerId,
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

    // Update seller rating
    const sellerReviews = await prisma.review.findMany({
      where: { receiverId: order.sellerId },
      select: { rating: true },
    })

    const averageRating = sellerReviews.reduce((sum, review) => sum + review.rating, 0) / sellerReviews.length

    await prisma.user.update({
      where: { id: order.sellerId },
      data: { sellerRating: averageRating },
    })

    // Create notification for seller
    await prisma.notification.create({
      data: {
        userId: order.sellerId,
        type: "REVIEW",
        title: "New Review Received",
        message: `You received a ${rating}-star review for "${order.listing.title}".`,
      },
    })

    return successResponse(review, "Review created successfully", 201)
  } catch (error) {
    console.error("Error creating review:", error)
    return errorResponse("Failed to create review", 500)
  }
}

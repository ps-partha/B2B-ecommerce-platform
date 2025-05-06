import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

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

    return Response.json({
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
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

// Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const body = await request.json()
    const { listingId, orderId, rating, comment } = body

    // Validate input
    if (!listingId || !rating) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return Response.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        seller: true,
      },
    })

    if (!listing) {
      return Response.json({ error: "Listing not found" }, { status: 404 })
    }

    // If orderId is provided, verify it belongs to the user
    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
      })

      if (!order) {
        return Response.json({ error: "Order not found" }, { status: 404 })
      }

      // Only the buyer can leave a review
      if (order.buyerId !== userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 })
      }

      // Check if order is completed
      if (order.status !== "COMPLETED") {
        return Response.json({ error: "Cannot review an incomplete order" }, { status: 400 })
      }
    } else {
      // If no orderId, check if user has purchased this product
      const completedOrder = await prisma.order.findFirst({
        where: {
          buyerId: userId,
          listingId,
          status: "COMPLETED",
        },
      })

      if (!completedOrder) {
        return Response.json({ error: "You must purchase this product before reviewing" }, { status: 403 })
      }
    }

    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        giverId: userId,
        listingId,
      },
    })

    if (existingReview) {
      return Response.json({ error: "You have already reviewed this product" }, { status: 409 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        listingId,
        orderId,
        giverId: userId,
        receiverId: listing.sellerId,
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
      where: { receiverId: listing.sellerId },
      select: { rating: true },
    })

    const averageRating = sellerReviews.reduce((sum, review) => sum + review.rating, 0) / sellerReviews.length

    await prisma.user.update({
      where: { id: listing.sellerId },
      data: { sellerRating: averageRating },
    })

    // Create notification for seller
    await prisma.notification.create({
      data: {
        userId: listing.sellerId,
        type: "REVIEW",
        title: "New Review Received",
        message: `You received a ${rating}-star review for "${listing.title}".`,
      },
    })

    return Response.json({ review, message: "Review created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return Response.json({ error: "Failed to create review" }, { status: 500 })
  }
}

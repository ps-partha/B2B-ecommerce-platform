import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get all orders for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const type = searchParams.get("type") || "all" // "purchases", "sales", or "all"
    const status = searchParams.get("status") || undefined

    const skip = (page - 1) * limit

    // Build where clause based on filters
    const where: any = {}

    if (type === "purchases") {
      where.buyerId = userId
    } else if (type === "sales") {
      where.sellerId = userId
    } else {
      // "all" - show both purchases and sales
      where.OR = [{ buyerId: userId }, { sellerId: userId }]
    }

    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              isVerified: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              isVerified: true,
            },
          },
          listing: {
            include: {
              images: {
                where: { isMain: true },
                take: 1,
              },
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ])

    return successResponse({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return errorResponse("Failed to fetch orders", 500)
  }
}

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const body = await request.json()
    const { listingId, paymentMethod } = body

    // Validate input
    if (!listingId) {
      return errorResponse("Missing required fields", 400)
    }

    // Check if listing exists and is available
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
        status: "ACTIVE",
      },
      include: {
        seller: true,
      },
    })

    if (!listing) {
      return errorResponse("Listing not found or not available", 404)
    }

    // Prevent buying own listing
    if (listing.sellerId === userId) {
      return errorResponse("Cannot purchase your own listing", 400)
    }

    // Calculate fees
    const platformFee = Number.parseFloat((listing.price * 0.05).toFixed(2)) // 5% platform fee
    const transactionFee = Number.parseFloat((listing.price * 0.02).toFixed(2)) // 2% transaction fee
    const totalAmount = Number.parseFloat((listing.price + platformFee + transactionFee).toFixed(2))

    // Generate order number
    const orderNumber = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerId: userId,
        sellerId: listing.sellerId,
        listingId,
        totalAmount,
        platformFee,
        transactionFee,
        paymentMethod,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            avatar: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            avatar: true,
          },
        },
        listing: true,
      },
    })

    // Create notifications for buyer and seller
    await prisma.notification.createMany({
      data: [
        {
          userId: userId,
          type: "ORDER",
          title: "Order Created",
          message: `Your order #${orderNumber} has been created and is pending payment.`,
        },
        {
          userId: listing.sellerId,
          type: "ORDER",
          title: "New Order Received",
          message: `You have received a new order #${orderNumber} for "${listing.title}".`,
        },
      ],
    })

    return successResponse(order, "Order created successfully", 201)
  } catch (error) {
    console.error("Error creating order:", error)
    return errorResponse("Failed to create order", 500)
  }
}

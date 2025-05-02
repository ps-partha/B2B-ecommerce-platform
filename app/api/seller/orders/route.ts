import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Admin: Get all orders with advanced filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || undefined
    const paymentStatus = searchParams.get("paymentStatus") || undefined
    const buyerId = searchParams.get("buyerId") ? Number.parseInt(searchParams.get("buyerId")!) : undefined
    const sellerId = searchParams.get("sellerId") ? Number.parseInt(searchParams.get("sellerId")!) : undefined
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const skip = (page - 1) * limit

    // Build where clause based on filters
    const where: any = {}

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        {
          listing: {
            title: { contains: search },
          },
        },
      ]
    }

    if (status) {
      where.status = status
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    if (buyerId) {
      where.buyerId = buyerId
    }

    if (sellerId) {
      where.sellerId = sellerId
    }

    // Build orderBy
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

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
              email: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              email: true,
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
          review: {
            select: {
              id: true,
              rating: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
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

// Admin: Update order status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    const body = await request.json()
    const { id, status, paymentStatus } = body

    if (!id) {
      return errorResponse("Order ID is required", 400)
    }

    const orderId = Number.parseInt(id)

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
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

    if (!order) {
      return errorResponse("Order not found", 404)
    }

    // Prepare update data
    const updateData: any = {}

    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus

    // If status is COMPLETED, set completedAt
    if (status === "COMPLETED" && order.status !== "COMPLETED") {
      updateData.completedAt = new Date()

      // Update seller stats
      await prisma.user.update({
        where: { id: order.sellerId },
        data: {
          totalSales: { increment: 1 },
          completedOrders: { increment: 1 },
        },
      })

      // Update listing sales count
      await prisma.listing.update({
        where: { id: order.listingId },
        data: {
          sales: { increment: 1 },
          status: "SOLD", // Mark listing as sold
        },
      })
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            email: true,
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

    // Create notifications for both buyer and seller
    if (status && status !== order.status) {
      await prisma.notification.createMany({
        data: [
          {
            userId: order.buyerId,
            type: "ORDER",
            title: "Order Status Updated",
            message: `Your order #${order.orderNumber} status has been updated to ${status} by an admin.`,
          },
          {
            userId: order.sellerId,
            type: "ORDER",
            title: "Order Status Updated",
            message: `Order #${order.orderNumber} status has been updated to ${status} by an admin.`,
          },
        ],
      })
    }

    return successResponse(updatedOrder, "Order updated successfully")
  } catch (error) {
    console.error("Error updating order:", error)
    return errorResponse("Failed to update order", 500)
  }
}

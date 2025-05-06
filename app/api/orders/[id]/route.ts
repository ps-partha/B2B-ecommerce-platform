import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get order by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const orderId = Number.parseInt(params.id)
    const userId = Number.parseInt(session.user.id)

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            email: true,
            isVerified: true,
          },
        },
        seller: {
          select: {
            id: true,
            user : {
              select: {
                name: true,
                username: true,
                avatar: true,
                email: true,
                isVerified: true,
              }
            }
          },
        },
        listing: {
          include: {
            images: true,
            category: true,
          },
        },
        review: true,
      },
    })

    if (!order) {
      return errorResponse("Order not found", 404)
    }

    // // Only allow buyer, seller, or admin to view the order
    // if (order.buyerId !== userId && order.sellerId !== userId && session.user.role !== "ADMIN") {
    //   return errorResponse("Forbidden", 403)
    // }

    return successResponse(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return errorResponse("Failed to fetch order", 500)
  }
}

// Update order status
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const orderId = Number.parseInt(params.id)
    const userId = Number.parseInt(session.user.id)
    const body = await request.json()
    const { status, paymentStatus, deliveryStatus } = body

    // Get the order
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
            user: {
              select: {
                name: true,
                username: true,
                avatar: true,
                isVerified: true,
              },
            },
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

    // Check permissions based on the update type
    if (status) {
      // Only admin can change status directly
      if (session.user.role !== "ADMIN") {
        return errorResponse("Forbidden", 403)
      }
    }

    if (paymentStatus) {
      // Only buyer or admin can update payment status
      if (order.buyerId !== userId && session.user.role !== "ADMIN") {
        return errorResponse("Forbidden", 403)
      }
    }

    if (deliveryStatus) {
      // Only seller or admin can update delivery status
      if (order.sellerId !== userId && session.user.role !== "ADMIN") {
        return errorResponse("Forbidden", 403)
      }
    }

    // Prepare update data
    const updateData: any = {}

    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (deliveryStatus) updateData.deliveryStatus = deliveryStatus

    // If status is COMPLETED, set completedAt
    if (status === "COMPLETED") {
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
        listing: true,
      },
    })

    // Create notifications for status changes
    if (status) {
      await prisma.notification.createMany({
        data: [
          {
            userId: order.buyerId,
            type: "ORDER",
            title: "Order Status Updated",
            message: `Your order #${order.orderNumber} status has been updated to ${status}.`,
          },
          {
            userId: order.sellerId,
            type: "ORDER",
            title: "Order Status Updated",
            message: `Order #${order.orderNumber} status has been updated to ${status}.`,
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

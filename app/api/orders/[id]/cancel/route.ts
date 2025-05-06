import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const orderId = Number.parseInt(params.id)

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 })
    }

    // Check if user is authorized to cancel this order
    if (order.buyerId !== userId && order.sellerId !== userId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if order can be cancelled
    if (order.status !== "PENDING" && order.status !== "PROCESSING") {
      return Response.json({ error: "This order cannot be cancelled" }, { status: 400 })
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
    })

    // Create notifications for both buyer and seller
    await prisma.notification.createMany({
      data: [
        {
          userId: order.buyerId,
          type: "ORDER",
          title: "Order Cancelled",
          message: `Order #${order.orderNumber} has been cancelled.`,
        },
        {
          userId: order.sellerId,
          type: "ORDER",
          title: "Order Cancelled",
          message: `Order #${order.orderNumber} has been cancelled.`,
        },
      ],
    })

    return Response.json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    })
  } catch (error) {
    console.error("Error cancelling order:", error)
    return Response.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}

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

    const userId = Number.parseInt(session.user.id, 10)
    const orderId = Number.parseInt(params.id, 10)

    if (isNaN(orderId)) {
      return Response.json({ error: "Invalid order ID" }, { status: 400 })
    }

    // Check if order exists and belongs to the user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        buyerId: userId,
        status: "PROCESSING", // Only allow completing orders that are in processing status
      },
    })

    if (!order) {
      return Response.json({ error: "Order not found or cannot be completed" }, { status: 404 })
    }

    // Update order status to completed
    const completedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    })

    // Create notifications for buyer and seller
    await prisma.notification.createMany({
      data: [
        {
          userId,
          type: "ORDER",
          title: "Order Completed",
          message: `Your order #${order.orderNumber} has been marked as completed.`,
        },
        {
          userId: order.sellerId,
          type: "ORDER",
          title: "Order Completed",
          message: `Order #${order.orderNumber} has been marked as completed by the buyer.`,
        },
      ],
    })

    // Update seller stats
    await prisma.sellerProfile.update({
      where: { id: order.sellerId },
      data: {
        completedOrders: { increment: 1 },
        totalSales: { increment: 1 },
      },
    })

    return Response.json({ message: "Order completed successfully", order: completedOrder })
  } catch (error) {
    console.error("Error completing order:", error)
    return Response.json({ error: "Failed to complete order" }, { status: 500 })
  }
}

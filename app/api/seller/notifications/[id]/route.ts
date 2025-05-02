import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Mark a notification as read
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const notificationId = Number.parseInt(params.id)

    // Check if notification exists and belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      return errorResponse("Notification not found", 404)
    }

    if (notification.userId !== userId) {
      return errorResponse("Forbidden", 403)
    }

    // Mark as read
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
      },
    })

    return successResponse(updatedNotification, "Notification marked as read")
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return errorResponse("Failed to mark notification as read", 500)
  }
}

// Delete a notification
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const notificationId = Number.parseInt(params.id)

    // Check if notification exists and belongs to the user
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification) {
      return errorResponse("Notification not found", 404)
    }

    if (notification.userId !== userId) {
      return errorResponse("Forbidden", 403)
    }

    // Delete notification
    await prisma.notification.delete({
      where: { id: notificationId },
    })

    return successResponse(null, "Notification deleted")
  } catch (error) {
    console.error("Error deleting notification:", error)
    return errorResponse("Failed to delete notification", 500)
  }
}

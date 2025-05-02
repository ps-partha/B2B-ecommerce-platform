import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get all notifications for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unread") === "true"

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = { userId }

    if (unreadOnly) {
      where.isRead = false
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
    ])

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    })

    return successResponse({
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return errorResponse("Failed to fetch notifications", 500)
  }
}

// Mark all notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)

    // Mark all notifications as read
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return successResponse(null, "All notifications marked as read")
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    return errorResponse("Failed to mark notifications as read", 500)
  }
}

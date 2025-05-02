import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get messages between current user and another user
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const currentUserId = Number.parseInt(session.user.id)
    const otherUserId = Number.parseInt(params.userId)

    // Check if other user exists
    const otherUser = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        isVerified: true,
      },
    })

    if (!otherUser) {
      return errorResponse("User not found", 404)
    }

    // Get messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: currentUserId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: currentUserId, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: currentUserId },
        ],
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: currentUserId,
          user2Id: otherUserId,
        },
      })
    }

    return successResponse({
      messages,
      otherUser,
      conversation,
    })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return errorResponse("Failed to fetch messages", 500)
  }
}

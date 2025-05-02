import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get all conversations for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)

    // Find all conversations where the user is involved
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Get the other user's info for each conversation
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conversation) => {
        const otherUserId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id

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

        // Get unread message count
        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherUserId,
            receiverId: userId,
            isRead: false,
          },
        })

        return {
          ...conversation,
          otherUser,
          unreadCount,
        }
      }),
    )

    return successResponse(conversationsWithUsers)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return errorResponse("Failed to fetch conversations", 500)
  }
}

// Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const body = await request.json()
    const { receiverId, content } = body

    // Validate input
    if (!receiverId || !content) {
      return errorResponse("Missing required fields", 400)
    }

    const receiverIdInt = Number.parseInt(receiverId)

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverIdInt },
    })

    if (!receiver) {
      return errorResponse("Receiver not found", 404)
    }

    // Cannot send message to self
    if (receiverIdInt === userId) {
      return errorResponse("Cannot send message to yourself", 400)
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: receiverIdInt },
          { user1Id: receiverIdInt, user2Id: userId },
        ],
      },
    })

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: userId,
          user2Id: receiverIdInt,
          lastMessage: content,
        },
      })
    } else {
      // Update conversation's last message and timestamp
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessage: content,
          updatedAt: new Date(),
        },
      })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId: receiverIdInt,
        content,
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
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverIdInt,
        type: "MESSAGE",
        title: "New Message",
        message: `You have a new message from ${session.user.name}.`,
      },
    })

    return successResponse(message, "Message sent successfully", 201)
  } catch (error) {
    console.error("Error sending message:", error)
    return errorResponse("Failed to send message", 500)
  }
}

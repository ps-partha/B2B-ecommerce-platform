import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get user by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = Number.parseInt(params.id)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    // Only allow users to access their own data or admins to access any data
    if (session.user.id !== params.id && session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", 403)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        avatar: true,
        location: true,
        joinedAt: true,
        lastActive: true,
        isVerified: true,
        role: true,
        sellerRating: true,
        totalSales: true,
        responseRate: true,
        responseTime: true,
        completedOrders: true,
        cancellationRate: true,
        balance: true,
        _count: {
          select: {
            listings: true,
            purchases: true,
            sales: true,
            reviewsReceived: true,
          },
        },
      },
    })

    if (!user) {
      return errorResponse("User not found", 404)
    }

    return successResponse(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return errorResponse("Failed to fetch user", 500)
  }
}

// Update user
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = Number.parseInt(params.id)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    // Only allow users to update their own data or admins to update any data
    if (session.user.id !== params.id && session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", 403)
    }

    const body = await request.json()
    const { name, username, bio, location, avatar } = body

    // Validate username uniqueness if provided
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          id: { not: userId },
        },
      })

      if (existingUser) {
        return errorResponse("Username already taken", 400)
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        username,
        bio,
        location,
        avatar,
        lastActive: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        avatar: true,
        location: true,
        isVerified: true,
        role: true,
      },
    })

    return successResponse(updatedUser, "User updated successfully")
  } catch (error) {
    console.error("Error updating user:", error)
    return errorResponse("Failed to update user", 500)
  }
}

// Delete user (admin only or self)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = Number.parseInt(params.id)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    // Only allow users to delete their own account or admins to delete any account
    if (session.user.id !== params.id && session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", 403)
    }

    await prisma.user.delete({
      where: { id: userId },
    })

    return successResponse(null, "User deleted successfully")
  } catch (error) {
    console.error("Error deleting user:", error)
    return errorResponse("Failed to delete user", 500)
  }
}

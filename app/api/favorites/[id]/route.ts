import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Remove a listing from favorites
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const listingId = Number.parseInt(params.id)

    // Check if favorite exists
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    })

    if (!favorite) {
      return errorResponse("Favorite not found", 404)
    }

    // Remove from favorites
    await prisma.favorite.delete({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    })

    return successResponse(null, "Removed from favorites")
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return errorResponse("Failed to remove from favorites", 500)
  }
}

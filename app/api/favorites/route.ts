import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get all favorites for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        include: {
          listing: {
            include: {
              seller: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatar: true,
                  isVerified: true,
                },
              },
              category: true,
              images: {
                where: { isMain: true },
                take: 1,
              },
              _count: {
                select: {
                  reviews: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.favorite.count({ where: { userId } }),
    ])

    return successResponse({
      favorites,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return errorResponse("Failed to fetch favorites", 500)
  }
}

// Add a listing to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const body = await request.json()
    const { listingId } = body

    // Validate input
    if (!listingId) {
      return errorResponse("Missing required fields", 400)
    }

    const listingIdInt = Number.parseInt(listingId)

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingIdInt },
    })

    if (!listing) {
      return errorResponse("Listing not found", 404)
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId: listingIdInt,
        },
      },
    })

    if (existingFavorite) {
      return errorResponse("Listing already in favorites", 409)
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        listingId: listingIdInt,
      },
      include: {
        listing: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
            category: true,
            images: {
              where: { isMain: true },
              take: 1,
            },
          },
        },
      },
    })

    return successResponse(favorite, "Added to favorites", 201)
  } catch (error) {
    console.error("Error adding to favorites:", error)
    return errorResponse("Failed to add to favorites", 500)
  }
}

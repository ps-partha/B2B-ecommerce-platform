import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Admin: Get all listings with advanced filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || undefined
    const categoryId = searchParams.get("categoryId") ? Number.parseInt(searchParams.get("categoryId")!) : undefined
    const sellerId = searchParams.get("sellerId") ? Number.parseInt(searchParams.get("sellerId")!) : undefined
    const featured =
      searchParams.get("featured") === "true" ? true : searchParams.get("featured") === "false" ? false : undefined
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const skip = (page - 1) * limit

    // Build where clause based on filters
    const where: any = {}

    if (search) {
      where.OR = [{ title: { contains: search } }, { description: { contains: search } }]
    }

    if (status) {
      where.status = status
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (sellerId) {
      where.sellerId = sellerId
    }

    if (featured !== undefined) {
      where.featured = featured
    }

    // Build orderBy
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
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
            take: 1,
            where: { isMain: true },
          },
          _count: {
            select: {
              reviews: true,
              favorites: true,
              orders: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.listing.count({ where }),
    ])

    return successResponse({
      listings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching listings:", error)
    return errorResponse("Failed to fetch listings", 500)
  }
}

// Admin: Update listing (featured status, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    const body = await request.json()
    const { id, featured, status } = body

    if (!id) {
      return errorResponse("Listing ID is required", 400)
    }

    const listingId = Number.parseInt(id)

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    })

    if (!listing) {
      return errorResponse("Listing not found", 404)
    }

    // Update listing
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        featured: featured !== undefined ? featured : undefined,
        status: status || undefined,
      },
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
      },
    })

    // Notify seller if status changed
    if (status && status !== listing.status) {
      await prisma.notification.create({
        data: {
          userId: listing.sellerId,
          type: "SYSTEM",
          title: "Listing Status Updated",
          message: `Your listing "${listing.title}" status has been updated to ${status} by an admin.`,
        },
      })
    }

    return successResponse(updatedListing, "Listing updated successfully")
  } catch (error) {
    console.error("Error updating listing:", error)
    return errorResponse("Failed to update listing", 500)
  }
}

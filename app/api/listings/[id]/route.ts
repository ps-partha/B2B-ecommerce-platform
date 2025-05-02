import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get listing by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const listingId = Number.parseInt(params.id)

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            isVerified: true,
            sellerRating: true,
            totalSales: true,
            responseRate: true,
            responseTime: true,
            joinedAt: true,
            location: true,
          },
        },
        category: true,
        images: true,
        reviews: {
          include: {
            giver: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
    })

    if (!listing) {
      return errorResponse("Listing not found", 404)
    }

    // Increment view count
    await prisma.listing.update({
      where: { id: listingId },
      data: { views: { increment: 1 } },
    })

    return successResponse(listing)
  } catch (error) {
    console.error("Error fetching listing:", error)
    return errorResponse("Failed to fetch listing", 500)
  }
}

// Update listing
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const listingId = Number.parseInt(params.id)
    const userId = Number.parseInt(session.user.id)

    // Check if listing exists and belongs to the user
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { sellerId: true },
    })

    if (!listing) {
      return errorResponse("Listing not found", 404)
    }

    // Only allow the seller or admin to update the listing
    if (listing.sellerId !== userId && session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", 403)
    }

    const body = await request.json()
    const { title, description, price, categoryId, status, images } = body

    // Update listing
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        title,
        description,
        price,
        categoryId,
        status,
      },
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
        images: true,
      },
    })

    // Update images if provided
    if (images && images.length > 0) {
      // Delete existing images
      await prisma.image.deleteMany({
        where: { listingId },
      })

      // Create new images
      await prisma.image.createMany({
        data: images.map((url: string, index: number) => ({
          url,
          listingId,
          isMain: index === 0, // First image is main
        })),
      })

      // Fetch updated listing with new images
      const listingWithImages = await prisma.listing.findUnique({
        where: { id: listingId },
        include: { images: true },
      })

      return successResponse(listingWithImages, "Listing updated successfully")
    }

    return successResponse(updatedListing, "Listing updated successfully")
  } catch (error) {
    console.error("Error updating listing:", error)
    return errorResponse("Failed to update listing", 500)
  }
}

// Delete listing
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const listingId = Number.parseInt(params.id)
    const userId = Number.parseInt(session.user.id)

    // Check if listing exists and belongs to the user
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { sellerId: true },
    })

    if (!listing) {
      return errorResponse("Listing not found", 404)
    }

    // Only allow the seller or admin to delete the listing
    if (listing.sellerId !== userId && session.user.role !== "ADMIN") {
      return errorResponse("Forbidden", 403)
    }

    // Delete listing (this will cascade delete images due to onDelete: Cascade)
    await prisma.listing.delete({
      where: { id: listingId },
    })

    return successResponse(null, "Listing deleted successfully")
  } catch (error) {
    console.error("Error deleting listing:", error)
    return errorResponse("Failed to delete listing", 500)
  }
}

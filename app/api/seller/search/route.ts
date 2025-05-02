import type { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") || "all" // "listings", "users", "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    if (!query) {
      return errorResponse("Search query is required", 400)
    }

    const results: any = {}
    let total = 0

    if (type === "listings" || type === "all") {
      const listings = await prisma.listing.findMany({
        where: {
          OR: [{ title: { contains: query } }, { description: { contains: query } }],
          status: "ACTIVE",
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
        skip: type === "all" ? 0 : skip,
        take: type === "all" ? 5 : limit,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      })

      const listingsCount = await prisma.listing.count({
        where: {
          OR: [{ title: { contains: query } }, { description: { contains: query } }],
          status: "ACTIVE",
        },
      })

      results.listings = listings

      if (type === "listings") {
        total = listingsCount
      }
    }

    if (type === "users" || type === "all") {
      const users = await prisma.user.findMany({
        where: {
          OR: [{ name: { contains: query } }, { username: { contains: query } }],
        },
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          isVerified: true,
          sellerRating: true,
          bio: true,
          _count: {
            select: {
              listings: true,
              sales: true,
              reviewsReceived: true,
            },
          },
        },
        skip: type === "all" ? 0 : skip,
        take: type === "all" ? 5 : limit,
        orderBy: [{ isVerified: "desc" }, { sellerRating: "desc" }],
      })

      const usersCount = await prisma.user.count({
        where: {
          OR: [{ name: { contains: query } }, { username: { contains: query } }],
        },
      })

      results.users = users

      if (type === "users") {
        total = usersCount
      }
    }

    if (type === "all") {
      // For "all" type, we also search categories
      const categories = await prisma.category.findMany({
        where: {
          OR: [{ name: { contains: query } }, { description: { contains: query } }],
        },
        include: {
          _count: {
            select: { listings: true },
          },
        },
        take: 3,
      })

      results.categories = categories

      // Calculate total for "all" type
      total = (results.listings?.length || 0) + (results.users?.length || 0) + (results.categories?.length || 0)
    }

    return successResponse({
      results,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      query,
      type,
    })
  } catch (error) {
    console.error("Error searching:", error)
    return errorResponse("Failed to search", 500)
  }
}

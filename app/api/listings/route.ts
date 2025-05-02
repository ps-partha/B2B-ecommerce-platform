import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get all listings (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "ACTIVE"
    const sellerId = searchParams.get("sellerId") ? Number.parseInt(searchParams.get("sellerId")!) : undefined
    const featured = searchParams.get("featured") === "true"

    const skip = (page - 1) * limit

    // Build where clause based on filters
    const where: any = {
      status,
    }

    if (category) {
      where.category = {
        slug: category,
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    if (search) {
      where.OR = [{ title: { contains: search } }, { description: { contains: search } }]
    }

    if (sellerId) {
      where.sellerId = sellerId
    }

    if (featured) {
      where.featured = true
    }

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
              sellerRating: true,
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
              favorites: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
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

// Create a new listing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return errorResponse("Unauthorized", 401)
    }

    const userId = Number.parseInt(session.user.id)
    const body = await request.json()
    const { title, description, price, categoryId, images } = body

    // Validate input
    if (!title || !description || !price || !categoryId) {
      return errorResponse("Missing required fields", 400)
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price,
        categoryId,
        sellerId: userId,
        status: "ACTIVE",
        // Create images if provided
        images:
          images && images.length > 0
            ? {
                createMany: {
                  data: images.map((url: string, index: number) => ({
                    url,
                    isMain: index === 0, // First image is main
                  })),
                },
              }
            : undefined,
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

    return successResponse(listing, "Listing created successfully", 201)
  } catch (error) {
    console.error("Error creating listing:", error)
    return errorResponse("Failed to create listing", 500)
  }
}

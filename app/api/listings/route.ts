import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log(session?.user)

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "SELLER") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const sort = searchParams.get("sort") || "newest"

    const skip = (page - 1) * limit

    // Build filter
    const filter: any = {}

    if (search) {
      filter.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status && status !== "all") {
      filter.status = status
    }

    // Build sort
    let orderBy: any = {}
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      case "price_asc":
        orderBy = { price: "asc" }
        break
      case "price_desc":
        orderBy = { price: "desc" }
        break
      case "popular":
        orderBy = { views: "desc" }
        break
      case "newest":
      default:
        orderBy = { createdAt: "desc" }
    }

    // Get listings
    const listings = await prisma.listing.findMany({
      where: filter,
      include: {
        seller: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true,
              },
            },
          },
        },
        category: true,
        images: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    // Get total count
    const total = await prisma.listing.count({
      where: filter,
    })

    return NextResponse.json({
      success: true,
      data: {
        listings,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching admin listings:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch listings" }, { status: 500 })
  }
}

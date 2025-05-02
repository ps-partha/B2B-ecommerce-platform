import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get all users (admin only)
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

    const skip = (page - 1) * limit

    const where = search
      ? {
          OR: [{ name: { contains: search } }, { email: { contains: search } }, { username: { contains: search } }],
        }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          avatar: true,
          role: true,
          isVerified: true,
          joinedAt: true,
          lastActive: true,
          sellerRating: true,
          totalSales: true,
          _count: {
            select: {
              listings: true,
              purchases: true,
              sales: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { joinedAt: "desc" },
      }),
      prisma.user.count({ where }),
    ])

    return successResponse({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return errorResponse("Failed to fetch users", 500)
  }
}

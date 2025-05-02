import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Admin: Get platform statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "all" // "day", "week", "month", "year", "all"

    // Calculate date range based on period
    let startDate: Date | null = null
    const now = new Date()

    if (period === "day") {
      startDate = new Date(now)
      startDate.setHours(0, 0, 0, 0)
    } else if (period === "week") {
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
    } else if (period === "month") {
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 1)
    } else if (period === "year") {
      startDate = new Date(now)
      startDate.setFullYear(now.getFullYear() - 1)
    }

    // Build where clause for date filtering
    const dateFilter = startDate ? { gte: startDate } : undefined

    // Get user stats
    const [totalUsers, newUsers, totalSellers, verifiedSellers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: startDate ? { joinedAt: dateFilter } : undefined,
      }),
      prisma.user.count({
        where: { role: "SELLER" },
      }),
      prisma.user.count({
        where: { role: "SELLER", isVerified: true },
      }),
    ])

    // Get listing stats
    const [totalListings, newListings, activeListings, soldListings] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({
        where: startDate ? { createdAt: dateFilter } : undefined,
      }),
      prisma.listing.count({
        where: { status: "ACTIVE" },
      }),
      prisma.listing.count({
        where: { status: "SOLD" },
      }),
    ])

    // Get order stats
    const [totalOrders, newOrders, completedOrders, pendingOrders, cancelledOrders] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: startDate ? { createdAt: dateFilter } : undefined,
      }),
      prisma.order.count({
        where: { status: "COMPLETED" },
      }),
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      prisma.order.count({
        where: { status: "CANCELLED" },
      }),
    ])

    // Get revenue stats
    const orders = await prisma.order.findMany({
      where: {
        status: "COMPLETED",
        ...(startDate && { completedAt: dateFilter }),
      },
      select: {
        totalAmount: true,
        platformFee: true,
        transactionFee: true,
      },
    })

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)

    const platformFees = orders.reduce((sum, order) => sum + Number(order.platformFee), 0)

    const transactionFees = orders.reduce((sum, order) => sum + Number(order.transactionFee), 0)

    // Get recent activity
    const [recentOrders, recentListings, recentUsers] = await Promise.all([
      prisma.order.findMany({
        where: startDate ? { createdAt: dateFilter } : undefined,
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              images: {
                where: { isMain: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.listing.findMany({
        where: startDate ? { createdAt: dateFilter } : undefined,
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
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.user.findMany({
        where: startDate ? { joinedAt: dateFilter } : undefined,
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          email: true,
          role: true,
          isVerified: true,
          joinedAt: true,
        },
        orderBy: { joinedAt: "desc" },
        take: 10,
      }),
    ])

    return successResponse({
      users: {
        total: totalUsers,
        new: newUsers,
        sellers: totalSellers,
        verifiedSellers,
      },
      listings: {
        total: totalListings,
        new: newListings,
        active: activeListings,
        sold: soldListings,
      },
      orders: {
        total: totalOrders,
        new: newOrders,
        completed: completedOrders,
        pending: pendingOrders,
        cancelled: cancelledOrders,
      },
      revenue: {
        total: totalRevenue,
        platformFees,
        transactionFees,
        net: platformFees + transactionFees,
      },
      recentActivity: {
        orders: recentOrders,
        listings: recentListings,
        users: recentUsers,
      },
      period,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return errorResponse("Failed to fetch admin stats", 500)
  }
}

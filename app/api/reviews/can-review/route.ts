import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return Response.json({ canReview: false, reason: "not_authenticated" }, { status: 200 })
    }

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get("listingId")

    if (!listingId) {
      return Response.json({ canReview: false, reason: "missing_listing_id" }, { status: 200 })
    }

    const userId = Number.parseInt(session.user.id)
    const listingIdNum = Number.parseInt(listingId)

    // Check if user has purchased this product
    const completedOrder = await prisma.order.findFirst({
      where: {
        buyerId: userId,
        listingId: listingIdNum,
        status: "COMPLETED",
      },
    })

    if (!completedOrder) {
      return Response.json({ canReview: false, reason: "no_purchase" }, { status: 200 })
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        giverId: userId,
        listingId: listingIdNum,
      },
    })

    if (existingReview) {
      return Response.json(
        {
          canReview: false,
          reason: "already_reviewed",
          reviewId: existingReview.id,
        },
        { status: 200 },
      )
    }

    // User can review
    return Response.json(
      {
        canReview: true,
        orderId: completedOrder.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error checking review eligibility:", error)
    return Response.json({ canReview: false, reason: "server_error" }, { status: 500 })
  }
}

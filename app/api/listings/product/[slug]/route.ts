import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: Request, { params }: { params: { slug: string } }) {
    try {
        const slug = params.slug

        if (!slug) {
            return NextResponse.json(
                { success: false, message: "Invalid listing slug" },
                { status: 400 }
            )
        }

        const listing = await prisma.listing.findUnique({
            where: { slug },
            include: {
                seller: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                username: true,
                            },
                        },
                    },
                },
                category: true,
                images: true,
                reviews: {
                    include: {
                        giver: {
                            select: {
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    take: 5,
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
            },
        })

        if (!listing) {
            return NextResponse.json(
                { success: false, message: "Listing not found" },
                { status: 404 }
            )
        }

        // Check if the current user has favorited this listing
        const session = await getServerSession(authOptions)
        let isFavorited = false

        if (session?.user?.id) {
            const favorite = await prisma.favorite.findUnique({
                where: {
                    userId_listingId: {
                        userId: parseInt(session.user.id),
                        listingId: listing.id,
                    },
                },
            })
            isFavorited = !!favorite
        }

        // Calculate average rating
        const averageRating = await prisma.review.aggregate({
            where: { listingId: listing.id },
            _avg: { rating: true },
        })

        return NextResponse.json({
            success: true,
            data: {
                ...listing,
                isFavorited,
                averageRating: averageRating._avg.rating || 0,
            },
        })
    } catch (error) {
        console.error("Error fetching listing:", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch listing" },
            { status: 500 }
        )
    }
}

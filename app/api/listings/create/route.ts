import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import {slugify} from "@/lib/utils"

// Function to generate a random alphanumeric string
function generateRandomString(length = 10) {
  return Math.random().toString(36).substring(2, 2 + length)
}

// Function to create a unique slug
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  const exists = await prisma.listing.findFirst({ where: { slug: baseSlug } })
  if (!exists) return baseSlug

  const uniqueSlug = `${baseSlug}-${generateRandomString(10)}`
  return uniqueSlug
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get user and check if they are a seller
    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
      include: { sellerProfile: true },
    })

    if (!user || user.role !== "SELLER" || !user.sellerProfile) {
      return NextResponse.json({ success: false, message: "Only sellers can create listings" }, { status: 403 })
    }

    // Parse request body
    const body = await req.json()
    const {  title, description, price, originalPrice, category, features, productInfo, transferInfo, imageUrls } = body

    // Validate required fields
    if (!title || !description || !price || !category) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Generate base slug (from slug or title)
    const baseSlug = slugify(title)
    const finalSlug = await generateUniqueSlug(baseSlug)

    // Get category ID from slug
    const categoryRecord = await prisma.category.findUnique({
      where: { slug: category },
    })

    if (!categoryRecord) {
      return NextResponse.json({ success: false, message: "Invalid category" }, { status: 400 })
    }

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        slug: finalSlug,
        title,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        categoryId: categoryRecord.id,
        sellerId: user.sellerProfile.id,
        features: features || [],
        productInfo: productInfo || [],
        transferInfo: transferInfo || {},
        status: "ACTIVE",
      },
    })

    // Add images if provided
    if (imageUrls && imageUrls.length > 0) {
      const imagePromises = imageUrls.map((url: string, index: number) =>
        prisma.image.create({
          data: {
            url,
            listingId: listing.id,
            isMain: index === 0, // First image is main
          },
        }),
      )

      await Promise.all(imagePromises)
    }

    // Return success response with created listing
    return NextResponse.json(
      {
        success: true,
        message: "Listing created successfully",
        listing,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ success: false, message: "Failed to create listing" }, { status: 500 })
  }
}

import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // Categories to insert
    const categories = [
      {
        name: "Gaming Accounts",
        slug: "gaming-accounts",
        description: "Buy and sell gaming accounts for popular games",
        icon: "gamepad",
      },
      {
        name: "Social Media Accounts",
        slug: "social-media-accounts",
        description: "Social media accounts with established followers",
        icon: "users",
      },
      {
        name: "Digital Products",
        slug: "digital-products",
        description: "Digital goods including software, ebooks, and more",
        icon: "file",
      },
      {
        name: "Services",
        slug: "services",
        description: "Digital services including design, development, and marketing",
        icon: "briefcase",
      },
      {
        name: "Domains & Websites",
        slug: "domains-websites",
        description: "Established domains and websites for sale",
        icon: "globe",
      },
      {
        name: "Subscriptions",
        slug: "subscriptions",
        description: "Premium subscription accounts for various platforms",
        icon: "credit-card",
      },
      {
        name: "Virtual Items",
        slug: "virtual-items",
        description: "In-game items, skins, and virtual collectibles",
        icon: "package",
      },
      {
        name: "Other",
        slug: "other",
        description: "Other digital products and services",
        icon: "more-horizontal",
      },
    ]

    // Insert categories
    const createdCategories = await Promise.all(
      categories.map((category) =>
        prisma.category.upsert({
          where: { slug: category.slug },
          update: category,
          create: category,
        }),
      ),
    )

    return new Response(
      JSON.stringify({
        success: true,
        message: "Categories seeded successfully",
        data: {
          count: createdCategories.length,
          categories: createdCategories,
        },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Error seeding categories:", error)
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to seed categories",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

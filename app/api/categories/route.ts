import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { listings: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return successResponse(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return errorResponse("Failed to fetch categories", 500)
  }
}

// Create a new category (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    const body = await request.json()
    const { name, description, icon } = body

    // Generate slug from name
    const slug = name.toLowerCase().replace(/\s+/g, "-")

    // Check if category with this name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    })

    if (existingCategory) {
      return errorResponse("Category with this name already exists", 409)
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
      },
    })

    return successResponse(category, "Category created successfully", 201)
  } catch (error) {
    console.error("Error creating category:", error)
    return errorResponse("Failed to create category", 500)
  }
}

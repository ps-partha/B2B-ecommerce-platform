import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/utils/api-response"

// Get category by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryId = Number.parseInt(params.id)

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        listings: {
          where: { status: "ACTIVE" },
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
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { listings: true },
        },
      },
    })

    if (!category) {
      return errorResponse("Category not found", 404)
    }

    return successResponse(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return errorResponse("Failed to fetch category", 500)
  }
}

// Update category (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    const categoryId = Number.parseInt(params.id)
    const body = await request.json()
    const { name, description, icon } = body

    // Generate slug from name if name is provided
    const slug = name ? name.toLowerCase().replace(/\s+/g, "-") : undefined

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!existingCategory) {
      return errorResponse("Category not found", 404)
    }

    // Check if new name/slug would conflict with existing category
    if (name) {
      const conflictingCategory = await prisma.category.findFirst({
        where: {
          OR: [{ name }, { slug: slug }],
          id: { not: categoryId },
        },
      })

      if (conflictingCategory) {
        return errorResponse("Category with this name already exists", 409)
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
        slug,
        description,
        icon,
      },
    })

    return successResponse(updatedCategory, "Category updated successfully")
  } catch (error) {
    console.error("Error updating category:", error)
    return errorResponse("Failed to update category", 500)
  }
}

// Delete category (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return errorResponse("Unauthorized", 403)
    }

    const categoryId = Number.parseInt(params.id)

    // Check if category has listings
    const categoryWithListings = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { listings: true },
        },
      },
    })

    if (!categoryWithListings) {
      return errorResponse("Category not found", 404)
    }

    if (categoryWithListings._count.listings > 0) {
      return errorResponse("Cannot delete category with listings", 400)
    }

    // Delete category
    await prisma.category.delete({
      where: { id: categoryId },
    })

    return successResponse(null, "Category deleted successfully")
  } catch (error) {
    console.error("Error deleting category:", error)
    return errorResponse("Failed to delete category", 500)
  }
}

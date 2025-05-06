import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get the image path from the request
    const { imagePath } = await request.json()

    if (!imagePath) {
      return NextResponse.json({ success: false, message: "Image path is required" }, { status: 400 })
    }

    // Extract the filename from the path
    const filename = imagePath.split("/").pop()

    // Construct the full path to the file
    const fullPath = path.join(process.cwd(), "public", "product_images", filename)

    // Check if the file exists
    if (fs.existsSync(fullPath)) {
      // Delete the file
      fs.unlinkSync(fullPath)
      return NextResponse.json({ success: true, message: "Image deleted successfully" })
    } else {
      // If the file doesn't exist, still return success since the end result is the same
      console.log(`File not found: ${fullPath}`)
      return NextResponse.json({ success: true, message: "Image not found, but operation completed" })
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to delete image" },
      { status: 500 },
    )
  }
}

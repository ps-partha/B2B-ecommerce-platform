import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { v4 as uuidv4 } from "uuid"

// Ensure the upload directory exists
async function ensureDirectoryExists(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true })
  } catch (error) {
    console.error("Error creating directory:", error)
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get the form data
    const formData = await req.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No files provided" }, { status: 400 })
    }

    // Ensure the upload directory exists
    const uploadDir = join(process.cwd(), "public", "product_images")
    await ensureDirectoryExists(uploadDir)

    // Process each file
    const uploadedFiles = []
    for (const file of files) {
      // Generate a unique filename
      const fileExtension = file.name.split(".").pop()
      const uniqueFilename = `${uuidv4()}.${fileExtension}`
      const filePath = join(uploadDir, uniqueFilename)

      // Convert the file to a Buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Write the file to the filesystem
      await writeFile(filePath, buffer)

      // Add the file path to the result
      const publicPath = `/product_images/${uniqueFilename}`
      uploadedFiles.push({
        originalName: file.name,
        filename: uniqueFilename,
        path: publicPath,
        size: file.size,
        type: file.type,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Files uploaded successfully",
      files: uploadedFiles,
    })
  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json({ success: false, message: "Failed to upload files" }, { status: 500 })
  }
}

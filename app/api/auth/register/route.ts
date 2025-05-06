import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, accountType } = body

    if (!name || !email || !password || !accountType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if email is already taken (regardless of role)
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Determine role
    const role = accountType.toUpperCase() // "buyer" -> "BUYER", "admin" -> "ADMIN", etc.

    // Build data object
    const userData: any = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      settings: { create: {} },
    }

    // If seller, attach sellerProfile
    if (role === "SELLER") {
      userData.sellerProfile = { create: {} }
    }

    const user = await prisma.user.create({
      data: userData,
      include: {
        sellerProfile: true,
        settings: true,
      },
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}

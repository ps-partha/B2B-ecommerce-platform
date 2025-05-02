import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, accountType } = body

    // Validate input
    if (!name || !email || !password || !accountType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with appropriate role
    const isSeller = accountType === "seller"
    const role = isSeller ? "SELLER" : "USER"

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        // Create seller profile if user is registering as a seller
        ...(isSeller && {
          sellerProfile: {
            create: {},
          },
        }),
        // Create default settings for user
        settings: {
          create: {},
        },
      },
      include: {
        sellerProfile: true,
        settings: true,
      },
    })

    // Return user without password
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

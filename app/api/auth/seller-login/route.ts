import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find admin by username
    const seller = await prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (!seller) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const validPassword = await bcrypt.compare(password, seller.password);
    const isSeller = seller.role === "SELLER";
    if (!validPassword && !isSeller) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = sign(
      {
        id: seller.id.toString(),
        email: seller.email,
        role: 'SELLER',
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      process.env.JWT_SECRET as string,
      { algorithm: 'HS256' }
    );

    // Set cookie
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set({
      name: "seller_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const tokenData = cookieStore.get("seller_token");

    if (!tokenData?.value) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verify(tokenData.value, process.env.JWT_SECRET as string) as any;
    if (!decoded || decoded.role !== 'SELLER') {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Authenticated",
      user: {
        id: decoded.id,
        email: decoded.email
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Authentication check error:", error); // Log the specific error
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}



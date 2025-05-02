import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/auth/seller/login']

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('seller_token')?.value
  const isLoginPage = req.nextUrl.pathname === '/auth/seller/login'

  // If no token and trying to access protected route
  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/seller/login', req.url))
  }

  // If token exists, validate it
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)

      if (payload.role !== 'SELLER') {
        throw new Error("Invalid role")
      }

      // If already logged in and accessing /auth/seller/login, redirect to dashboard
      if (isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

    } catch (err) {
      console.error("JWT verify error:", err)
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/auth/seller/login', req.url))
    }
  }

  // Allow request to continue
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/seller/login'],
}

import NextAuth, { type AuthOptions, type AdapterUser } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

// Extend AdapterUser, User, and Session to include custom properties
declare module "next-auth" {
  interface AdapterUser {
    avatar?: string | null
  }
  interface User {
    avatar?: string | null
    isSeller?: boolean | null
    sellerProfileId : boolean | null
    isLoggedIn : boolean | null
  }
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      avatar?: string | null
      isLoggedIn?: boolean | null
      isSeller?: boolean | null
      sellerProfileId?: string | null
    }
  }
}

// Define Auth Options
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        // Only allow regular users to login through this flow
        if (!user || !user.password || user.role === "SELLER") return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          profileImage: user.avatar || null,
          isLoggedIn: true,
          isSeller: false,
          sellerProfileId: null,
        }
      },
    }),
  ],

  callbacks: {
    // Handle OAuth Sign-in user creation
    async signIn({ user, account, profile }) {
      if ((account?.provider === "google" || account?.provider === "facebook") && profile?.email) {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: profile.email
          },
        })

        if (!existingUser) {
          // Create new user if they don't exist - always as regular USER
          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name || "user",
              avatar: (profile as any).picture || (profile as any).image?.url || "",
              role: "USER", // Always create as regular user
              emailVerified: null,
              password : null,
              settings: {
                create: {},
              },
            },
          })

          user.id = newUser.id.toString()
          user.name = newUser.name
          user.role = newUser.role
          user.avatar = newUser.avatar
          user.isSeller = false
          user.sellerProfileId = null
        } else {
          // If existing user is a SELLER, prevent login through OAuth
          if (existingUser.role === "SELLER") {
            return false
          }

          user.id = existingUser.id.toString()
          user.name = existingUser.name
          user.role = existingUser.role
          user.avatar = existingUser.avatar
          user.isSeller = false
          user.sellerProfileId = null
        }

        user.isLoggedIn = true
      }
      return true
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.role = user.role
        token.email = user.email
        token.avatar = user.avatar
        token.isLoggedIn = user.isLoggedIn
        token.avatar = user.avatar as string
        token.sellerProfileId = user.sellerProfileId
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.avatar = token.profileImage as string
        session.user.isLoggedIn = token.isLoggedIn as boolean
        session.user.isSeller = token.isSeller as boolean
        session.user.sellerProfileId = token.sellerProfileId as string
      }
      return session
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Add an error page to handle login failures
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.JWT_SECRET!,
}

// NextAuth handler
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

// app/api/auth/[...nextauth]/route.ts

import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Extend NextAuth types to include custom properties
declare module "next-auth" {
  interface User {
    avatar?: string | null;
    isSeller?: boolean | null;
    sellerProfileId?: string | null;
    isLoggedIn?: boolean | null;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      avatar?: string | null;
      isLoggedIn?: boolean | null;
      isSeller?: boolean | null;
      sellerProfileId?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
    isLoggedIn?: boolean | null;
    isSeller?: boolean | null;
    sellerProfileId?: string | null;
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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        console.log(credentials.email)

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
        });

        if (!user || !user.password ) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar || null,
          isLoggedIn: true,
          isSeller: user.role === "SELLER"
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if ((account?.provider === "google" || account?.provider === "facebook") && profile?.email) {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        });

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name || "user",
              avatar: (profile as any).picture || (profile as any).image?.url || "",
              role: "USER",
              emailVerified: null,
              password: null,
              settings: {
                create: {},
              },
            },
          });

          user.id = newUser.id.toString();
          user.name = newUser.name;
          user.role = newUser.role;
          user.avatar = newUser.avatar;
          user.isSeller = false;
          user.sellerProfileId = null;
        } else {
          if (existingUser.role === "SELLER") {
            return false;
          }

          user.id = existingUser.id.toString();
          user.name = existingUser.name;
          user.role = existingUser.role;
          user.avatar = existingUser.avatar;
          user.isSeller = false;
          user.sellerProfileId = null;
        }

        user.isLoggedIn = true;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.email = user.email;
        token.avatar = user.avatar;
        token.isLoggedIn = user.isLoggedIn;
        token.isSeller = user.isSeller;
        token.sellerProfileId = user.sellerProfileId;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.avatar = token.avatar;
        session.user.isLoggedIn = token.isLoggedIn;
        session.user.isSeller = token.isSeller;
        session.user.sellerProfileId = token.sellerProfileId;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.JWT_SECRET!,
};

// NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

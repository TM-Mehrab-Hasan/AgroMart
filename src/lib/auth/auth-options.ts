import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Email/Password Authentication
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        }) as any; // Type assertion to access password field

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated. Please contact support.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image || undefined,
          phone: user.phone || undefined,
          isActive: user.isActive,
          emailVerified: user.emailVerified || undefined,
          phoneVerified: user.phoneVerified,
        };
      },
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.role = user.role;
        token.phone = user.phone;
        token.isActive = user.isActive;
        token.emailVerified = user.emailVerified || undefined;
        token.phoneVerified = user.phoneVerified;
        return token;
      }

      // Return previous token if the access token has not expired yet
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.phone = token.phone as string;
        session.user.isActive = token.isActive as boolean;
        session.user.emailVerified = token.emailVerified as Date;
        session.user.phoneVerified = token.phoneVerified as boolean;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Check if user is active
      if (user && !user.isActive) {
        return false;
      }

      // Handle OAuth sign in
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          // If user doesn't exist, create new user with default role
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                role: UserRole.CUSTOMER, // Default role for OAuth users
                emailVerified: new Date(),
                isActive: true,
              },
            });
          }
        } catch (error) {
          console.error("Error during OAuth sign in:", error);
          return false;
        }
      }

      return true;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      // Log sign in events
      console.log(`User ${user.email} signed in via ${account?.provider}`);
      
      if (isNewUser) {
        // Send welcome notification for new users
        await prisma.notification.create({
          data: {
            userId: user.id!,
            type: "SYSTEM_ANNOUNCEMENT",
            title: "Welcome to AgroMart!",
            message: "Thank you for joining our agricultural marketplace. Start exploring fresh products from local farmers.",
            isRead: false,
          },
        });
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
};
import { UserRole } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: UserRole;
      phone?: string;
      isActive: boolean;
      emailVerified?: Date;
      phoneVerified: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: UserRole;
    phone?: string;
    isActive: boolean;
    emailVerified?: Date;
    phoneVerified: boolean;
    password?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    phone?: string;
    isActive: boolean;
    emailVerified?: Date;
    phoneVerified: boolean;
  }
}
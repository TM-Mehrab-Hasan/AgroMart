import { Request, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { UserRole } from '@prisma/client';

export class AuthController {
  // POST /api/auth/register - Register new user
  static async register(req: Request, res: Response) {
    try {
      const { name, email, phone, password, role } = req.body;

      // Validation
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          message: "Name, email, password, and role are required"
        });
      }

      if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({
          message: "Invalid role specified"
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters long"
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "User with this email already exists"
        });
      }

      // Hash password
      const hashedPassword = await hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone: phone || null,
          password: hashedPassword,
          role: role as UserRole,
          isActive: true,
        } as any, // Type assertion to allow password field
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          isActive: true,
          createdAt: true,
        },
      });

      // Create welcome notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM_ANNOUNCEMENT",
          title: "Welcome to AgroMart! 🌾",
          message: `Hi ${user.name}! Welcome to AgroMart, your agricultural marketplace. Start exploring fresh products from local farmers and producers.`,
          isRead: false,
        },
      });

      return res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }

  // POST /api/auth/login - Login user
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required"
        });
      }

      // Find user with password
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          phone: true,
          isActive: true,
        },
      });

      if (!user || !user.password) {
        return res.status(401).json({
          message: "Invalid credentials"
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          message: "Account is deactivated"
        });
      }

      // Verify password
      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: "Invalid credentials"
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        message: "Login successful",
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }

  // POST /api/auth/logout - Logout user (client-side token removal)
  static async logout(req: Request, res: Response) {
    try {
      // In JWT implementation, logout is typically handled client-side
      // by removing the token from storage
      return res.json({
        message: "Logout successful"
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }

  // GET /api/auth/me - Get current user profile
  static async getProfile(req: Request, res: Response) {
    try {
      // This would typically use the auth middleware to get user from token
      return res.json({
        message: "Profile endpoint - requires authentication middleware"
      });
    } catch (error) {
      console.error("Profile error:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  }
}
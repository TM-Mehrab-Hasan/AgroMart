import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { hash } from 'bcryptjs';
import { AuthenticatedRequest } from '../middleware/auth';

export class UserController {
  // GET /api/users - Get all users (Admin only)
  static async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as any;
      const search = req.query.search as string;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};
      
      if (role) {
        where.role = role;
      }
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Get users with pagination
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            emailVerified: true,
            phoneVerified: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                products: true,
                orders: true,
                reviews: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      return res.json({
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // POST /api/users - Create new user (Admin only)
  static async createUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { 
        name, 
        email, 
        password, 
        phone, 
        role, 
        isActive = true,
        emailVerified = null 
      } = req.body;

      // Validate required fields
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          error: 'Name, email, password, and role are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format'
        });
      }

      // Validate role
      const validRoles = ['ADMIN', 'CUSTOMER', 'SHOP_OWNER', 'SELLER', 'RIDER'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          error: 'Invalid role'
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'User with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await hash(password, 12);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          role,
          isActive,
          emailVerified,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          phoneVerified: true,
          createdAt: true,
        },
      });

      return res.status(201).json({
        message: 'User created successfully',
        user: newUser,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // GET /api/users/:id - Get user by ID
  static async getUserById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Users can only view their own profile unless they're admin
      if (req.user.id !== id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          phoneVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              products: true,
              orders: true,
              reviews: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT /api/users/:id - Update user
  static async updateUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Users can only update their own profile unless they're admin
      if (req.user.id !== id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const { name, phone, image, isActive, role } = req.body;

      // Non-admin users can't change role or isActive status
      const updateData: any = { name, phone, image };
      
      if (req.user.role === 'ADMIN') {
        if (isActive !== undefined) updateData.isActive = isActive;
        if (role !== undefined) updateData.role = role;
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          emailVerified: true,
          phoneVerified: true,
          image: true,
          updatedAt: true,
        },
      });

      return res.json({
        message: 'User updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // DELETE /api/users/:id - Delete user (Admin only)
  static async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Prevent deleting own account
      if (req.user.id === id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      await prisma.user.delete({
        where: { id },
      });

      return res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
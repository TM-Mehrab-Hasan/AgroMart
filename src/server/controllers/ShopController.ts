import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export class ShopController {
  // GET /api/shops - Get shops with filtering and pagination
  static async getAllShops(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const isVerified = req.query.isVerified as string;
      const isActive = req.query.isActive as string;
      const ownerId = req.query.ownerId as string;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (isVerified !== null && isVerified !== undefined) {
        where.isVerified = isVerified === 'true';
      }

      if (isActive !== null && isActive !== undefined) {
        where.isActive = isActive === 'true';
      }

      if (ownerId) {
        where.ownerId = ownerId;
      }

      // Get shops with pagination
      const [shops, total] = await Promise.all([
        prisma.shop.findMany({
          where,
          select: {
            id: true,
            name: true,
            description: true,
            isVerified: true,
            rating: true,
            totalSales: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            address: {
              select: {
                city: true,
                state: true,
                country: true,
              },
            },
            _count: {
              select: {
                products: true,
                reviews: true,
              },
            },
          },
          skip,
          take: limit,
          orderBy: [
            { isVerified: 'desc' },
            { rating: 'desc' },
            { createdAt: 'desc' },
          ],
        }),
        prisma.shop.count({ where }),
      ]);

      return res.json({
        shops,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching shops:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // POST /api/shops - Create new shop
  static async createShop(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Only shop owners can create shops
      if (req.user.role !== 'SHOP_OWNER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          message: 'Only shop owners can create shops'
        });
      }

      const { name, description, addressId } = req.body;

      // Validate required fields
      if (!name || !addressId) {
        return res.status(400).json({
          error: 'Shop name and address are required'
        });
      }

      // Validate address belongs to user
      const address = await prisma.address.findFirst({
        where: {
          id: addressId,
          userId: req.user.id,
        },
      });

      if (!address) {
        return res.status(400).json({
          error: 'Invalid address'
        });
      }

      // Check if user already has a shop (business rule)
      const existingShop = await prisma.shop.findFirst({
        where: {
          ownerId: req.user.id,
        },
      });

      if (existingShop) {
        return res.status(400).json({
          error: 'You already have a shop'
        });
      }

      // Create shop
      const newShop = await prisma.shop.create({
        data: {
          name,
          description,
          ownerId: req.user.id,
          addressId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          isVerified: true,
          rating: true,
          totalSales: true,
          isActive: true,
          createdAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          address: {
            select: {
              name: true,
              addressLine1: true,
              addressLine2: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
            },
          },
        },
      });

      return res.status(201).json({
        message: 'Shop created successfully',
        shop: newShop,
      });
    } catch (error) {
      console.error('Error creating shop:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // GET /api/shops/:id - Get shop by ID
  static async getShopById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const shop = await prisma.shop.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          isVerified: true,
          rating: true,
          totalSales: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          address: {
            select: {
              name: true,
              addressLine1: true,
              addressLine2: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
            },
          },
          _count: {
            select: {
              products: true,
              reviews: true,
            },
          },
        },
      });

      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }

      return res.json(shop);
    } catch (error) {
      console.error('Error fetching shop:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT /api/shops/:id - Update shop
  static async updateShop(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check if shop exists and user has permission
      const shop = await prisma.shop.findUnique({
        where: { id },
        select: { ownerId: true },
      });

      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }

      // Only shop owner or admin can update
      if (shop.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const { name, description, isActive, isVerified } = req.body;

      // Non-admin users can't change verification status
      const updateData: any = { name, description };
      
      if (req.user.role === 'ADMIN') {
        if (isActive !== undefined) updateData.isActive = isActive;
        if (isVerified !== undefined) updateData.isVerified = isVerified;
      }

      const updatedShop = await prisma.shop.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          description: true,
          isVerified: true,
          rating: true,
          totalSales: true,
          isActive: true,
          updatedAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          address: {
            select: {
              name: true,
              addressLine1: true,
              addressLine2: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
            },
          },
        },
      });

      return res.json({
        message: 'Shop updated successfully',
        shop: updatedShop,
      });
    } catch (error) {
      console.error('Error updating shop:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // DELETE /api/shops/:id - Delete shop
  static async deleteShop(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check if shop exists and user has permission
      const shop = await prisma.shop.findUnique({
        where: { id },
        select: { ownerId: true },
      });

      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }

      // Only shop owner or admin can delete
      if (shop.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
      }

      await prisma.shop.delete({
        where: { id },
      });

      return res.json({ message: 'Shop deleted successfully' });
    } catch (error) {
      console.error('Error deleting shop:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
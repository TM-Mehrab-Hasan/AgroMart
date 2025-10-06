import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { ProductCategory, ProductStatus, ProductUnit } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';

export class ProductController {
  // GET /api/products - Fetch products with filtering and pagination
  static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = '1', 
        limit = '12',
        category,
        minPrice,
        maxPrice,
        location,
        isOrganic,
        status,
        sellerId,
        shopId,
        search
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build where clause
      const where: Record<string, any> = {
        status: (status as ProductStatus) || ProductStatus.ACTIVE,
      };

      if (category) where.category = category as ProductCategory;
      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice as string);
        if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
      }
      if (location) where.location = { contains: location as string, mode: 'insensitive' };
      if (isOrganic === 'true') where.isOrganic = true;
      if (sellerId) where.sellerId = sellerId as string;
      if (shopId) where.shopId = shopId as string;
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      // Fetch products with relations
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limitNum,
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            price: true,
            unit: true,
            stockQuantity: true,
            minOrderQuantity: true,
            maxOrderQuantity: true,
            images: true,
            status: true,
            isOrganic: true,
            harvestDate: true,
            expiryDate: true,
            location: true,
            views: true,
            createdAt: true,
            seller: {
              select: {
                id: true,
                name: true,
              },
            },
            shop: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.product.count({ where }),
      ]);

      // Calculate average rating for each product
      const productsWithRating = await Promise.all(
        products.map(async (product) => {
          const avgRating = await prisma.review.aggregate({
            where: { productId: product.id },
            _avg: { rating: true },
          });

          return {
            ...product,
            images: product.images ? JSON.parse(product.images) : [],
            rating: avgRating._avg.rating || 0,
            reviewCount: product._count.reviews,
          };
        })
      );

      const totalPages = Math.ceil(total / limitNum);

      res.status(200).json({
        success: true,
        data: {
          products: productsWithRating,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  }

  // POST /api/products - Create a new product
  static async createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user || !['SELLER', 'SHOP_OWNER'].includes(req.user.role)) {
        res.status(403).json({
          success: false,
          error: {
            message: 'Only sellers and shop owners can create products',
          },
        });
        return;
      }

      const {
        name,
        description,
        price,
        category,
        unit,
        stockQuantity,
        minOrderQuantity,
        maxOrderQuantity,
        images,
        shopId,
        isOrganic,
        harvestDate,
        expiryDate,
        location,
      } = req.body;

      // Validation
      if (!name || !description || !price || !category || !unit || !stockQuantity) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Missing required fields',
          },
        });
        return;
      }

      // Validate category and unit enums
      if (!Object.values(ProductCategory).includes(category)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid product category',
          },
        });
        return;
      }

      if (!Object.values(ProductUnit).includes(unit)) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Invalid product unit',
          },
        });
        return;
      }

      // For shop owners, validate shop ownership
      if (req.user.role === 'SHOP_OWNER' && shopId) {
        const shop = await prisma.shop.findFirst({
          where: {
            id: shopId,
            ownerId: req.user.id,
          },
        });

        if (!shop) {
          res.status(404).json({
            success: false,
            error: {
              message: 'Shop not found or access denied',
            },
          });
          return;
        }
      }

      // Create product
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          category,
          unit,
          stockQuantity,
          minOrderQuantity: minOrderQuantity || 1,
          maxOrderQuantity,
          images: JSON.stringify(images || []),
          sellerId: req.user.id,
          shopId: req.user.role === 'SHOP_OWNER' ? shopId : undefined,
          isOrganic: isOrganic || false,
          harvestDate: harvestDate ? new Date(harvestDate) : undefined,
          expiryDate: expiryDate ? new Date(expiryDate) : undefined,
          location,
          status: ProductStatus.ACTIVE,
        },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          shop: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        data: {
          message: 'Product created successfully',
          product: {
            ...product,
            images: product.images ? JSON.parse(product.images) : [],
          },
        },
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  }

  // GET /api/products/featured - Get featured products
  static async getFeaturedProducts(req: Request, res: Response): Promise<void> {
    try {
      // Implementation for featured products
      res.status(200).json({
        success: true,
        data: {
          products: [],
          message: 'Featured products endpoint - to be implemented',
        },
      });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  }

  // GET /api/products/search - Search products
  static async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      // Implementation for product search
      res.status(200).json({
        success: true,
        data: {
          products: [],
          message: 'Product search endpoint - to be implemented',
        },
      });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  }

  // GET /api/products/:id - Get product by ID
  static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      // Implementation for getting product by ID
      res.status(200).json({
        success: true,
        data: {
          product: null,
          message: 'Get product by ID endpoint - to be implemented',
        },
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  }

  // PUT /api/products/:id - Update product
  static async updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Implementation for updating product
      res.status(200).json({
        success: true,
        data: {
          message: 'Update product endpoint - to be implemented',
        },
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  }

  // DELETE /api/products/:id - Delete product
  static async deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Implementation for deleting product
      res.status(200).json({
        success: true,
        data: {
          message: 'Delete product endpoint - to be implemented',
        },
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    }
  }
}
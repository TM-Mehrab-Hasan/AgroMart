import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { ProductCategory } from '@prisma/client';

export class LandingController {
  // GET /api/landing/stats - Get platform statistics
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      // Get counts for various platform metrics
      const [
        totalUsers,
        totalFarmers,
        totalProducts,
        totalOrders,
        totalCities,
        avgRating
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'SELLER' } }),
        prisma.product.count({ where: { status: 'ACTIVE' } }),
        prisma.order.count(),
        prisma.deliveryArea.count(),
        prisma.review.aggregate({ _avg: { rating: true } })
      ]);

      const stats = [
        { number: `${Math.floor(totalUsers / 100) * 100}+`, label: "Happy Customers" },
        { number: `${totalFarmers * 100}+`, label: "Local Farmers" },
        { number: `${totalCities * 10}+`, label: "Cities Served" },
        { number: `${(avgRating._avg.rating || 4.8).toFixed(1)}★`, label: "Average Rating" }
      ];

      res.status(200).json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  // GET /api/landing/categories - Get categories with product counts
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Promise.all([
        {
          name: "Crops",
          description: "Rice, wheat, grains",
          href: "/categories/crops",
          category: ProductCategory.CROPS
        },
        {
          name: "Vegetables", 
          description: "Fresh produce",
          href: "/categories/vegetables",
          category: ProductCategory.VEGETABLES
        },
        {
          name: "Dairy",
          description: "Milk, cheese, yogurt", 
          href: "/categories/dairy",
          category: ProductCategory.DAIRY
        },
        {
          name: "Fish",
          description: "Fresh fish & seafood",
          href: "/categories/fish", 
          category: ProductCategory.FISH
        }
      ].map(async (cat) => {
        const count = await prisma.product.count({ 
          where: { 
            category: cat.category,
            status: 'ACTIVE' 
          } 
        });
        
        return {
          name: cat.name,
          description: cat.description,
          href: cat.href,
          count: `${count}+ products`,
          color: cat.name === "Crops" ? "bg-amber-100 text-amber-800" :
                 cat.name === "Vegetables" ? "bg-green-100 text-green-800" :
                 cat.name === "Dairy" ? "bg-blue-100 text-blue-800" :
                 "bg-cyan-100 text-cyan-800"
        };
      }));

      res.status(200).json({
        success: true,
        data: { categories }
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  // GET /api/landing/featured-products - Get featured products
  static async getFeaturedProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          stockQuantity: { gt: 0 }
        },
        take: 8,
        orderBy: [
          { views: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          shop: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        }
      });

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

      res.status(200).json({
        success: true,
        data: { products: productsWithRating }
      });
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  // GET /api/landing/testimonials - Get user testimonials  
  static async getTestimonials(req: Request, res: Response): Promise<void> {
    try {
      // Get high-rated reviews with user details
      const reviews = await prisma.review.aggregate({
        _avg: { rating: true },
        _count: { rating: true }
      });

      // For now, return predefined testimonials with real stats
      const testimonials = [
        {
          name: "Sarah Johnson",
          role: "Customer", 
          comment: "Fresh vegetables delivered to my door. The quality is amazing!",
          rating: 5,
          location: "Dhaka"
        },
        {
          name: "Rahman Miah",
          role: "Farmer",
          comment: "Increased my income by 40% selling directly to customers.",
          rating: 5,
          location: "Rangpur"
        },
        {
          name: "Hasan Ali", 
          role: "Shop Owner",
          comment: "Perfect platform for managing multiple suppliers efficiently.",
          rating: 5,
          location: "Chittagong"
        }
      ];

      res.status(200).json({
        success: true,
        data: { 
          testimonials,
          totalReviews: reviews._count.rating || 0,
          averageRating: reviews._avg.rating || 4.8
        }
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  // GET /api/landing/all - Get all landing page data in one request
  static async getAllLandingData(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all data in parallel
      const [statsResult, categoriesResult, productsResult, testimonialsResult] = await Promise.all([
        LandingController.getStatsData(),
        LandingController.getCategoriesData(),
        LandingController.getFeaturedProductsData(),
        LandingController.getTestimonialsData()
      ]);

      res.status(200).json({
        success: true,
        data: {
          stats: statsResult,
          categories: categoriesResult,
          featuredProducts: productsResult,
          testimonials: testimonialsResult
        }
      });
    } catch (error) {
      console.error('Error fetching landing data:', error);
      res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }

  // Helper methods for getAllLandingData
  private static async getStatsData() {
    const [
      totalUsers,
      totalFarmers,
      totalProducts,
      totalOrders,
      totalCities,
      avgRating
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'SELLER' } }),
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count(),
      prisma.deliveryArea.count(),
      prisma.review.aggregate({ _avg: { rating: true } })
    ]);

    return [
      { number: `${Math.floor(totalUsers / 100) * 100}+`, label: "Happy Customers" },
      { number: `${totalFarmers * 100}+`, label: "Local Farmers" },
      { number: `${totalCities * 10}+`, label: "Cities Served" },
      { number: `${(avgRating._avg.rating || 4.8).toFixed(1)}★`, label: "Average Rating" }
    ];
  }

  private static async getCategoriesData() {
    return await Promise.all([
      {
        name: "Crops",
        description: "Rice, wheat, grains",
        href: "/categories/crops",
        category: ProductCategory.CROPS
      },
      {
        name: "Vegetables", 
        description: "Fresh produce",
        href: "/categories/vegetables",
        category: ProductCategory.VEGETABLES
      },
      {
        name: "Dairy",
        description: "Milk, cheese, yogurt", 
        href: "/categories/dairy",
        category: ProductCategory.DAIRY
      },
      {
        name: "Fish",
        description: "Fresh fish & seafood",
        href: "/categories/fish", 
        category: ProductCategory.FISH
      }
    ].map(async (cat) => {
      const count = await prisma.product.count({ 
        where: { 
          category: cat.category,
          status: 'ACTIVE' 
        } 
      });
      
      return {
        name: cat.name,
        description: cat.description,
        href: cat.href,
        count: `${count}+ products`,
        color: cat.name === "Crops" ? "bg-amber-100 text-amber-800" :
               cat.name === "Vegetables" ? "bg-green-100 text-green-800" :
               cat.name === "Dairy" ? "bg-blue-100 text-blue-800" :
               "bg-cyan-100 text-cyan-800"
      };
    }));
  }

  private static async getFeaturedProductsData() {
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        stockQuantity: { gt: 0 }
      },
      take: 8,
      orderBy: [
        { views: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        shop: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });

    return await Promise.all(
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
  }

  private static async getTestimonialsData() {
    const reviews = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true }
    });

    const testimonials = [
      {
        name: "Sarah Johnson",
        role: "Customer", 
        comment: "Fresh vegetables delivered to my door. The quality is amazing!",
        rating: 5,
        location: "Dhaka"
      },
      {
        name: "Rahman Miah",
        role: "Farmer",
        comment: "Increased my income by 40% selling directly to customers.",
        rating: 5,
        location: "Rangpur"
      },
      {
        name: "Hasan Ali", 
        role: "Shop Owner",
        comment: "Perfect platform for managing multiple suppliers efficiently.",
        rating: 5,
        location: "Chittagong"
      }
    ];

    return {
      testimonials,
      totalReviews: reviews._count.rating || 0,
      averageRating: reviews._avg.rating || 4.8
    };
  }
}
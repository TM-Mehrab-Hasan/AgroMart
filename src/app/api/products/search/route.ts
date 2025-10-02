import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

// GET /api/products/search - Search products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    if (!query.trim()) {
      return NextResponse.json({
        products: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
    }

    // Build search conditions
    const searchConditions = {
      AND: [
        { status: ProductStatus.ACTIVE },
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            {
              seller: {
                name: { contains: query, mode: 'insensitive' }
              }
            },
            {
              shop: {
                name: { contains: query, mode: 'insensitive' }
              }
            }
          ]
        }
      ]
    };

    // Fetch search results
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: searchConditions as any,
        skip,
        take: limit,
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
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
        orderBy: [
          { views: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.product.count({ where: searchConditions as any }),
    ]);

    // Calculate average rating for each product
    const productsWithRating = products.map(product => {
      const reviews = (product as any).reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
        : 0;

      return {
        ...product,
        rating: averageRating,
        reviewCount: (product as any)._count?.reviews || 0,
        reviews: undefined,
        _count: undefined,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      query,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
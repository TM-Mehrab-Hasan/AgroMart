import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

// GET /api/products/featured - Get featured products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');

    // Fetch featured products based on views, ratings, and recent orders
    const products = await prisma.product.findMany({
      where: {
        status: ProductStatus.ACTIVE,
        stockQuantity: { gt: 0 },
      },
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
            orderItems: true,
          },
        },
      },
      orderBy: [
        { views: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Calculate metrics and sort by featured score
    const productsWithMetrics = products.map(product => {
      const reviews = (product as any).reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
        : 0;

      const reviewCount = (product as any)._count?.reviews || 0;
      const orderCount = (product as any)._count?.orderItems || 0;

      // Featured score calculation (you can adjust weights)
      const featuredScore = 
        (averageRating * 0.3) + 
        (Math.min(reviewCount / 10, 1) * 0.2) + 
        (Math.min(orderCount / 50, 1) * 0.3) + 
        (Math.min(product.views / 100, 1) * 0.2);

      return {
        ...product,
        rating: averageRating,
        reviewCount,
        orderCount,
        featuredScore,
        reviews: undefined,
        _count: undefined,
      };
    });

    // Sort by featured score and return top products
    const featuredProducts = productsWithMetrics
      .sort((a, b) => b.featuredScore - a.featuredScore)
      .map(({ featuredScore, ...product }) => product);

    return NextResponse.json({
      products: featuredProducts,
      total: featuredProducts.length,
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
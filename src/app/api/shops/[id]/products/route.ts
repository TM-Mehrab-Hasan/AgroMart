import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/shops/[id]/products - Get products for a specific shop
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: shopId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category') as any;
    const status = searchParams.get('status') as any;
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    // Check if shop exists
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        name: true,
        isActive: true,
      },
    });

    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found' },
        { status: 404 }
      );
    }

    // Build where clause
    const where: any = {
      shopId: shopId,
    };

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
          updatedAt: true,
          seller: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              cartItems: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
          averageRating: avgRating._avg.rating || 0,
        };
      })
    );

    return NextResponse.json({
      shop: {
        id: shop.id,
        name: shop.name,
        isActive: shop.isActive,
      },
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
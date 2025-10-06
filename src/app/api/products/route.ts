import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { ProductCategory, ProductStatus, ProductUnit } from "@prisma/client";

// GET /api/products - Fetch products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const category = searchParams.get('category') as ProductCategory | null;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const location = searchParams.get('location');
    const isOrganic = searchParams.get('isOrganic') === 'true';
    const status = searchParams.get('status') as ProductStatus | null;
    const sellerId = searchParams.get('sellerId');
    const shopId = searchParams.get('shopId');
    const search = searchParams.get('search');

    // Build where clause
    const where: {
      status?: ProductStatus;
      category?: ProductCategory;
      price?: { gte?: number; lte?: number };
      location?: { contains: string; mode: 'insensitive' };
      isOrganic?: boolean;
      sellerId?: string;
      shopId?: string;
      OR?: Array<{ name?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>;
    } = {
      status: status || ProductStatus.ACTIVE,
    };

    if (category) where.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (isOrganic) where.isOrganic = true;
    if (sellerId) where.sellerId = sellerId;
    if (shopId) where.shopId = shopId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch products with relations
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
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
          images: true, // Will be parsed as JSON
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
          images: product.images ? JSON.parse(product.images) : [], // Parse images JSON
          rating: avgRating._avg.rating || 0,
          reviewCount: product._count.reviews,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product (Seller/Shop Owner only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['SELLER', 'SHOP_OWNER'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Unauthorized - Only sellers and shop owners can create products' },
        { status: 403 }
      );
    }

    const body = await request.json();
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
    } = body;

    // Validation
    if (!name || !description || !price || !category || !unit || !stockQuantity) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category and unit enums
    if (!Object.values(ProductCategory).includes(category)) {
      return NextResponse.json(
        { message: 'Invalid product category' },
        { status: 400 }
      );
    }

    if (!Object.values(ProductUnit).includes(unit)) {
      return NextResponse.json(
        { message: 'Invalid product unit' },
        { status: 400 }
      );
    }

    // For shop owners, validate shop ownership
    if (session.user.role === 'SHOP_OWNER' && shopId) {
      const shop = await prisma.shop.findFirst({
        where: {
          id: shopId,
          ownerId: session.user.id,
        },
      });

      if (!shop) {
        return NextResponse.json(
          { message: 'Shop not found or access denied' },
          { status: 404 }
        );
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
        images: JSON.stringify(images || []), // Store as JSON string
        sellerId: session.user.id,
        shopId: session.user.role === 'SHOP_OWNER' ? shopId : undefined,
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

    return NextResponse.json(
      {
        message: 'Product created successfully',
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
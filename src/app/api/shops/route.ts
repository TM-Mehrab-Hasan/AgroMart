import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// GET /api/shops - Get shops with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const isVerified = searchParams.get('isVerified');
    const isActive = searchParams.get('isActive');
    const ownerId = searchParams.get('ownerId');
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

    return NextResponse.json({
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
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/shops - Create new shop
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only shop owners can create shops
    if (session.user.role !== 'SHOP_OWNER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Only shop owners can create shops' },
        { status: 403 }
      );
    }

    const {
      name,
      description,
      addressId,
    } = await request.json();

    // Validate required fields
    if (!name || !addressId) {
      return NextResponse.json(
        { error: 'Shop name and address are required' },
        { status: 400 }
      );
    }

    // Validate address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: 'Invalid address' },
        { status: 400 }
      );
    }

    // Check if user already has a shop (business rule)
    const existingShop = await prisma.shop.findFirst({
      where: {
        ownerId: session.user.id,
      },
    });

    if (existingShop) {
      return NextResponse.json(
        { error: 'You already have a shop' },
        { status: 400 }
      );
    }

    // Create shop
    const newShop = await prisma.shop.create({
      data: {
        name,
        description,
        ownerId: session.user.id,
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

    return NextResponse.json({
      message: 'Shop created successfully',
      shop: newShop,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
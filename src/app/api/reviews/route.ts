import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// GET /api/reviews - Get reviews with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const productId = searchParams.get("productId");
    const shopId = searchParams.get("shopId");
    const riderId = searchParams.get("riderId");
    const customerId = searchParams.get("customerId");
    const rating = searchParams.get("rating");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, any> = {};
    
    if (productId) where.productId = productId;
    if (shopId) where.shopId = shopId;
    if (riderId) where.riderId = riderId;
    if (customerId) where.customerId = customerId;
    if (rating) where.rating = parseInt(rating);

    // Get reviews with pagination
    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              images: true,
            },
          },
          shop: {
            select: {
              id: true,
              name: true,
            },
          },
          rider: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(totalReviews / limit);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total: totalReviews,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      orderId,
      productId,
      shopId,
      riderId,
      rating,
      comment,
    } = await request.json();

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating is required and must be between 1 and 5" },
        { status: 400 }
      );
    }

    // At least one target (product, shop, or rider) must be specified
    if (!productId && !shopId && !riderId) {
      return NextResponse.json(
        { message: "Must specify productId, shopId, or riderId to review" },
        { status: 400 }
      );
    }

    // Verify the order belongs to the user if orderId is provided
    if (orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
          customerId: session.user.id,
        },
      });

      if (!order) {
        return NextResponse.json(
          { message: "Order not found or doesn't belong to you" },
          { status: 404 }
        );
      }
    }

    // Check if user already reviewed this item
    const existingReview = await prisma.review.findFirst({
      where: {
        customerId: session.user.id,
        ...(productId && { productId }),
        ...(shopId && { shopId }),
        ...(riderId && { riderId }),
        ...(orderId && { orderId }),
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "You have already reviewed this item" },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        customerId: session.user.id,
        orderId: orderId || undefined,
        productId: productId || undefined,
        shopId: shopId || undefined,
        riderId: riderId || undefined,
        rating,
        comment: comment || undefined,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
          },
        },
        rider: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Review created successfully",
      review,
    }, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
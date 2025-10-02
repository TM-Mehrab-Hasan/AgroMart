import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/shops/[shopId] - Get reviews for a specific shop
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    const { shopId } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const rating = searchParams.get("rating");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, any> = { shopId };
    if (rating) where.rating = parseInt(rating);

    // Verify shop exists
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        name: true,
        description: true,
        isVerified: true,
        rating: true,
      },
    });

    if (!shop) {
      return NextResponse.json(
        { message: "Shop not found" },
        { status: 404 }
      );
    }

    // Get reviews with pagination
    const [reviews, totalReviews, ratingStats] = await Promise.all([
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
      // Get rating statistics
      prisma.review.groupBy({
        by: ['rating'],
        where: { shopId },
        _count: {
          rating: true,
        },
      }),
    ]);

    // Calculate average rating
    const averageRating = await prisma.review.aggregate({
      where: { shopId },
      _avg: { rating: true },
    });

    // Format rating distribution
    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratingStats.forEach(stat => {
      ratingDistribution[stat.rating as keyof typeof ratingDistribution] = stat._count.rating;
    });

    const totalPages = Math.ceil(totalReviews / limit);

    return NextResponse.json({
      shop,
      reviews,
      statistics: {
        totalReviews,
        averageRating: averageRating._avg.rating || 0,
        ratingDistribution,
      },
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
    console.error("Get shop reviews error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
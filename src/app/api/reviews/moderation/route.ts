import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/moderation - Get reviews for moderation (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const filter = searchParams.get("filter") || "all"; // all, flagged, recent
    const skip = (page - 1) * limit;

    // Build where clause based on filter
    let where: Record<string, any> = {};
    let orderBy: Record<string, any> = { createdAt: 'desc' };

    switch (filter) {
      case "flagged":
        // Reviews with rating 1-2 (potentially problematic)
        where.rating = { lte: 2 };
        break;
      case "recent":
        // Reviews from last 7 days
        where.createdAt = {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      case "all":
      default:
        // No additional filter
        break;
    }

    // Get reviews for moderation
    const [reviews, totalReviews] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              seller: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          shop: {
            select: {
              id: true,
              name: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          rider: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              status: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(totalReviews / limit);

    // Get moderation statistics
    const stats = await Promise.all([
      prisma.review.count(), // Total reviews
      prisma.review.count({ where: { rating: { lte: 2 } } }), // Low-rated reviews
      prisma.review.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }), // Recent reviews (last 7 days)
    ]);

    return NextResponse.json({
      reviews,
      statistics: {
        totalReviews: stats[0],
        flaggedReviews: stats[1],
        recentReviews: stats[2],
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
    console.error("Get reviews for moderation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/reviews/moderation - Bulk actions on reviews (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { action, reviewIds } = await request.json();

    if (!action || !reviewIds || !Array.isArray(reviewIds)) {
      return NextResponse.json(
        { message: "Action and reviewIds array are required" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "delete":
        result = await prisma.review.deleteMany({
          where: {
            id: {
              in: reviewIds,
            },
          },
        });
        break;
      
      default:
        return NextResponse.json(
          { message: "Invalid action. Supported actions: delete" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `Successfully ${action}d ${result.count} reviews`,
      affectedCount: result.count,
    });
  } catch (error) {
    console.error("Bulk review moderation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
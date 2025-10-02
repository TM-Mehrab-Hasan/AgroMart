import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/analytics - Get review analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admin and shop owners can access analytics
    if (!session?.user || !["ADMIN", "SHOP_OWNER", "SELLER"].includes(session.user.role)) {
      return NextResponse.json(
        { message: "Unauthorized - Admin, Shop Owner, or Seller access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const shopId = searchParams.get("shopId");
    const riderId = searchParams.get("riderId");

    // Build where clause based on user role and filters
    let where: Record<string, any> = {};
    
    if (session.user.role === "SHOP_OWNER") {
      // Shop owners can only see their shop's reviews
      const userShop = await prisma.shop.findFirst({
        where: { ownerId: session.user.id },
        select: { id: true },
      });
      
      if (!userShop) {
        return NextResponse.json(
          { message: "Shop not found" },
          { status: 404 }
        );
      }
      
      where.shopId = userShop.id;
    } else if (session.user.role === "SELLER") {
      // Sellers can only see reviews for their products
      where.product = {
        sellerId: session.user.id,
      };
    }

    // Apply additional filters
    if (productId) where.productId = productId;
    if (shopId && session.user.role === "ADMIN") where.shopId = shopId;
    if (riderId && session.user.role === "ADMIN") where.riderId = riderId;

    // Get review analytics
    const [
      totalReviews,
      averageRating,
      ratingDistribution,
      recentReviews,
      topRatedProducts,
      bottomRatedProducts,
    ] = await Promise.all([
      // Total reviews count
      prisma.review.count({ where }),
      
      // Average rating
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
      }),
      
      // Rating distribution (1-5 stars)
      Promise.all([
        prisma.review.count({ where: { ...where, rating: 1 } }),
        prisma.review.count({ where: { ...where, rating: 2 } }),
        prisma.review.count({ where: { ...where, rating: 3 } }),
        prisma.review.count({ where: { ...where, rating: 4 } }),
        prisma.review.count({ where: { ...where, rating: 5 } }),
      ]),
      
      // Recent reviews (last 10)
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
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      
      // Top rated products (only if admin or no specific filters)
      session.user.role === "ADMIN" || (!productId && !shopId) 
        ? prisma.product.findMany({
            where: session.user.role === "SELLER" ? { sellerId: session.user.id } : {},
            include: {
              reviews: {
                select: { rating: true },
              },
              _count: {
                select: { reviews: true },
              },
            },
            take: 50, // Get more to filter later
          }).then(products => 
            products
              .filter(product => product._count.reviews >= 3) // At least 3 reviews
              .map(product => ({
                id: product.id,
                name: product.name,
                images: product.images,
                reviewCount: product._count.reviews,
                averageRating: product.reviews.length > 0 
                  ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
                  : 0,
              }))
              .sort((a, b) => b.averageRating - a.averageRating)
              .slice(0, 5) // Top 5
          )
        : [],
      
      // Bottom rated products (only if admin)
      session.user.role === "ADMIN" 
        ? prisma.product.findMany({
            include: {
              reviews: {
                select: { rating: true },
              },
              _count: {
                select: { reviews: true },
              },
            },
            take: 50, // Get more to filter later
          }).then(products => 
            products
              .filter(product => product._count.reviews >= 3) // At least 3 reviews
              .map(product => ({
                id: product.id,
                name: product.name,
                images: product.images,
                reviewCount: product._count.reviews,
                averageRating: product.reviews.length > 0 
                  ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
                  : 0,
              }))
              .sort((a, b) => a.averageRating - b.averageRating)
              .slice(0, 5) // Bottom 5
          )
        : [],
    ]);

    const analytics = {
      totalReviews,
      averageRating: averageRating._avg.rating || 0,
      ratingDistribution: {
        1: ratingDistribution[0],
        2: ratingDistribution[1],
        3: ratingDistribution[2],
        4: ratingDistribution[3],
        5: ratingDistribution[4],
      },
      recentReviews,
      topRatedProducts,
      ...(session.user.role === "ADMIN" && { bottomRatedProducts }),
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Get review analytics error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
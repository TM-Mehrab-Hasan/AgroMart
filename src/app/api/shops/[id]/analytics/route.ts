import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// GET /api/shops/[id]/analytics - Get shop analytics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: shopId } = await params;

    // Check if shop exists and user has access
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found' },
        { status: 404 }
      );
    }

    // Only shop owner or admin can view analytics
    if (session.user.id !== shop.ownerId && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get basic shop stats
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      totalReviews,
      averageRating,
      recentOrders,
      topProducts,
      categoryStats,
      monthlyStats,
    ] = await Promise.all([
      // Total products
      prisma.product.count({
        where: { shopId },
      }),

      // Active products
      prisma.product.count({
        where: {
          shopId,
          status: 'ACTIVE',
        },
      }),

      // Total orders (through order items)
      prisma.orderItem.count({
        where: {
          product: { shopId },
          createdAt: { gte: startDate },
        },
      }),

      // Total revenue
      prisma.orderItem.aggregate({
        where: {
          product: { shopId },
          createdAt: { gte: startDate },
        },
        _sum: { totalPrice: true },
      }),

      // Total reviews
      prisma.review.count({
        where: {
          product: { shopId },
        },
      }),

      // Average rating
      prisma.review.aggregate({
        where: {
          product: { shopId },
        },
        _avg: { rating: true },
      }),

      // Recent orders
      prisma.orderItem.findMany({
        where: {
          product: { shopId },
        },
        select: {
          id: true,
          quantity: true,
          totalPrice: true,
          createdAt: true,
          product: {
            select: {
              name: true,
              images: true,
            },
          },
          order: {
            select: {
              orderNumber: true,
              status: true,
              customer: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Top selling products
      prisma.product.findMany({
        where: { shopId },
        select: {
          id: true,
          name: true,
          images: true,
          price: true,
          _count: {
            select: {
              orderItems: true,
            },
          },
        },
        orderBy: {
          orderItems: {
            _count: 'desc',
          },
        },
        take: 5,
      }),

      // Category-wise product distribution
      prisma.product.groupBy({
        by: ['category'],
        where: { shopId },
        _count: { category: true },
      }),

      // Monthly sales data (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', oi.created_at) as month,
          COUNT(oi.id) as order_count,
          SUM(oi.total_price) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE p.shop_id = ${shopId}
          AND oi.created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', oi.created_at)
        ORDER BY month DESC
      `,
    ]);

    // Product performance (views, cart additions, orders)
    const productPerformance = await prisma.product.findMany({
      where: { shopId },
      select: {
        id: true,
        name: true,
        views: true,
        _count: {
          select: {
            cartItems: true,
            orderItems: true,
          },
        },
      },
      orderBy: { views: 'desc' },
      take: 10,
    });

    const analytics = {
      overview: {
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalReviews,
        averageRating: averageRating._avg.rating || 0,
      },
      recentOrders,
      topProducts,
      categoryStats: categoryStats.map(stat => ({
        category: stat.category,
        count: stat._count.category,
      })),
      monthlyStats,
      productPerformance: productPerformance.map(product => ({
        id: product.id,
        name: product.name,
        views: product.views,
        cartAdditions: product._count.cartItems,
        orders: product._count.orderItems,
        conversionRate: product.views > 0 
          ? ((product._count.orderItems / product.views) * 100).toFixed(2)
          : 0,
      })),
      period: `${days} days`,
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching shop analytics:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
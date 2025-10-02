import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

// GET /api/notifications - Get user's notifications with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const filter = searchParams.get("filter") as 'all' | 'unread' | NotificationType || 'all';
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Record<string, any> = {
      userId: session.user.id,
    };

    if (filter === 'unread') {
      where.isRead = false;
    } else if (filter !== 'all') {
      where.type = filter;
    }

    // Get notifications with pagination
    const [notifications, totalNotifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalNotifications / limit);

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total: totalNotifications,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create a new notification (admin/system only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const {
      userId,
      userIds,
      type,
      title,
      message,
      data,
    } = await request.json();

    // Validate required fields
    if (!title || !message || !type) {
      return NextResponse.json(
        { message: "Title, message, and type are required" },
        { status: 400 }
      );
    }

    let notifications;

    if (userIds && Array.isArray(userIds)) {
      // Bulk notification creation
      const notificationData = userIds.map(id => ({
        userId: id,
        type,
        title,
        message,
        data: data || null,
        isRead: false,
      }));

      notifications = await prisma.notification.createMany({
        data: notificationData,
      });

      return NextResponse.json({
        message: `${notifications.count} notifications created successfully`,
        count: notifications.count,
      });
    } else if (userId) {
      // Single notification creation
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data: data || null,
          isRead: false,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return NextResponse.json({
        message: "Notification created successfully",
        notification,
      });
    } else {
      return NextResponse.json(
        { message: "Either userId or userIds array is required" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Create notification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
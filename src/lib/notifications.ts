import { prisma } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Prisma.InputJsonValue;
}

/**
 * Create a single notification for a user
 */
export async function createNotification(data: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || undefined,
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

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    throw error;
  }
}

/**
 * Create notifications for multiple users
 */
export async function createBulkNotifications(
  userIds: string[],
  notificationData: Omit<CreateNotificationData, 'userId'>
) {
  try {
    const notifications = userIds.map(userId => ({
      userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data || undefined,
      isRead: false,
    }));

    const result = await prisma.notification.createMany({
      data: notifications,
    });

    return result;
  } catch (error) {
    console.error('Failed to create bulk notifications:', error);
    throw error;
  }
}

/**
 * Create notification for order updates
 */
export async function createOrderNotification(
  userId: string,
  orderId: string,
  orderNumber: string,
  status: string
) {
  const statusMessages = {
    PENDING: 'Your order has been placed successfully',
    CONFIRMED: 'Your order has been confirmed by the seller',
    PROCESSING: 'Your order is being prepared for delivery',
    SHIPPED: 'Your order has been shipped',
    DELIVERED: 'Your order has been delivered successfully',
    CANCELLED: 'Your order has been cancelled',
  };

  const message = statusMessages[status as keyof typeof statusMessages] || 
                 `Your order status has been updated to ${status}`;

  return createNotification({
    userId,
    type: 'ORDER_CONFIRMED',
    title: `Order #${orderNumber} ${status}`,
    message,
    data: { orderId, orderNumber, status },
  });
}

/**
 * Create notification for new products
 */
export async function createNewProductNotification(
  userIds: string[],
  productName: string,
  productId: string,
  shopName: string
) {
  return createBulkNotifications(userIds, {
    type: 'NEW_PRODUCT',
    title: 'New Product Available',
    message: `${productName} is now available at ${shopName}`,
    data: { productId, productName, shopName },
  });
}

/**
 * Create notification for low stock alert (for sellers)
 */
export async function createLowStockNotification(
  userId: string,
  productName: string,
  productId: string,
  currentStock: number
) {
  return createNotification({
    userId,
    type: 'STOCK_LOW',
    title: 'Low Stock Alert',
    message: `${productName} is running low with only ${currentStock} items left`,
    data: { productId, productName, currentStock },
  });
}

/**
 * Create welcome notification for new users
 */
export async function createWelcomeNotification(userId: string, userName: string) {
  return createNotification({
    userId,
    type: 'SYSTEM_ANNOUNCEMENT',
    title: 'Welcome to AgroMart! 🌾',
    message: `Hi ${userName}! Welcome to AgroMart, your agricultural marketplace. Start exploring fresh products from local farmers and producers.`,
    data: { isWelcome: true },
  });
}

/**
 * Create system announcement for all users
 */
export async function createSystemAnnouncement(
  title: string,
  message: string,
  data?: any
) {
  // Get all active users
  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true },
  });

  const userIds = users.map(user => user.id);

  return createBulkNotifications(userIds, {
    type: 'SYSTEM_ANNOUNCEMENT',
    title,
    message,
    data,
  });
}

/**
 * Get unread notifications count for a user
 */
export async function getUnreadNotificationsCount(userId: string): Promise<number> {
  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
    return count;
  } catch (error) {
    console.error('Failed to get unread notifications count:', error);
    return 0;
  }
}
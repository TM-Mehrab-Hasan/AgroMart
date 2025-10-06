import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { OrderStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';

export class OrderController {
  // GET /api/orders - Get user's orders or all orders (admin)
  static async getAllOrders(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as OrderStatus | null;
      const skip = (page - 1) * limit;

      // Build where clause based on user role
      const where: Record<string, any> = {};
      
      if (req.user.role === 'ADMIN') {
        // Admin can see all orders
        if (status) {
          where.status = status;
        }
      } else if (req.user.role === 'SELLER' || req.user.role === 'SHOP_OWNER') {
        // Sellers can see orders for their products
        where.orderItems = {
          some: {
            product: {
              sellerId: req.user.id,
            },
          },
        };
        if (status) {
          where.status = status;
        }
      } else if (req.user.role === 'RIDER') {
        // Riders can see assigned orders
        where.riderId = req.user.id;
        if (status) {
          where.status = status;
        }
      } else {
        // Customers can only see their own orders
        where.customerId = req.user.id;
        if (status) {
          where.status = status;
        }
      }

      // Get orders with pagination
      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where,
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            deliveryFee: true,
            paymentMethod: true,
            paymentStatus: true,
            createdAt: true,
            updatedAt: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            rider: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
            deliveryAddress: {
              select: {
                name: true,
                phone: true,
                addressLine1: true,
                addressLine2: true,
                city: true,
                state: true,
                postalCode: true,
              },
            },
            items: {
              select: {
                id: true,
                quantity: true,
                unitPrice: true,
                totalPrice: true,
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
                    unit: true,
                    seller: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.order.count({ where }),
      ]);

      return res.json({
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // POST /api/orders - Create new order
  static async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Only customers can create orders
      if (req.user.role !== 'CUSTOMER') {
        return res.status(403).json({
          message: 'Only customers can create orders'
        });
      }

      const {
        shippingAddressId,
        paymentMethod,
        orderItems,
        couponCode,
      } = req.body;

      // Validate required fields
      if (!shippingAddressId || !paymentMethod || !orderItems || orderItems.length === 0) {
        return res.status(400).json({
          error: 'Shipping address, payment method, and order items are required'
        });
      }

      // Validate shipping address belongs to user
      const shippingAddress = await prisma.address.findFirst({
        where: {
          id: shippingAddressId,
          userId: req.user.id,
        },
      });

      if (!shippingAddress) {
        return res.status(400).json({
          error: 'Invalid shipping address'
        });
      }

      // Validate and calculate order items
      let totalAmount = 0;
      const validatedOrderItems: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        sellerId: string;
      }> = [];

      for (const item of orderItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            stockQuantity: true,
            minOrderQuantity: true,
            maxOrderQuantity: true,
            status: true,
            sellerId: true,
          },
        });

        if (!product) {
          return res.status(400).json({
            error: `Product ${item.productId} not found`
          });
        }

        if (product.status !== 'ACTIVE') {
          return res.status(400).json({
            error: `Product ${product.name} is not available`
          });
        }

        if (item.quantity > product.stockQuantity) {
          return res.status(400).json({
            error: `Insufficient stock for ${product.name}`
          });
        }

        if (item.quantity < product.minOrderQuantity) {
          return res.status(400).json({
            error: `Minimum order quantity for ${product.name} is ${product.minOrderQuantity}`
          });
        }

        if (product.maxOrderQuantity && item.quantity > product.maxOrderQuantity) {
          return res.status(400).json({
            error: `Maximum order quantity for ${product.name} is ${product.maxOrderQuantity}`
          });
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        validatedOrderItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal,
          sellerId: product.sellerId,
        });
      }

      // Calculate shipping cost (simple logic - can be enhanced)
      const shippingCost = totalAmount > 1000 ? 0 : 50; // Free shipping over 1000
      const finalAmount = totalAmount + shippingCost;

      // Apply coupon if provided
      let couponDiscount = 0;
      if (couponCode) {
        const coupon = await prisma.coupon.findFirst({
          where: {
            code: couponCode,
            isActive: true,
            validUntil: {
              gte: new Date(),
            },
          },
        });

        if (coupon && totalAmount >= (coupon.minOrderValue || 0)) {
          if (coupon.discountType === 'PERCENTAGE') {
            couponDiscount = (totalAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscount) {
              couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
            }
          } else {
            couponDiscount = coupon.discountValue;
          }
        }
      }

      const finalAmountWithDiscount = finalAmount - couponDiscount;

      // Generate order number
      const orderCount = await prisma.order.count();
      const orderNumber = `ORD-${Date.now()}-${(orderCount + 1).toString().padStart(4, '0')}`;

      // Create order with transaction
      const newOrder = await prisma.$transaction(async (tx) => {
        // Create the order
        const order = await tx.order.create({
          data: {
            orderNumber,
            customerId: req.user!.id,
            status: 'PENDING',
            subtotal: totalAmount,
            deliveryFee: shippingCost,
            discount: couponDiscount,
            total: finalAmountWithDiscount,
            paymentMethod,
            paymentStatus: 'PENDING',
            deliveryAddressId: shippingAddressId,
          },
        });

        // Create order items and update stock
        for (const item of validatedOrderItems) {
          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              sellerId: item.sellerId,
            },
          });

          // Update product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Clear cart items for ordered products
        await tx.cartItem.deleteMany({
          where: {
            userId: req.user!.id,
            productId: {
              in: validatedOrderItems.map(item => item.productId),
            },
          },
        });

        return order;
      });

      // Fetch the complete order with related data
      const completeOrder = await prisma.order.findUnique({
        where: { id: newOrder.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  unit: true,
                },
              },
            },
          },
          deliveryAddress: true,
        },
      });

      return res.status(201).json({
        message: 'Order created successfully',
        order: completeOrder,
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // GET /api/orders/:id - Get order by ID
  static async getOrderById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Build where clause based on user role
      const where: any = { id };

      if (req.user.role === 'CUSTOMER') {
        where.customerId = req.user.id;
      } else if (req.user.role === 'SELLER' || req.user.role === 'SHOP_OWNER') {
        where.orderItems = {
          some: {
            product: {
              sellerId: req.user.id,
            },
          },
        };
      } else if (req.user.role === 'RIDER') {
        where.riderId = req.user.id;
      }
      // Admin can access any order (no additional where clause)

      const order = await prisma.order.findFirst({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          rider: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          deliveryAddress: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  unit: true,
                  seller: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT /api/orders/:id - Update order status
  static async updateOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, riderId } = req.body;

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Get order first to check permissions
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: {
                select: { sellerId: true },
              },
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check permissions
      let canUpdate = false;
      if (req.user.role === 'ADMIN') {
        canUpdate = true;
      } else if (req.user.role === 'SELLER' || req.user.role === 'SHOP_OWNER') {
        // Sellers can update orders for their products
        canUpdate = order.items.some(item => item.product.sellerId === req.user!.id);
      } else if (req.user.role === 'RIDER') {
        // Riders can update orders assigned to them
        canUpdate = order.riderId === req.user.id;
      }

      if (!canUpdate) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const updateData: any = {};
      if (status) updateData.status = status;
      if (riderId && req.user.role === 'ADMIN') updateData.riderId = riderId;

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          rider: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          deliveryAddress: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  unit: true,
                },
              },
            },
          },
        },
      });

      return res.json({
        message: 'Order updated successfully',
        order: updatedOrder,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
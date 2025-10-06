import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

// GET /api/orders - Get user's orders or all orders (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as OrderStatus | null;
    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: Record<string, any> = {};
    
    if (session.user.role === 'ADMIN') {
      // Admin can see all orders
      if (status) {
        where.status = status;
      }
    } else if (session.user.role === 'SELLER' || session.user.role === 'SHOP_OWNER') {
      // Sellers can see orders for their products
      where.orderItems = {
        some: {
          product: {
            sellerId: session.user.id,
          },
        },
      };
      if (status) {
        where.status = status;
      }
    } else if (session.user.role === 'RIDER') {
      // Riders can see assigned orders
      where.riderId = session.user.id;
      if (status) {
        where.status = status;
      }
    } else {
      // Customers can only see their own orders
      where.customerId = session.user.id;
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

    return NextResponse.json({
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
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only customers can create orders
    if (session.user.role !== 'CUSTOMER') {
      return NextResponse.json(
        { message: 'Only customers can create orders' },
        { status: 403 }
      );
    }

    const {
      shippingAddressId,
      paymentMethod,
      orderItems,
      couponCode,
    } = await request.json();

    // Validate required fields
    if (!shippingAddressId || !paymentMethod || !orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { error: 'Shipping address, payment method, and order items are required' },
        { status: 400 }
      );
    }

    // Validate shipping address belongs to user
    const shippingAddress = await prisma.address.findFirst({
      where: {
        id: shippingAddressId,
        userId: session.user.id,
      },
    });

    if (!shippingAddress) {
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      );
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
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      if (product.status !== 'ACTIVE') {
        return NextResponse.json(
          { error: `Product ${product.name} is not available` },
          { status: 400 }
        );
      }

      if (item.quantity > product.stockQuantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      if (item.quantity < product.minOrderQuantity) {
        return NextResponse.json(
          { error: `Minimum order quantity for ${product.name} is ${product.minOrderQuantity}` },
          { status: 400 }
        );
      }

      if (product.maxOrderQuantity && item.quantity > product.maxOrderQuantity) {
        return NextResponse.json(
          { error: `Maximum order quantity for ${product.name} is ${product.maxOrderQuantity}` },
          { status: 400 }
        );
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
          customerId: session.user.id,
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
          userId: session.user.id,
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

    return NextResponse.json({
      message: 'Order created successfully',
      order: completeOrder,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
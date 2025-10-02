import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

// GET /api/products/[id] - Get product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
            phone: true,
            createdAt: true,
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
            description: true,
            address: {
              select: {
                addressLine1: true,
                city: true,
                state: true,
              },
            },
          },
        },
        reviews: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            reviews: true,
            orderItems: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const reviews = (product as any).reviews || [];
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
      : 0;

    const productWithRating = {
      ...product,
      rating: averageRating,
      reviewCount: (product as any)._count?.reviews || 0,
      orderCount: (product as any)._count?.orderItems || 0,
      _count: undefined,
    };

    return NextResponse.json({ product: productWithRating });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (Owner only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['SELLER', 'SHOP_OWNER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id: productId } = await params;
    const body = await request.json();
    
    // Check if product exists and user has permission
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        shop: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check ownership permissions
    const isOwner = existingProduct.sellerId === session.user.id;
    const isShopOwner = existingProduct.shop?.ownerId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isShopOwner && !isAdmin) {
      return NextResponse.json(
        { message: 'Access denied - You can only edit your own products' },
        { status: 403 }
      );
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...body,
        harvestDate: body.harvestDate ? new Date(body.harvestDate) : undefined,
        expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
        updatedAt: new Date(),
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (Owner only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['SELLER', 'SHOP_OWNER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { id: productId } = await params;

    // Check if product exists and user has permission
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        shop: true,
        orderItems: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check ownership permissions
    const isOwner = existingProduct.sellerId === session.user.id;
    const isShopOwner = existingProduct.shop?.ownerId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isShopOwner && !isAdmin) {
      return NextResponse.json(
        { message: 'Access denied - You can only delete your own products' },
        { status: 403 }
      );
    }

    // Check if product is in any pending orders
    const pendingOrders = await prisma.orderItem.findMany({
      where: {
        productId: productId,
        order: {
          status: {
            in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY'],
          },
        },
      },
    });

    if (pendingOrders.length > 0) {
      // Soft delete - mark as inactive instead of hard delete
      await prisma.product.update({
        where: { id: productId },
        data: {
          status: ProductStatus.INACTIVE,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: 'Product marked as inactive due to pending orders',
      });
    }

    // Hard delete if no pending orders
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
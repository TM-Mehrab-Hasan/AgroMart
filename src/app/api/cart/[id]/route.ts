import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(
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

    const { quantity }: { quantity: number } = await request.json();
    const { id: cartItemId } = await params;

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Valid quantity is required' },
        { status: 400 }
      );
    }

    // Find the cart item and verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            stockQuantity: true,
            maxOrderQuantity: true,
            minOrderQuantity: true,
            status: true,
          },
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to modify this cart item' },
        { status: 403 }
      );
    }

    // Check product availability
    if (cartItem.product.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Product is no longer available' },
        { status: 400 }
      );
    }

    // Check stock availability
    if (quantity > cartItem.product.stockQuantity) {
      return NextResponse.json(
        { error: `Only ${cartItem.product.stockQuantity} items available in stock` },
        { status: 400 }
      );
    }

    // Check quantity limits
    const maxQuantity = cartItem.product.maxOrderQuantity ?? cartItem.product.stockQuantity;
    if (quantity > maxQuantity) {
      return NextResponse.json(
        { error: `Maximum order quantity is ${maxQuantity}` },
        { status: 400 }
      );
    }

    if (cartItem.product.minOrderQuantity && quantity < cartItem.product.minOrderQuantity) {
      return NextResponse.json(
        { error: `Minimum order quantity is ${cartItem.product.minOrderQuantity}` },
        { status: 400 }
      );
    }

    // Update the cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            unit: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Cart item updated successfully',
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[id] - Remove cart item
export async function DELETE(
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

    const { id: cartItemId } = await params;

    // Find the cart item and verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (cartItem.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this cart item' },
        { status: 403 }
      );
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({
      message: 'Cart item removed successfully',
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
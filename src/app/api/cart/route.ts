import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { CartItem } from "@prisma/client";

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch cart items with product details
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform cart items for frontend
    const transformedCartItems = cartItems.map((item: any) => ({
      id: item.id,
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      unit: item.product.unit,
      quantity: item.quantity,
      maxQuantity: item.product.maxOrderQuantity || item.product.stockQuantity,
      minQuantity: item.product.minOrderQuantity,
      image: item.product.images[0] || '',
      sellerId: item.product.sellerId,
      sellerName: item.product.seller.name,
      shopId: item.product.shopId,
      shopName: item.product.shop?.name,
      isOrganic: item.product.isOrganic,
      expiryDate: item.product.expiryDate,
      stockQuantity: item.product.stockQuantity,
    }));

    return NextResponse.json({
      cartItems: transformedCartItems,
      totalItems: cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0),
      totalPrice: cartItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0),
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId, quantity }: { productId: string; quantity: number } = await request.json();

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'Product ID and valid quantity are required' },
        { status: 400 }
      );
    }

    // Check if product exists and get its details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        maxOrderQuantity: true,
        minOrderQuantity: true,
        status: true,
        sellerId: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Product is not available' },
        { status: 400 }
      );
    }

    // Prevent users from adding their own products to cart
    if (product.sellerId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot add your own products to cart' },
        { status: 400 }
      );
    }

    // Check stock availability
    if (quantity > product.stockQuantity) {
      return NextResponse.json(
        { error: `Only ${product.stockQuantity} items available in stock` },
        { status: 400 }
      );
    }

    // Check quantity limits
    const maxQuantity = product.maxOrderQuantity ?? product.stockQuantity;
    if (quantity > maxQuantity) {
      return NextResponse.json(
        { error: `Maximum order quantity is ${maxQuantity}` },
        { status: 400 }
      );
    }

    if (product.minOrderQuantity && quantity < product.minOrderQuantity) {
      return NextResponse.json(
        { error: `Minimum order quantity is ${product.minOrderQuantity}` },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });

    if (existingCartItem) {
      // Update existing cart item
      const newQuantity = existingCartItem.quantity + quantity;
      
      if (newQuantity > maxQuantity) {
        return NextResponse.json(
          { error: `Cannot add more. Maximum order quantity is ${maxQuantity}` },
          { status: 400 }
        );
      }

      if (newQuantity > product.stockQuantity) {
        return NextResponse.json(
          { error: `Cannot add more. Only ${product.stockQuantity} items available` },
          { status: 400 }
        );
      }

      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
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
        message: 'Cart updated successfully',
        cartItem: updatedCartItem,
      });
    } else {
      // Create new cart item
      const newCartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId: productId,
          quantity: quantity,
        },
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
        message: 'Item added to cart successfully',
        cartItem: newCartItem,
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear all cart items
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
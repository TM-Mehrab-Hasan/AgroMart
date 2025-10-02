import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// GET /api/shops/[id] - Get specific shop details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: shopId } = await params;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        name: true,
        description: true,
        isVerified: true,
        rating: true,
        totalSales: true,
        commission: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        address: {
          select: {
            name: true,
            phone: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          },
        },
        _count: {
          select: {
            products: true,
            reviews: true,
          },
        },
      },
    });

    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ shop });
  } catch (error) {
    console.error('Error fetching shop:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/shops/[id] - Update shop
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

    const { id: shopId } = await params;

    // Check if shop exists
    const existingShop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!existingShop) {
      return NextResponse.json(
        { message: 'Shop not found' },
        { status: 404 }
      );
    }

    // Check authorization
    const isOwner = session.user.id === existingShop.ownerId;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { message: 'Forbidden' },
        { status: 403 }
      );
    }

    const {
      name,
      description,
      addressId,
      isVerified,
      isActive,
      commission,
    } = await request.json();

    // Build update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    // Only owners can update basic info and address
    if (isOwner) {
      if (addressId !== undefined) {
        // Validate address belongs to owner
        const address = await prisma.address.findFirst({
          where: {
            id: addressId,
            userId: session.user.id,
          },
        });

        if (!address) {
          return NextResponse.json(
            { error: 'Invalid address' },
            { status: 400 }
          );
        }

        updateData.addressId = addressId;
      }
    }

    // Only admin can update verification status, active status, and commission
    if (isAdmin) {
      if (isVerified !== undefined) updateData.isVerified = isVerified;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (commission !== undefined) updateData.commission = commission;
    }

    // Update shop
    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        isVerified: true,
        rating: true,
        totalSales: true,
        commission: true,
        isActive: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: {
          select: {
            name: true,
            addressLine1: true,
            addressLine2: true,
            city: true,
            state: true,
            postalCode: true,
            country: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Shop updated successfully',
      shop: updatedShop,
    });
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/shops/[id] - Delete shop (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: shopId } = await params;

    // Check if shop exists
    const existingShop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        _count: {
          select: {
            products: true,
            reviews: true,
          },
        },
      },
    });

    if (!existingShop) {
      return NextResponse.json(
        { message: 'Shop not found' },
        { status: 404 }
      );
    }

    // Check if shop has associated data
    if (existingShop._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete shop with existing products. Deactivate instead.' },
        { status: 400 }
      );
    }

    // Delete shop
    await prisma.shop.delete({
      where: { id: shopId },
    });

    return NextResponse.json({
      message: 'Shop deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
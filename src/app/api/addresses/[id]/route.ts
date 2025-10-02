import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// GET /api/addresses/[id] - Get specific address
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

    const { id: addressId } = await params;

    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!address) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/addresses/[id] - Update address
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

    const { id: addressId } = await params;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      );
    }

    const {
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = await request.json();

    // Build update data
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (addressLine1 !== undefined) updateData.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (country !== undefined) updateData.country = country;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    // If setting as default, unset other default addresses
    if (isDefault && !existingAddress.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
          id: { not: addressId },
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: updateData,
      select: {
        id: true,
        name: true,
        phone: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        isDefault: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: 'Address updated successfully',
      address: updatedAddress,
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/addresses/[id] - Delete address
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

    const { id: addressId } = await params;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            orders: true,
            shops: true,
          },
        },
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      );
    }

    // Check if address is being used in orders or shops
    if (existingAddress._count.orders > 0) {
      return NextResponse.json(
        { error: 'Cannot delete address that has been used in orders' },
        { status: 400 }
      );
    }

    if (existingAddress._count.shops > 0) {
      return NextResponse.json(
        { error: 'Cannot delete address that is associated with shops' },
        { status: 400 }
      );
    }

    // Delete address
    await prisma.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default, set another address as default
    if (existingAddress.isDefault) {
      const otherAddress = await prisma.address.findFirst({
        where: {
          userId: session.user.id,
        },
        orderBy: { createdAt: 'asc' },
      });

      if (otherAddress) {
        await prisma.address.update({
          where: { id: otherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({
      message: 'Address deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
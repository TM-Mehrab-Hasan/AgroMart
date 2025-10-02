import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// POST /api/addresses/[id]/set-default - Set address as default
export async function POST(
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

    // If already default, no action needed
    if (existingAddress.isDefault) {
      return NextResponse.json({
        message: 'Address is already default',
        address: existingAddress,
      });
    }

    // Use transaction to update default status
    await prisma.$transaction(async (tx) => {
      // Unset current default addresses
      await tx.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });

      // Set new default address
      await tx.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    });

    // Fetch updated address
    const updatedAddress = await prisma.address.findUnique({
      where: { id: addressId },
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
      message: 'Default address updated successfully',
      address: updatedAddress,
    });
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
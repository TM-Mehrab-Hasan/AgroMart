import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// GET /api/addresses - Get user's addresses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: {
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
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/addresses - Create new address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
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
      country = 'Bangladesh',
      isDefault = false,
    } = await request.json();

    // Validate required fields
    if (!name || !phone || !addressLine1 || !city || !state || !postalCode) {
      return NextResponse.json(
        { error: 'Name, phone, address line 1, city, state, and postal code are required' },
        { status: 400 }
      );
    }

    // If this is being set as default, unset other default addresses
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // Create new address
    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        name,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        isDefault,
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
      },
    });

    return NextResponse.json({
      message: 'Address created successfully',
      address: newAddress,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
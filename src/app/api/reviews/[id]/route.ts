import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// GET /api/reviews/[id] - Get specific review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
          },
        },
        rider: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Get review error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/reviews/[id] - Update review (only by the review author)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { rating, comment } = await request.json();

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify review exists and belongs to user
    const existingReview = await prisma.review.findFirst({
      where: {
        id,
        customerId: session.user.id,
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { message: "Review not found or you don't have permission to edit it" },
        { status: 404 }
      );
    }

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(rating !== undefined && { rating }),
        ...(comment !== undefined && { comment }),
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
          },
        },
        rider: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - Delete review (only by the review author or admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify review exists and user has permission
    const existingReview = await prisma.review.findUnique({
      where: { id },
      include: {
        customer: {
          select: { id: true },
        },
      },
    });

    if (!existingReview) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    // Check if user is the review author or admin
    const canDelete = existingReview.customerId === session.user.id || session.user.role === "ADMIN";
    
    if (!canDelete) {
      return NextResponse.json(
        { message: "You don't have permission to delete this review" },
        { status: 403 }
      );
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
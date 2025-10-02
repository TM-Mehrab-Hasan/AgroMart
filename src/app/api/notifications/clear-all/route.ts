import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

// DELETE /api/notifications/clear-all - Clear all user notifications
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: `${result.count} notifications cleared`,
      count: result.count,
    });
  } catch (error) {
    console.error("Clear all notifications error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
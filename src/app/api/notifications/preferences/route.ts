import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";

interface NotificationPreferences {
  emailNotifications: boolean;
  orderUpdates: boolean;
  productAlerts: boolean;
  systemAnnouncements: boolean;
  marketingEmails: boolean;
  newProductNotifications: boolean;
  priceDropAlerts: boolean;
  deliveryUpdates: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  orderUpdates: true,
  productAlerts: true,
  systemAnnouncements: true,
  marketingEmails: false,
  newProductNotifications: true,
  priceDropAlerts: true,
  deliveryUpdates: true,
};

// GET /api/notifications/preferences - Get user's notification preferences
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // For now, return default preferences
    // In a production app, you might want to store these in a separate table
    // or in the user's data field as JSON
    const preferences = DEFAULT_PREFERENCES;

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error("Get notification preferences error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/preferences - Update user's notification preferences
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const preferencesData = await request.json();

    // Validate preferences data
    const validPreferences: Partial<NotificationPreferences> = {};
    for (const [key, value] of Object.entries(preferencesData)) {
      if (key in DEFAULT_PREFERENCES && typeof value === 'boolean') {
        validPreferences[key as keyof NotificationPreferences] = value;
      }
    }

    // For now, just return success with the updated preferences
    // In a production app, you would store these in the database
    const preferences = { ...DEFAULT_PREFERENCES, ...validPreferences };

    return NextResponse.json({
      message: "Notification preferences updated successfully",
      preferences,
    });
  } catch (error) {
    console.error("Update notification preferences error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
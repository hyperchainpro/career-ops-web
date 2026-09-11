import { NextRequest, NextResponse } from "next/server";
import { db, isDbAvailable } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 15;

// GET /api/profile — Get current user's full profile (including CV text)
export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        headline: true,
        location: true,
        bio: true,
        cvText: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get profile" },
      { status: 500 }
    );
  }
}

// PUT /api/profile — Update user profile (CV text, headline, location, bio)
export async function PUT(request: NextRequest) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Build update data (only allow specific fields)
    const updateData: any = {};
    const allowedFields = ["headline", "location", "bio", "cvText", "name"];

    for (const field of allowedFields) {
      if (field in body) {
        // Validate cvText length (max 50000 chars)
        if (field === "cvText" && body[field] && body[field].length > 50000) {
          return NextResponse.json(
            { success: false, error: "CV text too long (max 50,000 characters)" },
            { status: 400 }
          );
        }
        updateData[field] = body[field] || null;
      }
    }

    const updatedUser = await db.user.update({
      where: { id: sessionUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        headline: true,
        location: true,
        bio: true,
        cvText: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

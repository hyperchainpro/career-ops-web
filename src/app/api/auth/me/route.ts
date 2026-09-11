import { NextResponse } from "next/server";
import { getCurrentUserWithCV } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 10;

// GET /api/auth/me — Check if user is logged in + get profile
export async function GET() {
  try {
    const user = await getCurrentUserWithCV();

    if (!user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        headline: user.headline,
        location: user.location,
        bio: user.bio,
        hasCV: !!user.cvText && user.cvText.length > 50,
        cvLength: user.cvText?.length || 0,
      },
    });
  } catch (error) {
    console.error("Auth/me error:", error);
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        user: null,
        error: "Failed to check session",
      },
      { status: 500 }
    );
  }
}

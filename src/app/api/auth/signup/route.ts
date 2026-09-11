import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb, isDbAvailable } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 30;

// POST /api/auth/signup — Register new user (no email verification)
export async function POST(request: NextRequest) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const db = getDb();
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully! You can now sign in.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Signup failed",
      },
      { status: 500 }
    );
  }
}

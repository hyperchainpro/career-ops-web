import { NextRequest, NextResponse } from "next/server";
import { db, cleanupOldRecords, isDbAvailable } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 30;

// GET /api/applications — List user's job applications (requires auth)
// Query params: status, search, limit, offset
export async function GET(request: NextRequest) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to view your applications" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = { userId: user.id };
    if (status && status !== "all") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { jobTitle: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { jobLocation: { contains: search, mode: "insensitive" } },
      ];
    }

    const [applications, total] = await Promise.all([
      db.jobApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      db.jobApplication.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: applications, total, limit, offset });
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Database error" },
      { status: 500 }
    );
  }
}

// POST /api/applications — Create a new job application (requires auth)
export async function POST(request: NextRequest) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Please sign in to save applications" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobTitle, companyName, jobUrl } = body;
    if (!jobTitle || !companyName || !jobUrl) {
      return NextResponse.json(
        { success: false, error: "Required fields: jobTitle, companyName, jobUrl" },
        { status: 400 }
      );
    }

    let cleanupResult = null;
    try {
      cleanupResult = await cleanupOldRecords(30);
    } catch (e) {
      console.warn("Auto-cleanup failed:", e);
    }

    const application = await db.jobApplication.create({
      data: {
        userId: user.id,
        jobTitle,
        companyName,
        jobUrl,
        jobLocation: body.jobLocation || null,
        jobCountry: body.jobCountry || null,
        jobLevel: body.jobLevel || null,
        jobType: body.jobType || null,
        jobSource: body.jobSource || "manual",
        jobCategory: body.jobCategory || null,
        matchScore: body.matchScore || null,
        evaluation: body.evaluation || null,
        coverLetter: body.coverLetter || null,
        status: body.status || "to_apply",
        appliedAt: body.appliedAt || null,
        interviewDate: body.interviewDate || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json({ success: true, data: application, cleanup: cleanupResult });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Database error" },
      { status: 500 }
    );
  }
}

// DELETE /api/applications — Delete all (or by status)
export async function DELETE(request: NextRequest) {
  if (!isDbAvailable()) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Please sign in" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const olderThanDays = searchParams.get("olderThanDays");

    if (olderThanDays) {
      const result = await cleanupOldRecords(parseInt(olderThanDays));
      return NextResponse.json({ success: true, deleted: result });
    }

    const where: any = { userId: user.id };
    if (status && status !== "all") {
      where.status = status;
    }

    const result = await db.jobApplication.deleteMany({ where });
    return NextResponse.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Database error" },
      { status: 500 }
    );
  }
}

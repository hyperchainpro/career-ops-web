import { NextRequest, NextResponse } from "next/server";
import { db, cleanupOldRecords, isDbAvailable } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 30;

// GET /api/applications — List all job applications
// Query params: status, search, limit, offset
export async function GET(request: NextRequest) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = {};
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

    return NextResponse.json({
      success: true,
      data: applications,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database error",
      },
      { status: 500 }
    );
  }
}

// POST /api/applications — Create a new job application
// Auto-runs cleanup of records >30 days on each POST
export async function POST(request: NextRequest) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    const { jobTitle, companyName, jobUrl } = body;
    if (!jobTitle || !companyName || !jobUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Required fields: jobTitle, companyName, jobUrl",
        },
        { status: 400 }
      );
    }

    // Auto-cleanup old records before insert (non-blocking, best-effort)
    let cleanupResult = null;
    try {
      cleanupResult = await cleanupOldRecords(30);
    } catch (cleanupError) {
      console.warn("Auto-cleanup failed (non-blocking):", cleanupError);
    }

    // Create the application
    const application = await db.jobApplication.create({
      data: {
        jobTitle,
        companyName,
        jobUrl,
        jobLocation: body.jobLocation || null,
        jobLevel: body.jobLevel || null,
        jobType: body.jobType || null,
        jobSource: body.jobSource || "manual",
        matchScore: body.matchScore || null,
        evaluation: body.evaluation || null,
        coverLetter: body.coverLetter || null,
        status: body.status || "to_apply",
        appliedAt: body.appliedAt || null,
        interviewDate: body.interviewDate || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: application,
      cleanup: cleanupResult,
    });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/applications — Delete all (or by status query)
export async function DELETE(request: NextRequest) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const olderThanDays = searchParams.get("olderThanDays");

    // If olderThanDays, do bulk cleanup
    if (olderThanDays) {
      const days = parseInt(olderThanDays);
      const result = await cleanupOldRecords(days);
      return NextResponse.json({
        success: true,
        message: `Cleaned up records older than ${days} days`,
        deleted: result,
      });
    }

    // Otherwise delete by status (or all if no filter)
    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const result = await db.jobApplication.deleteMany({ where });

    return NextResponse.json({
      success: true,
      deleted: result.count,
    });
  } catch (error) {
    console.error("DELETE /api/applications error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database error",
      },
      { status: 500 }
    );
  }
}

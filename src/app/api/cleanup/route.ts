import { NextResponse } from "next/server";
import { cleanupOldRecords, isDbAvailable } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 30;

// POST /api/cleanup — Manually trigger cleanup of old records
// Body: { daysOld: 30 } (default 30 days)
// Can be called by cron jobs (Vercel Cron) or manually

export async function POST(request: Request) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const daysOld = parseInt(body.daysOld || "30");

    if (daysOld < 1 || daysOld > 365) {
      return NextResponse.json(
        { success: false, error: "daysOld must be between 1 and 365" },
        { status: 400 }
      );
    }

    const result = await cleanupOldRecords(daysOld);

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Deleted records older than ${daysOld} days.`,
      deleted: result,
      threshold: `${daysOld} days`,
      cutoffDate: new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("POST /api/cleanup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Cleanup failed",
      },
      { status: 500 }
    );
  }
}

// GET /api/cleanup — Check what would be deleted (preview)
export async function GET() {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const cutoff30 = new Date();
    cutoff30.setDate(cutoff30.getDate() - 30);

    // Preview what would be deleted (without actually deleting)
    const { db } = await import("@/lib/db");
    const oldApplications = await db.jobApplication.findMany({
      where: {
        createdAt: { lt: cutoff30 },
        status: { notIn: ["interview", "offer"] },
      },
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        createdAt: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      threshold: "30 days",
      cutoffDate: cutoff30.toISOString(),
      wouldDelete: oldApplications.length,
      preview: oldApplications.slice(0, 10), // Show first 10
      note: "Records with status 'interview' or 'offer' are protected from auto-delete",
    });
  } catch (error) {
    console.error("GET /api/cleanup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Preview failed",
      },
      { status: 500 }
    );
  }
}

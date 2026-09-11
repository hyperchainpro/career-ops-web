import { NextResponse } from "next/server";
import { db, isDbAvailable } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 15;

// GET /api/stats — Dashboard statistics
export async function GET() {
  if (!isDbAvailable()) {
    return NextResponse.json(
      {
        success: false,
        error: "Database not configured",
        // Return mock stats for demo
        data: {
          totalApplications: 0,
          byStatus: {
            to_apply: 0,
            applied: 0,
            interview: 0,
            offer: 0,
            rejected: 0,
          },
          byLevel: { internship: 0, junior: 0, intermediate: 0, senior: 0, unknown: 0 },
          bySource: { greenhouse: 0, manual: 0, linkedin: 0, workable: 0 },
          responseRate: 0,
          interviewRate: 0,
          recentApplications: [],
        },
      },
      { status: 503 }
    );
  }

  try {
    // Get counts by status
    const statusGroups = await db.jobApplication.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const byStatus: Record<string, number> = {
      to_apply: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    for (const group of statusGroups) {
      byStatus[group.status] = group._count.status;
    }

    // Get counts by job level
    const levelGroups = await db.jobApplication.groupBy({
      by: ["jobLevel"],
      _count: { jobLevel: true },
    });

    const byLevel: Record<string, number> = {
      internship: 0,
      junior: 0,
      intermediate: 0,
      senior: 0,
      unknown: 0,
    };
    for (const group of levelGroups) {
      const level = group.jobLevel || "unknown";
      byLevel[level] = (byLevel[level] || 0) + group._count.jobLevel;
    }

    // Get counts by source
    const sourceGroups = await db.jobApplication.groupBy({
      by: ["jobSource"],
      _count: { jobSource: true },
    });

    const bySource: Record<string, number> = {
      greenhouse: 0,
      manual: 0,
      linkedin: 0,
      workable: 0,
    };
    for (const group of sourceGroups) {
      const source = group.jobSource || "manual";
      bySource[source] = (bySource[source] || 0) + group._count.jobSource;
    }

    // Calculate totals
    const totalApplications = Object.values(byStatus).reduce((a, b) => a + b, 0);
    const appliedCount = byStatus.applied + byStatus.interview + byStatus.offer + byStatus.rejected;
    const responseCount = byStatus.interview + byStatus.offer + byStatus.rejected;

    // Calculate rates
    const responseRate = appliedCount > 0 ? Math.round((responseCount / appliedCount) * 100) : 0;
    const interviewRate = appliedCount > 0 ? Math.round((byStatus.interview / appliedCount) * 100) : 0;

    // Get recent applications (last 5)
    const recentApplications = await db.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        jobLevel: true,
        matchScore: true,
        status: true,
        createdAt: true,
      },
    });

    // Get top matching applications (highest matchScore, not yet applied)
    const topMatches = await db.jobApplication.findMany({
      where: { status: "to_apply" },
      orderBy: { matchScore: "desc" },
      take: 5,
      select: {
        id: true,
        jobTitle: true,
        companyName: true,
        jobLevel: true,
        matchScore: true,
        jobUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalApplications,
        byStatus,
        byLevel,
        bySource,
        responseRate,
        interviewRate,
        appliedCount,
        recentApplications,
        topMatches,
      },
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Stats failed",
      },
      { status: 500 }
    );
  }
}

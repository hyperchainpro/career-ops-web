import { NextRequest, NextResponse } from "next/server";
import { db, isDbAvailable } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 30;

// GET /api/applications/[id] — Get single application by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const application = await db.jobApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error("GET /api/applications/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/applications/[id] — Update application (status, notes, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Build update data (only allow specific fields)
    const updateData: any = {};
    const allowedFields = [
      "jobTitle",
      "companyName",
      "jobUrl",
      "jobLocation",
      "jobLevel",
      "jobType",
      "jobSource",
      "matchScore",
      "evaluation",
      "coverLetter",
      "status",
      "appliedAt",
      "interviewDate",
      "notes",
    ];

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    // Auto-set appliedAt when status changes to "applied"
    if (body.status === "applied" && !body.appliedAt) {
      updateData.appliedAt = new Date();
    }

    const application = await db.jobApplication.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error("PUT /api/applications/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/applications/[id] — Delete single application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isDbAvailable()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    await db.jobApplication.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Application deleted",
    });
  } catch (error) {
    console.error("DELETE /api/applications/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database error",
      },
      { status: 500 }
    );
  }
}

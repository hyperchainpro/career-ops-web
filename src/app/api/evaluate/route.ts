import { NextRequest, NextResponse } from "next/server";
import { evaluateJob } from "@/lib/openrouter";
import { buildCvTextForAI } from "@/lib/profile";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, jobUrl, modelId } = body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json(
        { success: false, error: "jobDescription is required" },
        { status: 400 }
      );
    }

    if (jobDescription.length < 100) {
      return NextResponse.json(
        {
          success: false,
          error: "Job description is too short. Please provide at least 100 characters.",
        },
        { status: 400 }
      );
    }

    const cvText = buildCvTextForAI();
    const result = await evaluateJob(cvText, jobDescription, jobUrl, modelId);

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error("Evaluate API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    name: "Career Ops Evaluate API",
    description:
      "Evaluate job descriptions against Febri Rizki's profile using OpenRouter AI",
    usage: {
      method: "POST",
      body: {
        jobDescription: "string (required, min 100 chars)",
        jobUrl: "string (optional)",
        modelId: "string (optional, specific OpenRouter model ID)",
      },
    },
    endpoints: ["/api/evaluate", "/api/cover-letter", "/api/interview", "/api/models"],
  });
}

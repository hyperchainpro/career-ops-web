import { NextRequest, NextResponse } from "next/server";
import { generateInterviewQuestions } from "@/lib/openrouter";
import { buildCvTextForAI } from "@/lib/profile";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, modelId } = body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json(
        { success: false, error: "jobDescription is required" },
        { status: 400 }
      );
    }

    const cvText = buildCvTextForAI();
    const result = await generateInterviewQuestions(
      cvText,
      jobDescription,
      modelId
    );

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error("Interview API error:", error);
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

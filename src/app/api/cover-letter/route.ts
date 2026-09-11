import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetter } from "@/lib/openrouter";
import { getCurrentUserWithCV } from "@/lib/session";
import { buildCvTextForAI } from "@/lib/profile";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, companyName, modelId, cvText: providedCv } = body;

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json(
        { success: false, error: "jobDescription is required" },
        { status: 400 }
      );
    }

    // Get CV text — priority: provided in body > user's saved CV > demo profile
    let cvText = providedCv;

    if (!cvText) {
      const user = await getCurrentUserWithCV();
      if (user?.cvText) {
        cvText = user.cvText;
      }
    }

    if (!cvText || cvText.length < 50) {
      cvText = buildCvTextForAI();
    }

    const result = await generateCoverLetter(
      cvText,
      jobDescription,
      companyName,
      modelId
    );

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error("Cover Letter API error:", error);
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

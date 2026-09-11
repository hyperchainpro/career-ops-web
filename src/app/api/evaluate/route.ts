import { NextRequest, NextResponse } from "next/server";
import { evaluateJob } from "@/lib/openrouter";
import { getCurrentUserWithCV } from "@/lib/session";
import { buildCvTextForAI } from "@/lib/profile";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, jobUrl, modelId, cvText: providedCv } = body;

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

    // Get CV text — priority: provided in body > user's saved CV > Febri's demo profile
    let cvText = providedCv;

    if (!cvText) {
      // Try to get from authenticated user
      const user = await getCurrentUserWithCV();
      if (user?.cvText) {
        cvText = user.cvText;
      }
    }

    // Fallback to demo profile (Febri's) if no CV available
    if (!cvText || cvText.length < 50) {
      cvText = buildCvTextForAI();
    }

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
    name: "Job4You Evaluate API",
    description: "AI-powered job match evaluation using your CV against any job description",
    usage: {
      method: "POST",
      body: {
        jobDescription: "string (required, min 100 chars)",
        jobUrl: "string (optional)",
        cvText: "string (optional — uses your saved CV if logged in, or demo profile as fallback)",
        modelId: "string (optional)",
      },
    },
  });
}

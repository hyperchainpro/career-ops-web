import { NextRequest, NextResponse } from "next/server";
import { evaluateJob } from "@/lib/openrouter";
import { getCurrentUserWithCV } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 60;

// POST /api/ats-check — ATS Resume Checker
// Analyzes user's CV against a job description and returns:
// - ATS compatibility score (0-100)
// - Keyword match analysis
// - Formatting issues
// - Recommendations to improve
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription, cvText: providedCv } = body;

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

    // Get CV text - either from request body or from user's saved profile
    let cvText = providedCv;

    if (!cvText) {
      // Try to get from authenticated user
      const user = await getCurrentUserWithCV();
      if (user?.cvText) {
        cvText = user.cvText;
      }
    }

    if (!cvText || cvText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "No CV text found. Please paste your CV/resume text or save it in your profile.",
        },
        { status: 400 }
      );
    }

    // Build ATS-specific system prompt
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer with 10+ years of experience in recruitment technology. Your task is to analyze a candidate's CV/resume against a job description and provide:

1. ATS Compatibility Score (0-100) — how likely this CV will pass through ATS filters
2. Keyword Match Analysis — which keywords from the JD are present/missing in the CV
3. Formatting Issues — any ATS-red flags (complex formatting, missing sections, etc.)
4. Strengths — what makes this CV strong for this specific role
5. Weaknesses — what needs improvement
6. Actionable Recommendations — specific steps to improve ATS score

Respond in markdown format with these sections:

## 📊 ATS Compatibility Score
**Score: X/100** — [EXCELLENT / GOOD / FAIR / POOR]

## 🔑 Keyword Match Analysis
Create a table with:
| Keyword from JD | Present in CV? | Match Type |
|---|---|---|
Include the top 15-20 most important keywords.

## ✅ Strengths
3-5 bullet points

## ⚠️ Weaknesses
3-5 bullet points

## 💡 Recommendations
5-7 specific, actionable steps to improve the ATS score

## 📝 Summary
One paragraph summary

Be specific, evidence-based, and actionable. Reference actual content from both the CV and JD.`;

    const userPrompt = `# Candidate CV/Resume

${cvText}

---

# Job Description

${jobDescription}

---

Please analyze this CV against the job description for ATS compatibility.`;

    // Use OpenRouter to generate the analysis
    const result = await evaluateJob(cvText, jobDescription, undefined, undefined);

    // The evaluateJob function uses a different system prompt, so let's call OpenRouter directly
    // Actually, let's use a simpler approach - call the OpenRouter API with our custom prompt

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "OpenRouter API key not configured" },
        { status: 503 }
      );
    }

    const FREE_MODELS = [
      "google/gemma-4-31b-it:free",
      "nvidia/nemotron-3-super-120b-a12b:free",
      "thinkingmachines/inkling:free",
      "nex-agi/nex-n2.5-pro:free",
    ];

    let atsResult = null;

    for (const model of FREE_MODELS) {
      try {
        const response = await fetch(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "https://job4you.vercel.app",
              "X-Title": "Job4You ATS Checker",
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              max_tokens: 8192,
              temperature: 0.5,
            }),
          }
        );

        if (!response.ok) continue;

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (content) {
          atsResult = {
            success: true,
            model: model,
            analysis: content,
            tokensUsed: data.usage?.total_tokens || 0,
          };
          break;
        }
      } catch (error) {
        console.error(`Model ${model} failed:`, error);
        continue;
      }
    }

    if (!atsResult) {
      return NextResponse.json(
        { success: false, error: "All AI models failed. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json(atsResult);
  } catch (error) {
    console.error("ATS check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "ATS check failed",
      },
      { status: 500 }
    );
  }
}

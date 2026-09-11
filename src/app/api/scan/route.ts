import { NextRequest, NextResponse } from "next/server";
import { db, isDbAvailable } from "@/lib/db";
import { profileData } from "@/lib/profile";

export const runtime = "nodejs";
export const maxDuration = 60;

// Greenhouse public board API: https://boards-api.greenhouse.io/v1/boards/{board}/jobs
// These are PUBLIC APIs published by companies — ToS-compliant to read

interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  location: { name: string };
  updated_at: string;
  metadata?: Array<{ id: string; name: string; value: string }>;
  departments?: Array<{ name: string }>;
}

interface ScannedJob {
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobUrl: string;
  jobLocation: string;
  jobLevel: string | null;
  jobType: string | null;
  jobSource: string;
  matchScore: number;
  postedAt: string;
  description?: string;
}

// List of Greenhouse boards (companies) that publish public job boards
// These are well-known companies that hire UI/UX Designers and AI Engineers
const GREENHOUSE_BOARDS = [
  // AI/ML Companies
  "anthropic",
  "cohere",
  "huggingface",
  "mistralai",
  "langchain",
  "perplexity",
  "openai",
  "stabilityai",
  // Tech Companies
  "vercel",
  "supabase",
  "neon",
  "figma",
  "notion",
  "linear",
  "loom",
  "airtable",
  "sentry",
  "datadog",
  // Indonesian / SEA relevant
  "gojek",
  "tokopedia",
  "traveloka",
  "grab",
  "shopee",
];

// Keywords to match for UI/UX Designer & AI Engineer roles
const MATCH_KEYWORDS = [
  // UI/UX Designer
  "ui ux",
  "ui/ux",
  "ui designer",
  "ux designer",
  "product designer",
  "design system",
  "figma",
  "user experience",
  "user interface",
  "interaction designer",
  "visual designer",
  // AI Engineer
  "ai engineer",
  "ml engineer",
  "machine learning",
  "llm engineer",
  "ai developer",
  "ml developer",
  "ai research",
  "deep learning",
  "data scientist",
  "ai intern",
  "ml intern",
  "ai intern",
  // Internship/Junior
  "intern",
  "junior",
  "entry level",
  "graduate",
  "apprentice",
  // Intermediate
  "intermediate",
  "mid level",
  "mid-level",
];

// Keywords that indicate REMOTE-friendly or INDONESIA/SEA
const LOCATION_KEYWORDS = [
  "remote",
  "anywhere",
  "worldwide",
  "asia",
  "indonesia",
  "jakarta",
  "singapore",
  "philippines",
  "malaysia",
  "thailand",
  "vietnam",
];

// Calculate match score (0-100) based on title + description keywords
function calculateMatchScore(title: string, description: string = ""): {
  score: number;
  level: string;
} {
  const text = (title + " " + description).toLowerCase();
  let score = 0;
  let uiuxMatched = false;
  let aiMatched = false;
  let levelMatched = false;

  for (const keyword of MATCH_KEYWORDS) {
    if (text.includes(keyword)) {
      score += 10;
      if (keyword.includes("ui") || keyword.includes("ux") || keyword.includes("designer") || keyword.includes("figma")) {
        uiuxMatched = true;
      }
      if (keyword.includes("ai") || keyword.includes("ml") || keyword.includes("machine") || keyword.includes("llm")) {
        aiMatched = true;
      }
      if (["intern", "junior", "entry level", "graduate", "apprentice", "intermediate", "mid level"].includes(keyword)) {
        levelMatched = true;
      }
    }
  }

  // Bonus if both UI/UX and AI matched (hybrid role)
  if (uiuxMatched && aiMatched) score += 20;

  // Bonus if level matched
  if (levelMatched) score += 15;

  // Cap at 100
  score = Math.min(score, 100);

  // Determine level
  let level = "unknown";
  if (text.includes("intern")) level = "internship";
  else if (text.includes("junior") || text.includes("entry level") || text.includes("graduate")) level = "junior";
  else if (text.includes("intermediate") || text.includes("mid level") || text.includes("mid-level")) level = "intermediate";
  else if (text.includes("senior") || text.includes("lead") || text.includes("staff")) level = "senior";

  return { score, level };
}

// Determine job type from text
function determineJobType(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes("full-time") || lower.includes("full time")) return "full-time";
  if (lower.includes("contract")) return "contract";
  if (lower.includes("intern")) return "internship";
  if (lower.includes("part-time") || lower.includes("part time")) return "part-time";
  if (lower.includes("freelance")) return "freelance";
  return null;
}

// Check if location is remote-friendly or in target regions
function isLocationMatch(locationName: string): boolean {
  if (!locationName) return false;
  const lower = locationName.toLowerCase();
  return LOCATION_KEYWORDS.some((kw) => lower.includes(kw));
}

// Fetch jobs from a single Greenhouse board
async function scanGreenhouseBoard(board: string): Promise<ScannedJob[]> {
  try {
    const response = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`,
      {
        headers: { "User-Agent": "Career-Ops-AI/1.0" },
        signal: AbortSignal.timeout(10000), // 10s timeout per board
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const jobs: GreenhouseJob[] = data.jobs || [];

    const matchedJobs: ScannedJob[] = [];

    for (const job of jobs) {
      const title = job.title || "";
      const location = job.location?.name || "";
      const description = job.metadata?.find((m) => m.name === "Job Description")?.value || "";

      // Calculate match score
      const { score, level } = calculateMatchScore(title, description);

      // Only include if score >= 20 (some relevance)
      if (score < 20) continue;

      // Determine job type
      const jobType = determineJobType(title + " " + description);

      // Check if level matches target (internship, junior, intermediate)
      // Also include "unknown" level jobs (let user decide)
      const isTargetLevel =
        level === "internship" ||
        level === "junior" ||
        level === "intermediate" ||
        level === "unknown";

      // Check if location matches (remote or target region)
      // If location is empty, assume remote
      const isLocationOk = !location || location === "Remote" || isLocationMatch(location);

      if (!isTargetLevel || !isLocationOk) continue;

      matchedJobs.push({
        jobId: `greenhouse-${board}-${job.id}`,
        jobTitle: title,
        companyName: board.charAt(0).toUpperCase() + board.slice(1),
        jobUrl: job.absolute_url,
        jobLocation: location || "Remote",
        jobLevel: level,
        jobType,
        jobSource: "greenhouse",
        matchScore: score,
        postedAt: job.updated_at,
        description: description.slice(0, 500), // Truncate for storage
      });
    }

    return matchedJobs;
  } catch (error) {
    console.error(`Error scanning board ${board}:`, error);
    return [];
  }
}

// GET /api/scan — Scan all Greenhouse boards for matching jobs
// Query params: limit (default 50), save (default true)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const saveToDb = searchParams.get("save") !== "false";

  try {
    // Scan all boards in parallel (batch of 10 at a time to avoid rate limits)
    const allJobs: ScannedJob[] = [];
    const batchSize = 10;

    for (let i = 0; i < GREENHOUSE_BOARDS.length; i += batchSize) {
      const batch = GREENHOUSE_BOARDS.slice(i, i + batchSize);
      const results = await Promise.allSettled(batch.map(scanGreenhouseBoard));

      for (const result of results) {
        if (result.status === "fulfilled") {
          allJobs.push(...result.value);
        }
      }
    }

    // Sort by match score (descending)
    allJobs.sort((a, b) => b.matchScore - a.matchScore);

    // Limit results
    const limited = allJobs.slice(0, limit);

    // Save to database if requested
    let savedCount = 0;
    if (saveToDb && isDbAvailable()) {
      try {
        for (const job of limited) {
          // Check if already exists (by jobUrl)
          const existing = await db.jobApplication.findFirst({
            where: { jobUrl: job.jobUrl },
          });

          if (!existing) {
            await db.jobApplication.create({
              data: {
                jobTitle: job.jobTitle,
                companyName: job.companyName,
                jobUrl: job.jobUrl,
                jobLocation: job.jobLocation,
                jobLevel: job.jobLevel,
                jobType: job.jobType,
                jobSource: job.jobSource,
                matchScore: job.matchScore,
                status: "to_apply",
                notes: job.description || null,
              },
            });
            savedCount++;
          }
        }

        // Log scan
        await db.scanLog.create({
          data: {
            source: "greenhouse",
            resultsFound: allJobs.length,
            resultsSaved: savedCount,
          },
        });
      } catch (dbError) {
        console.warn("Failed to save scan results to DB:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      totalFound: allJobs.length,
      saved: savedCount,
      jobs: limited,
      scannedBoards: GREENHOUSE_BOARDS.length,
    });
  } catch (error) {
    console.error("GET /api/scan error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Scan failed",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db, isDbAvailable } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 60;

// ── Job scanner: Greenhouse + Lever + Ashby public APIs ──
// All APIs are public and ToS-compliant

interface ScannedJob {
  jobId: string;
  jobTitle: string;
  companyName: string;
  jobUrl: string;
  jobLocation: string;
  jobCountry: string | null;
  jobLevel: string | null;
  jobType: string | null;
  jobSource: string;
  jobCategory: string | null;
  matchScore: number;
  postedAt: string;
  description?: string;
}

const MATCH_KEYWORDS = [
  "ui ux","ui/ux","ui designer","ux designer","product designer","design system","figma",
  "user experience","user interface","interaction designer","visual designer",
  "ai engineer","ml engineer","machine learning","llm","ai developer","ml developer",
  "ai research","deep learning","data scientist","ai intern","ml intern",
  "intern","junior","entry level","graduate","apprentice","intermediate","mid level",
  "frontend","backend","fullstack","full-stack","react","next.js","typescript",
  "python","node","remote","software engineer","web developer","mobile developer",
  "product manager","project manager","data analyst","devops","cloud engineer",
];

const REMOTE_KEYWORDS = ["remote","anywhere","worldwide","global","distributed","async"];

function calculateMatchScore(title: string, description: string = ""): { score: number; level: string; category: string } {
  const text = (title + " " + description).toLowerCase();
  let score = 0;
  let level = "unknown";
  let category = "general";

  for (const kw of MATCH_KEYWORDS) {
    if (text.includes(kw)) score += 8;
  }

  if (text.includes("intern")) level = "internship";
  else if (text.includes("junior") || text.includes("entry")) level = "junior";
  else if (text.includes("intermediate") || text.includes("mid")) level = "intermediate";
  else if (text.includes("senior") || text.includes("lead") || text.includes("staff")) level = "senior";

  // Category detection
  if (text.match(/ui|ux|design|figma|product designer/)) category = "design";
  else if (text.match(/ai|ml|machine learning|llm|deep learning/)) category = "ai";
  else if (text.match(/frontend|react|vue|angular|css/)) category = "frontend";
  else if (text.match(/backend|api|database|server/)) category = "backend";
  else if (text.match(/fullstack|full-stack/)) category = "fullstack";
  else if (text.match(/data|analyst|scientist/)) category = "data";
  else if (text.match(/devops|cloud|infrastructure/)) category = "devops";
  else if (text.match(/product manager|project manager/)) category = "product";
  else if (text.match(/marketing|content|social/)) category = "marketing";

  score = Math.min(score, 100);
  return { score, level, category };
}

function detectCountry(location: string): string | null {
  if (!location) return null;
  const lower = location.toLowerCase();
  if (lower.includes("remote") || lower.includes("anywhere") || lower.includes("worldwide")) return "Remote";
  if (lower.includes("indonesia") || lower.includes("jakarta")) return "Indonesia";
  if (lower.includes("singapore") || lower.includes("singapura")) return "Singapore";
  if (lower.includes("united states") || lower.includes("usa") || lower.includes("us-") || lower.includes("new york") || lower.includes("san francisco") || lower.includes("seattle")) return "United States";
  if (lower.includes("united kingdom") || lower.includes("uk") || lower.includes("london")) return "United Kingdom";
  if (lower.includes("germany") || lower.includes("berlin") || lower.includes("munich")) return "Germany";
  if (lower.includes("canada") || lower.includes("toronto") || lower.includes("vancouver")) return "Canada";
  if (lower.includes("australia") || lower.includes("sydney") || lower.includes("melbourne")) return "Australia";
  if (lower.includes("india") || lower.includes("bangalore") || lower.includes("mumbai")) return "India";
  if (lower.includes("japan") || lower.includes("tokyo")) return "Japan";
  if (lower.includes("netherlands") || lower.includes("amsterdam")) return "Netherlands";
  if (lower.includes("france") || lower.includes("paris")) return "France";
  if (lower.includes("spain") || lower.includes("barcelona") || lower.includes("madrid")) return "Spain";
  if (lower.includes("brazil") || lower.includes("são paulo")) return "Brazil";
  if (lower.includes("philippines") || lower.includes("manila")) return "Philippines";
  if (lower.includes("malaysia") || lower.includes("kuala lumpur")) return "Malaysia";
  if (lower.includes("thailand") || lower.includes("bangkok")) return "Thailand";
  if (lower.includes("vietnam") || lower.includes("hanoi") || lower.includes("ho chi minh")) return "Vietnam";
  return null;
}

// ── Greenhouse boards ──
const GREENHOUSE_BOARDS = [
  "anthropic","cohere","huggingface","mistralai","langchain","perplexity","openai","stabilityai",
  "vercel","supabase","neon","figma","notion","linear","loom","airtable","sentry","datadog",
  "gojek","tokopedia","traveloka","grab","shopee","ruangguru","halodoc","xendit",
  "stripe","cloudflare","github","gitlab","shopify","airbnb","uber","lyft","dropbox","zoom",
  "discord","slack","atlassian","asana","monzo","revolut","wise","n26","brex","plaid",
  "duolingo","khanacademy","coursera","udemy","skillshare","masterclass",
];

// ── Lever boards (company.postings) ──
const LEVER_BOARDS = [
  "nerdwallet","cipher","canva","atlassian","loom","plaid","notion","vercel",
  "polymarket","chainlink","alchemy","magic eden","opensea","dune","ipld",
  "scaleai","snowflake","databricks","hashicorp","rocketchat",
  "doordash","yelp","eventbrite","splunk","fiverr","upwork",
  "chainalysis","circle","gemini","kraken","bitfinex","coinbase",
];

// Scan Greenhouse board
async function scanGreenhouse(board: string): Promise<ScannedJob[]> {
  try {
    const response = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`,
      { headers: { "User-Agent": "Job4You/1.0" }, signal: AbortSignal.timeout(8000) }
    );
    if (!response.ok) return [];

    const data = await response.json();
    const jobs = data.jobs || [];
    const matched: ScannedJob[] = [];

    for (const job of jobs) {
      const title = job.title || "";
      const location = job.location?.name || "";
      const desc = job.metadata?.find((m: any) => m.name === "Job Description")?.value || "";
      const { score, level, category } = calculateMatchScore(title, desc);

      if (score < 15) continue;

      const isRemote = !location || REMOTE_KEYWORDS.some(kw => location.toLowerCase().includes(kw));
      const country = detectCountry(location) || (isRemote ? "Remote" : null);

      matched.push({
        jobId: `gh-${board}-${job.id}`,
        jobTitle: title,
        companyName: board.charAt(0).toUpperCase() + board.slice(1),
        jobUrl: job.absolute_url,
        jobLocation: location || "Remote",
        jobCountry: country,
        jobLevel: level,
        jobType: null,
        jobSource: "greenhouse",
        jobCategory: category,
        matchScore: score,
        postedAt: job.updated_at,
        description: desc.slice(0, 500),
      });
    }
    return matched;
  } catch {
    return [];
  }
}

// Scan Lever board
async function scanLever(board: string): Promise<ScannedJob[]> {
  try {
    const response = await fetch(
      `https://api.lever.co/v0/postings/${board}?mode=json`,
      { headers: { "User-Agent": "Job4You/1.0" }, signal: AbortSignal.timeout(8000) }
    );
    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    const matched: ScannedJob[] = [];

    for (const job of data) {
      const title = job.text || "";
      const location = job.categories?.location || "";
      const desc = job.descriptionPlain || job.description || "";
      const { score, level, category } = calculateMatchScore(title, desc);

      if (score < 15) continue;

      const isRemote = !location || REMOTE_KEYWORDS.some(kw => location.toLowerCase().includes(kw));
      const country = detectCountry(location) || (isRemote ? "Remote" : null);

      matched.push({
        jobId: `lev-${board}-${job.id}`,
        jobTitle: title,
        companyName: board.charAt(0).toUpperCase() + board.slice(1),
        jobUrl: job.hostedUrl || `https://jobs.lever.co/${board}/${job.id}`,
        jobLocation: location || "Remote",
        jobCountry: country,
        jobLevel: level,
        jobType: job.categories?.commitment || null,
        jobSource: "lever",
        jobCategory: category,
        matchScore: score,
        postedAt: job.createdAt || new Date().toISOString(),
        description: (desc || "").slice(0, 500),
      });
    }
    return matched;
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "100");
  const saveToDb = searchParams.get("save") !== "false";
  const country = searchParams.get("country");
  const category = searchParams.get("category");
  const level = searchParams.get("level");

  try {
    // Scan all boards in parallel (batches of 15)
    const allJobs: ScannedJob[] = [];

    // Greenhouse
    for (let i = 0; i < GREENHOUSE_BOARDS.length; i += 15) {
      const batch = GREENHOUSE_BOARDS.slice(i, i + 15);
      const results = await Promise.allSettled(batch.map(scanGreenhouse));
      for (const r of results) {
        if (r.status === "fulfilled") allJobs.push(...r.value);
      }
    }

    // Lever
    for (let i = 0; i < LEVER_BOARDS.length; i += 15) {
      const batch = LEVER_BOARDS.slice(i, i + 15);
      const results = await Promise.allSettled(batch.map(scanLever));
      for (const r of results) {
        if (r.status === "fulfilled") allJobs.push(...r.value);
      }
    }

    // Apply filters
    let filtered = allJobs;

    if (country && country !== "all") {
      filtered = filtered.filter(j =>
        j.jobCountry?.toLowerCase().includes(country.toLowerCase())
      );
    }

    if (category && category !== "all") {
      filtered = filtered.filter(j => j.jobCategory === category);
    }

    if (level && level !== "all") {
      filtered = filtered.filter(j => j.jobLevel === level);
    }

    // Sort by match score
    filtered.sort((a, b) => b.matchScore - a.matchScore);
    const limited = filtered.slice(0, limit);

    // Save to DB if user is authenticated
    let savedCount = 0;
    const user = await getCurrentUser();

    if (saveToDb && isDbAvailable() && user) {
      try {
        for (const job of limited) {
          const existing = await db.jobApplication.findFirst({
            where: { jobUrl: job.jobUrl, userId: user.id },
          });
          if (!existing) {
            await db.jobApplication.create({
              data: {
                userId: user.id,
                jobTitle: job.jobTitle,
                companyName: job.companyName,
                jobUrl: job.jobUrl,
                jobLocation: job.jobLocation,
                jobCountry: job.jobCountry,
                jobLevel: job.jobLevel,
                jobType: job.jobType,
                jobSource: job.jobSource,
                jobCategory: job.jobCategory,
                matchScore: job.matchScore,
                status: "to_apply",
                notes: job.description || null,
              },
            });
            savedCount++;
          }
        }
        await db.scanLog.create({
          data: { source: "multi", resultsFound: filtered.length, resultsSaved: savedCount },
        });
      } catch (dbError) {
        console.warn("DB save failed:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      totalFound: filtered.length,
      saved: savedCount,
      jobs: limited,
      scannedBoards: GREENHOUSE_BOARDS.length + LEVER_BOARDS.length,
      filters: { country, category, level },
    });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Scan failed" },
      { status: 500 }
    );
  }
}

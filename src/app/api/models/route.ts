import { NextResponse } from "next/server";
import { getAvailableFreeModels } from "@/lib/openrouter";

export const runtime = "nodejs";

export async function GET() {
  try {
    const models = await getAvailableFreeModels();
    return NextResponse.json({
      success: true,
      count: models.length,
      models: models.slice(0, 50), // Limit to top 50
    });
  } catch (error) {
    console.error("Models API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch models",
        models: [],
      },
      { status: 500 }
    );
  }
}

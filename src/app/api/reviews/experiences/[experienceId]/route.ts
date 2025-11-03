import { config } from "@/lib/config";
import { NextResponse } from "next/server";

// GET /api/reviews/experience/[experienceId] - Get all reviews for a specific experience
export async function GET(
  request: Request,
  context: { params: Promise<{ experienceId: string }> }
) {
  const params = await context.params;
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "newest"; // Default to newest
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "5";

  try {
    const response = await fetch(
      `${config.backendApiUrl}/reviews/experience/${params.experienceId}?sortBy=${sortBy}&page=${page}&limit=${limit}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch reviews" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(
      `Error fetching reviews for experience ${params.experienceId}:`,
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

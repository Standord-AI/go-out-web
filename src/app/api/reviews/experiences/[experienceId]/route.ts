import { config } from "@/lib/config";
import { NextResponse } from "next/server";

// GET /api/reviews/experience/[experienceId] - Get all reviews for a specific experience
export async function GET(
  request: Request,
  context: { params: Promise<{ experienceId: string }> }
) {
  const params = await context.params;
  const { searchParams } = new URL(request.url);
  // Validate sortBy
  const sortByParam = searchParams.get("sortBy") || "newest";
  const allowedSortOptions = [
    "newest",
    "oldest",
    "highest",
    "lowest",
    "most-helpful",
  ];
  const sortBy = allowedSortOptions.includes(sortByParam)
    ? sortByParam
    : "newest";

  // Validate page and limit as positive integers
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const page =
    isNaN(pageParam) || pageParam < 1 ? 1 : Math.min(pageParam, 1000);

  const limitParam = parseInt(searchParams.get("limit") || "5", 10);
  const limit =
    isNaN(limitParam) || limitParam < 1 ? 5 : Math.min(limitParam, 100);

  try {
    const response = await fetch(
      `${config.backendApiUrl}/reviews/experience/${
        params.experienceId
      }?sortBy=${encodeURIComponent(sortBy)}&page=${page}&limit=${limit}`,
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

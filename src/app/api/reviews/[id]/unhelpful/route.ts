import { config } from "@/lib/config";
import { NextResponse } from "next/server";

// PATCH /api/reviews/[id]/helpful - Mark a review as helpful
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await fetch(
      `${config.backendApiUrl}/reviews/${id}/unhelpful`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(request.headers.get("cookie")
            ? { cookie: request.headers.get("cookie") as string }
            : {}),
          ...(request.headers.get("authorization")
            ? { authorization: request.headers.get("authorization") as string }
            : {}),
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to mark review as unhelpful" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(`Error marking review as unhelpful:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

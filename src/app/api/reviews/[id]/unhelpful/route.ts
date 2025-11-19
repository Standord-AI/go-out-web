import { config } from "@/lib/config";
import { NextResponse } from "next/server";

const parseJsonSafely = async (
  response: Response
): Promise<Record<string, unknown> | null> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  const data = await response.json().catch(() => null);
  if (data && typeof data === "object") {
    return data as Record<string, unknown>;
  }
  return null;
};

// PATCH /api/reviews/[id]/unhelpful - Mark a review as unhelpful
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

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

    const data = await parseJsonSafely(response);

    if (!response.ok) {
      const errorMessage =
        (data?.message as string | undefined) ||
        "Failed to mark review as unhelpful";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json(data ?? {}, { status: 200 });
  } catch (error: unknown) {
    console.error("Error marking review as unhelpful:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

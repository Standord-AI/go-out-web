import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

interface ApiResponseData {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

const parseJsonSafely = async (
  response: Response
): Promise<ApiResponseData | null> => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  const result = await response.json().catch(() => null);
  if (result && typeof result === "object") {
    return result as ApiResponseData;
  }
  return null;
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${config.backendApiUrl}/users/get-one/${userId}`,
      {
        method: "GET",
        headers: {
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
        data?.message || "Failed to fetch user profile";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json(data ?? {}, { status: 200 });
  } catch (error: unknown) {
    console.error("Get user profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const response = await fetch(
      `${config.backendApiUrl}/users/update/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(request.headers.get("cookie")
            ? { cookie: request.headers.get("cookie") as string }
            : {}),
          ...(request.headers.get("authorization")
            ? { authorization: request.headers.get("authorization") as string }
            : {}),
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await parseJsonSafely(response);

    if (!response.ok) {
      const errorMessage =
        data?.message || "Failed to update user profile";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json(data ?? {}, { status: 200 });
  } catch (error: unknown) {
    console.error("Update user profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params or headers (you might want to get this from JWT token)
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

    let data: any = null;
    const ct = response.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      data = await response.json().catch(() => null);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch user profile" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
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

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to update user profile" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Update user profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

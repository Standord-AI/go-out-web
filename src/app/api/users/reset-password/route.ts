import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

interface ApiResponseData {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${config.backendApiUrl}/users/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    let data: ApiResponseData | null = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = (await response.json().catch(() => null)) as ApiResponseData | null;
    }

    if (!response.ok) {
      const errorMessage = data?.message || "Failed to reset password";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json(data ?? {}, { status: 200 });
  } catch (error: unknown) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

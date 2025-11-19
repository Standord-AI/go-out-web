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

    const response = await fetch(`${config.backendApiUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    let data: ApiResponseData | null = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = (await response.json().catch(() => null)) as ApiResponseData | null;
    }

    if (!response.ok) {
      const errorMessage = data?.message || "Login failed";
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const headersWithCookies = response.headers as Headers & {
      getSetCookie?: () => string[];
    };

    const setCookies =
      headersWithCookies.getSetCookie?.() ??
      (headersWithCookies.get("set-cookie")
        ? [headersWithCookies.get("set-cookie") as string]
        : []);

    const res = NextResponse.json(data ?? {}, { status: 200 });

    for (const cookie of setCookies) {
      if (cookie) {
        res.headers.append("Set-Cookie", cookie);
      }
    }

    return res;
  } catch (error: unknown) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

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

    let data: any = null;
    const ct = response.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      data = await response.json().catch(() => null);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Login failed" },
        { status: response.status }
      );
    }

    // Forward any Set-Cookie headers from the backend
    const res = NextResponse.json(data, { status: 200 });
    // getSetCookie is available in Next's Response headers implementation
    const setCookies =
      (response.headers as any).getSetCookie?.() ??
      (response.headers.get("set-cookie")
        ? [response.headers.get("set-cookie") as string]
        : []);
    for (const cookie of setCookies) {
      if (cookie) res.headers.append("Set-Cookie", cookie);
    }
    return res;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

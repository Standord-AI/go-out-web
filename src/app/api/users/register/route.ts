import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${config.backendApiUrl}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Registration failed" },
        { status: response.status }
      );
    }

    const responseHeaders = new Headers();
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      responseHeaders.set("set-cookie", setCookie);
    }

    return NextResponse.json(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${config.backendApiUrl}/users/logout`, {
      method: "POST",
      headers: {
        // Forward cookies from the client to the backend
        Cookie: request.headers.get("Cookie") || "",
      },
    });

    // Forward the Set-Cookie header from the backend to the client.
    const responseHeaders = new Headers();
    responseHeaders.set("Set-Cookie", response.headers.get("Set-Cookie") || "");

    // The backend might not return a body, which is fine for logout.
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.message || "Logout failed" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Logout successful" }, { status: 200, headers: responseHeaders });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
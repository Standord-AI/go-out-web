import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

/**
 * Proxies a registration POST request to the configured backend and returns its result.
 *
 * @param request - Incoming NextRequest containing the registration payload in its JSON body
 * @returns A NextResponse with the backend's JSON on success and HTTP status 201; if the backend responds with an error, a JSON object `{ error: <message> }` with the backend status; on unexpected errors, a JSON `{ error: "Internal server error" }` with status 500.
 */
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

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

/**
 * Handle forgot-password POST requests by forwarding the request body to the backend and returning the backend's response.
 *
 * @param request - The incoming NextRequest whose JSON body will be proxied to the backend forgot-password endpoint.
 * @returns A NextResponse containing the backend response data on success, or an object `{ error: string }` with an appropriate HTTP status on failure.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${config.backendApiUrl}/users/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to process forgot password request" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
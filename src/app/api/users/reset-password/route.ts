import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

/**
 * Handle POST requests to initiate a user password reset by forwarding the request body to the backend reset endpoint.
 *
 * @param request - Incoming Next.js request whose JSON body is forwarded to the backend `/users/reset-password` endpoint
 * @returns A JSON NextResponse containing the backend response data on success (status 200), or an error object with the backend's status on failure; returns an error object with status 500 on unexpected errors
 */
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

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to reset password" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Reset password API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
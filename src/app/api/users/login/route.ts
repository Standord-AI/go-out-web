import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

/**
 * Handle a login POST by forwarding the request body to the backend login endpoint and returning the backend's response to the client.
 *
 * Returns a NextResponse containing the backend response data and propagates the backend Set-Cookie header on success.
 * If the backend responds with an error, returns a JSON error object with the backend status.
 * If an unexpected error occurs, returns a JSON error object with HTTP status 500.
 *
 * @returns A NextResponse with:
 *  - the backend JSON and propagated `Set-Cookie` header on success (HTTP 200),
 *  - `{ error: string }` and the backend status on backend failure,
 *  - `{ error: "Internal server error" }` with status 500 on unexpected errors.
 */
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

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Login failed" },
        { status: response.status }
      );
    }

    // Set the JWT cookie from the backend response
    const responseHeaders = new Headers();
    responseHeaders.set("Set-Cookie", response.headers.get("Set-Cookie") || "");

    return NextResponse.json(data, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
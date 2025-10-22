import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";

/**
 * Handle GET requests to retrieve a user profile by user ID.
 *
 * Attempts to read `id` from the request query string and fetches the corresponding
 * user profile from the backend API.
 *
 * @returns `NextResponse` containing the user profile data on success (HTTP 200).
 *          If the `id` query parameter is missing, returns an error message with HTTP 400.
 *          If the backend responds with an error, returns the backend-provided message and status.
 *          On unexpected failures, returns an error message with HTTP 500.
 */
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
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

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

/**
 * Updates a user profile identified by the `id` query parameter.
 *
 * Forwards the request body as JSON to the backend update endpoint and returns the backend response.
 *
 * @param request - NextRequest whose URL must include an `id` query parameter and whose JSON body contains the updated profile fields
 * @returns The updated user data on success. On error, an object with an `error` message and an HTTP status: 400 if `id` is missing, the backend's status for backend errors, or 500 for internal failures.
 */
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
        },
        body: JSON.stringify(body),
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
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/src/lib/api/response";
import { destroySession } from "@/src/lib/auth/session";

/**
 * POST /api/auth/logout
 * Admin logout endpoint
 */
export async function POST(request: NextRequest) {
  try {
    await destroySession();

    return successResponse(null, "Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse(
      "LOGOUT_ERROR",
      "Logout failed",
      (error as Error).message,
      500,
    );
  }
}

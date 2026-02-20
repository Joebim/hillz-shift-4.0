import { NextRequest } from "next/server";
import { successResponse, unauthorizedResponse } from "@/src/lib/api/response";
import { getSession } from "@/src/lib/auth/session";
import { getDocument } from "@/src/lib/firebase/firestore";
import { User } from "@/src/types/user";

/**
 * GET /api/auth/session
 * Verify current session and get full user details
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return unauthorizedResponse("No active session");
    }

    // Fetch full user details to get displayName and photoUrl
    const user = await getDocument<User>("users", session.userId);

    return successResponse({
      userId: session.userId,
      email: session.email,
      role: session.role,
      expiresAt: session.expiresAt,
      displayName: user?.displayName || session.email.split("@")[0], // Fallback if no display name
      photoUrl: user?.photoUrl || null,
    });
  } catch (error) {
    console.error("Session verification error:", error);
    return unauthorizedResponse("Invalid session");
  }
}

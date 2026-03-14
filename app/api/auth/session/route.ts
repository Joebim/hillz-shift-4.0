import { NextRequest } from "next/server";
import { successResponse, unauthorizedResponse } from "@/src/lib/api/response";
import { getSession } from "@/src/lib/auth/session";
import { getDocument } from "@/src/lib/firebase/firestore";
import { User } from "@/src/types/user";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return unauthorizedResponse("No active session");
    }

    const user = await getDocument<User>("users", session.userId);

    // Normalise to array — support both legacy single-id and new multi-id
    const managedEventIds: string[] = user?.managedEventIds?.length
      ? user.managedEventIds
      : user?.managedEventId
        ? [user.managedEventId]
        : [];

    return successResponse({
      userId: session.userId,
      email: session.email,
      role: session.role,
      expiresAt: session.expiresAt,
      displayName: user?.displayName || session.email.split("@")[0],
      photoUrl: user?.photoUrl || null,
      managedEventIds,
    });
  } catch (error) {
    return unauthorizedResponse("Invalid session");
  }
}

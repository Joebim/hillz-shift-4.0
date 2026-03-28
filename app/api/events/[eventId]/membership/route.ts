import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "@/src/lib/api/response";
import {
  getDocument,
  updateDocument,
  queryDocumentsAdvanced,
  batchUpdateDocuments,
} from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Event } from "@/src/types/event";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse("Admin access required");
    }

    const { eventId } = await params;
    const event = await getDocument<Event>("events", eventId);

    if (!event) {
      return notFoundResponse("Event not found");
    }

    // Find all other events that are currently set as membership form
    const currentMembershipForms = await queryDocumentsAdvanced<Event>("events", (ref) =>
      ref.where("isMembershipForm", "==", true)
    );

    // Prepare updates: set all current ones to false
    const updates = currentMembershipForms
      .filter((e) => e.id !== eventId)
      .map((e) => ({
        id: e.id,
        data: { isMembershipForm: false },
      }));

    if (updates.length > 0) {
      await batchUpdateDocuments("events", updates);
    }

    // Set the target event as membership form
    await updateDocument("events", eventId, { isMembershipForm: true });

    return successResponse(
      { id: eventId },
      "Event set as membership form successfully"
    );
  } catch (error) {
    return errorResponse(
      "MEMBERSHIP_SET_ERROR",
      "Failed to set membership form",
      (error as Error).message
    );
  }
}

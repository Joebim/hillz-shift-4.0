import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "@/src/lib/api/response";
import {
  getDocument,
  deleteDocument,
  updateDocument,
} from "@/src/lib/firebase/firestore";
import { Event } from "@/src/types/event";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string; invitationId: string }> },
) {
  try {
    const { eventId, invitationId } = await params;

    const invitation = await getDocument("invitations", invitationId);
    if (!invitation) {
      return notFoundResponse("Invitation not found");
    }

    await deleteDocument("invitations", invitationId);

    // Update event invitation count
    const event = await getDocument<Event>("events", eventId);
    if (event) {
      await updateDocument("events", eventId, {
        invitationCount: Math.max(0, (event.invitationCount || 0) - 1),
      });
    }

    return successResponse(null, "Invitation deleted successfully");
  } catch (error) {
    return errorResponse(
      "DELETE_ERROR",
      "Failed to delete invitation",
      (error as Error).message,
    );
  }
}

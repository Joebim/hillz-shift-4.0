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
  { params }: { params: Promise<{ eventId: string; registrationId: string }> },
) {
  try {
    const { eventId, registrationId } = await params;

    const registration = await getDocument("registrations", registrationId);
    if (!registration) {
      return notFoundResponse("Registration not found");
    }

    await deleteDocument("registrations", registrationId);

    // Update event registration count
    const event = await getDocument<Event>("events", eventId);
    if (event) {
      await updateDocument("events", eventId, {
        registrationCount: Math.max(0, (event.registrationCount || 0) - 1),
      });
    }

    return successResponse(null, "Registration deleted successfully");
  } catch (error) {
    return errorResponse(
      "DELETE_ERROR",
      "Failed to delete registration",
      (error as Error).message,
    );
  }
}

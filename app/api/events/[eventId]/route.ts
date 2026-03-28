import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import {
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocumentsAdvanced,
  batchUpdateDocuments
} from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Event } from "@/src/types/event";
import { updateEventSchema } from "@/src/schemas/event.schema";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;
    const event = await getDocument<Event>("events", eventId);

    if (!event) {
      return notFoundResponse("Event not found");
    }

    const session = await getSession();
    const isAdmin =
      session && ["super_admin", "admin", "editor"].includes(session.role);

    if (event.status !== "published" && !isAdmin) {
      return notFoundResponse("Event not found");
    }

    return successResponse(event);
  } catch (error) {
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch event",
      (error as Error).message,
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse("Admin access required");
    }

    const { eventId } = await params;
    const body = await request.json();

    const validated = updateEventSchema.parse(body);

    const event = await getDocument<Event>("events", eventId);
    if (!event) {
      return notFoundResponse("Event not found");
    }

    // If this is set as membership form, unset others (excluding the current event)
    if (validated.isMembershipForm) {
      const currentMembershipForms = await queryDocumentsAdvanced<Event>("events", (ref) =>
        ref.where("isMembershipForm", "==", true)
      );
      
      const updates = currentMembershipForms
        .filter((e) => e.id !== eventId)
        .map((e) => ({
          id: e.id,
          data: { isMembershipForm: false },
        }));

      if (updates.length > 0) {
        await batchUpdateDocuments("events", updates);
      }
    }

    await updateDocument("events", eventId, validated);

    return successResponse({ id: eventId }, "Event updated successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    return errorResponse(
      "UPDATE_ERROR",
      "Failed to update event",
      (error as Error).message,
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return unauthorizedResponse("Super admin access required");
    }

    const { eventId } = await params;

    const event = await getDocument<Event>("events", eventId);
    if (!event) {
      return notFoundResponse("Event not found");
    }

    await deleteDocument("events", eventId);

    return successResponse(null, "Event deleted successfully");
  } catch (error) {
    return errorResponse(
      "DELETE_ERROR",
      "Failed to delete event",
      (error as Error).message,
    );
  }
}

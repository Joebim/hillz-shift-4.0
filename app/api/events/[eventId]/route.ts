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
} from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Event } from "@/src/types/event";
import { updateEventSchema } from "@/src/schemas/event.schema";
import { ZodError } from "zod";

/**
 * GET /api/events/[eventId]
 * Get single event details
 */
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

    // Check if event is published or user is admin
    const session = await getSession();
    const isAdmin =
      session && ["super_admin", "admin", "editor"].includes(session.role);

    if (event.status !== "published" && !isAdmin) {
      return notFoundResponse("Event not found");
    }

    return successResponse(event);
  } catch (error) {
    console.error("Fetch event error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch event",
      (error as Error).message,
    );
  }
}

/**
 * PATCH /api/events/[eventId]
 * Update event (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse("Admin access required");
    }

    const { eventId } = await params;
    const body = await request.json();

    // Validate request body
    const validated = updateEventSchema.parse(body);

    // Check if event exists
    const event = await getDocument<Event>("events", eventId);
    if (!event) {
      return notFoundResponse("Event not found");
    }

    // Update event
    await updateDocument("events", eventId, validated);

    return successResponse({ id: eventId }, "Event updated successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Update event error:", error);
    return errorResponse(
      "UPDATE_ERROR",
      "Failed to update event",
      (error as Error).message,
    );
  }
}

/**
 * DELETE /api/events/[eventId]
 * Delete event (super admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    // Check authentication (super admin only)
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return unauthorizedResponse("Super admin access required");
    }

    const { eventId } = await params;

    // Check if event exists
    const event = await getDocument<Event>("events", eventId);
    if (!event) {
      return notFoundResponse("Event not found");
    }

    // Delete event
    await deleteDocument("events", eventId);

    return successResponse(null, "Event deleted successfully");
  } catch (error) {
    console.error("Delete event error:", error);
    return errorResponse(
      "DELETE_ERROR",
      "Failed to delete event",
      (error as Error).message,
    );
  }
}

import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { queryDocuments, createDocument } from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Event } from "@/src/types/event";
import {
  createEventSchema,
  eventQuerySchema,
} from "@/src/schemas/event.schema";
import { ZodError } from "zod";
import { generateSlug } from "@/src/lib/utils";

/**
 * GET /api/events
 * List all published events (public) or all events (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryParams = Object.fromEntries(searchParams.entries());
    const validated = eventQuerySchema.parse(queryParams);

    // Check if admin is authenticated
    const session = await getSession();
    const isAdmin =
      session && ["super_admin", "admin", "editor"].includes(session.role);

    // Build filters
    const filters: Record<string, unknown> = {};

    // If not admin, only show published events
    if (!isAdmin) {
      filters.status = "published";
    } else if (validated.status) {
      filters.status = validated.status;
    }

    if (validated.category) {
      filters.category = validated.category;
    }

    if (validated.featured !== undefined) {
      filters.featured = validated.featured;
    }

    // Query events
    const events = await queryDocuments<Event>(
      "events",
      filters,
      "startDate",
      validated.limit || 50,
    );

    // Filter by search if provided
    let filteredEvents = events;
    if (validated.search) {
      const searchLower = validated.search.toLowerCase();
      filteredEvents = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.shortDescription.toLowerCase().includes(searchLower),
      );
    }

    return successResponse(filteredEvents);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Fetch events error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch events",
      (error as Error).message,
    );
  }
}

/**
 * POST /api/events
 * Create new event (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse("Admin access required");
    }

    const body = await request.json();

    // Validate request body
    const validated = createEventSchema.parse(body);

    // Generate slug if not provided
    if (!validated.slug) {
      validated.slug = generateSlug(validated.title);
    }

    // Create event
    const eventId = await createDocument("events", {
      ...validated,
      createdBy: session.userId,
      registrationCount: 0,
      invitationCount: 0,
    });

    return successResponse({ id: eventId }, "Event created successfully");
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Create event error:", error);
    return errorResponse(
      "CREATE_ERROR",
      "Failed to create event",
      (error as Error).message,
    );
  }
}

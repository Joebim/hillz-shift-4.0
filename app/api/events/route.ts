import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { queryDocuments, createDocument, queryDocumentsAdvanced, batchUpdateDocuments } from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Event } from "@/src/types/event";
import {
  createEventSchema,
  eventQuerySchema,
} from "@/src/schemas/event.schema";
import { ZodError } from "zod";
import { generateSlug } from "@/src/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const queryParams = Object.fromEntries(searchParams.entries());
    const validated = eventQuerySchema.parse(queryParams);

    const session = await getSession();
    const isAdmin =
      session && ["super_admin", "admin", "editor"].includes(session.role);

    const filters: Record<string, unknown> = {};

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

    const events = await queryDocuments<Event>(
      "events",
      filters,
      "order",
      validated.limit || 100,
    );

    // If order is missing, they might just come in whatever order or by default sort.
    // We can also fallback to startDate in memory if needed, but for now let's rely on Firestore order.

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

    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch events",
      (error as Error).message,
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse("Admin access required");
    }

    const body = await request.json();
    const { orders } = body; // Array of { id: string, order: number }

    if (!Array.isArray(orders)) {
      return errorResponse("INVALID_INPUT", "Expected an array of orders");
    }

    const updates = orders.map((item) => ({
      id: item.id,
      data: { order: item.order },
    }));

    await batchUpdateDocuments("events", updates);

    return successResponse(null, "Event orders updated successfully");
  } catch (error) {
    return errorResponse(
      "UPDATE_ERROR",
      "Failed to update event orders",
      (error as Error).message,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["super_admin", "admin"].includes(session.role)) {
      return unauthorizedResponse("Admin access required");
    }

    const body = await request.json();

    const validated = createEventSchema.parse(body);

    if (!validated.slug) {
      validated.slug = generateSlug(validated.title);
    }

    // If this is set as membership form, unset others
    if (validated.isMembershipForm) {
      const currentMembershipForms = await queryDocumentsAdvanced<Event>("events", (ref) =>
        ref.where("isMembershipForm", "==", true)
      );
      
      const updates = currentMembershipForms.map((e) => ({
        id: e.id,
        data: { isMembershipForm: false },
      }));

      if (updates.length > 0) {
        await batchUpdateDocuments("events", updates);
      }
    }

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

    return errorResponse(
      "CREATE_ERROR",
      "Failed to create event",
      (error as Error).message,
    );
  }
}

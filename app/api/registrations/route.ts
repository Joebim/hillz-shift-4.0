import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { queryDocuments } from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Registration } from "@/src/types/registration";
import { registrationQuerySchema } from "@/src/schemas/registration.schema";
import { ZodError } from "zod";

/**
 * GET /api/registrations
 * List all registrations (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (
      !session ||
      !["super_admin", "admin", "editor"].includes(session.role)
    ) {
      return unauthorizedResponse("Admin access required");
    }

    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryParams = Object.fromEntries(searchParams.entries());
    const validated = registrationQuerySchema.parse(queryParams);

    // Build filters
    const filters: Record<string, any> = {};

    if (validated.eventId) {
      filters.eventId = validated.eventId;
    }

    if (validated.status) {
      filters.status = validated.status;
    }

    if (validated.ticketType) {
      filters.ticketType = validated.ticketType;
    }

    if (validated.checkedIn !== undefined) {
      filters.checkedIn = validated.checkedIn;
    }

    // Query registrations
    const registrations = await queryDocuments<Registration>(
      "registrations",
      filters,
      "registrationDate",
      validated.limit || 100,
    );

    // Filter by search if provided
    let filteredRegistrations = registrations;
    if (validated.search) {
      const searchLower = validated.search.toLowerCase();
      filteredRegistrations = registrations.filter(
        (reg) =>
          reg.attendee.firstName.toLowerCase().includes(searchLower) ||
          reg.attendee.lastName.toLowerCase().includes(searchLower) ||
          reg.attendee.email.toLowerCase().includes(searchLower) ||
          reg.confirmationCode.toLowerCase().includes(searchLower),
      );
    }

    return successResponse(filteredRegistrations);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Fetch registrations error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch registrations",
      (error as Error).message,
    );
  }
}

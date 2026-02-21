import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import { queryDocuments } from "@/src/lib/firebase/firestore";
import { getSession } from "@/src/lib/auth/session";
import { Invitation } from "@/src/types/invitation";
import { invitationQuerySchema } from "@/src/schemas/invitation.schema";
import { ZodError } from "zod";

/**
 * GET /api/invitations
 * List all invitations (admin only)
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
    const validated = invitationQuerySchema.parse(queryParams);

    // Build filters
    const filters: Record<string, unknown> = {};

    if (validated.eventId) {
      filters.eventId = validated.eventId;
    }

    if (validated.status) {
      filters.status = validated.status;
    }

    // Query invitations
    const invitations = await queryDocuments<Invitation>(
      "invitations",
      filters,
      "sentDate",
      validated.limit || 100,
    );

    // Filter by search if provided
    let filteredInvitations = invitations;
    if (validated.search) {
      const searchLower = validated.search.toLowerCase();
      filteredInvitations = invitations.filter(
        (inv) =>
          inv.senderName.toLowerCase().includes(searchLower) ||
          inv.senderEmail.toLowerCase().includes(searchLower) ||
          inv.recipientEmail.toLowerCase().includes(searchLower) ||
          (inv.recipientName &&
            inv.recipientName.toLowerCase().includes(searchLower)),
      );
    }

    return successResponse(filteredInvitations);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    console.error("Fetch invitations error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch invitations",
      (error as Error).message,
    );
  }
}

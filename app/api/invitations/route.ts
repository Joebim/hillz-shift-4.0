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

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (
      !session ||
      !["super_admin", "admin", "editor"].includes(session.role)
    ) {
      return unauthorizedResponse("Admin access required");
    }

    const { searchParams } = new URL(request.url);

    const queryParams = Object.fromEntries(searchParams.entries());
    const validated = invitationQuerySchema.parse(queryParams);

    const filters: Record<string, unknown> = {};

    if (validated.eventId) {
      filters.eventId = validated.eventId;
    }

    if (validated.status) {
      filters.status = validated.status;
    }

    const invitations = await queryDocuments<Invitation>(
      "invitations",
      filters,
      "sentDate",
      validated.limit || 100,
    );

    let filteredInvitations = invitations;
    if (validated.search) {
      const searchLower = validated.search.toLowerCase();
      filteredInvitations = invitations.filter(
        (inv) =>
          inv.senderName.toLowerCase().includes(searchLower) ||
          inv.senderEmail.toLowerCase().includes(searchLower) ||
          (inv.recipientEmail?.toLowerCase().includes(searchLower) ?? false) ||
          (inv.recipientName &&
            inv.recipientName.toLowerCase().includes(searchLower)),
      );
    }

    return successResponse(filteredInvitations);
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }

    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch invitations",
      (error as Error).message,
    );
  }
}

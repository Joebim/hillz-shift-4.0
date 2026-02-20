import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  validationErrorResponse,
} from "@/src/lib/api/response";
import {
  getDocument,
  createDocument,
  updateDocument,
  queryDocuments,
} from "@/src/lib/firebase/firestore";
import { Event } from "@/src/types/event";
import { createInvitationSchema } from "@/src/schemas/invitation.schema";
import { ZodError } from "zod";
import { generateRandomString } from "@/src/lib/utils";
import { sendInvitationEmail } from "@/src/lib/email/send";
import { getSession } from "@/src/lib/auth/session";
import { Invitation } from "@/src/types/invitation"; // Assuming type exists or I use any

/**
 * POST /api/events/[eventId]/invitations
 * Send event invitation (public endpoint)
 */
/**
 * GET /api/events/[eventId]/invitations
 * Get all invitations for an event
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;

    // Simple authentication check - optional depending on requirements
    // const session = await getSession();
    // if (!session) return errorResponse("UNAUTHORIZED", "Unauthorized", null, 401);

    const invitations = await queryDocuments<Invitation>("invitations", {
      eventId,
    });

    return successResponse(invitations, "Invitations fetched successfully");
  } catch (error) {
    console.error("Fetch invitations error:", error);
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch invitations",
      (error as Error).message,
    );
  }
}

/**
 * POST /api/events/[eventId]/invitations
 * Send event invitation (public or admin endpoint)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;
    const body = await request.json();

    // Adapt payload from Admin Modal if necessary
    // Modal sends { name, email }
    if (!body.recipientEmail && body.email) body.recipientEmail = body.email;
    if (!body.recipientName && body.name) body.recipientName = body.name;

    // If sender info missing, try to fill from session
    if (!body.senderName || !body.senderEmail) {
      const session = await getSession();
      if (session) {
        if (!body.senderName) body.senderName = "Admin";
        if (!body.senderEmail)
          body.senderEmail = session.email || "admin@hillzshift.com";
      } else {
        // Fallback if no session and no body (e.g. admin quick action without explicit sender)
        if (!body.senderName) body.senderName = "Hillz Shift Team";
        if (!body.senderEmail) body.senderEmail = "noreply@hillzshift.com";
      }
    }

    // Validate request body
    const validated = createInvitationSchema.parse({
      ...body,
      eventId,
    });

    // Check if event exists
    const event = await getDocument<Event>("events", eventId);
    if (!event) {
      return notFoundResponse("Event not found");
    }

    // Allow admins to send even if not published? Maybe.
    // But let's keep logic strict for now, or relax if needed.
    // User specifically asked to "allow these endpoints".
    // If event status is draft, maybe admin wants to test invites.
    // I will keep the check but maybe warn.
    if (event.status !== "published") {
      // Admin override?
      const session = await getSession();
      const isAdmin =
        session?.role === "admin" || session?.role === "super_admin";
      if (!isAdmin) {
        return errorResponse(
          "EVENT_NOT_PUBLISHED",
          "Cannot send invitations for unpublished events",
          null,
          400,
        );
      }
    }

    // Generate invitation code
    const invitationCode = generateRandomString(24).toUpperCase();

    // Create invitation
    const invitationId = await createDocument("invitations", {
      ...validated,
      invitationCode,
      status: "sent",
      sentDate: new Date(),
    });

    // Update event invitation count
    await updateDocument("events", eventId, {
      invitationCount: (event.invitationCount || 0) + 1,
    });

    // Send invitation email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    // Send email in background
    sendInvitationEmail(
      validated.recipientEmail,
      validated.recipientName,
      validated.senderName,
      event.title,
      invitationCode,
      `${baseUrl}/events/${eventId}`,
    ).catch((err) => console.error("Failed to send invitation email:", err));

    return successResponse(
      {
        id: invitationId,
        invitationCode,
      },
      "Invitation sent successfully",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse((error as ZodError).errors);
    }

    console.error("Send invitation error:", error);
    return errorResponse(
      "INVITATION_ERROR",
      "Failed to send invitation",
      (error as Error).message,
    );
  }
}

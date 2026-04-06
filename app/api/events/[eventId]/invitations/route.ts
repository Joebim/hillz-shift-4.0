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
import { Invitation } from "@/src/types/invitation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;

    const invitations = await queryDocuments<Invitation>("invitations", {
      eventId,
    });

    return successResponse(invitations, "Invitations fetched successfully");
  } catch (error) {
    return errorResponse(
      "FETCH_ERROR",
      "Failed to fetch invitations",
      (error as Error).message,
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;
    const body = await request.json();

    if (!body.recipientEmail && body.email) body.recipientEmail = body.email;
    if (!body.recipientName && body.name) body.recipientName = body.name;

    if (!body.senderName || !body.senderEmail) {
      const session = await getSession();
      if (session) {
        if (!body.senderName) body.senderName = "Admin";
        if (!body.senderEmail)
          body.senderEmail = session.email || "admin@hillzshift.com";
      } else {
        if (!body.senderName) body.senderName = "Hillz Shift Team";
        if (!body.senderEmail) body.senderEmail = "noreply@hillzshift.com";
      }
    }

    const validated = createInvitationSchema.parse({
      ...body,
      eventId,
    });

    const event = await getDocument<Event>("events", eventId);
    if (!event) {
      return notFoundResponse("Event not found");
    }

    if (event.status !== "published") {
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

    const invitationCode = generateRandomString(24).toUpperCase();

    const invitationId = await createDocument("invitations", {
      ...validated,
      invitationCode,
      status: "sent",
      sentDate: new Date(),
    });

    await updateDocument("events", eventId, {
      invitationCount: (event.invitationCount || 0) + 1,
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    if (validated.recipientEmail) {
      sendInvitationEmail(
        validated.recipientEmail,
        validated.recipientName,
        validated.senderName,
        {
          title: event.title,
          isMembershipForm: event.isMembershipForm,
        },
        invitationCode,
        `${baseUrl}/events/${eventId}`,
      ).catch((err) => console.error("Failed to send invitation email:", err));
    }

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

    return errorResponse(
      "INVITATION_ERROR",
      "Failed to send invitation",
      (error as Error).message,
    );
  }
}

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
} from "@/src/lib/firebase/firestore";
import { Event } from "@/src/types/event";
import { createRegistrationSchema } from "@/src/schemas/registration.schema";
import { ZodError } from "zod";
import { generateRandomString } from "@/src/lib/utils";
import { sendRegistrationEmail } from "@/src/lib/email/send";

// Helper to safely convert Firestore Timestamp or string to Date
const toDate = (d: any) =>
  d && typeof d.toDate === "function" ? d.toDate() : new Date(d);

/**
 * POST /api/events/[eventId]/register
 * Register for an event (public endpoint)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const { eventId } = await params;
    const body = await request.json();

    // Validate request body
    const validated = createRegistrationSchema.parse({
      ...body,
      eventId,
    });

    // Check if event exists and registration is open
    const event = await getDocument<Event>("events", eventId);
    if (!event) {
      return notFoundResponse("Event not found");
    }

    if (!event.registrationConfig.enabled) {
      return errorResponse(
        "REGISTRATION_CLOSED",
        "Registration is not enabled for this event",
        null,
        400,
      );
    }

    // Check registration dates
    const now = new Date();
    const openDate = toDate(event.registrationOpenDate);
    const closeDate = toDate(event.registrationCloseDate);

    if (now < openDate) {
      return errorResponse(
        "REGISTRATION_NOT_OPEN",
        "Registration has not opened yet",
        null,
        400,
      );
    }

    if (now > closeDate) {
      return errorResponse(
        "REGISTRATION_CLOSED",
        "Registration has closed",
        null,
        400,
      );
    }

    // Check capacity
    if (
      event.registrationConfig.capacity &&
      event.registrationCount >= event.registrationConfig.capacity
    ) {
      // Add to waitlist
      validated.status = "waitlist";
    }

    // Generate confirmation code
    const confirmationCode = generateRandomString(16).toUpperCase();

    // Create registration
    const registrationId = await createDocument("registrations", {
      ...validated,
      confirmationCode,
      registrationDate: new Date(),
    });

    // Update event registration count
    await updateDocument("events", eventId, {
      registrationCount: event.registrationCount + 1,
    });

    // Send confirmation email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    // Don't block response on email sending, but log errors
    sendRegistrationEmail(
      validated.attendee.email,
      validated.attendee.firstName,
      {
        title: event.title,
        date: toDate(event.startDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      confirmationCode,
      `${baseUrl}/events/${eventId}?code=${confirmationCode}`,
    ).catch((err) => console.error("Failed to send registration email:", err));

    return successResponse(
      {
        id: registrationId,
        confirmationCode,
        status: validated.status,
      },
      "Registration successful",
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse((error as ZodError).errors);
    }

    console.error("Registration error:", error);
    return errorResponse(
      "REGISTRATION_ERROR",
      "Failed to register",
      (error as Error).message,
    );
  }
}
